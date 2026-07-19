/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint ignore:start */

import { useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { showToast } from '../showTost';

function AddGalleryCategory() {
    const { isUserId, userPropertyList, isEditSelectedProperty, editSelectedMyGallaryCategory, baseUrl } = useContextex();
    const { t } = useTranslation();

    // State hooks for form data
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedPropertyStatus, setSelectedPropertyStatus] = useState('0');
    const [galleryCategoryName, setGalleryCategoryName] = useState('');
    const [defaultSelectedProperty, setDefaultSelectedProperty] = useState('');
    const [errors, setErrors] = useState({
        galleryCategoryName: '',
        selectedPropertyStatus: '',
        selectedProperty: ''
    });

    useEffect(() => {
        if (isEditSelectedProperty && editSelectedMyGallaryCategory) {
            const { property_id, property_title, status, cat_title } = editSelectedMyGallaryCategory;
            setSelectedProperty(property_id);
            setDefaultSelectedProperty(property_title || '');
            setSelectedPropertyStatus(status);
            setGalleryCategoryName(cat_title || '');
        } else {
            setSelectedProperty('');
            setSelectedPropertyStatus('0');
            setGalleryCategoryName('');
            setDefaultSelectedProperty('');
        }
    }, [isEditSelectedProperty, editSelectedMyGallaryCategory]);

    const validateAddCatInputs = () => {
        const newErrors = { galleryCategoryName: '', selectedPropertyStatus: '', selectedProperty: '' };
        let isValid = true;

        if (!selectedProperty) {
            newErrors.selectedProperty = "Please select a valid property";
            isValid = false;
        }
        if (!selectedPropertyStatus) {
            newErrors.selectedPropertyStatus = "Please select a valid property status";
            isValid = false;
        }
        if (!galleryCategoryName) {
            newErrors.galleryCategoryName = "Please enter a gallery category name";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAddGalleryCategory = async (event) => {
        event.preventDefault();

        if (!validateAddCatInputs()) return;

        const requestData = {
            status: selectedPropertyStatus,
            prop_id: selectedProperty,
            uid: isUserId,
            title: galleryCategoryName,
            record_id: isEditSelectedProperty ? editSelectedMyGallaryCategory.id : undefined
        };

        const endpoint = isEditSelectedProperty ? 'u_gal_cat_edit.php' : 'u_gal_cat_add.php';

        try {
            const response = await axios.post(`${baseUrl}user_api/${endpoint}`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });

        } catch (err) {
            console.error(err.message);
        }
    };


    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleSelectProperty = (event) => {
        const { dataset, innerText } = event.target;
        setSelectedProperty(dataset.value);
        setDefaultSelectedProperty(innerText);
    };

    const handleSelectStatus = (event) => {
        setSelectedPropertyStatus(event.target.dataset.value);
    };

    return (
        <>
            <form className="form-basic-information flex flex-column" onSubmit={handleAddGalleryCategory}>
                <div className='cols'>
                    <div className='col-12'>
                        <div className={`m-bottom nice-select ${errors.selectedProperty ? 'border border-danger' : ''}`} tabIndex="0">
                            <span className="current">{selectedProperty ? defaultSelectedProperty : 'Property Type'}</span>
                            <ul className="list">
                                {userPropertyList?.map((item) => (
                                    <li
                                        key={item.id}
                                        className={`option ${selectedProperty === item.id ? 'selected' : ''}`}
                                        onClick={handleSelectProperty}
                                        data-value={item.id}
                                    >
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <span className='span-text text-danger mx-4'>{errors?.selectedProperty}</span>
                    </div>
                </div>

                <fieldset className="text">
                    <input
                        type="text" style={{ border: "1px solid black" }}
                        className={`m-bottom ${errors.galleryCategoryName ? 'border border-danger' : ''}`}
                        placeholder="Gallery Category Name"
                        value={galleryCategoryName}
                        onChange={handleChange(setGalleryCategoryName)}
                        aria-required="true"
                    />
                    <span className='span-text text-danger mx-4'>{errors?.galleryCategoryName}</span>
                </fieldset>

                <div className='cols mt-[10px]'>
                    <div className='col-12'>
                        <div className={`m-bottom nice-select ${errors.selectedPropertyStatus ? 'border border-danger' : ''}`} tabIndex="0">
                            <span className="current">{selectedPropertyStatus === '0' ? 'Publish' : 'Unpublish'}</span>
                            <ul className="list">
                                <li
                                    className={`option ${selectedPropertyStatus === '0' ? 'selected' : ''}`}
                                    onClick={handleSelectStatus}
                                    data-value="0"
                                >
                                    {t('Publish')}
                                </li>
                                <li
                                    className={`option ${selectedPropertyStatus === '1' ? 'selected' : ''}`}
                                    onClick={handleSelectStatus}
                                    data-value="1"
                                >
                                    {t('Unpublish')}
                                </li>
                            </ul>
                        </div>
                        <span className='span-text text-danger mx-4'>{errors?.selectedPropertyStatus}</span>
                    </div>
                </div>

                <div className="button-submit mt-10">
                    <button type="submit" className="tf-button-primary">
                        {t('Save')} & {t('Preview')} <i className="icon-arrow-right-add"></i>
                    </button>
                </div>

            </form>
        </>
    );
}

export default AddGalleryCategory;

/* jshint ignore:end */
