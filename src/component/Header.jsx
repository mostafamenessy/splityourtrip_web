/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useContextex } from '../context/useContext';
import LoginPage from '../component/LoginPage';
import { useTranslation } from 'react-i18next';
import { IconMenu2 } from '@tabler/icons-react';

function Header() {
    const navigate = useNavigate();
    const { loginModal, setLoginModal, isUserId, currentPage, loginUserData, baseUrl, loginData, isAdmin } = useContextex();
    const [show, setShow] = useState(false);  // Mobile menu state

    const token = localStorage.getItem('authToken');
    const { logout } = useAuth();
    const isBuyPack = localStorage.getItem("isPackBuy");
    const showAddProperty = localStorage.getItem("addPropertyShow")

    const handleHome = () => {
        navigate('/');
    };

    const { t } = useTranslation();

    const handleDash = () => {
        if (isAdmin) {
            navigate('/');
        } else {
            navigate('/dashboard');
        }
    };

    useEffect(() => {
        if (!loginModal) {
            setShow(false);
        }
    }, [loginModal]);

    const HandleAddProparty = () => {
        setShow(false);

        const localData = localStorage.getItem("loginUser");
        const { UserLogin } = JSON.parse(localData);

        if (UserLogin.is_subscribe === "1" || isAdmin) {
            navigate('/addProparty');
        } else {
            navigate('/package_purchase');
        }

    }

    return (
        <>
            <header id="header_main" className={`header  ${currentPage === 'home' && 'header-fixed type-home1 style-no-bg style-absolute'}`}>

                <div className="header-inner">

                    <div className="header-inner-wrap py-4">

                        <div id="site-logo pointer">
                            <p className='cursor-pointer' rel="home">
                                {currentPage === 'home' ? (
                                    <img id="logo-header" className='pointer w-50 h-50 ' onClick={handleHome} src="../assets/icon/logo-text.png" alt="" />
                                ) : (
                                    <img id="logo-header-mobile " className='pointer w-50 h-50' onClick={handleHome} src="../assets/icon/logo_black.png" alt="" />
                                )}
                            </p>
                        </div>

                        <div className="header-right">
                            {isUserId && token ? (
                                <div onClick={handleDash} className="header-user-login pointer">
                                    <div className="image">
                                        {loginUserData?.UserLogin?.pro_pic ? (
                                            <img
                                                src={`${baseUrl}${loginUserData?.UserLogin?.pro_pic}`}
                                                alt="user profile"
                                            />
                                        ) : (
                                            <img
                                                src="../assets/icon/profile-default.png"
                                                alt="default profile"
                                            />
                                        )}
                                    </div>

                                    <div className={`name ${currentPage === 'home' && 'text-white'} `}>{loginUserData?.UserLogin?.name}</div>
                                </div>
                            ) : (
                                <div onClick={() => setLoginModal(!loginModal)} className={`header-user bg-white "${currentPage !== 'home' && 'style-white'} `}>
                                    <div className="icon">
                                        <i className="flaticon-user"></i>
                                    </div>
                                </div>
                            )}


                            {showAddProperty === "Yes" && isUserId && token && <div className="header-btn">
                                <Link to={isBuyPack === '1' ? '/addProparty' : '/package_purchase'}>
                                    <p className={`tf-button-default cursor-pointer ${currentPage === 'home' && 'style-white'} `}>{t('Add Proparty')}</p>
                                </Link>
                            </div>}

                            {isUserId && token && <div className="header-btn">
                                <p className={`tf-button-default cursor-pointer pointer ${currentPage === 'home' && 'style-white'} `} onClick={logout}>{t('Log Out')}</p>
                            </div>}
                        </div>

                    </div>

                </div>

                <nav id="menu">
                    <nav className="navbar navbar-white bg-white fixed-top" style={{ height: '85px' }}>
                        <div className="container-fluid">
                            <div id="site-logo pointer" className='navbar-brand text-black'>
                                <p className='cursor-pointer' rel="home">
                                    <img id="logo-header-mobile " className='pointer w-50 h-50' onClick={handleHome} src="./assets/icon/logo_black.png" alt="" />
                                </p>
                            </div>

                            {!show && <button onClick={() => setShow(true)} className="navbar-toggler " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon text-black"><IconMenu2 /></span>
                            </button>}

                            <div className="offcanvas offcanvas-end text-bg-dark bg-white rounded" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                                <div className="offcanvas-header">
                                    <h3 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                                        {isUserId && token && (
                                            <div onClick={() => { navigate('/'); setShow(false); }} data-bs-dismiss="offcanvas" className="header-user-login mt-2 flex align-items-center gap-3 ">
                                                <div className="image">
                                                    {loginUserData?.UserLogin?.pro_pic ? (
                                                        <img
                                                            src={`${baseUrl}${loginUserData?.UserLogin?.pro_pic}`}
                                                            alt="user profile"
                                                            style={{ width: '50px', height: '50px' }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src="./assets/icon/profile-default.png"
                                                            alt="default profile"
                                                            style={{ width: '50px', height: '50px' }}
                                                        />
                                                    )}
                                                </div>

                                                <div className={`name ${currentPage === 'home' && 'text-black'} `}>{loginUserData?.UserLogin?.name || loginData?.UserLogin?.name}</div>
                                            </div>
                                        )}
                                    </h3>
                                    <button onClick={() => setShow(false)} type="button" className="btn-close btn-close-black" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>

                                <hr />

                                <div className="offcanvas-body">
                                    <ul className="navbar-nav justify-content-end gap-4 flex-grow-1 pe-3">
                                        <li className="mm-listitem current">
                                            {isUserId && token ? (
                                                <div className="header-btn" onClick={HandleAddProparty}>

                                                    <a data-bs-dismiss="offcanvas" role="button" aria-expanded="false" className='mm-btn mm-btn--next mm-listitem__btn mm-listitem__text '>{t('Add Proparty')}</a>

                                                </div>
                                            ) : (
                                                <div className="header-btn">
                                                    <a className='mm-btn text-danger mm-btn--next mm-listitem__btn mm-listitem__text' onClick={() => setLoginModal(!loginModal)} data-bs-dismiss="offcanvas">{t('Log in')}</a>
                                                </div>
                                            )}
                                        </li>
                                        {isUserId && token && (
                                            <>

                                                <li className="nav-item mm-listitem" onClick={() => { navigate('/dashboard'); setShow(false); }}>
                                                    {isUserId && token && <div className="header-btn">
                                                        <p data-bs-dismiss="offcanvas" className='mm-btn mm-btn--next mm-listitem__btn mm-listitem__text cursor-pointer'>{t('Dashboard')}</p>
                                                    </div>}
                                                </li>

                                                <li className="nav-item mm-listitem">
                                                    {isUserId && token && (
                                                        <div className="header-btn">
                                                            <p className='mm-btn text-danger mm-btn--next mm-listitem__btn mm-listitem__text cursor-pointer' onClick={logout} data-bs-dismiss="offcanvas">{t('Log Out')}</p>
                                                        </div>
                                                    )}
                                                </li>
                                            </>
                                        )}

                                    </ul>

                                </div>

                            </div>
                        </div>
                    </nav>
                </nav>

            </header>

            {loginModal && <div onClick={() => setLoginModal(false)} className="bottem_sheet items-center">
                <div onClick={(e) => e.stopPropagation()} className="login_model">
                    <LoginPage />
                </div>
            </div>}
        </>
    );
}

export default Header;
/* jshint ignore:end */
