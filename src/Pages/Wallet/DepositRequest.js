import {  useEffect, useState  } from "react";
import { Button, Col, Form, FormControl, FormGroup, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { redirectAsync, showClient } from "../../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AlertMessage from "../AlertMessage";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { PropagateLoader } from "react-spinners";
import CountryArr from "../../Components/CountryArr";
import Select from 'react-select';
import { BackArrowIcon, FileDownloadIcon } from "../../Components/icons";

const base_url = process.env.REACT_APP_API_URL;
const STORE_DEPOSIT_API = base_url + "/v1/client/send-depositrequest";
const CREATE_DEPOSIT_API = base_url + "/v1/client/deposit-paymentmethods";
const GET_CHARGE_API = base_url + "/v1/client/charge-paymentmethods";
const EPAY_API = base_url + "/v1/client/pay-epay";
const DOWNLOAD_BANK_DETAILS_API = base_url + "/v1/client/broker-bankDetails";
const COMPANY_TITLE = process.env.REACT_APP_TITLE;

const DepositRequest = ({checkHistory, backHandler}) => {

    const countries = CountryArr();

    
    const focusSibling = function(target, direction, callback) {
      const nextTarget = target[direction];
      nextTarget && nextTarget.focus();
      // if callback is supplied we return the sibling target which has focus
      callback && callback(nextTarget);
    }

    
    // input event only fires if there is space in the input for entry. 
    // If an input of x length has x characters, keyboard press will not fire this input event.
    function monthInput(event) {
    
      const value = event.target.value.toString();
      // adds 0 to month user input like 9 -> 09
      if (value.length === 1 && value > 1) {
          event.target.value = "0" + value;
      }
      // bounds
      if (value === "00") {
          event.target.value = "01";
      } else if (value > 12) {
          event.target.value = "12";
      }
      // if we have a filled input we jump to the year input
      2 <= event.target.value.length && focusSibling(event.target, "nextElementSibling");
      event.stopImmediatePropagation();
    }
        
    const inputMatchesPattern = function(e) {
      const { value, selectionStart, selectionEnd, pattern } = e.target;
      
      const character = String.fromCharCode(e.which);
      const proposedEntry = value.slice(0, selectionStart) + character + value.slice(selectionEnd);
        const match = proposedEntry.match(pattern);

        return e.metaKey || // cmd/ctrl
            e.which <= 0 || // arrow keys
            (e.which === 8) || // delete key
            (match && match["0"]) === match.input; // pattern regex isMatch - workaround for passing [0-9]* into RegExp
    };
    
    document.querySelectorAll('input[data-pattern-validate]').forEach(el => el.addEventListener('keypress', e => {
      if (!inputMatchesPattern(e)) {
        return e.preventDefault();
      }
    }));   
    
    const history = useHistory();
    const client = useSelector(showClient);

    if (client.islogin === false)
    {
        history.push('/login')
    }

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentOption, setPaymentOption] = useState(null);
    const [selectedMethodId, setSelectedMethodId] = useState(null);
    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);
    const [gatewayType, setGatewayType] = useState(null);
    const [gatewayName, setGatewayName] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [fieldData, setFieldData] = useState([]);
    const [bankData, setBankData] = useState([]);
    const [currencyBankData, setCurrencyBankData] = useState([]);
    const [currenyWise, setCurrencyWise] = useState(null);
    const [curreny, setCurrency] = useState(null);
    const [selectedCurreny, setSelectedCurrency] = useState(null);
    const [epayData, setEpayData] = useState([]);

    let [loading, setLoading] = useState(false);

    const [value, setValue] = useState({
        'payment_gateway':''
    });

    const [error, setError] = useState({});
    const dispatch = useDispatch();

    const handleInput=(e, index)=>{
        const newData = [...fieldData]; // Create a copy of the original array
        newData[index] = {
          ...newData[index], // Create a copy of the object at the specified index
          value: e.target.value // Update the "value" field with the new value
        };

        setFieldData(newData); // Update the state with the new array
    }

    const bankCurrencyChange=(e)=>{
        let currency = e.target.value;

        setSelectedCurrency(currency);

        const bankDatas = currencyBankData.find(item => currency in item);
        setBankData(bankDatas[currency]);
    }

    const handleEpay=(amt, redirect_url,merchant_id, logo, gateway_id,client,country)=>{
        let order_id = 'E'+new Date().valueOf()+'-'+client.client.id;
        window.merchantEpay(amt, redirect_url,client.client.id, merchant_id,'Bearer '+ client.token, logo,order_id,gateway_id,EPAY_API,client.client,country.countrycode);
    }

    const hideErrorMessages = (timer) => {
        timer = setTimeout(() => {
            setAlertDiv(false);
            setErrorMesssage('');
            setLoading(false);
        }, 15000);

        return timer;
    }
    const newDepositSubmitHandler = async(event) => {
        event.preventDefault();
        let timer = '';

        clearTimeout(timer);

        let data = '';
        if(gatewayName == null) {
            
            setAlertDiv(true);
            setErrorMesssage('Please select payment method');
            setLoading(false);

            hideErrorMessages(timer)
            return false;
        } 
        
        if(gatewayName === 'Epay' && event.target.amount.value==='') {
            setAlertDiv(true);
            if(event.target.amount.value < 0){
                setErrorMesssage('Amount should be positive number');
            }
            else{
                setErrorMesssage('Amount field is required');
            }
            setLoading(false);

            hideErrorMessages(timer)
        } 
        else{
            try {
                const config = {
                    headers: { Authorization: `Bearer ${client.token}` }
                };
                let formData = new FormData();
                const { amount,client_payment_id,detail } = event.target.elements;
                data = { amount: amount.value,client_payment_id: client_payment_id.value,value };


                if(gatewayType === 'Manual') {
                    if(parseInt(currenyWise) === 1){
                        data = { amount: amount.value,client_payment_id: client_payment_id.value,detail: detail.value, curreny:selectedCurreny ,...value };

                        formData.append("detail", detail.value);

                        if(selectedCurreny!==null){
                            formData.append("currency", selectedCurreny);
                        }

                        Object.keys(value).forEach(function(key) {
                            formData.append(key, value[key]);
                        });

                    }
                    else{
                        
                        data = { amount: amount.value,client_payment_id: client_payment_id.value,detail: detail.value ,...value };

                        let updatedFormData = fieldData.map((val,i)=>{
                            formData.append(val.key, val.value);
                            return { key: val.key, value: val.value };
                        })

                        updatedFormData = [].concat(...updatedFormData);
                        Object.keys(fieldData).forEach(function(key) {
                            console.log(fieldData[key]);
                            formData.append(fieldData[key], fieldData[value]);
                        });
                        formData.append("detail", data.detail);
                    }
                    
                }
                else if(gatewayName === 'Epay') {
                    handleEpay(data.amount, epayData['redirect_url']['value'],epayData['merchant_id']['value'],epayData['merchant_logo']['value'],data.client_payment_id,client,selectedCountry);
                    setLoading(false);
                    return true;
                }
                formData.append("currency_wise", currenyWise);
                formData.append("gateway_type", gatewayType);
                formData.append("amount", data.amount);
                formData.append("client_payment_id", data.client_payment_id);

                await axios.post(STORE_DEPOSIT_API, formData, config).then(response=>{
                    
                    if(response.data.status_code === 200){
                        backFunction(event);
                    }
                    else if(response.data.status_code === 500){
                        setErrorMesssage(response.data.message);
                        setAlertDiv(true);
                    }
                    setLoading(false);
                    setGatewayName('');
                }).catch((error)=>{
                    if (error.response) {
                        console.log(error.response);
                        setLoading(false);
                        let err = error.response.data.errors;
                        setError(err);
                        setGatewayName('');

                    }
                });
                
            } catch (error) {
                console.error(error);
                if(error.response.status===401){
                    setLoading(false);
                    setLoading(false);
                    dispatch(redirectAsync());
                }
            }
    
        }
    };
    async function paymentChange(event) {
        let payment_id = event.value;

        const selectedMethod = paymentMethod.find(item => item.id === payment_id);
        setFieldData([]);
        document.getElementById("amount").value = "";

        setSelectedMethodId(payment_id);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let gateway_type = selectedMethod.gateway_type;
            let gateway_name = selectedMethod.name;

            const data = { id: payment_id,gateway_type:gateway_type,gateway_name:gateway_name  };
            await axios.post(GET_CHARGE_API, data, config).then(response=>{
                
                if(response.data.status_code === 200){

                    setGatewayType(response.data.data.gateway_type);
                    setGatewayName(response.data.data.gateway_name);
                    if(gateway_name==='Epay'){
                        setEpayData(response.data.data.epay_fields);
                        setCurrencyWise(response.data.data.currency_wise);
                    }
                    if(gateway_type === 'Manual') {
                        setFieldData(response.data.data.fields);
                        setBankData(response.data.data.bank_information);
                        setValue(response.data.data.values);
                        setCurrencyWise(response.data.data.currency_wise);

                        if(parseInt(response.data.data.currency_wise) === 1){
                            setCurrency(response.data.data.currency);
                            setCurrencyBankData(response.data.data.bank_information);
                        }
                    }
                }
            }).catch((error)=>{
                if (error.response) {
                    let err = error.response.data.errors;
                    setError(err);
                }
            });

        } catch (error) {
            console.error(error);
            if(error.response.status===401){
                dispatch(redirectAsync());
            }
        }
    }
    async function fetchData() {
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const data = {
                value: ''
            };
            
            await axios.post(CREATE_DEPOSIT_API, data, config).then(response=>{
                
                if(response.data.status_code === 200){
                    let data = response.data.data;
                    setPaymentMethod(data);

                    let optionData = data.map(item => ({
                        value: item.id,
                        label: item.name
                    }));

                    setPaymentOption(optionData);
                }
                setLoading(false);

            }).catch((error)=>{
                if (error.response) {
                    let err = error.response.data.errors;
                    setError(err);
                    setLoading(false);
                }
            });
            
        } catch (error) {
            console.error(error);
            if(error.response.status===401){
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }

    const downloadBankDetails=async(e)=>{
        e.preventDefault();

        try {

            let urls = DOWNLOAD_BANK_DETAILS_API+'/'+selectedMethodId+'/'+selectedCurreny;

            axios({
                url: urls,
                method: 'GET',
                responseType: 'blob', // important
              }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download','bank-details.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();// you need to remove that elelment which is created before.
              });
        } catch (error) {
            console.error(error);
        }
    }

    const backFunction=(e)=>{
        e.preventDefault();
        backHandler(e);
    }

    const formatOptionLabel = ({ label }) => (
        <div dangerouslySetInnerHTML={{ __html: label }} />
    );

    useEffect(() => {
        let selectCountr = countries.find(country => country.label === client.client.country);
        setSelectedCountry(selectCountr);
        fetchData();
        
    },[])
    return (
        (loading===true) ? <PropagateLoader
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
                            Deposit Request
                </span>
                        <Link to='#' className="link-text" onClick={(e) => checkHistory('depositRequest')}>Show History</Link>
            </h2>
            <div className="d-flex flex-wrap justify-content-between">
                <div className="w-100 border-0">
                    {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                    <div className='p-40'>
                    {paymentMethod === null || paymentMethod.length===0 ? <>You need to add payment method for deposit money in wallet, <b><Link to="/create/payment/method" className="">Click Here</Link></b> To Add Payment Method</> : <>
                        <form onSubmit={newDepositSubmitHandler} id='paymentForm'>
                            
                            <FormGroup className="mb-3">
                                <label>Select Payment Method</label>
                                <Select
                                    name='client_payment_id'
                                    onChange={(e)=>paymentChange(e)}
                                    options={paymentOption}
                                    isClearable={true}
                                    isSearchable
                                    formatOptionLabel={formatOptionLabel}
                                />
                            </FormGroup>
                            { (gatewayName === 'Epay') ? <>
                            </>: '' }

                            {
                                (parseInt(currenyWise) === 1) ?
                                <>
                                <FormGroup className="mb-3">
                                    <label>Choose Currency</label>
                                    <select className="form-control select" name='currency' onChange={(e)=>bankCurrencyChange(e)}>
                                        <option>Select an option</option>
                                        {
                                            curreny.map(val=><option value={val}>{val}</option>)
                                        }
                                    </select>
                                    <small className="text-danger">{error.currency}</small>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <label>Amount</label>
                                    <FormControl type="text" name="amount" id="amount" min='1' step="0.01" oninput={(event) => event.target.value > 0 ? event.target.value : null}  placeholder="Amount" />
                                    <small className="text-danger">{error.amount}</small>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Row>
                                    {
                                        fieldData!==null && fieldData.map((val,i)=>(
                                            <Col md={6} className="mb-3" >
                                            {val.type !=='textarea' ? 
                                                <><label>{val.label}</label>
                                                <input type={val.type} className='form-control' name={val.key} id={val.key} value={val.value} placeholder={val.label} onChange={(e)=>handleInput(e,i)}  readOnly/></>
                                            : <><label>{val.label}</label><FormControl as="textarea" name={val.key} id={val.key} onChange={handleInput} value={value[val.key]} rows={3} readOnly/></> }
                                            <small className="text-danger">{error[val.key]}</small>
                                            </Col>
                                        ))
                                    }
                                    </Row>
                                </FormGroup>
                                <Form.Group className="mb-3">
                                    <label>Comment</label>
                                    <FormControl as="textarea" name='detail' placeholder='Comment' rows={3} />
                                </Form.Group>
                                </> : 
                                <>
                                    <FormGroup className="mb-3">
                                    <label>Amount</label>
                                    <FormControl type="text" name="amount" id="amount" min='1' step="0.01" oninput={(event) => event.target.value > 0 ? event.target.value : null}  placeholder="Amount" />
                                    <small className="text-danger">{error.amount}</small>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <Row>
                                    {
                                        fieldData!==null && fieldData.map((val,i)=>(
                                            <Col md={6} className="mb-3" >
                                            {val.type !=='textarea' ? 
                                                <><label>{val.label}</label>
                                                <input type={val.type} className='form-control' name={val.key} id={val.key} onChange={(e)=>handleInput(e,i)} /></>
                                            : <><label>{val.label}</label><FormControl as="textarea" name={val.key} id={val.key} onChange={(e)=>handleInput(e,i)} value={value[val.key]} rows={3} /></> }
                                            <small className="text-danger">{error[val.key]}</small>
                                            </Col>
                                        ))
                                    }
                                    </Row>
                                </FormGroup>
                                <Form.Group className="mb-3">
                                    <label>Comment</label>
                                    <FormControl as="textarea" name='detail' placeholder='Comment' rows={3} />
                                </Form.Group>
                                </>
                            }
                            
                            
                            { (gatewayType === 'Manual' && bankData.length > 0) ? <><div className="broker-bank-information">
                            <hr className="seprator-line" /><div className="row ">
                                                <h3 className="w-100 mb-3 d-flex align-items-center">{COMPANY_TITLE} Bank Details 
                                    {
                                        selectedCurreny!=null &&
                                                        <Link to="#" className="ml-3 ms-auto" id="download_details" onClick={(e) => downloadBankDetails(e)}>
                                                            <FileDownloadIcon width="20" height="20" />
                                                            <ReactTooltip anchorId='download_details' place="top" content='Download Broker Bank Details' />
                                                        </Link>
                                    }
                                    </h3>
                                    {
                                        bankData!=null && bankData.map(val=>(
                                            (val.label!=null && val.value!=='') ? 
                                            <><div className="col-md-6 mb-3">
                                                <label>{val.label}</label>
                                                <div className="form-control">{val.value}</div>
                                            </div></> : null
                                        ))
                                    }
                                </div>
                            </div></> :'' }

                            <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                <Link to="#" onClick={(e)=>backFunction(e)} className="order-5 order-sm-0">&laquo; Back</Link>
                                <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Send Request</Button>
                            </div>
                        </form></>}
                        
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default DepositRequest;