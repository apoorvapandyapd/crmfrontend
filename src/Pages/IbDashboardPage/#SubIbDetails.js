import React from 'react';
import { Link } from 'react-router-dom';

function SubIbDetails(props) {

    const ibData = props.data.data.sub_ibs.data;

    return (
        <>
            <div className="client-info row align-items-center mt-32">
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4">
                    <div className="verification-box">
                        Active IB
                        <span>{props.data.data.sub_ibs.active_ib}</span>
                    </div>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4">
                    <div className="verification-box">
                        Verified IB
                        <span>{props.data.data.sub_ibs.verified_ib}</span>
                    </div>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-4">
                    <div className="verification-box">
                        Unverified IB
                        <span>{props.data.data.sub_ibs.unverified_ib}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4">
           
                    <div className="table-responsive">
                         <table className="table m-0">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Affiliate Status</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {   
                                    ibData.map((client,i) =>
                                    <tr>
                                        <td>{i+1}</td>
                                        <td><Link to={{ pathname:'/ib/profile', state:{ib_id:client.id} }} className="edit-icon">{client.name}</Link></td>
                                        <td>{client.email}</td>
                                        <td>{client.phone}</td>
                                        <td>{client.status}</td>
                                        <td>{client.affiliate_status}</td>
                                        <td>{client.created}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table> 
            </div>
        </div>
        </>
    );
}

export default SubIbDetails;