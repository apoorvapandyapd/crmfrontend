
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { redirectAsync, showClient } from "../../store/clientslice";
import axios from "axios";
import { Link } from 'react-router-dom';

const base_url = process.env.REACT_APP_API_URL;
const UPDATEACCOUNTS_API_URL = base_url + "/v1/update-accounts";

const Accounts = (props) => {
    // const [key, setKey] = useState('demo');

    let [demodata, setdemodata] = useState(props.dataall.data.demoList);
    let [livedata, setlivedata] = useState(props.dataall.data.liveList);

    const client = useSelector(showClient);

    // const history = useHistory();
    const dispatch = useDispatch();
    // const demodata = props.dataall.data.demoList;
    // const livedata = props.dataall.data.liveList;

    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            const response = await axios.post(UPDATEACCOUNTS_API_URL, bodyParameters, config)

            setdemodata(response.data.data.demoList);
            setlivedata(response.data.data.liveList);
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
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
        // <div className="card-body">
        //     <h2>Account Details</h2>
        //     <Tabs
        //         id="controlled-tab-example"
        //         activeKey={key}
        //         onSelect={(k) => setKey(k)}
        //         className="c-tabs nav-tabs"
        //     >
        //         <Tab eventKey="demo" title="Demo">
        //             <div className="table-responsive">
        //                 <Table className="table m-0">
        //                     <thead>
        //                         <tr>
        //                             <th>Login</th>
        //                             {/* <th>Group</th> */}
        //                             <th>Levarage</th>
        //                             <th>Balance</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         {demodata.map((data) =>
        //                         <tr>
        //                             <td>{data.login}</td>
        //                             {/* <td>{data.account_group}</td> */}
        //                             <td>{data.account_leverage}</td>
        //                             <td>$150</td>
        //                         </tr>
        //                         )}
                               

        //                     </tbody>
        //                 </Table>
        //             </div>
        //         </Tab>
        //         <Tab eventKey="live" title="Live">
        //             <div className="table-responsive">
        //                 <Table className="table m-0">
        //                     <thead>
        //                         <tr>
        //                             <th>Login</th>
        //                             {/* <th>Group</th> */}
        //                             <th>Levarage</th>
        //                             <th>Balance</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                     {livedata.map((live) =>
        //                         <tr>
        //                             <td>{live.login}</td>
        //                             {/* <td>{live.account_group}</td> */}
        //                             <td>{live.account_leverage}</td>
        //                             <td>${live.balance}</td>
        //                         </tr>
        //                         )}
                                

        //                     </tbody>
        //                 </Table>
        //             </div>
        //         </Tab>
        //     </Tabs>
        // </div>
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
                
                <div className={props.activetab === 'live' ? "tab-pane fade show active" : "tab-pane fade"} id="live-tab-pane" role="tabpanel" aria-labelledby="live-tab" tabIndex="0">
                    <div className="table-responsive">
                        <table className="table m-0 account-detils-table">
                            <thead>
                                <tr>
                                    <th scope="col">Login</th>
                                    {/* <th scope="col">Password</th>
                                    <th scope="col">Group</th> */}
                                    <th scope="col">Leverage</th>
                                    <th scope="col">Free Margin</th>
                                    <th scope="col">Equity</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {livedata !== null && livedata.length === 0 ? <tr><td className='text-center' colspan="7">No records found</td></tr> : livedata.map((live) =>
                                 <tr>
                                     <td>{live.login}</td>
                                     {/* <td>{live.password}</td>
                                     <td>{live.account_group}</td> */}
                                     <td>{live.account_leverage}</td>
                                     <td>${live.free_margin}</td>
                                     <td>${live.equity}</td>
                                     <td>${live.balance}</td>
                                        <td>{live.status === 1 ? 'Active' : 'Removed from MT'}</td>
                                     <td>{live.created_at}</td>
                                 </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={props.activetab === 'demo' ? "tab-pane fade show active" : "tab-pane fade"} id="demo-tab-pane" role="tabpanel" aria-labelledby="demo-tab" tabIndex="0">
                    <div className="table-responsive">
                        <table className="table m-0 account-detils-table">
                            <thead>
                                <tr>
                                    <th scope="col">Login</th>
                                    {/* <th scope="col">Password</th>
                                    <th scope="col">Group</th> */}
                                    <th scope="col">Leverage</th>
                                    <th scope="col">Free Margin</th>
                                    <th scope="col">Equity</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demodata !== null && demodata.length === 0 ? <tr><td className='text-center' colspan="7">No records found</td></tr> : demodata.map((data) =>
                                 <tr>
                                     <td>{data.login}</td>
                                     {/* <td>{data.password}</td>
                                     <td>{data.account_group}</td> */}
                                     <td>{data.account_leverage}</td>
                                     <td>${data.free_margin}</td>
                                     <td>${data.equity}</td>
                                     <td>${data.balance}</td>
                                        <td>{data.status === 1 ? 'Active' : 'Removed from MT'}</td>
                                     <td>{data.created_at}</td>
                                 </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Accounts;