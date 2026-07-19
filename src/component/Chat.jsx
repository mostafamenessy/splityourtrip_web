/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { db, messaging } from '../firebase';
import { useTranslation } from 'react-i18next';
import { useContextex } from '../context/useContext';
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import axios from "axios";

const TimeStampChange = ({ timestamp }) => {
    const messageTime = timestamp ? timestamp.toDate() : null;

    const formattedTime = messageTime ? (() => {
        const now = new Date();
        const messageDate = new Date(messageTime);

        const isToday = now.toDateString() === messageDate.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === messageDate.toDateString();

        if (isToday) {
            return `Today ${messageDate.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })}`;
        } else if (isYesterday) {
            return `Yesterday ${messageDate.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })}`;
        } else {
            return format(messageDate, 'dd/MM/yyyy hh:mm aa', { locale: enIN });
        }
    })() : "No time available";

    return (
        formattedTime
    );
};

const showNotification = async (senderId) => {
    const Sendername = senderId?.name;
    const reciverId = senderId?.reciverid;
    const SenderText = senderId?.message;

    if (Notification.permission === "granted") {
        try {
            const response = await axios.post('https://onesignal.com/api/v1/notifications', {
                app_id: '53fc4f06-3aca-4a4a-a175-8638a1c52e4e',
                filters: [
                    { field: 'tag', key: 'user_id', value: reciverId }
                ],

                headings: {
                    en: Sendername
                },
                contents: {
                    en: SenderText,
                },
            }, {

                headers: {
                    Authorization: process.env.REACT_APP_ONESIGNAL_REST_API_KEY,
                },
            });
            console.log('Notification sent successfully', response);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    } else {
        console.log("Notification permission not granted.");
    }
};

function Chat({ showPersonList, selectedChatUser, directChatUserNm }) {

    const [users, setUsers] = useState([]);
    const [lsstMsg, setlastMsg] = useState([]);
    const [myChatUsers, setMyChatUsers] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [searchedText, setSearchedText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [, setTime] = useState({ hours: 0, minutes: 0 });
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();
    const uid = localStorage.getItem("uid");
    const { baseUrl, loginUserData } = useContextex();
    const chatBoxBodyref = useRef(null);

    useEffect(() => {
        if (chatBoxBodyref.current) {
            chatBoxBodyref.current.scrollTop = chatBoxBodyref.current.scrollHeight;
        }
    }, [messageList]);

    useEffect(() => {
        const fetchDocumentIds = async () => {
            const db = getFirestore();
            const collectionRef = collection(db, "chat_rooms");

            try {
                const querySnapshot = await getDocs(collectionRef);

                const ids = querySnapshot.docs.map(doc => doc.id);

            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        };

        fetchDocumentIds();
    }, []);

    //***************************** user list ******************** */

    useEffect(() => {
        const UserData = localStorage.getItem('loginUser');
        if (UserData) {

            const Data = JSON.parse(UserData);
            const usersCollection = collection(db, "users");

            const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
                const users = [];
                snapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.uid !== Data?.UserLogin?.id) {
                        users.push(userData);
                    }
                });
                setUsers(users);
                const timer = setTimeout(() => {
                    setLoading(false);
                }, 1000);
                return () => clearTimeout(timer);
            });

            return () => unsubscribe();

        }
    }, []);

    useEffect(() => {
        if (selectedUser?.timestamp) {
            const date = new Date(selectedUser?.timestamp);
            const hours = date.getHours();
            const minutes = date.getMinutes();

            setTime({ hours, minutes });
        }
    }, []);

    // OneSignal Notification Get
    const OneSignalHandle = () => {
        const UserId = localStorage.getItem("uid");

        if (UserId && window.location.hostname === 'propertyweb.cscodetech.cloud') {

            import('react-onesignal').then(({ default: OneSignal }) => {
                OneSignal.init({
                    appId: "53fc4f06-3aca-4a4a-a175-8638a1c52e4e",
                    notifyButton: {
                        enable: true,
                    },
                })
                    .then(() => {
                        return OneSignal.User.addTags({
                            "user_id": UserId,
                        }).then(function (tagsSent) {
                        });
                    })
                    .catch((error) => {
                        console.error("Error initializing OneSignal:", error);
                    });

                OneSignal.Notifications.addEventListener('foregroundWillDisplay', handleNotificationReceived);
            });
        }
    };

    useEffect(() => {
        OneSignalHandle()
    }, [])

    // *************** message userlist ********************

    const handleMyUserData = () => {
        const userData = localStorage.getItem('loginUser');

        if (userData) {
            const { UserLogin } = JSON.parse(userData) || {};
            const { id: userId } = UserLogin || {};

            if (!userId) return;

            const usersCollection = collection(db, 'chat_rooms');

            const fetchLastMessage = async (userData) => {
                const [id1, id2] = userData.split("_");
                const otherId = id1 === userId ? id2 : id2 === userId ? id1 : null;

                if (!otherId) return null;

                const messagesRef = collection(db, "chat_rooms", userData, "message");
                const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

                const snapshot = await getDocs(messagesQuery);
                const messages = snapshot.docs.map(doc => doc.data());
                const lastMessage = messages[messages.length - 1];

                return {
                    otherId,
                    lastMessage: lastMessage ? lastMessage.message : '',
                    timestamp: lastMessage ? lastMessage.timestamp : ''
                };
            };

            const unsubscribe = onSnapshot(usersCollection, async (snapshot) => {
                const users = [];
                const LastMessage = [];

                for (const doc of snapshot.docs) {
                    const userData = doc.id;
                    const user = await fetchLastMessage(userData);
                    if (user) {
                        users.push(user.otherId);
                        LastMessage.push(user);
                    }
                }

                setMyChatUsers(users);
                setlastMsg(LastMessage);
            });

            return () => unsubscribe();
        }
    };

    const handleNotificationReceived = () => {
        handleMyUserData()
    }

    // ********************* chat messages get *********************

    const messageGetUser = selectedChatUser ? selectedChatUser : selectedUser?.uid;

    useEffect(() => {
        const chatRoomId = [messageGetUser, uid]?.sort()?.join("_");
        const messagesRef = collection(db, "chat_rooms", chatRoomId, "message");

        const messagesQuery = query(
            messagesRef,
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const data = [];

            snapshot.forEach((doc) => {
                const messageData = doc.data();
                data.push({
                    ...messageData,
                });
            });
            setMessageList(data);
            handleMyUserData();
        });
        return () => unsubscribe();
    }, [selectedUser, selectedChatUser]);

    const formattedTimestamp = messageList?.map(item => {
        const timestamp = item?.timestamp;
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return format(date, 'hh:mm');
        }
        return null;
    });

    const currentNotificationCheck = () => {
        const date = new Date();
        let hour = date.getHours();
        hour = hour % 12 || 12;
    };

    useEffect(() => {
        currentNotificationCheck();
    }, []);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const userData = localStorage.getItem('loginUser');

            if (userData) {
                const userId = `${selectedChatUser}_${uid}` || `${uid}_${selectedChatUser}`;

                const messagesRef = collection(db, "chats_rooms", userId, "message");
                const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

                // Setting up the snapshot listener for real-time updates
                const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
                    const fetchedMessages = [];

                    snapshot.forEach((doc) => {
                        const messageData = doc.data();
                        const messageTime = messageData.timestamp ? messageData.timestamp.toDate() : null;
                        fetchedMessages.push({
                            ...messageData,
                            timestamp: messageTime,
                        });
                    });

                });

                return () => unsubscribe();
            }
        };

        fetchChatRooms();
    }, [selectedUserId, uid]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const senderId = selectedChatUser ? selectedChatUser : selectedUser?.uid;

        if (inputMessage) {
            try {
                const chatRoomId = await [uid, senderId].sort().join("_");
                const userRef = doc(db, "chat_rooms", chatRoomId);

                // Create or update the chat room
                await setDoc(userRef, {});
                const messagesCollectionRef = collection(userRef, "message");

                const messageData = {
                    message: inputMessage,
                    reciverid: selectedChatUser || selectedUser?.uid,
                    senderName: loginUserData?.UserLogin?.name,
                    senderid: uid,
                    timestamp: new Date(),
                };

                // Add the message to the collection
                addDoc(messagesCollectionRef, messageData)
                    .then((res) => {
                        // Clear the input field
                        const sendData = {
                            name: loginUserData?.UserLogin?.name,
                            reciverid: selectedChatUser || selectedUser?.uid,
                            message: inputMessage
                        }
                        console.log(sendData);

                        showNotification(sendData);
                        setInputMessage('');
                    })
                    .catch((error) => {
                        console.error("Error sending message:", error);
                    });

                // Fetch the recipient's FCM token (you can store this token in Firestore when the user logs in or on token refresh)
                const recipientUserId = selectedChatUser || selectedUser?.uid;
                const userDocRef = doc(db, "users", recipientUserId);

                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const recipientFCMToken = userDocSnapshot.data().token;
                    console.log('recipientFCMToken', recipientFCMToken)
                    if (recipientFCMToken) {
                        const notificationPayload = {
                            notification: {
                                title: `New message from ${loginUserData?.UserLogin?.name}`,
                                body: inputMessage,
                                icon: '/icon.png', // Optional: You can use your app icon here
                            },
                            token: recipientFCMToken,
                        };

                        messaging.send(notificationPayload)
                            .then(response => {
                                console.log("Notification sent successfully:", response);
                            })
                            .catch(error => {
                                console.error("Error sending notification:", error);
                            });
                    } else {
                        console.log("Recipient does not have an FCM token.");
                    }
                }

            } catch (error) {
                console.error("Error sending message:", error);
            }
        } else {
            console.log('Message input is empty.');
        }
    };

    useEffect(() => {
        const filtered = users?.filter((item) => {
            return item?.name.toLowerCase().includes(searchedText.toLowerCase()) && myChatUsers.includes(item.uid);
        });
        setFilteredUsers(filtered);
    }, [searchedText]);

    const handleSearchChange = (event) => {
        setSearchedText(event.target.value);
    };

    const usersFilter = searchedText ? filteredUsers : users;

    return (
        <>

            {(!showPersonList && loading)
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    
                    {!showPersonList && (
                        <div className='d-flex mob-dash flex-col pt-5 pb-5'>
                            <div className='col-10'>
                                <h3>{t('Chat')}</h3>
                                <p className="text-content">{t('We’re glad to see you again')}!</p>
                            </div>
                        </div>
                    )}

                    <div className="message-wrap">
                        {!showPersonList && (
                            <div className="wg-box left">
                                <form className="form-search flex-grow">
                                    <fieldset className="name">
                                        <input type="text" placeholder="Search" className="style-3" name="name" tabindex="2" value={searchedText} onChange={handleSearchChange} aria-required="true" required="" />
                                    </fieldset>
                                    <div className="button-submit style-absolute-left-center">
                                        <button className="style-icon-default" type="submit"><i className="flaticon-magnifiying-glass"></i></button>
                                    </div>
                                </form>

                                <ul className="people">
                                    {usersFilter?.map((item) => {
                                        if (!myChatUsers.includes(item.uid)) return null;

                                        const lastMessage = lsstMsg?.find((msg) => msg?.otherId === item?.uid)?.lastMessage || '';
                                        const lastMsgTime = lsstMsg?.find((msg) => msg?.otherId === item?.uid)?.timestamp || '';

                                        return (
                                            <li
                                                key={item?.id}
                                                className={`person ${selectedUser?.id === item?.id ? 'active' : ''}`}
                                                data-chat={`person${item?.id}`}
                                                onClick={() => {
                                                    setSelectedUser(item);
                                                    setSelectedUserId(item?.id);
                                                }}
                                            >
                                                <div className="list-message">
                                                    <div className="message-item">

                                                        <div className="avt">
                                                            <img
                                                                src={item?.pro_pic === "null" ? '../assets/icon/profile-default.png' : `${baseUrl}${item?.pro_pic}`}
                                                                alt={item?.name || 'Profile'}
                                                            />
                                                        </div>

                                                        <div className="flex justify-between flex-grow relative">
                                                            <div>
                                                                <div className="name">
                                                                    <p>{item?.name}</p>
                                                                </div>
                                                                <div className="sub">{lastMessage.length > 15 ? lastMessage.substring(0, 20) + '...' : lastMessage}</div>
                                                            </div>
                                                            <div className="time">
                                                                <TimeStampChange timestamp={lastMsgTime} />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </li>
                                        );
                                    })}
                                </ul>

                            </div>
                        )}

                        <form className="wg-box right" style={{ minHeight: '50vh' }}>
                            <div className="head">
                                <div className="list-message">
                                    {selectedUser?.name || directChatUserNm ? (
                                        <div className="message-item">
                                            <div className="avt">
                                                <img src="../assets/icon/profile-default.png" alt="" />
                                            </div>
                                            <div className="flex justify-between flex-grow relative">
                                                <div>
                                                    <div className="name">
                                                        <p>{selectedUser?.name || directChatUserNm}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>select User</p>
                                    )}
                                </div>
                            </div>

                            {(selectedUser?.name || selectedChatUser) ? (
                                <div ref={chatBoxBodyref} className={`chat ${selectedUser ? 'active-chat' : ''}`} data-chat={`person${selectedUser?.id}`}>
                                    {messageList?.map((item, index) => (
                                        <>
                                            <div className={item?.senderid === uid ? "list-message style-me" : "list-message"} key={index}>
                                                <div className="message-item">
                                                    <div className="avt">
                                                        <img src="../assets/icon/profile-default.png" alt="" />
                                                    </div>
                                                    <div className="flex justify-between gap5 flex-grow relative">
                                                        <div className={`d-flex flex-column ${item?.senderid === uid ? "align-items-end" : "align-items-start"} `}>
                                                            <div className="name">
                                                                <p>{item?.senderid === uid ? "you" : selectedUser?.name}</p>
                                                            </div>
                                                            <div className="sub">
                                                                <TimeStampChange timestamp={item?.timestamp} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={item?.senderid === uid ? "bubble you style me" : "bubble you style"}>
                                                {item?.message}
                                            </div>
                                        </>
                                    ))}
                                </div>
                            ) : (
                                !showPersonList && (
                                    <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '50vh' }}>
                                        <div >
                                            <h6>Please Select User</h6>
                                        </div>
                                    </div>
                                )
                            )}

                            <div className="write">
                                <input type="text" placeholder="Type a Message" className="style-default" name="name" tabindex="2" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} aria-required="true" required="" />
                                <button className="tf-button-primary btns-send" onClick={handleSendMessage}>Send<i className="icon-arrow-right-add"></i></button>
                            </div>
                        </form>
                    </div>
                </div>}


        </>
    )
}

export default Chat
/* jshint ignore:end */
