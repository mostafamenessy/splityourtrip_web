/* jshint esversion: 6 */

import { useEffect } from 'react';

export const PayfastPayment = ({ product_amount, product_name, booked_for, attributes }) => {

  const newAmount = Math.round(product_amount);
  localStorage.setItem('bookFor', booked_for);

  const handleCheckout = () => {
    const paymentData = {
      merchant_id: attributes?.split(',')[1],
      merchant_key: attributes?.split(',')[0],
      amount: newAmount,
      item_name: 'Test Item' || product_name,
      return_url: window.location.origin + "/payment_success",
      cancel_url: window.location.origin + '/package_cancel',
      notify_url: 'https://yournotificationurl.com',
    };

    const form = document.createElement('form');
    form.action = 'https://sandbox.payfast.co.za/eng/process';
    form.method = 'POST';

    Object.keys(paymentData).forEach(key => {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = paymentData[key];
      form.appendChild(hiddenField);
    });

    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    if (newAmount) {
      handleCheckout();
    }
  }, []);

  return null;

};

export default PayfastPayment;
