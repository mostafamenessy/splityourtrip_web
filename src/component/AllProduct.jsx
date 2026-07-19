/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import { useLocation, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function AllProduct() {

    const { t } = useTranslation();

    const { setCurrentPage, tabCardData, baseUrl, userCurrency, selectedId, setSelectedId, setTabCardData, isUserId, setProductDetailId, setIsLikedOrNot } = useContextex();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const Location = useLocation();
    const { tabsList, selectedCountryId } = Location.state;

    useEffect(() => {
        fetchCountryDataAsync();
    }, [selectedId, selectedCountryId]);

    const fetchCountryDataAsync = async () => {
        try {
            const response = await axios.post(`${baseUrl}user_api/u_cat_wise_property.php?`, {
                cid: selectedId,
                uid: isUserId || '0',
                country_id: selectedCountryId ? selectedCountryId : 1
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setLoading(false);
            if (response?.data?.ResponseCode === '200') {
                setTabCardData(response?.data?.Property_cat);
                setData(response?.data?.Property_cat);
            }

        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        setCurrentPage('all_product');
    }, [setCurrentPage]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

        return tabs();
    }, []);

    const navigate = useNavigate();
    
    const handleItemClick = (item) => {
        const formattedText = item.title.replace(/\s+/g, '_').toLowerCase();
        setProductDetailId(item.id);
        navigate(`/properties/${formattedText}`);
        localStorage.setItem('pid', item?.id);
        localStorage.setItem('formattedText', formattedText);
    };

    return (
        <>
            <div id="wrapper">
                <div id="page" className="">
                    <div className="main-content">
                        <div className="flat-title page-property-grid-2">
                            <div className="px-[46px] max-_1440_:px-[14px]">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="content text-center">
                                            <h2 className="wow fadeInUp">{t('Real Estate & Homes For Sale')}</h2>
                                            <ul className="breadcrumbs wow fadeInUp">
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="widget-tabs style-1">
                                    <div className="row">
                                        <div className="col-12">
                                            <ul className="widget-menu-tab">
                                                {tabsList?.map((item) => (
                                                    <li key={item?.id} className={`item-title d-flex align-items-center ${selectedId === item?.id ? 'active' : ''}`} onClick={() => setSelectedId(item?.id)}>
                                                        <img src={baseUrl + item.img} className='w-[25px] me-[10px]' alt="" />
                                                        <span className="inner">{item?.title}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="property-grid-wrap-v2">
                            <div className="px-[46px] max-_1440_:px-[14px]">
                                <div className="row">
                                    {data?.map((item, index) => (
                                        <div className="col-xl-3 col-md-6 pointer" key={index} onClick={() => handleItemClick(item)}>
                                            <div className="box-dream has-border wow fadeInUp" onClick={() => {
                                                setProductDetailId(item.id);
                                                setIsLikedOrNot(prevState => !prevState);
                                            }}>
                                                <div className="image">
                                                    <div className="list-tags">
                                                        <p className="tags-item for-sell">{item?.buyorrent === 2 ? 'FOR BUY' : `⭐${item.rate}`}</p>
                                                    </div>
                                                    <div className=" arrow-style-1 pagination-style-1">
                                                        <div className="">
                                                            <div className="">
                                                                <div className="">
                                                                    <img style={{ minHeight: '400px', maxHeight: '400px' }} src={`${baseUrl}${item?.image}`} alt={item?.title} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="content" >
                                                    <div className="mb-[10px] flex items-center justify-between w-full gap-[5px] overflow-hidden">
                                                        <p className='whitespace-nowrap over-hidden overflow-ellipsis'>{item.title.substring(0, 35)}</p>
                                                        <div className="price">{userCurrency ? userCurrency : '$'}{item.price}{item?.buyorrent === 1 && ` /night`}</div>
                                                    </div>
                                                    <div className="location">
                                                        <div className="icon">
                                                            <i className="flaticon-location"></i>
                                                        </div>
                                                        <p>{item.city}</p>
                                                    </div>
                                                    <div className="icon-box overflow-x-scroll">
                                                        <div className="item">
                                                            <i className="flaticon-hotel"></i>
                                                            <p className='whitespace-nowrap'>{item?.beds} {t('Beds')}</p>
                                                        </div>
                                                        <div className="item">
                                                            <i className="flaticon-bath-tub"></i>
                                                            <p className='whitespace-nowrap'>{item?.bathroom} {t('Baths')}</p>
                                                        </div>
                                                        <div className="item">
                                                            <i className="flaticon-minus-front"></i>
                                                            <p className='whitespace-nowrap'>{item?.sqrft} Sqft</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {tabCardData?.length === 0 &&
                                        <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{ height: '300px' }}>
                                            <h6 className='empty-message'>Sorry, there is no any nearby</h6>
                                            <h6 className='empty-message'>category or data not found</h6>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div style={{ zIndex: "777" }} className="preload preload-container">
                    <div className="middle"></div>
                </div>
            )}
        </>
    )
}

export default AllProduct
/* jshint ignore:end */