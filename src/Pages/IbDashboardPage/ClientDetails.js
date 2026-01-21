import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefatchIcon, CsvDownloadIcon } from '../../Components/icons';
import { CSVLink } from "react-csv";
let allIbClients = [];
function ClientDetails(props) {
    allIbClients = props.data.data.sub_clients.data;
    // let propClientData = props.data.data.sub_clients.data;
    const [clientData, setClientData] = useState(allIbClients)
    const clientLevel = props.data.data.level;
    // var content = Array.from({ length: clientLevel }, (_, i) => i + 1);
    const [filter, setFilter] = useState({
        'search': '',
    });

    // Refresh click handler
    const fetchDataHandler = () => {
        props.fetchData();
    }
    //Update the data after refresh call is done
    useEffect(() => {
        setClientData(allIbClients);
    }, [allIbClients]);

    //Call when anything changes in search textbox
    const clientChangeHandler = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    }

    //Call the filter function according to filter state
    useEffect(() => {
        filterRecords();
    }, [filter]);

    //Filter records
    const filterRecords = () => {
        let search = filter.search;
        let selclient = filter.selclient;
        let filteredAcc = [];

        if (search.trim() !== '' || selclient) {
            filteredAcc = allIbClients;
            if (search.trim() !== '') {
                filteredAcc = filteredAcc.filter((c) => {
                    const searchRegex = new RegExp(search, 'i');
                    let verifiedsearch = searchRegex.test(c.verified);
                    let first_namesearch = searchRegex.test(c.name);
                    let emailsearch = searchRegex.test(c.email);
                    let phonesearch = searchRegex.test(c.phone);
                    let statussearch = searchRegex.test(c.status);

                    if (first_namesearch || statussearch || emailsearch || phonesearch || verifiedsearch) {
                        return c;
                    }
                });
            }
        } else {
            filteredAcc = allIbClients;
        }
        setClientData(filteredAcc);

    }
    let csvdata = Array.isArray(clientData) && clientData.map(data => {
        return {
            Name: data.name,
            Email: data.email,
            Phone: data.phone,
            Status: data.status,
            "Verified Status": data.verified,
            Date: data.created
        }
    })
    return (
        <>
            {/*<div className="client-info row align-items-center mt-32">*/}
            {/*    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">*/}
            {/*        <div className="verification-box">*/}
            {/*            Active Clients*/}
            {/*            <span>{props.data.data.sub_clients.active_client}</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">*/}
            {/*        <div className="verification-box">*/}
            {/*            Verified Clients*/}
            {/*            <span>{props.data.data.sub_clients.verified_client}</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">*/}
            {/*        <div className="verification-box">*/}
            {/*            Unverified Clients*/}
            {/*            <span>{props.data.data.sub_clients.unverified_client}</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">*/}
            {/*        <div className="verification-box">*/}
            {/*            Affiliate Clients*/}
            {/*            <span>{props.data.data.sub_clients.affiliate_client}</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="mt-32">
                <div className="row d-flex align-items-sm-center justify-content-end">
                    <div className="col-md-6 col-lg-4 col-xl-3 ms-auto d-flex align-items-center">
                        <input type="text" className="form-control" placeholder="Search" name='search' value={filter.search} onChange={clientChangeHandler} />
                        <Link className="ms-3" to="#" onClick={fetchDataHandler}>
                            <RefatchIcon width="24" height="24" />
                        </Link>
                        <CSVLink
                            data={csvdata}
                            filename={"clientdetails.csv"}
                            className="ms-2"
                            target="_blank"
                        >
                            <CsvDownloadIcon width="24" height="24" />
                        </CSVLink>
                    </div>
                    {/* <div className="col-sm-2">
                        <select name='selclient' value="" className="form-control select"
                                onChange="">
                            <option value=''>All</option>
                            {clientData.map((cl, i) =>{    
                                <option key={i} value={cl.id}>{cl.name}</option>
                                }
                            )}
                        </select>
                    </div> */}
                    

                </div>
            </div>
            <div className="mt-4">

                <div className="tab-content" id="myTabContent">
                    <div className='tab-pane fade show active'>
                        <div className="fix-table-height">
                            <div className="table-responsive">
                                <table className="table m-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Verified Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(clientData) && clientData.length === 0 ? <tr>
                                            <td className='text-center' colSpan="7">No records found</td>
                                        </tr> :
                                            clientData.map((client, i) =>

                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td><Link to={{ pathname: '/ib/client', state: { client_id: client.id, client_name: client.name } }}
                                                        className="edit-icon link-text" title="Client Details">{client.name}</Link></td>
                                                    <td><a href="mailto:{client.email}" className='link-text-simple'>{client.email}</a></td>
                                                    <td><a href="tel:{client.phone}" className='link-text-simple'>{client.phone}</a></td>
                                                    <td>{client.status}</td>
                                                    <td>{client.verified}</td>
                                                    <td>{client.created}</td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="table-responsive mt-32">
                <table className="table m-0">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Profile</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Status</th>
                            <th scope="col">Affiliate Status</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {clientData.map((data,index) =>
                        <tr>
                            <th scope="row">{index+1}</th>
                            <td><Image className="rounded-5" width="40" src={(data.profile_photo!=null) ? data.profile_photo : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt="Logo" /></td>
                            <td><Link to={{ pathname:'/ib/client', state:{client_id:data.id} }} className="edit-icon">{data.name}</Link></td>
                            <td>{data.email}</td>
                            <td>{data.phone_no}</td>
                            <td>{data.status}</td>
                            <td>{data.affiliate_status}</td>
                            <td>{data.created}</td>
                        </tr>
                    )}    
                    </tbody>
                </table>
            </div> */}
        </>
    );
}

export default ClientDetails;
