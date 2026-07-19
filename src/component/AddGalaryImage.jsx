/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import { useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { showToast } from '../showTost';

const AddGalleryImage = () => {
    const [itemData, setItemData] = useState([]);
    const [galCatList, setGalCatList] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedPropertyStatus, setSelectedPropertyStatus] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [defImg, setDefImg] = useState(null);
    const [defaultSelectedProperty, setDefaultSelectedProperty] = useState(null);
    const [propList, setPropList] = useState(null);
    const [uniqueProperties, setUniqueProperties] = useState([]);
    const [errors, setErrors] = useState({
        selectedType: '',
        selectedProperty: '',
        selectedPropertyStatus: '',
        selectedFile: ''
    });

    const { isUserId, editSelectedMyGallaryImage, isEditSelectedProperty, baseUrl } = useContextex();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_gallery_cat_list.php?`, {
                    uid: isUserId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setPropList(response?.data?.galcatlist);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [isUserId]);


    useEffect(() => {
        const titles = [];
        propList?.forEach(item => {
            if (item?.property_title && !titles.includes(item.property_title)) {
                titles.push(item.property_title);
            }
        });
        setUniqueProperties(titles);
    }, [propList]);

    useEffect(() => {
        const fetchGalCatDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/property_wise_galcat.php?`, {
                    uid: isUserId,
                    prop_id: selectedProperty
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setGalCatList(response?.data?.galcatlist);
                    setSelectedType(response?.data?.galcatlist.length > 0 ? response?.data?.galcatlist[0].category_id : '');
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchGalCatDataAsync();
    }, [selectedProperty, isUserId]);


    useEffect(() => {
        if (isEditSelectedProperty && editSelectedMyGallaryImage) {
            const { image, property_id, property_title, category_id, status } = editSelectedMyGallaryImage;
            setSelectedFile('0');
            setSelectedProperty(property_id);
            setDefaultSelectedProperty(property_title || '');
            setSelectedType(category_id);
            setSelectedPropertyStatus(status);
            setDefImg(image);
        } else {
            resetForm();
        }
    }, [isEditSelectedProperty, editSelectedMyGallaryImage]);

    const resetForm = () => {
        setSelectedFile(null);
        setSelectedProperty('');
        setSelectedType('');
        setSelectedPropertyStatus('0');
        setGalCatList([]);
    };

    const groupItems = (galleryList) => {
        return galleryList.reduce((acc, item) => {
            if (!acc[item.property_id]) {
                acc[item.property_id] = {
                    property_id: item.property_id,
                    property_title: item.property_title,
                    categories: []
                };
            }
            const categoryExists = acc[item.property_id].categories.some(category => category.category_id === item.category_id);

            if (!categoryExists) {
                acc[item.property_id].categories.push({
                    category_id: item.category_id,
                    category_name: item.category_title.trim()
                });
            }

            return acc;
        }, {});
    };

    const handleSelectProperty = (propertyId) => {
        setSelectedProperty(propertyId);
        const property = itemData.find(item => item.property_id.toString() === propertyId);
        setGalCatList(property ? property.categories : []);
        setSelectedType(property ? property.categories[0]?.category_id : '');
    };

    const handleImageChange = (event) => {
        setDefImg(null);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateAddImgInputs = () => {
        const newErrors = { selectedFile: '', selectedProperty: '', selectedPropertyStatus: '', selectedType: '' };
        let isValid = true;

        if (!selectedFile) {
            newErrors.selectedFile = "Please select a valid image";
            isValid = false;
        }
        if (!selectedProperty) {
            newErrors.selectedProperty = "Please select a valid property";
            isValid = false;
        }
        if (!selectedPropertyStatus) {
            newErrors.selectedPropertyStatus = "Please select a valid property status";
            isValid = false;
        }
        if (!selectedType) {
            newErrors.selectedType = "Please select a valid gallery category";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAddImage = async (event) => {
        event.preventDefault();
        if (!validateAddImgInputs()) return;

        const formData = {
            uid: isUserId,
            prop_id: selectedProperty,
            cat_id: selectedType,
            status: selectedPropertyStatus,
            img: selectedFile || '0',
            record_id: isEditSelectedProperty ? editSelectedMyGallaryImage.id : undefined
        };

        const endpoint = isEditSelectedProperty ? 'update_gallery.php' : 'add_gallery.php';

        try {
            const response = await axios.post(`${baseUrl}user_api/${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const toastId = response?.data?.ResponseCode === '200' ? "success" : "error";
            showToast({ title: response?.data?.ResponseMsg, id: toastId });

            resetForm();
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <>
            <form className="form-basic-information flex flex-column" onSubmit={handleAddImage}>

                <div className='cols'>
                    <div className='col-12'>
                        <div className={`m-bottom nice-select ${errors.selectedProperty ? 'bdr-red' : '#E5E5EA'}`} tabIndex="0">
                            <span className="current">
                                {selectedProperty ? defaultSelectedProperty : 'Select Property'}
                            </span>
                            <ul className="list">
                                {uniqueProperties?.map((title, index) => {
                                    const item = propList.find(item => item.property_title === title);
                                    return (
                                        <li
                                            key={item?.property_id}
                                            className={selectedProperty === item?.property_id.toString() ? 'option selected' : 'option'}
                                            onClick={() => handleSelectProperty(item?.property_id)}
                                        >
                                            {title}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <span className='span-text text-danger mx-4'>{errors?.selectedProperty}</span>
                    </div>
                </div>

                <div className="cols">
                    <div className="col-12">
                        <div className="input  input--secondary">
                            <div className="right ">
                                <label className="uploadfile w-100" style={{ float: 'left' }}>
                                    <div
                                        className={`m-bottom tf-button-primary w-100 style-bg-white ${errors.selectedFile ? 'bdr-red' : '#E5E5EA'}`}
                                    >
                                        {selectedFile || defImg ? (
                                            <img
                                                src={defImg ? `${baseUrl}${defImg}` : `data:image/jpeg;base64,${selectedFile}`}
                                                className='m-0'
                                                alt="Selected"
                                                style={{ width: '30px', height: '30px' }}
                                            />
                                        ) : null}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className=""
                                            name="file"
                                        />
                                    </div>

                                </label>
                            </div>
                        </div>
                        <span className='span-text text-danger mx-4 '>{errors?.selectedFile}</span>
                    </div>
                </div>

                <div className="cols">
                    <div className='col-12'>
                        <div className={`m-bottom nice-select ${errors.selectedType ? 'bdr-red' : '#E5E5EA'}`} tabIndex="0">
                            <span className="current">{t('Gallery Category')}</span>
                            <ul className="list">
                                {galCatList?.map((item) => (
                                    <li
                                        key={item.id}
                                        className={selectedType === item.id ? 'option selected' : 'option'}
                                        onClick={() => setSelectedType(item.id)}
                                    >
                                        {item.cat_title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <span className='span-text text-danger mx-4 '>{errors?.selectedType}</span>
                    </div>
                </div>

                <div className="cols">
                    <div className='col-12'>
                        <div className={`m-bottom nice-select ${errors.selectedPropertyStatus ? 'bdr-red' : '#E5E5EA'}`} tabIndex="0">
                            <span className="current">{selectedPropertyStatus === 0 ? 'Publish' : 'UnPublish'}</span>
                            <ul className="list">
                                <li
                                    className={selectedPropertyStatus === '0' ? 'option selected' : 'option'}
                                    onClick={() => setSelectedPropertyStatus('0')}
                                >
                                    {t('Publish')}
                                </li>
                                <li
                                    className={selectedPropertyStatus === '1' ? 'option selected' : 'option'}
                                    onClick={() => setSelectedPropertyStatus('1')}
                                >
                                    {t('UnPublish')}
                                </li>
                            </ul>
                        </div>
                        <span className='span-text text-danger mx-4'>{errors.selectedPropertyStatus}</span>
                    </div>
                </div>

                <div className="button-submit mt-10">
                    <button className="tf-button-primary" type="submit">{t('Save')} & {t('Preview')} <i className="icon-arrow-right-add"></i></button>
                </div>
            </form>
        </>
    );
};

export default AddGalleryImage;

/* jshint ignore:end */
