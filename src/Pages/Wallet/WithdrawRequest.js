import { useEffect, useState } from "react";
import { Button, Col, FormControl, FormGroup, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { redirectAsync, showClient } from "../../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AlertMessage from "../AlertMessage";
import { PropagateLoader } from "react-spinners";
import Select from 'react-select';
import { BackArrowIcon } from "../../Components/icons";
const base_url = process.env.REACT_APP_API_URL;
const STORE_WITHDRAW_API = base_url + "/v1/client/send-withdrawrequest";
const CREATE_WITHDRAW_API = base_url + "/v1/client/withdraw-paymentmethods";
const GET_CHARGE_API = base_url + "/v1/client/charge-paymentmethods";

const WithdrawRequest = ({checkHistory, backHandler}) => {
    
    const history = useHistory();
    const client = useSelector(showClient);
    if (client.islogin === false)
    {

        history.push('/login')
    }
    
    const [error, setError] = useState({});
    const [alertDiv, setAlertDiv] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentOption, setPaymentOption] = useState(null);
    const [errorMessage, setErrorMesssage] = useState(null);
    const [gatewayType, setGatewayType] = useState(null);
    const [lastPaymentMethod, setLastPaymentMethod] = useState('');
    const [fieldData, setFieldData] = useState([]);
    let [loading, setLoading] = useState(false);
    const [currenyWise, setCurrencyWise] = useState(null);
    const [value, setValue] = useState({
        'payment_gateway':''
    });
    
    const dispatch = useDispatch();

    const newWithdrawSubmitHandler = async(event) => {
        event.preventDefault();
        setAlertDiv(false);
        setLoading(true);
        setError({});
        setErrorMesssage(null);
        const { amount } = event.target.elements;
        const data = { amount: amount.value,client_payment_id: lastPaymentMethod };

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("amount", data.amount);
            formData.append("currency_wise", currenyWise);
            formData.append("client_payment_id", data.client_payment_id ?? '');
            formData.append("gateway_type", gatewayType ?? '');

            if (client.client.ib_status === true) {
                formData.append("as_ib",true);
            }
            if (gatewayType === 'Manual') {
                Object.keys(value).forEach(function(key) {
                    formData.append(key, value[key]);
                });
            }
            
            await axios.post(STORE_WITHDRAW_API, formData, config).then(response=>{
                if(response.data.status_code === 200){
                    backFunction(event);
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
            if (error.response.status === 401) {
                setLoading(false);
                dispatch(redirectAsync());
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

                    const transformedOptions = Object.entries(response.data.data.payment_methods).map(([status, methods]) => ({
                        label: status === 'approve' ? 'Used Payment Methods' : 'Other Payment Methods',
                        options: methods.map(({ id, name }) => ({ value: id, label: name }))
                    }));

                    setPaymentOption(transformedOptions);
                    
                    setGatewayType(response.data.data.gateway_type);
                    if (client.client.ib_status !== true) {
                        setFieldData(response.data.data.fields);
                        setValue(response.data.data.values);
                        setLastPaymentMethod(response.data.data.last_payment_method);
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
                    setLoading(false);
                    let err = error.response.data.errors;
                    setError(err);
                }
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }
    const handleInput = (e) => {
        setValue({...value,[e.target.name]:e.target.value});
    }

    async function handlePayment(event) {
        setFieldData([]);
        try {
            let payment_id = event.value;
            console.log(payment_id);
            setLastPaymentMethod(payment_id);

            let gatewayData = '';

            for (const group of Object.values(paymentMethod)) {
                const selectedGateway = group.find(obj => obj.id === payment_id);
                if (selectedGateway) {
                    gatewayData = selectedGateway;
                }
            }

            console.log(gatewayData);
    
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
            let gateway_type = gatewayData.gateway_type;
            let gateway_name = gatewayData.gateway_name;

            setGatewayType(gateway_type);

            const data = { id: payment_id, gateway_type:gateway_type,gateway_name: gateway_name, type:'withdraw'};
            await axios.post(GET_CHARGE_API, data, config).then(response=>{

                if(response.data.status_code === 200){
                    setCurrencyWise(response.data.data.currency_wise)
                    setFieldData(response.data.data.fields);
                    setValue(response.data.data.values);
                }
            }).catch((error)=>{
                if (error.response) {
                    let err = error.response.data.errors;
                    setError(err);
                }
            });

        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }        
    }

    const formatOptionLabel = ({ label }) => (
        <div dangerouslySetInnerHTML={{ __html: label }} />
    );

    const backFunction=(e)=>{
        e.preventDefault();
        backHandler(e);
    }

    useEffect(() => {
        fetchData();
    },[])

    return(
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
            <h2 className="mb-0 px-40 d-flex flex-wrap align-items-center justify-content-between">
                <span>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Back To Wallet</Tooltip>}>
                                <Link to="#" onClick={(e) => backFunction(e)} className="back-arrow">
                                    <BackArrowIcon width="24" height="24" />
                                </Link>
                            </OverlayTrigger>
                    Withdraw Request
                    </span>
                        <Link to='#' className="link-text" onClick={(e) => checkHistory('withdrawalRequest')}>Show History</Link>
                </h2>
                <div className="d-flex flex-wrap justify-content-between">
                    <div className="w-100 border-0">
                        {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                        <div className='p-40'>
                            <form onSubmit={newWithdrawSubmitHandler}>
                                <FormGroup className="mb-3">
                                    <label>Select Payment Method</label>
                                    <Select
                                        name='client_payment_id'
                                        onChange={(e)=>handlePayment(e)}
                                        options={paymentOption}
                                        isClearable={true}
                                        isSearchable
                                        formatOptionLabel={formatOptionLabel}
                                    />
                                    <small className="text-danger">{error.client_payment_id}</small>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <label>Amount</label>
                                    <FormControl type="text" name="amount" min='1' step="0.01" oninput={(event) => event.target.value > 0 ? event.target.value : null} placeholder="Amount" />
                                    <small className="text-danger">{error.amount}</small>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Row>
                                    {
                                        fieldData!==null && fieldData.map((val,i)=>(
                                            <Col md={6} className="mb-3" >
                                                {val.type !== 'textarea' ?
                                                    <><label>{val.label}</label><input type={val.type} className='form-control' name={val.key} id={val.key} value={val.value} onChange={(e) => handleInput(e, i)} readOnly={parseInt(currenyWise) === 1} /></>
                                                    : <><label>{val.label}</label><FormControl as="textarea" name={val.key} rows={3} onChange={(e) => handleInput(e, i)} value={val.value} readOnly={parseInt(currenyWise) === 1} /></>}
                                            <small className="text-danger">{error[val.key]}</small>
                                            </Col>
                                        ))
                                    }
                                    </Row>
                                </FormGroup>
                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                    <Link onClick={(e)=>backFunction(e)} className="order-5 order-sm-0">&laquo; Back</Link>
                                    <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Send Request</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawRequest;