/* jshint esversion: 6 */
/* jshint esversion: 11 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useContextex, usePayment } from "../context/useContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../showTost";

export const useBookProduct = ({ booked_for }) => {
    const navigate = useNavigate();
    const bookFor = localStorage.getItem('bookFor');
    const [bookProductData, setBookProductData] = useState([])

    const {
        isUserId,
        bookedUserData,
        productAmount,
        bookedProductData,
        transactionId,
        selectedPaymentId,
        productFinalPrice,
        bookedOtherUserData,
        otherUserGender,
        setTransactionId,
        setSelectedPaymentId,
        baseUrl
    } = useContextex();

    const { buyProperty } = usePayment();

    const storedBookData = localStorage.getItem('bookinUserData');
    const parsedBookData = JSON.parse(storedBookData);
    const storedAmountData = localStorage.getItem('productAmount');
    const parsedAmountData = JSON.parse(storedAmountData);
    const propId = localStorage.getItem('pid');
    const checkOut = localStorage.getItem('check_out');
    const days = localStorage.getItem('days');
    const spid = localStorage.getItem('spid');
    const countryCallingCode = `+${bookedOtherUserData?.phone.slice(0, 2)}`;
    const mobileNumber = bookedOtherUserData?.phone.slice(2);

    const createBookingData = useCallback(() => ({

        prop_id: bookedProductData?.propetydetails?.id || propId,
        uid: isUserId,
        check_in: bookedUserData?.checkIn || parsedBookData?.checkIn,
        check_out: bookedUserData?.checkOut || checkOut,
        subtotal: productAmount?.productTotalAmnt || parsedAmountData?.productTotalAmnt,
        total: productFinalPrice || parsedAmountData?.bookingTotalAmount,
        total_day: productAmount?.bookingDays || days,
        cou_amt: productAmount?.bookingCouponAmount || parsedAmountData?.bookingCouponAmount,
        wall_amt: productAmount?.bookingWalletAmount || parsedAmountData?.bookingWalletAmount,
        transaction_id: ['2', '5'].includes(selectedPaymentId) ? '0' : transactionId,
        add_note: bookedUserData?.notes || parsedBookData?.notes,
        prop_price: bookedProductData?.propetydetails?.price || parsedAmountData?.bookingAmount,
        book_for: bookedUserData?.bookedFor || parsedBookData?.bookedFor,
        p_method_id: selectedPaymentId || spid,
        tax: productAmount?.productTotalTax || parsedAmountData?.productTotalTax,
        noguest: bookedUserData?.noGuest || parsedBookData?.noGuest,
        ...(bookedUserData?.bookedFor === 'other' && {
            fname: bookedOtherUserData?.firstName,
            lname: bookedOtherUserData?.lastName,
            gender: otherUserGender,
            email: bookedOtherUserData?.email,
            mobile: mobileNumber,
            ccode: countryCallingCode,
            country: 'india'
        })
    }), [
        bookedProductData,
        bookedUserData,
        productAmount,
        productFinalPrice,
        selectedPaymentId,
        transactionId,
        isUserId,
        bookedOtherUserData,
        otherUserGender
    ]);

    const bookProduct = useCallback(async () => {
        
        if (transactionExecutedRef.current) {
            return;
        }

        if ((booked_for === 'booking' || bookFor === 'booking') && transactionId && !['2', '5'].includes(selectedPaymentId)) {
            try {
                transactionExecutedRef.current = true;
                const response = await axios.post(`${baseUrl}user_api/u_book.php?`, createBookingData(), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const toastId = response?.data.ResponseCode === '200' ? "success" : "error";
                showToast({ title: response?.data?.ResponseMsg, id: toastId });

                console.log(response.data);
            
                localStorage.setItem('avblWalletBlnc', response?.data?.wallet);

                if (response?.data?.ResponseCode === '200') {
                    localStorage.removeItem('bookinUserData');
                    localStorage.removeItem('productAmount');
                    localStorage.removeItem('check_out');
                    localStorage.removeItem('days');
                    setBookProductData(response?.data)
                }

                localStorage.removeItem('spid');
                localStorage.removeItem('bookFor');
                // navigate('/dashboard');

            } catch (error) {
                console.error("Error booking product:", error);
            }
        }
    }, [transactionId]);

    const transactionExecutedRef = useRef(false);

    useEffect(() => {
        const handleTransaction = async () => {
            if (transactionId) {

                await bookProduct();
                await buyProperty();
                setTransactionId('');
                navigate('/dashboard');
                setSelectedPaymentId('');
            }
        };

        handleTransaction();
    }, [transactionId]);

    return {
        bookProductData,
        bookProduct,
    };
};
