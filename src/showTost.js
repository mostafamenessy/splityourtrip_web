/* jshint esversion: 6 */
import { toast } from 'react-toastify';

let isShow = false;

export const showToast = ({ title, id }) => {

  if (isShow) {
    return;
  }  

  const toastTypes = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
  };

  const tost = toastTypes[id] || toast.info;
  isShow = true;

  tost(`${title}`, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    onClose: () => {
      isShow = false;
    }
  });

  return null;
};
