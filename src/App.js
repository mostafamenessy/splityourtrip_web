/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */


import './App.css';

import './css/animate.min.css';
import './css/animation.css';
import './css/bootstrap-select.min.css';
import './css/bootstrap.css';
import './css/jquery.fancybox.min.css';
import './css/magnific-popup.min.css';
import './css/mmenu.css';
import './css/nice-select.css';
import './css/style.css';
import './css/swiper-bundle.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Header from './component/Header';
import Main from './component/Main';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProductDetails } from './component/ProductDetails';
import { Dashboard } from './component/Dashboard';
import AddProparty from './component/AddProparty';
import Receipt from './component/Receipt';
import { CartProduct } from './component/CartProduct';
import AllProduct from './component/AllProduct';
import { AuthProvider } from './context/AuthContext';
import { useAuth, useContextex } from './context/useContext';
import PackagePurchase from './component/PackagePurchase';
import PrivacyPolicy from './component/PrivacyPolicy';
import TermsAndCondi from './component/TermsAndCondi';
import ContactUs from './component/ContactUs';
import { Faqlist } from './component/Faqlist';
import { PaymentProvider } from './context/PaymentContext';
import SuccessHandler, { CancelHandler } from './component/PayfastPaymentHandle';
import { useEffect } from 'react';
// import { PaymentReturn } from './payment/PayfastPayment';
import { messaging, RecvestToken } from './firebase';
import { onMessage } from 'firebase/messaging';
import { PaymentResponse } from './component/PaymentResponse';
import { ToastContainer } from 'react-toastify';

const PrivateRoute = ({ element }) => {
  const { isAuth } = useAuth();
  const { isUserId } = useContextex();
  return isAuth || isUserId ? element : <Navigate to="/" />;
};

function App() {

  const { isAdmin } = useContextex();

  useEffect(() => {
    RecvestToken();
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Notification Receivering :-->>", payload);
      });
    }
  }, []);

  useEffect(() => {
    const UserData = localStorage.getItem("loginUser");

    if (UserData && window.location.hostname === 'propertyweb.cscodetech.cloud') {
      const UserId = JSON.parse(UserData);
      import('react-onesignal').then(({ default: OneSignal }) => {
        OneSignal.init({
          appId: "53fc4f06-3aca-4a4a-a175-8638a1c52e4e",
          notifyButton: {
            enable: true,
          },
        })
          .then(() => {
            return OneSignal.User.addTags({
              "user_id": UserId?.UserLogin?.id,
            }).then(function (tagsSent) {
              console.log('Tags sent:', tagsSent);
            });
          })
          .catch((error) => {
            console.error("Error initializing OneSignal:", error);
          });
      });
    }
  }, []);

  return (
    <>
      <AuthProvider>
        <PaymentProvider>
          <Router>
            <div className="body counter-scroll">
              <div id="wrapper">
                <div id="page">
                  <Header />
                  <Routes>
                    {/* Public Routes */}
                    {isAdmin ? (
                      <>
                        <Route path="/" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/:title" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/:title/add" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/:title/complated-booking" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/:title/current-booking" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="receipt" element={<PrivateRoute element={<Receipt />} />} />
                      </>
                    ) : (
                      <>
                        <Route path="/" element={<Main />} />
                        <Route path="/properties/:pid" element={<ProductDetails />} />
                        <Route path="/product-all" element={<AllProduct />} />
                        <Route path="/privacy_policy" element={<PrivacyPolicy />} />
                        <Route path="/terms_and_condition" element={<TermsAndCondi />} />
                        <Route path="/contact_us" element={<ContactUs />} />
                        <Route path="/faq_list" element={<Faqlist />} />
                        {/* Private Routes */}

                        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                        <Route path="/dashboard/:name" element={<PrivateRoute element={<Dashboard />} />} />
                        <Route path="/product-cart" element={<PrivateRoute element={<CartProduct />} />} />
                        <Route path="/package_purchase" element={<PrivateRoute element={<PackagePurchase />} />} />

                        {/* {payment route} */}
                        <Route path="/payment_success" element={<PrivateRoute element={<SuccessHandler />} />} />
                        <Route path="/package_cancel" element={<PrivateRoute element={<CancelHandler />} />} />
                        {/* <Route path="/paymentRespons" element={<PrivateRoute element={<PaytmPayment />} />} /> */}

                        <Route path="/addProparty" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/addProparty/:title" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/addProparty/:title/add" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/addProparty/:title/complated-booking" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/addProparty/:title/current-booking" element={<PrivateRoute element={<AddProparty />} />} />
                        <Route path="/receipt" element={<PrivateRoute element={<Receipt />} />} />
                        <Route path="/PaymentRespons" element={<PrivateRoute element={<PaymentResponse />} />} />

                      </>
                    )}
                    {/* Page Not Found */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                  {/* <Footer /> */}
                </div>
              </div>

              <div className="progress-wrap active-progress">
                <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                  <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style={{ transition: 'stroke-dashoffset 10ms linear 0s', strokeDasharray: '307.919, 307.919; stroke-dashoffset: 286.138' }}></path>
                </svg>
              </div>
            </div>
          </Router>
        </PaymentProvider>
      </AuthProvider>

      <ToastContainer
      className="text-[16px] font-bold"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </>
  );
}

export default App;
/* jshint ignore:end */
