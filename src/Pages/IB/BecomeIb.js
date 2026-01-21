import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import AlertMessage from '../AlertMessage';
import { PropagateLoader } from "react-spinners";

const base_url = process.env.REACT_APP_API_URL;
const STORE_IB = base_url + "/v1/ib/store-ib";
const CHECK_IB = base_url + "/v1/ib/check-ib";

function BecomeIb(props) {
    const history = useHistory();
    const client = useSelector(showClient);
    // const [error, setError] = useState({});
    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);
    const [ibStatus, setIbStatus] = useState(0);
    let [loading, setLoading] = useState(false);
    // const [visible, setVisible] = useState(false);

    // const referralCheck = (e) => {
    //     var checkBox = document.getElementById("referral_check");
    //     if(checkBox.checked == true) {
    //         // setVisible(true);
    //         document.getElementById('referral_code').style.display = 'block';
    //     }
    //     else{
    //         document.getElementById('referral_code').style.display = 'none';
    //     }
    // }

    const newIbSubmitHandler = async(event) => {
        event.preventDefault();
        setAlertDiv(false);
        setLoading(true);
        // setError({});
        // const { referral_code } = event.target.elements;
        // let checkBox = document.getElementById("referral_check");
        // if(checkBox.checked == true) {
        //     var checkValue = 1;
        //     var referralCode = referral_code.value;
        // }else {
        //     var checkValue = null;
        //     var referralCode = null;
        // }

        var checkValue = null;
        var referralCode = null;
        
        const data = { referral_code: referralCode,referral_check:checkValue };

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
            
            await axios.post(STORE_IB, data, config).then(response=>{
                if(response.data.status_code === 200){
                    history.push('/dashboard');
                }
                else if(response.data.status_code === 500){ 
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
                setLoading(false);
            }).catch((error)=>{
                if (error.response) {
                    console.log(error);
                    // let err = error.response.data.errors;
                    // setError(err);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                setLoading(false);
                dispatchEvent(redirectAsync());
            }
        }

    };

    async function checkIb() {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const data = {
                value: ''
            };
            
            await axios.post(CHECK_IB, data, config).then(response=>{

                if(response.data.status_code === 200){
                    setIbStatus(response.data.data);
                }
                setLoading(false);
            }).catch((error)=>{
                if (error.response) {
                    // let err = error.response.data.errors;
                    // setError(err);
                    setLoading(false);
                }
            });
            
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatchEvent(redirectAsync());
                setLoading(false);
            }
        }
    }
    useEffect(() => {
        checkIb();
    }, [])

    return (
        <div>
        <Fragment>
            <Innerlayout>
                {
                        (loading === true) ? <PropagateLoader
                            color={'#000b3e'}
                            loading={true}
                            cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                    /> : 
                    <div className="box-wrapper w-480">
                        <div className="card-body create-ticket p-0 bg-white">
                                <h2 className="mb-0 px-40">
                                        <Link to='/dashboard' className="back-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                        <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                                            </svg>
                                </Link>
                                Become IB
                                </h2>
                                <div className="d-flex flex-wrap justify-content-between">
                                <div className="w-100 border-0">
                                    {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                                    <div className='p-40'>
                                        {ibStatus === 0 ? <form  onSubmit={newIbSubmitHandler} id='paymentForm'>
                                            {/* <FormGroup className="mb-3">
                                                <Form.Check  type='checkbox' id='referral_check' name="referral_check" onClick={e=>referralCheck(e)}  label="Do you have any referral code of your parent IB ? if yes then click on checkbox?"/>
                                                <small className="text-danger">{error.referral_check}</small>
                                            </FormGroup>
                                            <FormGroup className="mb-3">
                                                   {visible && <FormControl type="text" name="referral_code"  id='referral_code' placeholder="Referral code" />} 
                                                    <small className="text-danger">{error.referral_code}</small>
                                            </FormGroup> */}
                                            <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                                <Link to="/dashboard" className="order-5 order-sm-0">&laquo; Back</Link>
                                                <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Submit</Button>
                                            </div>
                                        </form> : <div>You have already requested to become IB</div>}
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                }
            </Innerlayout>
        </Fragment>
        </div>
    );
}

export default BecomeIb;