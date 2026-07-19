/* jshint esversion: 6 */
/* jshint esversion: 8 */

import { useEffect } from 'react';
import { useContextex } from '../context/useContext';
import axios from 'axios';

export const KhaltiPayment = ({ product_amount, booked_for }) => {
  localStorage.setItem('bookFor', booked_for);
  const {
    baseUrl,
  } = useContextex();

  const handlePayment = async () => {
    try {
      const response = await axios.post(`${baseUrl}react_khalti/index.php`, {
        amt: product_amount,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response?.data.ResponseCode === '200') {
        window.location.href = response?.data?.payment_url;
      }
      console.log('response', response?.data)
    } catch (err) {
      console.error(err.message);
    }

  }


  useEffect(() => {
    handlePayment();
  }, [handlePayment]);

  return null;
};
