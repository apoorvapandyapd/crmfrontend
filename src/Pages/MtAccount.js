import React, { Fragment, useEffect, useState } from 'react';
import { FormControl, FormGroup, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { PropagateLoader } from 'react-spinners';
import Innerlayout from '../Components/Innerlayout';
import { Button, Modal } from 'react-bootstrap';
import { redirectAsync, showClient } from '../store/clientslice';
import AlertMessage from './AlertMessage';
import { PasswordKeyHoleIcon, PasswordLockIcon, VisibilityIcon } from '../Components/icons';
import { CustomRequest } from '../Components/RequestService';

function MtAccount() {

    const [demoData, setDemoData] = useState(null);
    const [liveData, setLiveData] = useState(null);

    const [showPwd, setShowPwd] = useState(false);
    const [login, setLogin] = useState(null);
    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);

    const client = useSelector(showClient);
    const dispatch = useDispatch();
    var timerId;
    
    function fetchData() {
        clearTimeout(timerId);
        // try {
            const data = {
                key: "value"
            };

            CustomRequest('list-mtaccount', data, client.token, (res)=> {
                if(res?.error) {
                    console.log(res.error);
                    if (res.error.response.status === 401) {
                        dispatch(redirectAsync());
                    }
                } else {
                    if(res.data.status_code !== 200){
                        setDemoData([]);
                        setLiveData([]);

                        setErrorMesssage(res.data.error);
                        setAlertDiv(true);
                    } else {
                        if(res.data.status_code===200){
                            setDemoData(res.data.data.demo);
                            setLiveData(res.data.data.live);
                        }
                        // else if (res.data.status_code === 500) {
        
                        // }
                    }

                    timerId = setTimeout(() => {
                        fetchData();
                    }, 20000);
                }
            });
        // } catch (error) {
        //     console.error(error);
        //     if (error.response.status === 401) {
        //         dispatch(redirectAsync());
        //     }
        // }
    }
    const handleClose=()=>{
        setShowPwd(false);
    }

    const checkPassword=(login)=>{
        setShowPwd(true);
        setLogin(login);
    }

    const showPasswordForm = async(event) => {
        event.preventDefault();
        setAlertDiv(false);
        const { password } = event.target.elements;

        // try {
            let formData = new FormData();
            formData.append("password", password.value);
            formData.append("login", login);

            CustomRequest('show-mtpassword', formData, client.token, (response)=> {
                if(response?.error) {
                    console.log(response.error);
                    if (response.error.response.status.status === 401) {
                        dispatch(redirectAsync());
                    }
                } else {
                    if (response.data.status_code === 200) {
                        document.getElementById(`${login}-val`).textContent = response.data.data;
                        document.getElementById(`${login}-lock`).style.display = 'none';
                        setShowPwd(false);
                    }
                    else if(response.data.status_code === 500){
                        setErrorMesssage(response.data.message);
                        setAlertDiv(true);
                    }
                }
            });
        // } catch (error) {
        //     console.error(error);
        //     if (error.response.status === 401) {
        //         if (error.response.status === 401) {
        //             dispatch(redirectAsync());
        //         }
        //     }
        // }
    }

    useEffect(() => {
        fetchData();
    }, [])

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

                    {/* <div className="card flex justify-content-center">
                        <Password value={value} onChange={(e) => setValue(e.target.value)} />
                    </div> */}
                        {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
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
                                    {demoData !== null && demoData.length === 0 ? <tr><td className='text-center' colSpan="9">No records found</td></tr> : demoData !== null && demoData.map((demo) =>
                                        <tr key={demo.id}>
                                            <td>{demo.login}</td>
                                            <td>
                                                <div><span id={`${demo.id}-val`} style={{ 'display': 'inline-block', 'verticalAlign': 'middle', 'marginRight': '8px', 'height': '14px' }} >********* </span><Link to="#" id={`${demo.id}-lock`} onClick={() => checkPassword(demo.id)}>
                                                    <VisibilityIcon width="16" height="16" />
                                                </Link></div>
                                            </td>
                                            {/* <td>{demo.account_group}</td> */}
                                            <td>{demo.account_leverage}</td>
                                            <td >${demo.free_margin.toLocaleString()}</td>
                                            <td>${demo.equity.toLocaleString()}</td>
                                            <td>${demo.balance.toLocaleString()}</td>
                                            <td>{demo.status === 1 ? 'Active' : 'Removed from MT'}</td>
                                            <td>{demo.created_at}</td>
                                            {
                                                (demo.status === 1) ?
                                                    <td>
                                                        {/* <Link to={{ pathname:'/edit/mt-account', state:{account_id:demo.id} }} id={`edit-demo-${demo.id}`} className="edit-icon">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#0B0B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M16.0399 3.02001L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96001C22.3399 6.60001 22.9799 5.02001 20.9799 3.02001C18.9799 1.02001 17.3999 1.66001 16.0399 3.02001Z" stroke="#0B0B16" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M14.9102 4.15002C15.5802 6.54002 17.4502 8.41002 19.8502 9.09002" stroke="#0B0B16" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    </Link>
                                                    <ReactTooltip anchorId={`edit-demo-${demo.id}`} place="top" content='Edit' /> */}
                                                        <Link to={{ pathname:'/change/main-password/'+demo.id }} id={`edit-demo-password-${demo.id}`} className="edit-icon ml-10">
                                                            {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M18 10.75C17.59 10.75 17.25 10.41 17.25 10V8C17.25 4.85 16.36 2.75 12 2.75C7.64 2.75 6.75 4.85 6.75 8V10C6.75 10.41 6.41 10.75 6 10.75C5.59 10.75 5.25 10.41 5.25 10V8C5.25 5.1 5.95 1.25 12 1.25C18.05 1.25 18.75 5.1 18.75 8V10C18.75 10.41 18.41 10.75 18 10.75Z" fill="#292D32"/>
                                                                <path d="M12 19.25C10.21 19.25 8.75 17.79 8.75 16C8.75 14.21 10.21 12.75 12 12.75C13.79 12.75 15.25 14.21 15.25 16C15.25 17.79 13.79 19.25 12 19.25ZM12 14.25C11.04 14.25 10.25 15.04 10.25 16C10.25 16.96 11.04 17.75 12 17.75C12.96 17.75 13.75 16.96 13.75 16C13.75 15.04 12.96 14.25 12 14.25Z" fill="#292D32"/>
                                                                <path d="M17 22.75H7C2.59 22.75 1.25 21.41 1.25 17V15C1.25 10.59 2.59 9.25 7 9.25H17C21.41 9.25 22.75 10.59 22.75 15V17C22.75 21.41 21.41 22.75 17 22.75ZM7 10.75C3.42 10.75 2.75 11.43 2.75 15V17C2.75 20.57 3.42 21.25 7 21.25H17C20.58 21.25 21.25 20.57 21.25 17V15C21.25 11.43 20.58 10.75 17 10.75H7Z" fill="#292D32"/>
                                                            </svg> */}
                                                            <PasswordKeyHoleIcon width="24" height="24" />
                                                        </Link>
                                                        <ReactTooltip anchorId={`edit-demo-password-${demo.id}`} place="top" content='Change Main Password' />
                                                        <Link to={{ pathname:'/change/invest-password/'+demo.id }} id={`edit-demoinvest-password-${demo.id}`} className="edit-icon ml-10">
                                                            <PasswordLockIcon width="24" height="24" />
                                                        </Link>
                                                        <ReactTooltip anchorId={`edit-demoinvest-password-${demo.id}`} place="top" content='Change Invest Password' />
                                                    
                                                        {/* <Link to={{ pathname:'/change/main-password/'+demo.id }} id={`edit-demo-password-${demo.id}`} className="edit-icon ml-10">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M18 10.75C17.59 10.75 17.25 10.41 17.25 10V8C17.25 4.85 16.36 2.75 12 2.75C7.64 2.75 6.75 4.85 6.75 8V10C6.75 10.41 6.41 10.75 6 10.75C5.59 10.75 5.25 10.41 5.25 10V8C5.25 5.1 5.95 1.25 12 1.25C18.05 1.25 18.75 5.1 18.75 8V10C18.75 10.41 18.41 10.75 18 10.75Z" fill="#292D32"/>
                                                                <path d="M12 19.25C10.21 19.25 8.75 17.79 8.75 16C8.75 14.21 10.21 12.75 12 12.75C13.79 12.75 15.25 14.21 15.25 16C15.25 17.79 13.79 19.25 12 19.25ZM12 14.25C11.04 14.25 10.25 15.04 10.25 16C10.25 16.96 11.04 17.75 12 17.75C12.96 17.75 13.75 16.96 13.75 16C13.75 15.04 12.96 14.25 12 14.25Z" fill="#292D32"/>
                                                                <path d="M17 22.75H7C2.59 22.75 1.25 21.41 1.25 17V15C1.25 10.59 2.59 9.25 7 9.25H17C21.41 9.25 22.75 10.59 22.75 15V17C22.75 21.41 21.41 22.75 17 22.75ZM7 10.75C3.42 10.75 2.75 11.43 2.75 15V17C2.75 20.57 3.42 21.25 7 21.25H17C20.58 21.25 21.25 20.57 21.25 17V15C21.25 11.43 20.58 10.75 17 10.75H7Z" fill="#292D32"/>
                                                            </svg>
                                                        </Link> */}
                                                        {/* <ReactTooltip anchorId={`edit-demo-password-${demo.id}`} place="top" content='Change Main Password' /> */}
                                                        {/* <Link to={{ pathname:'/change/invest-password/'+demo.id }} id={`edit-demoinvest-password-${demo.id}`} className="edit-icon ml-10">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M18 10.75C17.59 10.75 17.25 10.41 17.25 10V8C17.25 4.85 16.36 2.75 12 2.75C7.64 2.75 6.75 4.85 6.75 8V10C6.75 10.41 6.41 10.75 6 10.75C5.59 10.75 5.25 10.41 5.25 10V8C5.25 5.1 5.95 1.25 12 1.25C18.05 1.25 18.75 5.1 18.75 8V10C18.75 10.41 18.41 10.75 18 10.75Z" fill="#292D32"/>
                                                                <path d="M17 22.75H7C2.59 22.75 1.25 21.41 1.25 17V15C1.25 10.59 2.59 9.25 7 9.25H17C21.41 9.25 22.75 10.59 22.75 15V17C22.75 21.41 21.41 22.75 17 22.75ZM7 10.75C3.42 10.75 2.75 11.43 2.75 15V17C2.75 20.57 3.42 21.25 7 21.25H17C20.58 21.25 21.25 20.57 21.25 17V15C21.25 11.43 20.58 10.75 17 10.75H7Z" fill="#292D32"/>
                                                                <path d="M8 16.9999C7.87 16.9999 7.74 16.9699 7.62 16.9199C7.49 16.8699 7.39001 16.7999 7.29001 16.7099C7.11001 16.5199 7 16.2699 7 15.9999C7 15.8699 7.02999 15.7399 7.07999 15.6199C7.12999 15.4899 7.20001 15.3899 7.29001 15.2899C7.39001 15.1999 7.49 15.1299 7.62 15.0799C7.98 14.9199 8.42999 15.0099 8.70999 15.2899C8.79999 15.3899 8.87001 15.4999 8.92001 15.6199C8.97001 15.7399 9 15.8699 9 15.9999C9 16.2599 8.88999 16.5199 8.70999 16.7099C8.51999 16.8899 8.26 16.9999 8 16.9999Z" fill="#292D32"/>
                                                                <path d="M12 16.9999C11.74 16.9999 11.48 16.8899 11.29 16.7099C11.11 16.5199 11 16.2699 11 15.9999C11 15.8699 11.02 15.7399 11.08 15.6199C11.13 15.4999 11.2 15.3899 11.29 15.2899C11.52 15.0599 11.87 14.9499 12.19 15.0199C12.26 15.0299 12.32 15.0499 12.38 15.0799C12.44 15.0999 12.5 15.1299 12.56 15.1699C12.61 15.1999 12.66 15.2499 12.71 15.2899C12.8 15.3899 12.87 15.4999 12.92 15.6199C12.97 15.7399 13 15.8699 13 15.9999C13 16.2699 12.89 16.5199 12.71 16.7099C12.66 16.7499 12.61 16.7899 12.56 16.8299C12.5 16.8699 12.44 16.8999 12.38 16.9199C12.32 16.9499 12.26 16.9699 12.19 16.9799C12.13 16.9899 12.06 16.9999 12 16.9999Z" fill="#292D32"/>
                                                                <path d="M16 16.9999C15.73 16.9999 15.48 16.8899 15.29 16.7099C15.2 16.6099 15.13 16.4999 15.08 16.3799C15.03 16.2599 15 16.1299 15 15.9999C15 15.7399 15.11 15.4799 15.29 15.2899C15.34 15.2499 15.39 15.2099 15.44 15.1699C15.5 15.1299 15.56 15.0999 15.62 15.0799C15.68 15.0499 15.74 15.0299 15.8 15.0199C16.13 14.9499 16.47 15.0599 16.71 15.2899C16.89 15.4799 17 15.7299 17 15.9999C17 16.1299 16.97 16.2599 16.92 16.3799C16.87 16.5099 16.8 16.6099 16.71 16.7099C16.52 16.8899 16.26 16.9999 16 16.9999Z" fill="#292D32"/>
                                                            </svg>
                                                        </Link> */}
                                                        {/* <ReactTooltip anchorId={`edit-demoinvest-password-${demo.id}`} place="top" content='Change Invest Password' /> */}
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
                                    {liveData !== null && liveData.length === 0 ? <tr><td className='text-center' colSpan="9">No records found</td></tr> : liveData !== null && liveData.map((live) =>
                                        <tr key={live.id}>
                                            <td>{live.login}</td>
                                            <td>
                                                <div><span id={`${live.id}-val`} style={{ 'display': 'inline-block', 'verticalAlign': 'middle', 'marginRight': '8px', 'height': '14px' }} >********* </span><Link to="#" id={`${live.id}-lock`} onClick={() => checkPassword(live.id)}>
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
                                                    <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#0B0B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M16.0399 3.02001L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96001C22.3399 6.60001 22.9799 5.02001 20.9799 3.02001C18.9799 1.02001 17.3999 1.66001 16.0399 3.02001Z" stroke="#0B0B16" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M14.9102 4.15002C15.5802 6.54002 17.4502 8.41002 19.8502 9.09002" stroke="#0B0B16" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
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
                                                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#1E3150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M9 9.51001L12 6.51001L15 9.51001" stroke="#1E3150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M12 6.51001V14.51" stroke="#1E3150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51" stroke="#1E3150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    </a>
                                                    <ReactTooltip anchorId={`wallet-liveaccount-${live.id}`} place="top" content='Wallet to Account' />
                                                    <a href={null} onClick={(e)=>showModal(e,live.id,3)} id={`wallet-account-${live.id}`} className="edit-icon ml-10">
                                                    <a href={null} onClick={(e)=>showModal(e,live.id,3)} id={`wallet-account-${live.id}`} className="edit-icon ml-10">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#1E3150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M9 11.51L12 14.51L15 11.51" stroke="#1E3150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M12 14.51V6.51001" stroke="#1E3150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M6 16.51C9.89 17.81 14.11 17.81 18 16.51" stroke="#1E3150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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