/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import { Link } from 'react-router-dom';
import { IconArrowBackUp, IconEye, IconPhotoPlus } from '@tabler/icons-react';
import AddPropartyForm from './AddPropartyForm';
import AddImages from './AddImages';
import AddGalaryImage from './AddGalaryImage';
import AddGalleryCategory from './AddGalleryCategory';
import { ReModal } from '../component/ReModal';
import Receipt from './Receipt';
import $ from 'jquery';
import { useTranslation } from 'react-i18next';
import Chat from '../component/Chat';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import { showToast } from '../showTost';

const TabHeader = ({ tabList }) => {
    return (
        <>
            <div className="head">
                {
                    tabList?.map((item) => (

                        <div className="item">
                            <div className="text">{item}</div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

const TopLeftBar = ({ topText, bottomText }) => {
    return (
        <div className='col-sm-9 col-6 col-xs-9 col-md-8 col-lg-10 '>
            <h3>{topText}</h3>
            <div className="text-content">{bottomText}</div>
        </div>
    )
}

const Dashboard = ({ userDashboardDetails, dashCard }) => {
    const { baseUrl, userCurrency, setSelectedTab, loginUserData } = useContextex();
    const { t } = useTranslation();

    const [loading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className='d-flex mob-dash flex-col  pt-5 pb-5'>
                        <div className='col-10'>
                            <h3>{t('Hello')} {loginUserData?.UserLogin?.name}</h3>
                            <div className="text-content">{t('We are glad to see you again!')}</div>
                        </div>
                    </div>
                    <div className="grid-section-4 mb-20 ">
                        {dashCard?.map((item, index) => (

                            <div className="wg-box pointer" key={index} onClick={() => setSelectedTab(item?.title)}>
                                <div className="box-icon style-1 type-row">
                                    <div className="content">
                                        <p className="title"><span className='text-success'>{item?.title === 'My Earning' || item?.title === 'My Payout' ? userCurrency : null}</span>{item?.report_data}</p>
                                        <div className="text-content">{item?.title}</div>
                                    </div>
                                    <div className="icon">
                                        <img src={`${baseUrl}${item?.url}`} alt={item?.title} />
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>}
        </div>
    )
}

const MYProperty = ({ setEditAddPropertyData, setShowAddPropertyData, handleBackButton, editAddPropertyData, showAddPropertyData }) => {

    const { t } = useTranslation();
    const { baseUrl, setEditSelectedProperty, setIsEditSelectedProperty, userPropertyList, selectedTab, isAdmin } = useContextex();


    const myTabHeader = [t('Listing Title'), t('Type'), t('Rate'), t('Sqrft'), t('Action')]

    const [loading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div>
                    <div className='d-flex mob-dash flex-col col-12 pt-5 pb-5'>

                        <TopLeftBar
                            topText={t('My Property')}
                            bottomText={t('We are glad to see you again!')}
                        />

                        {showAddPropertyData || editAddPropertyData ? (
                            <div onClick={handleBackButton} className='position-absolute ' style={{ right: '20px' }}>
                                <Link to={isAdmin ? `/${selectedTab}/add` : `/addProparty/${selectedTab}/add`}>
                                    <button onClick={() => { setIsEditSelectedProperty(false); setShowAddPropertyData(true) }} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px] flex items-center gap-[10px]'>{t('Back')} <IconArrowBackUp /></button>
                                </Link>
                            </div>
                        ) : (
                            <div className='position-absolute ' style={{ right: '20px' }}>
                                <button onClick={() => { setIsEditSelectedProperty(false); setShowAddPropertyData(true) }} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px]'>{t('Add Property')}</button>
                            </div>
                        )}
                    </div>
                    {showAddPropertyData || editAddPropertyData ? (
                        <div>
                            <AddPropartyForm />
                        </div>
                    ) : (

                        <div className='wg-box pl-44 pr-29 '>
                            <div className="table-listing-properties mb-40">

                                <TabHeader tabList={myTabHeader} />

                                <ul>
                                    {userPropertyList?.map((item, index) => (
                                        <li key={index}>
                                            <div className="my-properties-item item">
                                                <div>
                                                    <div className="property">
                                                        <div className="image-container">
                                                            <img className="image" src={`${baseUrl}${item.image}`} alt={item?.title} />

                                                            <div className="overlay list-tags">
                                                                {item?.is_sell === 1 ? (
                                                                    <p className="tags-item for-sell bg-white text-success">{t('SOLD')}</p>
                                                                ) : (
                                                                    <p className="tags-item for-sell bg-white text-primary " >{item?.buyorrent === 2 ? 'BUY' : 'SALE'}</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="price">${item?.price}</div>
                                                            <div className="title">
                                                                <p>{item?.title}</p>
                                                            </div>
                                                            <div className="location">
                                                                <div className="icon">
                                                                    <i className="flaticon-location"></i>
                                                                </div>
                                                                <p>{item?.address}</p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div>
                                                    <p>{item?.property_type}</p>
                                                </div>
                                                <div>
                                                    <div className="box-status">{item?.rate}</div>
                                                </div>
                                                <div>
                                                    <p>{item?.sqrft}</p>
                                                </div>
                                                <div>
                                                    <ul className="wg-icon" onClick={() => {
                                                        setEditSelectedProperty(item);
                                                        setIsEditSelectedProperty(true);
                                                        setEditAddPropertyData(true);
                                                    }}>
                                                        {item.is_sell !== '1' && (
                                                            <li className="edit-btns">
                                                                <i className="flaticon-edit"></i>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    ))}

                                    {userPropertyList?.length === 0 && (
                                        <div style={{ height: "420px" }} className='align-items-center flex-column justify-content-center mt-5 d-flex '>
                                            <h6 className='empty-message'>{t('Sorry, there is no any nearby')}</h6>
                                            <h6 className='empty-message'>{t('category or data not found')}</h6>
                                        </div>
                                    )}

                                </ul>
                            </div>
                        </div>

                    )}
                </div>}
        </>
    )
}

const MYExtraImage = ({ setShowEditExtaImage, setShowAddExtaImage, handleBackButton, showEditExtaImage, showAddExtaImage }) => {
    const { baseUrl, setIsEditSelectedProperty, setEditSelectedImage, setEditSelectedMyGallaryImage, dashboardTabData, selectedTab, isAdmin } = useContextex();
    const { t } = useTranslation();
    const myTabHeader = [t('Listing Title'), t('Action')];

    const [loading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div>
                    <div className='d-flex mob-dash col-12 flex-col pt-5 pb-5'>

                        <TopLeftBar
                            topText={t('My Extra Image')}
                            bottomText={t('We are glad to see you again!')}
                        />

                        {showAddExtaImage || showEditExtaImage ? (

                            <div className='position-absolute' style={{ right: '20px' }} onClick={handleBackButton}>
                                <Link to={isAdmin ? `/${selectedTab}/add` : `/addProparty/${selectedTab}/add`} onClick={() => { setIsEditSelectedProperty(false); setShowAddExtaImage(false) }}>
                                    <button className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px] flex items-center gap-[10px]'>{t('Back')} <IconArrowBackUp /></button>
                                </Link>
                            </div>
                        ) : (
                            <div className='position-absolute' style={{ right: '20px' }} onClick={() => { setEditSelectedMyGallaryImage(false); setShowAddExtaImage(true); setIsEditSelectedProperty(false) }}>
                                <button className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px]'>{t('Add Extra Image')}</button>
                            </div>
                        )}

                    </div>


                    {showAddExtaImage || showEditExtaImage ? (
                        <div className='wg-box pl-44 pr-29'>
                            <div className='d-flex justify-content-between'>
                                <h4>{t('Basic Information')}</h4>
                            </div>
                            <AddImages />
                        </div>
                    ) : (

                        <div className="wg-box pl-44 ">
                            {showAddExtaImage ? (<AddImages />) : showEditExtaImage ? (<AddImages />) : (
                                <div className="table-listing-properties mb-40">
                                    <TabHeader tabList={myTabHeader} />

                                    <ul>
                                        {dashboardTabData?.extralist?.map((item, index) => (
                                            <>
                                                <div key={index} className="my-properties-item item">
                                                    <div className="d-flex m-3">
                                                        <div className="d-flex items-center gap-4 w-100">
                                                            <img className='w-[75px] h-[75px] object-cover rounded-[5px]' src={`${baseUrl}${item?.image}`} alt={`${item?.property_title} ${item?.id}`} />
                                                            <p className="m-2">{item?.property_title}</p>
                                                        </div>
                                                    </div>
                                                    <hr></hr>
                                                    <div>
                                                        <ul className="wg-icon" onClick={() => {
                                                            setEditSelectedImage(item);
                                                            setShowEditExtaImage(true);
                                                            setIsEditSelectedProperty(true)
                                                        }}>
                                                            <li className="edit-btns">
                                                                <i className="flaticon-edit"></i>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>
                                        ))}

                                        {dashboardTabData?.extralist?.length === 0 && (
                                            <div style={{ height: "420px" }} className='align-items-center flex-column justify-content-center mt-5 d-flex '>
                                                <h6 className='empty-message'>{t('Sorry, there is no any nearby')}</h6>
                                                <h6 className='empty-message'>{t('category or data not found')}</h6>
                                            </div>
                                        )}

                                    </ul>

                                    {/* <div className='flex align-items-center justify-content-center h-100' >
                                    {loading && (
                                        <div className="preload preload-container" >
                                            <div className="middle"></div>
                                        </div>
                                    )}
                                </div> */}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            }
        </>
    )
}

const MYGAlImage = ({ setShowEditGalaryImages, handleBackButton, setShowAddGalaryImages, showEditGalaryImages, showAddGalaryImages }) => {

    const { baseUrl, setIsEditSelectedProperty, setEditSelectedMyGallaryImage, dashboardTabData, selectedTab, isAdmin } = useContextex();
    const { t } = useTranslation();
    const myTabHeader = [t('Listing Title'), t('Action')];

    const [loading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div>
                    <div className='d-flex flex-col col-12 mt-5  pb-5 gal-img-top' >
                        <TopLeftBar
                            topText={t('My Galary Image')}
                            bottomText={t('We are glad to see you again!')}
                        />

                        {showAddGalaryImages || showEditGalaryImages ? (
                            <div className='position-absolute' style={{ right: '20px' }} onClick={handleBackButton}>
                                <Link to={isAdmin ? `/${selectedTab}/add` : `/addProparty/${selectedTab}/add`}>
                                    <button onClick={() => { setIsEditSelectedProperty(false); setShowAddGalaryImages(true) }} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px] flex items-center gap-[10px]'>{t('Back')} <IconArrowBackUp /></button>
                                </Link>
                            </div>
                        ) : (
                            <div className='position-absolute' style={{ right: '20px' }}>
                                <button onClick={() => { setIsEditSelectedProperty(false); setShowAddGalaryImages(true) }} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px]'>{t('Add Gallery image')}</button>
                            </div>
                        )}
                    </div>
                    {showAddGalaryImages || showEditGalaryImages ? (
                        <div className='wg-box pl-44 pr-29'>
                            <div className='d-flex justify-content-between'>
                                <h4>{t('Basic Information')}</h4>
                            </div>
                            <AddGalaryImage />
                        </div>
                    ) : (
                        <div className="wg-box pl-44">
                            {showAddGalaryImages ? (<AddGalaryImage />) : showEditGalaryImages ? (<AddGalaryImage />) : (
                                <div className="table-listing-properties mb-40">
                                    <TabHeader tabList={myTabHeader} />
                                    <ul>
                                        {dashboardTabData?.gallerylist?.map((item, index) => (
                                            <>
                                                <div className="my-properties-item item" key={index}>
                                                    <div className="d-flex m-3" >
                                                        <div className="d-flex items-center w-100">
                                                            <div className='btn'>
                                                                <img src={`${baseUrl}${item?.image}`} alt={`${item?.property_title}`} className='w-[75px] h-[75px] rounded' />
                                                            </div>
                                                            <div>
                                                                <h6 style={{ fontWeight: "500" }} className="m-2">{item?.property_title}</h6>
                                                                <h6 style={{ fontWeight: "400", fontSize: "15px" }} className="m-2">{item?.category_title}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div onClick={() => {
                                                            setEditSelectedMyGallaryImage(item);
                                                            setIsEditSelectedProperty(true);
                                                            setShowEditGalaryImages(true)
                                                        }}>
                                                            <ul className="wg-icon">
                                                                <li className="edit-btns">
                                                                    <i className="flaticon-edit"></i>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                        {dashboardTabData?.gallerylist?.length === 0 && (
                                            <div style={{ height: "420px" }} className='align-items-center flex-column justify-content-center mt-5 d-flex '>
                                                <h6 className='empty-message'>{t('Sorry, there is no any nearby')}</h6>
                                                <h6 className='empty-message'>{t('category or data not found')}</h6>
                                            </div>
                                        )}

                                    </ul>

                                    {/* <div className='flex align-items-center justify-content-center h-100' >
                                    {loading && (
                                        <div className="preload preload-container" >
                                            <div className="middle"></div>
                                        </div>
                                    )}
                                </div> */}
                                </div>
                            )}
                        </div>
                    )}
                </div>}
        </>
    )
}

const MYGalCat = ({ setShowEditGalaryCategory, setShowAddGalaryCategory, handleBackButton, showEditGalaryCategory, showAddGalaryCategory }) => {
    const { setIsEditSelectedProperty, dashboardTabData, setEditSelectedMyGallaryCategory, selectedTab, isAdmin } = useContextex();
    const { t } = useTranslation();
    const myTabHeader = [t('Listing Title'), t('Action')]
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div>
                    <div className='d-flex mob-dash col-12 flex-col pt-5 pb-5'>

                        <TopLeftBar
                            topText={t('My Galary Categories')}
                            bottomText={t('We are glad to see you again!')}
                        />
                        {showAddGalaryCategory || showEditGalaryCategory ? (
                            <div className='position-absolute' style={{ right: '20px' }} onClick={handleBackButton}>
                                <Link to={isAdmin ? `/${selectedTab}/add` : `/addProparty/${selectedTab}/add`}>
                                    <button onClick={() => { setIsEditSelectedProperty(true); setShowAddGalaryCategory(false) }} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px] flex items-center gap-[10px]'>{t('Back')} <IconArrowBackUp /></button> {/* <p className="tf-button-primary style-black active" onClick={() => { setIsEditSelectedProperty(false); setShowAddGalaryCategory(false) }}> {t('Back')} <IconArrowBackUp /></p> */}
                                </Link>
                            </div>
                        ) : (
                            <div className='position-absolute' style={{ right: '20px' }}>
                                <button onClick={() => { setIsEditSelectedProperty(false); setShowAddGalaryCategory(true) }} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px]'>{t('Add Gallery Category')}</button>
                            </div>
                        )}
                    </div>
                    {showAddGalaryCategory || showEditGalaryCategory ? (
                        <div className='wg-box pl-44 pr-29 '>
                            <div className='d-flex justify-content-between'>
                                <h4>{t('Basic Information')}</h4>
                            </div>
                            <AddGalleryCategory />
                        </div>
                    ) : (
                        <div className="wg-box pl-44">
                            {showAddGalaryCategory ? (<AddGalleryCategory />) : showEditGalaryCategory ? (<AddGalleryCategory />) : (
                                <div className="table-listing-properties mb-40">
                                    <TabHeader tabList={myTabHeader} />
                                    <ul>
                                        {dashboardTabData?.galcatlist?.map((item, index) => (
                                            <li key={index}>
                                                <div className="my-properties-item item">
                                                    <div>
                                                        <div className="property">
                                                            <div className="image" style={{ height: '75px', width: '75px' }}>
                                                                <div className="btn border h-100 w-100 bg-primary text-white d-flex align-items-center justify-content-center">
                                                                    <IconPhotoPlus />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="price">{item?.property_title}</div>
                                                                <div className="title">
                                                                    <p>{item?.cat_title}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div onClick={() => {
                                                        setIsEditSelectedProperty(true);
                                                        setEditSelectedMyGallaryCategory(item)
                                                        setShowEditGalaryCategory(true)
                                                    }}>
                                                        <ul className="wg-icon">
                                                            <li className="edit-btns">
                                                                <i className="flaticon-edit"></i>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                </div>
                                            </li>
                                        ))}

                                        {dashboardTabData?.galcatlist?.length === 0 && (
                                            <div style={{ height: "420px" }} className='align-items-center flex-column justify-content-center mt-5 d-flex '>
                                                <h6 className='empty-message'>{t('Sorry, there is no any nearby')}</h6>
                                                <h6 className='empty-message'>{t('category or data not found')}</h6>
                                            </div>
                                        )}

                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>}
        </>
    )
}

const MYBooking = ({ setShowReceiptTab, activeTabData, setActiveTab, activeTab, handleBackButton, showReceiptTab }) => {
    const { baseUrl, setBookingId, setComplateCurrentBook, setConfirmCurrentBook, selectedTab, isAdmin, currentPage } = useContextex();
    const { t } = useTranslation();
    const myTabHeader = [t('Listing Title'), t('Total Day'), t('Status'), t('P_Status'), t('Action')];

    const [loading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleShowReceipt = (bookId, isComplete) => {
        setBookingId(bookId);
        setConfirmCurrentBook(isComplete && currentPage === 'addproparty' ? false : true);
        setComplateCurrentBook(isComplete);
        setShowReceiptTab(true);
    };

    const renderTabContent = () => {

        if (showReceiptTab && selectedTab === 'My Booking') {
            return <Receipt />;
        }

        return (

            <div className="table-listing-properties mb-40">
                <div className="widget-tabs style-2">
                    <ul className="widget-menu-tab">
                        <li
                            className={`item-title ${activeTab === 'active' ? 'active' : ''}`}
                            onClick={() => handleTabClick('active')}
                        >
                            <span className="inner">{t('Current Booking')}</span>
                        </li>
                        <li
                            className={`item-title ${activeTab === 'completed' ? 'active' : ''}`}
                            onClick={() => handleTabClick('completed')}
                        >
                            <span className="inner">{t('Completed')}</span>
                        </li>
                    </ul>
                </div>

                <TabHeader tabList={myTabHeader} />

                <ul>
                    {activeTabData?.map((item, index) => (
                        <li key={index}>
                            <div className="my-properties-item item">
                                <div className="property">
                                    <div className="image booking-image h-100 w-100">
                                        <img src={`${baseUrl}${item?.prop_img}`} alt={item?.prop_title} />
                                    </div>
                                    <div>
                                        <div className="price">${item?.prop_price}</div>
                                        <div className="title">
                                            <p>{item?.prop_title}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p>{item?.total_day} {t('Days')}</p>
                                </div>
                                <div>
                                    <div className="box-status">{item?.book_status}</div>
                                </div>
                                <div>
                                    <p>{item?.p_method_id === '2' ? 'Unpaid' : 'Paid'}</p>
                                </div>
                                <div>
                                    <ul className="wg-icon" onClick={() => handleShowReceipt(item?.book_id, activeTab === 'completed')}>
                                        <li className="p-3 edit-btns">
                                            <IconEye className='Svg' />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    ))}

                    {activeTabData?.length === 0 && (
                        <div style={{ height: "350px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                            <div>
                                <h4 className='empty-message'>{t('Go & Book your favorite service')}</h4>
                            </div>
                        </div>
                    )}

                </ul>
            </div>
        );
    };

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className='d-flex col-12 mob-dash pt-5 pb-5'>
                        <TopLeftBar topText={'My Booking'} bottomText={t('We are glad to see you again!')} />

                        {showReceiptTab && selectedTab === 'My Booking' && (
                            <div onClick={handleBackButton}>
                                <Link to={isAdmin ? `/${selectedTab}/add` : `/addProparty/${selectedTab}/add`}>
                                    <button onClick={() => setShowReceiptTab(false)} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px] flex items-center gap-[10px]'>{t('Back')} <IconArrowBackUp /></button>
                                </Link>
                            </div>
                        )}

                    </div>
                    <div className="wg-box pl-44 pr-29">
                        {renderTabContent()}
                    </div>
                </div>}
        </>
    );
};

const MYEnquiry = () => {
    const { baseUrl, dashboardTabData } = useContextex();
    const { t } = useTranslation();
    const myTabHeader = [t('Listing Title'), t('Name'), t('Mobile Number')];

    const [loading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className='d-flex mob-dash flex-col col-12 pt-5 pb-5'>
                        <TopLeftBar
                            topText={t('My Enquiry')}
                            bottomText={t('Your Enquiry Data')}
                        />
                    </div>
                    <div className="wg-box pl-44 pr-29 ">
                        <div className="table-listing-properties mb-40">
                            <TabHeader tabList={myTabHeader} />
                            <ul>
                                {dashboardTabData?.EnquiryData?.map((item, index) => (
                                    <>
                                        <div className="my-properties-item item" key={index}>
                                            <div key={index} className="d-flex m-3">
                                                <div className="d-flex w-100">
                                                    <img className='rounded ' style={{ height: '75px', width: '75px' }} src={`${baseUrl}${item?.image}`} alt={item?.title} />
                                                    <div className='d-flex justify-content-center align-items-center'>
                                                        <h6 className="m-2">{item?.title}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-3 blog__popular__single-content ">
                                                <p>{item?.name}</p>
                                            </div>
                                            <div className=" col-6 blog__popular__single-content ">
                                                <p>{item?.mobile}</p>
                                            </div>
                                        </div>
                                    </>
                                ))}

                                {dashboardTabData?.EnquiryData?.length === 0 && (
                                    <div style={{ height: "430px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                        <div>
                                            <h4 className='empty-message'>{t('Go & Book your favorite service')}</h4>
                                        </div>
                                    </div>
                                )}

                            </ul>

                        </div>

                    </div>
                </div>}
        </>
    )
}

const MYEarning = ({
    myEarningData,
    userCurrency,
    userDashboardDetails,
    setShowReceiptTab,
    showReceiptTab,
    handleBackButton,
}) => {
    const { t } = useTranslation();
    const myTabHeader = [t('Listing Title'), t('Total Day'), t('Status'), t('P_Status'), t('Action')];
    const { baseUrl, setBookingId, selectedTab, isAdmin, setCurrentPage } = useContextex();

    const [loading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleShowReceipt = (bookId) => {
        setBookingId(bookId);
        setShowReceiptTab(true);
    };

    const renderTabContent = () => {
        if (showReceiptTab && selectedTab === 'My Earning') {
            setCurrentPage('Earning')
            return <Receipt />;
        }

        return (
            <>
                <div>

                    <div className="table-listing-properties mb-40">
                        <TabHeader tabList={myTabHeader} />
                        <ul>
                            {/* {myEarningData?.length > 0 ? ( */}
                            {myEarningData?.map((item, index) => (
                                <li key={index}>
                                    <div className="my-properties-item item">
                                        <div className="property">
                                            <div className="image booking-image h-100 w-100">
                                                <img
                                                    src={`${baseUrl}${item?.prop_img}`}
                                                    alt={item?.prop_title}
                                                />
                                            </div>
                                            <div>
                                                <div className="price">${item?.prop_price}</div>
                                                <div className="title">
                                                    <p>{item?.prop_title}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p>{item?.total_day} {t('Days')}</p>
                                        </div>
                                        <div>
                                            <div className="box-status">{item?.book_status}</div>
                                        </div>
                                        <div>
                                            <p>{item?.p_method_id === '2' ? t('Unpaid') : t('Paid')}</p>
                                        </div>
                                        <div>
                                            <ul className="wg-icon" onClick={() => handleShowReceipt(item?.book_id)}>
                                                <li className="p-3 edit-btns">
                                                    <IconEye />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            ))}

                            {myEarningData?.length === 0 && (
                                <div style={{ height: "410px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                    <div>
                                        <h4 className='empty-message' >{t('Go & Book your favorite service')}</h4>
                                    </div>
                                </div>
                            )}

                        </ul>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className="d-flex flex-col col-12 mob-dash pt-5 pb-5">

                        <TopLeftBar
                            topText={t('My Earning')}
                            bottomText={t('We are glad to see you again!')}
                        />

                        {showReceiptTab && selectedTab === 'My Earning' ? (
                            <div className='position-absolute' style={{ right: '20px' }} onClick={handleBackButton}>

                                <Link to={isAdmin ? `/${selectedTab}/add` : `/addProparty/${selectedTab}/add`}>
                                    <button onClick={() => setShowReceiptTab(false)} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px] flex items-center gap-[10px]'>{t('Back')} <IconArrowBackUp /></button>
                                </Link>

                            </div>
                        ) : (

                            <div className='position-absolute' style={{ right: '20px' }}>
                                <h4 className="style-black active">
                                    {t('Total Earning')}{' '}
                                    <h2 className="text-success">
                                        {userCurrency}
                                        {userDashboardDetails[5].report_data}
                                    </h2>
                                </h4>
                            </div>

                        )}

                    </div>
                    <div className="wg-box pl-44 pr-29">
                        {renderTabContent()}
                    </div>
                </div>}
        </>
    );
};

const MYPayout = ({ showTransactionModal, setShowTransactionModal, activeForm, setIsOpenModal, isOpenModal, setSelectedTransactionData, userDashboardDetails }) => {
    const { userCurrency } = useContextex();
    const { t } = useTranslation();
    const myTabHeader = [t('Order ID'), t('Amount'), t('Req_Date'), t('Req_Type'), t('Status'), t('Action')]

    const [loading, setloading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleViewReq = (item) => {
        setSelectedTransactionData(item);
        setShowTransactionModal(!showTransactionModal)
    }

    return (
        <>
            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">
                    <div className='d-flex mob-dash flex-col pt-5 col-12 pb-5'>
                        <div className='col-sm-9 col-6 col-xs-9 col-md-8 col-lg-10 '>
                            <h3>{t('My Payout')}</h3>
                            <div className="text-content">{t('Your Total Earning is')} <span style={{ color: "red" }}>{userCurrency}
                                {userDashboardDetails[5].report_data}</span>
                            </div>
                        </div>

                        <div className='position-absolute' style={{ right: '20px' }}>
                            <button onClick={() => setIsOpenModal(!isOpenModal)} className='font-[500] text-[17px] bg-[#2D71FE] hover:bg-[#2d73fed2] text-white py-[10px] px-[20px] rounded-[50px]'>{t('Request')}</button>
                        </div>
                    </div>

                    <div className="wg-box pl-44 pr-29 ">
                        <div className="table-listing-properties mb-40">
                            <div className="mt-5 pl-44 pr-29">
                                <div className="table-text-infor default">
                                    <TabHeader tabList={myTabHeader} />
                                    <ul>
                                        {activeForm?.Payoutlist?.map((item, index) => (
                                            <>
                                                <li key={index}>
                                                    <div className="text-infor-item item">

                                                        <div>
                                                            <div className="title">{item?.payout_id}</div>
                                                        </div>

                                                        <div>
                                                            <div className="title">{userCurrency}{item?.amt}</div>
                                                        </div>

                                                        <div>
                                                            <p>{item?.r_date}</p>
                                                        </div>

                                                        <div>
                                                            <p>{item?.r_type}</p>
                                                        </div>

                                                        <div>
                                                            <p><span className="process"></span>{item.status}</p>
                                                        </div>

                                                        <div>
                                                            <ul className="wg-icon" onClick={() => handleViewReq(item)}>
                                                                <li className="p-3 edit-btns">
                                                                    <IconEye />
                                                                </li>
                                                            </ul>
                                                        </div>

                                                    </div>
                                                </li>
                                            </>
                                        ))}

                                        {activeForm?.Payoutlist?.length === 0 && (
                                            <div style={{ height: "400px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                                <div>
                                                    <h4 className='empty-message' >{t('Go & Request your Payout')}</h4>
                                                </div>
                                            </div>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

        </>
    )
}

function AddProparty() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('active');
    const [userDashboardDetails, setUserDashboardDetails] = useState([]);
    const [activeTabData, setActiveTabData] = useState({})

    const [activeForm, setActiveForm] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [reviewListData, setReviewListData] = useState(null)
    const [myEarningData, setMyEarningData] = useState(null)
    const [, setSelectedId] = useState(null)
    const [sidebarData, setSidebarData] = useState(null)
    const [dashCard, setDashCard] = useState(null)
    const [selectedTransactionData, setSelectedTransactionData] = useState(null)

    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [showReceiptTab, setShowReceiptTab] = useState(false)
    const [showAddPropertyData, setShowAddPropertyData] = useState(false)
    const [editAddPropertyData, setEditAddPropertyData] = useState(false)
    const [showAddExtaImage, setShowAddExtaImage] = useState(false)
    const [showEditExtaImage, setShowEditExtaImage] = useState(false)
    const [showAddGalaryCategory, setShowAddGalaryCategory] = useState(false)
    const [showEditGalaryCategory, setShowEditGalaryCategory] = useState(false)
    const [showAddGalaryImages, setShowAddGalaryImages] = useState(false)
    const [showEditGalaryImages, setShowEditGalaryImages] = useState(false)
    const [isCanvasActive, setIsCanvasActive] = useState(false);
    const [refetchPayout, setRefetchPayout] = useState(false);
    const [loading, setloading] = useState(true);

    const [minWithdraw, setMinWithdraw] = useState();

    const [selectPayoutType, setSelectPayoutType] = useState('');
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutUpi, setPayoutUpi] = useState('');
    const [payoutEmail, setPayoutEmail] = useState('');

    const [payoutBankDetails, setPayoutBankDetails] = useState({
        ac_no: '',
        bankName: '',
        ac_holderName: '',
        IFSC_code: ''
    });

    const [payoutErrors, setPayoutErrors] = useState({
        payoutEmail: '',
        payoutUpi: '',
        payoutAcNo: '',
        payoutBnkName: '',
        payoutBnkHolder: '',
        payoutIFSC: '',
        payoutAmnt: '',
        payoutType: ''
    })

    const payoutData = activeForm;

    const { isUserId, baseUrl, setCurrentPage, currentPage, isAdmin, setDashboardTabData, setUserPropertyList, setComplateCurrentBook, userCurrency, setSelectedTab, selectedTab, setMemberShipData } = useContextex();

    useEffect(() => {
        var dashboard = function () {
            if ($('body').hasClass('dashboard')) {
                $('.btn-canvas').on('click', function () {
                    $(this).toggleClass('active');
                    $(this).closest('#page').find('.section-content-right').toggleClass('full');
                    $(this).closest('#page').find('.section-menu-left').toggleClass('null');
                });
            }
        }
        return dashboard()
    }, [])

    useEffect(() => {
        setCurrentPage('addproparty')
    }, [currentPage, setCurrentPage])

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_dashboard.php?`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setUserDashboardDetails(response?.data?.report_data || []);
                    setMinWithdraw(response?.data?.withdraw_limit || null);
                    setMemberShipData(response?.data?.is_subscribe || null);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [isUserId]);


    useEffect(() => {
        const baseSidebarData = [{ title: 'Dashboard' }, ...userDashboardDetails];
        const adminSidebarData = [{ title: 'Dashboard' }, ...userDashboardDetails, { title: 'Chat' }]

        if (isAdmin) {
            setSidebarData(adminSidebarData);
        } else {
            setSidebarData(baseSidebarData);
        }
    }, [userDashboardDetails, isAdmin]);

    useEffect(() => {
        const baseSidebarData = userDashboardDetails;

        if (selectedTab === 'Dashboard' && isAdmin) {
            setDashCard(baseSidebarData);
        } else {
            setDashCard(baseSidebarData);
        }
    }, [userDashboardDetails, isAdmin]);

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_property_list.php?`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data?.ResponseCode === '200') {
                    setUserPropertyList(response.data?.proplist);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [showAddPropertyData, editAddPropertyData]);



    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchAdminBookAsync = async () => {
            const Activestatus = selectedTab === 'My Earning' ? 'completed' : activeTab
            const storedData = selectedTab === 'My Earning' ? setMyEarningData : setActiveTabData
            try {
                const response = await axios.post(`${baseUrl}user_api/u_my_book.php?`, {
                    uid: isUserId,
                    status: Activestatus
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    storedData(response?.data?.statuswise)
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchAdminBookAsync();
    }, [isUserId, activeTab, selectedTab, showReceiptTab]);


    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            let endpoint = '';
            switch (selectedTab) {
                case 'My Extra Images':
                    endpoint = 'u_extra_list.php';
                    break;
                case 'My Gallery Category':
                    endpoint = 'u_gallery_cat_list.php';
                    break;
                case 'My Gallery Images':
                    endpoint = 'gallery_list.php';
                    break;
                case 'My Enquiry':
                    endpoint = 'u_my_enquiry.php';
                    break;
                default:
                    break;
            }
            try {
                const response = await axios.post(`${baseUrl}user_api/${endpoint}`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setDashboardTabData(response?.data)
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [selectedTab, isUserId, showEditExtaImage, showAddExtaImage, showAddGalaryCategory, showEditGalaryCategory, showEditGalaryImages, showAddGalaryImages]);


    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchPayoutDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/payout_list.php?`, {
                    owner_id: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setActiveForm(response?.data);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchPayoutDataAsync();
    }, [selectedTab, refetchPayout]);


    useEffect(() => {
        if (selectedTab === 'Total Review') {
            const fetchReviewDataAsync = async () => {
                try {
                    const response = await axios.post(`${baseUrl}user_api/review_list.php?`, {
                        orag_id: isUserId
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response?.data?.ResponseCode === '200') {
                        setReviewListData(response?.data?.reviewlist);
                    }
                } catch (err) {
                    console.error(err.message);
                }
            };

            fetchReviewDataAsync();
        }
    }, [selectedTab, isUserId]);


    useEffect(() => {
        var tabs = function () {
            $('.widget-tabs').each(function () {
                $(this).find('.widget-content-tab').children().hide();
                $(this).find('.widget-content-tab').children(".active").show();
                $(this).find('.widget-menu-tab').children('.item-title').on('click', function () {
                    var liActive = $(this).index();
                    var contentActive = $(this).siblings().removeClass('active').parents('.widget-tabs').find('.widget-content-tab').children().eq(liActive);
                    contentActive.addClass('active').fadeIn("slow");
                    contentActive.siblings().removeClass('active');
                    $(this).addClass('active').parents('.widget-tabs').find('.widget-content-tab').children().eq(liActive).siblings().hide();
                });
            });
            $('.widget-tabs-1').each(function () {
                $(this).find('.widget-content-tab-1').children().hide();
                $(this).find('.widget-content-tab-1').children(".active-1").show();
                $(this).find('.widget-menu-tab-1').children('.item-title-1').on('click', function () {
                    var liActive = $(this).index();
                    var contentActive = $(this).siblings().removeClass('active-1').parents('.widget-tabs-1').find('.widget-content-tab-1').children().eq(liActive);
                    contentActive.addClass('active-1').fadeIn("slow");
                    contentActive.siblings().removeClass('active-1');
                    $(this).addClass('active-1').parents('.widget-tabs-1').find('.widget-content-tab-1').children().eq(liActive).siblings().hide();
                });
            });
        };

        return tabs()
    }, [])

    const resetForm = () => {
        setPayoutAmount('');
        setSelectPayoutType('');
        setPayoutBankDetails({
            ac_no: '',
            bankName: '',
            ac_holderName: '',
            IFSC_code: ''
        });
        setPayoutUpi('');
        setPayoutEmail('');
    };

    const handlePayoutRequest = async (event) => {
        event.preventDefault()
        if (!validatePayoutInpus()) return;

        const { ac_no, bankName, ac_holderName, IFSC_code } = payoutBankDetails;
        try {
            const response = await axios.post(`${baseUrl}user_api/request_withdraw.php`, {
                owner_id: isUserId,
                amt: payoutAmount,
                r_type: selectPayoutType,
                acc_number: ac_no || '',
                bank_name: bankName || '',
                acc_name: ac_holderName || '',
                ifsc_code: IFSC_code || '',
                upi_id: selectPayoutType === 'UPI' ? payoutUpi : '',
                paypal_id: selectPayoutType === 'Paypal' ? payoutEmail : ''
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });

            resetForm();
            setRefetchPayout(!refetchPayout)
            if (response?.data?.ResponseCode === '200') {
                setRefetchPayout(false)
                setIsOpenModal(false)
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleBackButton = () => {
        // navigate(-1, { fallback: '/fallback' });
        setShowEditGalaryImages(true);
        setShowAddGalaryImages(true);
        setShowEditGalaryCategory(true);
        setShowEditExtaImage(true);
        setShowAddExtaImage(true);
        setEditAddPropertyData(true);
        setShowAddPropertyData(true);
        setActiveTab('active');
    };

    const closeModal = () => setIsOpenModal(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPayoutBankDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectPayout = (event) => {
        setSelectPayoutType(event.target.getAttribute('data-value'))
    }

    const handleCanvasClick = () => {
        setIsCanvasActive(!isCanvasActive);
    };

    const validatePayoutInpus = () => {
        const newErrors = { payoutAmnt: '', payoutIFSC: '', payoutBnkHolder: '', payoutBnkName: '', payoutAcNo: '', payoutUpi: '', payoutEmail: '', payoutType: '' }
        let isValid = true;

        if (selectPayoutType === 'UPI') {
            if (!payoutUpi) {
                newErrors.payoutUpi = "UPI can't be null"
                isValid = false
            }
            if (!payoutAmount) {
                newErrors.payoutAmnt = "Amount can't be null"
                isValid = false
            }
        } else if (selectPayoutType === 'Bank Transfer') {
            if (!payoutBankDetails.ac_no) {
                newErrors.payoutAcNo = "Account Number can't be null"
                isValid = false
            }
            if (!payoutBankDetails?.IFSC_code) {
                newErrors.payoutIFSC = "Bank IFSC code can't be null"
                isValid = false
            }
            if (!payoutBankDetails?.ac_holderName) {
                newErrors.payoutBnkHolder = "Bank Holder Name can't be null"
                isValid = false
            }
            if (!payoutBankDetails?.bankName) {
                newErrors.payoutUpi = "Bank Name can't be null"
                isValid = false
            }
            if (!payoutAmount) {
                newErrors.payoutAmnt = "Amount can't be null"
                isValid = false
            }
        } else if (selectPayoutType === 'Paypal') {
            if (!payoutEmail) {
                newErrors.payoutEmail = "Paypal Email can't be null"
                isValid = false
            }
            if (!payoutAmount) {
                newErrors.payoutAmnt = "Amount can't be null"
                isValid = false
            }
        } else if (!selectPayoutType) {
            newErrors.payoutType = "Pease Select Payout Type"
            isValid = false
        } else if (!payoutAmount) {
            newErrors.payoutAmnt = "Amount can't be null"
            isValid = false
        }

        setPayoutErrors(newErrors);
        return isValid;
    }

    const HandleChangePage = (title, index) => {
        setSelectedTab(title);
        setSelectedId(index + 1);
        setShowEditGalaryImages(false);
        setShowAddGalaryImages(true);
        setShowEditGalaryCategory(true);
        setShowAddGalaryCategory(true)
        setShowEditExtaImage(true);
        setShowAddExtaImage(true);
        setEditAddPropertyData(true);
        setShowAddPropertyData(true);
        setShowReceiptTab(false)
        setIsCanvasActive(false)

        if (title === "Total Review") {
            const timer = setTimeout(() => {
                setloading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }

    }

    return (
        <>
            <div id="wrapper">
                <div id="page" className="layout-wrap background-F9F9F9">
                    <div className="main-content spacing-20">

                        <div className="layout-wrap-inner">

                            <div className={`section-menu-left ${isCanvasActive ? 'null' : ''}`}>
                                <div className="menu-content">
                                    <ul>
                                        {sidebarData?.map((item, index) => {
                                            const formattedText = item.title.replace(/\s+/g, '_');
                                            const FinalText = formattedText.toLowerCase()

                                            return (
                                                <>
                                                    <li key={index} className={`pointer ${selectedTab === item.title ? 'active' : ''}`} onClick={() => HandleChangePage(item.title, index)}>
                                                        <Link to={isAdmin ? `/${FinalText}` : `/addProparty/${FinalText}`} className="w-100">
                                                            <span className="py-0 px-0 w-100">
                                                                {item.title.substring(0, 20)}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                </>

                                            );

                                        })}

                                    </ul>
                                </div>
                            </div>

                            <div className={`section-content-right remove-mov-tp ${isCanvasActive ? 'full' : ''}`}>

                                {selectedTab === 'Dashboard' && (
                                    <Dashboard
                                        userDashboardDetails={userDashboardDetails}
                                        dashCard={dashCard}
                                    />
                                )}

                                {selectedTab === 'My Property' && (
                                    <MYProperty
                                        setEditAddPropertyData={setEditAddPropertyData}
                                        setShowAddPropertyData={setShowAddPropertyData}
                                        handleBackButton={handleBackButton}
                                        editAddPropertyData={editAddPropertyData}
                                        showAddPropertyData={showAddPropertyData}
                                    />
                                )}

                                {selectedTab === 'My Extra Images' && (
                                    <MYExtraImage
                                        setShowEditExtaImage={setShowEditExtaImage}
                                        setShowAddExtaImage={setShowAddExtaImage}
                                        handleBackButton={handleBackButton}
                                        showEditExtaImage={showEditExtaImage}
                                        showAddExtaImage={showAddExtaImage}
                                    />
                                )}

                                {selectedTab === 'My Gallery Category' && (
                                    <MYGalCat
                                        setShowEditGalaryCategory={setShowEditGalaryCategory}
                                        setShowAddGalaryCategory={setShowAddGalaryCategory}
                                        handleBackButton={handleBackButton}
                                        showEditGalaryCategory={showEditGalaryCategory}
                                        showAddGalaryCategory={showAddGalaryCategory}
                                    />
                                )}

                                {selectedTab === 'My Gallery Images' && (
                                    <MYGAlImage
                                        setShowEditGalaryImages={setShowEditGalaryImages}
                                        handleBackButton={handleBackButton}
                                        setShowAddGalaryImages={setShowAddGalaryImages}
                                        showEditGalaryImages={showEditGalaryImages}
                                        showAddGalaryImages={showAddGalaryImages}
                                    />
                                )}

                                {selectedTab === 'My Booking' && (
                                    <MYBooking
                                        setShowReceiptTab={setShowReceiptTab}
                                        activeTabData={activeTabData}
                                        setActiveTab={setActiveTab}
                                        activeTab={activeTab}
                                        handleBackButton={handleBackButton}
                                        showReceiptTab={showReceiptTab}
                                        setComplateCurrentBook={setComplateCurrentBook}
                                    />
                                )}

                                {selectedTab === 'My Enquiry' && (
                                    <MYEnquiry />
                                )}

                                {selectedTab === 'My Earning' && (
                                    <MYEarning
                                        baseUrl={baseUrl}
                                        myEarningData={myEarningData}
                                        userCurrency={userCurrency}
                                        userDashboardDetails={userDashboardDetails}
                                        setShowReceiptTab={setShowReceiptTab}
                                        showReceiptTab={showReceiptTab}
                                        handleBackButton={handleBackButton}
                                    />
                                )}

                                {selectedTab === 'My Payout' && (
                                    <MYPayout
                                        setShowTransactionModal={setShowTransactionModal}
                                        activeForm={activeForm}
                                        setIsOpenModal={setIsOpenModal}
                                        isOpenModal={isOpenModal}
                                        setSelectedTransactionData={setSelectedTransactionData}
                                        userDashboardDetails={userDashboardDetails}
                                        showTransactionModal={showTransactionModal}
                                    />
                                )}

                                {selectedTab === 'Total Review' && (
                                    <>
                                        {loading
                                            ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                                                <div className="middle2"></div>
                                            </div>
                                            : <div className="">
                                                <div className='d-flex mob-dash col-12 flex-col pt-5 pb-5'>
                                                    <TopLeftBar
                                                        topText={'Total Review'}
                                                        bottomText={t('We are glad to see you again!')}
                                                    />
                                                </div>
                                                <div className="wg-box pl-44 pr-29 ">
                                                    <div className="reviews-wrap mt-0 mb-40">
                                                        <ul>
                                                            {reviewListData?.map((item, index) => (
                                                                <li className="d-flex flex-column" key={index}>
                                                                    <div className="ratings">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <i key={i} className="flaticon-star-1"></i>
                                                                        ))}
                                                                        <p>({item?.total_rate} Out Of 5)</p>
                                                                    </div>
                                                                    <div className="content">
                                                                        <p>{item?.rate_text}</p>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                            {reviewListData?.length === 0 && (
                                                                <div style={{ height: "510px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                                                    <div>
                                                                        <h4 className='empty-message'>{t('No Any Review Available')}</h4>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>}

                                    </>
                                )}

                                {selectedTab === 'Chat' && (<Chat />)}

                            </div>

                            <div className={`btn-canvas ${isCanvasActive ? 'active' : ''}`} onClick={handleCanvasClick}>
                                <span></span>
                                <div className='text-content'>{t('AddProparty Navigation')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {isOpenModal && (
                <OutsideClickHandler onOutsideClick={closeModal}>
                    <ReModal isOpenModal={isOpenModal} onClose={closeModal}>
                        <div className="content-right p-5">
                            <form className="form-basic-information flex flex-column">
                                <h4 style={{ margin: "0" }} className="d-flex justify-content-center">{t('Payout Request')}</h4>

                                <h6 className="text-black d-flex justify-content-center">
                                    {t('Maximum amount')}: <span className="text-success">${minWithdraw}</span>
                                </h6>

                                <fieldset className="name">
                                    <input style={{ border: payoutErrors?.payoutAmnt ? "1px solid red" : "1px solid black" }}
                                        type="text"
                                        className={`m-bottom w-100`}
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(e.target.value)}
                                        placeholder="Amount"
                                        required
                                    />
                                    <span className='span-text text-danger mx-4 '>{payoutErrors?.payoutAmnt}</span>
                                </fieldset>
                                <>
                                    <div className={`m-bottom nice-select ${payoutErrors?.payoutType ? 'border border-danger' : ''}`}
                                        tabIndex="0">
                                        <span className="current">{t('Select Type')}</span>
                                        <ul style={{ top: "10px" }} className="list">
                                            {['UPI', 'Bank Transfer', 'Paypal'].map((type) => (
                                                <li
                                                    key={type}
                                                    data-value={type}
                                                    className={`option ${selectPayoutType === type ? 'selected' : ''}`}
                                                    onClick={handleSelectPayout}
                                                >
                                                    {t(type)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <span className='text-danger span-text mx-4 '>{payoutErrors?.payoutType}</span>
                                </>
                                {selectPayoutType === 'UPI' && (
                                    <fieldset className="name">
                                        <input
                                            type="text"
                                            className={`m-bottom w-100 ${payoutErrors?.payoutUpi ? 'border border-danger' : ''}`}
                                            value={payoutUpi}
                                            onChange={(e) => setPayoutUpi(e.target.value)}
                                            placeholder="UPI"
                                            required
                                        />
                                        <span className='text-danger span-text mx-4 '>{payoutErrors?.payoutUpi}</span>
                                    </fieldset>
                                )}

                                {selectPayoutType === 'Bank Transfer' && (
                                    <>
                                        {['ac_no', 'bankName', 'ac_holderName', 'IFSC_code'].map((field, index) => (
                                            <fieldset className="name" key={index}>
                                                <input
                                                    type="text"
                                                    className="w-100"
                                                    value={payoutBankDetails[field]}
                                                    onChange={handleInputChange}
                                                    name={field}
                                                    placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                                    required
                                                />
                                            </fieldset>
                                        ))}
                                    </>
                                )}

                                {selectPayoutType === 'Paypal' && (
                                    <fieldset className="name">
                                        <input
                                            type="text"
                                            className={`m-bottom w-100 ${payoutErrors?.payoutEmail ? 'border border-danger' : ''}`}
                                            value={payoutEmail}
                                            onChange={(e) => setPayoutEmail(e.target.value)}
                                            placeholder="Email ID"
                                            required
                                        />
                                        <span className='text-danger span-text mx-4 '>{payoutErrors?.payoutEmail}</span>
                                    </fieldset>
                                )}

                                <div className="col-12 mt-5 d-flex justify-content-between">
                                    <p
                                        className="cursor-pointer tf-button-primary style-black active mx-2"
                                        onClick={() => setIsOpenModal(false)}
                                    >
                                        {t('Cancel')}
                                    </p>
                                    <button
                                        className="cursor-pointer tf-button-primary active"
                                        onClick={(event) => handlePayoutRequest(event)}
                                    // disabled={minWithdraw >= parseFloat(payoutAmount)}
                                    >
                                        {t('Proceed')} <i className="icon-arrow-right-add"></i>
                                    </button>
                                </div>

                            </form>
                        </div>

                    </ReModal>
                </OutsideClickHandler>
            )}

            {showTransactionModal &&
                <OutsideClickHandler onOutsideClick={() => setShowTransactionModal(false)}>
                    <ReModal isOpenModal={showTransactionModal} onClose={() => setShowTransactionModal(false)}>
                        <div className="content-right p-5 ">
                            <form className='form-bacsic-infomation flex  flex-column'>
                                <h4 className='d-flex justify-content-center'>{t('Payout Request')}</h4>

                                <div className='d-flex px-3 col-12'>
                                    <p className='pt-1 col-6'>{t('Status')} : </p>
                                    <p className='col-6'>{selectedTransactionData?.status}</p>
                                </div>

                                <div className='d-flex px-3 col-12'>
                                    <p className=' pt-1 col-6'>{t('Transaction Date')} : </p>
                                    <p className='col-6'>{selectedTransactionData?.r_date}</p>
                                </div>

                                {selectedTransactionData?.r_type === 'UPI' && (
                                    <>
                                        <div className='d-flex px-3 col-12'>
                                            <p className=' pt-1 col-6'>{t('Payout Upi Id')} : </p>
                                            <p className='col-6'>{selectedTransactionData?.upi_id}</p>
                                        </div>
                                    </>
                                )}

                                {selectedTransactionData?.r_type === 'BANK Transfer' && (
                                    <>

                                        <div className='d-flex px-3 col-12'>
                                            <p className='pt-1 col-6'>{t('Bank Name')} : </p>
                                            <p className='col-6'>{selectedTransactionData?.bank_name}</p>
                                        </div>

                                        <div className='d-flex px-3 col-12'>
                                            <p className='pt-1 col-6'>{t('Bank Account No')} : </p>
                                            <p className='col-6'>{selectedTransactionData?.acc_number}</p>
                                        </div>

                                        <div className='d-flex px-3 col-12'>
                                            <p className='pt-1 col-6'>{t('IFSC Code')} : </p>
                                            <p className='col-6'>{selectedTransactionData?.ifsc_code}</p>
                                        </div>

                                        <div className='d-flex px-3 col-12'>
                                            <p className='pt-1 col-6'> {t('Account Holder Name')} : </p>
                                            <p className='col-6'>{selectedTransactionData?.acc_name}</p>
                                        </div>

                                    </>
                                )}

                                {selectedTransactionData?.r_type === 'Paypal' && (
                                    <>
                                        <div className='d-flex px-3 col-12'>
                                            <p className='pt-1 col-6'>{t('Paypal Email Id')} : </p>
                                            <p className='col-6'>{selectedTransactionData?.paypal_id}</p>
                                        </div>
                                    </>
                                )}

                            </form>
                        </div>
                    </ReModal>
                </OutsideClickHandler>
            }
        </>
    )
}

export default AddProparty
/* jshint ignore:end */


