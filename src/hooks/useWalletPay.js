/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint ignore:start */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useContextex, usePayment } from '../context/useContext';
import axios from 'axios';
import { showToast } from '../showTost';

export const useWalletPay = () => {
    const navigate = useNavigate();
    const [, setIsPurchasing] = useState(false);
    const amnt = localStorage.getItem('walletAmnt');

    const {
        isUserId,
        transactionId,
        setTransactionId,
        setSelectedPaymentId,
        baseUrl
    } = useContextex();

    const { walletPayment } = usePayment();

    const purchasePackage = useCallback(async () => {

        if (transactionExecutedRef.current) {
            return;
        }

        setIsPurchasing(true);
        try {
            console.log('Answered');
            transactionExecutedRef.current = true;

            const response = await axios.post(`${baseUrl}user_api/u_wallet_up.php?`, {
                uid: isUserId,
                wallet: amnt
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            localStorage.setItem('walletresponse', response?.data?.ResponseMsg);
            localStorage.setItem('avblWalletBlnc', response?.data?.wallet);

            const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });

            if (response?.data?.ResponseMsg === '200') {
                localStorage.removeItem('walletAddAmount');
            }

            localStorage.removeItem('walletAmnt');
            localStorage.removeItem('spid');
            localStorage.removeItem('bookFor');
            localStorage.removeItem('payType');
            localStorage.removeItem('packData');

        } catch (error) {
            console.error('Error purchasing package:', error);
        } finally {
            setIsPurchasing(false);
        }
        
    }, [transactionId]);

    const transactionExecutedRef = useRef(false);

    useEffect(() => {
        const handleTransaction = async () => {
            if (transactionId) {
                await purchasePackage();
                await walletPayment();
                navigate('/');
                setTransactionId('');
                setSelectedPaymentId('');
            }
        };

        handleTransaction();
    }, [transactionId]);

    return ;
};
/* jshint ignore:end */
