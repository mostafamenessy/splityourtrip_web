/* jshint esversion: 6 */
/* jshint esversion: 8 */

import  { useEffect } from 'react';
import { loadExternalScript } from '../loadExternalScript';

export const MercadoPagoPayment = ({ product_amount, product_name, attributes }) => {
  useEffect(() => {
    const initializePayment = () => {
      const publicKey = attributes?.split(',')[0];
      const mp = new window.MercadoPago(publicKey, {
        locale: 'en-US',
      });

      const createPreference = async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('TEST-PREFERENCE-ID');
          }, 1000);
        });
      };

      createPreference().then((preferenceId) => {
        mp.checkout({
          preference: {
            id: preferenceId,
          },
          render: {
            container: '#payment-container',
            label: 'Pay with MercadoPago',
          },
        });
      }).catch(error => {
        console.error('Error creating preference:', error);
      });
    };

    loadExternalScript('https://sdk.mercadopago.com/js/v2')
      .then(initializePayment)
      .catch((error) => console.error(error.message));
  }, [product_amount, product_name, attributes]);

  return null;
};
