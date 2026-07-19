/* jshint esversion: 6 */
/* jshint esversion: 11 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useContextex } from '../context/useContext';
import { useBookProduct } from '../hooks/useBookProduct';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../showTost';

const SuccessHandler = ({ booked_for }) => {
  const {
    setTransactionId,
    transactionId,
    setPaymentStatus,
    baseUrl
  } = useContextex();

  const navigate = useNavigate();
  const { performBookProduct } = useBookProduct(booked_for = { booked_for });

  // Get necessary data from localStorage
  const bookFor = localStorage.getItem('bookFor');
  const packId = localStorage.getItem('packId');
  const paymentName = localStorage.getItem('paymentName');
  const walletAddAmount = localStorage.getItem('walletAddAmount');
  const uid = localStorage.getItem('uid');
  const packageAmount = localStorage.getItem('packageAmnt');
  const parsedAmount = packageAmount ? JSON.parse(packageAmount) : {};

  // Handle package purchase
  const purchasePackage = useCallback(async () => {
    if (!transactionId) {
      console.error('Transaction ID is missing, cannot proceed with package purchase.');
      return;
    }

    if (transactionExecutedRef.current) {
      return;
    }

    try {
      transactionExecutedRef.current = true;
      const response = await axios.post(`${baseUrl}user_api/u_package_purchase.php?`, {
        uid,
        transaction_id: transactionId,
        plan_id: packId,
        pname: paymentName,
        wall_amt: parsedAmount?.packageWalletAmount,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTransactionId(null);
    } catch (error) {
      console.error('Error purchasing package:', error);
      setPaymentStatus('failed');
    } finally {
      navigate('/dashboard');
    }
  }, [transactionId]);

  const walletAmountAdd = useCallback(async () => {
    if (!transactionId) {
      console.error('Transaction ID is missing, cannot proceed with package purchase.');
      return;
    }

    if (transactionExecutedRef.current) {
      return;
    }

    try {
      transactionExecutedRef.current = true;
      const response = await axios.post(`${baseUrl}user_api/u_wallet_up.php?`, {
        uid,
        wallet: walletAddAmount,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const toastId = response?.data.ResponseCode === '200' ? "success" : "error";
      showToast({ title: response?.data?.ResponseMsg, id: toastId });

      localStorage.setItem('avblWalletBlnc', response?.data?.wallet);
      if (response?.data?.ResponseCode === '200') {
        localStorage.removeItem('walletAddAmount');
      }

      setTransactionId(null);
    } catch (error) {
      console.error('Error purchasing package:', error);
      setPaymentStatus('failed');
    } finally {
      navigate('/dashboard');
    }
  }, [transactionId]);

  // Add a ref to track the execution status
  const transactionExecutedRef = useRef(false);

  const handlePaymentSuccess = useCallback(async () => {
    try {
      await setTransactionId(Date.now());

      if (booked_for === 'booking' && transactionId) {
        await performBookProduct();
      } else if (bookFor === 'package') {
        await purchasePackage();
      } else if (bookFor === 'wallet') {
        await walletAmountAdd();
      }

      setPaymentStatus('completed');
    } catch (error) {
      console.error('Error during payment success handling:', error);
      setPaymentStatus('failed');
    }
  }, [performBookProduct, purchasePackage, walletAmountAdd, setTransactionId, transactionId, booked_for, bookFor, setPaymentStatus]);

  useEffect(() => {
    handlePaymentSuccess();
  }, [handlePaymentSuccess]);

  return null;
};

export default SuccessHandler;


export const CancelHandler = () => {
  const [, setShowSnackbar] = useState(false);
  const {
    setTransactionId,
  } = useContextex();
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, []);

  function handlePaymentSuccess() {
    setShowSnackbar(true);
    setTransactionId('');
  }

  window.onload = function () {
    handlePaymentSuccess();
  };

};