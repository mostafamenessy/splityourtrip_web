/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import React, { useEffect, useMemo, useState } from 'react';
import { useContextex } from '../context/useContext';
import { IconCopy } from '@tabler/icons-react';
import Cancel from '../component/Cancel';
import { ReModal } from '../component/ReModal';
import { Rating } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import { showToast } from '../showTost';

function Receipt({ dropedReview, setDropedReview }) {
    const { isUserId, bookingId, confirmCurrentBook, showCancelModal, setShowCancelModal, loginUserData, bookedOtherUserData, currentPage, baseUrl } = useContextex();
    const [receiptData, setReceiptData] = useState([]);

    const [isConfirmBtn, setIsConfirmBtn] = useState(false);
    const [isCheckInBtn, setIsCheckInBtn] = useState(false);
    const [isCheckOutBtn, setIsCheckOutBtn] = useState(false);
    const [isReviewBtn, setIsReviewBtn] = useState(false);
    const [isCancelBtn, setIsCancelBtn] = useState(false);

    const [checkInButton, setCheckInButton] = useState(false);
    const [checkOutButton, setCheckOutButton] = useState(false);
    const [confirmBtn, setConfirmBtn] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {

        const fetchCountryDataAsync = async () => {
            const url = currentPage === 'addproparty' ? 'my_book_details.php' : 'u_book_details.php?'
            try {
                const response = await axios.post(`${baseUrl}user_api/${url}`, {
                    book_id: bookingId,
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode) {
                    setReceiptData(response?.data?.bookdetails)
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [bookingId, isCheckOutBtn, isCheckInBtn, isConfirmBtn, isReviewBtn, isCancelBtn]);


    const fetchDataOrder = async () => {
        try {
            if (confirmBtn) {
                await handleConfirm();
            } else if (checkInButton) {
                await handleCheckIn();
            } else if (checkOutButton) {
                await handleCheckOut();
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleConfirm = async () => {
        try {
            const response = await axios.post(`${baseUrl}user_api/u_confim.php?`, {
                uid: isUserId,
                book_id: bookingId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data?.ResponseCode === '200') {
                setIsConfirmBtn(true);
                const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
                showToast({ title: response?.data?.ResponseMsg, id: toastId });
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleCheckIn = async () => {
        try {
            const response = await axios.post(`${baseUrl}user_api/u_check_in.php?`, {
                uid: isUserId,
                book_id: bookingId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data?.ResponseCode === '200') {
                setIsCheckInBtn(true);
                const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
                showToast({ title: response?.data?.ResponseMsg, id: toastId });
            }
        } catch (err) {
            console.error(err.message);
        }
    };


    const handleCheckOut = async () => {
        try {
            const response = await axios.post(`${baseUrl}user_api/u_check_out.php?`, {
                uid: isUserId,
                book_id: bookingId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response?.data?.ResponseCode === '200') {
                const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
                showToast({ title: response?.data?.ResponseMsg, id: toastId });
                setIsCheckOutBtn(true);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchDataOrder();
    }, [confirmBtn, checkInButton, checkOutButton]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast({ title: 'Text copied to clipboard', id: "success" });
            })
            .catch(err => {
                showToast({ title: 'Failed to copy!', id: "error" });
            });
    };

    const closeModal = () => setIsOpenModal(false);

    const starStyle = {
        fontSize: '4rem',
    };

    const handleDropReview = useMemo(() => async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${baseUrl}user_api/u_rate_update.php`, {
                uid: isUserId,
                book_id: receiptData?.book_id,
                total_rate: reviewRating,
                rate_text: reviewText
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsReviewBtn(true);
            if (response?.data?.status === 'success') {
                setDropedReview(false);
            }
        } catch (err) {
            console.error(err.message);
        }
        setIsOpenModal(false);
    }, [isUserId, reviewRating, reviewText, isOpenModal, dropedReview])



    return (
        <>
            <div className="main-content ">

                <div className="shop-order-wrap">
                    <div className="cl-container">
                        <div className="row justify-center">
                            <div className="col-xl-8">
                                <div className="order-completed">
                                    <div className="order-info">
                                        <div className="item">
                                            <p>{t('Book Id')}</p>
                                            <p>{receiptData?.book_id}</p>
                                        </div>
                                        <div className="item">
                                            <p>{t('Booking Date')}</p>
                                            <p>{receiptData?.book_date}</p>
                                        </div>
                                        <div className="item">
                                            <p>{t('Sub Total')}</p>
                                            <p>${receiptData?.subtotal}</p>
                                        </div>
                                        <div className="item">
                                            <p>{t('Payment Method')}</p>
                                            <p>{receiptData?.payment_title}</p>
                                        </div>
                                    </div>

                                    <div className="sidebar-shop">

                                        <div className="sidebar-shop-item your-order">
                                            <div className="title">{t('Booking Schedule')}</div>

                                            <div className="divider"></div>
                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Booking Date')}</div>
                                                <div className="text">{receiptData?.book_date}</div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Check in')} </div>
                                                <div className="text">{receiptData?.check_in}</div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Check out')}</div>
                                                <div className="text">{receiptData?.check_out}</div>
                                            </div>
                                            {receiptData?.check_intime && <div className="flex items-center justify-between">
                                                <div className="text">{t('CheckIn')} {t('Date&Time')}</div>
                                                <div className="text">{receiptData?.check_intime}</div>
                                            </div>
                                            }
                                            {receiptData?.check_outtime && <div className="flex items-center justify-between">
                                                <div className="text">{t('CheckOut')} {t('Date&Time')}</div>
                                                <div className="text">{receiptData?.check_outtime}</div>
                                            </div>
                                            }
                                            {receiptData?.noguest && <div className="flex items-center justify-between">
                                                <div className="text">{t('Number Of Guest')}</div>
                                                <div className="text">{receiptData?.noguest}</div>
                                            </div>
                                            }

                                        </div>

                                        <div className="sidebar-shop-item your-order">
                                            <div className="title">{t('Booking Details')}</div>

                                            <div className="divider"></div>
                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Name')}</div>
                                                <div className="text">
                                                    {currentPage === 'addproparty'
                                                        && (bookedOtherUserData?.firstName ? bookedOtherUserData?.firstName : receiptData?.customer_name)
                                                    }

                                                    {currentPage === 'dash-board' && (receiptData?.fname ? receiptData.fname : loginUserData?.UserLogin?.name)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Phone Number')}</div>
                                                <div className="text">
                                                    {currentPage === 'addproparty'
                                                        && (bookedOtherUserData?.phone || receiptData?.customer_mobile)
                                                    }
                                                    {currentPage === 'dash-board' && (
                                                        <>
                                                            {receiptData?.ccode || loginUserData?.UserLogin?.ccode} &nbsp;
                                                            {receiptData?.mobile || loginUserData?.UserLogin?.mobile}
                                                        </>
                                                        // receiptData?.mobile ?  receiptData?.mobile : loginUserData?.UserLogin?.mobile
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Payment Title')}</div>
                                                <div className="text">{receiptData?.payment_title}</div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Payment Status')}</div>
                                                <div className="text">{receiptData?.p_method_id === '2' && receiptData?.book_status !== 'Completed' ? 'Unpaid' : 'Paid'}</div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Booking Status')}</div>
                                                <div className="text">{receiptData?.book_status}</div>
                                            </div>
                                            {receiptData?.transaction_id !== '0' && (
                                                <div className="flex mobile-view-tid items-center justify-between">
                                                    <div className="text">{t('Transaction Id')}</div>
                                                    <div className="text w-sm-100 transaction-id  flex flex-row">{receiptData?.transaction_id}
                                                        <span className='pointer ' onClick={() => handleCopy(receiptData?.transaction_id)}>
                                                            <IconCopy />
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="sidebar-shop-item your-order">
                                            <div className="title">{t('Price Section')}</div>

                                            <div className="divider"></div>

                                            <div className="flex items-center mobile-view-tid justify-between">
                                                <div className="text">{t('Property Price')}</div>
                                                <div className="text transaction-id-days">({receiptData?.prop_price} X {receiptData?.total_day}{t('days')})</div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text">{t('Sub Total')}</div>
                                                <div className="text">${receiptData?.subtotal}</div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-1">{t('Tax')}</div>
                                                <div className="text-1">${receiptData?.tax}</div>
                                            </div>

                                            {receiptData?.wall_amt > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <div className="text-1">{t('Wallet Amount')}</div>
                                                    <div className="text-1 text-danger">${receiptData?.wall_amt}</div>
                                                </div>
                                            )}

                                            {receiptData.cou_amt > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <div className="text-1">{t('Coupon Amount')}</div>
                                                    <div className="text-1 text-danger">${receiptData?.cou_amt}</div>
                                                </div>
                                            )}

                                            <div className="divider"></div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-1">{t('Total')}</div>
                                                <div className="text-1">${receiptData?.total}</div>
                                            </div>

                                        </div>

                                        {receiptData?.add_note && (
                                            <div className='sidebar-shop-item your-order'>
                                                <div className="title p-0 m-0">{t('Note')}:</div>
                                                <p className='p-0 m-0'>{receiptData?.add_note}</p>
                                            </div>
                                        )}

                                    </div>

                                    <div className="main-content">
                                        {confirmCurrentBook && receiptData && currentPage === 'addproparty' && (
                                            <div className="d-flex mt-5 justify-content-between">
                                                {receiptData?.book_status !== 'Cancelled' && (
                                                    <p className="cursor-pointer tf-button-primary style-black active mx-2" onClick={() => setShowCancelModal(!showCancelModal)}>
                                                        {t('Cancel Booking')}
                                                    </p>
                                                )}

                                                {receiptData?.book_status === 'Booked' && (
                                                    <p className="cursor-pointer tf-button-primary active" onClick={() => {
                                                        setCheckInButton(false);
                                                        setConfirmBtn(true);
                                                        setCheckOutButton(false);
                                                    }}>
                                                        {t('Confirm')} <i className="icon-arrow-right-add"></i>
                                                    </p>
                                                )}

                                                {receiptData?.book_status === 'Confirmed' && (
                                                    <p className="cursor-pointer tf-button-primary active" onClick={() => {
                                                        setCheckOutButton(false);
                                                        setCheckInButton(true);
                                                        setConfirmBtn(false);
                                                    }}>
                                                        {t('Check In')}
                                                    </p>
                                                )}

                                                {(receiptData?.book_status === 'Check_in') && (
                                                    <p className="cursor-pointer tf-button-primary active" onClick={() => {
                                                        setCheckOutButton(true);
                                                        setCheckInButton(false);
                                                        setConfirmBtn(false);
                                                    }}>
                                                        {t('Check Out')}
                                                    </p>
                                                )}

                                            </div>
                                        )}

                                        {currentPage !== 'addproparty' && receiptData?.is_rate === "0" && receiptData?.book_status === 'Completed' && (
                                            <p className="cursor-pointer mt-5 tf-button-primary active" onClick={() => setIsOpenModal(true)}>{t('Drop Review')}</p>
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isOpenModal && (
                <OutsideClickHandler onOutsideClick={closeModal}>
                    <ReModal isOpenModal={isOpenModal} onClose={closeModal}>
                        <div className="content-right p-5 ">
                            <form className='form-bacsic-infomation flex align-items-center justify-content-center d-flex flex-column'>
                                <div className="leave-a-review w-75">
                                    <h4 className="wow fadeInUp">{t('Leave A Review')}</h4>
                                    <div>
                                        <p className="wow font-weight-bold fadeInUp">{t('How was your experience')}</p>
                                        <div>
                                            <Rating
                                                name="custom-size"
                                                defaultValue={1}
                                                precision={0.5}
                                                icon={<span style={starStyle}>&#9733;</span>}
                                                emptyIcon={<span style={starStyle}>&#9734;</span>}
                                                onChange={(event, newValue) => setReviewRating(newValue)}
                                            />
                                        </div>
                                    </div>
                                    <form className="form-comment">
                                        <p className="wow font-weight-bold fadeInUp">{t('Write Your Review')}</p>
                                        <fieldset className="message wow fadeInUp has-top-title">
                                            <textarea name="message" rows="4" placeholder="Your Review here..." className="" tabindex="2" aria-required="true" required onChange={(e) => setReviewText(e.target.value)}></textarea>
                                        </fieldset>
                                        <div className='d-flex justify-content-between'>
                                            <div className="button-submit wow fadeInUp">
                                                <button className="tf-button-primary style-black active" type="submit" onClick={() => setIsOpenModal(false)}>{t('Maybe Later')} </button>
                                            </div>
                                            <div className="button-submit wow fadeInUp">
                                                <button className="tf-button-primary" type="submit" disabled={!reviewText && !reviewRating} onClick={handleDropReview}>{t('Submit Review')} <i className="icon-arrow-right-add"></i></button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </form>
                        </div>
                    </ReModal>
                </OutsideClickHandler>
            )}
            {showCancelModal && <Cancel url={'u_my_book_cancle.php'} setIsCancelBtn={setIsCancelBtn} />}
        </>
    )
}

export default Receipt

/* jshint ignore:end */