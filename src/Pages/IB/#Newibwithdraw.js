import { Fragment, useEffect, useState  } from "react";
import { Button, FormControl, FormGroup } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Innerlayout from "../../Components/Innerlayout";
import { redirectAsync, showClient } from "../../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AlertMessage from "../AlertMessage";
import { PropagateLoader } from "react-spinners";

const base_url = process.env.REACT_APP_API_URL;
const STORE_WITHDRAW_API = base_url + "/v1/client/send-ibwithdrawrequest";
const CREATE_WITHDRAW_API = base_url + "/v1/client/withdraw-paymentmethods";
const GET_CHARGE_API = base_url + "/v1/client/charge-paymentmethods";

const Newibwithdraw = () => {
    var CryptoJS = require("crypto-js");

    const history = useHistory();
    const client = useSelector(showClient);
    if (client.islogin === false)
    {

        history.push('/login')
    }
    const [withdraw, setWithdraw] = useState(false);
    const [iserror, setIserror] = useState(null);
    const [error, setError] = useState({});
    const [alertDiv, setAlertDiv] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [balance, setBalance] = useState(null);
    const [errorMessage, setErrorMesssage] = useState(null);
    const [checked, setChecked] = useState(null);
    let [loading, setLoading] = useState(false);
    const cryptoKey = `${client.client.id}-${client.client.email}`;
    const [value, setValue] = useState({
        'payment_gateway':''
    });
    const initValue = {
        'payment_gateway':''
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

    const newWithdrawSubmitHandler = async(event) => {
        event.preventDefault();
        setAlertDiv(false);
        setLoading(true);
        const { amount } = event.target.elements;
        const data = { amount: amount.value };

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("amount", data.amount);
            //formData.append("client_payment_id", data.client_payment_id);
            //formData.append("gateway_type", gatewayType);
            formData.append("as_ib",true);
            formData.append("as_ib_withdraw",true);

            if(client.client.ib_status==true){
                formData.append("as_ib",true);
            }
            
            await axios.post(STORE_WITHDRAW_API, formData, config).then(response=>{
                if(response.data.status_code === 200){
                    setWithdraw(true);
                    history.push('/ibwithdrawrequest');
                }
                else if(response.data.status_code === 500){ 
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
                setLoading(false);

            }).catch((error)=>{
                if (error.response) {
                    console.log(error);
                    let err = error.response.data.errors;
                    setLoading(false);
                    setError(err);
                }
            });
        } catch (error) {
            console.error(error);
            if(error.response.status==401){
                dispatch(redirectAsync());
                setLoading(false);
            }
        }

    };

    async function fetchData() {
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const data = {
                value: ''
            };
            
            
            await axios.post(CREATE_WITHDRAW_API,data, config).then(response=>{
                if(response.data.status_code === 200){

                    setPaymentMethod(response.data.data.payment_methods);
                    setBalance(response.data.data.withdrawable_amount);
                    if(client.client.ib_status!=true){
                        setValue(response.data.data.values);
                        //setLastPaymentMethod(response.data.data.last_payment_method);
                    }
                    
                }
                else if(response.data.status_code === 500){ 
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
                setLoading(false);
            }).catch((error)=>{
                if (error.response) {
                    console.log(error);
                    let err = error.response.data.errors;
                    setError(err);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error(error);
            if(error.response.status==401){
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }
    const handleInput = (e) => {
        setValue({...value,[e.target.name]:e.target.value});
    }

    useEffect(() => {
        fetchData();
    },[])

    return(
        <Fragment>
            <Innerlayout>
            {
                (loading==true) ? <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
                        cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                /> :
                <div className="box-wrapper w-700">
                    <div className="card-body create-ticket p-0 bg-white">
                        <h2 className="mb-0 px-40">
                                    <Link to='/ibwithdrawrequest'><a href={null} className="back-arrow">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                            </svg>
                        </a></Link>
                        Create Commission Request
                        </h2>
                        <div className="d-flex flex-wrap justify-content-between">
                            <div className="w-100 border-0">
                                {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                                <div className='p-40'>
                                {<>
                                    <form onSubmit={newWithdrawSubmitHandler}>
                                        <div className="mb-3">
                                            <label style={{ fontWeight:'500' }}>Total Balance</label>
                                            <span style={{ float:'right',fontWeight:'500' }}>${balance}</span>
                                        </div>
                                        {/* <div className="row payment-logo ">
                                            {paymentMethod!==null && paymentMethod.map((method,i) =>
                                            <> <div className="form-group col-6 col-sm-3">
                                                <FormControl type="radio"  checked={lastPaymentMethod  == method.id && gatewayType == method.gateway_type ? true : ''} onChange={(e)=>handlePayment(e)} value={method.id} data-name={method.name} data-type={method.gateway_type} name="client_payment_id" id={`${method.id}-${i}`} />
                                                <label for={`${method.id}-${i}`}><img src={method.logo} alt=""/></label>
                                                <small className="text-danger">{error.client_payment_id}</small>
                                                </div>
                                            </> )} 
                                        </div> */}
                                        <FormGroup className="mb-3">
                                            <label>Amount</label>
                                            <FormControl type="text" name="amount" placeholder="Amount" min='1' step="0.01" oninput={(event) => event.target.value >=0 ? event.target.value : null} />
                                            <small className="text-danger">{error.amount}</small>
                                        </FormGroup>
                                        <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                            <Link to="/withdrawrequest" className="order-5 order-sm-0">&laquo; Back</Link>
                                            <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Send Request</Button>
                                        </div>
                                    </form></>}
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

export default Newibwithdraw;