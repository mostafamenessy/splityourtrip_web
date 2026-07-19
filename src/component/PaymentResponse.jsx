/* jshint esversion: 6 */

import { useContextex } from '../context/useContext';
import { usePackagePurchase } from '../hooks/usePackagePurchase';
import { useBookProduct } from '../hooks/useBookProduct';
import { useWalletPay } from '../hooks/useWalletPay';

export const PaymentResponse = () => {
    const { setTransactionId, transactionId, paymentFor } = useContextex();
    const bookFor = localStorage.getItem('bookFor');
    const { performBookProduct } = useBookProduct(bookFor);
    const { performBookPackage } = usePackagePurchase(bookFor);
    const { performWallet } = useWalletPay(bookFor);

    const location = window.location.href;

    const url = new URL(location);

    const statusCode = url.searchParams.get('status_code');
    const OrderId = url.searchParams.get('order_id');
    const TransId = url.searchParams.get('transaction_id');
    const statusCode2 = url.searchParams.get('status');

    if (statusCode === "200" || statusCode2 === "Completed") {

        setTransactionId(OrderId || TransId);


        switch (paymentFor) {
            case 'booking':
                if (transactionId) performBookProduct();
                break;
            case 'package':
                if (transactionId) performBookPackage();
                break;
            case 'wallet':
                if (transactionId) performWallet();
                break;
            default:
                break;
        }
    } else {
        switch (paymentFor) {
            case 'booking':
                console.log('booking was not done');
                break;
            case 'package':
                console.log('booking was not done');
                break;
            case 'wallet':
                console.log('booking was not done');
                break;
            default:
                break;
        }
    }

    return null;
};

