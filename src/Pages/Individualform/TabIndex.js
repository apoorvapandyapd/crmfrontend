 import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import PropagateLoader from "react-spinners/PropagateLoader";
import Personal from './Personal';
import Employment from './Employment';
import Bank from './Bank';
import Experience from './Experience';
import Disclouser from './Disclouser';
import Declaration from './Declaration';

function TabIndex() {

    const client = useSelector(showClient);
    if (client.client.login === false)
    {
        dispatch(redirectAsync());
    }
    console.log(client);

    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('individual_key');
 
    const tabKeys = ['individual_key', 'emp_key', 'bank_key', 'trading_key', 'general_key', 'declaration_key'];

    let [loading, setLoading] = useState(false);

    const backEvent=(e)=>{
        e.preventDefault();
        const currentIndex = tabKeys.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabKeys[currentIndex - 1]);
        }
    }

    useEffect(() => {
        
    },[setActiveTab]);

    if (loading===true) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                        color={'#000b3e'}
                        loading={loading}
                        cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </Innerlayout>
            </Fragment>
        );
    }

    return (
        <Fragment>
        <Innerlayout>
            <div className="box-wrapper w-100 application-from">
                <div className="card-body p-0">
                    <div className="d-flex flex-wrap justify-content-between">
                        <div className="form-left">
                            <ul className="nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className={activeTab=='individual_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-1" data-bs-toggle="tab" data-bs-target="#tab-pane-1" role="tab" aria-controls="tab-pane-1" aria-selected="false">Individual Applicant</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className={activeTab=='emp_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-2" data-bs-toggle="tab" data-bs-target="#tab-pane-2" role="tab" aria-controls="tab-pane-2" aria-selected="false">Employment Information</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className={activeTab=='bank_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-3" data-bs-toggle="tab" data-bs-target="#tab-pane-3" role="tab" aria-controls="tab-pane-3" aria-selected="false">Banking Details</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className={activeTab=='trading_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-5" data-bs-toggle="tab" data-bs-target="#tab-pane-5" role="tab" aria-controls="tab-pane-5" aria-selected="false">Trading Experience and Knowledge</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className={activeTab=='general_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-7" data-bs-toggle="tab" data-bs-target="#tab-pane-7" role="tab" aria-controls="tab-pane-7" aria-selected="false">General Disclosure</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className={activeTab=='declaration_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-8" data-bs-toggle="tab" data-bs-target="#tab-pane-8" role="tab" aria-controls="tab-pane-8" aria-selected="false">Client Declarations</a>
                                </li>
                            </ul>
                        </div>
                        <div className="form-right">
                            <div className="tab-content" id="myTabContent">
                                <div className={activeTab=='individual_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-1" role="tabpanel" aria-labelledby="tab-1" tabindex="0">
                                    <Personal setActiveTab={setActiveTab} activeTab={activeTab}/>
                                </div>
                                <div className={activeTab=='emp_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-2" role="tabpanel" aria-labelledby="tab-2" tabindex="0">
                                    <Employment setActiveTab={setActiveTab} backEvent={backEvent} activeTab={activeTab}/>
                                </div>
                                <div className={activeTab=='bank_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-3" role="tabpanel" aria-labelledby="tab-3" tabindex="0">
                                    <Bank setActiveTab={setActiveTab} backEvent={backEvent} activeTab={activeTab}/>
                                </div>
                                <div className={activeTab=='trading_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-5" role="tabpanel" aria-labelledby="tab-5" tabindex="0">
                                    <Experience setActiveTab={setActiveTab} backEvent={backEvent} activeTab={activeTab}/>
                                </div>
                                <div className={activeTab=='general_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-7" role="tabpanel" aria-labelledby="tab-7" tabindex="0">
                                    <Disclouser setActiveTab={setActiveTab} backEvent={backEvent} activeTab={activeTab}/>
                                </div>
                                <div className={activeTab=='declaration_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-8" role="tabpanel" aria-labelledby="tab-8" tabindex="0">
                                    <Declaration setActiveTab={setActiveTab} backEvent={backEvent} activeTab={activeTab}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Innerlayout>
        </Fragment>
    )
}

export default TabIndex
