/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import React, { useCallback, useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { showToast } from '../showTost';

function InquiryPage() {

    const [, setEnquryData] = useState(null);
    const [inquiryData, setInquiryData] = useState([])

    const { productDetailId, isUserId, bookedProductData, setSendedEnquiry, baseUrl } = useContextex();

    const { t } = useTranslation();

    const handleSendRequest = useCallback(async (event) => {
        event.preventDefault();
        setSendedEnquiry(true);
        try {
            const response = await axios.post(`${baseUrl}user_api/u_enquiry.php?`, {
                uid: isUserId,
                prop_id: productDetailId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setInquiryData(response?.data);
            const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });

        } catch (err) {
            console.error(err.message);
        }
    })

    useEffect(() => {
        if (inquiryData) {
            setEnquryData(inquiryData);
            setSendedEnquiry(false);
        }
    }, [inquiryData]);

    const isEnquiry = bookedProductData?.propetydetails?.is_enquiry;
    const buttonText = isEnquiry === 0
        ? `${t('Contact a Property Owner')}`
        : `${t('Contacted')}`;
    const buttonClass = `tf-button-primary w-full justify-content-center d-flex ${isEnquiry === 0 ? 'style-bg' : ''}`;

    return (
        <>
            <div className="schedule">
                <h4 className="wow fadeInUp justify-content-center d-flex">{t('Inquiry Status')}</h4>
                <div className="button-submit mt-5">
                    <button
                        // disabled={isButtonDisabled}
                        className={buttonClass}
                        onClick={handleSendRequest}
                    >{buttonText}<i className="icon-arrow-right-add"></i></button>
                </div>
            </div>
        </>
    );
}

export default InquiryPage;
/* jshint ignore:end */