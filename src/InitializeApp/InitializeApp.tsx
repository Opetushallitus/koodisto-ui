import React from 'react';

const virkailijaRaamitUrl = '/virkailija-raamit/apply-raamit.js';

const InitializeApp: React.FC<{}> = ({ children }) => {
    if (process.env.NODE_ENV === 'development' && !document.getElementById('virkailija-raamit-Script')) {
        const scriptElement = document.createElement('script');
        scriptElement.src = '/koodisto-ui/dev-raamit.js';
        scriptElement.id = 'virkailija-raamit-Script';
        document.body.appendChild(scriptElement);
    } else if (!document.getElementById('virkailija-raamit-Script')) {
        const scriptElement = document.createElement('script');
        scriptElement.src = virkailijaRaamitUrl;
        scriptElement.id = 'virkailija-raamit-Script';
        document.body.appendChild(scriptElement);
    }
    return <>{children}</>;
};
export default InitializeApp;
