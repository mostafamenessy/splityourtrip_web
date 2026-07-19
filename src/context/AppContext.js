/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const getSavedUser = () => {
    const savedUser = localStorage.getItem('loginUser');
    return savedUser ? JSON.parse(savedUser) : null;
};

const baseUrl = 'https://backend.splityourtrip.com/';

export const AppProvider = ({ children }) => {

    const [isUser, setIsUser] = useState();
    const [bookingId, setBookingId] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [currentPage, setCurrentPage] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [productDetailId, setProductDetailId] = useState('');
    const [otherUserGender, setOtherUserGender] = useState('');
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [productFinalPrice, setProductFinalPrice] = useState('');
    const [selectedPaymentId, setSelectedPaymentId] = useState('');
    const [selectedPaymentType, setSelectedPaymentType] = useState('');

    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isPackdata, setIsPackData] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);
    const [sendedEnquiry, setSendedEnquiry] = useState(false);
    const [isShowPackSnack, setIsShowPackSnack] = useState(false);
    const [isShowBookSnack, setIsShowBookSnack] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isExpirePackage, setIsExpirePackage] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [isShowWalletSnack, setIsShowWalletSnack] = useState(false);
    const [confirmCurrentBook, setConfirmCurrentBook] = useState(false);
    const [complateCurrentBook, setComplateCurrentBook] = useState(false);
    const [isEditSelectedProperty, setIsEditSelectedProperty] = useState(false);

    const [loginData, setLoginData] = useState(null);
    const [modalOpen, setOpenModal] = useState(null);
    const [loginModal, setLoginModal] = useState(null);
    const [registrData, setRegistrData] = useState(null);
    const [userPageList, setUserPageList] = useState(null);
    const [isLikedOrNot, setIsLikedOrNot] = useState(null);
    const [referApiData, setReferApiData] = useState(null);
    const [propertyType, setPropertyType] = useState(null);
    const [loginUserData, setLoginUserData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [registerModal, setRegisterModal] = useState(null);
    const [authLoginToken, setAuthLoginToken] = useState(null);
    const [userPropertyList, setUserPropertyList] = useState();
    const [countryListData, setCountryListData] = useState(null);
    const [walletAddAmount, setWalletAddAmount] = useState(null);
    const [userSelectedPage, setUserSelectedPage] = useState(null);
    const [bookedProductRes, setBookedProductRes] = useState(null);
    const [selectedPackData, setSelectedPackData] = useState(null);
    const [userWalletAmount, setUserWalletAmount] = useState(null);
    const [editSelectedImage, setEditSelectedImage] = useState(null);
    const [paymentGatwayList, setPaymentGatwayList] = useState(null);
    const [editSelectedProperty, setEditSelectedProperty] = useState(null);
    const [editSelectedMyGallaryImage, setEditSelectedMyGallaryImage] = useState(null);
    const [editSelectedMyGallaryCategory, setEditSelectedMyGallaryCategory] = useState(null);

    const [tabsList, setTabsList] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [tabCardData, setTabCardData] = useState([]);
    const [memberShipData, setMemberShipData] = useState();
    const [featuredPropList, setFeaturedPropList] = useState([]);
    const [dashboardTabData, setDashboardTabData] = useState({});
    const [bookedProductData, setBookedProductData] = useState([]);

    const [selectedId, setSelectedId] = useState("0");
    const [userCurrency, setUserCurrency] = useState('$');
    const [selectedPackage, setSelectedPackage] = useState('1');
    const [selectedTab, setSelectedTab] = useState('Dashboard');
    const [paymentFor, setPaymentFor] = useState('');
    const [paymentResp, setPaymentResp] = useState('');
    const [snackMsg, setSnackMsg] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);


    const [productAmount, setProductAmount] = useState({
        bookingDays: '',
        bookingAmount: '',
        bookingTotalAmount: '',
        bookingTax: '',
        bookingWalletAmount: '0',
        bookingCouponAmount: '0',
        productTotalAmnt: '',
        productTotalTax: ''
    });

    const [packageAmount, setPackageAmount] = useState({
        packageWalletAmount: '',
        packageTotalAmnt: ''
    });

    const [bookedOtherUserData, setBookedOtherUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [bookedUserData, setBookedUserData] = useState({
        bookingDate: '',
        checkIn: '',
        checkOut: '',
        noGuest: '',
        days: '',
        notes: '',
        bookedFor: '',
    });

    const [toastData, setToastData] = useState({
        message: '',
        type: ''
    });

    const token = localStorage.getItem('authToken');
    let isUserId = localStorage.getItem('uid');

    useEffect(() => {
        const fetchReferDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_getdata.php`, {
                    uid: isUserId || '0',
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setReferApiData(response?.data);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchReferDataAsync();
    }, [isUserId]);

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_paymentgateway.php?`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setPaymentGatwayList(response?.data?.paymentdata)
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchCountryDataAsync();
    }, []);

    useEffect(() => {
        setIsAdmin(loginUserData?.type === 'admin');
    }, [loginUserData]);

    useEffect(() => {
        const fetchDataAndSetUserPageList = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_pagelist.php?`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.pagelist) {
                    setUserPageList(response?.data?.pagelist);
                }
                setTabCardData(response?.data?.Property_cat)
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchDataAndSetUserPageList();
    }, [selectedId, selectedCountryId]);

    useEffect(() => {
        if (loginData) {
            setLoginUserData(loginData);
        } else {
            setLoginUserData(getSavedUser());
        }
    }, [loginData]);

    const values = {
        mobileNumber,
        countryCode,
        featuredPropList,
        productDetailId,
        showNotification,
        bookedProductData,
        bookedUserData,
        baseUrl,
        bookedOtherUserData,
        isUser,
        loginUserData,
        toastData,
        productAmount,
        selectedCountryId,
        transactionId,
        bookingId,
        selectedPackage,
        propertyType,
        countryListData,
        editSelectedProperty,
        isEditSelectedProperty,
        dashboardTabData,
        userPropertyList,
        editSelectedImage,
        editSelectedMyGallaryImage,
        editSelectedMyGallaryCategory,
        complateCurrentBook,
        confirmCurrentBook,
        userCurrency,
        productFinalPrice,
        showLanguage,
        selectedTab,
        userSelectedPage,
        userPageList,
        showCancelModal,
        selectedId,
        isLikedOrNot,
        authLoginToken,
        token,
        isUserId,
        isChecked,
        loginModal,
        currentPage,
        modalOpen,
        countryData,
        paymentGatwayList,
        walletAddAmount,
        referApiData,
        selectedPaymentId,
        otherUserGender,
        tabCardData,
        tabsList,
        selectedPackData,
        selectedPaymentType,
        loginData,
        registerModal,
        registrData,
        isAdmin,
        userWalletAmount,
        isPackdata,
        isExpirePackage,
        memberShipData,
        bookedProductRes,
        isShowBookSnack,
        paymentStatus,
        packageAmount,
        isShowWalletSnack,
        isShowPackSnack,
        sendedEnquiry,
        paymentFor,
        paymentResp,
        setPaymentResp,
        setPaymentFor,
        setSendedEnquiry,
        setIsShowPackSnack,
        setIsShowWalletSnack,
        setPackageAmount,
        setPaymentStatus,
        setIsShowBookSnack,
        setBookedProductRes,
        setMemberShipData,
        setIsExpirePackage,
        setIsPackData,
        setUserWalletAmount,
        setIsAdmin,
        setRegistrData,
        setRegisterModal,
        setLoginData,
        setSelectedPaymentType,
        setSelectedPackData,
        setLoginUserData,
        setTabsList,
        setTabCardData,
        setOtherUserGender,
        setSelectedPaymentId,
        setReferApiData,
        setWalletAddAmount,
        setPaymentGatwayList,
        setCountryData,
        setOpenModal,
        setCurrentPage,
        setLoginModal,
        setIsChecked,
        setAuthLoginToken,
        setIsLikedOrNot,
        setSelectedId,
        setShowCancelModal,
        setUserPageList,
        setUserSelectedPage,
        setSelectedTab,
        setShowLanguage,
        setProductFinalPrice,
        setUserCurrency,
        setComplateCurrentBook,
        setConfirmCurrentBook,
        setEditSelectedMyGallaryCategory,
        setEditSelectedMyGallaryImage,
        setEditSelectedImage,
        setUserPropertyList,
        setDashboardTabData,
        setIsEditSelectedProperty,
        setEditSelectedProperty,
        setCountryListData,
        setPropertyType,
        setSelectedPackage,
        setBookingId,
        setTransactionId,
        setProductAmount,
        setToastData,
        setCountryCode,
        setMobileNumber,
        setFeaturedPropList,
        setProductDetailId,
        setShowNotification,
        setBookedProductData,
        setBookedUserData,
        setBookedOtherUserData,
        setIsUser,
        setSelectedCountryId,
        snackMsg, setSnackMsg,
        showSnackbar, setShowSnackbar
    };

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}

/* jshint ignore:end */