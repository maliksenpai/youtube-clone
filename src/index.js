import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase';
import { App } from './App';
import { configureStore } from '@reduxjs/toolkit';
import { userSlicer } from './redux/UserRedux';
import { Provider } from 'react-redux';
import { ComfortReactProvider } from 'comfort-react';
import { settingsSlice } from './redux/SettingsRedux';
import { logger } from 'redux-logger/src';

const firebaseConfig = {
    apiKey: 'AIzaSyB9rGf0Y_RDfVVFL9VrFPXL7p0HsXbfpn0',
    authDomain: 'fir-22685.firebaseapp.com',
    projectId: 'fir-22685',
    storageBucket: 'fir-22685.appspot.com',
    messagingSenderId: '1081827213163',
    appId: '1:1081827213163:web:ff80774386d13089fbd62e',
};

export const app = firebase.initializeApp(firebaseConfig);
const store = configureStore({
    reducer: {
        userReducer: userSlicer.reducer,
        settingsReducer: settingsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ComfortReactProvider lang={'en'}>
                <App />
            </ComfortReactProvider>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
