import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import App from './App';
import InitializeApp from './InitializeApp/InitializeApp';
import { ROOT_OID } from './context/constants';

const cookies = new Cookies();
axios.interceptors.request.use((config) => {
    if (config?.headers) {
        config.headers['Caller-Id'] = `${ROOT_OID}.koodisto-app`;
        config.headers['CSRF'] = cookies.get('CSRF');
    }
    return config;
});

ReactDOM.render(
    <React.StrictMode>
        <InitializeApp>
            <App />
        </InitializeApp>
    </React.StrictMode>,
    document.getElementById('root')
);
