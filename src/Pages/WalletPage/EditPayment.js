import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Col, Form, FormControl, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import PropagateLoader from "react-spinners/PropagateLoader";

const base_url = process.env.REACT_APP_API_URL;
const EDIT_PAYMENT_GROUP_API = base_url + "/v1/client/edit-paymentmethod";
const UPDATE_PAYMENT_GROUP_API = base_url + "/v1/client/update-paymentmethod";

function EditPayment(props) {

    const client = useSelector(showClient);
    let location = useLocation();
    let history = useHistory();

    var paymentId = location.state.payment_id;

    const [fieldData, setFieldData] = useState([]);
    const [value, setValue] = useState({});
    let [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        'payment_method':'',
//        'payment_type':'',
    });
    const dispatch = useDispatch();

    const [error, setError] = useState({});

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                payment_gateway: paymentId
            };
            await axios.post(EDIT_PAYMENT_GROUP_API, bodyParameters, config).then(res=>{
                if (res.data.status_code === 200) {
                    setFieldData(res.data.data.list);
                    setValue(res.data.data.values);
                    setData(res.data.data);
                }
            })
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    const handleInput = (e) => {
        setValue({...value,[e.target.name]:e.target.value});
    }

    const submitPaymentGroup=async(e)=>{
        e.preventDefault();
        setLoading(true);
        const data = {...value,payment_gateway:paymentId};

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
    
            await axios.post(UPDATE_PAYMENT_GROUP_API, data, config).then((res)=>{
                if(res.data.status_code===200){

                    history.push('/list/wallet');
                }
                else if (res.data.status_code === 500) {

                }

                setLoading(false);
            }).catch((error) => {
                if (error.response) {
                    setLoading(false);
                    console.log(error.response.data.errors);
                    setError(error.response.data.errors);
                }
            });
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    },[])

    return (
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
                    <div className="box-wrapper w-700">
                        <div className="card-body create-ticket p-0 bg-white">
                            <h2  className="mb-0 px-40">
                                    <Link to='/list/wallet' className="back-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                        <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                                    </svg>
                                    </Link>
                                Edit Payment Group
                            </h2>
                            <div className='p-40'>
                            <div className="row payment-logo ">
                                {data!==null ? 
                                <>
                                    <div className="form-group col-6 col-sm-3">
                                    <FormControl type="radio" value={data.payment_method} checked data-name={data.payment_name}  name="account_group_id" id={data.payment_method} />
                                    <label htmlFor={data.payment_method}><img src={data.logo} alt=""/><p className='text-center mt-2 pb-2'>{data.payment_method}</p></label>
                                </div>
                                </> : ''} 
                             </div>
                                {/* <Form.Group className="mb-3 custom_radio">                            
                                    <input type='text' className='form-control' value={data.payment_method} readOnly/>
                                </Form.Group> */}
                                {/* <Form.Group className="">
                                    <input type='text' className='form-control' value={data.payment_type} readOnly/>
                                </Form.Group> */}
                                <form onSubmit={submitPaymentGroup} id='editPaymentForm'>
                                    <Form.Group className="mb-4">
                                    <Row>
                                                {
                                                    fieldData!==null && fieldData.map(val=>(
                                                        <Col md={6} className="mt-3" >
                                                            {val.type !== 'textarea' ? <><label>{val.label}</label>
                                                            <input type={val.type} className='form-control' name={val.key} id={val.key} value={value[val.key]} placeholder={val.label} onChange={handleInput} /></>
                                                        : <><label>{val.label}</label><FormControl as="textarea" name={val.key} value={value[val.key]}  id={val.key} onChange={handleInput} placeholder={val.label} rows={2} /></> }
                                                        <small className="text-danger">{error[val.key]}</small>
                                                        </Col>
                                                    ))
                                                }
                                                </Row>
                                    </Form.Group>
                                    <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                        <Link to="/list/wallet" className='order-5 order-sm-0'>&laquo; Back</Link>
                                        <button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                }
                </Innerlayout>
        </Fragment>
    );
}

export default EditPayment;