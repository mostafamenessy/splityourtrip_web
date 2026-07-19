/* jshint esversion: 6 */
/* jshint esversion: 11 */

import { useEffect, useState, useCallback } from 'react';
import { useContextex, usePayment } from '../context/useContext';
import { useNavigate } from 'react-router-dom';
import { useBookProduct } from '../hooks/useBookProduct';
import { usePackagePurchase } from '../hooks/usePackagePurchase';

export const RazorpayPayment = ({ product_amount, booked_for, attributes }) => {

  const { setTransactionId, transactionId } = useContextex();
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  const { performBookProduct } = useBookProduct(booked_for = { booked_for });
  const { performBookPackage } = usePackagePurchase();
  const { paymentFailedCase } = usePayment();

  const newAmount = Math.round(product_amount * 100);

  const handlePaymentSuccess = (response) => {
    setTransactionId(response?.razorpay_payment_id);
    setPaymentStatus(booked_for);
  };

  const localData = localStorage.getItem("loginUser");
  const { UserLogin } = JSON.parse(localData);

  const getPrefillData = () => ({
    name: UserLogin.name,
    email: UserLogin.email,
    contact: UserLogin.ccode + UserLogin.mobile,
  });

  useEffect(() => {

    if (!newAmount) return;

    const loadRazorpay = () => {
      const options = {
        key: attributes,
        amount: newAmount,
        currency: 'INR',
        name: 'Go Property',
        description: 'Test Transaction',
        image: 'https://yourlogo.com/logo.png',
        handler: (response) => handlePaymentSuccess(response),
        modal: {
          ondismiss: () => {
            paymentFailedCase();
          },
        },
        prefill: getPrefillData(),
        notes: { address: 'Corporate Office' },
        theme: { color: '#3399cc' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    };

    loadRazorpay();

  }, [newAmount]);

  useEffect(() => {
    if (booked_for === 'booking') {
      if (performBookProduct) {
        performBookProduct();
        navigate('/dashboard');
      }
    } else if (booked_for === 'package') {
      if (performBookPackage) {
        performBookPackage()
        navigate('/addProparty')
      }
    } else if (booked_for === 'wallet') {
      if (transactionId) {
        navigate('/dashboard');
      }
    }
  }, [paymentStatus, transactionId, performBookPackage, performBookProduct, navigate]);

  return null
};
