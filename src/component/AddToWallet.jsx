/* jshint esversion: 6 */
/* jshint esversion: 11 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContextex, usePayment } from '../context/useContext';
import axios from 'axios';
import { showToast } from '../showTost';

export const AddToProductPay = ({ paybleWalletAmnt, selectedPaymentType, setSelectedPaymentType }) => {
    const [, setShowSnackbar] = useState(false);
    const [isBook, setIsBook] = useState(true);
    const navigate = useNavigate();

    const {
        bookedUserData,
        productAmount,
        bookedProductData,
        transactionId,
        selectedPaymentId,
        isUserId,
        productFinalPrice,
        bookedOtherUserData,
        otherUserGender,
        setSelectedPaymentId,
        baseUrl
    } = useContextex();

    const { buyProperty } = usePayment();
    const productTax = (productAmount?.bookingAmount || 0) * (productAmount?.bookingTax || 0) / 100;

    const countryCallingCode = `+${bookedOtherUserData?.phone.slice(0, 2)}`;
    const mobileNumber = bookedOtherUserData?.phone.slice(2);

    const bookingSuccessData = {
        prop_id: bookedProductData?.propetydetails?.id,
        uid: isUserId,
        check_in: bookedUserData?.checkIn,
        check_out: bookedUserData?.checkOut,
        subtotal: productAmount?.bookingAmount,
        total: productFinalPrice,
        total_day: productAmount?.bookingDays,
        cou_amt: productAmount?.bookingCouponAmount || '0',
        wall_amt: productAmount?.bookingWalletAmount || paybleWalletAmnt,
        transaction_id: (selectedPaymentId === '2' || selectedPaymentId === '5') ? '0' : transactionId,
        add_note: bookedUserData?.notes,
        prop_price: bookedProductData?.propetydetails?.price,
        book_for: bookedUserData?.bookedFor,
        p_method_id: selectedPaymentId,
        tax: productTax,
        noguest: bookedUserData?.noGuest,
        ...(bookedUserData?.bookedFor === 'other' && {
            fname: bookedOtherUserData?.firstName,
            lname: bookedOtherUserData?.lastName,
            gender: otherUserGender,
            email: bookedOtherUserData?.email,
            mobile: mobileNumber,
            ccode: countryCallingCode,
            country: 'india'
        })
    };

    const handleTransaction = useCallback(async () => {
        if (transactionExecutedRef.current) {
            return;
        }

        if (isBook && selectedPaymentId && selectedPaymentType && (selectedPaymentId === '2' || selectedPaymentId === '5')) {
            try {
                transactionExecutedRef.current = true;

                const response = await axios.post(`${baseUrl}user_api/u_book.php?`, bookingSuccessData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const toastId = response?.data.ResponseCode === '200' ? "success" : "error";
                showToast({ title: response?.data?.ResponseMsg, id: toastId });

                localStorage.setItem('avblWalletBlnc', response?.data?.wallet);

                if (response?.data?.ResponseCode === '200') {
                    localStorage.removeItem('bookinUserData');
                    localStorage.removeItem('productAmount');
                    localStorage.removeItem('check_out');
                    localStorage.removeItem('days');
                }

                setSelectedPaymentId('0');
                await buyProperty();
                setIsBook(false);
                setShowSnackbar(true);
                setSelectedPaymentType(null);
                navigate('/dashboard');
            } catch (error) {
                console.error("Error booking product:", error);
            }
        }

    }, [isBook, selectedPaymentId, selectedPaymentType, navigate]);

    useEffect(() => {
        handleTransaction();
    }, [handleTransaction]);

    const transactionExecutedRef = useRef(false);

};
