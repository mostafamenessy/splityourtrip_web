/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import React, { useCallback, useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import Footer from '../component/Footer';
import { ReModal } from '../component/ReModal';
import { KhaltiPayment } from '../component/KhaltiPayment';
import { FlutterwavePayment } from '../component/FlutterwavePayment';
import { PaystackPayment } from '../component/PaystackPayment';
import { RazorpayPayment } from '../component/RazorpayPayment';
import { PaytmPayment } from '../component/PaytmPayment';
import SenangpayPayment from '../component/SenangpayPayment';
import { MidtransPayment } from '../component/MidtransPayment';
import { TwoCheckoutPayment } from '../component/TwoCheckoutPayment';
import PayfastPayment from '../component/PayfastPayment';
import { MercadoPagoPayment } from '../component/MercadoPagoPayment';
import { useTranslation } from 'react-i18next';
import { IconWallet } from '@tabler/icons-react';
import { uid } from 'uid';
import { StripePayment } from '../component/StripePayment';
import { PaypalPayment } from '../component/PaypalPayment';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import { showToast } from '../showTost';

function PackagePurchase() {
    const [packageData, setPackageData] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [paymentTrigger, setPaymentTrigger] = useState(false);
    const [, setWalletPay] = useState(false);
    const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);
    const [attributes, setAttributes] = useState("")

    const { t } = useTranslation();
    const {
        setCurrentPage,
        isUserId,
        userCurrency,
        selectedPackage,
        setSelectedPackage,
        paymentGatwayList,
        baseUrl,
        setSelectedPaymentId,
        selectedPackData,
        setSelectedPackData,
        selectedPaymentId,
        setSelectedPaymentType,
        selectedPaymentType,
        setPackageAmount
    } = useContextex();

    useEffect(() => {
        const fetchPackagePlans = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_package.php?`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setPackageData(response?.data?.PackageData);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchPackagePlans();
    }, [isUserId]);

    useEffect(() => {
        if ((selectedPaymentType === 'Stripe' || selectedPaymentType === 'Paypal' || selectedPaymentType === 'PayStack') && paymentTrigger) {
            setIsOpenPaymentModal(true);
            setIsOpenModal(false);
        }
    }, [selectedPaymentType, paymentTrigger]);

    useEffect(() => {
        setCurrentPage('package_purchase');
    }, [setCurrentPage]);

    const closeModal = () => {
        setIsOpenModal(false);
        setIsOpenPaymentModal(false);
        setPaymentTrigger(false);
    };

    const walletBalance = localStorage.getItem('avblWalletBlnc');
    // const walletBalance = userWalletAmount ? userWalletAmount : loginUserData?.UserLogin?.wallet
    const packPrice = selectedPackData?.price;
    const paybleWalletAmnt = isChecked ? Math.min(walletBalance, packPrice) : '0';
    const totalPay = packPrice - paybleWalletAmnt;
    const filteredPaymentWay = paymentGatwayList?.filter(item => item?.s_show === '1' && item?.p_show === '1' && item?.id !== '2');
    localStorage.setItem('spid', selectedPaymentId);

    useEffect(() => {
        const updatePackageAmount = async () => {
            const updatedPackageAmount = {
                packageWalletAmount: paybleWalletAmnt || '0',
                packageTotalAmnt: packPrice,
            };

            try {
                // Update state with new package amounts
                setPackageAmount(prevState => ({
                    ...prevState,
                    ...updatedPackageAmount,
                }));

                // Save to localStorage
                await localStorage.setItem('packageAmnt', JSON.stringify(updatedPackageAmount));
                await localStorage.setItem('packId', selectedPackData?.id);
                await localStorage.setItem('payType', selectedPaymentType);
                const packData = JSON.stringify(selectedPackData);
                await localStorage.setItem('packData', packData);
                await localStorage.setItem('paymentName', selectedPackData?.price === 0 ? 'Trial' : selectedPaymentType);
            } catch (error) {
                console.error('Error updating package amount:', error);
            }
        };

        updatePackageAmount();
    }, [paybleWalletAmnt, packPrice, selectedPackData, selectedPaymentType]);

    const purchasePackage = useCallback(async () => {

        try {

            if (selectedPaymentType === 'wallet' || selectedPackData?.price === 0) {

                const response = await axios.post(`${baseUrl}user_api/u_package_purchase.php?`, {
                    uid: isUserId,
                    transaction_id: selectedPaymentType === 'wallet' || selectedPackData?.price === 0 ? uid(6) : 0,
                    plan_id: selectedPackData?.id,
                    pname: selectedPackData?.price === 0 ? 'Trial' : selectedPaymentType,
                    wall_amt: paybleWalletAmnt
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log("u_package_purchase.php", response.data);


                const toastId = response?.data.ResponseCode === '200' ? "success" : "error";
                showToast({ title: response?.data?.ResponseMsg, id: toastId });

                if (response?.data?.ResponseCode === '200') {
                    localStorage.setItem('isPackBuy', response?.data?.UserLogin?.is_subscribe);
                    localStorage.removeItem('packageAmnt');
                    localStorage.removeItem('paymentName');
                    localStorage.removeItem('packId');
                    localStorage.removeItem('bookFor');
                }

            }

        } catch (error) {
            console.error('Error purchasing package:', error);
        } finally {
            setIsChecked(false);
        }
    }, [selectedPaymentType, selectedPackData, isUserId, paybleWalletAmnt]);

    const handleClick = (data) => {
        setSelectedPackage(data.id);
        setSelectedPackData(data);
        if (data.price > 0) {
            setIsOpenModal(true);
        } else {
            purchasePackage();
        }
    };

    const handleToBook = () => {

        if (totalPay === 0 && isChecked) {

            setSelectedPaymentType('wallet');
            setSelectedPaymentId('5');
            setWalletPay(true);

            purchasePackage();
            return;
        }

        console.log(totalPay);

        if (!selectedPaymentId) {
            showToast({ title: "Select payment method !!", id: "error" });
            return;
        }

        const Data = {
            uid: isUserId,
            plan_id: selectedPackData?.id,
            pname: selectedPackData?.price === 0 ? 'Trial' : selectedPaymentType,
            wall_amt: paybleWalletAmnt
        }

        sessionStorage.setItem("packagedata", JSON.stringify(Data));

        setWalletPay(false);
        setPaymentTrigger(!paymentTrigger);

    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    return (
        <>
            <div className='main-content px-20 default'>
                <section className="tf-section flat-pricing">
                    <div className="cl-container">

                        <div className="row">
                            <div className="col-12">
                                <div className="heading-section text-center">
                                    <h2 className="wow fadeInUp">{t('Choose the right pricing plan for you')}</h2>
                                    <div className="text wow fadeInUp">
                                        {t('Lorem ipsum dolor sit amet, consectetur adipiscing elit')}.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            {packageData?.map((item) => (
                                <div className="col-xxl-3 col-md-6" key={item.id} onClick={() => handleClick(item)}>
                                    <div className={`pricing-item wow fadeInUp ${selectedPackage === item.id ? 'active' : ''}`} data-wow-delay="0.2s">
                                        <div className="top">
                                            <h4>{item.title}</h4>
                                            <h4>{userCurrency}{item.price}/<span>({item.day} {t('day')})</span></h4>
                                        </div>

                                        <div className="center">
                                            <ul>
                                                <li className="check-ellipse-item">
                                                    <div className="icon">
                                                        <i className="flaticon-check"></i>
                                                    </div>
                                                    <p dangerouslySetInnerHTML={{ __html: item.description }} />
                                                </li>
                                            </ul>
                                            <p className="cursor-pointer tf-button-primary w-full justify-content-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClick(item);
                                                }}
                                            >
                                                {t('Continue')}
                                                <i className="icon-arrow-right-add"></i>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            </div>
            <Footer />

            {isOpenModal && selectedPackData && selectedPackData.price > 0 && (
                <OutsideClickHandler onOutsideClick={closeModal}>
                    <ReModal isOpenModal={isOpenModal} onClose={closeModal}>
                        <div className='p-5 w-100'>
                            <section>
                                <div>
                                    <div className='w-100'>
                                        <h4 className="neutral-top pb-3">{t('Select Payment Method')}</h4>
                                        <div className=''>

                                            {walletBalance > 0 && <div className='d-flex flex-row w-100 col-10 border rounded-[10px] px-[10px] py-[8px]'>
                                                <form className='w-100'>
                                                    <ul className="ft-download  bg-light  " style={{ borderRadius: '15px' }} >
                                                        <li style={{ width: 'auto' }}>
                                                            <div className='col-12 cursor-pointer w-100 d-flex'>
                                                                <div className='col-10 d-flex align-items-center'>
                                                                    <div className="icon text-dark mx-2">
                                                                        {/* Assuming IconWallet is an imported component */}
                                                                        <IconWallet />
                                                                    </div>
                                                                    <div className="app">
                                                                        <div className='text-dark text-[16px]'>{t('Your Balance')} {userCurrency}{isChecked ? walletBalance - paybleWalletAmnt : walletBalance} </div>
                                                                        <div className='text-dark text-[15px]'>{t('Available for Payment')}</div>
                                                                    </div>
                                                                </div>
                                                                <p className="switch-item col-2">
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
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </form>
                                            </div>}

                                            {filteredPaymentWay?.map((item) => (
                                                <div style={{ padding: "15px 25px" }} key={item?.id} onClick={() => { setSelectedPaymentType(item?.title); setSelectedPaymentId(item?.id); setAttributes(item?.attributes) }} className={`categories-item col-12 mt-[10px] wow pointer fadeInUp ${selectedPaymentId === item?.id ? 'active-map' : ''}`} >
                                                    <div className="icon">
                                                        <img src={`${baseUrl}${item.img}`} alt={`${item.title} icon`} />
                                                    </div>
                                                    <div>
                                                        <div className="name">
                                                            <p>{item.title}</p>
                                                        </div>
                                                        <div className="text">{item.subtitle}</div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="button-submit mt-10">
                                                <button className="tf-button-primary" onClick={handleToBook}>{t('Continue')}<i className="icon-arrow-right-add"></i></button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </ReModal>
                </OutsideClickHandler>
            )}

            {selectedPaymentType === 'Paytm' && paymentTrigger && <PaytmPayment product_amount={totalPay} booked_for={'package'} />}
            {selectedPaymentType === 'SenangPay' && paymentTrigger && <SenangpayPayment product_amount={totalPay} booked_for={'package'} attributes={attributes} />}
            {selectedPaymentType === 'Midtrans' && paymentTrigger && <MidtransPayment product_amount={totalPay} booked_for={'package'} />}
            {selectedPaymentType === '2checkout' && paymentTrigger && <TwoCheckoutPayment product_amount={totalPay} booked_for={'package'} attributes={attributes} />}
            {selectedPaymentType === 'Razorpay' && paymentTrigger && <RazorpayPayment product_amount={totalPay} booked_for={'package'} setPaymentTrigger={setPaymentTrigger} attributes={attributes} />}
            {selectedPaymentType === 'Khalti Payment' && paymentTrigger && <KhaltiPayment product_name={selectedPackData?.title} product_amount={totalPay} booked_for={'package'} />}
            {selectedPaymentType === 'MercadoPago' && paymentTrigger && <MercadoPagoPayment product_name={selectedPackData?.title} product_amount={totalPay} booked_for={'package'} attributes={attributes} />}
            {selectedPaymentType === 'Payfast' && paymentTrigger && <PayfastPayment product_name={selectedPackData?.title} product_amount={totalPay} booked_for={'package'} attributes={attributes} />}
            {selectedPaymentType === 'FlutterWave' && paymentTrigger && <FlutterwavePayment product_name={selectedPackData?.title} product_amount={totalPay} product_id={selectedPackData.id} booked_for={'package'} attributes={attributes} />}

            {isOpenPaymentModal && selectedPaymentType === 'Stripe' && paymentTrigger &&
                <ReModal isOpenPaymentModal={isOpenPaymentModal} onClose={closeModal} widths={'500px'}>
                    <div className="content-right p-5 ">
                        <form className='form-bacsic-infomation flex  flex-column'>
                            <StripePayment product_amount={totalPay} booked_for={'package'} attributes={attributes} />
                        </form>
                    </div>
                </ReModal>
            }

            {selectedPaymentType === 'PayStack' && paymentTrigger &&
                <div onClick={() => setPaymentTrigger(false)} className="PayStack">
                    <div onClick={(e) => e.stopPropagation()} className="PayStack2">
                        <PaystackPayment product_amount={totalPay} booked_for={'package'} attributes={attributes} />
                    </div>
                </div>
            }

            {
                isOpenPaymentModal && selectedPaymentType === 'Paypal' && paymentTrigger &&
                <>
                    <ReModal isOpenPaymentModal={isOpenPaymentModal} onClose={closeModal} widths={'500px'}>
                        <div className="content-right p-5 ">
                            <form className='form-bacsic-infomation flex align-items-center justify-content-center d-flex flex-column'>
                                <PaypalPayment product_amount={selectedPackData?.price} booked_for={'package'} attributes={attributes} />
                            </form>
                        </div>
                    </ReModal>
                </>
            }
        </>
    );
}

export default PackagePurchase;
/* jshint ignore:end */