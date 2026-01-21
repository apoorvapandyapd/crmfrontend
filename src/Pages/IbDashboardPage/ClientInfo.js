import React from 'react';
import { Image } from 'react-bootstrap';

function ClientInfo(props) {
   
    const clientData = props.data.data.profile;

    return (
        <>
            <div className="table-responsive mt-32">
                <table className="table m-0">
                    <tbody>
                        <tr>
                            <td>Image</td>
                      <td><Image style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '30px' }} src={(clientData.profile_photo != null) ? clientData.profile_photo : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt="Profile Image" /></td>
                         </tr>
                        <tr>
                            <td>Name</td>
                            <td>{clientData.name}</td>
                         </tr>
                         <tr>
                            <td>Email</td>
                            <td>{clientData.email}</td>
                         </tr>
                         <tr>
                            <td>Phone</td>
                            <td>{clientData.phone_no}</td>
                         </tr>
                         <tr>
                            <td>Gender</td>
                            <td>{clientData.gender}</td>
                         </tr>
                         <tr>
                            <td>DOB</td>
                            <td>{clientData.dob}</td>
                         </tr>
                         <tr>
                            <td>Kyc Verify</td>
                            <td>{clientData.kyc_verify}</td>
                         </tr>
                         <tr>
                            <td>Address</td>
                            <td>{clientData.address1} {clientData.address2}</td>
                         </tr>
                         <tr>
                            <td>City</td>
                            <td>{clientData.city}</td>
                         </tr>
                         <tr>
                            <td>Country</td>
                            <td>{clientData.country}</td>
                         </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ClientInfo;