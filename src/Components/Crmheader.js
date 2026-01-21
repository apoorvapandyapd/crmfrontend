
import { logoutAsync, redirectAsync, showClient } from "../store/clientslice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Image from "react-bootstrap/Image";
import axios from "axios";
import { EditIcon, KeyIcon, SignOutIcon, TradingAccountsIcon, WarningRoundIcon } from "./icons";

const base_url = process.env.REACT_APP_API_URL;
const NOTIFICATION_API_URL = base_url + "/v1/client/header-notification";
const NOTIFICATION_UPDATE_URL = base_url + "/v1/client/update-notification";

const Crmheader = () => {

    const history = useHistory();
    const client = useSelector(showClient);
    const dispatch = useDispatch();

    // const [dataMessage,setDataMessage] = useState([]);
    const [notificationMessage,setNotificationMessage] = useState([]);
    const [notificationCount,setNotificationCount] = useState(0);

    // const token = client.token;
    // const client_id = client.client.id;

    // window.Echo = new Echo({  
    //     broadcaster: 'pusher',
    //     key: '1234567890',
    //     wsHost: '127.0.0.1',
    //     wsPort: 6001,
    //     wssport: 6001,
    //     transports: ['websocket'],
    //     enabledTransports: ['ws', 'wss'],
    //     forceTLS: false,
    //     disableStats: true,
    //     auth: {
    //         headers: {
    //             Authorization: 'Bearer ' + token
    //         }
    //     },
    //     authEndpoint: "http://localhost:8000/api/broadcasting/auth"
    //     })
    
    // window.Echo.private(`client-notification-${client_id}`).listen('.client-notification', (event) => {
    //     console.log(event);
    //     setDataMessage([...dataMessage,event.message]);
    // });

    async function updateNotification() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            await axios.post(NOTIFICATION_UPDATE_URL, bodyParameters, config).then((res)=>{
                if(res.data.status_code===200){
                    // res.data);
                    // setNotificationMessage(res.data.data.notification);
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

    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            await axios.post(NOTIFICATION_API_URL, bodyParameters, config).then((res)=>{
                if(res.data.status_code===200){

                    setNotificationCount(res.data.data.count);
                    setNotificationMessage(res.data.data.notification);
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

    useEffect(() => {
        fetchData();
        // redirect user to verify page
        if (client.islogin === false && client.alreadyLogin === false)
            history.push('/login')

    }, [history, client])


    const logoutHandler = (event) => {
        event.preventDefault();
        const data = { token: client.token };
        dispatch(logoutAsync(data));
    }

    var demoBalanceData;
    var liveBalanceData;
    
    if(client.client.demo_balance!==undefined){
        demoBalanceData = client.client.demo_balance;
    }
    else if(client.demoBalance!==undefined){
        demoBalanceData = client.demoBalance;
    }
    else{
        demoBalanceData = 0;
    }

    
    if(client.client.live_balance!==undefined){
        liveBalanceData = client.client.live_balance;
    }
    else if(client.liveBalance!==undefined){
        liveBalanceData = client.liveBalance;
    }
    else{
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
                    <><div className="account-box">Demo Account<span>${demoBalanceData}</span></div>
                    <div className="account-box">Live Account<span>${liveBalanceData}</span></div></> : null
                }
                
                <div className="notification-block d-flex">
                    <Link to="#" className='notification' data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="number">{notificationCount}</span>
                        <Image src={`${process.env.PUBLIC_URL}/Images/notification.svg`} alt="Notification" />
                    </Link>
                    <ul className="dropdown-menu">
                        { notificationMessage != null ?
                            <>   
                            {
                                notificationMessage.map((val,index)=>(
                                    (index < 5) ? 
                                        <li>
                                            <span className="icon">
                                                <WarningRoundIcon width="20" height="20" />
                                        </span>
                                        <div className="content">{val.notification_message} <span>{val.created_at}</span></div>
                                    </li> : null
                                ))
                            }
                            <Link to={{ pathname:'/all/notification' }} onClick={updateNotification}><li>See All</li></Link></>:<><Link to={{ pathname:'/all/notification' }} onClick={updateNotification}><li>See All</li></Link></>
                        }
                    </ul>
                </div>
                <div className='user-thumb'>
                    <Link to="#" className="d-block" data-bs-toggle="dropdown" aria-expanded="false">
                        <span><img src={`${process.env.PUBLIC_URL}/Images/user-thumb-arrow.svg`} alt="user" /></span>
                        <Image src={(client.client.profile_photo!=null) ? client.client.profile_photo : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt="no-image" />
                    </Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/profile">
                            <TradingAccountsIcon width="20" height="20" />
                            View Profile</Link></li>
                        <li><Link to="/settings">
                            <EditIcon width="20" height="20" />
                            Edit Profile</Link></li>
                        <li><Link to="/changepassword">
                            <KeyIcon width="20" height="20" />
                            Change Password</Link></li>
                        <hr />
                        <li>
                            <Link to="#" onClick={logoutHandler}>
                                <SignOutIcon width="20" height="20" />
                                Sign Out</Link>
                        </li>
                    </ul>
                </div>
                {/* <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="#home">CRMFX</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Text>
                            Good Morning, {client.client.first_name} {client.client.last_name}!
                        </Navbar.Text>
                        <Navbar.Collapse className="justify-content-end">

                            <NavDropdown title={client_name} id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action4">
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action5">
                                    Settings
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action6">
                                    Change Pssword
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logoutHandler} href="#action7">
                                    Sign Out
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Navbar.Collapse>
                    </Container>
                </Navbar> */}
            </div>
        </div>
    );
}

export default Crmheader;