/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { useEffect, useRef, useState } from 'react';
import { useAuth, useContextex } from '../context/useContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { uid } from 'uid';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, RecvestToken } from '../firebase';
import PhoneInput, { formatPhoneNumberIntl } from "react-phone-number-input";
import { showToast } from '../showTost';

const firebaseAddUser = async () => {

    const UserData = JSON.parse(localStorage.getItem("loginUser"));
    if (UserData) {
        const Data = UserData;
        const usersCollection = collection(db, "users");
        const token = await RecvestToken();

        const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
            const users = [];
            let userExists = false;

            snapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.uid !== Data?.UserLogin?.id) {
                    users.push(userData);
                } else {
                    userExists = true;
                }
            });

            if (!userExists && token) {
                const userDocRef = doc(usersCollection, Data.UserLogin?.id);

                setDoc(userDocRef, {
                    isOnline: false,
                    uid: Data.UserLogin?.id,
                    pro_pic: Data.UserLogin?.pro_pic,
                    token: token,
                    name: Data.UserLogin?.name,
                });
            }
        });

        return () => unsubscribe();
    }
};

function RegistrationPage({ otpType, isAuth }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [registerUser, setRegisterUser] = useState({
        name: '',
        email: '',
        password: '',
        refercode: ''
    });
    const [validNumberData, setValidNumberData] = useState(null);
    const [checkNumber, setCheckNumber] = useState(null);
    const [otpSend, setOtpSend] = useState(false);
    const [, setResendOtp] = useState(false);
    const [otpValue, setOtpValue] = useState(Array.from({ length: 6 }, () => ''));
    const [sendOtpReq, setSendOtpReq] = useState(false);
    const [isCalled, setIsCalled] = useState(false);
    const [varifyMobileDt, setVarifyMobileDt] = useState(null)
    const [userOtp, setUserOtp] = useState('');
    const [passtype, setPassType] = useState("password");
    const [errors, setErrors] = useState({
        name: '',
        password: '',
        email: '',
        phoneNumber: ''
    });
    const [registerUserData, setRegisterUserData] = useState([])

    const navigate = useNavigate();
    const { register } = useAuth();
    const { t } = useTranslation();
    const { setRegisterModal, registrData, setLoginData, setIsUser, setUserCurrency, setLoginModal, baseUrl } = useContextex();
    const inputRefs = useRef(Array.from({ length: 6 }, () => null));
    const InputRef = useRef();

    let concatenatedOtp = otpValue.join('');

    useEffect(() => {
        if (registerUserData?.UserLogin) {
            const { id, currency } = registerUserData?.UserLogin;
            localStorage.setItem('uid', id);
            setIsUser(id);
            setUserCurrency(currency ? currency : '$');
            setLoginData(registerUserData);
        }
    }, [registerUserData, registrData, setIsUser, setUserCurrency, setLoginData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeOtp = (index, value) => {
        const updatedOtpValue = [...otpValue];
        updatedOtpValue[index] = value;
        setOtpValue(updatedOtpValue);
        if (value && !isNaN(value) && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const FormattedNumber = formatPhoneNumberIntl(phoneNumber);
    const countryCallingCode = FormattedNumber.split(" ")[0];
    const mobileNumber = FormattedNumber.split(" ").slice(1);

    useEffect(() => {
        if (isCalled && varifyMobileDt && varifyMobileDt.ResponseMsg) {
            setValidNumberData(varifyMobileDt.ResponseMsg);
            if (varifyMobileDt.ResponseMsg === 'New Number!') {

            } else {
                showToast({ title: "Mobile Number Already Exist", id: "error" });
                setIsCalled(false);
            }
        }
    }, [varifyMobileDt, isCalled]);

    useEffect(() => {
        const fetchDataAndSetCategories = async () => {
            if (((sendOtpReq || validNumberData === 'New Number!') && checkNumber && isAuth === "Yes")) {
                try {
                    const mobileNumber = phoneNumber;
                    const requestType = otpType === 'Twilio' ? 'twilio_otp' : 'msg_otp'

                    const response = await axios.post(`${baseUrl}user_api/${requestType}.php?`, {
                        mobile: mobileNumber
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response?.data?.ResponseCode === '200') {
                        setUserOtp(response?.data)
                        setOtpSend(true)
                    }

                    setResendOtp(false);

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchDataAndSetCategories();
    }, [sendOtpReq, checkNumber, validNumberData]);

    const validateInputs = () => {
        const newErrors = { name: '', email: '', password: '', phoneNumber: '' };

        let isValid = true;

        if (!registerUser.name) {
            newErrors.name = "Please Enter Your Name";
            showToast({ title: "Please enter your name !!", id: "error" });
            isValid = false;
        }
        if (registerUser.password.length < 3) {
            newErrors.password = "Password must be at least 3 characters long";
            showToast({ title: "Password must be at least 3 characters long !!", id: "error" });
            isValid = false;
        }
        if (!registerUser.email) {
            newErrors.email = "Please Enter Your Email";
            showToast({ title: "Please enter your email !!", id: "error" });
            isValid = false;
        }
        if (!phoneNumber) {
            newErrors.phoneNumber = "Phone number can't be null";
            showToast({ title: "Please enter number !!", id: "error" });
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const resetForm = () => {
        setPhoneNumber('');
        setRegisterUser({
            name: '',
            email: '',
            password: ''
        });
        setUserOtp('');
        setSendOtpReq('');
        setOtpValue('');
        setResendOtp('');
        setValidNumberData(null);
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }

        const FormattedNumber = formatPhoneNumberIntl(phoneNumber);
        const countryCallingCode = FormattedNumber.split(" ")[0];
        const mobileNumber = FormattedNumber.split(" ").slice(1);

        if (!validateInputs()) return;
        const stringNumber = userOtp?.otp?.toString();

        try {
            if (stringNumber === concatenatedOtp || isAuth === "No") {
                const response = await axios.post(`${baseUrl}user_api/u_reg_user.php?`, {
                    name: registerUser.name,
                    email: registerUser.email,
                    mobile: mobileNumber.join(""),
                    ccode: countryCallingCode,
                    password: registerUser.password,
                    refercode: registerUser.refercode || ""
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
                showToast({ title: response?.data?.ResponseMsg, id: toastId });

                if (response?.data?.ResponseCode === '200') {

                    await setRegisterUserData(response?.data);
                    const authToken = registerUserData.token || uid(32);
                    await localStorage.setItem('isPackBuy', response?.data?.UserLogin?.is_subscribe);
                    await localStorage.setItem('loginUser', JSON.stringify(response?.data));
                    await localStorage.setItem('authToken', authToken);
                    await localStorage.setItem('uid', response?.data?.UserLogin?.id);

                    if (registerUserData) {
                        firebaseAddUser();
                    }

                    resetForm();
                    setRegisterModal(false);
                    setLoginModal(false);
                    setValidNumberData('');

                    register(authToken);
                    window.location.href = "/";

                    setRegisterUser('');
                }

            } else {
                showToast({ title: "Passwords don't match.", id: "error" });
            }

        } catch (error) {
            console.error("Error during registration:", error);
        }

    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && index > 0 && !event.target.value) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleCheck = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        try {
            const response = await axios.post(`${baseUrl}user_api/mobile_check.php?`, {
                mobile: mobileNumber.join(""),
                ccode: countryCallingCode
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            await setCheckNumber(true);
            setIsCalled(true);

            console.log("Mobile Check api => ", response.data);

            if (response?.data?.ResponseCode === '200') {
                if (isAuth === "Yes") {
                    showToast({ title: "Otp Send Successfull", id: "success" });
                    setIsCalled(false);
                } else {
                    setIsCalled(false);
                    handleSubmit();
                }
            } else {
                showToast({ title: response?.data?.ResponseMsg, id: "error" });
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleResetOtp = async (e) => {
        e.preventDefault();

        try {
            const mobileNumber = phoneNumber;
            const requestType = otpType === 'Twilio' ? 'twilio_otp' : 'msg_otp'
            const response = await axios.post(`${baseUrl}user_api/${requestType}.php?`, {
                mobile: mobileNumber
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response?.data?.ResponseCode === '200') {
                setUserOtp(response?.data)
            }

            setResendOtp(false);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <div className="py-[10px] px-[15px]">
                <h3>{t('Create an account')}</h3>
                <div className="mt-[10px]">
                    {validNumberData === 'New Number!' && otpSend ? <div className="">
                        <div className="otp-field mb-4">
                            <p>*{t('Enter Your Otp Value')}</p>
                            <div className="flex items-center justify-center gap-[10px]">
                                {inputRefs.current.map((ref, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        maxLength={1}
                                        value={otpValue[index]}
                                        onChange={(e) => handleChangeOtp(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        style={{ height: '50px', width: '50px' }}
                                        className='m-1 border-[1px] rounded-[10px] outline-none text-center text-[17px]'
                                    />
                                ))}
                            </div>
                            <p className='mt-2'>{t(`Didn't receive code`)}?<span onClick={handleResetOtp} className='text-primary pointer'>{t('Resend New Code')}</span></p>
                        </div>
                    </div>
                        : <div className="">

                            <div className={`flex items-center gap-[10px] border ${errors.name && "border-danger"} py-[15px] px-[18px] rounded-[12px] mb-[5px]`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.009 10.75C9.66503 10.75 7.75903 8.843 7.75903 6.5C7.75903 4.157 9.66503 2.25 12.009 2.25C14.353 2.25 16.259 4.157 16.259 6.5C16.259 8.843 14.353 10.75 12.009 10.75ZM12.009 3.75C10.492 3.75 9.25903 4.983 9.25903 6.5C9.25903 8.017 10.492 9.25 12.009 9.25C13.526 9.25 14.759 8.017 14.759 6.5C14.759 4.983 13.525 3.75 12.009 3.75ZM15.9969 21.75H8.00305C5.58305 21.75 4.25 20.425 4.25 18.019C4.25 15.358 5.756 12.25 10 12.25H14C18.244 12.25 19.75 15.357 19.75 18.019C19.75 20.425 18.4169 21.75 15.9969 21.75ZM10 13.75C6.057 13.75 5.75 17.017 5.75 18.019C5.75 19.583 6.42405 20.25 8.00305 20.25H15.9969C17.5759 20.25 18.25 19.583 18.25 18.019C18.25 17.018 17.943 13.75 14 13.75H10Z" fill="#25314C" />
                                </svg>
                                <input type="text" name='name' value={registerUser.name} onChange={handleChange} className="w-full text-[15px] outline-none" placeholder="Full Name" />
                            </div>

                            <div className={`flex items-center gap-[10px] border ${errors.email && "border-danger"} py-[15px] px-[18px] mt-[10px] rounded-[12px] mb-[5px]`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 20.75H6C3.582 20.75 2.25 19.418 2.25 17V8C2.25 5.582 3.582 4.25 6 4.25H18C20.418 4.25 21.75 5.582 21.75 8V17C21.75 19.418 20.418 20.75 18 20.75ZM6 5.75C4.423 5.75 3.75 6.423 3.75 8V17C3.75 18.577 4.423 19.25 6 19.25H18C19.577 19.25 20.25 18.577 20.25 17V8C20.25 6.423 19.577 5.75 18 5.75H6ZM13.0291 13.179L17.9409 9.60699C18.2759 9.36399 18.35 8.89401 18.106 8.55901C17.863 8.22501 17.3951 8.149 17.0581 8.394L12.146 11.966C12.058 12.03 11.941 12.03 11.853 11.966L6.94092 8.394C6.60292 8.149 6.13607 8.22601 5.89307 8.55901C5.64907 8.89401 5.72311 9.36299 6.05811 9.60699L10.97 13.18C11.278 13.404 11.639 13.515 11.999 13.515C12.359 13.515 12.7221 13.403 13.0291 13.179Z" fill="#25314C" />
                                </svg>
                                <input type="text" name='email' value={registerUser.email} onChange={handleChange} className={`w-full text-[15px] outline-none`} placeholder="Email Address" />
                            </div>

                            <div className={`flex items-center gap-[10px] border relative ${errors.phoneNumber && "border-danger"} py-[15px] px-[18px] mt-[10px] rounded-[12px] mb-[5px]`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.5521 21.752C16.0931 21.752 15.6311 21.69 15.1751 21.565C9.01011 19.873 4.12909 14.995 2.43609 8.83402C2.05109 7.43302 2.26204 5.97301 3.03204 4.72501C3.80504 3.47101 5.0761 2.58601 6.5191 2.29801C7.4791 2.10601 8.4281 2.53401 8.9151 3.35501L10.4781 5.995C11.2371 7.277 10.86 8.928 9.61896 9.754L8.4881 10.506C9.5451 12.676 11.3229 14.459 13.4839 15.515L14.2462 14.378C15.0772 13.139 16.7281 12.768 18.0091 13.531L20.6522 15.107C21.4702 15.595 21.8931 16.55 21.7071 17.482C21.4191 18.925 20.5341 20.196 19.2811 20.969C18.4391 21.487 17.5021 21.752 16.5521 21.752ZM6.97809 3.75C6.92909 3.75 6.87911 3.75502 6.83111 3.76502C5.77711 3.97602 4.86412 4.611 4.31012 5.512C3.76112 6.402 3.61009 7.44101 3.88409 8.43601C5.43709 14.089 9.91608 18.566 15.5721 20.118C16.5681 20.391 17.604 20.239 18.493 19.691C19.393 19.136 20.0291 18.222 20.2361 17.186C20.2981 16.875 20.1571 16.556 19.8831 16.393L17.241 14.817C16.646 14.463 15.878 14.636 15.492 15.211L14.377 16.876C14.177 17.174 13.7911 17.288 13.4651 17.15C10.5021 15.911 8.09113 13.495 6.85113 10.521C6.71313 10.189 6.82899 9.807 7.12799 9.608L8.78912 8.50299C9.36512 8.11999 9.54007 7.353 9.18707 6.758L7.62408 4.11899C7.48708 3.88699 7.23909 3.75 6.97809 3.75Z" fill="#25314C" />
                                </svg>
                                <PhoneInput
                                    className="w-[100%] text-[17px]"
                                    ref={InputRef}
                                    international
                                    defaultCountry="IN"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    name="phone"
                                    style={{ outline: "none" }}
                                />
                                {!phoneNumber && <span onClick={() => InputRef.current.focus()} className='absolute text-[16px] top-[20px] left-[100px] text-gray-500'>{t("Mobile number")}</span>}
                            </div>

                            <div className={`flex items-center gap-[10px] border ${errors.password && "border-danger"} py-[15px] px-[18px] mt-[10px] rounded-[12px] mb-[5px]`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 8.25H8.75V7C8.75 6.139 9.08905 5.3201 9.69604 4.7041C10.32 4.0891 11.138 3.75 12 3.75C13.485 3.75 14.778 4.75106 15.144 6.18506C15.246 6.58606 15.6599 6.82705 16.0549 6.72705C16.4569 6.62405 16.6999 6.21594 16.5969 5.81494C16.0629 3.71594 14.172 2.25 12 2.25C10.742 2.25 9.55099 2.74204 8.63599 3.64404C7.74199 4.55004 7.25 5.742 7.25 7V8.30396C5.312 8.56096 4.25 9.846 4.25 12V18C4.25 20.418 5.582 21.75 8 21.75H16C18.418 21.75 19.75 20.418 19.75 18V12C19.75 9.582 18.418 8.25 16 8.25ZM18.25 18C18.25 19.577 17.577 20.25 16 20.25H8C6.423 20.25 5.75 19.577 5.75 18V12C5.75 10.423 6.423 9.75 8 9.75H16C17.577 9.75 18.25 10.423 18.25 12V18ZM13.27 14C13.27 14.412 13.058 14.7601 12.75 14.9871V17C12.75 17.414 12.414 17.75 12 17.75C11.586 17.75 11.25 17.414 11.25 17V14.9619C10.962 14.7329 10.7649 14.395 10.7649 14C10.7649 13.31 11.32 12.75 12.01 12.75H12.02C12.71 12.75 13.27 13.31 13.27 14Z" fill="#25314C" />
                                </svg>
                                <input type={passtype} name='password' value={registerUser.password} onChange={handleChange} className={`w-[90%] text-[15px] outline-none`} placeholder="Password" />
                                <button onClick={() => passtype === "password" ? setPassType("text") : setPassType("password")}>
                                    {passtype === "password"
                                        ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.229 13.8679C19.913 16.0639 16.96 19.75 12 19.75C11.037 19.75 10.0861 19.604 9.17408 19.315C8.77908 19.19 8.56105 18.769 8.68605 18.374C8.81005 17.978 9.23496 17.762 9.62696 17.885C10.392 18.127 11.19 18.25 12 18.25C16.222 18.25 18.7901 15.02 19.9441 13.094C20.3521 12.418 20.3521 11.581 19.9461 10.907C19.6001 10.324 19.177 9.72798 18.72 9.17898C18.455 8.85998 18.4991 8.38707 18.8181 8.12307C19.1381 7.85807 19.61 7.90199 19.875 8.21999C20.381 8.82899 20.8509 9.49199 21.2329 10.137C21.9259 11.284 21.926 12.7159 21.229 13.8679ZM10.063 14.9981L3.53004 21.531C3.38404 21.677 3.19201 21.751 3.00001 21.751C2.80801 21.751 2.61598 21.678 2.46998 21.531C2.17698 21.238 2.17698 20.763 2.46998 20.47L5.64503 17.2949C4.31703 16.1499 3.35205 14.837 2.76905 13.866C2.07505 12.716 2.07501 11.2841 2.77101 10.1331C4.08701 7.93708 7.04001 4.251 12 4.251C13.835 4.251 15.565 4.76994 17.155 5.78494L20.469 2.47097C20.762 2.17797 21.237 2.17797 21.53 2.47097C21.823 2.76397 21.823 3.23901 21.53 3.53201L10.065 14.9971C10.065 14.9971 10.065 14.9981 10.064 14.9981C10.063 14.9981 10.063 14.9971 10.063 14.9981ZM9.6089 13.3311L13.3311 9.60891C12.9291 9.38191 12.478 9.251 12 9.251C10.484 9.251 9.25099 10.484 9.25099 12.001C9.25099 12.478 9.3829 12.9291 9.6089 13.3311ZM6.70704 16.232L8.51905 14.4199C8.02405 13.7169 7.75099 12.882 7.75099 11.999C7.75099 9.65605 9.65701 7.74905 12 7.74905C12.884 7.74905 13.7179 8.02211 14.4209 8.51711L16.052 6.88601C14.787 6.14501 13.432 5.74807 12 5.74807C7.77801 5.74807 5.20992 8.97808 4.05592 10.9041C3.64792 11.5801 3.64797 12.4171 4.05397 13.0911C4.59097 13.9881 5.48304 15.201 6.70704 16.232ZM14.708 12.4351C14.528 13.5951 13.594 14.53 12.436 14.709C12.027 14.772 11.7461 15.155 11.8091 15.564C11.8671 15.935 12.1861 16.2 12.5491 16.2C12.5871 16.2 12.6261 16.1969 12.6641 16.1909C14.4911 15.9089 15.908 14.4921 16.19 12.6641C16.253 12.2541 15.973 11.8721 15.563 11.8081C15.163 11.7471 14.771 12.0251 14.708 12.4351Z" fill="#25314C" />
                                        </svg>
                                        : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.2352 10.1379C19.9222 7.93894 16.9751 4.25 12.0001 4.25C7.02511 4.25 4.07801 7.93894 2.76501 10.1379C2.07801 11.2859 2.07801 12.7131 2.76501 13.8621C4.07801 16.0611 7.02511 19.75 12.0001 19.75C16.9751 19.75 19.9222 16.0611 21.2352 13.8621C21.9222 12.7131 21.9222 11.2869 21.2352 10.1379ZM19.9481 13.092C18.7981 15.018 16.2351 18.25 12.0001 18.25C7.76511 18.25 5.20212 15.019 4.05212 13.092C3.65012 12.418 3.65012 11.581 4.05212 10.907C5.20212 8.98098 7.76511 5.74902 12.0001 5.74902C16.2351 5.74902 18.7981 8.97998 19.9481 10.907C20.3511 11.582 20.3511 12.418 19.9481 13.092ZM12.0001 7.75C9.65611 7.75 7.75011 9.657 7.75011 12C7.75011 14.343 9.65611 16.25 12.0001 16.25C14.3441 16.25 16.2501 14.343 16.2501 12C16.2501 9.657 14.3441 7.75 12.0001 7.75ZM12.0001 14.75C10.4831 14.75 9.25011 13.517 9.25011 12C9.25011 10.483 10.4831 9.25 12.0001 9.25C13.5171 9.25 14.7501 10.483 14.7501 12C14.7501 13.517 13.5171 14.75 12.0001 14.75Z" fill="#25314C" />
                                        </svg>}
                                </button>
                            </div>

                            <div className={`flex items-center gap-[10px] border py-[15px] px-[18px] mt-[10px] rounded-[12px] mb-[5px]`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.00903 10.75C11.353 10.75 13.259 8.843 13.259 6.5C13.259 4.157 11.353 2.25 9.00903 2.25C6.66503 2.25 4.75903 4.157 4.75903 6.5C4.75903 8.843 6.66503 10.75 9.00903 10.75ZM9.00903 3.75C10.526 3.75 11.759 4.983 11.759 6.5C11.759 8.017 10.526 9.25 9.00903 9.25C7.49203 9.25 6.25903 8.017 6.25903 6.5C6.25903 4.983 7.49203 3.75 9.00903 3.75ZM16.75 18.019V21C16.75 21.414 16.414 21.75 16 21.75C15.586 21.75 15.25 21.414 15.25 21V18.019C15.25 17.018 14.943 13.75 11 13.75H7C3.057 13.75 2.75 17.017 2.75 18.019V21C2.75 21.414 2.414 21.75 2 21.75C1.586 21.75 1.25 21.414 1.25 21V18.019C1.25 15.358 2.756 12.25 7 12.25H11C15.244 12.25 16.75 15.357 16.75 18.019ZM14.155 10.2159C13.859 9.92594 13.8529 9.45103 14.1429 9.15503C14.4339 8.85903 14.909 8.85504 15.204 9.14404C15.563 9.49604 16.045 9.68994 16.559 9.68994C17.664 9.68994 18.53 8.82497 18.53 7.71997C18.53 6.63397 17.646 5.75 16.559 5.75C16.251 5.75 15.9731 5.81301 15.7321 5.93701C15.3651 6.12801 14.912 5.98104 14.722 5.61304C14.532 5.24504 14.678 4.79303 15.046 4.60303C15.502 4.36903 16.011 4.25 16.559 4.25C18.473 4.25 20.03 5.80697 20.03 7.71997C20.03 9.63297 18.473 11.1899 16.559 11.1899C15.65 11.1899 14.797 10.8439 14.155 10.2159ZM22.75 16.6801V19C22.75 19.414 22.414 19.75 22 19.75C21.586 19.75 21.25 19.414 21.25 19V16.6801C21.25 15.9411 21.023 13.53 18.11 13.53H16.599C16.185 13.53 15.849 13.194 15.849 12.78C15.849 12.366 16.185 12.03 16.599 12.03H18.11C21.535 12.03 22.75 14.5351 22.75 16.6801Z" fill="#25314C" />
                                </svg>
                                <input type="text" name='refercode' value={registerUser.refercode} onChange={handleChange} className={`w-full text-[15px] outline-none`} placeholder="Referral code (optional)" />
                            </div>


                            <div className="flex items-center justify-between">
                                <div className="checkbox-item">
                                    <label>
                                        <p>{t('I agree with terms & conditions')}</p>
                                        <input type="checkbox" />
                                        <span className="btn-checkbox"></span>
                                    </label>
                                </div>
                            </div>
                        </div>}

                    {validNumberData === 'New Number!'
                        ? <button onClick={(e) => handleSubmit(e)} class="bg-[#2D71FE] hover:bg-[#2d73fec9] w-[100%] text-[17px] py-[12px] text-white font-[500] rounded-[10px] mt-[20px]">{t('Register')}</button>
                        : <button onClick={handleCheck} class="bg-[#2D71FE] hover:bg-[#2d73fec9] w-[100%] text-[17px] py-[12px] text-white font-[500] rounded-[10px] mt-[20px]">{t('Continue')}</button>}

                    <p onClick={() => setRegisterModal(false)} className='mt-[10px] font-bold text-[16px] cursor-pointer text-center'>{t('Have an account')}? <span className='text-[#2D71FE]'>Log In</span></p>

                </div>
            </div>

        </>
    );
}

export default RegistrationPage;
/* jshint ignore:end */
