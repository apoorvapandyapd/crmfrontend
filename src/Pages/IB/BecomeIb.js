import React, { Fragment, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import AlertMessage from '../AlertMessage';
import { PropagateLoader } from "react-spinners";
import { BackArrowIcon } from '../../Components/icons';

import { CustomRequest } from '../../Components/RequestService';

// const base_url = process.env.REACT_APP_API_URL;
// const STORE_IB = base_url + "/v1/ib/store-ib";
// const CHECK_IB = base_url + "/v1/ib/check-ib";

function BecomeIb(props) {
    const history = useHistory();
    const client = useSelector(showClient);
    const [error, setError] = useState({}); 
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

        CustomRequest('store-ib', data, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 400) {
                    setError(res.error.response.data.errors);
                }
                if (res.error.response.status === 401) {
                    dispatchEvent(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    if(res.data.status_code === 200){
                        history.push('/dashboard');
                    }
                    else if(res.data.status_code === 500){ 
                        setErrorMesssage(res.data.message);
                        setAlertDiv(true);
                    }
                    setLoading(false);
                }
            }
            setLoading(false);
        });
        

        // try {
        //     const config = {
        //         headers: { Authorization: `Bearer ${client.token}` }
        //     };
            
        //     await axios.post(STORE_IB, data, config).then(response=>{
        //         if(response.data.status_code === 200){
        //             history.push('/dashboard');
        //         }
        //         else if(response.data.status_code === 500){ 
        //             setErrorMesssage(response.data.message);
        //             setAlertDiv(true);
        //         }
        //         setLoading(false);
        //     }).catch((error)=>{
        //         if (error.response) {

        //             let err = error.response.data.errors;
        //             setError(err);
        //             setLoading(false);
        //         }
        //     });
        // } catch (error) {
        //     console.error(error);
        //     if (error.response.status === 401) {
        //         setLoading(false);
        //         dispatchEvent(redirectAsync());
        //     }
        // }

    };

    async function checkIb() {
        setLoading(true);

        CustomRequest('check-ib', {}, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 400) {
                    setError(res.error.response.data.errors);
                }
                if (res.error.response.status === 401) {
                    dispatchEvent(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    if(res.data.status_code === 200){
                        setIbStatus(res.data.data);
                    }
                    setLoading(false);
                }
            }
            setLoading(false);
        });
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
                                            <BackArrowIcon width="24" height="24" />
                                </Link>
                                Become IB
                                </h2>
                                <div className="d-flex flex-wrap justify-content-between">
                                <div className="w-100 border-0">
                                    {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                                    <div className='p-40'>
                                        {
                                        ibStatus === 0 ? <form  onSubmit={newIbSubmitHandler} id='paymentForm'>

                                        <div>Are you sure you want to promote this client as a IB?</div><br/>

                                           {/* <FormGroup className="mb-3">
                                                <Form.Check   label="Are you sure you want to promote this client as a IB?"/>
                                                <small className="text-danger"></small>
                                            </FormGroup> */}
                                            {/* <FormGroup className="mb-3">
                                                   {visible && <FormControl type="text" name="referral_code"  id='referral_code' placeholder="Referral code" />} 
                                                    <small className="text-danger">{error.referral_code}</small>
                                            </FormGroup>  */}
                                            
                                            <div className="d-flex justify-content-between justify-content-sm-between align-items-center flex-wrap">
                                                <Link to="/dashboard" className="order-5 order-sm-0">&laquo; Back</Link>
                                                <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Submit</Button>
                                            </div>
                                        </form> : <div>You have already requested to become IB</div>
                                        }
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