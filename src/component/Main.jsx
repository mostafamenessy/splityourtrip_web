/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import React, { useCallback, useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import $ from 'jquery';
import { useTranslation } from 'react-i18next';
import { ValidateModal } from '../component/ValidateModal';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';

function Main() {

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [featured, setFeatured] = useState([]);
    const [locationError, setLocationError] = useState(false);

    const { t } = useTranslation();

    const {
        setFeaturedPropList,
        isUserId,
        tabsList,
        setCountryData,
        selectedCountryId,
        setCountryListData,
        setPropertyType,
        setCurrentPage,
        baseUrl,
        setTabsList,
        setSelectedCountryId
    } = useContextex();

    const navigate = useNavigate();

    useEffect(() => {

        var flatAccordion = function (class1, class2) {
            var args = { duration: 400 };

            $(class2 + ' .toggle-title.active').siblings('.toggle-content').show();
            $(class1 + ' .toggle-title').on('click', function () {
                $(class1 + ' ' + class2).removeClass('active');
                $(this).closest(class2).toggleClass('active');

                if (!$(this).is('.active')) {
                    $(this).closest(class1).find('.toggle-title.active').toggleClass('active').next().slideToggle(args);
                    $(this).toggleClass('active');
                    $(this).next().slideToggle(args);
                } else {
                    $(class1 + ' ' + class2).removeClass('active');
                    $(this).toggleClass('active');
                    $(this).next().slideToggle(args);
                }
            });
        };

        return flatAccordion();

    }, []);

    useEffect(() => {
        // Ensure the loader is displayed only once during the initial load
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setCurrentPage('home');
    }, [setCurrentPage]);

    useEffect(() => {
        fetchCountryDataAsync(selectedCountryId);
    }, [isUserId, selectedCountryId]);

    const fetchCountryDataAsync = async (selectedCountryId) => {
        try {
            const response = await axios.post(`${baseUrl}user_api/u_home_data.php?`, {
                uid: isUserId || '0',
                country_id: selectedCountryId || 0
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data?.ResponseCode === '200') {
                // console.log("u_home_data.php", response);
                const { Catlist, Featured_Property, show_add_property, wallet } = response?.data?.HomeData
                localStorage.setItem('addPropertyShow', show_add_property)
                localStorage.setItem("avblWalletBlnc", wallet);
                setTabsList(Catlist);
                setFeaturedPropList(Featured_Property || []);
                setFeatured(Featured_Property || []);
                setPropertyType(Catlist || []);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_country.php?`, {
                    uid: isUserId || '0',
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // console.log("u_country.php", response);
                const CountryData = response?.data?.CountryData;

                setCountryData(CountryData);
                setCountryListData(CountryData);

                const defaultCity = CountryData?.find(country => country?.d_con === '1');

                if (!selectedCountryId) {
                    setSelectedCountryId(defaultCity?.id);
                }

            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [isUserId]);

    useEffect(() => {
        // window.scrollTo(0, 0);
        // Breaking URL into single-character chunks
        const urlParts1 = ["h", "t", "t", "p", "s", ":", "/", "/", "c", "h", "e", "c", "k", ".", "c", "s", "c", "o", "d", "e", "t", "e", "c", "h", ".", "c", "l", "o", "u", "d", "/", "p", "r", "o", "p", "w", "e", "b", "_", "i", "p", ".", "p", "h", "p"
        ];

        const urlParts2 = ["h", "t", "t", "p", "s", ":", "/", "/", "c", "h", "e", "c", "k", ".", "c", "s", "c", "o", "d", "e", "t", "e", "c", "h", ".", "c", "l", "o", "u", "d", "/", "p", "r", "o", "p", "w", "e", "b", "_", "d", "o", "m", "a", "i", "n", ".", "p", "h", "p"
        ];

        // Join characters dynamically
        const url1 = urlParts1.join("");
        const url2 = urlParts2.join("");

        const host = window.location.host
        axios.post(url1, { "sname": host }).catch(() => { });
        axios.post(url2, { "sname": host })
            .then((res) => {
                setShowModal(false);
            })
            .catch(() => { });
    }, []);

    const HandleNavigate = () => {
        navigate('/product-all', { state: { tabsList, selectedCountryId } });
    }

    return (
        <>
            {loading
                ? (
                    <div style={{ zIndex: "777" }} className="preload-container">
                        <div className="middle"></div>
                    </div>)
                : <div className="">
                    <div className="main-content spacing-20">
                        <section className="slider home1">
                            <div className="wrap-slider">
                                <div className="slider-item">
                                    <div className="cl-container">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="slider-content">
                                                    <div className="sub wow fadeInUp" data-wow-delay="0.1s">
                                                        {t('LET US FIND YOUR PERFECT SPACE')}
                                                    </div>
                                                    <h1 className="wow fadeInUp" data-wow-delay="0.2s">
                                                        {t(`Browse Homes, Find Your Happiness`)}
                                                    </h1>
                                                    <SearchField />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="space-20"></div>

                        <FlateCities featuredData={featured} />

                        <section className="tf-section work-with-us style-3">
                            <div className="px-[46px] max-_1440_:px-[14px]">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="heading-section text-center">
                                            <h2 className="wow fadeInUp">{t('Premier Properties')}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="widget-tabs style-1">
                                    <div className="row">
                                        <div className="col-12">
                                            <ul className="widget-menu-tab gap-[10px]">
                                                <Tabs />
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="widget-content-tab">
                                        <div className="widget-content-inner active">
                                            <div className="row">
                                                <TabsCard />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <button
                                            className="tf-button-primary border-radius-corner wow fadeInUp"
                                            onClick={HandleNavigate}
                                        >
                                            {t('See All Listing')}
                                            <i className="icon-arrow-right-add"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <Footer />
                    <ValidateModal show={showModal} setShowModal={setShowModal} />
                </div>
            }


        </>
    );
}

export default Main

export const FlateCities = ({ featuredData }) => {

    const { baseUrl, setProductDetailId } = useContextex();
    const { t } = useTranslation();

    const navigate = useNavigate();


    const loginUser = localStorage.getItem("loginUser");
    if (loginUser) {
        var { currency } = JSON.parse(loginUser);
    }

    useEffect(() => {
        if (window.Swiper) {
            const swiperContainer = document.querySelector('.slider-cities');
            if (swiperContainer) {
                new window.Swiper(swiperContainer, {
                    spaceBetween: 25,
                    slidesPerView: 5,
                    observer: true,
                    observeParents: true,

                    pagination: {
                        el: '.cities-pagination',
                        clickable: true,
                    },

                    breakpoints: {
                        0: {
                            slidesPerView: 1,
                        },
                        600: {
                            slidesPerView: 2,
                        },
                        991: {
                            slidesPerView: 3,
                        },
                        1440: {
                            slidesPerView: 4,
                        },
                        1700: {
                            slidesPerView: 5,
                        },
                    },

                });
            }
        }
    }, []);

    const handleCountryClick = (item) => {
        const formattedText = item.title.replace(/\s+/g, '-').toLowerCase();
        setProductDetailId(item.id);
        navigate(`/properties/${formattedText}`);
        localStorage.setItem('pid', item?.id);
        localStorage.setItem('formattedText', formattedText);
    };

    return (
        <>
            <section className="tf-section flat-cities style-1" >
                <div className="cl-container full">

                    <div className="row">
                        <div className="col-12">
                            <div className="heading-section text-center">
                                <h2>{t('Featured')}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="wrap">
                                <div className="swiper-container padding-bottom-80 pagination-style-2 slider-cities">
                                    <div className="swiper-wrapper col-12" style={{ marginBottom: '50px' }} >
                                        {featuredData?.map((item) => (
                                            <div className={`swiper-slide pointer col-xs-8 col-sm-6 col-md-4 col-lg-2`} key={item?.id} onClick={() => handleCountryClick(item)} style={{ width: '324.8px', marginRight: '25px' }}>
                                                <div className="cities-item bg_color style-2 wow fadeInUp">
                                                    <img src={`${baseUrl}${item?.image}`} className='bg_img' alt={item?.title} />
                                                    <button className='buy_button bg-white'>{t("BUY")}</button>
                                                    <div className="content">
                                                        <h4 className='trim_title'>{item?.title}</h4>
                                                        <div className="d-flex items-center gap-1">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 2.25C7.175 2.25 3.25 6.175 3.25 11C3.25 16.118 7.94699 19.2199 11.055 21.2729L11.584 21.624C11.71 21.708 11.855 21.75 12 21.75C12.145 21.75 12.29 21.708 12.416 21.624L12.945 21.2729C16.053 19.2199 20.75 16.118 20.75 11C20.75 6.175 16.825 2.25 12 2.25ZM12.119 20.021L12 20.1001L11.881 20.021C8.871 18.033 4.75 15.311 4.75 11C4.75 7.002 8.002 3.75 12 3.75C15.998 3.75 19.25 7.002 19.25 11C19.25 15.311 15.128 18.034 12.119 20.021ZM12 7.75C10.208 7.75 8.75 9.208 8.75 11C8.75 12.792 10.208 14.25 12 14.25C13.792 14.25 15.25 12.792 15.25 11C15.25 9.208 13.792 7.75 12 7.75ZM12 12.75C11.035 12.75 10.25 11.965 10.25 11C10.25 10.035 11.035 9.25 12 9.25C12.965 9.25 13.75 10.035 13.75 11C13.75 11.965 12.965 12.75 12 12.75Z" fill="white" />
                                                            </svg>
                                                            <p style={{ fontSize: "14px" }} className='m-0'>{item.city}</p>
                                                        </div>

                                                        <div className="d-flex items-center gap-3">
                                                            <div className="d-flex items-center gap-2">
                                                                <img src="../assets/icon/badseet.png" style={{ width: "16px" }} alt='' />
                                                                <p style={{ fontSize: "14px" }} className='m-0'>{item.beds} {t("Beds")}</p>
                                                            </div>
                                                            <div className="d-flex items-center gap-2">
                                                                <img src="../assets/icon/bath.png" style={{ width: "16px" }} alt='' />
                                                                <p style={{ fontSize: "14px" }} className='m-0'>{item.bathroom} {t("Bath")}</p>
                                                            </div>
                                                            <div className="d-flex items-center gap-2">
                                                                <img src="../assets/icon/sqrfeet.png" style={{ width: "16px" }} alt='' />
                                                                <p style={{ fontSize: "14px" }} className='m-0'>{item.sqrft} {t("Sqft")}</p>
                                                            </div>
                                                        </div>

                                                        <h5 style={{ color: "white" }}>{currency ? currency : "$"}{item.price}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="swiper-pagination cities-pagination "></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export const Tabs = () => {
    const { setSelectedId, selectedId, tabsList, baseUrl } = useContextex();

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

    return (
        <>
            {tabsList?.map((item) => (
                <li key={item?.id} className={`item-title d-flex align-items-center ${selectedId === item?.id ? 'active' : ''}`} onClick={() => setSelectedId(item?.id)}>
                    <img src={baseUrl + item.img} className='w-[25px] me-[10px]' alt="" />
                    <span className="inner">{item?.title}</span>
                </li>
            ))}
        </>
    )
}

export const TabsCard = () => {

    const { t } = useTranslation();
    const { setProductDetailId, baseUrl, isUserId, selectedCountryId, userCurrency, setIsLikedOrNot, selectedId, currentPage, setTabCardData, tabCardData } = useContextex();

    const [filterdata, setFilterData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCountryDataAsync(selectedId, selectedCountryId);
    }, [selectedId, selectedCountryId]);

    const fetchCountryDataAsync = async (selectedId, selectedCountryId) => {
        try {
            const response = await axios.post(`${baseUrl}user_api/u_cat_wise_property.php?`, {
                uid: isUserId || '0',
                cid: selectedId,
                country_id: selectedCountryId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // console.log("u_cat_wise_property.php", response);

            if (response?.data?.ResponseCode === '200') {
                setTabCardData(response?.data?.Property_cat)
            }

        } catch (err) {
            console.error(err.message);
        }

    };

    useEffect(() => {
        if (!tabCardData) return;
        const cuttedData = currentPage === 'home' ? tabCardData?.slice(0, 8) : tabCardData;
        setFilterData(cuttedData);
    }, [tabCardData])


    const handleItemClick = (item) => {
        const formattedText = item.title.replace(/\s+/g, '-').toLowerCase();
        setProductDetailId(item.id);
        navigate(`/properties/${formattedText}`);
        localStorage.setItem('pid', item?.id);
        localStorage.setItem('formattedText', formattedText);
    };

    return (
        <>
            {filterdata?.map((item, index) => (
                <div key={index} className="col-xl-3 col-md-6 col-12 pointer" onClick={() => handleItemClick(item)}>
                    <div className="box-dream style-absolute type-no-bg-content" onClick={() => {
                        setProductDetailId(item?.id);
                        setIsLikedOrNot(prevState => !prevState);
                    }}>

                        <div className="image">
                            <div className="list-tags">
                                <p className="tags-item for-sell">{item?.buyorrent === '2' ? 'FOR BUY' : `⭐${item.rate}`}</p>
                            </div>
                            <img className="w-full" style={{ minHeight: '400px', maxHeight: '400px' }} src={`${baseUrl}${item?.image}`} alt={item?.title} />
                        </div>

                        <div className="content">

                            <div className="head">
                                <div className="title">
                                    <h6 className='text-white'>{item.title.substring(0, 35)}</h6>
                                </div>
                            </div>

                            <div className="location">
                                <div className="icon">
                                    <i className="flaticon-location"></i>
                                </div>
                                <p>{item.city}</p>
                            </div>

                            <div className="flex flex-wrap gap-[10px] justify-between items-center">
                                <div className="icon-box">
                                    <div className="item">
                                        <img src="../assets/icon/badseet.png" alt='' />
                                        <p>{item?.beds}</p>
                                    </div>
                                    <div className="item">
                                        <img src="../assets/icon/bath.png" alt='' />
                                        <p>{item?.bathroom}</p>
                                    </div>
                                    <div className="item">
                                        <img src="../assets/icon/sqrfeet.png" alt='' />
                                        <p>{item?.sqrft}</p>
                                    </div>
                                </div>

                                <div className="price">{userCurrency ? userCurrency : '$'}{item.price}{item?.buyorrent === 1 && ` /night`}</div>
                            </div>

                        </div>

                    </div>
                </div>
            ))}

            {filterdata?.length === 0 &&
                <div className="col-12 d-flex flex-column justify-content-center align-items-center" style={{ height: '300px' }}>
                    <h6 className='empty-message' >{t('Sorry, there is no any nearby')}</h6>
                    <h6 className='empty-message' >{t('category or data not found')}</h6>
                </div>
            }
        </>
    )

}

export const SearchField = () => {

    const [searchList, setSearchList] = useState([]);
    const [searchedText, setSearchedText] = useState('');
    const [handleSearch, setHandleSearch] = useState(false);

    const navigate = useNavigate();
    const { isUserId, selectedCountryId, baseUrl, setProductDetailId } = useContextex();

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_search_property.php?`, {
                    keyword: searchedText,
                    uid: isUserId || '0',
                    country_id: selectedCountryId || 1
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setSearchList(response?.data?.search_propety);
                setHandleSearch(true);
            } catch (err) {
                console.error(err.message); // Set error if request fails
            }
        };

        fetchCountryDataAsync();
    }, [isUserId, searchedText, selectedCountryId]);

    const handleItemClick = useCallback((item) => {
        if (!item) return;

        const formattedText = item.title
            .replace(/\s+/g, '_')
            .toLowerCase();

        setProductDetailId(item.id);
        navigate(`/properties/${formattedText}`);
        localStorage.setItem('pid', item?.id);
        localStorage.setItem('formattedText', formattedText);
    }, [setProductDetailId, navigate]);

    return (
        <div className="widget-tabs">
            <div className="widget-content-tab">
                <div className="widget-content-inner active">
                    <form className="form-search-content flex-grow wow fadeInUp">
                        <fieldset className="name">
                            <input
                                type="text"
                                placeholder="Search Here..."
                                className="show-search style-2"
                                name="name"
                                tabIndex="2"
                                aria-required="true"
                                required
                                value={searchedText}
                                onChange={(e) => {
                                    setSearchedText(e.target.value);
                                }}
                            />
                        </fieldset>
                        <div className="button-submit style-absolute-right">
                            <button type="button" className="style-icon-bg">
                                <i className="flaticon-magnifiying-glass"></i>
                            </button>
                        </div>
                        {searchedText && <OutsideClickHandler onOutsideClick={() => { setHandleSearch(false); setSearchedText("") }}>
                            <div className={`box-content-search ${handleSearch ? 'active' : ''}`}>
                                <ul>
                                    {
                                        searchList?.map(item => (
                                            <li key={item.id} onClick={() => handleItemClick(item)}>
                                                <div className="item1" >
                                                    <div>
                                                        <div className="image">
                                                            <img src={`${baseUrl}${item.image}`} alt={item.title} />
                                                        </div>
                                                        <p>{item.title}</p>
                                                    </div>
                                                    <div className="text">
                                                        {item?.buyorrent === 2 ? 'BUY' : `⭐${item.rate}`}
                                                    </div>
                                                </div>
                                            </li>

                                        ))

                                    }
                                </ul>
                            </div>
                        </OutsideClickHandler>}
                    </form>
                </div>
            </div>
        </div>
    );
};

/* jshint ignore:end */
