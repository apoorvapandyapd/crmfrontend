import React, { useEffect, useState } from 'react';

function AlertMessage({ type, message }) {

    const [alert, setAlert] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
        setAlert(false);
        },15000);
        
        return () => clearTimeout(timer);
    }, []);     

    return (
        <div>
            {alert && <div className={`alert alert-${type}`}>{message}</div>}
        </div>
    );
}

export default AlertMessage;