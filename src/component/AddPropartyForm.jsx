/* jshint esversion: 6 */
/* jshint ignore:start */

import React, { useEffect, useState } from 'react';
import { IconLocation, IconX } from '@tabler/icons-react';
import { useContextex } from '../context/useContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { showToast } from '../showTost';

const SelectField = ({ label, options, selectedValue, onSelect, error }) => (
    <div className={` nice-select ${error ? 'm-bottom border border-danger' : ''}`} tabIndex="0">
        <span className="current">
            {selectedValue ? options?.find(option => option.value === selectedValue)?.label : label}
        </span>
        <ul className="list">
            {options?.map(option => (
                <li
                    key={option.value}
                    data-value={option.value}
                    className={selectedValue === option.value ? 'option selected' : 'option'}
                    onClick={onSelect}
                >
                    {option.label}
                </li>
            ))}
        </ul>
    </div>
);

const TextField = ({ label, name, value, onChange, disabled, error }) => (
    <fieldset className="text">
        <input style={{ border: "1px solid black" }}
            className={`m-bottom ${error ? 'border border-danger' : ''}`}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={label}
            disabled={disabled}
            required
        />
        <span className='span-text text-danger mx-4 '>{error}</span>
    </fieldset>
);

const TextAreaField = ({ label, name, value, onChange, error }) => (
    <fieldset className="description has-top-title mt-[10px]">
        <textarea style={{ border: "1px solid black" }}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={label}
            className={`m-bottom ${error ? 'border border-danger' : ''}`}
            required
        ></textarea>
        <label>{label}</label>
        <span className='span-text text-danger mx-4 '>{error}</span>
    </fieldset>
);

const FileUpload = ({ selectedFile, onFileChange, defImg, baseUrl, error }) => (
    <div className="col-sm-6">
        <div className="right">
            <label className="uploadfile w-100" style={{ float: 'left' }}>
                <div className={`m-bottom tf-button-primary w-100 style-bg-white ${error ? 'bdr-red' : '#E5E5EA'}`}>
                    {selectedFile || defImg ? (
                        <img
                            src={defImg ? `${baseUrl}${defImg}` : `data:image/jpeg;base64,${selectedFile}`}
                            className='m-0'
                            alt="Selected"
                            style={{ width: '30px', height: '30px' }}
                        />
                    ) : null}

                    <input type="file" accept='image/*' onChange={onFileChange} name="file" />
                </div>
            </label>
        </div>
        <span className='span-text text-danger mx-4'>{error}</span>
    </div>
);

const GalleryUpload = ({ existingImages, newFiles, baseUrl, onAddFiles, onRemoveNewFile, onDeleteExisting }) => (
    <div className="w-100">
        <div className="grid-checkbox" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            {existingImages?.map((item) => (
                <div key={item.id} style={{ position: 'relative', width: '90px', height: '90px' }}>
                    <img
                        src={`${baseUrl}${item.image}`}
                        alt="Property"
                        style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <button
                        type="button"
                        onClick={() => onDeleteExisting(item)}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc3545', borderRadius: '50%', width: '22px', height: '22px', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <IconX size={14} />
                    </button>
                </div>
            ))}

            {newFiles?.map((file, index) => (
                <div key={index} style={{ position: 'relative', width: '90px', height: '90px' }}>
                    <img
                        src={`data:image/jpeg;base64,${file}`}
                        alt="New upload"
                        style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <button
                        type="button"
                        onClick={() => onRemoveNewFile(index)}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc3545', borderRadius: '50%', width: '22px', height: '22px', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <IconX size={14} />
                    </button>
                </div>
            ))}

            <label
                className="uploadfile"
                style={{ width: '90px', height: '90px', border: '1px dashed #80808080', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
                <span style={{ fontSize: '28px', color: '#808080' }}>+</span>
                <input type="file" accept="image/*" multiple onChange={onAddFiles} style={{ display: 'none' }} />
            </label>
        </div>
    </div>
);

const AddPropartyForm = () => {
    const { t } = useTranslation();
    const {
        propertyType,
        countryData,
        baseUrl,
        isUserId,
        isEditSelectedProperty,
        editSelectedProperty,
        setCountryData,
        setCountryListData
    } = useContextex();

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('');
    const [selectedPropertyStatus, setSelectedPropertyStatus] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [propertyDetails, setPropertyDetails] = useState({
        prop_title: '',
        prop_address: '',
        mobile_number: '',
        prop_price: '',
        prop_description: '',
        prop_no_of_beds: '',
        prop_no_of_bath: '',
        prop_sqrt: '',
        prop_rating: '',
        prop_capacity: '',
        prop_city: '',
    });
    const [position, setPosition] = useState({
        latitude: null,
        longitude: null,
    });

    const [propertyFacilityData, setPropertyFacilityData] = useState([]);
    const [checkedFacilities, setCheckedFacilities] = useState([]);
    const [, setMappedFacilities] = useState([]);
    const [defImg, setDefImg] = useState(null)
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const [importUrl, setImportUrl] = useState('');
    const [importing, setImporting] = useState(false);
    const [errors, setErrors] = useState({
        prop_title: '',
        prop_address: '',
        mobile_number: '',
        prop_price: '',
        prop_description: '',
        prop_no_of_beds: '',
        prop_no_of_bath: '',
        prop_sqrt: '',
        prop_rating: '',
        prop_capacity: '',
        prop_city: '',
        selectedPropertyType: '',
        selectedCountry: '',
        selectedPropertyStatus: '',
        selectedFile: '',
        checkedFacilities: '',
        position: ''
    })

    useEffect(() => {
        if (isEditSelectedProperty && editSelectedProperty) {
            const { longtitude, latitude, city, plimit, rate, sqrft, bathroom, beds, description, price, mobile, address, title, image, status, property_type_id, country_id } = editSelectedProperty
            setSelectedCountry(country_id);
            setSelectedPropertyType(property_type_id);
            setSelectedPropertyStatus(status);
            setSelectedFile('0');

            setPropertyDetails({
                prop_title: title,
                prop_address: address,
                mobile_number: mobile,
                prop_price: price,
                prop_description: description,
                prop_no_of_beds: beds,
                prop_no_of_bath: bathroom,
                prop_sqrt: sqrft,
                prop_rating: rate,
                prop_capacity: plimit,
                prop_city: city,
            });
            setDefImg(image)

            setPosition({
                latitude,
                longitude: longtitude,
            });
        } else {
            resetForm();
        }
    }, [isEditSelectedProperty, editSelectedProperty])

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_facility.php?`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response?.data?.ResponseCode === '200') {
                    setPropertyFacilityData(response?.data?.facilitylist);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, []);

    useEffect(() => {
        if (isEditSelectedProperty) {
            const facilityNames = editSelectedProperty.facility_select.split(',')?.map(name => name.trim());
            const facilityMap = propertyFacilityData.reduce((map, fac) => {
                map[fac.title] = fac.id;
                return map;
            }, {});

            const mappedIds = facilityNames?.map(name => facilityMap[name]);

            setMappedFacilities(mappedIds);
            setCheckedFacilities(mappedIds);
        }
    }, [isEditSelectedProperty, editSelectedProperty, propertyFacilityData]);

    useEffect(() => {
        const fetchExistingGallery = async () => {
            if (!isEditSelectedProperty || !editSelectedProperty?.id) {
                setExistingGalleryImages([]);
                return;
            }
            try {
                const response = await axios.post(`${baseUrl}user_api/gallery_list.php?`, {
                    uid: isUserId,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                const allImages = response?.data?.gallerylist || [];
                setExistingGalleryImages(allImages.filter(item => String(item.property_id) === String(editSelectedProperty.id)));
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchExistingGallery();
    }, [isEditSelectedProperty, editSelectedProperty, isUserId, baseUrl]);

    useEffect(() => {
        const fetchCountryDataAsync = async () => {
            try {
                const response = await axios.post(`${baseUrl}user_api/u_country.php?`, {
                    uid: isUserId || '0',
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setCountryData(response?.data?.CountryData)
                setCountryListData(response?.data?.CountryData)
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchCountryDataAsync();
    }, [isUserId]);

    const resetForm = () => {
        setSelectedCountry('');
        setSelectedPropertyType('');
        setSelectedPropertyStatus('');
        setSelectedFile(null);
        setPropertyDetails({
            prop_title: '',
            prop_address: '',
            mobile_number: '',
            prop_price: '',
            prop_description: '',
            prop_no_of_beds: '',
            prop_no_of_bath: '',
            prop_sqrt: '',
            prop_rating: '',
            prop_capacity: '',
            prop_city: '',
        });
        setPosition({
            latitude: null,
            longitude: null,
        });
        setDefImg(null)
        setMappedFacilities([]);
        setCheckedFacilities([])
        setGalleryFiles([]);
    };

    const validatePropInputs = () => {
        const newErrors = { selectedPropertyType: '', selectedPropertyStatus: '', selectedCountry: '', selectedFile: '', checkedFacilities: '' };
        const requiredFields = [
            { field: 'prop_title', message: 'Please enter a property title' },
            { field: 'prop_address', message: 'Please enter a property Address' },
            { field: 'mobile_number', message: 'Please enter a mobile number' },
            { field: 'prop_price', message: 'Please enter a property price' },
            { field: 'prop_description', message: 'Please enter a property description' },
            { field: 'prop_no_of_beds', message: 'Please enter the number of property beds' },
            { field: 'prop_no_of_bath', message: 'Please enter the number of property baths' },
            { field: 'prop_sqrt', message: 'Please enter the property size in square feet' },
            { field: 'prop_rating', message: 'Please enter a property rating' },
            { field: 'prop_capacity', message: 'Please enter a property capacity' },
            { field: 'prop_city', message: 'Please enter a property city' },
        ];

        let isValid = true;

        requiredFields.forEach(({ field, message }) => {
            if (!propertyDetails?.[field]) {
                newErrors[field] = message;
                isValid = false;
            }
        });

        if (!selectedPropertyType) {
            newErrors.selectedPropertyType = "Please select a valid property type"
            isValid = false
        }
        if (!selectedPropertyStatus) {
            newErrors.selectedPropertyStatus = "Please select a valid property status"
            isValid = false
        }
        if (!selectedCountry) {
            newErrors.selectedCountry = "Please select a valid country"
            isValid = false
        }
        if (!selectedFile) {
            newErrors.selectedFile = "Please select a valid file"
            isValid = false
        }
        if (!checkedFacilities || checkedFacilities.length === 0) {
            newErrors.checkedFacilities = "Please checked a valid facility"
            isValid = false
        }
        if (!position.latitude || !position.longitude) {
            newErrors.position = "Please enter a current position"
            isValid = false
        }

        setErrors(newErrors);
        return isValid;
    };

    const resolveGalleryCategoryId = async (propId) => {
        try {
            const catRes = await axios.post(`${baseUrl}user_api/property_wise_galcat.php?`, {
                uid: isUserId,
                prop_id: propId,
            }, { headers: { 'Content-Type': 'application/json' } });

            const existingCat = catRes?.data?.galcatlist?.[0];
            if (existingCat?.id) return existingCat.id;

            const createRes = await axios.post(`${baseUrl}user_api/u_gal_cat_add.php?`, {
                uid: isUserId,
                prop_id: propId,
                title: 'Photos',
                status: '1',
            }, { headers: { 'Content-Type': 'application/json' } });

            return createRes?.data?.cat_id;
        } catch (err) {
            console.error(err.message);
            return null;
        }
    };

    const uploadGalleryFiles = async (propId) => {
        if (!galleryFiles.length) return;

        const catId = await resolveGalleryCategoryId(propId);
        if (!catId) return;

        for (const file of galleryFiles) {
            try {
                await axios.post(`${baseUrl}user_api/add_gallery.php?`, {
                    uid: isUserId,
                    prop_id: propId,
                    cat_id: catId,
                    status: '1',
                    img: file,
                }, { headers: { 'Content-Type': 'application/json' } });
            } catch (err) {
                console.error(err.message);
            }
        }
    };

    const handleImportListing = async () => {
        if (!importUrl.trim()) {
            showToast({ title: 'Please paste an Airbnb or Booking.com listing URL', id: 'error' });
            return;
        }

        setImporting(true);
        try {
            const response = await axios.post(`${baseUrl}user_api/u_import_listing.php?`, {
                url: importUrl.trim(),
            }, { headers: { 'Content-Type': 'application/json' } });

            const data = response?.data;
            if (data?.ResponseCode === '200') {
                setPropertyDetails(prev => ({
                    ...prev,
                    prop_title: data.title || prev.prop_title,
                    prop_description: data.description || prev.prop_description,
                    prop_address: data.address || prev.prop_address,
                    prop_city: data.city || prev.prop_city,
                    prop_rating: data.rating != null ? String(data.rating) : prev.prop_rating,
                }));

                // Default new imports to Egypt - the vast majority of
                // listings on this platform are Egyptian, and neither
                // Airbnb nor Booking.com's scrapable data reliably maps to
                // our internal country_id list.
                setSelectedCountry('1');

                const images = data.images || [];
                if (images.length > 0) {
                    setSelectedFile(images[0]);
                    setGalleryFiles(images.slice(1));
                }

                showToast({ title: t('Imported - please review and complete price, beds/baths and facilities below'), id: 'success' });
            } else {
                showToast({ title: data?.ResponseMsg || 'Could not import that listing', id: 'error' });
            }
        } catch (err) {
            console.error(err.message);
            showToast({ title: 'Import failed, please try again or enter details manually', id: 'error' });
        } finally {
            setImporting(false);
        }
    };

    const handleAddGalleryFiles = (event) => {
        const files = Array.from(event.target.files || []);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryFiles(prev => [...prev, reader.result.split(',')[1]]);
            };
            reader.readAsDataURL(file);
        });
        event.target.value = '';
    };

    const handleRemoveNewGalleryFile = (index) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteExistingGalleryImage = async (item) => {
        try {
            await axios.post(`${baseUrl}user_api/update_gallery.php?`, {
                uid: isUserId,
                prop_id: item.property_id,
                cat_id: item.category_id,
                record_id: item.id,
                status: '0',
                img: '0',
            }, { headers: { 'Content-Type': 'application/json' } });

            setExistingGalleryImages(prev => prev.filter(img => img.id !== item.id));
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleAddProperty = async (event) => {
        event.preventDefault();
        const endpoint = isEditSelectedProperty ? 'u_property_edit.php' : 'u_property_add.php';
        if (!validatePropInputs()) return;

        const apiData = {
            uid: isUserId,
            status: selectedPropertyStatus,
            plimit: propertyDetails.prop_capacity,
            country_id: selectedCountry,
            pbuysell: '1',
            title: propertyDetails.prop_title,
            address: propertyDetails.prop_address,
            description: propertyDetails.prop_description,
            ccount: propertyDetails.prop_city,
            facility: checkedFacilities.toString(),
            ptype: selectedPropertyType,
            beds: propertyDetails.prop_no_of_beds,
            bathroom: propertyDetails.prop_no_of_bath,
            sqft: propertyDetails.prop_sqrt,
            rate: propertyDetails.prop_rating,
            latitude: position.latitude,
            longitude: position.longitude,
            mobile: propertyDetails.mobile_number,
            price: propertyDetails.prop_price,
            img: selectedFile,
            prop_id: isEditSelectedProperty ? editSelectedProperty?.id : undefined
        };

        try {
            const response = await axios.post(`${baseUrl}user_api/${endpoint}`, apiData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response?.data?.ResponseCode === '200') {
                const propId = isEditSelectedProperty ? editSelectedProperty?.id : response?.data?.prop_id;
                if (propId) {
                    await uploadGalleryFiles(propId);
                }
                showToast({ title: response?.data?.ResponseMsg, id: "success" });
                resetForm();
            } else {
                showToast({ title: response?.data?.ResponseMsg, id: "error" });
            }

        } catch (err) {
            console.error(err.message);
        }

    };

    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelect = (setter) => (event) => {
        setter(event.target.getAttribute('data-value'));
    };

    const handleCheckBox = (id) => {
        setCheckedFacilities(prev => {
            const isChecked = prev.includes(id);
            return isChecked ? prev.filter(item => item !== id) : [...prev, id];
        });
    };

    return (
        <>

            {!isEditSelectedProperty && (
                <div className="wg-box pl-44 pr-29 mb-20">
                    <h4 style={{ marginBottom: '10px' }}>{t('Import from Airbnb or Booking.com')}</h4>
                    <p className='text-content' style={{ marginBottom: '10px' }}>
                        {t('Paste a listing URL to pull in its title, description and photos automatically. This is best-effort - please review everything and fill in price, location, beds/baths and facilities yourself.')}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '10px' }}>
                        <input
                            type="text"
                            style={{ border: '1px solid black', width: '100%', minWidth: 0, boxSizing: 'border-box' }}
                            placeholder={t('https://www.airbnb.com/rooms/... or https://www.booking.com/hotel/...')}
                            value={importUrl}
                            onChange={(e) => setImportUrl(e.target.value)}
                        />
                        <button
                            type="button"
                            className="tf-button-primary"
                            disabled={importing}
                            onClick={handleImportListing}
                        >
                            {importing ? t('Importing...') : t('Import')}
                        </button>
                    </div>
                </div>
            )}

            <div className="wg-box pl-44 mb-20">
                <form className="form-basic-information flex gap-3 flex-column">
                    <div className='cols'>
                        <div className='w-100'>
                            <SelectField
                                label="Country"
                                options={countryData?.map(item => ({ value: item?.id, label: item?.title }))}
                                selectedValue={selectedCountry}
                                onSelect={handleSelect(setSelectedCountry)}
                                error={errors.selectedCountry}
                            />
                            <span className='span-text text-danger mx-4'>{errors?.selectedCountry}</span>
                        </div>
                    </div>

                    <TextField
                        label="Property Title"
                        name="prop_title"
                        value={propertyDetails.prop_title}
                        onChange={handleChange}
                        error={errors.prop_title}
                    />

                    <TextAreaField
                        label="Property Description"
                        name="prop_description"
                        value={propertyDetails.prop_description}
                        onChange={handleChange}
                        error={errors.prop_description}
                    />

                </form>
            </div>

            <div className="wg-box pl-44 mb-20">
                <h4 style={{ marginBottom: "10px" }}>{t('Additional')}</h4>
                <form className="form-additional flex gap-3 flex-column">
                    <div className='w-100'>
                        <SelectField
                            label="Property Type"
                            options={propertyType?.map(item => ({ value: item?.id, label: item?.title }))}
                            selectedValue={selectedPropertyType}
                            onSelect={handleSelect(setSelectedPropertyType)}
                            error={errors.selectedPropertyType}
                        />
                        <span className='span-text text-danger mx-4'>{errors?.selectedPropertyType}</span>
                    </div>
                    <div className="cols cols-two">
                        <TextField
                            label="Address"
                            name="prop_address"
                            value={propertyDetails.prop_address}
                            onChange={handleChange}
                            error={errors.prop_address}
                        />
                        <TextField
                            label="Mobile Number (With Country Code)"
                            name="mobile_number"
                            value={propertyDetails.mobile_number}
                            onChange={handleChange}
                            error={errors.mobile_number}
                        />
                        <TextField
                            label="Property Price"
                            name="prop_price"
                            value={propertyDetails.prop_price}
                            onChange={handleChange}
                            error={errors.prop_price}
                        />
                    </div>
                    <div className="cols cols-two">
                        <TextField
                            label="Total Beds"
                            name="prop_no_of_beds"
                            value={propertyDetails.prop_no_of_beds}
                            onChange={handleChange}
                            error={errors.prop_no_of_beds}
                        />
                        <TextField
                            label="Total Bathrooms"
                            name="prop_no_of_bath"
                            value={propertyDetails.prop_no_of_bath}
                            onChange={handleChange}
                            error={errors.prop_no_of_bath}
                        />
                        <TextField
                            label="Property Sqft"
                            name="prop_sqrt"
                            value={propertyDetails.prop_sqrt}
                            onChange={handleChange}
                            error={errors.prop_sqrt}
                        />
                        <TextField
                            label="Property Rating"
                            name="prop_rating"
                            value={propertyDetails.prop_rating}
                            onChange={handleChange}
                            error={errors.prop_rating}
                        />
                    </div>
                    <div className="cols cols-two">
                        <TextField
                            label="Capacity"
                            name="prop_capacity"
                            value={propertyDetails.prop_capacity}
                            onChange={handleChange}
                            error={errors.prop_capacity}
                        />
                        <TextField
                            label="City, Country"
                            name="prop_city"
                            value={propertyDetails.prop_city}
                            onChange={handleChange}
                            error={errors.prop_city}
                        />
                    </div>
                </form>
            </div>

            <div className="wg-box pl-44 mb-20">
                <h4 style={{ marginBottom: "10px" }}>{t('Select Property Facility')}</h4>
                <form className="form-amenities">
                    <ul className="grid-checkbox">
                        {propertyFacilityData?.map(item => (
                            <li className="checkbox-item" key={item?.id}>
                                <label>
                                    <p>{item?.title}</p>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckBox(item?.id)}
                                        checked={checkedFacilities.includes(item?.id)}
                                    />
                                    <span className="btn-checkbox"></span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </form>
                <span className='span-text text-danger mx-4'>{errors?.checkedFacilities}</span>
            </div>

            <div className="wg-box pl-44 mb-20">
                <h4 style={{ marginBottom: "10px" }}>{t('Photos')}</h4>
                <p className='text-content' style={{ marginBottom: '10px' }}>{t('Add more photos of this property for the gallery shown on your listing page.')}</p>
                <GalleryUpload
                    existingImages={existingGalleryImages}
                    newFiles={galleryFiles}
                    baseUrl={baseUrl}
                    onAddFiles={handleAddGalleryFiles}
                    onRemoveNewFile={handleRemoveNewGalleryFile}
                    onDeleteExisting={handleDeleteExistingGalleryImage}
                />
            </div>

            <div className="wg-box pl-44 mb-20">
                <h4 style={{ marginBottom: "10px" }}>{t('Status')}</h4>
                <form className="form-price flex gap-3 flex-column">
                    <div className="cols">

                        <div className='w-100'>
                            <TextField
                                label="Latitude"
                                error={errors.position}
                                value={position.latitude || ''}
                                disabled
                            />
                        </div>

                        <div className='w-100'>
                            <TextField
                                error={errors.position}
                                label="Longitude"
                                value={position.longitude || ''}
                                disabled
                            />
                        </div>
                    </div>

                    <div className='d-flex p-0 m-0 pointer' onClick={handleGetLocation}>
                        <IconLocation className='float-start p-1 bg-primary m-2 rounded-circle text-white' />
                        <h6 className='p-2'>{t('Click for Current Location')}</h6>
                    </div>

                    <div className="cols">
                        <FileUpload
                            defImg={defImg}
                            baseUrl={baseUrl}
                            selectedFile={selectedFile}
                            onFileChange={handleImageChange}
                            error={errors?.selectedFile}
                        />

                        <div className='w-100'>
                            <SelectField
                                label="Property Status"
                                options={[
                                    { value: '0', label: 'Publish' },
                                    { value: '1', label: 'UnPublish' }
                                ]}
                                selectedValue={selectedPropertyStatus}
                                onSelect={handleSelect(setSelectedPropertyStatus)}
                                error={errors.selectedPropertyStatus}
                            />
                            <span className='span-text text-danger mx-4'>{errors?.selectedPropertyStatus}</span>
                        </div>
                    </div>

                    <div className="button-submit mt-10">
                        <button className="tf-button-primary" onClick={handleAddProperty}>
                            {t('Add Property')} <i className="icon-arrow-right-add"></i>
                        </button>
                    </div>
                </form>
            </div>

        </>
    );
};

export default AddPropartyForm;
/* jshint ignore:end */
