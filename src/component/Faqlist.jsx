/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FAQItem = ({ question, answer, isActive, onClick }) => {

    return (
        <div className={`flat-toggle ${isActive ? 'active' : ''}`}>
            <h4 className={`toggle-title ${isActive ? 'active' : ''}`} onClick={onClick}>
                {question}
            </h4>
            {isActive && (
                <div >
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

export const Faqlist = () => {
    const { isUserId, baseUrl } = useContextex();
    const { t } = useTranslation();
    const [faqList, setFaqList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_faq.php`, {
                    uid: isUserId || '0',
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === "200") {
                    setFaqList(response?.data?.FaqData);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [isUserId]);

    const handleToggle = (index) => {
        setActiveIndex(prevIndex => (prevIndex === index ? null : index));
    };

    return (
        <>
            <div className="main-content px-20 default">
                <div className="space-20"></div>
                <section className="flat-title inner-page">
                    <div className="cl-container full">
                        <div className="row">
                            <div className="col-12">
                                <div className="content">
                                    <h2>{t('Frequently asked questions')}</h2>
                                    <ul className="breadcrumbs">
                                        <li><p className='cursor-pointer pointer' onClick={() => navigate('/')}>{t('Home')}</p></li>
                                        <li>/</li>
                                        <li>{t('Frequently asked questions')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="tf-section flat-question style-1">
                    <div className="cl-container">
                        <div className="row">
                            <div className="col-12">
                                <div className="heading-section text-center">
                                    <h2 className="wow fadeInUp">{t('Helps & FAQs')}</h2>
                                    <div className="text wow fadeInUp">{t('Lorem ipsum dolor sit amet, consectetur adipiscing elit')}.</div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="widget-tabs style-1">
                                    <div className="widget-content-tab">
                                        <div className="widget-content-inner active">
                                            {faqList?.map((item, index) => (
                                                <div className="flat-accordion">
                                                    <FAQItem
                                                        key={item?.id}
                                                        question={item?.question}
                                                        answer={item?.answer}
                                                        isActive={index === activeIndex}
                                                        onClick={() => handleToggle(index)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};
/* jshint ignore:end */
