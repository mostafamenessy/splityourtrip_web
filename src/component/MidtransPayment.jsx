/* jshint esversion: 6 */
/* jshint esversion: 8 */

import { useEffect } from 'react';
import { useContextex } from '../context/useContext';
import axios from 'axios';

export const MidtransPayment = ({ product_amount, booked_for }) => {
  const { bookedOtherUserData, loginUserData, setPaymentFor, setPaymentResp, baseUrl } = useContextex();
  localStorage.setItem('bookFor', booked_for);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const response = await axios.post(`${baseUrl}react_midtrans/index.php`, {
          phone: bookedOtherUserData?.phone || loginUserData?.UserLogin?.mobile,
          name: bookedOtherUserData?.firstName || loginUserData?.UserLogin?.name,
          email: bookedOtherUserData?.email || loginUserData?.UserLogin?.email,
          amt: product_amount,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response?.data)
        setPaymentResp(response?.data);
        if (response?.data.ResponseCode === '200') {
          window.location.href = response?.data?.payment_url;
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchDataAsync();
  }, [booked_for, product_amount, setPaymentFor, setPaymentResp]);


  return null;
};
