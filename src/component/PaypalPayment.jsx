/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useContextex } from '../context/useContext';
import { useNavigate } from 'react-router-dom';
import { useBookProduct } from '../hooks/useBookProduct';
import { usePackagePurchase } from '../hooks/usePackagePurchase';
import { showToast } from '../showTost';

export const PaypalPayment = ({ product_amount, booked_for, attributes }) => {
    const [, setPaymentSuccess] = useState(false);
    const [, setErrorMessage] = useState('');
    const roundedAmount = Math.round(product_amount);

    const navigate = useNavigate();
    const { performBookProduct } = useBookProduct(booked_for = { booked_for });
    const { performBookPackage } = usePackagePurchase();

    const { setTransactionId, transactionId } = useContextex();

    const initialOptions = {
        clientId: attributes?.attributes?.split(',')[0],
        currency: "USD",
        intent: "capture",
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: roundedAmount
                    },
                    description: 'Your order description',
                },
            ],
        });
    };

    // Function to handle successful payment completion
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            // Call your API to update payment success
            setPaymentSuccess(true);
            setTransactionId(details.id);
            showToast({ title: 'your transaction is Successfull', id: "success" });
            if (booked_for === 'booking') {
                if (transactionId) {
                    performBookProduct();
                }
            } else if (booked_for === 'package') {
                if (transactionId) {
                    performBookPackage();
                }
            } else if (booked_for === 'wallet' && transactionId) {
                navigate('/dashboard');
            }

        });
    };

    const onError = (err) => {
        setErrorMessage(err.toString());
    };

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    createOrder={(data, actions) => createOrder(data, actions)}
                    onApprove={(data, actions) => onApprove(data, actions)}
                    onError={(err) => onError(err)}
                />
            </PayPalScriptProvider>
        </div>
    );
};

/* jshint ignore:end */