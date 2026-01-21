import {Fragment, useEffect, useState} from "react";
import {Alert, Button, Col, FormControl, FormGroup, FormSelect, Row} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import Innerlayout from "../Components/Innerlayout";
import {redirectAsync, showClient} from "../store/clientslice";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import AlertMessage from "./AlertMessage";
import {PropagateLoader} from "react-spinners";

const base_url = process.env.REACT_APP_API_URL;
const STORE_WITHDRAW_API = base_url + "/v1/client/send-withdrawrequest";
const CREATE_WITHDRAW_API = base_url + "/v1/client/withdraw-paymentmethods";
const GET_CHARGE_API = base_url + "/v1/client/charge-paymentmethods";

const Newwithdraw = () => {
    var CryptoJS = require("crypto-js");

    const history = useHistory();
    const client = useSelector(showClient);
    if (client.islogin === false) {
        history.push('/login')
    }
    const [withdraw, setWithdraw] = useState(false);
    const [iserror, setIserror] = useState(null);
    const [error, setError] = useState({});
    const [alertDiv, setAlertDiv] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [balance, setBalance] = useState(null);
    const [errorMessage, setErrorMesssage] = useState(null);
    const [gatewayType, setGatewayType] = useState(null);
    const [lastPaymentMethod, setLastPaymentMethod] = useState('');
    const [gatewayName, setGatewayName] = useState(null);
    const [fieldData, setFieldData] = useState([]);
    const [checked, setChecked] = useState(null);
    let [loading, setLoading] = useState(false);
    const cryptoKey = `${client.client.id}-${client.client.email}`;
    const [value, setValue] = useState({
        'payment_gateway': ''
    });
    const initValue = {
        'payment_gateway': ''
    };
    const dispatch = useDispatch();

    // let alertDiv = '';
    // if (withdraw === true) {
    //     alertDiv = <Alert className="alert alert-success">Withdraw Request successfully</Alert>;
    // }
    // let errorDiv = '';
    // if (iserror !== null) {
    //     errorDiv = <Alert className="alert alert-danger">{iserror}</Alert>;
    // }

    const newWithdrawSubmitHandler = async (event) => {
        event.preventDefault();
        setAlertDiv(false);
        setLoading(true);
        const {amount} = event.target.elements;
        const data = {amount: amount.value, client_payment_id: lastPaymentMethod};

        try {
            const config = {
                headers: {Authorization: `Bearer ${client.token}`}
            };

            let formData = new FormData();
            formData.append("amount", data.amount);
            formData.append("client_payment_id", data.client_payment_id);
            formData.append("gateway_type", gatewayType);

            if (client.client.ib_status == true) {
                formData.append("as_ib", true);
            }
            if (gatewayType == 'Manual') {
                Object.keys(value).forEach(function (key) {
                    formData.append(key, CryptoJS.AES.encrypt(JSON.stringify(value[key]), cryptoKey).toString());
                });
            }

            await axios.post(STORE_WITHDRAW_API, formData, config).then(response => {
                if (response.data.status_code === 200) {
                    setWithdraw(true);
                    history.push('/withdrawrequest');
                } else if (response.data.status_code === 500) {
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
                setLoading(false);
            }).catch((error) => {
                if (error.response) {
                    let err = error.response.data.errors;
                    setError(err);
                    setLoading(false);
                }
            });
        } catch (error) {
            if (error.response.status == 401) {
                setLoading(false);
                dispatch(redirectAsync());

            }
        }

    };

    async function fetchData() {
        setLoading(true);

        try {
            const config = {
                headers: {Authorization: `Bearer ${client.token}`}
            };

            const data = {
                value: ''
            };

            await axios.post(CREATE_WITHDRAW_API, data, config).then(response => {
                if (response.data.status_code === 200) {
                    setPaymentMethod(response.data.data.payment_methods);
                    setBalance(response.data.data.total_balance);
                    setGatewayType(response.data.data.gateway_type);
                    if (client.client.ib_status != true) {
                        setFieldData(response.data.data.fields);
                        setValue(response.data.data.values);
                        setLastPaymentMethod(response.data.data.last_payment_method);
                    }

                } else if (response.data.status_code === 500) {
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
                setLoading(false);

            }).catch((error) => {
                if (error.response) {
                    setLoading(false);
                    let err = error.response.data.errors;
                    setError(err);
                }
            });
        } catch (error) {
            if (error.response.status == 401) {
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }

    const handleInput = (e) => {
        setValue({...value, [e.target.name]: e.target.value});
    }

    async function handlePayment(event) {
        setFieldData([]);

        try {
            setLastPaymentMethod(event.target.value);

            const config = {
                headers: {Authorization: `Bearer ${client.token}`}
            };
            let gateway_type = event.target.getAttribute('data-type');
            let gateway_name = event.target.getAttribute('data-name');
            setGatewayType(gateway_type);
            const data = {id: event.target.value, gateway_type: gateway_type, gateway_name: gateway_name};
            await axios.post(GET_CHARGE_API, data, config).then(response => {
                if (response.data.status_code === 200) {
                    setGatewayName(response.data.data.gateway_name);
                    setFieldData(response.data.data.fields);
                    setValue(response.data.data.values);
                }
            }).catch((error) => {
                if (error.response) {
                    let err = error.response.data.errors;
                    setError(err);
                }
            });
        } catch (error) {
            if (error.response.status == 401) {
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Fragment>
            <Innerlayout>
                {
                    (loading == true) ? <PropagateLoader
                            color={'#000b3e'}
                            loading={true}
                            cssOverride={{
                                textAlign: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgb(251,252,252,0.8)',
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100vh'
                            }}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        /> :
                        <div className="box-wrapper w-700">
                            <div className="card-body create-ticket p-0 bg-white">
                                <h2 className="mb-0 px-40">
                                    <Link to='/withdrawrequest'><a href="#" class="back-arrow">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z"
                                                fill="#0B0B16"/>
                                            <path
                                                d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z"
                                                fill="#0B0B16"/>
                                        </svg>
                                    </a></Link>
                                    Make Withdraw Request
                                </h2>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className="w-100 border-0">
                                        {alertDiv && <AlertMessage type='danger' message={errorMessage}/>}
                                        <div className='p-40'>
                                            {paymentMethod == null || paymentMethod.length == 0 ? <>You need to add
                                                payment method for withdraw money in wallet, <b><Link
                                                    to="/create/payment/method" class="">Click Here</Link></b> To Add
                                                Payment Method</> : <>
                                                <form onSubmit={newWithdrawSubmitHandler}>
                                                    <div className="mb-3">
                                                        <label style={{fontWeight: '500'}}>Total Balance</label>
                                                        <span style={{
                                                            float: 'right',
                                                            fontWeight: '500'
                                                        }}>${balance}</span>
                                                    </div>
                                                    <div className="row payment-logo ">
                                                        {paymentMethod !== null && paymentMethod.map((method, i) =>
                                                            <>
                                                                <div className="form-group col-6 col-sm-3">
                                                                    <FormControl type="radio"
                                                                                 checked={lastPaymentMethod == method.id && gatewayType == method.gateway_type ? true : ''}
                                                                                 onChange={(e) => handlePayment(e)}
                                                                                 value={method.id}
                                                                                 data-name={method.name}
                                                                                 data-type={method.gateway_type}
                                                                                 name="client_payment_id"
                                                                                 id={`${method.id}-${i}`}/>
                                                                    <label htmlFor={`${method.id}-${i}`}><img
                                                                        src={method.logo} alt=""/><p
                                                                        className='text-center mt-2 pb-2'>{method.name}</p>
                                                                    </label>
                                                                    <small
                                                                        className="text-danger">{error.client_payment_id}</small>
                                                                </div>
                                                            </>)}
                                                    </div>
                                                    <FormGroup className="mb-3">
                                                        <label>Amount</label>
                                                        <FormControl type="text" name="amount" min='1' step="0.01"
                                                                     onInput={(event) => event.target.value > 0 ? event.target.value : null}
                                                                     placeholder="Amount"/>
                                                        <small className="text-danger">{error.amount}</small>
                                                    </FormGroup>
                                                    <FormGroup className="mb-3">
                                                        <Row>
                                                            {
                                                                fieldData !== null && fieldData.map(val => (
                                                                    <Col md={6} className="mb-3">
                                                                        {val.type != 'textarea' ?
                                                                            <><label>{val.label}</label><input
                                                                                type={val.type} readOnly={true}
                                                                                className='form-control' name={val.key}
                                                                                id={val.key} value={value[val.key]}
                                                                                placeholder={val.label}
                                                                                onChange={handleInput}/></>
                                                                            : <><label>{val.label}</label><FormControl
                                                                                as="textarea" value={value[val.key]}
                                                                                readOnly={true} name={val.key}
                                                                                rows={3}/></>}
                                                                        <small
                                                                            className="text-danger">{error[val.key]}</small>
                                                                    </Col>
                                                                ))
                                                            }
                                                        </Row>
                                                    </FormGroup>
                                                    <div
                                                        className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                                        <Link to="/withdrawrequest"
                                                              className="order-5 order-sm-0">&laquo; Back</Link>
                                                        <Button type="submit"
                                                                className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Send
                                                            Request</Button>
                                                    </div>
                                                </form>
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </Innerlayout>
        </Fragment>
    );
}

export default Newwithdraw;