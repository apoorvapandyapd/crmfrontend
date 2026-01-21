import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Innerlayout from '../../Components/Innerlayout';
import {redirectAsync, showClient} from '../../store/clientslice';
import ClientDetails from '../IbDashboardPage/ClientDetails';
import IbDashboardHeader from '../IbDashboardPage/IbDashboardHeader';
import PropagateLoader from "react-spinners/PropagateLoader";
import { Link } from 'react-router-dom';
import IbAllClientAccount from '../IbDashboardPage/IbAllClientAccount';
import IbAllClientDeposit from '../IbDashboardPage/IbAllClientDeposit';
import IbAllClientWithdraw from '../IbDashboardPage/IbAllClientWithdraw';
import IbAllClientTransfer from '../IbDashboardPage/IbAllClientTransfer';
import CommissionHistory from '../IbDashboardPage/CommissionHistory';
import SubIBDetails from '../IbDashboardPage/SubIBDetails';
import { CustomRequest } from '../../Components/RequestService';

const base_url = process.env.REACT_APP_API_URL;
const DASHBOARD_API_URL = base_url + "/v1/ib/dashboard";

function Dashboard(props) {

    const [dasboarddata, setDashboarData] = useState(null);
    const [loading, setLoading] = useState(false);
    const client = useSelector(showClient);
    const [tab, setTab] = useState('D');
    const dispatch = useDispatch();


    async function fetchData() {
        const config = {
            headers: { Authorization: `Bearer ${client.token}` }
        };

        let data = {
            key: "value"
        };

        CustomRequest('ib-dashboard', data, client.token, (res) => {
            if (res?.error) {
                if (res.error.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    setDashboarData(res.data);
                    setLoading(false)
                }
            }
        });
    }



    const tabHandler = (tab) => {
        setTab(tab);
        if (tab === 'D')
            fetchData();
    }

    function handleChildData() {
        fetchData();
    };


    useEffect(() => {
        fetchData();
    }, [])

    if (dasboarddata === null) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
                        cssOverride={{ textAlign: 'center', alignItems: 'center', backgroundColor: 'rgb(251,252,252,0.8)', display: 'flex', justifyContent: 'center', width: '100%', height: '100vh' }}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </Innerlayout>
            </Fragment>
        );
    }

    return (
        <Innerlayout>
            {
                loading === true ?
                    <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
                        cssOverride={{ textAlign: 'center', alignItems: 'center', backgroundColor: 'rgb(251,252,252,0.8)', display: 'flex', justifyContent: 'center', width: '100%', height: '100vh' }}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    /> :
                    <Fragment>
                        <div className="row">
                            <IbDashboardHeader data={dasboarddata} />
                        </div>
                        {/* {
                            (dasboarddata.data.additionalDocumentCount > 0) ? 
                            <div className="alert-type-box">
                                <p>You need to upload additional documents please <Link to='/accountverification'><a href={null} className="link-text">Click Here.</a></Link></p>
                            </div> : null
                        } */}

                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card-body ib-dashboard-content">
                                    <ul className="c-tabs nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <Link to="#" className="active" id="c-tab" data-bs-toggle="tab" data-bs-target="#client-tab"
                                                role="tab" aria-controls="client-tab" aria-selected="false" onClick={() => tabHandler('D')}>Client Details</Link>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#subib-tab"
                                                role="tab" aria-controls="subib-tab" aria-selected="false" onClick={() => tabHandler('SIB')}>SubIB Details</Link>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#client-accounts"
                                                role="tab" aria-controls="client-accounts" aria-selected="false" onClick={() => tabHandler('CA')}>Client Accounts</Link>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#client-deposits"
                                                role="tab" aria-controls="client-deposits" aria-selected="false" onClick={() => tabHandler('CD')}>Client Deposits</Link>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#client-withdraw"
                                                role="tab" aria-controls="client-withdraw" aria-selected="false" onClick={() => tabHandler('CW')}>Client Withdrawals</Link>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#client-transfer"
                                                role="tab" aria-controls="client-transfer" aria-selected="false" onClick={() => tabHandler('CT')}>Client Transfers</Link>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#commission-histroy"
                                                role="tab" aria-controls="commission-histroy" aria-selected="false" onClick={() => tabHandler('CH')}>Commission Histroy</Link>
                                        </li>
                                        {/* <li className="nav-item" role="presentation">
                                    <a className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#commision-tab"
                                       role="tab" aria-controls="commision-tab" aria-selected="false">Commision
                                        History</a>
                                </li> */}

                                    </ul>
                                    {/* <ul className="c-tabs nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a className="active" id="c-tab" data-bs-toggle="tab" data-bs-target="#client-tab" role="tab" aria-controls="client-tab" aria-selected="false">Client Details</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="" id="sib-tab" data-bs-toggle="tab" data-bs-target="#sub-ib-tab" role="tab" aria-controls="sub-ib-tab" aria-selected="false">Sub IB Details</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#commision-tab" role="tab" aria-controls="commision-tab" aria-selected="false">Commision History</a>
                            </li>

                        </ul> */}
                                    <div className="tab-content" id="myTabContent">

                                        <div className="tab-pane fade show active" id="client-tab" role="tabpanel"
                                            aria-labelledby="c-tab" tabIndex="0">
                                            {tab && tab === 'D' && <ClientDetails data={dasboarddata} fetchData={handleChildData} />}
                                        </div>
                                        <div className="tab-pane fade" id="subib-tab" role="tabpanel"
                                            aria-labelledby="c-tab" tabIndex="0">
                                            {tab && tab === 'SIB' && <SubIBDetails data={dasboarddata} fetchData={handleChildData}/>}
                                        </div>
                                        <div className="tab-pane fade" id="client-accounts" role="tabpanel"
                                            aria-labelledby="c-tab" tabIndex="0">
                                            {tab && tab === 'CA' && <IbAllClientAccount />}
                                        </div>
                                        <div className="tab-pane fade" id="client-deposits" role="tabpanel"
                                            aria-labelledby="c-tab" tabIndex="0">
                                            {tab && tab === 'CD' && <IbAllClientDeposit />}
                                        </div>
                                        <div className="tab-pane fade" id="client-withdraw" role="tabpanel"
                                            aria-labelledby="c-tab" tabIndex="0">
                                            {tab && tab === 'CW' && <IbAllClientWithdraw />}
                                        </div>
                                        <div className="tab-pane fade" id="client-transfer" role="tabpanel"
                                            aria-labelledby="c-tab" tabIndex="0">
                                            {tab && tab === 'CT' && <IbAllClientTransfer />}
                                        </div>
                                        <div className="tab-pane fade" id="commission-histroy" role="tabpanel"
                                            aria-labelledby="c-tab" tabIndex="0">
                                            {tab && tab === 'CH' && <CommissionHistory data={dasboarddata}/>}
                                        </div>
                                        
                                        {/* <div className="tab-pane fade show active" id="client-tab" role="tabpanel" aria-labelledby="c-tab" tabIndex="0">
                                <ClientDetails data={dasboarddata}/>
                            </div>
                                <div className="tab-pane fade" id="sub-ib-tab" role="tabpanel" aria-labelledby="sib-tab"tabIndex="0">
                                <SubIbDetails data={dasboarddata}/>
                            </div>
                                <div className="tab-pane fade" id="commision-tab" role="tabpanel" aria-labelledby="c-tab" tabIndex="0">
                                <CommissionHistory data={dasboarddata}/>
                            </div> */}

                                    </div>
                                </div>
                            </div>

                        </div>
                    </Fragment>
            }
        </Innerlayout>

    );
}

export default Dashboard;