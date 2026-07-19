/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useEffect } from 'react';
import { useContextex } from '../context/useContext';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';

function TermsAndCondi() {
    const { userPageList,setCurrentPage } = useContextex();
    const termsAndConditions = userPageList && userPageList.length > 0 ? userPageList[1] : null;
    const { t } = useTranslation();
    useEffect(() => {
        setCurrentPage('terms-condition');
    }, [setCurrentPage]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="main-content px-20 default">

                <div className="space-20"></div>

                <section className="flat-title inner-page">
                    <div className="cl-container full">
                        <div className="row">
                            <div className="col-12">
                                <div className="content">
                                    <h2>{t('Terms & Condition')}</h2>
                                    <div className="text">{t('Based on your view history')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="tf-section vision-mission">
                    <div className="cl-container">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="wow fadeInUp my-5">{termsAndConditions?.title}</h2>
                                <p className="wow fadeInUp" dangerouslySetInnerHTML={{ __html: termsAndConditions?.description }} />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            <Footer/>
        </>
    )
}

export default TermsAndCondi
/* jshint ignore:end */
