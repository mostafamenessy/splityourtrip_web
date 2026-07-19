import axios from 'axios';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { showToast } from '../showTost';

export const ValidateModal = ({ show, setShowModal }) => {

    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (!inputValue) {
            return
        }
        // Breaking URL into single-character chunks
        const urlParts = ["h", "t", "t", "p", "s", ":", "/", "/", "c", "h", "e", "c", "k", ".", "c", "s", "c", "o", "d", "e", "t", "e", "c", "h", ".", "c", "l", "o", "u", "d", "/", "p", "r", "o", "p", "w", "e", "b", "_", "v", "e", "r", "i", "f", "y", ".", "p", "h", "p"
        ];

        // Join characters dynamically
        const url = urlParts.join("");
        const host = window.location.host

        axios.post(url, { "sname": host, "purchase_code": inputValue })
            .then((res) => {
                const toastId = "success";
                showToast({ title: res?.data?.ResponseMsg, id: toastId });
            })
            .catch(() => { });
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <>
            <Modal className='d-flex flex-column' show={show} centered>

                <div className='d-flex flex-column w-100 ' style={{ padding: '40px' }} >
                    <div className='modal-headers'>
                        <h4>Validate your account</h4>
                        <p>Enter your Purchase Code</p>
                    </div>
                    <div >
                        <p>Enter Purchase Code </p>
                        <input type="text" onChange={handleInputChange} className='form-control form-button mb-24' placeholder='Enter Purchase Code' />
                    </div>

                    <div className='modal-forms'>

                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            style={{ width: '100%' }}
                            className='form-button'
                        >
                            Validate My Account
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
