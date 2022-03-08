import React from 'react';
import KoodistoTable from './components/pages/KoodistoTable/KoodistoTable';
import Loading from './components/pages/Loading/Loading';

const App = () => {
    return (
        <div>
            <h1>koodisto</h1>
            <React.Suspense fallback={<Loading />}>
                <KoodistoTable />
            </React.Suspense>
        </div>
    );
};

export default App;
