/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../LanguageConfig';

function Footer() {
    const [language, setLanguage] = useState("en");
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const { t } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
    }, []);

    const handleHome = () => {
        navigate('/');
    };

    const handleLanguage = (event) => {
        const selectedLang = event.target.dataset.value;
        setLanguage(selectedLang);
        i18n.changeLanguage(selectedLang);
        localStorage.setItem('language', selectedLang);
    };

    return (
        <>
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-inner-wrap">
                        <div className="center-footer">

                            <div className="footer-cl-1">
                                <div className="ft-title">
                                    <div className="logo-footer">
                                        <p>
                                            <img
                                                id="logo-footer"
                                                className='pointer w-50 h-50'
                                                onClick={handleHome}
                                                src="../assets/icon/logo-text.png"
                                                alt=""
                                            />
                                        </p>
                                    </div>
                                </div>
                                <div className="text">{t('A real estate property listing and rental-exchange-buy app is a digital platform')}.</div>
                                <form className="form-subscribe style-line-bottom">
                                </form>
                                <div className="wg-social justify-content-start">
                                    <span>{t('Follow Us')}</span>
                                    <ul className="list-social">
                                        <li><p><i className="icon-facebook"></i></p></li>
                                        <li><p><i className="icon-twitter"></i></p></li>
                                        <li><p><i className="icon-instagram"></i></p></li>
                                        <li><p><i className="icon-linkedin2"></i></p></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="footer-cl-3">
                                <div className="ft-title">{t('Quick Links')}</div>
                                <ul className="navigation-menu-footer">
                                    <li className='pointer' onClick={() => navigate('/contact_us')}><p>{t('Contact')}</p></li>
                                    <li className='pointer' onClick={() => navigate('/faq_list')}><p>{t('Faq')}</p></li>
                                    <li className='pointer' onClick={() => navigate('/privacy_policy')}><p>{t('Privacy Policy')}</p></li>
                                    <li className='pointer' onClick={() => navigate('/terms_and_condition')}><p>{t('Terms')} &amp; {t('Conditions')}</p></li>
                                </ul>
                            </div>

                            <div className="footer-cl-4">
                                <div className="ft-title">{t('Contact Us')}</div>
                                <ul className="navigation-menu-footer">
                                    <li><div className="text">hello@gmail.com (123) 456-7890</div></li>
                                </ul>
                            </div>

                            <div className="footer-cl-5">
                                <div className="ft-title">{t('Our Address')}</div>
                                <ul className="navigation-menu-footer">
                                    <li><div className="text">1234 Elm Street
                                        Springfield, IL 62701
                                        USA</div></li>
                                </ul>
                            </div>

                            <div className="footer-cl-6">
                                <div className="ft-title">{t('Get the app')}</div>
                                <ul className="ft-download">

                                    <li>
                                        <p>
                                            <div className="icon">
                                                <i className="icon-appleinc"></i>
                                            </div>
                                            <div className="app">
                                                <div>{t('Download on the')}</div>
                                                <div>{t('Apple Store')}</div>
                                            </div>
                                        </p>
                                    </li>

                                    <li>
                                        <p>
                                            <div className="icon">
                                                <i className="icon-ch-play"></i>
                                            </div>
                                            <div className="app">
                                                <div>{t('Get in on')}</div>
                                                <div>{t('Google Play')}</div>
                                            </div>
                                        </p>
                                    </li>

                                    <li>
                                        <p className="nice-select justify-center" tabIndex="0">
                                            <span className="current" style={{ color: 'white' }}>Select Language</span>
                                            <ul className="list w-100 lang-drop">
                                                {['en', 'ar', 'hi', 'sp', 'fr', 'gr', 'in', 'sa', 'tu', 'pu'].map((lang) => (
                                                    <li
                                                        key={lang}
                                                        data-value={lang}
                                                        onClick={handleLanguage}
                                                        className={`option w-100 ${language === lang ? 'selected' : ''}`}
                                                    >
                                                        {
                                                            lang === 'en' ? 'English' :
                                                                lang === 'ar' ? 'Arabic' :
                                                                    lang === 'hi' ? 'Hindi' :
                                                                        lang === 'sp' ? 'Spanish' :
                                                                            lang === 'fr' ? 'French' :
                                                                                lang === 'gr' ? 'German' :
                                                                                    lang === 'in' ? 'Indonesian' :
                                                                                        lang === 'sa' ? 'South African' :
                                                                                            lang === 'tu' ? 'Turkish' :
                                                                                                lang === 'pu' ? 'Portuguese' : ''
                                                        }
                                                    </li>
                                                ))}
                                            </ul>
                                        </p>
                                    </li>

                                </ul>
                            </div>

                        </div>

                        <div className="bottom-footer">
                            <div className="text">{t('Copyright')} © {currentYear}. {t('GoProperty')}</div>
                        </div>

                    </div>

                </div>
            </footer>
        </>
    );
}

export default Footer;
/* jshint ignore:end */
