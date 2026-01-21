import React, { Fragment, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Innerlayout from "../Components/Innerlayout";
import axios from "axios"
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PropagateLoader from "react-spinners/PropagateLoader";
// import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Accounts = React.lazy(() => import('./Dashboardpage/Accounts'));	
const Rightsidecontent = React.lazy(() => import('./Dashboardpage/Rightsidecontent'));	
const Stats = React.lazy(() => import('./Dashboardpage/Stats'));

const base_url = process.env.REACT_APP_API_URL;
// const CLIENT_DETAILS_API = base_url+"/v1/client/get-details";
const DASHBOARD_API_URL = base_url + "/v1/dashboard";
const ADDITIONALNOTIFACTION_API_URL = base_url + "/v1/client/list-additionalnotification";



const Dashboard = () => {

    const [dasboarddata, setDashboardata] = useState(null);
    // let [loading, setLoading] = useState(false);
    let [additionalNotifications, setAdditionalNotifications] = useState(null);
    // const [show, setShow] = useState(true);
    const [activetab, setActivetab] = useState('live');
    const client = useSelector(showClient);

    const history = useHistory();
    const dispatch = useDispatch();


    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            const response = await axios.post(DASHBOARD_API_URL, bodyParameters, config)

            setDashboardata(response.data);
            // setLoading(false);
        } catch (error) {
            console.error(error);
            // setLoading(false);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    async function additionalNotification() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            const response = await axios.post(ADDITIONALNOTIFACTION_API_URL, bodyParameters, config)

            if(response.data.status_code==200){

                setAdditionalNotifications(response.data.data);
            }
        } catch (error) {
            console.error(error);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    const closeToast=(id)=>{

        let newAdditional = additionalNotifications.filter((value)=>{
            return value.id!==id;
        })

        setAdditionalNotifications(newAdditional);
    }

    const chooseForm=(e)=>{
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
        });
          
    }

    const chooseSelectedForm = (e) => {
        e.preventDefault();
        client.client.form_type == 0 ? history.push('/individualdetails') : history.push('/corporate');
    }

    const handleTabClick=(name)=>{

        setActivetab(name);
    }
    useEffect(() => {
        // setLoading(true);
        fetchData();
        additionalNotification();

        if (client.client.verify === "Not Completed") {
            setActivetab('demo');
        }
        
    }, [])

    
    if (dasboarddata === null) {
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
                {/* <div className="toast-popup">
                    {
                        (additionalNotifications!=null) && additionalNotifications.map((data, idx)=>(
                            <div>
                                <Toast onClose={()=>closeToast(data.id)} show={show} delay={15000} autohide style={{ background:'#F0DB4F', border:'0px',marginTop:'10px', width:'30%'}}>
                                <Toast onClose={()=>closeToast(data.id)} style={{border:'0px',marginTop:'10px'}}>
                                    <Toast.Header>
                                        <strong className="me-auto">Admin</strong>
                                    </Toast.Header>
                                    <Toast.Body className="Dark text-black">
                                        {data.notification_message}
                                    </Toast.Body>
                                </Toast>
                            </div>
                        ))
                    }
                </div> */}
                {

                    client.client.form_terms_validation == 'not_completed' && client.client.verify == 'Completed' && client.client.form_type == null ?
                        <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between mt-3">
                            <p className="m-sm-0 mb-2">Hello, You have to fill this form.</p>
                            <button className="btn btn-primary btn-sm" onClick={(e) => chooseForm(e)}>Click Here</button>
                        </div> :
                        client.client.form_terms_validation == 'not_completed' && client.client.verify == 'Completed' && client.client.form_type != null ?
                            <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between mt-3">
                                <p className="m-sm-0 mb-2">Hello, You have to update the {client.client.form_type == 0 ? 'Individual' : 'Corporate'} form.</p>
                                <button className="btn btn-primary btn-sm" onClick={(e) => chooseSelectedForm(e)}>Click Here</button>
                            </div> : ''

                }
                <Stats data={dasboarddata} />
                <Row>
                    <Col xl={9}>
                        {/* {
                            (dasboarddata.data.additionalDocumentCount > 0 && client.client.form_type==0) ? 
                            <div className="alert-type-box">
                                <p>You need to upload additional documents please <Link to='/accountverification'><a href={null} className="link-text">Click Here.</a></Link></p>
                            </div> : null
                        } */}
                        <Accounts  dataall={dasboarddata} activetab={activetab}/>
                    </Col>
                    <Col xl={3}>
                        <Rightsidecontent  data={dasboarddata} handleclick={handleTabClick} />
                    </Col>
                </Row>

            </Innerlayout>

        </Fragment>
    );
}

export default Dashboard;