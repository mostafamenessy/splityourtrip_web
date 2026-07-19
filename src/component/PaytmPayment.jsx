/* jshint esversion: 6 */
/* jshint esversion: 11 */

import { useEffect, useState } from 'react';
import { useBookProduct } from '../hooks/useBookProduct';
import { usePackagePurchase } from '../hooks/usePackagePurchase';
import { useContextex } from '../context/useContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const PaytmPayment = ({ product_amount, booked_for }) => {
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();
  const { performBookProduct } = useBookProduct(booked_for = { booked_for });
  const { performBookPackage } = usePackagePurchase();

  const { setTransactionId, transactionId, baseUrl } = useContextex();
  const uid = localStorage.getItem('uid');

  const handlePayment = async () => {
    try {
      const response = await axios.post(`${baseUrl}react_paytm/index.php`, {
        amt: product_amount,
        uid
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response?.data?.ResponseCode === 200) {
        await setPaymentData(response);
      }
    } catch (err) {
      console.error(err.message);
    }
  };


  useEffect(() => {
    handlePayment();
  }, []);

  useEffect(() => {
    if (!paymentData) return;
    makePayment();
  }, [paymentData]);

  const makePayment = () => {
    var config = {
      "root": "",
      "style": {
        "bodyBackgroundColor": "#fafafb",
        "bodyColor": "",
        "themeBackgroundColor": "#0FB8C9",
        "themeColor": "#ffffff",
        "headerBackgroundColor": "#284055",
        "headerColor": "#ffffff",
        "errorColor": "",
        "successColor": "",
        "card": {
          "padding": "",
          "backgroundColor": ""
        }
      },
      "data": {
        "orderId": paymentData?.order_id,
        "token": paymentData?.txnToken,
        "amount": paymentData?.amount,
        "tokenType": "TXN_TOKEN",
      },
      "payMode": {
        "labels": {},
        "filter": {
          "exclude": []
        },
        "order": [
          "CC",
          "DC",
          "NB",
          "UPI",
          "PPBL",
          "PPI",
          "BALANCE"
        ]
      },
      "website": "WEBSTAGING",
      "flow": "DEFAULT",
      "merchant": {
        "mid": paymentData?.mid,
        "redirect": false
      },
      "handler": {
        "transactionStatus":
          function transactionStatus(paymentStatus) {
            setTransactionId(paymentStatus?.BANKTXNID);
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
            setPaymentData();
          },

        "notifyMerchant":
          function notifyMerchant(eventName, data) {
            console.log("Closed");
          }
      }
    };

    if (window.Paytm && window.Paytm.CheckoutJS) {
      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          window.Paytm.CheckoutJS.invoke();
        }).catch(function onError(error) {
          console.log("Error => ", error);
        });
    } else {
      console.log("Paytm CheckoutJS not loaded");
    }

  };

  return null;
};
