/* jshint esversion: 6 */
/* jshint ignore:start */

import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context/AppContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

// Note: the guard for uncatchable third-party SDK { head, body } rejections is
// registered as an inline script in public/index.html <head> - it must run
// before the webpack-dev-server client to be able to suppress the dev overlay.

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AppProvider>
  </React.StrictMode>
);

// Measure performance (optional)
reportWebVitals();
/* jshint ignore:end */
