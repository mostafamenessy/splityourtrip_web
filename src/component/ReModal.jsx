/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useEffect } from 'react';
import { Modal } from 'bootstrap';
import OutsideClickHandler from 'react-outside-click-handler'

export const ReModal = ({ isOpenModal, onClose, children, widths, isOutSide }) => {
  useEffect(() => {
    const modalElement = document.getElementById('modallogin');
    const modal = new Modal(modalElement);
    modal.show();
  }, [isOpenModal]);

  const modalStyle = widths ? { maxWidth: widths, justifyContent: 'center', alignItems: 'center'} : {};
  return (
    // <OutsideClickHandler onOutsideClick={onClose}>
      <div className="modal fade modalCenter" id="modallogin">
        <div className="modal-dialog modal-dialog-centered" style={modalStyle} role="document">
          <div className="modal-content modal-sm" style={{ maxWidth: widths || 'auto' }}>
            <p className="cursor-pointer btn-hide-modal pointer" data-bs-dismiss="modal" onClick={onClose}><i className="pointer icon-close"></i></p>
            {children}
          </div>
        </div>
      </div>
    //  {/* </OutsideClickHandler> */}
  );
};
/* jshint ignore:end */
