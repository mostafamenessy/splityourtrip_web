/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* jshint esversion: 11 */
/* jshint ignore:start */


import { useEffect, useState } from 'react';
import { useContextex } from '../context/useContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { showToast } from '../showTost';

const AddImages = () => {
  const { isUserId, userPropertyList, baseUrl, editSelectedImage, isEditSelectedProperty, setIsEditSelectedProperty } = useContextex();
  const { t } = useTranslation();

  const [formState, setFormState] = useState({
    selectedFile: null,
    selectedPropertyStatus: '',
    selectedPropertyTitle: '',
    selectedProperty: '',
    isPanorama: ''
  });

  const [errors, setErrors] = useState({
    selectedFile: null,
    selectedPropertyStatus: '',
    selectedPropertyTitle: '',
    selectedProperty: '',
    isPanorama: ''
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [defImg, setDefImg] = useState(null);

  const resetForm = () => {
    setFormState({
      selectedFile: null,
      selectedPropertyStatus: '',
      selectedPropertyTitle: '',
      selectedProperty: '',
      isPanorama: ''
    });
    setIsEditSelectedProperty(false);
    setDefImg(null);
  };

  useEffect(() => {
    if (editSelectedImage && isEditSelectedProperty) {
      const { image, status, property_title, property_id } = editSelectedImage;
      setFormState({
        // selectedFile: `${baseUrl}${image}`,
        selectedFile: '0',
        selectedPropertyStatus: status,
        selectedPropertyTitle: property_title,
        selectedProperty: property_id,
        isPanorama: ''
      });
      setDefImg(image);
    } else {
      setIsEditSelectedProperty(false);
      resetForm();
    }
  }, [editSelectedImage, isEditSelectedProperty]);

  const handleImageChange = (event) => {
    setDefImg(null);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prevState => ({
          ...prevState,
          selectedFile: reader.result.split(',')[1]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAddImgInputs = () => {
    const newErrors = { selectedFile: '', selectedProperty: '', isPanorama: '', selectedPropertyStatus: '' };
    let isValid = true;

    if (!formState.selectedFile) {
      newErrors.selectedFile = 'Please select valid image';
      isValid = false;
    }
    if (!formState.selectedProperty) {
      newErrors.selectedProperty = 'Please select valid property';
      isValid = false;
    }
    if (!formState.isPanorama) {
      newErrors.isPanorama = 'Please select is panorama or not ';
      isValid = false;
    }
    if (!formState.selectedPropertyStatus) {
      newErrors.selectedPropertyStatus = 'Please select valid property status';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddUpdateImage = async (event) => {
    event.preventDefault();
    if (!validateAddImgInputs()) return;
    const { selectedFile, selectedProperty, isPanorama, selectedPropertyStatus } = formState;

    const imageData = {
      uid: isUserId,
      prop_id: selectedProperty,
      img: selectedFile,
      is_panorama: isPanorama,
      status: selectedPropertyStatus,
      record_id: editSelectedImage?.id
    };

    const endpoint = isEditSelectedProperty ? 'u_extra_edit.php' : 'u_add_exra.php';

    try {
      const response = await axios.post(`${baseUrl}user_api/${endpoint}`, imageData, {
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

  const handlePropertySelection = (event) => {
    const { dataset, innerText } = event.target;
    setFormState(prevState => ({
      ...prevState,
      selectedProperty: dataset.value,
      selectedPropertyTitle: innerText
    }));
  };

  const handlePropertyStatusChange = (event) => {
    setFormState(prevState => ({
      ...prevState,
      selectedPropertyStatus: event.target.dataset.value
    }));
  };

  const handlePanoramaStatusChange = (event) => {
    setFormState(prevState => ({
      ...prevState,
      isPanorama: event.target.dataset.value
    }));
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const renderPropertyOptions = () => (
    userPropertyList?.map((item) => (
      <li
        key={item.id}
        className={`option ${formState.selectedProperty === item.id ? 'selected' : ''}`}
        onClick={handlePropertySelection}
        data-value={item.id}
      >
        {item.title}
      </li>
    ))
  );

  const renderStatusOptions = () => (
    ['0', '1']?.map(value => (
      <li
        key={value}
        className={`option ${formState.selectedPropertyStatus === value ? 'selected' : ''}`}
        onClick={handlePropertyStatusChange}
        data-value={value}
      >
        {value === '0' ? 'Publish' : 'Unpublish'}
      </li>
    ))
  );

  const renderPanoramaOptions = () => (
    ['0', '1']?.map(value => (
      <li
        key={value}
        className={`option ${formState.isPanorama === value ? 'selected' : ''}`}
        onClick={handlePanoramaStatusChange}
        data-value={value}
      >
        {value === '0' ? 'No' : 'Yes'}
      </li>
    ))
  );

  return (
    <>
      <form className="form-basic-information flex flex-column" onSubmit={handleAddUpdateImage}>
        <div className='cols'>
          <div className='col-12'>
            <div className={`m-bottom nice-select ${errors.selectedProperty ? 'border border-danger' : ''}`} tabIndex="0">
              <span className="current">{formState.selectedPropertyTitle || 'Property Type'}</span>
              <ul className="list">
                {renderPropertyOptions()}
              </ul>

            </div>
            <span className='span-text text-danger mx-4'>{errors?.selectedProperty}</span>
          </div>
        </div>

        <div className='cols'>
          <div className="input col-12 input--secondary">
            <div className="right">
              <label className="uploadfile w-100" style={{ float: 'left' }}>
                <div className={`m-bottom tf-button-primary w-100 style-bg-white ${errors.selectedFile ? 'bdr-red' : '#E5E5EA'}`}>
                  {formState.selectedFile || defImg ? (
                    <img
                      src={defImg ? `${baseUrl}${defImg}` : `data:image/jpeg;base64,${formState.selectedFile}`}
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
            <span className='span-text text-danger mx-4'>{errors?.selectedFile}</span>
          </div>
        </div>

        <div className='cols'>
          <div className='col-12'>
            <div className={`m-bottom nice-select ${errors.isPanorama ? 'border border-danger' : ''}`} tabIndex="0">
              <span className="current">360 {t('Images')}</span>
              <ul className="list">
                {renderPanoramaOptions()}
              </ul>
            </div>
            <span className='span-text text-danger mx-4'>{errors?.isPanorama}</span>
          </div>
        </div>

        <div className='cols'>
          <div className='col-12'>
            <div className={`m-bottom nice-select ${errors.selectedPropertyStatus ? 'border border-danger' : ''}`} tabIndex="0">
              <span className="current">{formState.selectedPropertyStatus === '0' ? 'Publish' : 'Unpublish'}</span>
              <ul className="list">
                {renderStatusOptions()}
              </ul>
            </div>
            <span className='span-text text-danger mx-4'>{errors?.selectedPropertyStatus}</span>
          </div>
        </div>

        <div className="button-submit mt-10">
          <button
            type="submit"
            className="tf-button-primary"
          >
            {t('Save')} & {t('Preview')} <i className="icon-arrow-right-add"></i>
          </button>
        </div>
      </form>
    </>
  );
}

export default AddImages;
/* jshint ignore:end */
