import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function SimpleAlert({ alerts }) {
    const [currentAlert, setCurrentAlert] = useState(null);

    useEffect(() => {
        if (alerts.length > 0) {
            // Show the first alert in the queue
            setCurrentAlert(alerts[0]);

            // Hide the alert after 2 seconds
            const timer = setTimeout(() => {
                setCurrentAlert(null);
            }, 2000);

            return () => clearTimeout(timer); // Cleanup timer on component unmount or alert change
        }
    }, [alerts]); // Re-run effect when alerts change

    if (!currentAlert) return null;

    return (
        <div className="alert-container">
            <Alert severity={currentAlert.severity}>
                <AlertTitle>{currentAlert.severity === 'error' ? 'Error' : 'Success'}</AlertTitle>
                {currentAlert.message}
            </Alert>
        </div>
    );
}

export default SimpleAlert;
