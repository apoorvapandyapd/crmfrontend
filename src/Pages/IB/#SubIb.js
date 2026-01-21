import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import IbInfo from '../IbDashboardPage/IbInfo';
import SubIbClients from '../IbDashboardPage/SubIbClients';

const base_url = process.env.REACT_APP_API_URL;
const IBDETAIL_API_URL = base_url + "/v1/ib/ib-details";

function SubIb(props) {

    const [clientinfo, setClientInfo] = useState(null);
    const client = useSelector(showClient);
    let location = useLocation();

    const history = useHistory();
    const dispatch = useDispatch();

    var ib_client = location.state.ib_id;
    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const data = {
                id: ib_client
            };
            await axios.post(IBDETAIL_API_URL, data, config).then((res)=>{
                if(res.data.status_code===200){

                    setClientInfo(res.data);
                }
                else if(res.data.status_code==500){
                    ;
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data.errors);
                }
            });
        } catch (error) {
            console.error(error);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }
    
    useEffect(() => {
        fetchData();
    }, [])

    if (clientinfo === null) {
        return (
            <Fragment>
                <Innerlayout>Loading ...</Innerlayout>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Innerlayout>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card-body ib-dashboard-content">
                        <ul className="c-tabs nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a className="active" id="c-tab" data-bs-toggle="tab" data-bs-target="#client-tab" role="tab" aria-controls="client-tab" aria-selected="false">IB Details</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="" id="sib-tab" data-bs-toggle="tab" data-bs-target="#live-accounts" role="tab" aria-controls="live-accounts" aria-selected="false">Client Details</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="client-tab" role="tabpanel" aria-labelledby="c-tab" tabIndex="0">
                                <IbInfo data={clientinfo}/>
                            </div>
                                <div className="tab-pane fade" id="live-accounts" role="tabpanel" aria-labelledby="sib-tab" tabIndex="0">
                                <SubIbClients data={clientinfo}/>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </Innerlayout>
        </Fragment>
    );
}

export default SubIb;