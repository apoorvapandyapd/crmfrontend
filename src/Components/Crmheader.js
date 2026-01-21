import {logoutAsync, redirectAsync, showClient} from "../store/clientslice";
import {useSelector, useDispatch} from "react-redux";
import {Link, useHistory} from 'react-router-dom';
import {useEffect, useState} from 'react';
import Image from "react-bootstrap/Image";
import axios from "axios";
import { EditIcon, KeyIcon, SignOutIcon, TradingAccountsIcon, WarningRoundIcon } from "./icons";

import { CustomRequest } from "./RequestService";

const Crmheader = () => {

    const history = useHistory();
    const client = useSelector(showClient);
    const dispatch = useDispatch();

    const [notificationMessage, setNotificationMessage] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    function updateNotification() {

        CustomRequest('update-notification', {}, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 400) {
                }
                if (res.error.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    if(res.data.data.status_code === 200){
                    }
                    else if(res.data.status_code === 500){ 
                    }
                }
            }
        });
    }

    function fetchData() {
        if(client.token) {
            CustomRequest('header-notification', {}, client.token, (res)=> {
                if(res?.error) {
                    // console.log(res.error);
                    if (res.error.response.status === 400) {
                    }
                    if (res.error.response.status === 401) {
                        dispatch(redirectAsync());
                    }
                } else {
                    if(res.data.status_code === 200){
                        setNotificationCount(res.data.data.count);
                        setNotificationMessage(res.data.data.notification);
                    }
                    else if(res.data.status_code === 500){ 
                    }
                }
            });
        }
        
    }

    useEffect(() => {
        fetchData();
        // redirect user to verify page
        // if (client.islogin === false && client.alreadyLogin === false)
        //     history.push('/login')

    }, [history, client])


    const logoutHandler = (event) => {
        event.preventDefault();

        const data = {token: client.token};
        dispatch(logoutAsync(data));
    }

    var demoBalanceData;
    var liveBalanceData;

    if (client.client.demo_balance !== undefined) {
        demoBalanceData = client.client.demo_balance;
    } else if (client.demoBalance !== undefined) {
        demoBalanceData = client.demoBalance;
    } else {
        demoBalanceData = 0;
    }


    if (client.client.live_balance !== undefined) {
        liveBalanceData = client.client.live_balance;
    } else if (client.liveBalance !== undefined) {
        liveBalanceData = client.liveBalance;
    } else {
        liveBalanceData = 0;
    }

    var today = new Date();
    var curHr = today.getHours();
    var title;

    if (curHr < 12) {
        title = 'Good Morning';
    } else if (curHr < 18) {
        title = 'Good Afternoon';
    } else {
        title = 'Good Evening';
    }

    return (
        <div className='top-header d-flex align-items-center flex-wrap'>
            <h1>{title}, {client.client.first_name} {client.client.last_name}!</h1>
            <div className="ms-auto d-flex align-items-center flex-wrap">
                {
                    client.asIB !== true ?
                        <>
                            <div className="account-box">Demo Account<span>${demoBalanceData?.toLocaleString()}</span>
                            </div>
                            <div className="account-box">Live Account<span>${liveBalanceData?.toLocaleString()}</span>
                            </div>
                        </> : null
                }

                <div className="notification-block d-flex">
                    <Link to="#" className='notification' data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="number">{notificationCount}</span>
                        <Image src={`${process.env.PUBLIC_URL}/Images/notification.svg`} alt="Notification"/>
                    </Link>
                    <ul className="dropdown-menu">
                        {notificationMessage != null ?
                            <>
                                {
                                    notificationMessage.map((val, index) => (
                                        (index < 5) ?
                                            <li key={index}>
                                        <span className="icon">
                                                <WarningRoundIcon width="20" height="20"/>
                                        </span>
                                                <div className="content">{val.notification_message}
                                                    <span>{val.created_at}</span></div>
                                            </li> : null
                                    ))
                                }
                                <Link to={{pathname: '/all/notification'}} onClick={updateNotification}>
                                    <li>See All</li>
                                </Link></> : <><Link to={{pathname: '/all/notification'}} onClick={updateNotification}>
                                <li>See All</li>
                            </Link></>
                        }
                    </ul>
                </div>
                <div className='user-thumb'>
                    <Link to="#" className="d-block" data-bs-toggle="dropdown" aria-expanded="false">
                        <span><img src={`${process.env.PUBLIC_URL}/Images/user-thumb-arrow.svg`} alt="user"/></span>
                        <Image
                            src={(client.client.profile_photo != null) ? client.client.profile_photo : `${process.env.PUBLIC_URL}/Images/no-image.png`}
                            alt="no-image"/>
                    </Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/profile">
                            <TradingAccountsIcon width="20" height="20"/>
                            View Profile</Link></li>
                        <li><Link to="/settings">
                            <EditIcon width="20" height="20"/>
                            Edit Profile</Link></li>
                        <li><Link to="/changepassword">
                            <KeyIcon width="20" height="20"/>
                            Change Password</Link></li>
                        <hr/>
                        <li>
                            <Link to="#" onClick={logoutHandler}>
                                <SignOutIcon width="20" height="20"/>
                                Sign Out</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Crmheader;