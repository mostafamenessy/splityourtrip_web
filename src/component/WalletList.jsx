/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useContextex, usePayment } from "../context/useContext";
import { IconWallet } from "@tabler/icons-react";
import { KhaltiPayment } from "../component/KhaltiPayment";
import { FlutterwavePayment } from "../component/FlutterwavePayment";
import { PaystackPayment } from "../component/PaystackPayment";
import { RazorpayPayment } from "../component/RazorpayPayment";
import { ReModal } from "../component/ReModal";
import PaymentList from "../component/PaymentList";
import { PaypalPayment } from "../component/PaypalPayment";
import { StripePayment } from "../component/StripePayment";
import SenangpayPayment from "../component/SenangpayPayment";
import { PaytmPayment } from "../component/PaytmPayment";
import { MidtransPayment } from "../component/MidtransPayment";
import { TwoCheckoutPayment } from "../component/TwoCheckoutPayment";
import PayfastPayment from "../component/PayfastPayment";
import { MercadoPagoPayment } from "../component/MercadoPagoPayment";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../showTost";

export const WalletList = ({ activeName }) => {
    const [userWalletItem, setUserWalletItem] = useState(null);
    const [selectedPaymentId, setSelectedPaymentId] = useState("");
    const [paymentTrigger, setPaymentTrigger] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [attributes, setAttributes] = useState("");
    const [loading, setloading] = useState(true);

    const { t } = useTranslation();
    const {
        isUserId,
        baseUrl,
        userCurrency,
        paymentGatwayList,
        setWalletAddAmount,
        transactionId,
        walletAddAmount,
        userWalletAmount,
        setUserWalletAmount,
        setTransactionId
    } = useContextex();

    const { walletPayment } = usePayment();
    const navigate = useNavigate();


    useEffect(() => {
        if ((selectedPaymentId === 'Stripe' || selectedPaymentId === 'Paypal') && paymentTrigger) {
            setIsOpenModal(true);
        }
    }, [selectedPaymentId, paymentTrigger]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setloading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_wallet_report.php?`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                localStorage.setItem('avblWalletBlnc', response?.data?.wallet);

                if (response?.data?.ResponseCode === '200') {
                    setUserWalletItem(response?.data?.Walletitem);
                    setUserWalletAmount(localStorage.getItem('avblWalletBlnc'));
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [isUserId]);

    const updateWallet = async () => {
        if (transactionId) {
            try {
                if (walletAddAmount > 0 && transactionId) {
                    const response = await axios.post(`${baseUrl}user_api/u_wallet_up.php?`, {
                        uid: isUserId,
                        wallet: walletAddAmount
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log("u_wallet_up.php", response.data);


                    const toastId = response?.data.ResponseCode === '200' ? "success" : "error";
                    showToast({ title: response?.data?.ResponseMsg, id: toastId });

                    localStorage.setItem('avblWalletBlnc', response?.data?.wallet);

                    if (response?.data.ResponseCode === '200') {
                        localStorage.removeItem('walletAddAmount');
                    }

                    setPaymentTrigger(false)
                    navigate('/dashboard');
                    await walletPayment();
                    setTransactionId('');
                    setWalletAddAmount(0);
                }
            } catch (error) {
                console.error("Error updating wallet:", error);
            }
        }
    };

    useEffect(() => {
        if (!transactionId) return;
        updateWallet();
        localStorage.setItem('walletAddAmount', walletAddAmount);
    }, [transactionId, walletAddAmount]);

    const closeModal = () => setIsOpenModal(false);

    const product_name = "Subscribe Payment";
    const product_amount = walletAddAmount;
    const product_id = 1;
    const filteredPaymentWay = paymentGatwayList?.filter(item => item?.p_show !== '0' && item?.id !== '2');
    localStorage.setItem('walletAmnt', walletAddAmount);

    const HandleContinue = () => {

        if (!walletAddAmount) {
            showToast({ title: "Please enter amount !!", id: "error" });
            return;
        }

        if (!selectedPaymentId) {
            showToast({ title: "Select payment method !!", id: "error" });
            return;
        }

        localStorage.setItem('spid', selectedPaymentId);
        setPaymentTrigger(true);
    }

    return (
        <>

            {loading
                ? <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
                    <div className="middle2"></div>
                </div>
                : <div className="">

                    <div className='d-flex mob-dash flex-col pt-5 pb-5'>
                        <div className='col-10'>
                            <h3>{t('My Wallet')}</h3>
                            <div className="text-content">
                                {t('Your Current Wallet Balance is')} <span style={{ color: "red" }}>{userCurrency}{userWalletAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid-section-1">
                        <div className="wg-box pl-44" >
                            <div className="container col-12 ">

                                <div className="col-sm-12 w-100 col-md-6 position-relative">
                                    <div className='d-flex my-3 align-items-center'>
                                        <div className='col-sm-12 col-md-12 col-xl-9 col-lg-9'>
                                            <h6>{t('Add Amount')}</h6>
                                        </div>
                                    </div>
                                    <form>
                                        <fieldset className="name">
                                            <input
                                                type="text"
                                                className='w-100'
                                                onChange={(e) => setWalletAddAmount(e.target.value)}
                                                id="galleryCategoryName"
                                                name="prop_title"
                                                placeholder="Add Amount"
                                                required
                                            />
                                        </fieldset>
                                    </form>
                                </div>

                                <div className="col-sm-12 w-100 col-md-6 position-relative">
                                    <div className='d-flex my-3 align-items-center'>
                                        <div className='col-sm-12 col-md-12 col-xl-9 col-lg-9'>
                                            <h6>{t('Select Payment Method')}</h6>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 h-100">
                                    <div className="wrap" style={{ overflowY: 'auto', height: '70%' }}>
                                        <div className="row gap-3 col-12 px-3 d-flex justify-content-between" >
                                            {filteredPaymentWay?.map((item) => (
                                                <div key={item?.id} className={`pointer categories-item col-12 col-sm-6 col-md-6 col-lg-5 col-xl-5 wow fadeInUp ${selectedPaymentId === item?.title ? 'active-map' : ''}`} onClick={() => { setSelectedPaymentId(item?.title); setAttributes(item?.attributes) }}>
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
                                        </div>
                                    </div>
                                </div>

                                <div className="button-submit mt-10">
                                    <button className="tf-button-primary" onClick={HandleContinue}>
                                        {t('Continue')}<i className="icon-arrow-right-add"></i>
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="wg-box w-[30%]" style={{ height: '100vh' }}>
                            <h4>{t('Recent Transactions')}</h4>
                            <ul className="wrap-recent-activities" style={{ overflowY: 'auto', height: '90%' }}>
                                {userWalletItem?.map((item, index) => (

                                    <li className="recent-activities-item d-flex justify-content-between" key={index}>
                                        <div className="d-flex items-center gap-4">
                                            <div><IconWallet /></div>
                                            <div>
                                                <p>{item?.tdate}</p>
                                                <p>{item?.status}</p>
                                            </div>
                                        </div>
                                        <p className={item?.status === 'Credit' ? 'text-primary' : 'text-warning'}>
                                            {userCurrency}{item?.amt}{item?.status === 'Credit' ? '+' : '-'}
                                        </p>
                                    </li>

                                ))}
                                {userWalletItem?.length === 0 && (
                                    <div style={{ height: "400px" }} className='align-items-center justify-content-center mt-5 d-flex '>
                                        <div>
                                            <h4 className='empty-message'>{t('Go & Add your Amount')}</h4>
                                        </div>
                                    </div>
                                )}
                            </ul>
                        </div>

                    </div>

                </div>}



            {selectedPaymentId === 'Khalti Payment' && paymentTrigger && <KhaltiPayment booked_for={'wallet'} product_name={product_name} product_amount={product_amount} />}
            {selectedPaymentId === 'FlutterWave' && paymentTrigger && <FlutterwavePayment product_name={product_name} booked_for={'wallet'} product_amount={product_amount} product_id={product_id} attributes={attributes} />}
            {selectedPaymentId === 'Razorpay' && paymentTrigger && <RazorpayPayment product_amount={product_amount} booked_for={'wallet'} setPaymentTrigger={setPaymentTrigger} attributes={attributes} />}

            {selectedPaymentId === 'PayStack' && paymentTrigger &&
                <div onClick={() => setPaymentTrigger(false)} className="PayStack">
                    <div onClick={(e) => e.stopPropagation()} className="PayStack2">
                        <PaystackPayment product_amount={product_amount} booked_for={'wallet'} attributes={attributes} />
                    </div>
                </div>
            }

            {isOpenModal && selectedPaymentId === 'Stripe' && paymentTrigger &&

                <ReModal isOpenModal={isOpenModal} onClose={closeModal} widths={'500px'}>
                    <div className="content-right p-5 ">
                        <form className='form-bacsic-infomation flex  flex-column'>
                            <StripePayment product_amount={product_amount} booked_for={'wallet'} attributes={attributes} />
                        </form>
                    </div>
                </ReModal>
            }

            {isOpenModal && selectedPaymentId === 'Paypal' && paymentTrigger &&
                <ReModal isOpenModal={isOpenModal} onClose={closeModal} widths={'500px'}>
                    <div className="content-right p-5 ">
                        <form className='form-bacsic-infomation flex align-items-center justify-content-center d-flex flex-column'>
                            <PaypalPayment product_amount={product_amount} booked_for={'wallet'} attributes={attributes} />
                        </form>
                    </div>
                </ReModal>
            }

            {activeName === 'Wallet' && <PaymentList />}
            {selectedPaymentId === 'Paytm' && paymentTrigger && <PaytmPayment product_amount={product_amount} booked_for={'wallet'} />}
            {selectedPaymentId === 'SenangPay' && paymentTrigger && <SenangpayPayment product_amount={product_amount} booked_for={'wallet'} attributes={attributes} />}
            {selectedPaymentId === 'Midtrans' && paymentTrigger && <MidtransPayment product_amount={product_amount} booked_for={'wallet'} />}
            {selectedPaymentId === '2checkout' && paymentTrigger && <TwoCheckoutPayment product_amount={product_amount} booked_for={'wallet'} attributes={attributes} />}
            {selectedPaymentId === 'Payfast' && paymentTrigger && <PayfastPayment product_name={product_name} product_amount={product_amount} booked_for={'wallet'} attributes={attributes} />}
            {selectedPaymentId === 'MercadoPago' && paymentTrigger && <MercadoPagoPayment product_name={product_name} product_amount={product_amount} booked_for={'wallet'} attributes={attributes} />}

        </>
    )
}
/* jshint ignore:end */