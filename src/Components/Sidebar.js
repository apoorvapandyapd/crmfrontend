
import { Link, useHistory } from 'react-router-dom';
import Image from "react-bootstrap/Image";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { redirectAsync, showClient, updateClientDataAsync } from '../store/clientslice';
import axios from "axios";
import Swal from 'sweetalert2';
import {
    DashboardIcon, AccVerificationIcon, TradingAccountsIcon,
    SupportIcon, BecomePartnerIcon, DropdownArrowDown,
    TradeHistoryIcon, WalletIcon, ReportIcon, JoinPartnerIcon, PlatformDownload
} from './icons';
const base_url = process.env.REACT_APP_API_URL;
const CLIENT_DETAILS_API = base_url+"/v1/client/get-details";
const MT_TYPE_API = base_url+"/v1/client/list-livemttype";
const CREATE_MT_ACCOUNT_API = base_url+"/v1/client/store-mtaccount";

const Sidebar = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();

    let leverage_id, group_id, plan_id;

    // const [data, setData] = useState(null);
    // const [type, setType] = useState(null);
    // const [group, setGroup] = useState(null);
    // const [leverage, setLeverage] = useState(null);
    const [disableLiveBtn, setDisableLiveBtn] = useState(false);

    const client = useSelector(showClient);
    const curmenu = window.location.pathname;

    // var current_url = window.location.href;

    var display_status;

    // var myWalletUrl = ['/list/wallet','/create/payment/method','/edit/payment/method'];
    var mtAccountUrl = ['/list/trading-accounts','/edit/account','/edit/liveaccount','/change/main-password'];
    // var depositUrl = ['/deposit','/newdeposit'];

    if (client.client.verify === 'Completed') {
        display_status=false;
    }
    else{
        display_status=true;
        // if(!current_url.includes('accountverification') && !current_url.includes('document/upload') && !current_url.includes('capture/document') && !current_url.includes('profile') && !current_url.includes('settings') && !current_url.includes('changepassword') && !current_url.includes('update/document')){
        //     history.push('/accountverification');
        // }
    }

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };

            await axios.post(CLIENT_DETAILS_API, bodyParameters, config).then(res=>{
                if (res.data.status_code === 200) {
                    dispatch(updateClientDataAsync(res.data.data,client.token,'not_update'));
                    // window.reload();
                }
            })
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    function chooseForm(){
        Swal.fire({
            title: 'Please select an account type',
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Individual Form',
            // cancelButtonClass: 'cancel-button',
            confirmButtonText: 'Corporate Form',
            // confirmButtonClass: 'submit-button confirm',
            focusCancel: true,
            focusConfirm: false,
            allowOutsideClick: false,
            customClass: {
                cancelButton: 'cancel-button',
                confirmButton: 'submit-button confirm',
            },
        }).then((result) => {
        if (result.isConfirmed) {
            history.push('/corporate');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            history.push('/individualdetails');
        } 
        else if (result.dismiss === Swal.DismissReason.close) {
            setDisableLiveBtn(false);
            history.push('/dashboard');
        } 
        });
    }

    const createLiveAccount=async(e)=>{
        setDisableLiveBtn(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                type: 0
            };

            let plan_data;

            await axios.post(MT_TYPE_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){
                    if (res.data.plan_type === 'default_group') {

                        // setType(res.data.data.type);
                        // setGroup(res.data.data.group);
                        // setLeverage(res.data.data.leverage);
                    }
                    else{

                        // setData(res.data.data);

                        plan_data = res.data.data;
                    }

                    if ((res.data.live_count < 1 && client.client.form_type != null && client.client.form_terms_validation === 'not_completed')) {
                        client.client.form_type === 0 ? history.push('/individualdetails') : history.push('/corporate')
                    }
                    else if ((res.data.live_count < 1 && res.data.individual_status === 'No') && res.data.live_count < 1 && res.data.corporate_status === 'No') {
                        chooseForm();
                    }
                    else if (res.data.live_count < 1 && (client.client.form_terms_validation === 'not_completed' || client.client.verify === 'Not Completed')) {
                        history.push('/accountverification')
                    }
                    else {
                        submitAccountPlan(plan_data);
                        // Swal.fire({
                        //     title: 'Are you sure you want to create a live account?',
                        //     showCloseButton: true,
                        //     showCancelButton: true,
                        //     showConfirmButton: true,
                        //     cancelButtonText: 'No',
                        //     confirmButtonText: 'Yes, create it!',
                        //     focusCancel: true,
                        //     focusConfirm: false,
                        //     allowOutsideClick: false,
                        //     customClass: {
                        //         cancelButton: 'cancel-button',
                        //         confirmButton: 'submit-button confirm',
                        //     },
                        // }).then((result) => {
                        //     if (result.isConfirmed) {
                        //         submitAccountPlan(plan_data);
                        //     } else if (result.dismiss === Swal.DismissReason.cancel) {
                        //         setDisableLiveBtn(false);
                        //         history.push('/dashboard');
                        //     }
                        //     else if (result.dismiss === Swal.DismissReason.close) {
                        //         setDisableLiveBtn(false);
                        //         history.push('/dashboard');
                        //     }
                        // });
                    }

                }
            })
        } catch (error) {
            console.error(error);
        }

        
    }

    async function submitAccountPlan(plan_data) {

        plan_data.map((val)=>{
            if (parseInt(val.id) === 2) {
                leverage_id = val.leverage_id;
                group_id = val.group_id;
                plan_id = 2;
            }
            return null;
        })

        let selectPlansData = {
            'account_type_id':2,
            'account_type':'live',
            'account_leverage_id':leverage_id,
            'account_group_id':group_id,
            'account_plan_id':plan_id
        }
        
        const selectedPlanData = selectPlansData;

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
    
            await axios.post(CREATE_MT_ACCOUNT_API, selectedPlanData, config).then((res)=>{
                if(res.data.status_code===200){

                    history.push('/list/trading-accounts');
                }
                else if (res.data.status_code === 500) {
                    Swal.fire({ title: '', text: res.data.message, icon: 'info' });
                }

                setDisableLiveBtn(false);

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

    useEffect(() => {
        fetchData();
    },[])

    return (
        <div className="left-menu" id='leftMenu'>
            <div className="user-details">
                <span>
                     <Image src={`${process.env.PUBLIC_URL}/Images/logo-light.png`} alt="login" fluid style={{ maxWidth:'140px',margin:'0 auto' }} />
                </span>
                <div className="user-name mt-4">
                    <span>
                        <Image src={(client.client.profile_photo!=null) ? client.client.profile_photo : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt="Logo" />
                    </span>
                    <div className="content">
                        {client.client.first_name} {client.client.last_name}<span style={{ marginTop: '4px' }}>{(client.client.join_duration === "") ? 'Joined: Today' : `Joined: ${client.client.join_duration} ago`}</span>
                        <span style={{ marginTop: '4px' }}>KYC: {Array.isArray(client.client.verify) ? client.client.verify[0] : client.client.verify}</span>
                    </div>
                </div>
                {
                    (client.asIB === false || client.asIB === 'both') ?
                    <>
                            <Link to={{ pathname: '/create/demo/account', state: { account: 'demo' } }} className="btn btn-primary btn-sm">Open Demo Account</Link>
                            
                            <button disabled={disableLiveBtn} type="button" onClick={(e)=>createLiveAccount(e)} className="btn btn-secondary btn-sm">Open Live Account</button>

                            {/* <Link to={{ pathname:'/create/live/account', state:{account:'live'} }} className="btn btn-secondary btn-sm">Open Live Account</Link> */}
                    </> : null
                }
            </div>
            {
                (client.client.ib_status === false || client.client.ib_status === 'both') ? 
                <nav className="navbar">
                    <ul className="flex-column">
                            <li><Link to="/dashboard" className={curmenu === '/dashboard' ? 'active' : ''}><DashboardIcon width={24} height={24} />Dashboard</Link></li>
                            {(client.client.form_terms_validation === 'completed' || client.client.verify === 'Completed') ? 
                            <li>
                                <Link className={ curmenu === '/accountverification' ? 'active' :''} to="/accountverification">
                                        <AccVerificationIcon width="24" height="24" />
                                    Account Verification
                                </Link>
                            </li> : ''
                        }
                        <li>
                            <Link className={ mtAccountUrl.includes(curmenu)  ? 'active' :''} to="/list/trading-accounts">
                                    <TradingAccountsIcon width="24" height="24" />
                                Trading Accounts
                            </Link>
                        </li>
                        <li>
                            <Link className={ curmenu === '/trades' ? 'active' :''} to="/trades">
                                    <TradeHistoryIcon width="24" height="24" />
                                Trade History
                            </Link>
                        </li>
                        {
                            /* <li>
                            <Link className={ curmenu === '/trade/history' ? 'active' :''} to="/trade/history" style={{ display:display_status }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill="#0B0B16" />
                                    <path d="M15.5 19.25C13.98 19.25 12.75 18.02 12.75 16.5V7.5C12.75 5.98 13.98 4.75 15.5 4.75C17.02 4.75 18.25 5.98 18.25 7.5V16.5C18.25 18.02 17.02 19.25 15.5 19.25ZM15.5 6.25C14.81 6.25 14.25 6.81 14.25 7.5V16.5C14.25 17.19 14.81 17.75 15.5 17.75C16.19 17.75 16.75 17.19 16.75 16.5V7.5C16.75 6.81 16.19 6.25 15.5 6.25Z" fill="#0B0B16" />
                                    <path d="M8.5 19.25C6.98 19.25 5.75 18.02 5.75 16.5V13C5.75 11.48 6.98 10.25 8.5 10.25C10.02 10.25 11.25 11.48 11.25 13V16.5C11.25 18.02 10.02 19.25 8.5 19.25ZM8.5 11.75C7.81 11.75 7.25 12.31 7.25 13V16.5C7.25 17.19 7.81 17.75 8.5 17.75C9.19 17.75 9.75 17.19 9.75 16.5V13C9.75 12.31 9.19 11.75 8.5 11.75Z" fill="#0B0B16" />
                                </svg>
                                Trade History
                            </Link>
                        </li> */
                            }

                            {/* <li className='dropdown' style={display_status ? { opacity: '0.7' } : {}}>
                                <Link style={display_status ? { pointerEvents: 'none' } : {}} to="#" data-bs-toggle="collapse" data-bs-target="#accountFunding" aria-expanded="true">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.74 22.75H6.26C3.77 22.75 1.75 20.73 1.75 18.24V11.51C1.75 9.02001 3.77 7 6.26 7H17.74C20.23 7 22.25 9.02001 22.25 11.51V12.95C22.25 13.36 21.91 13.7 21.5 13.7H19.48C19.13 13.7 18.81 13.83 18.58 14.07L18.57 14.08C18.29 14.35 18.16 14.72 18.19 15.1C18.25 15.76 18.88 16.29 19.6 16.29H21.5C21.91 16.29 22.25 16.63 22.25 17.04V18.23C22.25 20.73 20.23 22.75 17.74 22.75ZM6.26 8.5C4.6 8.5 3.25 9.85001 3.25 11.51V18.24C3.25 19.9 4.6 21.25 6.26 21.25H17.74C19.4 21.25 20.75 19.9 20.75 18.24V17.8H19.6C18.09 17.8 16.81 16.68 16.69 15.24C16.61 14.42 16.91 13.61 17.51 13.02C18.03 12.49 18.73 12.2 19.48 12.2H20.75V11.51C20.75 9.85001 19.4 8.5 17.74 8.5H6.26Z" fill="#0B0B16" />
                                        <path d="M2.5 13.16C2.09 13.16 1.75 12.82 1.75 12.41V7.84006C1.75 6.35006 2.69 5.00001 4.08 4.47001L12.02 1.47001C12.84 1.16001 13.75 1.27005 14.46 1.77005C15.18 2.27005 15.6 3.08005 15.6 3.95005V7.75003C15.6 8.16003 15.26 8.50003 14.85 8.50003C14.44 8.50003 14.1 8.16003 14.1 7.75003V3.95005C14.1 3.57005 13.92 3.22003 13.6 3.00003C13.28 2.78003 12.9 2.73003 12.54 2.87003L4.6 5.87003C3.79 6.18003 3.24 6.97006 3.24 7.84006V12.41C3.25 12.83 2.91 13.16 2.5 13.16Z" fill="#0B0B16" />
                                        <path d="M19.6 17.7999C18.09 17.7999 16.81 16.6799 16.69 15.2399C16.61 14.4099 16.91 13.5999 17.51 13.0099C18.02 12.4899 18.72 12.2 19.47 12.2H21.55C22.54 12.23 23.3 13.0099 23.3 13.9699V16.03C23.3 16.99 22.54 17.7699 21.58 17.7999H19.6ZM21.53 13.7H19.48C19.13 13.7 18.81 13.8299 18.58 14.0699C18.29 14.3499 18.15 14.7299 18.19 15.1099C18.25 15.7699 18.88 16.2999 19.6 16.2999H21.56C21.69 16.2999 21.81 16.18 21.81 16.03V13.9699C21.81 13.8199 21.69 13.71 21.53 13.7Z" fill="#0B0B16" />
                                        <path d="M14 12.75H7C6.59 12.75 6.25 12.41 6.25 12C6.25 11.59 6.59 11.25 7 11.25H14C14.41 11.25 14.75 11.59 14.75 12C14.75 12.41 14.41 12.75 14 12.75Z" fill="#0B0B16" />
                                    </svg>
                                    Account Funding
                                    <span className="arrow">
                                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0.646447 0.146447C0.841709 -0.0488155 1.15829 -0.0488155 1.35355 0.146447L6 4.79289L10.6464 0.146447C10.8417 -0.0488155 11.1583 -0.0488155 11.3536 0.146447C11.5488 0.341709 11.5488 0.658291 11.3536 0.853553L6.35355 5.85355C6.15829 6.04882 5.84171 6.04882 5.64645 5.85355L0.646447 0.853553C0.451184 0.658291 0.451184 0.341709 0.646447 0.146447Z" fill="#0B0B16" /></svg>
                                    </span>
                                </Link>
                                
                                <div className={`collapse ${(curmenu === '/list/wallet' || curmenu === '/deposit' || curmenu === '/withdrawrequest' || curmenu === '/transfer') ? 'show' : ''}`} id="accountFunding">
                                    <ul className="sub-menu">
                                        <li style={display_status ? { opacity: '0.7' } : {}}>
                                            <Link className={myWalletUrl.includes(curmenu) ? 'active' : ''} to="/list/wallet" style={display_status ? { pointerEvents: 'none' } : {}}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.74 22.75H6.26C3.77 22.75 1.75 20.73 1.75 18.24V11.51C1.75 9.02001 3.77 7 6.26 7H17.74C20.23 7 22.25 9.02001 22.25 11.51V12.95C22.25 13.36 21.91 13.7 21.5 13.7H19.48C19.13 13.7 18.81 13.83 18.58 14.07L18.57 14.08C18.29 14.35 18.16 14.72 18.19 15.1C18.25 15.76 18.88 16.29 19.6 16.29H21.5C21.91 16.29 22.25 16.63 22.25 17.04V18.23C22.25 20.73 20.23 22.75 17.74 22.75ZM6.26 8.5C4.6 8.5 3.25 9.85001 3.25 11.51V18.24C3.25 19.9 4.6 21.25 6.26 21.25H17.74C19.4 21.25 20.75 19.9 20.75 18.24V17.8H19.6C18.09 17.8 16.81 16.68 16.69 15.24C16.61 14.42 16.91 13.61 17.51 13.02C18.03 12.49 18.73 12.2 19.48 12.2H20.75V11.51C20.75 9.85001 19.4 8.5 17.74 8.5H6.26Z" fill="#0B0B16" />
                                                    <path d="M2.5 13.16C2.09 13.16 1.75 12.82 1.75 12.41V7.84006C1.75 6.35006 2.69 5.00001 4.08 4.47001L12.02 1.47001C12.84 1.16001 13.75 1.27005 14.46 1.77005C15.18 2.27005 15.6 3.08005 15.6 3.95005V7.75003C15.6 8.16003 15.26 8.50003 14.85 8.50003C14.44 8.50003 14.1 8.16003 14.1 7.75003V3.95005C14.1 3.57005 13.92 3.22003 13.6 3.00003C13.28 2.78003 12.9 2.73003 12.54 2.87003L4.6 5.87003C3.79 6.18003 3.24 6.97006 3.24 7.84006V12.41C3.25 12.83 2.91 13.16 2.5 13.16Z" fill="#0B0B16" />
                                                    <path d="M19.6 17.7999C18.09 17.7999 16.81 16.6799 16.69 15.2399C16.61 14.4099 16.91 13.5999 17.51 13.0099C18.02 12.4899 18.72 12.2 19.47 12.2H21.55C22.54 12.23 23.3 13.0099 23.3 13.9699V16.03C23.3 16.99 22.54 17.7699 21.58 17.7999H19.6ZM21.53 13.7H19.48C19.13 13.7 18.81 13.8299 18.58 14.0699C18.29 14.3499 18.15 14.7299 18.19 15.1099C18.25 15.7699 18.88 16.2999 19.6 16.2999H21.56C21.69 16.2999 21.81 16.18 21.81 16.03V13.9699C21.81 13.8199 21.69 13.71 21.53 13.7Z" fill="#0B0B16" />
                                                    <path d="M14 12.75H7C6.59 12.75 6.25 12.41 6.25 12C6.25 11.59 6.59 11.25 7 11.25H14C14.41 11.25 14.75 11.59 14.75 12C14.75 12.41 14.41 12.75 14 12.75Z" fill="#0B0B16" />
                                                </svg>
                                                My Wallet
                                            </Link>
                                        </li>
                                        <li style={display_status ? { opacity: '0.7' } : {}}>
                                            <Link style={display_status ? { pointerEvents: 'none' } : {}} to="/deposit" className={depositUrl.includes(curmenu) ? 'active' : ''}>
                                                Deposit
                                            </Link>
                                        </li>
                                        <li style={display_status ? { opacity: '0.7' } : {}}>
                                            <Link style={display_status ? { pointerEvents: 'none' } : {}} to="/transfer" className={curmenu === '/transfer' ? 'active' : ''}>
                                                Transfer
                                            </Link>
                                        </li>
                                        <li style={display_status ? { opacity: '0.7' } : {}}>
                                            <Link style={display_status ? { pointerEvents: 'none' } : {}} to="/withdrawrequest" className={curmenu === '/withdrawrequest' ? 'active' : ''}  >
                                                Withdrawal
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li> */}
                            <li style={display_status ? { opacity: '0.7' } : {}}>
                                <Link className={curmenu === '/mywallet' ? 'active' : ''} style={display_status ? { pointerEvents: 'none' } : {}} to="/mywallet">
                                    <WalletIcon width="24" height="24" />
                                    My Wallet
                                </Link>
                            </li>
                            <li style={display_status ? { opacity: '0.7' } : {}}>
                                <Link className={curmenu === '/report/payment' ? 'active' : ''} style={display_status ? { pointerEvents: 'none' } : {}} to="/report/payment">
                                    <ReportIcon width="24" height="24" />
                                    Reports
                                </Link>
                            </li>
                        {
                                (client.client.ib_status === 'both') ?
                            <li className='dropdown' style={display_status ? { opacity: '0.7' } : {}}>
                                        <Link to="#" className={curmenu === '/ib/dashboard' || curmenu === '/ibmywallet' || curmenu === '/ib/client' ? 'active' : ''} style={display_status ? { pointerEvents: 'none' } : {}} data-bs-toggle="collapse" data-bs-target="#join-partner" aria-expanded="true">
                                            <JoinPartnerIcon width="24" height="24" />
                                    Join Partner / IB
                                    <span className="arrow">
                                                <DropdownArrowDown width="12" height="6" />
                                    </span>
                                </Link>
                                        <div className={`collapse ${(curmenu === '/ib/dashboard' || curmenu === '/ibmywallet' || curmenu === '/ib/client') ? 'show' : ''}`} id="join-partner">
                                    <ul className="sub-menu">
                                                <li><Link to="/ib/dashboard" className={curmenu === '/ib/dashboard' || curmenu === '/ib/client' ? 'active' : ''}>IB Dashboard</Link></li>
                                        {/* <li><Link to="/newibwithdraw" className={ curmenu === '/newibwithdraw' ? 'active' :''}>IB Withdraw</Link></li> */}
                                                <li><Link to="/ibmywallet" className={curmenu === '/ibmywallet' ? 'active' : ''}>Commissions</Link></li>
                                    </ul>
                                </div>
                            </li> : <li style={display_status ? { opacity: '0.7' } : {}}>
                            <Link style={display_status ? { pointerEvents: 'none' } : {}} to="/becomeib" className={ curmenu === '/becomeib' ? 'active' :''}>
                                            <BecomePartnerIcon width="24" height="24" />
                                Become Partner
                            </Link>
                        </li>
                        }

                        <li className='dropdown'>
                                <Link to="#" className={curmenu === '/ticket' || curmenu === '/faq' || curmenu === "/create/ticket" || curmenu === '/show/ticket' ? 'active' : ''} data-bs-toggle="collapse" data-bs-target="#support" aria-expanded="true">
                                    <SupportIcon width="24" height="24" />
                                Support
                                    <span className="arrow">
                                        <DropdownArrowDown width="12" height="6" />
                                </span>
                            </Link>
                            <div className={`collapse ${(curmenu === '/ticket' || curmenu === '/show/ticket' || curmenu === '/faq' || curmenu === '/tradingsteps') ? 'show' :''}`} id="support">
                                <ul className="sub-menu">
                                    <li><Link to="/ticket" className={ (curmenu === '/ticket' || curmenu === '/show/ticket') ? 'active' :''}>Ticket</Link></li>
                                    <li><Link to="/faq" className={ curmenu === '/faq' ? 'active' :''}>FAQ</Link></li>
                                    {/* <li><Link to="/tradingsteps" className={ curmenu === '/tradingsteps' ? 'active' :''}>Trading Steps</Link></li> */}
                                </ul>
                            </div>
                        </li>
                        <li style={display_status ? {opacity: '0.7'} : {}}>
                            <Link className={curmenu === '/platform' ? 'active' : ''}
                                    style={display_status ? {pointerEvents: 'none'} : {}} to="/platform">
                                <PlatformDownload width="24" height="24" />
                                Platform
                            </Link>
                        </li>
                    </ul>
                </nav> :
                <nav className="navbar">
                    <ul className="flex-column">

                            <li style={display_status ? { opacity: '0.7' } : {}}>
                                <Link style={display_status ? { pointerEvents: 'none' } : {}} to="/ib/dashboard" className={curmenu === '/ib/dashboard' || curmenu === '/ib/client' ? 'active' : ''}>
                                    <DashboardIcon width="24" height="24" />
                                    Dashboard
                                </Link>
                            </li>

                        <li>
                            <Link className={ curmenu === '/accountverification' ? 'active' :''} to="/accountverification">
                                    <AccVerificationIcon width="24" height="24" />
                                Account Verification
                            </Link>
                            </li>

                            <li style={display_status ? { opacity: '0.7' } : {}}>
                                <Link className={curmenu === '/ibmywallet' ? 'active' : ''} style={display_status ? { pointerEvents: 'none' } : {}} to="/ibmywallet">
                                    <WalletIcon width="24" height="24" />
                                    My Wallet
                                </Link>
                            </li>

                            {/* <li className='dropdown' style={display_status ? { opacity: '0.7' } : {}}>
                                <Link style={{ display: display_status }} to="#" data-bs-toggle="collapse" data-bs-target="#accountFunding" aria-expanded="true">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.74 22.75H6.26C3.77 22.75 1.75 20.73 1.75 18.24V11.51C1.75 9.02001 3.77 7 6.26 7H17.74C20.23 7 22.25 9.02001 22.25 11.51V12.95C22.25 13.36 21.91 13.7 21.5 13.7H19.48C19.13 13.7 18.81 13.83 18.58 14.07L18.57 14.08C18.29 14.35 18.16 14.72 18.19 15.1C18.25 15.76 18.88 16.29 19.6 16.29H21.5C21.91 16.29 22.25 16.63 22.25 17.04V18.23C22.25 20.73 20.23 22.75 17.74 22.75ZM6.26 8.5C4.6 8.5 3.25 9.85001 3.25 11.51V18.24C3.25 19.9 4.6 21.25 6.26 21.25H17.74C19.4 21.25 20.75 19.9 20.75 18.24V17.8H19.6C18.09 17.8 16.81 16.68 16.69 15.24C16.61 14.42 16.91 13.61 17.51 13.02C18.03 12.49 18.73 12.2 19.48 12.2H20.75V11.51C20.75 9.85001 19.4 8.5 17.74 8.5H6.26Z" fill="#0B0B16" />
                                        <path d="M2.5 13.16C2.09 13.16 1.75 12.82 1.75 12.41V7.84006C1.75 6.35006 2.69 5.00001 4.08 4.47001L12.02 1.47001C12.84 1.16001 13.75 1.27005 14.46 1.77005C15.18 2.27005 15.6 3.08005 15.6 3.95005V7.75003C15.6 8.16003 15.26 8.50003 14.85 8.50003C14.44 8.50003 14.1 8.16003 14.1 7.75003V3.95005C14.1 3.57005 13.92 3.22003 13.6 3.00003C13.28 2.78003 12.9 2.73003 12.54 2.87003L4.6 5.87003C3.79 6.18003 3.24 6.97006 3.24 7.84006V12.41C3.25 12.83 2.91 13.16 2.5 13.16Z" fill="#0B0B16" />
                                        <path d="M19.6 17.7999C18.09 17.7999 16.81 16.6799 16.69 15.2399C16.61 14.4099 16.91 13.5999 17.51 13.0099C18.02 12.4899 18.72 12.2 19.47 12.2H21.55C22.54 12.23 23.3 13.0099 23.3 13.9699V16.03C23.3 16.99 22.54 17.7699 21.58 17.7999H19.6ZM21.53 13.7H19.48C19.13 13.7 18.81 13.8299 18.58 14.0699C18.29 14.3499 18.15 14.7299 18.19 15.1099C18.25 15.7699 18.88 16.2999 19.6 16.2999H21.56C21.69 16.2999 21.81 16.18 21.81 16.03V13.9699C21.81 13.8199 21.69 13.71 21.53 13.7Z" fill="#0B0B16" />
                                        <path d="M14 12.75H7C6.59 12.75 6.25 12.41 6.25 12C6.25 11.59 6.59 11.25 7 11.25H14C14.41 11.25 14.75 11.59 14.75 12C14.75 12.41 14.41 12.75 14 12.75Z" fill="#0B0B16" />
                                </svg>
                                    Account Funding
                                    <span className="arrow">
                                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0.646447 0.146447C0.841709 -0.0488155 1.15829 -0.0488155 1.35355 0.146447L6 4.79289L10.6464 0.146447C10.8417 -0.0488155 11.1583 -0.0488155 11.3536 0.146447C11.5488 0.341709 11.5488 0.658291 11.3536 0.853553L6.35355 5.85355C6.15829 6.04882 5.84171 6.04882 5.64645 5.85355L0.646447 0.853553C0.451184 0.658291 0.451184 0.341709 0.646447 0.146447Z" fill="#0B0B16" /></svg>
                                    </span>
                                </Link>
                                <div className={`collapse ${(curmenu === '/deposit' || curmenu === '/withdrawrequest' || curmenu === '/transfer') ? 'show' : ''}`} id="accountFunding">
                                    <ul className="sub-menu">
                                        <li style={display_status ? { opacity: '0.7' } : {}}>
                                            <Link style={display_status ? { pointerEvents: 'none' } : {}} to="/list/wallet" className={curmenu === '/ib/wallet' ? 'active' : ''}>My Wallet</Link>
                                        </li>
                                        <li style={display_status ? { opacity: '0.7' } : {}}>
                                            <Link style={display_status ? { pointerEvents: 'none' } : {}} to="/withdrawrequest" className={curmenu === '/withdrawrequest' ? 'active' : ''}>Withdrawal</Link>
                                        </li>
                                        <li style={display_status ? { opacity: '0.7' } : {}}>
                                            <Link style={display_status ? { pointerEvents: 'none' } : {}} to="/ibwithdrawrequest" className={curmenu === '/ibwithdrawrequest' ? 'active' : ''}>Commissions</Link>
                                        </li>
                                    </ul>
                                </div>
                            </li> */}

                        <li className='dropdown'>
                            <Link to="#" data-bs-toggle="collapse" data-bs-target="#support" aria-expanded="true">
                                    <SupportIcon width="24" height="24" />
                                Support
                                <span className="arrow">
                                        <DropdownArrowDown width="12" height="6" />
                                </span>
                            </Link>
                            <div className={`collapse ${(curmenu === '/ticket' || curmenu === '/show/ticket' || curmenu === '/faq') ? 'show' :''}`} id="support">
                                <ul className="sub-menu">
                                    <li><Link to="/ticket" className={ (curmenu === '/ticket' || curmenu === '/show/ticket') ? 'active' :''}>Ticket</Link></li>
                                    <li><Link to="/faq" className={ curmenu === '/faq' ? 'active' :''}>FAQ</Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            }
        </div>
    );
}

export default Sidebar;