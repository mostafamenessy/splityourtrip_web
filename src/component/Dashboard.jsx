/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { IconArrowBackUp, IconCalendarMonth, IconCopy, IconHeart, IconHeartFilled, IconLocation, IconMap2, IconMessage, IconNotification, IconPackage, IconUser, IconWallet } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContextex } from '../context/useContext';

import axios from 'axios';
import Receipt from '../component/Receipt';
import Cancel from '../component/Cancel';

import $ from 'jquery';
import { useTranslation } from 'react-i18next';
import { WalletList } from './WalletList';
import Chat from './Chat';
import { showToast } from '../showTost';

const iconStyle = {
    color: 'red',
};

export const Dashboard = () => {
    const side_bar_data = [
        { name: 'My Booking', icon: IconCalendarMonth, nav: 'my_booking' },
        { name: 'Wallet', icon: IconWallet, nav: 'wallet' },
        { name: 'Profile', icon: IconUser, nav: 'profile' },
        { name: 'My Favorite', icon: IconHeart, nav: 'my_favorite' },
        { name: 'My Package', icon: IconPackage, nav: 'my_package' },
        { name: 'Notification', icon: IconNotification, nav: 'notifications' },
        { name: 'Country', icon: IconMap2, nav: 'country' },
        { name: 'Invite Friends', icon: IconLocation, nav: 'invite_friends' },
        { name: 'Chat', icon: IconMessage, nav: 'chats' },
    ];

    const [, setCurrentUser] = useState(null);

    const [dashboardData, setDashboardData] = useState(null);
    const [isCanvasActive, setIsCanvasActive] = useState(false);
    const [activeName, setActiveName] = useState('My Booking');
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    const { isUserId, baseUrl, currentPage, setCurrentPage, selectedCountryId, showCancelModal, setSelectedCountryId, setCountryListData } = useContextex();

    useEffect(() => {
        setCurrentPage('dash-board');
    }, [currentPage]);

    useEffect(() => {
        var tabs = function () {
            $('.widget-tabs').each(function () {
                $(this).find('.widget-content-tab').children().hide();
                $(this).find('.widget-content-tab').children(".active").show();
                $(this).find('.widget-menu-tab').children('.item-title').on('click', function () {
                    var liActive = $(this).index();
                    var contentActive = $(this).siblings().removeClass('active').parents('.widget-tabs').find('.widget-content-tab').children().eq(liActive);
                    contentActive.addClass('active').fadeIn("slow");
                    contentActive.siblings().removeClass('active');
                    $(this).addClass('active').parents('.widget-tabs').find('.widget-content-tab').children().eq(liActive).siblings().hide();
                });
            });
            $('.widget-tabs-1').each(function () {
                $(this).find('.widget-content-tab-1').children().hide();
                $(this).find('.widget-content-tab-1').children(".active-1").show();
                $(this).find('.widget-menu-tab-1').children('.item-title-1').on('click', function () {
                    var liActive = $(this).index();
                    var contentActive = $(this).siblings().removeClass('active-1').parents('.widget-tabs-1').find('.widget-content-tab-1').children().eq(liActive);
                    contentActive.addClass('active-1').fadeIn("slow");
                    contentActive.siblings().removeClass('active-1');
                    $(this).addClass('active-1').parents('.widget-tabs-1').find('.widget-content-tab-1').children().eq(liActive).siblings().hide();
                });
            });
        };

        return tabs();
    }, []);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {

                let endpoint = '';
                switch (activeName) {
                    case 'My Package':
                        endpoint = 'u_sub_details.php';
                        break;
                    case 'Notification':
                        endpoint = 'notification.php';
                        break;
                    case 'Country':
                        endpoint = 'u_country.php';
                        break;
                    default:
                        break;
                }

                if (!endpoint) return;

                const response = await axios.post(`${baseUrl}user_api/${endpoint}`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setDashboardData(response?.data);
                setLoading(false);

            } catch (err) {
                console.error(err.message);
            }
        };

        fetchDataAsync();
    }, [activeName, isUserId]);


    useEffect(() => {
        setCurrentUser({ id: isUserId });
    }, [isUserId, setCurrentUser]);

    const handleItemClick = (name) => {
        setActiveName(name);
        if (name === "Country") {
            setLoading(true);
        }
    };

    useEffect(() => {
        const defaultCity = dashboardData?.CountryData?.find(country => country?.d_con === 1);
        if (!selectedCountryId) {
            setSelectedCountryId(defaultCity?.id);
        }
    }, [dashboardData]);

    const handleCountryClick = (itemId) => {
        setSelectedCountryId(itemId);
        const selectedCountry = dashboardData?.CountryData?.find(country => country?.id === itemId);
        if (selectedCountry) {
            setCountryListData([selectedCountry]);
        }
    };

    const handleCanvasClick = () => {
        setIsCanvasActive(!isCanvasActive);
    };

    return (
        <>
            <div id="wrapper">
                <div id="page" className="layout-wrap background-F9F9F9">
                    <div className="main-content spacing-20">
                        <div className="layout-wrap-inner">
                            <div className={`section-menu-left ${isCanvasActive ? 'null' : ''}`}>
                                <div className="menu-content">
                                    <ul>

                                        {side_bar_data?.map((item, index) => (
                                            <Link to={`${activeName === 'Dashboard' ? '/dashboard' : `/dashboard/${item.nav}`}`} className='py-0 px-0 mb-3 w-100 ' key={index}>
                                                <li className={`pointer w-100 ${activeName === item?.name ? 'active' : ''}`} onClick={() => { handleItemClick(item.name); setIsCanvasActive(false) }}>
                                                    <a>{<item.icon />}{`${item?.name}`}</a>
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className={`section-content-right remove-mov-tp ${isCanvasActive ? 'full' : ''}`}>

                                {activeName === 'My Booking' && (
                                    <UserBookingSec activeName={activeName} />
                                )}

                                {activeName === 'Profile' && (
                                    <UserProfileSec />
                                )}

                                {activeName === 'My Favorite' && (
                                    <FavoriteList />
                                )}

                                {activeName === 'My Package' && (
                                    <MyPackage dashboardData={dashboardData} />
                                )}

                                {activeName === 'Wallet' && (
                                    <WalletList activeName={activeName} />
                                )}

                                {activeName === 'Notification' && (
                                    <NotificationSec dashboardData={dashboardData} />
                                )}

                                {activeName === 'Country' && (
                                    <>
                                        {loading
                                            ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                                                <div className="middle2"></div>
                                            </div>
                                            : <div className="">
                                                <div className='d-flex mob-dash flex-col pt-5 pb-5'>
                                                    <div className='col-10'>
                                                        <h3>{t('Country')}</h3>
                                                        <div className="text-content">{t('we glade to see you again!')}</div>
                                                    </div>
                                                </div>
                                                <div className="wg-box pl-44 pr-29 min_box_size" >
                                                    <section>
                                                        <div className="cl-container">
                                                            <div className="col-12">
                                                                <div className="wrap">
                                                                    <div style={{ paddingTop: "30px" }} className='flat-cities style-4'>
                                                                        <div className="row col-12">
                                                                            {dashboardData?.CountryData?.map(item => (
                                                                                <div key={item?.id} className={`col-12 pointer col-sm-6 pb-5 col-md-4 col-lg-2 col-xl-2 `} onClick={() => handleCountryClick(item?.id)}>
                                                                                    <div className={`cities-item style-2 wow fadeInUp ${selectedCountryId === item?.id ? 'active-map' : ''}`} data-wow-delay="0.1s">
                                                                                        <img src={`${baseUrl}${item?.img}`} className='w-full h-full object-cover' alt="" />
                                                                                        <div className="content">
                                                                                            <h4>{item?.title}</h4>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>}
                                    </>
                                )}

                                {activeName === 'Invite Friends' && (
                                    <InviteFriendsSec dashboardData={dashboardData} />
                                )}

                                {activeName === 'Chat' && (
                                    <Chat />
                                )}

                            </div>

                            <div className={`btn-canvas ${isCanvasActive ? 'active' : ''}`} onClick={handleCanvasClick}>
                                <span></span>
                                <div className='text-content'>{t('Dashboard Navigation')}</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {showCancelModal && <Cancel url={'u_book_cancle.php'} />}
        </>
    )
}

const FavoriteList = () => {
    const [favList, setFavList] = useState([]);
    const [isLikedProd, setIsLikedProd] = useState(false);
    const [selectedPropId, setSelectedPropId] = useState('');
    const [selectedPropTypeId, setSelectedPropTypeId] = useState('');
    const [isRemove, setIsRemove] = useState(false);
    const [loading, setLoading] = useState(true);

    const { isUserId, baseUrl, selectedId, selectedCountryId, setProductDetailId } = useContextex();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_favlist.php?`, {
                    uid: isUserId,
                    property_type: selectedId,
                    country_id: selectedCountryId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setIsRemove(false)
                setFavList(response?.data?.propetylist || []);
                setLoading(false);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [isUserId, selectedId, selectedCountryId, selectedPropId, isLikedProd, isRemove]);

    useEffect(() => {
        const handleAddToFavorites = async () => {
            if (isRemove) {
                try {
                    const response = await axios.post(`${baseUrl}user_api/u_fav.php?`, {
                        uid: isUserId,
                        pid: selectedPropId,
                        property_type: selectedPropTypeId
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
                    showToast({ title: response?.data?.ResponseMsg, id: toastId });
                    setIsLikedProd(prevIsLiked => !prevIsLiked);
                    setIsRemove(false)
                } catch (err) {
                    console.error(err.message);
                }
            }
        };

        handleAddToFavorites();
    }, [isRemove]);

    const handleItemClick = (item) => {
        const formattedText = item.title.replace(/\s+/g, '-').toLowerCase();
        setProductDetailId(item.id);
        navigate(`/properties/${formattedText}`);
        localStorage.setItem('pid', item?.id);
        localStorage.setItem('formattedText', formattedText);
    };

    const handleFavoriteToggle = (item) => {
        setSelectedPropId(item.id);
        setSelectedPropTypeId(item.property_type);
        setIsRemove(true)
    };

    const renderFavoriteItem = (item) => (
        <li key={item.id}>
            <div className="my-properties-item item">
                <div>
                    <div className="property">
                        <div className="image">
                            <img className="h-100 w-100 object-cover" src={`${baseUrl}${item.image}`} alt={item.title} />
                        </div>
                        <div className="pointer" onClick={() => handleItemClick(item)}>
                            <div className="price">${item.price}</div>
                            <div className="title p-0 m-0">
                                <p>{item.title.substring(0, 15)}</p>
                            </div>
                            <div className="location">
                                <div className="icon">
                                    <i className="flaticon-location"></i>
                                </div>
                                <p>{item.city}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="box-status">{item.rate}</div>
                </div>
                <div>
                    <p>{item.buyorrent === 2 ? 'Buy' : 'Rent'}</p>
                </div>
                <div className="icon pointer" onClick={() => handleFavoriteToggle(item)}>
                    {item.IS_FAVOURITE === 1 ? <IconHeartFilled style={iconStyle} /> : <IconHeart style={iconStyle} />}
                </div>
            </div>
        </li>
    );

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="favorite-list">
                    <div className="d-flex mob-dash flex-col pt-5 pb-5">
                        <div className="col-10">
                            <h3>{t('My Favorite')}</h3>
                            <div className="text-content">{t('We are glad to see you again!')}</div>
                        </div>
                    </div>
                    <div className="wg-box" style={{ overflowY: 'scroll' }}>
                        <div className="table-text-infor default mb-40">

                            <div className="head">
                                <div className="item"><div className="text">{t('Listing Title')}</div></div>
                                <div className="item"><div className="text">{t('Rate')}</div></div>
                                <div className="item"><div className="text">{t('For')}</div></div>
                                <div className="item"><div className="text">{t('Action')}</div></div>
                            </div>

                            <ul>
                                {favList.map(renderFavoriteItem)}
                                {favList?.length === 0 && (
                                    <div style={{ height: "400px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                        <div>
                                            <h4 className='empty-message'>{t('Sorry, Favorite List Empty')}..</h4>
                                        </div>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>}
        </>
    );
};

export const UserProfileSec = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [updatedUserName, setUpdatedUserName] = useState('');
    const [updatedUserPassword, setUpdatedUserPassword] = useState('');
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    const {
        isUserId,
        baseUrl,
        loginUserData,
        setLoginUserData
    } = useContextex();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        handleImageUpload()
        try {
            const response = await axios.post(`${baseUrl}user_api/u_profile_edit.php?`, {
                name: updatedUserName || loginUserData?.UserLogin?.name,
                uid: isUserId,
                password: updatedUserPassword || loginUserData?.UserLogin?.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data?.UserLogin) {

                const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
                showToast({ title: response?.data?.ResponseMsg, id: toastId });

                const updatedUser = response?.data;
                setLoginUserData(updatedUser);
                localStorage.setItem('loginUser', JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error(err.message);
        }
    };


    const handleImageUpload = async () => {
        if (!selectedFile) {
            console.error('No file selected.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            const response = await axios.post(`${baseUrl}user_api/pro_image.php`, {
                uid: isUserId,
                img: selectedFile
            });

            if (response?.data?.ResponseCode === 200) {
                localStorage.setItem('loginUser', JSON.stringify(response?.data));
            }

            const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });
            setSelectedFile(null);

        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setSelectedFile(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        }
    };

    const renderProfileImage = () => {
        const userAvatar = loginUserData?.UserLogin?.pro_pic;
        const defaultAvatar = '../assets/icon/profile-default.png';

        const imageSrc = selectedFile
            ? `data:image/jpeg;base64,${selectedFile}`
            : userAvatar
                ? `${baseUrl}${userAvatar}`
                : defaultAvatar;

        return <img className='h-100 w-100' src={imageSrc} alt="Avatar" />;
    };

    return (
        <>

            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className='d-flex flex-col mob-dash pt-5 pb-5'>
                        <div className='col-10'>
                            <h3>{t('Profile')}</h3>
                            <div className="text-content">{t('We are glad to see you again!')}</div>
                        </div>
                    </div>

                    <div className="wg-box pl-44 mb-20" style={{ overflowY: 'auto' }}>
                        <h4>{t('Profile Information')}</h4>
                        <div className="my-profiles-wrap">
                            <div className="avatar-image mob-profile">
                                <div className="left">
                                    {renderProfileImage()}
                                </div>
                                <div className="right ">
                                    <label className="uploadfile mob-profile">
                                        <input
                                            type={selectedFile ? 'text' : 'file'}
                                            className='pointer'
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <div
                                            className="tf-button-primary d-flex align-items-center"
                                        >
                                            {selectedFile ? 'Update Profile' : 'Edit Image'}
                                            <i className="flaticon-upload-1"></i>
                                        </div>
                                        <p className="file-name">
                                            {t('Max file size is 1MB, Minimum dimension: 330x300, and Suitable files are .jpg & .png')}
                                        </p>
                                    </label>
                                </div>
                            </div>

                            <form className="form-profiles flex gap30 flex-column " onSubmit={handleUpdateProfile}>
                                <div className="cols">
                                    <fieldset className="name has-top-title">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            required
                                            onChange={(e) => setUpdatedUserName(e.target.value)}
                                            value={updatedUserName || loginUserData?.UserLogin?.name}
                                        />
                                        <label htmlFor="">{t('Username')}</label>
                                    </fieldset>
                                    <fieldset className="password has-top-title">
                                        <input
                                            type="text"
                                            placeholder="Update Password"
                                            required
                                            onChange={(e) => setUpdatedUserPassword(e.target.value)}
                                            value={updatedUserPassword || loginUserData?.UserLogin?.password}
                                        />
                                        <label htmlFor="">{t('Old Password')}</label>
                                    </fieldset>
                                </div>

                                <div className="cols">
                                    <fieldset className="email has-top-title">
                                        <input style={{ border: "1px solid black" }}
                                            disabled
                                            type="email"
                                            placeholder="Email"
                                            name="email"
                                            value={loginUserData?.UserLogin?.email}
                                            required
                                        />
                                        <label htmlFor="">{t('Email')}</label>
                                    </fieldset>

                                    <fieldset className="phone has-top-title">
                                        <input style={{ border: "1px solid black" }}
                                            disabled
                                            type="tel"
                                            placeholder="Phone"
                                            name="number"
                                            value={loginUserData?.UserLogin?.mobile}
                                            required
                                        />
                                        <label htmlFor="">{t('Number')}</label>
                                    </fieldset>

                                </div>

                                <div className="button-submit mt-10">
                                    <button className="tf-button-primary" type="submit">
                                        {t('Save Profile')}<i className="icon-arrow-right-add"></i>
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>}

        </>
    );
};

export const UserBookingSec = ({ activeName }) => {
    const [showReceiptTab, setShowReceiptTab] = useState(false);
    const [activeTab, setActiveTab] = useState('active');
    const [bookingData, setBookingData] = useState([]);
    const [droppedReview, setDroppedReview] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalCards, setTotalCards] = useState(0);
    const [fullData, setFullData] = useState([]);
    const [loading, setLoading] = useState(true);

    const DatalodRef = useRef(false);
    const { t } = useTranslation();
    const { isUserId, baseUrl, setBookingId, setShowCancelModal } = useContextex();

    useEffect(() => {
        fetchCountryDataAsync();
    }, []);

    const fetchCountryDataAsync = async () => {
        try {
            const response = await axios.post(`${baseUrl}user_api/u_book_status_wise.php?`, {
                uid: isUserId,
                status: activeTab
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data?.ResponseCode === '200') {
                const all = response?.data?.statuswise || [];
                setFullData(all);
                setTotalCards(all.length);
                setBookingData(all.slice(0, 10));
                setCurrentIndex(5);
            }
            setLoading(false);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = window.innerHeight;

            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (isAtBottom && !DatalodRef.current && !loading) {
                DatalodRef.current = true;
                if (bookingData.length < totalCards) {
                    const nextItems = fullData.slice(currentIndex, currentIndex + 10);
                    setBookingData(prev => [...prev, ...nextItems]);
                    setCurrentIndex(prev => prev + 10);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [bookingData, currentIndex, fullData, totalCards]);

    useEffect(() => {
        DatalodRef.current = false;
    }, [bookingData]);

    useEffect(() => {
        setBookingData([]);
        setFullData([]);
        setCurrentIndex(0);
        setTotalCards(0);
        fetchCountryDataAsync();
    }, [activeTab]);


    useEffect(() => {
        if (activeName === 'My Booking' && activeTab === 'completed') {
            setDroppedReview(true);
        } else {
            setDroppedReview(false);
        }
    }, [activeName, activeTab]);

    const handleBackButton = () => {
        setShowReceiptTab(false)
    };

    const handleReceiptClick = (bookId) => {
        setBookingId(bookId);
        setShowReceiptTab(true);
    };

    const handleCancelClick = (bookId) => {
        setBookingId(bookId);
        setShowCancelModal(prev => !prev);
        setCanceled(true)
    };

    const renderBackButton = () => (
        <div onClick={handleBackButton}>
            <Link to='/dashboard'>
                <button onClick={() => setShowReceiptTab(false)} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px] flex items-center gap-[10px]'>{t('Back')} <IconArrowBackUp /></button>
            </Link>
        </div>
    );

    const renderBookingItem = (item, index) => (
        <li key={index}>
            <div className="my-properties-item item">
                <div>
                    <div className="property">
                        <div className="image booking-image">
                            <img src={`${baseUrl}${item.prop_img}`} alt={item.prop_title} />
                        </div>
                        <div>
                            <div className="price">${item.prop_price}</div>
                            <div className="title">
                                <p>{item.prop_title}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p>{item.total_day} {t('Days')}</p>
                </div>
                <div>
                    <div className="box-status">{item.book_status}</div>
                </div>
                <div>
                    <p>{item.p_method_id === '2' ? 'Unpaid' : 'Paid'}</p>
                </div>
                <div>
                    <ul className="wg-icon justify-center" style={{ gap: '0' }}>
                        {activeTab === 'active' && (
                            <>
                                {item.book_status === "Booked" &&
                                    <p className="cursor-pointer tf-button-primary mx-1" style={{ backgroundColor: "#ff000099", gap: '0' }} onClick={() => handleCancelClick(item.book_id)}>
                                        {t('Cancel')}
                                    </p>
                                }
                                <p className="cursor-pointer tf-button-primary style-black active" style={{ gap: '0' }} onClick={() => handleReceiptClick(item.book_id)}>
                                    {t('Receipt')}
                                </p>
                            </>
                        )}
                        {activeTab === 'completed' && (
                            <p className="cursor-pointer tf-button-primary style-black active" style={{ gap: '0' }} onClick={() => handleReceiptClick(item.book_id)}>
                                {t('Receipt')}
                            </p>
                        )}
                    </ul>
                </div>
            </div>
        </li>
    );

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className='d-flex flex-col col-12 mob-dash pt-5 pb-5'>
                        <div className='col-sm-9 col-6 col-xs-9 col-md-8 col-lg-10 '>
                            <h3>{t('My Booking')}</h3>
                            <div className="text-content">{t('We are glad to see you again!')}</div>
                        </div>

                        {showReceiptTab && activeName === 'My Booking' && renderBackButton()}
                    </div>

                    <div className="wg-box pl-44 pr-29" >
                        {showReceiptTab && activeName === 'My Booking' ? (
                            <Receipt droppedReview={droppedReview} setDroppedReview={setDroppedReview} />
                        ) : (
                            <div className="table-listing-properties mb-40">
                                <div className="widget-tabs style-2">
                                    <ul className="widget-menu-tab">
                                        <li className={`item-title ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
                                            <span className="inner">{t('Active')}</span>
                                        </li>
                                        <li className={`item-title ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
                                            <span className="inner">{t('Completed')}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="head">
                                    <div className="item"><div className="text">{t('Listing Title')}</div></div>
                                    <div className="item"><div className="text">{t('Total Days')}</div></div>
                                    <div className="item"><div className="text">{t('Status')}</div></div>
                                    <div className="item"><div className="text">{t('P_Status')}</div></div>
                                    <div className="item"><div className="text">{t('Action')}</div></div>
                                </div>
                                <ul>
                                    {bookingData.map(renderBookingItem)}
                                    {bookingData?.length === 0 && (
                                        <div style={{ height: "350px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                            <div>
                                                <h4 className='empty-message'>{t('Go & Book your favorite service')}</h4>
                                            </div>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>}

        </>
    );
};

export const InviteFriendsSec = () => {
    const [dashboardData, setDashboardData] = useState(null)

    const { userCurrency, isUserId, baseUrl } = useContextex();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchReferDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_getdata.php?`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setDashboardData(response?.data)
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchReferDataAsync();
    }, [isUserId]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast({ title: 'Text copied to clipboard', id: "success" });
            })
            .catch(err => {
                showToast({ title: 'Failed to copy text!', id: "error" });
            });
    }

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className='d-flex mob-dash flex-col pt-5 pb-5'>
                        <div className='col-10'>
                            <h3>{t('Invite Friends')}</h3>
                            <div className="text-content">{t('we glade to see you again!')}</div>
                        </div>
                    </div>
                    <div className="wg-box pl-44 pr-29" style={{ minHeight: '100vh' }}>
                        <section className="tf-section mt-21 work-with-us style-2 pt-0">
                            <div className="cl-container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="heading-section text-center">
                                            <h2 className="wow fadeInUp">{t('Earn')} {userCurrency}{dashboardData?.refercredit} {t('for')} </h2>
                                            <h2 className="text wow fadeInUp"> {t('Each Friend you refer')}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-center ">
                                    <div className="col-xl-10 mb-50">
                                        <div className="wrap ">
                                            <div className="box-icon style-1 wow fadeInUp">
                                                <div className="icon has-ellipse">
                                                    <i className="flaticon-house-1"></i>
                                                </div>
                                                <div className="content">
                                                    <p className="title">{t('Share referral link')}</p>
                                                    <p>{t('Share the referral link')} <br /> {t('with your friends')}.</p>
                                                </div>
                                            </div>
                                            <div className="box-icon style-1 wow fadeInUp" data-wow-delay="0.1s">
                                                <div className="icon has-ellipse">
                                                    <i className="flaticon-home"></i>
                                                </div>
                                                <div className="content">
                                                    <p className="title">{t(`Friend's Referral Bonus`)}</p>
                                                    <p>{t('Friends get')} {userCurrency}{dashboardData?.refercredit} {t('on their  first')}<br /> {t('complate transaction')}.</p>
                                                </div>
                                            </div>
                                            <div className="box-icon style-1 wow fadeInUp" data-wow-delay="0.2s">
                                                <div className="icon has-ellipse">
                                                    <i className="flaticon-shield"></i>
                                                </div>
                                                <div className="content">
                                                    <p className="title">{t('You Got')}</p>
                                                    <p>{t('You get')} {userCurrency}{dashboardData?.signupcredit} {t('on your wallet')} .</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <form className='justify-center row w-50 mt-21'>
                                        <div className="bottom flex align-items-center w-100 justify-content-center">
                                            <div className="flex gap20 flex-grow flex-row w-100">
                                                <div className="input-search relative w-100">
                                                    <fieldset className="name">
                                                        <input
                                                            type="text"
                                                            disabled
                                                            placeholder={dashboardData?.code || ''}
                                                            className=""
                                                            name="name"
                                                            tabIndex="2"
                                                            value={dashboardData?.code || ''}
                                                            aria-required="true"
                                                            required
                                                        />
                                                    </fieldset>
                                                    <div className="button-submit style-absolute-right-center">
                                                        <button
                                                            className="style-icon-default"
                                                            type="button"
                                                            onClick={() => handleCopy(dashboardData?.code || '')}
                                                        >
                                                            <IconCopy />
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </section>
                    </div>
                </div>}
        </>
    )
}

export const NotificationSec = ({ dashboardData }) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className='d-flex mob-dash flex-col pt-5 pb-5'>
                        <div className='col-10'>
                            <h3>{t('Notification')}</h3>
                            <p className="text-content">{t('We’re glad to see you again')}!</p>
                        </div>
                    </div>
                    <div className="wg-box pl-44 pr-29">
                        <div className="table-text-infor default mb-40">
                            <div className="head d-flex justify-content-between">
                                <div className="item">
                                    <div className="text">{t('Title')}</div>
                                </div>
                                <div className="item" >
                                    <div className="text float-end">{t('Date&Time')}</div>
                                </div>
                            </div>

                            <ul>
                                {dashboardData?.NotificationData?.map((item, index) => (
                                    <li key={index}>
                                        <div className="text-infor-item ">
                                            <div className="item">
                                                <div className="title">{item?.title}</div>
                                                <p>{item?.description}</p>
                                            </div>
                                            <div className="item">
                                                <p className=' float-end'>{item?.datetime}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                {dashboardData?.NotificationData?.length === 0 && (
                                    <div style={{ height: "400px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                        <div>
                                            <h4 className='empty-message'>{t('No Any Notification Available')}</h4>
                                        </div>
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>}

        </>
    )
}

export const MyPackage = ({ dashboardData }) => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return <>

        {loading
            ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                <div className="middle2"></div>
            </div>
            : <div className="">
                <div className='d-flex mob-dash flex-col pt-5 pb-5'>
                    <div className='col-10'>
                        <h3>{t('My Package')}</h3>
                        <div className="text-content">{t('We are glad to see you again!')}</div>
                    </div>
                </div>

                <div className="wg-box pl-44 pr-29" style={{ height: '100vh', overflowY: 'auto' }}>

                    <div className="table-text-infor default mb-40">
                        <div className="head">
                            <div className="item">
                                <div className="text">{t('Order ID')}</div>
                            </div>
                            <div className="item">
                                <div className="text">{t('Package')}</div>
                            </div>
                            <div className="item">
                                <div className="text">{t('Amount')}</div>
                            </div>
                            <div className="item">
                                <div className="text">{t('Expire Date')}</div>
                            </div>
                            <div className="item">
                                <div className="text">{t('Payment Mode')}</div>
                            </div>
                            <div className="item">
                                <div className="text">{t('Days')}</div>
                            </div>
                        </div>
                        <ul>
                            {dashboardData?.Subscribedetails?.map((item, index) => (
                                <li key={index}>
                                    <div className="text-infor-item item">
                                        <div>
                                            <div className="title">{item?.trans_id}</div>
                                        </div>
                                        <div>
                                            <p>{item?.plan_title}</p>
                                        </div>
                                        <div>
                                            <p>${item?.amount}</p>
                                        </div>
                                        <div>
                                            <p>{item?.expire_date}</p>
                                        </div>
                                        <div>
                                            <p>{item?.p_name}</p>
                                        </div>
                                        <div>
                                            <div className="box-status">{item?.day}</div>
                                        </div>
                                    </div>
                                </li>
                            ))}

                            {dashboardData?.Subscribedetails?.length === 0 && (
                                <div style={{ height: "400px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                    <div>
                                        <h4 className='empty-message'>{t('No Any Package Data Available')}</h4>
                                    </div>
                                </div>
                            )}

                        </ul>
                    </div>
                </div>
            </div>}
    </>
}

/* jshint ignore:end */