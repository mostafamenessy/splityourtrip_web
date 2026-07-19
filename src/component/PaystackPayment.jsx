/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import React from 'react';
import { PaystackButton } from 'react-paystack';
import { useContextex, usePayment } from '../context/useContext';
import { AddToProductPay } from './AddToWallet';
import { useNavigate } from 'react-router-dom';
import { useBookProduct } from '../hooks/useBookProduct';
import { usePackagePurchase } from '../hooks/usePackagePurchase';

export const PaystackPayment = ({ product_amount, booked_for, attributes }) => {
    const { bookedOtherUserData, loginUserData, setTransactionId, transactionId } = useContextex();

    const publicKey = attributes?.split(',')[0];
    const email = bookedOtherUserData?.email || loginUserData?.UserLogin?.email;
    const amount = product_amount * 100;
    const first_name = bookedOtherUserData?.firstName || loginUserData?.UserLogin?.name;
    const last_name = bookedOtherUserData?.lastname || loginUserData?.UserLogin?.name;
    const phone = bookedOtherUserData?.phone || loginUserData?.UserLogin?.mobile;
    const navigate = useNavigate();
    const { performBookProduct } = useBookProduct(booked_for={booked_for});
    const { performBookPackage } = usePackagePurchase();
    const { paymentFailedCase } = usePayment();
    const paystackProps = {
        email,
        amount,
        first_name,
        last_name,
        phone,
        publicKey,
        text: 'Pay Now',
        onSuccess: (response) => {
            setTransactionId(response?.transaction);

            if (booked_for === 'booking') {
                if (transactionId) {
                    performBookProduct();
                }
            }
            else if (booked_for === 'package') {
                if (transactionId) {
                    performBookPackage();
                }
            } else if (booked_for === 'wallet' && transactionId) {
                navigate('/dashboard');
            }
        },
        onClose: () => {
            paymentFailedCase();
        }
    };

    return (
        <div>
            <PaystackButton {...paystackProps} className='PayStackButton' />
            {booked_for === 'package' && transactionId && <AddToProductPay />}
        </div>
    );
};
/* jshint ignore:end */
