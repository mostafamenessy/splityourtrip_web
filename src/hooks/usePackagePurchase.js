/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useContextex } from '../context/useContext';
import axios from 'axios';
import { showToast } from '../showTost';

export const usePackagePurchase = () => {

    const navigate = useNavigate();
    const [, setIsPurchasing] = useState(false);

    const {
        transactionId,
        selectedPackData,
        setTransactionId,
        setSelectedPaymentId,
        selectedPaymentId,
        baseUrl
    } = useContextex();

    const packData = localStorage.getItem('packData');
    const pack = packData ? JSON.parse(packData) : null;

    const pDetails = selectedPackData ? selectedPackData : pack;

    const purchasePackage = async () => {

        if (transactionExecutedRef.current) {
            return;
        }

        setIsPurchasing(true);

        try {

            transactionExecutedRef.current = true;

            const locatData = sessionStorage.getItem("packagedata");
            const parsedData = JSON.parse(locatData);

            const apiData = {
                ...parsedData,
                transaction_id: pDetails?.price > 0 || ['2', '5'].includes(selectedPaymentId) ? transactionId : 0,
            }

            const response = await axios.post(`${baseUrl}user_api/u_package_purchase.php?`, apiData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const toastId = response?.data.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });

            if (response?.data?.ResponseCode === '200') {
                localStorage.setItem('loginUser', JSON.stringify(response.data));
                localStorage.setItem('isPackBuy', response?.data?.UserLogin?.is_subscribe);
                localStorage.removeItem('packageAmnt');
                localStorage.removeItem('paymentName');
                localStorage.removeItem('packId');
                localStorage.removeItem('bookFor');
                localStorage.removeItem('spid');
                localStorage.removeItem('bookFor');
                localStorage.removeItem('payType');
                localStorage.removeItem('packData');
                sessionStorage.removeItem('packagedata');
                navigate('/');
                setTransactionId('');
                setSelectedPaymentId('');
            }
        } catch (error) {
            console.error('Error purchasing package:', error);
        } finally {
            setIsPurchasing(false);
        }
    };

    const transactionExecutedRef = useRef(false);

    useEffect(() => {
        const handleTransaction = async () => {
            if (transactionId) {
                await purchasePackage();
            }
        };

        handleTransaction();
    }, [transactionId]);


    return { performBookPackage: purchasePackage };
};

/* jshint ignore:end */
