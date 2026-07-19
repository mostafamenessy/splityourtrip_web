/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { IconWallet } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { ReModal } from '../component/ReModal';
import { useNavigate } from 'react-router-dom';
import { useContextex } from '../context/useContext';
import { RazorpayPayment } from '../component/RazorpayPayment';
import { KhaltiPayment } from '../component/KhaltiPayment';
import { FlutterwavePayment } from '../component/FlutterwavePayment';
import { PaystackPayment } from '../component/PaystackPayment';
import { StripePayment } from '../component/StripePayment';
import { PaypalPayment } from '../component/PaypalPayment';
import { PaytmPayment } from '../component/PaytmPayment';
import SenangpayPayment from '../component/SenangpayPayment';
import { MidtransPayment } from '../component/MidtransPayment';
import { TwoCheckoutPayment } from '../component/TwoCheckoutPayment';
import PayfastPayment from '../component/PayfastPayment';
import { MercadoPagoPayment } from '../component/MercadoPagoPayment';
import { AddToProductPay } from '../component/AddToWallet';
import Footer from '../component/Footer';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import { showToast } from '../showTost';

export const CartProduct = () => {
    const [couponAdd, setCouponAdd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [couponId, setCouponId] = useState('');
    const [couponValue, setCouponValue] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [selectedPaymentType, setSelectedPaymentType] = useState();

    const [couponData, setCouponData] = useState([]);
    const [, setCouponResponsData] = useState([]);

    const [, setIsOpenModal] = useState(false);
    const [isOpenCouponModal, setIsOpenCouponModal] = useState(false);
    const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [walletPay, setWalletPay] = useState(false);
    const [couponStatus, setCouponStatus] = useState(false);
    const [showPaymentList, setShowPaymentList] = useState(false);
    const [paymentTrigger, setPaymentTrigger] = useState(false);
    const [attributes, setAttributes] = useState("")

    const { bookedUserData, bookedProductData, setBookedProductData, setBookedUserData, baseUrl, isUserId, setProductAmount, userCurrency, setProductFinalPrice, referApiData, paymentGatwayList, setSelectedPaymentId, selectedPaymentId } = useContextex();

    localStorage.setItem('spid', selectedPaymentId);

    const closeModal = () => {
        setIsOpenModal(false);
        setIsOpenCouponModal(false);
        setIsOpenPaymentModal(false);
    };
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCouponDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_couponlist.php?`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setCouponData(response?.data?.couponlist)
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCouponDataAsync();
    }, []);

    useEffect(() => {
        if ((selectedPaymentType === 'Stripe' || selectedPaymentType === 'Paypal' || selectedPaymentType === 'PayStack') && paymentTrigger) {
            setIsOpenPaymentModal(true);
            setShowPaymentList(false);
        }
    }, [selectedPaymentType, paymentTrigger]);

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            if (couponId) {
                try {
                    const response = await axios.post(`${baseUrl}user_api/u_check_coupon.php?`, {
                        uid: isUserId,
                        cid: couponId
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    setCouponStatus(true);
                    if (response?.data?.ResponseCode === '200') {
                        setCouponResponsData(response?.data);
                    }
                } catch (err) {
                    console.error(err.message);
                }
            }
        };

        fetchCountryDataAsync();
    }, [couponId]);


    useEffect(() => {
        window.scrollTo(0, 0);

        const LocalData = localStorage.getItem("bookinUserData");
        if (LocalData) {
            setBookedProductData(JSON.parse(LocalData));
            setBookedUserData(JSON.parse(LocalData));
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);


    }, []);


    const productImage = bookedProductData?.propetydetails?.image[0]?.image;
    const producttitle = bookedProductData?.propetydetails?.title;
    const productCity = bookedProductData?.propetydetails?.city;
    const productPrice = (bookedProductData?.propetydetails?.price) * (bookedProductData?.days);
    const productTax = productPrice;
    const productTotalCost = productTax;
    const walletBalance = localStorage.getItem('avblWallet');
    const paybleCouponAmnt = couponStatus && couponAdd && (couponValue > productTotalCost ? productTotalCost : couponValue);
    const paybleWalletAmnt = isChecked && walletBalance > productTotalCost ? productTotalCost : (isChecked && walletBalance ? walletBalance : 0);

    let finalPrice = productTotalCost;

    if (isChecked && couponStatus && couponAdd) {
        finalPrice = productTotalCost - paybleWalletAmnt - paybleCouponAmnt;
    } else if (isChecked) {
        finalPrice = productTotalCost - paybleWalletAmnt;
    } else if (couponStatus && couponAdd) {
        finalPrice = productTotalCost - paybleCouponAmnt;
    }

    setProductFinalPrice(`${finalPrice}`);

    useEffect(() => {
        const updateProductAmount = async () => {
            const newProductAmount = {
                bookingDays: bookedProductData?.days || '',
                bookingAmount: bookedProductData?.propetydetails?.price || '',
                bookingTotalAmount: productTotalCost || '',
                bookingTax: referApiData?.tax,
                bookingWalletAmount: paybleWalletAmnt || '0',
                bookingCouponAmount: paybleCouponAmnt || '0',
                productTotalAmnt: productPrice || '',
                productTotalTax: productTax || ''
            };

            // Update state
            setProductAmount(prevState => ({
                ...prevState,
                ...newProductAmount
            }));

            // Save to localStorage
            await localStorage.setItem('productAmount', JSON.stringify(newProductAmount));
        };

        updateProductAmount();
    }, [paybleCouponAmnt, paybleWalletAmnt, referApiData, productTotalCost, bookedProductData, bookedUserData, productPrice, productTax]);

    const handleClick = async (id, value, ccode) => {
        if (couponId === id) {
            setCouponId("");
            setCouponValue("");
            setCouponCode("");
            setCouponAdd(false);
        } else {
            setCouponId(id);
            setCouponValue(value);
            setCouponCode(ccode);
            setCouponAdd(!couponAdd);
        }
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
        if (e.target.checked) {
            setCouponCode('');
            setCouponValue('');
            setCouponAdd('');
        } else {
            console.log('Checkbox is unchecked');
        }
    };

    const handleToBook = () => {
        if (isChecked && productTotalCost === paybleWalletAmnt) {
            setWalletPay(true);
            setSelectedPaymentType('wallet');
            setSelectedPaymentId('5');
        } else {
            setShowPaymentList(!showPaymentList);
            setWalletPay(false);
        }
    };

    const navigate = useNavigate();
    const filteredPaymentWay = paymentGatwayList?.filter(item => item?.p_show === '0');

    const Handlecontinue = () => {

        if (!selectedPaymentId) {
            showToast({ title: "Select payment method !!", id: "error" });
            return;
        }

        setPaymentTrigger(true);
    }

    return (
        <>
            <div className="main-content">

                <div className="flat-title">
                    <div className="cl-container full">
                        <div className="row">
                            <div className="col-12">
                                <div className="content">
                                    <h2>{t('Review Summary')}</h2>
                                    <ul className="breadcrumbs">
                                        <li><p className='pointer' onClick={() => navigate('/')}>Home</p></li><li>/</li><li>Review Summary</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="form-shop-cart">
                    <div className="cl-container">
                        <div className="row">

                            <div className="col-lg-8">

                                <div className="table-shop-cart default mb-30">
                                    <div className="head">
                                        <div className="item">
                                            <div className="text">{t('Product')}</div>
                                        </div>
                                        <div className="item">
                                            <div className="text">{t('Price')}</div>
                                        </div>
                                        <div className="item">
                                            <div className="text">{t('Booking Days')}</div>
                                        </div>
                                        <div className="item">
                                            <div className="text">{t('Subtotal')}</div>
                                        </div>
                                    </div>
                                    <ul>
                                        <li>
                                            <div className="shop-cart-item item">
                                                <div className="image">
                                                    <img src={`${baseUrl}${productImage}`} alt="" />
                                                </div>
                                                <div>
                                                    <div className="title">
                                                        <p>{producttitle}</p>
                                                        <p >{productCity}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p>{userCurrency}{bookedProductData?.propetydetails?.price}</p>
                                                </div>
                                                <div>
                                                    <p>{bookedProductData?.days}</p>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between items-center">
                                                        <p>{userCurrency}{productPrice}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                    </ul>
                                </div>

                                <div className="">
                                    <div className="flex gap20 flex-grow">
                                        <fieldset className="name">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                className="justify-center"
                                                name="text"
                                                tabIndex="2"
                                                value={couponCode ? couponCode : "Add Coupon"}
                                                aria-required="true"
                                                required
                                                disabled
                                            />
                                        </fieldset>
                                        <button className="tf-button-primary justify-center style-black whitespace-nowrap" type="button" onClick={() => setIsOpenCouponModal(!isOpenCouponModal)}>
                                            {t('Apply Coupon')} <i className="icon-arrow-right-add"></i>
                                        </button>
                                    </div>
                                    {couponStatus && couponAdd &&
                                        <p className='text-primary m-0 p-0 '>Coupon Applied Successfully!!</p>
                                    }

                                    {walletBalance > 0 && (
                                        <form>
                                            <ul className="ft-download bg-light border mt-[10px]" style={{ borderRadius: '15px' }} >
                                                <li style={{ width: 'auto' }}>
                                                    <a className='justify-between'>
                                                        <div className="flex items-center gap-[20px]">
                                                            <div className="icon text-dark">
                                                                <IconWallet />
                                                            </div>
                                                            <div className="app">
                                                                <div style={{ fontSize: "17px", fontWeight: "500" }} className='text-dark'>{t('Your Balance')} {userCurrency}{isChecked ? paybleWalletAmnt - walletBalance : walletBalance}</div>
                                                                <div style={{ fontSize: "15px", fontWeight: "400" }} className='text-dark'>{t('Available for Payment')}</div>
                                                            </div>
                                                        </div>
                                                        <p className="switch-item">
                                                            <label>
                                                                <input
                                                                    className="check border"
                                                                    type="checkbox"
                                                                    value="checkbox"
                                                                    name="check"
                                                                    checked={isChecked}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                            </label>
                                                        </p>
                                                    </a>
                                                </li>
                                            </ul>
                                        </form>
                                    )}
                                </div>

                            </div>

                            <div className="col-lg-4">

                                <div className="sidebar-shop my-4">
                                    <div className="sidebar-shop-item cart-totals">
                                        <div className="title">{t('Booking Details')}</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text">{t('Booking Date')}</div>
                                            <div className="text-1">{bookedUserData?.bookingDate}</div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text">{t('Check in')}</div>
                                            <div className="text-1">{bookedUserData?.checkIn}</div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text">{t('Check out')}</div>
                                            <div className="text-1">{bookedUserData?.checkOut}</div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text">{t('Number of Guest')}</div>
                                            <div className="text-1">{bookedUserData?.noGuest}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="sidebar-shop">
                                    <div className="sidebar-shop-item cart-totals">
                                        <div className="title">{t('Cart Totals')}</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text">{t('Amount')} ({bookedUserData?.days} {t('days')})</div>
                                            <div className="text-1">{userCurrency}{productPrice}</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text">{t('Tax')}({referApiData?.tax}%)</div>
                                            <div className="text-1">{userCurrency}{productTax}</div>
                                        </div>
                                        {couponStatus && couponAdd &&
                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Coupon')}</div>
                                                <div className="text-1 text-danger">{userCurrency}{paybleCouponAmnt}</div>
                                            </div>
                                        }
                                        {isChecked &&
                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Wallet')}</div>
                                                <div className="text-1 text-danger">{userCurrency}{paybleWalletAmnt}</div>
                                            </div>
                                        }
                                        <div className="divider"></div>
                                        <div className="flex items-center justify-between">
                                            <div className="text">{t('Total Payble Amount')}</div>
                                            <div className="text-1">{userCurrency}{finalPrice}</div>
                                        </div>
                                        <p className="cursor-pointer tf-button-primary justify-center w-full" onClick={handleToBook}>{t('Proceed to Checkout')}<i className="icon-arrow-right-add"></i></p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </form>

            </div>

            {isOpenCouponModal && (
                <OutsideClickHandler onOutsideClick={closeModal}>
                    <ReModal isOpenCouponModal={isOpenCouponModal} onClose={closeModal}  >
                        <div className='p-5 w-100'>
                            <section >
                                <div >
                                    <div>
                                        <h4 className="neutral-top">{t('Available coupons')}</h4>
                                        {couponData?.map((item) => (
                                            <div className='w-100 my-3'>
                                                <div className="categories-item wow fadeInUp" key={item?.id}>
                                                    <div className="icon">
                                                        <img style={{ height: '40px', width: '40px' }} src={`${baseUrl}${item?.c_img}`} alt="Avatar" />
                                                    </div>
                                                    <div className='d-flex justify-content-between w-100'>
                                                        <div>
                                                            <div className="name">
                                                                <p>{item?.coupon_title}</p>
                                                            </div>
                                                            <div className="text">{item?.c_desc.slice(0, 75).concat('...')}</div>
                                                            <p><small className='mb-0 text-dark'>Ex {item?.cdate}</small></p>
                                                            <button onClick={() => {
                                                                handleClick(item?.id, item?.c_value, item?.coupon_code);
                                                                setIsOpenModal(false);
                                                                setIsOpenCouponModal(false)
                                                            }}
                                                                // disabled={finalPrice <= item?.min_amt || finalPrice > paybleWalletAmnt}
                                                                disabled={finalPrice <= item?.min_amt}
                                                                className="tf-button-filter justify-center btn-filter col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">{couponAdd && couponId === item?.id ? 'Remove' : 'Use'}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                    </ReModal>
                </OutsideClickHandler>
            )}

            {showPaymentList && (
                <OutsideClickHandler onOutsideClick={() => setShowPaymentList(false)}>
                    <ReModal isOpenModal={showPaymentList} onClose={() => setShowPaymentList(false)}  >
                        <div className='p-5 w-100'>
                            <section >
                                <div>
                                    <div className='w-100'>
                                        <h4 className="neutral-top pb-3">{t('Select Payment Method')} </h4>
                                        <div className=''>
                                            {filteredPaymentWay?.map((item) => (
                                                <div style={{ padding: "15px 25px" }} key={item?.id} onClick={() => { setSelectedPaymentType(item?.title); setSelectedPaymentId(item?.id); setAttributes(item?.attributes) }} className={`categories-item pointer mb-[10px] col-12 wow fadeInUp ${selectedPaymentType === item?.title ? 'active-map' : ''}`} >
                                                    <div className="icon">
                                                        <img src={`${baseUrl}${item?.img}`} alt={`${item?.title} icon`} />
                                                    </div>
                                                    <div>
                                                        <div className="name">
                                                            <p>{item?.title}</p>
                                                        </div>
                                                        <div className="text">{item?.subtitle}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="button-submit mt-10">
                                                <button className="tf-button-primary justify-center" onClick={Handlecontinue} >{t('Continue')}<i className="icon-arrow-right-add"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </ReModal>
                </OutsideClickHandler>
            )}

            {selectedPaymentType === 'Khalti Payment' && paymentTrigger && <KhaltiPayment product_name={producttitle} product_amount={finalPrice} booked_for={'booking'} />}
            {selectedPaymentType === 'FlutterWave' && paymentTrigger && <FlutterwavePayment product_name={producttitle} product_amount={finalPrice} product_id={bookedProductData?.propetydetails?.id} booked_for={'booking'} attributes={attributes} />}
            {selectedPaymentType === 'Razorpay' && paymentTrigger && <RazorpayPayment product_amount={finalPrice} booked_for={'booking'} setPaymentTrigger={setPaymentTrigger} attributes={attributes} />}

            {isOpenPaymentModal && selectedPaymentType === 'Stripe' && paymentTrigger &&
                <ReModal isOpenPaymentModal={isOpenPaymentModal} onClose={closeModal} widths={'500px'}>
                    <div className="content-right p-5 ">
                        <form className='form-bacsic-infomation flex  flex-column'>
                            <StripePayment product_amount={finalPrice} booked_for={'booking'} attributes={attributes} />
                        </form>
                    </div>
                </ReModal>
            }

            {selectedPaymentType === 'PayStack' && paymentTrigger &&
                <div onClick={() => setPaymentTrigger(false)} className="PayStack">
                    <div onClick={(e) => e.stopPropagation()} className="PayStack2">
                        <PaystackPayment product_amount={finalPrice} booked_for={'booking'} attributes={attributes} />
                    </div>
                </div>
            }

            {
                isOpenPaymentModal && selectedPaymentType === 'Paypal' && paymentTrigger &&
                <>
                    <ReModal isOpenPaymentModal={isOpenPaymentModal} onClose={closeModal} widths={'500px'}>
                        <div className="content-right p-5 ">
                            <form className='form-bacsic-infomation flex align-items-center justify-content-center d-flex flex-column'>
                                <PaypalPayment product_amount={finalPrice} booked_for={'booking'} attributes={attributes} />
                            </form>
                        </div>
                    </ReModal>
                </>
            }

            {selectedPaymentType === 'Paytm' && paymentTrigger && <PaytmPayment booked_for={'booking'} product_amount={finalPrice} />}
            {selectedPaymentType === 'SenangPay' && paymentTrigger && <SenangpayPayment product_amount={finalPrice} attributes={attributes} />}
            {selectedPaymentType === 'Midtrans' && paymentTrigger && <MidtransPayment product_amount={finalPrice} booked_for={'booking'} />}
            {selectedPaymentType === 'Pay TO Owner' && paymentTrigger && <AddToProductPay paybleWalletAmnt={paybleWalletAmnt} setSelectedPaymentType={setSelectedPaymentType} selectedPaymentType={selectedPaymentType} />}
            {selectedPaymentType === 'wallet' && walletPay && <AddToProductPay paybleWalletAmnt={paybleWalletAmnt} setSelectedPaymentType={setSelectedPaymentType} selectedPaymentType={selectedPaymentType} />}
            {selectedPaymentType === '2checkout' && paymentTrigger && <TwoCheckoutPayment product_amount={finalPrice} attributes={attributes} />}
            {selectedPaymentType === 'Payfast' && paymentTrigger && <PayfastPayment product_name={producttitle} product_amount={finalPrice} booked_for={'booking'} attributes={attributes} />}
            {selectedPaymentType === 'MercadoPago' && paymentTrigger && <MercadoPagoPayment product_name={producttitle} product_amount={finalPrice} attributes={attributes} />}

            <Footer />

            {loading && (
                <div style={{ zIndex: "777" }} className="preload preload-container">
                    <div className="middle"></div>
                </div>
            )}

        </>
    )
}
/* jshint ignore:end */