import React from 'react';
import { Image } from 'react-bootstrap';

const Maintenance = () => {
  return (
    <div className='maintenance-wrapper'>
        <div className='content'>
            <div className='logo'><Image src={`${process.env.PUBLIC_URL}/Images/backend-logo.png`} alt="login" fluid /></div>
            <h1>Website Under Maintenance</h1>
            <p>We are currently performing maintenance.</p>
            <p>Please check back later.</p>
        </div>
    </div>
  );
};

export default Maintenance;