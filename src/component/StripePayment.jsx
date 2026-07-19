/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { usePackagePurchase } from '../hooks/usePackagePurchase';
import { useBookProduct } from '../hooks/useBookProduct';
import { useContextex } from '../context/useContext';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const SplitForm = ({ product_amount, booked_for }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const { performBookProduct } = useBookProduct({ booked_for });
  const { performBookPackage } = usePackagePurchase();
  const { bookedOtherUserData, loginUserData, setTransactionId, transactionId, baseUrl } = useContextex();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const number = cardNumber.replace(/\s+/g, '');
    const [month, year] = expiry.split("/");

    try {
      const response = await axios.post(`${baseUrl}react_stripe/token.php`, {
        card_number: number,
        exp_month: month,
        exp_year: `20${year}`,
        cvc,
        custName: bookedOtherUserData?.firstName || loginUserData?.UserLogin?.name,
        custEmail: bookedOtherUserData?.email || loginUserData?.UserLogin?.email,
        amount: product_amount,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response?.data?.Result === "true") {
        setTransactionId(response?.data?.Transaction_id);

        switch (booked_for) {
          case 'booking':
            if (transactionId) await performBookProduct();
            break;
          case 'package':
            if (transactionId) await performBookPackage();
            break;
          case 'wallet':
            if (transactionId) navigate('/dashboard');
            break;
          default:
            break;
        }

      }

      return response;
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value;
    const cleanedValue = value.replace(/\D/g, '');
    const formattedValue = cleanedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/\D/g, '');
    const formattedValue = cleanedValue.replace(/(\d{2})(?=\d)/g, '$1/');
    setExpiry(formattedValue);
  };

  return (
    <form>

      <label>
        <p className="text-18 font-500">Card number</p>
        <input
          type="text"
          placeholder="1234 1234 1234 1234"
          value={cardNumber}
          onChange={handleCardNumberChange}
          maxLength="19"
          className="border-2 w-full outline-none py-3 px-5 rounded-5 mt-4 place-text"
        />
      </label>

      <div className="flex justify-between gap-5 items-center ">
        <label>
          <p className="text-18 font-500">Expiration date</p>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            maxLength="5"
            className="border-2 w-full outline-none py-3 px-5 rounded-5 mt-4 place-text "
          />
        </label>

        <label>
          <p className="text-18 font-500">CVC</p>
          <input
            type="number"
            onChange={(e) => setCvc(e.target.value)}
            placeholder="CVC"
            className="border-2 w-full outline-none py-3 px-5 rounded-5 mt-4 place-text"
          />
        </label>

      </div>
      <button onClick={handleSubmit} className="mt-20 bg-primary text-black text-18 py-3 text-white rounded-5">
        Pay {product_amount ? `$${product_amount}` : ""}
      </button>
    </form>
  );
};

export const StripePayment = ({ product_amount, booked_for, attributes }) => {
  const [, setElementFontSize] = useState(() =>
    window.innerWidth < 450 ? "14px" : "18px"
  );

  const stripePromise = loadStripe(attributes?.split(',')[0]);
  useEffect(() => {
    const handleResize = () => {
      setElementFontSize(window.innerWidth < 450 ? "14px" : "18px");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <Elements stripe={stripePromise}>
        <SplitForm product_amount={product_amount} booked_for={booked_for} />
      </Elements>
    </div>
  );
};

/* jshint ignore:end */
