import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import InitializeApp from './InitializeApp/InitializeApp';

ReactDOM.render(
    <React.StrictMode>
        <InitializeApp>
            <App />
        </InitializeApp>
    </React.StrictMode>,
    document.getElementById('root')
);
