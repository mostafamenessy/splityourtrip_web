/* jshint esversion: 6 */

import { useEffect } from 'react';
import { useContextex } from '../context/useContext';

export const PaymobPayment = ({ product_amount, booked_for }) => {

  const { baseUrl } = useContextex();

  const newAmount = Math.round(product_amount);
  localStorage.setItem('bookFor', booked_for);

  const handleCheckout = () => {
    const localData = localStorage.getItem('loginUser');
    const { UserLogin } = JSON.parse(localData || '{}');

    const params = new URLSearchParams({
      amt: newAmount,
      email: UserLogin?.email || '',
      name: UserLogin?.name || '',
      phone: `${UserLogin?.ccode || ''}${UserLogin?.mobile || ''}`,
    });

    window.location.href = `${baseUrl}paymob/index.php?${params.toString()}`;
  };

  useEffect(() => {
    if (newAmount) {
      handleCheckout();
    }
  }, []);

  return null;

};

export default PaymobPayment;
