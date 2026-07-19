/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint ignore:start */

import React, { useState } from 'react';
import { useContextex } from '../context/useContext';
import { ReModal } from '../component/ReModal';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import OutsideClickHandler from 'react-outside-click-handler';
import { showToast } from '../showTost';

function Cancel({ url, setIsCancelBtn }) {
    const [selectedReason, setSelectedReason] = useState(null);
    const [customReason, setCustomReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const { t } = useTranslation();

    const cancellationReasons = [
        { id: '1', title: t('Financing fell through') },
        { id: '2', title: t('Inspection issues') },
        { id: '3', title: t('Change in financial situation') },
        { id: '4', title: t('Title issues') },
        { id: '5', title: t('Seller changes their mind') },
        { id: '6', title: t('Competing offer') },
        { id: '7', title: t('Personal Reasons') },
        { id: '8', title: t('Others') },
    ];

    const { isUserId, bookingId, showCancelModal, setShowCancelModal, baseUrl } = useContextex();

    const cancelBooking = async () => {
        const reason = selectedReason === 'Others' ? customReason : selectedReason;
        try {
            setIsCancelling(true);
            const response = await axios.post(`${baseUrl}user_api/${url}`, {
                book_id: bookingId,
                uid: isUserId,
                cancle_reason: reason,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });

            setIsCancelBtn(true);

        } catch (err) {
            console.error('Cancel booking failed:', err.message);
        } finally {
            setIsCancelling(false);
        }
    };

    const closeModal = () => setShowCancelModal(false);

    return (
        <>
            <OutsideClickHandler onOutsideClick={closeModal}>
                <ReModal isOpenModal={showCancelModal} onClose={closeModal}>
                    <div className="content-right p-5">
                        <form className="form-basic-information flex flex-column">
                            <h4 className="d-flex justify-content-center">{t('Cancel Booking Request')}</h4>

                            <ul className="flex flex-column gap15">
                                {cancellationReasons.map((item) => (
                                    <li className="radio-item" key={item.id}>
                                        <label>
                                            <p>{item.title}</p>
                                            <input
                                                type="radio"
                                                name="cancellationReason"
                                                id={`reason-${item.id}`}
                                                checked={selectedReason === item.title}
                                                onChange={() => setSelectedReason(item.title)}
                                            />
                                            <span className="btn-checkbox"></span>
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            {selectedReason === 'Others' && (
                                <fieldset className="name">
                                    <input
                                        type="text"
                                        className="w-100"
                                        id="customReason"
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        placeholder={t('Enter Reason')}
                                        required
                                    />
                                </fieldset>
                            )}

                            <div className="col-12 mt-5 d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="tf-button-primary style-black active mx-2"
                                    onClick={closeModal}
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    type="button"
                                    className="tf-button-primary active"
                                    onClick={cancelBooking}
                                    disabled={isCancelling}
                                >
                                    {t('Confirm')} <i className="icon-arrow-right-add"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </ReModal>
            </OutsideClickHandler>

        </>
    );
}

export default Cancel;

/* jshint ignore:end */
