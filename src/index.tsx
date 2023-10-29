import React from 'react';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import './api/i18n';
import store from './store/store';
import {BrowserRouter} from 'react-router-dom';
import {createRoot} from 'react-dom/client';

const root = createRoot(document.getElementById('root') as Element);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();
