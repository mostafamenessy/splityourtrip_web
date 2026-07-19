/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { useEffect, useState } from 'react';
import { useContextex, usePayment } from '../context/useContext';
import { useNavigate } from 'react-router-dom';
import { useBookProduct } from '../hooks/useBookProduct';
import { usePackagePurchase } from '../hooks/usePackagePurchase';

export const FlutterwavePayment = ({ product_amount, booked_for, attributes }) => {
    const { bookedOtherUserData, loginUserData, setTransactionId, transactionId } = useContextex();
    const [, setPaymentResponse] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const navigate = useNavigate();
    const { performBookProduct } = useBookProduct(booked_for = { booked_for });
    const { performBookPackage } = usePackagePurchase();
    const { paymentFailedCase } = usePayment();

    const loadScript = async () => {
        const script = document.createElement('script');
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.async = true;

        script.onload = () => {
            setIsScriptLoaded(true);
            console.log('Flutterwave script loaded successfully!');
        };

        script.onerror = () => {
            console.error("Failed to load Flutterwave script.");
        };

        document.body.appendChild(script);
    }

    useEffect(() => {
        loadScript()
    }, [])

    const handlePayment = () => {
        if (!isScriptLoaded) {
            console.error('Flutterwave script is not loaded.');
            return;
        }

        const paymentOption = {
            tx_ref: Date.now(),
            amount: product_amount,
            currency: 'USD',
            email: bookedOtherUserData?.email || loginUserData?.UserLogin?.email || 'test@gmail.com',
            phone_number: bookedOtherUserData?.phone || loginUserData?.UserLogin?.mobile,
            public_key: attributes,
            callback: async (response) => {

                if (response.status === 'successful') {
                    await setTransactionId(response?.transaction_id);
                    if (booked_for === 'booking') {
                        if (performBookProduct) {
                            performBookProduct();
                        }
                    } else if (booked_for === 'package') {
                        if (transactionId) {
                            await performBookPackage();
                        }
                    } else if (booked_for === 'wallet') {
                        if (transactionId) {
                            navigate('/dashboard');
                        }
                    }
                    await setPaymentResponse('successful');
                } else if (response.status === 'cancelled') {
                    setPaymentResponse('cancelled');
                    // navigate('/payment-cancel');
                    paymentFailedCase();
                } else {
                    setPaymentResponse('failed');
                    paymentFailedCase();
                }
            },
            onClose: () => {
                console.log('close')
            },
            customer: {
                email: bookedOtherUserData?.email || loginUserData?.UserLogin?.email || 'test@gmail.com',
                phonenumber: bookedOtherUserData?.phone || loginUserData?.UserLogin?.mobile,
                name: bookedOtherUserData?.firstName || loginUserData?.UserLogin?.name,
            }
        }

        if (window.FlutterwaveCheckout) {
            console.log('FlutterwaveCheckout is available');
            window.FlutterwaveCheckout(paymentOption);
        } else {
            console.error('FlutterwaveCheckout function is not available.');
        }
    };

    useEffect(() => {
        if (isScriptLoaded && product_amount) {
            handlePayment()
        }
    }, [isScriptLoaded, product_amount])

    return null
};