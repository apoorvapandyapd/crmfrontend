import {Table} from "react-bootstrap";
import React, {useEffect, useState} from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom/cjs/react-router-dom.min";
import {redirectAsync, showClient} from "../../store/clientslice";
import axios from "axios";
import { Link } from 'react-router-dom';
import { CustomRequest } from '../../Components/RequestService';

// const base_url = process.env.REACT_APP_API_URL;
// const UPDATEACCOUNTS_API_URL = base_url + "/v1/update-accounts";

const Accounts = (props) => {
    // const [key, setKey] = useState('demo');
    // const [key, setKey] = useState('demo');

    let [demodata, setdemodata] = useState(props.dataall.data.demoList);
    let [livedata, setlivedata] = useState(props.dataall.data.liveList);

    const client = useSelector(showClient);

    const dispatch = useDispatch();
    // const demodata = props.dataall.data.demoList;
    // const livedata = props.dataall.data.liveList;

    async function fetchData() {
        const data = {
            key: "value"
        };

        CustomRequest('update-accounts', data, client.token, (res) => {
            if (res?.error) {
                console.log(res.error);
                if (res?.error?.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                setdemodata(res.data.data.demoList);
                setlivedata(res.data.data.liveList);
            }
        });
    }

    useEffect(() => {
        const delayedFunction = () => {
            fetchData();
        };

        const timerId = setTimeout(delayedFunction, 20000);

        return () => {
            clearTimeout(timerId); // Clear the timeout if the component is unmounted or the delay is no longer needed
        };
    });

    return (
        <div className="card-body">
            <h2>Account Details</h2>
            <ul className="c-tabs nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <Link to="#" className={props.activetab === 'live' ? "active" : ""} id="live-tab" data-bs-toggle="tab" data-bs-target="#live-tab-pane" role="tab" aria-controls="live-tab-pane" aria-selected="false">Live</Link>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="#" className={props.activetab === 'demo' ? "active" : ""} id="demo-tab" data-bs-toggle="tab" data-bs-target="#demo-tab-pane" role="tab" aria-controls="demo-tab-pane" aria-selected="false">Demo</Link>
                </li>

            </ul>
            <div className="tab-content account-details" id="myTabContent">

                <div className={props.activetab === 'live' ? "tab-pane fade show active" : "tab-pane fade"}
                     id="live-tab-pane" role="tabpanel" aria-labelledby="live-tab" tabIndex="0">
                    <div className="table-responsive">
                        <table className="table m-0 account-detils-table">
                            <thead>
                            <tr>
                                <th scope="col">Login</th>
                                <th scope="col">Leverage</th>
                                <th scope="col">Free Margin</th>
                                <th scope="col">Equity</th>
                                <th scope="col">Balance</th>
                                <th scope="col">Status</th>
                                <th scope="col">Created At</th>
                            </tr>
                            </thead>
                            <tbody>
                                {livedata !== null && livedata.length === 0 ?
                                    <tr>
                                        <td className='text-center' colSpan="7">No records found</td>
                                        </tr> : livedata.map((live,index) => <tr key={index}>
                                        <td>{live.login}</td>
                                        <td>{live.account_leverage}</td>
                                        <td>${live.free_margin?.toLocaleString()}</td>
                                        <td>${live.equity?.toLocaleString()}</td>
                                        <td>${live.balance?.toLocaleString()}</td>
                                        <td>{live.status == 1 ? 'Active' : 'Removed from MT'}</td>
                                        <td>{live.created_at}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={props.activetab === 'demo' ? "tab-pane fade show active" : "tab-pane fade"}
                     id="demo-tab-pane" role="tabpanel" aria-labelledby="demo-tab" tabIndex="0">
                    <div className="table-responsive">
                        <table className="table m-0 account-detils-table">
                            <thead>
                            <tr>
                                <th scope="col">Login</th>
                                <th scope="col">Leverage</th>
                                <th scope="col">Free Margin</th>
                                <th scope="col">Equity</th>
                                <th scope="col">Balance</th>
                                <th scope="col">Status</th>
                                <th scope="col">Created At</th>
                            </tr>
                            </thead>
                            <tbody>
                            {demodata !== null && demodata.length === 0 ? <tr>
                                <td className='text-center' colSpan="7">No records found</td>
                            </tr> : demodata.map((data,index) => <tr key={index}>
                                <td>{data.login}</td>
                                <td>{data.account_leverage}</td>
                                <td>${data.free_margin?.toLocaleString()}</td>
                                <td>${data.equity?.toLocaleString()}</td>
                                <td>${data.balance?.toLocaleString()}</td>
                                <td>{data.status == 1 ? 'Active' : 'Removed from MT'}</td>
                                <td>{data.created_at}</td>
                            </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>);
}

export default Accounts;