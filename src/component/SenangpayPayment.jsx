/* jshint esversion: 6 */
/* jshint esversion: 9 */

import { useEffect, useState } from 'react';

function SenangpayPayment({ product_amount, attributes }) {
  const [paymentData] = useState({
    email: 'text@gmail.co',
    phone: '911111111111',
  });


  const handlePayment = () => {
    const paymentParams = {
      merchant_id: attributes?.split(',')[0],
      payment_id: Date.now(),
      amount: product_amount,
      currency: 'EUR', 
      email: paymentData.email,
      phone: paymentData.phone,
      redirect_url: `${window.location.origin}`, 
      return_url: `${window.location.origin}`, 
      hash: generateHash(attributes?.split(',')[1], product_amount, 'EUR')
    };

    const queryString = new URLSearchParams(paymentParams).toString();
    window.location.href = `https://sandbox.senangpay.my/payment/${paymentParams.merchant_id}?${queryString}`;
  };

  const generateHash = (apiKey, amount, currency) => {
    return btoa(`${apiKey}:${amount}:${currency}`);
  };

  useEffect(() => {
    handlePayment();
  },[]);

  return null;
}

export default SenangpayPayment;
