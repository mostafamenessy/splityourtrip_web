/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint esversion: 11 */
/* jshint ignore:start */
import { useEffect, useRef, useState } from 'react';
import { useAuth, useContextex } from '../context/useContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { db, auth, RecvestToken } from '../firebase';
import { uid } from 'uid';
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

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
    </svg>
);

function LoginPage() {
    // 'landing' -> pick Google / Facebook / email
    // 'otp'     -> enter the 6-digit code just emailed
    // 'name'    -> first-time email sign up, ask for a name
    const [mode, setMode] = useState('landing');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [signupToken, setSignupToken] = useState('');
    const [otpValue, setOtpValue] = useState(Array.from({ length: 6 }, () => ''));
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [errors, setErrors] = useState({ email: '', otp: '', name: '' });

    const { t } = useTranslation();
    const { login } = useAuth();
    const { setIsUser, setUserCurrency, setLoginModal, setLoginData, baseUrl } = useContextex();
    const otpRefs = useRef(Array.from({ length: 6 }, () => null));

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const finalizeLogin = (data) => {
        const authToken = data?.token || uid(32);

        localStorage.setItem('loginUser', JSON.stringify(data));
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('isPackBuy', data?.UserLogin?.is_subscribe);

        login(authToken);

        if (data?.UserLogin) {
            const { id, currency } = data.UserLogin;
            localStorage.setItem('uid', id);
            setIsUser(id);
            setUserCurrency(currency || '$');
            setLoginData(data);
            setLoginModal(false);
        }

        firebaseAddUser();
    };

    const handleSocialLogin = async (providerName) => {
        try {
            setLoading(true);
            const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const response = await axios.post(
                `${baseUrl}user_api/u_social_login.php?`,
                { idToken, provider: providerName },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const data = response?.data;
            if (data?.ResponseCode === '200') {
                finalizeLogin(data);
            } else {
                showToast({ title: data?.ResponseMsg || 'Login failed', id: 'error' });
            }
        } catch (err) {
            console.error(`${providerName} login error:`, err.message);
            if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
                showToast({ title: 'Login failed, please try again', id: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendCode = async (e) => {
        if (e) e.preventDefault();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrors((p) => ({ ...p, email: 'Invalid email' }));
            showToast({ title: 'Please enter a valid email', id: 'error' });
            return;
        }
        setErrors((p) => ({ ...p, email: '' }));

        try {
            setLoading(true);
            const response = await axios.post(
                `${baseUrl}user_api/u_email_otp_request.php?`,
                { email },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const data = response?.data;
            if (data?.ResponseCode === '200') {
                setMode('otp');
                setOtpValue(Array.from({ length: 6 }, () => ''));
                setResendCooldown(30);
                showToast({ title: t('Code sent, check your email'), id: 'success' });
            } else {
                showToast({ title: data?.ResponseMsg || 'Could not send code', id: 'error' });
            }
        } catch (err) {
            console.error('Send code error:', err.message);
            showToast({ title: 'Could not send code, please try again', id: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangeOtp = (index, value) => {
        if (value && !/^[0-9]$/.test(value)) return;
        const updated = [...otpValue];
        updated[index] = value;
        setOtpValue(updated);
        if (value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, event) => {
        if (event.key === 'Backspace' && index > 0 && !event.target.value) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleVerifyCode = async (e) => {
        if (e) e.preventDefault();
        const code = otpValue.join('');

        if (code.length !== 6) {
            showToast({ title: 'Please enter the 6-digit code', id: 'error' });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${baseUrl}user_api/u_email_otp_verify.php?`,
                { email, otp: code },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const data = response?.data;
            if (data?.ResponseCode === '200') {
                finalizeLogin(data);
            } else if (data?.ResponseCode === '201') {
                setSignupToken(data?.signupToken || '');
                setMode('name');
            } else {
                showToast({ title: data?.ResponseMsg || 'Invalid or expired code', id: 'error' });
            }
        } catch (err) {
            console.error('Verify code error:', err.message);
            showToast({ title: 'Verification failed, please try again', id: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async (e) => {
        if (e) e.preventDefault();
        if (resendCooldown > 0) return;
        handleSendCode();
    };

    const handleCompleteSignup = async (e) => {
        if (e) e.preventDefault();

        if (!name.trim()) {
            setErrors((p) => ({ ...p, name: 'Name is required' }));
            showToast({ title: 'Please enter your name', id: 'error' });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${baseUrl}user_api/u_email_signup_complete.php?`,
                { email, name, signupToken },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const data = response?.data;
            if (data?.ResponseCode === '200') {
                finalizeLogin(data);
            } else {
                showToast({ title: data?.ResponseMsg || 'Could not complete sign up', id: 'error' });
            }
        } catch (err) {
            console.error('Complete signup error:', err.message);
            showToast({ title: 'Sign up failed, please try again', id: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const backToLanding = () => {
        setMode('landing');
        setOtpValue(Array.from({ length: 6 }, () => ''));
    };

    return (
        <div className="py-[10px] px-[15px]">
            <h3>{t('Sign into your account')}</h3>

            {mode === 'landing' && (
                <div className="mt-[15px]">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSocialLogin('google')}
                        className="w-[100%] flex items-center justify-center gap-[10px] border border-[#80808038] py-[12px] rounded-[10px] mb-[10px] text-[15px] font-[500]"
                    >
                        <GoogleIcon /> {t('Continue with Google')}
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSocialLogin('facebook')}
                        className="w-[100%] flex items-center justify-center gap-[10px] border border-[#80808038] py-[12px] rounded-[10px] mb-[15px] text-[15px] font-[500]"
                    >
                        <FacebookIcon /> {t('Continue with Facebook')}
                    </button>

                    <div className="flex items-center gap-[10px] mb-[15px]">
                        <div style={{ flex: 1, height: 1, background: '#80808038' }} />
                        <span className="text-[13px] text-gray-500">{t('or')}</span>
                        <div style={{ flex: 1, height: 1, background: '#80808038' }} />
                    </div>

                    <div style={{ border: errors.email ? '1px solid red' : '1px solid #80808038' }} className="flex items-center py-[15px] px-[18px] rounded-[12px] mb-[10px]">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full outline-none text-[15px]"
                            placeholder={t('Email Address')}
                        />
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleSendCode}
                        className="bg-[#2D71FE] hover:bg-[#2d73fec9] w-[100%] text-[17px] py-[12px] text-white font-[500] rounded-[10px]"
                    >
                        {loading ? t('Sending...') : t('Continue with Email')}
                    </button>

                    <p className="mt-[10px] text-[13px] text-gray-500 text-center">
                        {t("We'll email you a one-time code, no password needed.")}
                    </p>
                </div>
            )}

            {mode === 'otp' && (
                <div className="mt-[15px]">
                    <p>{t('Enter the 6-digit code sent to')} <b>{email}</b></p>
                    <div className="flex items-center justify-center gap-[10px] my-[15px]">
                        {otpRefs.current.map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                ref={(el) => (otpRefs.current[index] = el)}
                                maxLength={1}
                                value={otpValue[index]}
                                onChange={(e) => handleChangeOtp(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                style={{ height: '50px', width: '50px' }}
                                className="m-1 border-[1px] rounded-[10px] outline-none text-center text-[17px]"
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleVerifyCode}
                        className="bg-[#2D71FE] hover:bg-[#2d73fec9] w-[100%] text-[17px] py-[12px] text-white font-[500] rounded-[10px]"
                    >
                        {loading ? t('Verifying...') : t('Verify')}
                    </button>

                    <p className="mt-[10px] text-[14px] text-center">
                        {resendCooldown > 0
                            ? `${t('Resend code in')} ${resendCooldown}s`
                            : <span onClick={handleResendCode} className="text-[#2D71FE] cursor-pointer">{t('Resend code')}</span>}
                    </p>
                    <p onClick={backToLanding} className="mt-[5px] text-[14px] cursor-pointer text-center text-gray-500">
                        {t('Use a different email')}
                    </p>
                </div>
            )}

            {mode === 'name' && (
                <div className="mt-[15px]">
                    <p>{t("You're new here — what's your name?")}</p>
                    <div style={{ border: errors.name ? '1px solid red' : '1px solid #80808038' }} className="flex items-center py-[15px] px-[18px] rounded-[12px] my-[10px]">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full outline-none text-[15px]"
                            placeholder={t('Full Name')}
                        />
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleCompleteSignup}
                        className="bg-[#2D71FE] hover:bg-[#2d73fec9] w-[100%] text-[17px] py-[12px] text-white font-[500] rounded-[10px]"
                    >
                        {loading ? t('Creating account...') : t('Finish Sign Up')}
                    </button>
                </div>
            )}
        </div>
    );
}

export default LoginPage;
/* jshint ignore:end */
