/* jshint esversion: 6 */
/* jshint esversion: 11 */

import { useEffect } from 'react';
import { useContextex } from '../context/useContext';
import axios from 'axios';

function PaymentList() {
    const { setPaymentGatwayList, baseUrl } = useContextex();

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_paymentgateway.php?`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setPaymentGatwayList(response?.data?.paymentdata)
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, []);

}

export default PaymentList;
