/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { createContext } from "react";
import { showToast } from "../showTost";

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {

    const buyProperty = async () => {
        // const propResponse = localStorage.getItem('bookProResp');
        // if (!propResponse) return;
        // showToast({ title: propResponse, id: "success" });
    };

    const walletPayment = async () => {
        // const walletResponse = localStorage.getItem('walletresponse');
        // if (!walletResponse) return;
        // showToast({ title: walletResponse, id: "success" });
    };

    const payForPackage = async () => {
        // const walletResponse = localStorage.getItem('packResp');
        // if (!walletResponse) return;
        // showToast({ title: walletResponse, id: "success" });

    };

    const paymentFailedCase = async () => {
        alert('Oops! Payment failed. Please try again.');
    };

    return (
        <>
            <PaymentContext.Provider value={{ walletPayment, buyProperty, payForPackage, paymentFailedCase }}>
                {children}
            </PaymentContext.Provider>
        </>
    );
};

/* jshint ignore:end */
