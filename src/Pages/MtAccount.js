import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { FormControl, FormGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { PropagateLoader } from 'react-spinners';
import Innerlayout from '../Components/Innerlayout';
import { Button, Modal } from 'react-bootstrap';
import { redirectAsync, showClient } from '../store/clientslice';
import AlertMessage from './AlertMessage';
import { PasswordKeyHoleIcon, PasswordLockIcon, VisibilityIcon } from '../Components/icons';
const base_url = process.env.REACT_APP_API_URL;
const MTACCOUNT_API_URL = base_url + "/v1/client/list-mtaccount";
const SHOWPASSWORD_API_URL = base_url + "/v1/client/show-mtpassword";
// const NEW_TRANSFER_API_URL = base_url + "/v1/client/send-mttransferrequest";
const UPDATEACCOUNTS_API_URL = base_url + "/v1/update-accounts";

function MtAccount() {

    const [demoData, setDemoData] = useState(null);
    const [liveData, setLiveData] = useState(null);
    // const [selectedAccount, setSelectedAccount] = useState(null);
    // const [selectedType, setSelectedType] = useState(null);
    // const [show, setShow] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [login, setLogin] = useState(null);
    // const [modalBtnDisable, setModalBtnDisable] = useState(false);
    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);

    const client = useSelector(showClient);
    const dispatch = useDispatch();



    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const data = {
                key: "value"
            };
            
            await axios.post(MTACCOUNT_API_URL, data, config).then((res)=>{
                if(res.data.status_code===200){

                    setDemoData(res.data.data.demo);
                    setLiveData(res.data.data.live);
                }
                else if (res.data.status_code === 500) {
                    ;
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data.errors);
                }
            });

        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    async function updateAccountData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            const response = await axios.post(UPDATEACCOUNTS_API_URL, bodyParameters, config)

            setDemoData(response.data.data.demoList);
            setLiveData(response.data.data.liveList);
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    const handleClose=()=>{
        // setShow(false);
        setShowPwd(false);
    }

    const checkPassword=(login)=>{
        setShowPwd(true);
        setLogin(login);
    }

    // const showModal=(event,account_id, type)=>{
    //     setSelectedAccount(account_id);
    //     setSelectedType(type);
    //     setErrorMesssage(null);
    //     setAlertDiv(false);
    //     setShow(true);
    // }

    // const handleTransaction = async(event) => {
    //     event.preventDefault();
    //     const { type, account_id, amount } = event.target.elements;
    //     try {
    //         const config = {
    //             headers: { Authorization: `Bearer ${client.token}` }
    //         };

    //         let formData = new FormData();
    //         formData.append("type", type.value);
    //         formData.append("account_id", account_id.value);
    //         formData.append("amount", amount.value);
    //         formData.append("proof_transfer", null);


    //         const response = await axios.post(NEW_TRANSFER_API_URL, formData, config).then(response=>{

    //             if(response.data.status_code === 200){
    //                 history.push('/transfer');
    //             }
    //             else if(response.data.status_code === 500){
    //                 setErrorMesssage(response.data.message);
    //                 setAlertDiv(true);
    //             }
    //         }).catch((error)=>{
    //             if (error.response) {
    //                 let err = error.response.data.errors;
    //                 setErrorMesssage(err);
    //             }
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         if(error.response.status===401){
    //             dispatch(redirectAsync());
    //         }
    //     }
    // }

    const showPasswordForm = async(event) => {
        event.preventDefault();
        setAlertDiv(false);
        const { password } = event.target.elements;

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("password", password.value);
            formData.append("login", login);
            
            await axios.post(SHOWPASSWORD_API_URL, formData, config).then(response => {

                if(response.data.status_code === 200){

                    document.getElementById(`${login}-val`).textContent = response.data.data;
                    document.getElementById(`${login}-lock`).style.display = 'none';
                    setShowPwd(false);
                }
                else if(response.data.status_code === 500){
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
            }).catch((error)=>{
                if (error.response) {
                    let err = error.response.data.errors;
                    setErrorMesssage(err);
                }
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        const delayedFunction = () => {
            updateAccountData();
        };
    
        const timerId = setTimeout(delayedFunction, 20000);
    
        return () => {
          clearTimeout(timerId); // Clear the timeout if the component is unmounted or the delay is no longer needed
        };
    });

    if (demoData === null && liveData === null) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
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
                <div className="card-body">
                    <h2>Account Details</h2>
                    <ul className="c-tabs nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <Link to="#" className={client.client.verify === "Not Completed" ? "" : "active"} id="live-tab" data-bs-toggle="tab" data-bs-target="#live-tab-pane" role="tab" aria-controls="live-tab-pane" aria-selected="false">Live</Link>
                        </li>
                        <li className="nav-item" role="presentation">
                            <Link to="#" className={client.client.verify === "Not Completed" ? "active" : ""} id="demo-tab" data-bs-toggle="tab" data-bs-target="#demo-tab-pane" role="tab" aria-controls="demo-tab-pane" aria-selected="false">Demo</Link>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className={`tab-pane fade ${client.client.verify === "Not Completed" ? 'show active' : ''}`} id="demo-tab-pane" role="tabpanel" aria-labelledby="demo-tab" tabIndex="0">
                            <div className="table-responsive">
                                <table className="table m-0 mt-account-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Login</th>
                                            <th scope="col">Password</th>
                                            {/* <th scope="col">Group</th> */}
                                            <th scope="col">Leverage</th>
                                            <th scope="col">Free Margin</th>
                                            <th scope="col">Equity</th>
                                            <th scope="col">Balance</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demoData !== null && demoData.length === 0 ? <tr><td className='text-center' colspan="9">No records found</td></tr> : demoData !== null && demoData.map((demo) =>
                                        <tr>
                                            <td>{demo.login}</td>
                                            <td>
                                                    <div><span id={`${demo.id}-val`} style={{ 'display': 'inline-block', 'verticalAlign': 'middle', 'marginRight': '8px', 'height': '14px' }} >********* </span><Link to="#" id={`${demo.id}-lock`} onClick={() => checkPassword(demo.id)}>
                                                        {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 13.6083C8.00833 13.6083 6.39166 11.9916 6.39166 9.99993C6.39166 8.00827 8.00833 6.3916 10 6.3916C11.9917 6.3916 13.6083 8.00827 13.6083 9.99993C13.6083 11.9916 11.9917 13.6083 10 13.6083ZM10 7.6416C8.7 7.6416 7.64166 8.69993 7.64166 9.99993C7.64166 11.2999 8.7 12.3583 10 12.3583C11.3 12.3583 12.3583 11.2999 12.3583 9.99993C12.3583 8.69993 11.3 7.6416 10 7.6416Z" fill="#0B0B16"/>
                                            <path d="M9.99999 17.5167C6.86666 17.5167 3.90833 15.6834 1.87499 12.5001C0.991661 11.1251 0.991661 8.8834 1.87499 7.50007C3.91666 4.31673 6.87499 2.4834 9.99999 2.4834C13.125 2.4834 16.0833 4.31673 18.1167 7.50007C19 8.87507 19 11.1167 18.1167 12.5001C16.0833 15.6834 13.125 17.5167 9.99999 17.5167ZM9.99999 3.7334C7.30833 3.7334 4.73333 5.35007 2.93333 8.17507C2.30833 9.15007 2.30833 10.8501 2.93333 11.8251C4.73333 14.6501 7.30833 16.2667 9.99999 16.2667C12.6917 16.2667 15.2667 14.6501 17.0667 11.8251C17.6917 10.8501 17.6917 9.15007 17.0667 8.17507C15.2667 5.35007 12.6917 3.7334 9.99999 3.7334Z" fill="#0B0B16"/>
                                            </svg> */}
                                                        <VisibilityIcon width="16" height="16" />
                                                    </Link></div>
                                            </td>
                                            {/* <td>{demo.account_group}</td> */}
                                            <td>{demo.account_leverage}</td>
                                            <td>${demo.free_margin}</td>
                                            <td>${demo.equity}</td>
                                            <td>${demo.balance}</td>
                                                <td>{demo.status === 1 ? 'Active' : 'Removed from MT'}</td>
                                            <td>{demo.created_at}</td>
                                            {
                                                    (demo.status === 1) ? 
                                                <td>
                                                    {/* <Link to={{ pathname:'/edit/mt-account', state:{account_id:demo.id} }} id={`edit-demo-${demo.id}`} className="edit-icon">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#0B0B16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M16.0399 3.02001L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96001C22.3399 6.60001 22.9799 5.02001 20.9799 3.02001C18.9799 1.02001 17.3999 1.66001 16.0399 3.02001Z" stroke="#0B0B16" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M14.9102 4.15002C15.5802 6.54002 17.4502 8.41002 19.8502 9.09002" stroke="#0B0B16" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                    </Link>
                                                    <ReactTooltip anchorId={`edit-demo-${demo.id}`} place="top" content='Edit' /> */}
                                                    <Link to={{ pathname:'/change/main-password/'+demo.id }} id={`edit-demo-password-${demo.id}`} className="edit-icon ml-10">
                                                                <PasswordKeyHoleIcon width="24" height="24" />
                                                    </Link>
                                                    <ReactTooltip anchorId={`edit-demo-password-${demo.id}`} place="top" content='Change Main Password' />
                                                    <Link to={{ pathname:'/change/invest-password/'+demo.id }} id={`edit-demoinvest-password-${demo.id}`} className="edit-icon ml-10">
                                                                <PasswordLockIcon width="24" height="24" />
                                                    </Link>
                                                    <ReactTooltip anchorId={`edit-demoinvest-password-${demo.id}`} place="top" content='Change Invest Password' />
                                                </td> : <td> - </td>
                                            }
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={`tab-pane fade ${client.client.verify === "Not Completed" ? '' : 'show active'}`} id="live-tab-pane" role="tabpanel" aria-labelledby="live-tab" tabIndex="0">
                            <div className="table-responsive">
                                <table className="table m-0 mt-account-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Login</th>
                                            <th scope="col">Password</th>
                                            {/* <th scope="col">Group</th> */}
                                            <th scope="col">Leverage</th>
                                            <th scope="col">Free Margin</th>
                                            <th scope="col">Equity</th>
                                            <th scope="col">Balance</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {liveData !== null && liveData.length === 0 ? <tr><td className='text-center' colspan="9">No records found</td></tr> : liveData !== null && liveData.map((live) =>
                                        <tr>
                                            <td>{live.login}</td>
                                            <td>
                                                    <div><span id={`${live.id}-val`} style={{ 'display': 'inline-block', 'verticalAlign': 'middle', 'marginRight': '8px', 'height': '14px' }} >********* </span><Link to="#" id={`${live.id}-lock`} onClick={() => checkPassword(live.id)}>
                                                        {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 13.6083C8.00833 13.6083 6.39166 11.9916 6.39166 9.99993C6.39166 8.00827 8.00833 6.3916 10 6.3916C11.9917 6.3916 13.6083 8.00827 13.6083 9.99993C13.6083 11.9916 11.9917 13.6083 10 13.6083ZM10 7.6416C8.7 7.6416 7.64166 8.69993 7.64166 9.99993C7.64166 11.2999 8.7 12.3583 10 12.3583C11.3 12.3583 12.3583 11.2999 12.3583 9.99993C12.3583 8.69993 11.3 7.6416 10 7.6416Z" fill="#0B0B16"/>
                                                <path d="M9.99999 17.5167C6.86666 17.5167 3.90833 15.6834 1.87499 12.5001C0.991661 11.1251 0.991661 8.8834 1.87499 7.50007C3.91666 4.31673 6.87499 2.4834 9.99999 2.4834C13.125 2.4834 16.0833 4.31673 18.1167 7.50007C19 8.87507 19 11.1167 18.1167 12.5001C16.0833 15.6834 13.125 17.5167 9.99999 17.5167ZM9.99999 3.7334C7.30833 3.7334 4.73333 5.35007 2.93333 8.17507C2.30833 9.15007 2.30833 10.8501 2.93333 11.8251C4.73333 14.6501 7.30833 16.2667 9.99999 16.2667C12.6917 16.2667 15.2667 14.6501 17.0667 11.8251C17.6917 10.8501 17.6917 9.15007 17.0667 8.17507C15.2667 5.35007 12.6917 3.7334 9.99999 3.7334Z" fill="#0B0B16"/>
                                                </svg> */}
                                                        <VisibilityIcon width="16" height="16" />
                                                    </Link></div>
                                            </td>
                                            {/* <td>{live.account_group}</td> */}
                                            <td>{live.account_leverage}</td>
                                            <td>${live.free_margin}</td>
                                            <td>${live.equity}</td>
                                            <td>${live.balance}</td>
                                                <td>{live.status === 1 ? 'Active' : 'Removed from MT'}</td>
                                            <td>{live.created_at}</td>
                                            {
                                                    live.status === 1 ? 
                                                <td>
                                                    {/* <Link to={{ pathname:'/edit/liveaccount', state:{account_id:live.id} }} id={`edit-live-${live.id}`} className="edit-icon">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#0B0B16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M16.0399 3.02001L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96001C22.3399 6.60001 22.9799 5.02001 20.9799 3.02001C18.9799 1.02001 17.3999 1.66001 16.0399 3.02001Z" stroke="#0B0B16" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M14.9102 4.15002C15.5802 6.54002 17.4502 8.41002 19.8502 9.09002" stroke="#0B0B16" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                    </Link>
                                                    <ReactTooltip anchorId={`edit-live-${live.id}`} place="top" content='Edit' /> */}
                                                    <Link to={{ pathname:'/change/main-password/'+live.id }} id={`edit-live-password-${live.id}`} className="edit-icon ml-10">
                                                                <PasswordKeyHoleIcon width="24" height="24" />
                                                    </Link>
                                                    <ReactTooltip anchorId={`edit-live-password-${live.id}`}  place="top" content='Change Main Password' />
                                                    <Link to={{ pathname:'/change/invest-password/'+live.id }} id={`edit-invest-password-${live.id}`} className="edit-icon ml-10">
                                                                <PasswordLockIcon width="24" height="24" />
                                                    </Link>
                                                    <ReactTooltip anchorId={`edit-invest-password-${live.id}`} place="top" content='Change Invest Password' />
                                                            {/* <a href={null} onClick={(e)=>showModal(e,live.id,4)} id={`wallet-liveaccount-${live.id}`} className="edit-icon ml-10">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#1E3150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M9 9.51001L12 6.51001L15 9.51001" stroke="#1E3150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M12 6.51001V14.51" stroke="#1E3150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51" stroke="#1E3150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                    </a>
                                                    <ReactTooltip anchorId={`wallet-liveaccount-${live.id}`} place="top" content='Wallet to Account' />
                                                    <a href={null} onClick={(e)=>showModal(e,live.id,3)} id={`wallet-account-${live.id}`} className="edit-icon ml-10">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#1E3150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M9 11.51L12 14.51L15 11.51" stroke="#1E3150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M12 14.51V6.51001" stroke="#1E3150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51" stroke="#1E3150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                    </a>
                                                    <ReactTooltip anchorId={`wallet-account-${live.id}`} place="top" content='Account to Wallet' /> */}
                                                </td> : <td> - </td>
                                            }
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Modal show={show} onHide={(e)=>handleClose(e)}>
                    <form onSubmit={handleTransaction}>
                    <Modal.Header closeButton>
                    <Modal.Title>
                    {
                        (selectedType===4) ? 'Wallet to Account' : 'Account to Wallet'
                    }
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                        <FormControl type="hidden" name="account_id" value={selectedAccount} />
                        <FormControl type="hidden" name="type" value={selectedType}/>
                        <FormGroup className="mb-3">
                            <FormControl type="text" name="amount" placeholder="Amount" min='1' step="0.01" oninput={(event) => event.target.value > 0 ? event.target.value : null} />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>handleClose(e)}>
                        Close
                    </Button>
                    <Button type="submit" variant="primary" disabled={modalBtnDisable}>Send</Button>
                    </Modal.Footer>
                    </form>
                </Modal> */}
                <Modal show={showPwd} onHide={(e)=>handleClose(e)} centered animation={false}>
                    <form onSubmit={showPasswordForm}>
                    <Modal.Header>
                    <Modal.Title>
                    Verification Password
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                        <FormGroup className="mb-3">
                                <FormControl type="password" name="password" placeholder='Enter Profile Password' />
                        </FormGroup>               
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={(e)=>handleClose(e)}>
                        Close
                    </Button>
                            <Button type="submit" variant="primary" >Show</Button>
                    </Modal.Footer>
                    </form>
                </Modal>
            </Innerlayout>
        </Fragment>
    );
}

export default MtAccount;