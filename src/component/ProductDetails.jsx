/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import { useNavigate, useParams } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import { IconHeart, IconHeartFilled, IconMapPinFilled, IconMessageFilled } from '@tabler/icons-react';
import $ from 'jquery';
import Rating from '@mui/material/Rating';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Footer from '../component/Footer';
import InqueryPage from './InqueryPage';
import { useTranslation } from 'react-i18next';
import Chat from '../component/Chat';
import Calendar from '../component/Calender';
import axios from 'axios';
import { showToast } from '../showTost';
import { useDocumentMeta } from '../useDocumentMeta';

const iconStyle = {
    color: 'red',
};

const Marker = () => (
    <div >
        <IconMapPinFilled style={{ color: 'red', height: '40px', width: "40px" }} />
    </div>
);

export const ProductDetails = () => {

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [categoriesList, setCategoriesList] = useState([]);
    const [, setProductImage] = useState([]);
    const [countGuest, setCountGuest] = useState(1);
    const [activeTab, setActiveTab] = useState('In Person')
    const [isLikedProd, setIsLikedProd] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [gallaryData, setGallaryData] = useState([]);
    const [notAvailableDate, setNotAvailableDate] = useState(null);
    const [activeGal, setActiveGal] = useState(0);
    const [selectionRange, setSelectionRange] = useState({
        startDate: formatDate(new Date()),
        endDate: formatDate(new Date()),
        key: 'selection'
    });
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [galLightboxOpen, setGalLightboxOpen] = useState(false);
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentGalImageIndex, setCurrentGalImageIndex] = useState(0);
    const [showPersonList, setShowPersonList] = useState(false);
    const [selectedChatUser, setSelectedChatUser] = useState("");
    const [favData, setFavData] = useState([])
    const [favList, setFavList] = useState(null);
    const [imageloaded, setImageLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    const [otherBookData, setOtherBookData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        otherUserGender: ''
    });

    const { productDetailId, setProductDetailId, setBookedProductData, baseUrl, setCurrentPage, isUserId, token, selectedId, selectedCountryId, userCurrency, setBookedUserData, setBookedOtherUserData, bookedOtherUserData, setOtherUserGender, otherUserGender, setLoginModal } = useContextex();
    const { t } = useTranslation();

    const proid = localStorage.getItem('pid');
    const pid = useParams();
    const formatedText = localStorage.getItem('formattedText');
    const navigate = useNavigate();

    const propertyDetails = categoriesList?.propetydetails;
    useDocumentMeta({
        title: propertyDetails?.title
            ? `${propertyDetails.title} - Rental in ${propertyDetails?.city || 'Egypt'} | SplitYourTrip`
            : undefined,
        description: propertyDetails?.description
            ? propertyDetails.description.slice(0, 160)
            : undefined,
        image: propertyDetails?.image?.[0]?.image ? `${baseUrl}${propertyDetails.image[0].image}` : undefined,
        path: pid?.pid ? `/properties/${pid.pid}` : undefined,
    });

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchBookDateDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_calnder.php?`, {
                    pro_id: productDetailId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setNotAvailableDate(response?.data?.datelist);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchBookDateDataAsync();
    }, [productDetailId]);


    useEffect(() => {
        if (!productDetailId && pid?.pid === formatedText) {
            setProductDetailId(proid);
        }
    }, [productDetailId, formatedText])

    // Resolve the property purely from the URL when there's no prior in-app
    // navigation state to fall back on - e.g. a search engine crawler, a
    // bookmark, or a link shared outside the app. Without this, direct visits
    // to /properties/:slug never load (productDetailId stays empty forever),
    // which would keep every individual listing out of search results.
    const slugify = (text) => (text || '').replace(/[\s_-]+/g, '-').toLowerCase();
    useEffect(() => {
        if (productDetailId || !pid?.pid) return;

        const resolveIdFromSlug = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_cat_wise_property.php?`, {
                    uid: isUserId || '0',
                    cid: 0,
                    country_id: selectedCountryId || 1,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const list = response?.data?.Property_cat || [];
                const match = list.find((item) => slugify(item?.title) === slugify(pid.pid));
                if (match?.id) {
                    setProductDetailId(match.id);
                    localStorage.setItem('pid', match.id);
                    localStorage.setItem('formattedText', pid.pid);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        resolveIdFromSlug();
    }, [productDetailId, pid?.pid, baseUrl, isUserId, selectedCountryId, setProductDetailId]);


    useEffect(() => {
        setCurrentPage('productDetails');
    }, [setCurrentPage]);

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/view_gallery.php?`, {
                    prop_id: productDetailId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setGallaryData(response?.data?.gallerydata)
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [productDetailId]);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_property_details.php?`, {
                    uid: isUserId || '0',
                    pro_id: productDetailId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setCategoriesList(response?.data);
                    setProductImage(categoriesList?.propetydetails?.image);
                    setBookedProductData(response?.data);
                }
                setLoading(false);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [productDetailId, isUserId]);



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

    useEffect(() => {
        // Fetch country data when component mounts or isUserId changes
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_favlist.php?`, {
                    uid: isUserId,
                    property_type: selectedId,
                    country_id: selectedCountryId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setFavList(response?.data)
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [isUserId, selectedId, selectedCountryId, productDetailId]);

    const userFavList = favList
    const today = new Date();

    useEffect(() => {
        const newIsLikedProduct = userFavList?.propetylist?.some(property => property?.id === productDetailId);
        setIsLikedProd(newIsLikedProduct);
    }, [userFavList, productDetailId]);

    const imagelist = categoriesList?.propetydetails?.image || [];

    let sources = [];

    if (imagelist.length > 0) {
        sources = sources.concat(imagelist.map(item => `${baseUrl}${item?.image}`));
    }

    const SlideImg = imagelist.map(item => baseUrl + item.image);

    const isValidIndex = activeGal >= 0 && activeGal < gallaryData?.length;
    const activeCategory = isValidIndex ? gallaryData[activeGal] : {};
    const filteredImages = (activeCategory.imglist || []).map(img => `${baseUrl}${img}`);

    const openLightboxOnSlide = (index) => {
        setCurrentImageIndex(index - 1);
        setLightboxOpen(true);
    };

    const handleAddToFavorites = async () => {
        try {
            const response = await axios.post(`${baseUrl}user_api/u_fav.php?`, {
                uid: isUserId,
                pid: productDetailId,
                property_type: categoriesList?.propetydetails?.property_type
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });
            setFavData(response?.data)
            setIsLikedProd(prevIsLiked => !prevIsLiked);
        } catch (err) {
            console.error(err.message);
        }
    };

    const apLat = Number(categoriesList?.propetydetails?.latitude);
    const apLong = Number(categoriesList?.propetydetails?.longtitude);
    const latitude = apLat;
    const longitude = apLong;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOtherBookData({
            ...otherBookData,
            [name]: value
        });
        setBookedOtherUserData({
            ...bookedOtherUserData,
            [name]: value
        });
    };

    const updateUserData = async () => {

        const formattedCheckIn = selectionRange?.startDate;
        const formattedCheckOut = selectionRange?.endDate;
        const formattedCurrentDate = today.toISOString().slice(0, 10);

        const date1 = new Date(formattedCheckIn);
        const date2 = new Date(formattedCheckOut);

        date1.setDate(date1.getDate());
        date2.setDate(date2.getDate());

        const adjustedCheckIn = date1.toISOString().slice(0, 10);
        const adjustedCheckOut = date2.toISOString().slice(0, 10);

        const differenceMs = Math.abs(date2 - date1);
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24)) + 1;

        try {

            const Data = {
                propetydetails: categoriesList.propetydetails,
                bookingDate: formattedCurrentDate,
                checkIn: adjustedCheckIn,
                checkOut: adjustedCheckOut,
                noGuest: countGuest,
                days: differenceDays,
                notes: noteText,
                bookedFor: activeTab === 'In Person' ? 'self' : 'other',
            }

            await setBookedUserData(Data);
            setBookedProductData(Data);

            await localStorage.setItem('bookinUserData', JSON.stringify(Data));
            await localStorage.setItem('check_out', adjustedCheckOut);
            await localStorage.setItem('days', differenceDays);

        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    useEffect(() => {
        // updateUserData();
    }, [selectionRange, countGuest, noteText, activeTab]);

    const defaultProps = {
        center: {
            lat: latitude,
            lng: longitude,
        },
        zoom: 11,
    };

    const availableBads = categoriesList?.propetydetails?.beds;

    const handleSelectGender = (event) => {
        setOtherUserGender(event.target.getAttribute('data-value'));
    };

    const getDatesBetween = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        while (currentDate <= end) {
            dates.push(currentDate.toISOString().slice(0, 10));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const getAllDates = () => {
        const allDates = [];
        notAvailableDate?.forEach(item => {
            const datesBetween = getDatesBetween(item.check_in, item.check_out);
            allDates.push(...datesBetween);
        });
        return allDates;
    };

    const allDates = getAllDates();
    const disabledDates = allDates?.map(dateStr => new Date(dateStr));

    const allDisabledDates = [...disabledDates];

    const decreaseCount = () => {
        if (countGuest > 1) {
            setCountGuest(prevCount => prevCount - 1);
        }
    };

    const increaseCount = () => {
        if (countGuest < availableBads) {
            setCountGuest(prevCount => prevCount + 1);
        }
    };

    const openGalLightbox = (index) => {
        setCurrentGalImageIndex(index);
        setGalLightboxOpen(true);
        setImageLoaded(false);
    };

    const validateInputs = () => {
        const newErrors = { firstName: '', lastName: '', phone: '', email: '', otherUserGender: '' };
        let isValid = true;

        if (!bookedOtherUserData.firstName) {
            newErrors.firstName = "Please Enter Your FirstName";
            isValid = false;
        }
        if (!bookedOtherUserData.lastName) {
            newErrors.lastName = "Please Enter Your LastName";
            isValid = false;
        }
        if (!bookedOtherUserData.email) {
            newErrors.email = "Please Enter Your Email";
            isValid = false;
        }
        if (!bookedOtherUserData.phone) {
            newErrors.phone = "Phone number can't be null";
            isValid = false;
        }
        if (!otherUserGender) {
            newErrors.otherUserGender = "Please Select other User Gender";
            isValid = false
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleBook = (event) => {

        event.preventDefault();

        if (!isUserId || !token) {
            setLoginModal(true);
            return;
        }

        updateUserData();

        if (activeTab === 'Book For Other') {
            if (!validateInputs()) return;
            setOtherBookData('');
            navigate('/product-cart');
        } else if (activeTab === 'In Person') {
            navigate('/product-cart');
        }

    };

    const openLightbox2 = (index) => {
        openLightboxOnSlide(index);
        setImageLoaded(false);
        setLightboxOpen(true);
    };

    const closeLightbox2 = () => setLightboxOpen(false);

    const handleImageLoad2 = () => {
        setImageLoaded(true);
    };

    return (
        <>
            <div className="main-content">
                <div className="property-single-wrap sticky-container" data-sticky-container>
                    <div className="cl-container">

                        <div className="row">

                            <div className="col-12">
                                <div className="flex items-center justify-between gap30 flex-wrap pt-30 pb-30">

                                    <ul className="breadcrumbs style-1 justify-start">
                                        <li><p className='pointer cursor-pointer' onClick={() => navigate('/')} >Home</p></li>
                                        <li>/</li>
                                        <li className='pointer' onClick={() => navigate('/product-all')}>Property List</li>
                                        <li>/</li>
                                        <li>{categoriesList?.propetydetails?.title}</li>
                                    </ul>

                                    {isUserId && token && (
                                        <div className="list-icons-page">
                                            <div className="item">
                                                <div className="icon" onClick={handleAddToFavorites}>
                                                    {isLikedProd ?
                                                        <IconHeartFilled style={iconStyle} /> :
                                                        <IconHeart style={iconStyle} />
                                                    }
                                                </div>
                                                <p>{t('Favorite')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-12 mb-[30px]">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className={`${SlideImg[1] ? "md:col-span-2 h-[400px]" : "md:col-span-3 h-[500px]"} max-_430_:h-[200px] max-_770_:h-[300px]`}>
                                        <img
                                            onClick={() => openLightbox2(1)}
                                            src={SlideImg[0]}
                                            alt="Car Side View"
                                            className="w-full h-full cursor-pointer object-cover rounded-lg"
                                        />
                                    </div>

                                    {SlideImg[1] && (
                                        <div className={`grid ${SlideImg.length === 2 ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                                            {SlideImg.slice(1, 5).map((img, index) => (
                                                img && (
                                                    <div key={index} className="relative">
                                                        <img
                                                            onClick={() => openLightbox2(index + 2)}
                                                            src={img}
                                                            alt={`Car View ${index + 1}`}
                                                            className="w-full cursor-pointer h-full object-cover rounded-lg"
                                                        />
                                                        {index === 3 && SlideImg[5] && (
                                                            <p
                                                                className="absolute bottom-[10px] right-[10px] cursor-pointer more-photos pointer"
                                                                onClick={() => openLightbox2(sources.length)}
                                                            >
                                                                <i className="flaticon-gallery"></i>
                                                                <p>{t('Photos')}</p>
                                                            </p>
                                                        )}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {lightboxOpen && (
                                    <Lightbox
                                        mainSrc={sources[currentImageIndex]}
                                        nextSrc={sources[(currentImageIndex + 1) % sources.length]}
                                        prevSrc={sources[(currentImageIndex + sources.length - 1) % sources.length]}
                                        onCloseRequest={closeLightbox2}
                                        onMovePrevRequest={() => setCurrentImageIndex((currentImageIndex + sources.length - 1) % sources.length)}
                                        onMoveNextRequest={() => setCurrentImageIndex((currentImageIndex + 1) % sources.length)}
                                        imageLoadErrorMessage="Failed to load image"
                                        onImageLoad={handleImageLoad2}
                                        imageLoading={imageloaded ? undefined : <div>Loading...</div>}
                                    />
                                )}
                            </div>

                            <div className="col-xl-8">
                                <div className="content-wrap">

                                    <div className="head-title wow fadeInUp">
                                        <div>
                                            <h3>{categoriesList?.propetydetails?.title}</h3>
                                            <div className="location">
                                                <div className="icon">
                                                    <i className="flaticon-location"></i>
                                                </div>
                                                <div className="text-content">{categoriesList?.propetydetails?.city}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="square">{categoriesList?.propetydetails?.sqrft} /sq ft</div>
                                            <div className="price">{userCurrency}{categoriesList?.propetydetails?.price}{categoriesList?.propetydetails?.buyorrent === '1' && ` /night`}</div>
                                        </div>
                                    </div>

                                    <div className="box-items">
                                        <div className="item wow fadeInUp">
                                            <div className="icon">
                                                <i className="flaticon-hotel"></i>
                                            </div>
                                            <div className="text-content">{availableBads} {t('Bedrooms')}</div>
                                        </div>
                                        <div className="item wow fadeInUp" data-wow-delay="0.1s">
                                            <div className="icon">
                                                <i className="flaticon-bath-tub"></i>
                                            </div>
                                            <div className="text-content">{categoriesList?.propetydetails?.bathroom} {t('Bathrooms')}</div>
                                        </div>
                                        <div className="item wow fadeInUp" data-wow-delay="0.2s">
                                            <div className="icon">
                                                <i className="flaticon-minus-front"></i>
                                            </div>
                                            <div className="text-content">{categoriesList?.propetydetails?.sqrft} Sq Ft</div>
                                        </div>
                                    </div>

                                    <div className="desc">
                                        <h4 style={{ margin: "0" }}>{t('Description')}</h4>
                                        <p className="wow fadeInUp mt-[10px]">
                                            {categoriesList?.propetydetails?.description}
                                        </p>
                                    </div>

                                    <div className="details">
                                        <h4 style={{ margin: "0" }}>{t('Details')}</h4>
                                        <div className="list-item mt-[10px]">

                                            <div className="item wow fadeInUp">
                                                <div className="text">{t('Price')}:</div>
                                                <p>{userCurrency}{categoriesList?.propetydetails?.price}</p>
                                            </div>
                                            <div className="item wow fadeInUp">
                                                <div className="text">{t('Property Size')}:</div>
                                                <p>{categoriesList?.propetydetails?.sqrft} Sq Ft</p>
                                            </div>
                                            <div className="item wow fadeInUp">
                                                <div className="text">{t('Bedrooms')}:</div>
                                                <p>{availableBads}</p>
                                            </div>
                                            <div className="item wow fadeInUp" data-wow-delay="0.1s">
                                                <div className="text">{t('Property Type')}:</div>
                                                <p>{categoriesList?.propetydetails?.property_title}</p>
                                            </div>
                                            <div className="item wow fadeInUp">
                                                <div className="text">{t('Bathrooms')}:</div>
                                                <p>{categoriesList?.propetydetails?.bathroom} </p>
                                            </div>
                                            <div className="item wow fadeInUp" data-wow-delay="0.1s">
                                                <div className="text">{t('Property Status')}:</div>
                                                <p>{categoriesList?.propetydetails?.buyorrent === '1' ? t('For Rent') : t('For Sale')}</p>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="features">
                                        <ul>
                                            <li>
                                                <h4 style={{ margin: "0" }}>{t('Facility Details')}</h4>
                                                <div className="wrap-check-ellipse wow fadeInUp mobile-facility mt-[15px]" data-wow-delay="0.1s">
                                                    {categoriesList?.facility?.map((itm, index) => (

                                                        <div className="plans py-0 my-0" key={index}>
                                                            <div className="widget-tabs style-3">
                                                                <div className="widget-content-tab">
                                                                    <div className="widget-content-inner active">
                                                                        <div className="icons">
                                                                            <div className="item d-flex flex-column  align-items-center justify-content-center wow fadeInUp">
                                                                                <img className='mt-0' src={`${baseUrl}${itm?.img}`} alt={itm?.title} />
                                                                                <div className="text text-center">{itm?.title}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ))}

                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="plans">
                                        {gallaryData?.length > 0 && (
                                            <>
                                                <h4 style={{ marginBottom: "10px" }} className="wow fadeInUp">{t('Gallery')}</h4>
                                                <div className="widget-tabs style-3">
                                                    <ul style={{ marginBottom: "10px" }} className="widget-menu-tab wow fadeInUp">
                                                        {gallaryData
                                                            ?.filter(item => item?.imglist && item?.imglist?.length > 0)
                                                            ?.map((item, index) => (
                                                                <li
                                                                    key={index}
                                                                    className={`item-title ${index === activeGal ? 'active' : ''}`}
                                                                    onClick={() => setActiveGal(index)}
                                                                >
                                                                    <span className="inner">{item.title}</span>
                                                                </li>
                                                            ))}
                                                    </ul>

                                                    <div className="widget-content-tab">
                                                        <div className={`widget-content-inner ${filteredImages.length > 0 ? 'active' : ''}`}>
                                                            <div className="icons">
                                                                {filteredImages?.map((img, imgIndex) => (
                                                                    <div
                                                                        className=" wow fadeInUp m-0 p-0 cursor-pointer"
                                                                        style={{ minHeight: '200px', maxHeight: '200px', minWidth: '200px', maxWidth: '200px' }}
                                                                        key={imgIndex}
                                                                        onClick={() => openGalLightbox(imgIndex)}
                                                                    >
                                                                        <img
                                                                            className="w-100 h-100 p-0 m-0"
                                                                            style={{ borderRadius: '15px', objectFit: "cover" }}
                                                                            src={img}
                                                                            alt={`Gallery ${imgIndex + 1}`}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </>
                                        )}

                                        {galLightboxOpen && filteredImages.length > 0 && (
                                            <Lightbox
                                                mainSrc={filteredImages[currentGalImageIndex]}
                                                nextSrc={filteredImages[(currentGalImageIndex + 1) % filteredImages.length]}
                                                prevSrc={filteredImages[(currentGalImageIndex + filteredImages.length - 1) % filteredImages.length]}
                                                onCloseRequest={() => setGalLightboxOpen(false)}
                                                onMovePrevRequest={() =>
                                                    setCurrentGalImageIndex((currentGalImageIndex + filteredImages.length - 1) % filteredImages.length)
                                                }
                                                onMoveNextRequest={() =>
                                                    setCurrentGalImageIndex((currentGalImageIndex + 1) % filteredImages.length)
                                                }
                                                onImageLoad={handleImageLoad2}
                                                imageLoading={imageloaded ? undefined : <div>Loading...</div>}
                                            />
                                        )}
                                    </div>

                                    <div className="contact-info">
                                        <div className="flex items-center justify-between gap30 flex-wrap wow fadeInUp">
                                            <h4 className="mb-0">{t('Contact Information')}</h4>
                                        </div>
                                        <div className="person wow fadeInUp">
                                            <div className="image">
                                                <img src={`${baseUrl}${categoriesList?.propetydetails?.owner_image}`} alt="" loading='lazy' decoding='async' />
                                            </div>
                                            <div className="content w-100 ">
                                                <div className="name">
                                                    <p>{categoriesList?.propetydetails?.owner_name}</p>
                                                </div>
                                                <div className='flex justify-between w-100'>
                                                    <div className="flex items-center gap-[10px]">
                                                        {isUserId && token && (
                                                            <button className="button-chat align-items-center justify-content-center tf-button-primary " onClick={() => { setChatBoxOpen(true); setShowPersonList(true); setSelectedChatUser(categoriesList?.propetydetails?.user_id) }}>Chat<IconMessageFilled /></button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="map mb-[20px]">
                                        <h4 style={{ marginBottom: "10px" }}>{t('Map')}</h4>

                                        {latitude && longitude && (
                                            <div className="wrap-map-v1 mt-[5px]">
                                                <GoogleMapReact
                                                    bootstrapURLKeys={{ key: "AIzaSyBFWn7qoRevZBlVRT04huF4TSmiVtliep8" }}
                                                    defaultCenter={defaultProps?.center}
                                                    defaultZoom={defaultProps?.zoom}
                                                    options={{ gestureHandling: 'none' }}
                                                    goToRangeStartOnSelect
                                                    yesIWantToUseGoogleMapApiInternals
                                                >
                                                    <Marker
                                                        lat={apLat}
                                                        lng={apLong}
                                                        text='My Pin'
                                                    />
                                                </GoogleMapReact>
                                            </div>
                                        )}
                                    </div>

                                    {categoriesList?.total_review > 0 && (
                                        <div className="reviews-wrap">
                                            <div className="flex justify-between items-center wow fadeInUp">
                                                <h4 className="mb-0"> {t('Reviews')}</h4>
                                                <div className='d-flex align-items-center'>
                                                    <Rating
                                                        name="half-rating-read"
                                                        defaultValue={3}
                                                        value={categoriesList?.propetydetails?.rate}
                                                        precision={0.5}
                                                        readOnly
                                                    />
                                                    <p>{categoriesList?.propetydetails?.rate} ({categoriesList?.total_review} reviews)</p>
                                                </div>
                                            </div>
                                            <ul className='mt-[10px]'>
                                                {categoriesList?.reviewlist?.map((item, index) => (
                                                    <li className="wow fadeInUp" key={index}>
                                                        <div className="image">
                                                            {item?.user_img ? (
                                                                <img className='h-100' src={`${baseUrl}${item?.user_img}`} alt="" loading='lazy' decoding='async' />
                                                            ) : (
                                                                <img src="../assets/icon/profile-default.png" alt="default profile" />
                                                            )}
                                                        </div>
                                                        <div className="content">
                                                            <div className="ratings">
                                                                <Rating
                                                                    name="half-rating-read"
                                                                    defaultValue={0}
                                                                    value={item?.user_rate}
                                                                    precision={0.5}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="name">
                                                                <p >{item?.user_title}</p>
                                                            </div>
                                                            <p>{item?.user_desc}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {
                                <div className="col-xl-4">
                                    {categoriesList?.propetydetails?.buyorrent === '1' && (
                                        <>
                                            <div className="property-single-sidebar po-sticky my-4">
                                                <div style={{ padding: "15px 15px 0px" }} className="sidebar-item sidebar-request">
                                                    <div className="schedule">
                                                        <h4 className="wow fadeInUp">{t('Select a Date')}</h4>
                                                        <fieldset className="message my-2 col-12 ">
                                                            <div>
                                                                <Calendar
                                                                    ranges={[selectionRange]}
                                                                    setSelectionRange={setSelectionRange}
                                                                    disabledDates={allDisabledDates}
                                                                />
                                                                <div>
                                                                </div>
                                                            </div>

                                                        </fieldset>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="property-single-sidebar po-sticky">
                                                <div className="sidebar-item sidebar-request">
                                                    <div className="schedule">
                                                        <h4 className="wow fadeInUp">{t('Schedule a tour')}</h4>
                                                        <form className="form-schedule">
                                                            <div className='w-100'>
                                                                <fieldset className="name my-4 has-top-title col-12">
                                                                    <p>{t('Check In')}</p>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Check In"
                                                                        tabIndex="2"
                                                                        value={selectionRange.startDate}
                                                                        aria-required="true"
                                                                        disabled
                                                                    />
                                                                </fieldset>

                                                                <fieldset className="name my-4 has-top-title col-12">
                                                                    <p>{t('Check Out')}</p>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Check Out"
                                                                        tabIndex="2"
                                                                        value={selectionRange.endDate}
                                                                        aria-required="true"
                                                                        disabled
                                                                    />
                                                                </fieldset>
                                                            </div>

                                                            <div className="flex gap20 mob-guest col-12">
                                                                <div className='col-6 mob-guest-had'>
                                                                    <h5>{t('Number Of Guest')}</h5>
                                                                    <p>{t('Allowed Max')} {availableBads} {t('Guest')}</p>
                                                                </div>
                                                                <div className="wg-quantity mob-guest-count">
                                                                    <p
                                                                        className="p-0 btn-quantity pointer minus-btn"
                                                                        disabled={countGuest === 1} onClick={decreaseCount}
                                                                    >
                                                                        -
                                                                    </p>
                                                                    <input
                                                                        type="text"
                                                                        name="number"
                                                                        value={countGuest}
                                                                        readOnly
                                                                    />
                                                                    <p
                                                                        className="p-0 btn-quantity pointer plus-btn"
                                                                        disabled={countGuest === availableBads} onClick={increaseCount}
                                                                    >
                                                                        +
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="widget-tabs style-4">
                                                                <ul className="widget-menu-tab">

                                                                    <li className={`item-title ${activeTab === 'In Person' && 'active'}`}>
                                                                        <span className="inner" onClick={() => setActiveTab('In Person')}>{t('In Person')}</span>
                                                                    </li>

                                                                    <li className={`item-title ${activeTab === 'Book For Other' && 'active'}`}>
                                                                        <span className="inner" onClick={() => setActiveTab('Book For Other')}>{t('Book For Other')}</span>
                                                                    </li>
                                                                </ul>

                                                                <div className="widget-content-tab">
                                                                    <div className="widget-content-inner active">
                                                                        {activeTab === 'Book For Other' && (

                                                                            <div>
                                                                                <fieldset className="name my-4 has-top-title col-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="First Name"
                                                                                        className={`m-bottom ${errors.firstName ? 'border border-danger' : ''}`}
                                                                                        name="firstName"
                                                                                        tabIndex="2"
                                                                                        value={otherBookData.firstName}
                                                                                        onChange={handleInputChange}
                                                                                    />
                                                                                    <span className='span-text text-danger mx-4'>{errors?.firstName}</span>

                                                                                </fieldset>

                                                                                <fieldset className="name my-4 has-top-title col-12">
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Last Name"
                                                                                        className={`m-bottom ${errors.lastName ? 'border border-danger' : ''}`}
                                                                                        name="lastName"
                                                                                        tabIndex="2"
                                                                                        value={otherBookData.lastName}
                                                                                        onChange={handleInputChange}
                                                                                    />
                                                                                    <span className='span-text text-danger mx-4'>{errors?.firstName}</span>

                                                                                </fieldset>

                                                                                <div className={`mt-[15px] ${errors.otherUserGender && "mb-[15px]"}`}>
                                                                                    <div className={`m-bottom nice-select wow fadeInUp  ${errors.otherUserGender ? 'border border-danger' : ''}`} data-wow-delay="0.1s" tabindex="0">
                                                                                        <span className="current">{t('Please Select Gender')}</span>
                                                                                        <ul className="list">
                                                                                            <li data-value="male" className="option" onClick={handleSelectGender}>{t('Male')}</li>
                                                                                            <li data-value="feMale" className="option" onClick={handleSelectGender}>{t('Female')}</li>
                                                                                        </ul>
                                                                                    </div>
                                                                                    <span className='span-text text-danger mx-4'>{errors?.otherUserGender}</span>
                                                                                </div>

                                                                                <fieldset className="email mb-[15px] has-top-title col-12">
                                                                                    <input
                                                                                        type="email"
                                                                                        placeholder="Email"
                                                                                        className={`m-bottom ${errors.email ? 'border border-danger' : ''}`}
                                                                                        name="email"
                                                                                        tabIndex="2"
                                                                                        value={otherBookData.email}
                                                                                        onChange={handleInputChange}
                                                                                    />
                                                                                    <span className='span-text text-danger mx-4'>{errors?.email}</span>

                                                                                </fieldset>

                                                                                <fieldset className="phone  has-top-title col-12">
                                                                                    <input
                                                                                        type="tel"
                                                                                        placeholder="Mobile Number(With Country Code)"
                                                                                        className={`m-bottom ${errors.phone ? 'border border-danger' : ''}`}
                                                                                        name="phone"
                                                                                        tabIndex="2"
                                                                                        value={otherBookData.phone}
                                                                                        // aria-required="true"
                                                                                        // required
                                                                                        onChange={handleInputChange}
                                                                                    />
                                                                                    <span className='span-text text-danger mx-4'>{errors?.phone}</span>

                                                                                </fieldset>

                                                                            </div>
                                                                        )}

                                                                        <fieldset className="message has-top-title">
                                                                            <textarea name="message" rows="4" placeholder="Notes" className="" tabindex="2" aria-required="true" defaultValue={noteText} onChange={(e) => setNoteText(e.target.value)}></textarea>
                                                                            <label for="">{t('Note to Owner')} ({t('optional')})</label>
                                                                        </fieldset>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            {/* <Link to={'/product-cart'}> */}
                                                            <div className="button-submit">
                                                                <button className="tf-button-primary w-full justify-content-center d-flex" onClick={handleBook} >{t('Continue')}<i className="icon-arrow-right-add"></i></button>
                                                            </div>
                                                            {/* </Link> */}

                                                        </form>

                                                    </div>

                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {categoriesList?.propetydetails?.buyorrent === '2' && (
                                        <div className="property-single-sidebar po-sticky my-4">
                                            {categoriesList?.propetydetails?.buyorrent === '2' && (
                                                <div className="sidebar-item sidebar-request">
                                                    {isUserId && token && (
                                                        <InqueryPage />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>

                            }

                        </div>

                    </div>
                </div>

            </div>

            <Footer />

            {chatBoxOpen && (<div onClick={() => { setChatBoxOpen(false); setShowPersonList(false) }} className="chatbox">
                <div className="chatbox2 right" onClick={(e) => e.stopPropagation()}>
                    <form className='right'>

                        <Chat
                            showPersonList={showPersonList}
                            selectedChatUser={selectedChatUser}
                            setSelectedChatUser={setSelectedChatUser}
                            directChatUserNm={categoriesList?.propetydetails?.owner_name}
                        />
                    </form>
                </div>
            </div>)}

            {loading && (
                <div style={{ zIndex: "777" }} className="preload preload-container">
                    <div className="middle"></div>
                </div>
            )}
        </>
    )
}
/* jshint ignore:end */