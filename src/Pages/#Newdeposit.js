import { Fragment, useEffect, useState  } from "react";
import { Alert, Button, Col, Form, FormControl, FormGroup, FormSelect, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Innerlayout from "../Components/Innerlayout";
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AlertMessage from "./AlertMessage";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { PropagateLoader } from "react-spinners";
import CountryArr from "../Components/CountryArr";

const base_url = process.env.REACT_APP_API_URL;
const STORE_DEPOSIT_API = base_url + "/v1/client/send-depositrequest";
const CREATE_DEPOSIT_API = base_url + "/v1/client/deposit-paymentmethods";
const GET_CHARGE_API = base_url + "/v1/client/charge-paymentmethods";
const EPAY_API = base_url + "/v1/client/pay-epay";


const Newdeposit = () => {

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
    
    function yearInput(event) {
        // if the year is empty jump to the month input
      if (event.key === "Backspace" && event.target.selectionStart === 0) {
        focusSibling(event.target, "previousElementSibling");
        event.stopImmediatePropagation();
      }
    }
    
    const inputMatchesPattern = function(e) {
      const { value, selectionStart, selectionEnd, pattern } = e.target;
      
      const character = String.fromCharCode(e.which);
      const proposedEntry = value.slice(0, selectionStart) + character + value.slice(selectionEnd);
      const match = proposedEntry.match(pattern);
      
      return e.metaKey || // cmd/ctrl
        e.which <= 0 || // arrow keys
        e.which == 8 || // delete key
        match && match["0"] === match.input; // pattern regex isMatch - workaround for passing [0-9]* into RegExp
    };
    
    document.querySelectorAll('input[data-pattern-validate]').forEach(el => el.addEventListener('keypress', e => {
      if (!inputMatchesPattern(e)) {
        return e.preventDefault();
      }
    }));   
    var CryptoJS = require("crypto-js");

    const history = useHistory();
    const client = useSelector(showClient);

    if (client.islogin === false)
    {

        history.push('/login')
    }
    const [deposit, setDeposit] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [charge, setCharge] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(null);
    const [proofDeposit, setProofDeposit] = useState(null);
    const [feeAmount, setFeeAmount] = useState(null);
    const [fixedFeeAmount, setFixedFeeAmount] = useState(null);
    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);
    const [gatewayType, setGatewayType] = useState(null);
    const [gatewayName, setGatewayName] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [fieldData, setFieldData] = useState([]);
    const [bankData, setBankData] = useState([]);
    const [epayData, setEpayData] = useState([]);

    const [clicked, setClicked] = useState(false);
    let [loading, setLoading] = useState(false);
    const cryptoKey = `${client.client.id}-${client.client.email}`;
    const [value, setValue] = useState({
        'payment_gateway':''
    });
    const initValue = {
        'payment_gateway':''
    };

    const [error, setError] = useState({});
    const dispatch = useDispatch();

    const handleProofPhoto=(e)=>{
        e.preventDefault();
        let files = e.target.files[0];
        setProofDeposit(files);
    }
    const handleInput=(e)=>{

        setValue({...value,[e.target.name]:CryptoJS.AES.encrypt(JSON.stringify(e.target.value), cryptoKey).toString()});
    }

    const handleEpay=(amt, merchant_id, logo, gateway_id,client,country)=>{
        let order_id = 'E'+new Date().valueOf()+'-'+client.client.id;
        window.merchantEpay(amt, client.client.id, merchant_id,'Bearer '+ client.token, logo,order_id,gateway_id,EPAY_API,client.client,country.countrycode);
    }

    const newDepositSubmitHandler = async(event) => {
        event.preventDefault();
        setErrorMesssage(null);
        setAlertDiv(false);
        setLoading(true);
        let data = '';

        if(gatewayName === null) {
            setAlertDiv(true);
            setErrorMesssage('Please select payment method');
            setLoading(false);
        } else{
            try {

                const config = {
                    headers: { Authorization: `Bearer ${client.token}` }
                };
                let formData = new FormData();
                const { amount,client_payment_id,detail } = event.target.elements;
                data = { amount: amount.value,payable_amount: paymentAmount,fee_amount: feeAmount,client_payment_id: client_payment_id.value,value };

                if(gatewayType == 'Manual') {
                    data = { amount: amount.value,payable_amount: paymentAmount,fee_amount: feeAmount,client_payment_id: client_payment_id.value,detail: detail.value ,...value };
                    Object.keys(value).forEach(function(key) {
                        formData.append(key, CryptoJS.AES.encrypt(JSON.stringify(value[key]), cryptoKey).toString());
                    });
                    formData.append("detail", data.detail);
                }
                else if(gatewayName == 'Epay') {
                    handleEpay(data.amount, epayData['merchant_id']['value'],epayData['merchant_logo']['value'],data.client_payment_id,client,selectedCountry);
                    setLoading(false);
                    return true;
                }
                else if(gatewayName != 'Paypal') {
                    const { amount,client_payment_id,expiry_month,expiry_year,card_no,cvv } = event.target.elements;
                    data = { amount: amount.value,payable_amount: paymentAmount,fee_amount: feeAmount,client_payment_id: client_payment_id.value,expiry_month: expiry_month.value,expiry_year: expiry_year.value,card_no: card_no.value,cvv: cvv.value  };    
                    formData.append("card_no", CryptoJS.AES.encrypt(JSON.stringify(data.card_no), cryptoKey).toString());
                    formData.append("expiry_month", CryptoJS.AES.encrypt(JSON.stringify(data.expiry_month), cryptoKey).toString());
                    formData.append("expiry_year", CryptoJS.AES.encrypt(JSON.stringify(data.expiry_year), cryptoKey).toString());
                    formData.append("cvv", CryptoJS.AES.encrypt(JSON.stringify(data.cvv), cryptoKey).toString());    
                }
                formData.append("gateway_type", gatewayType);
                formData.append("amount", data.amount);
                formData.append("client_payment_id", data.client_payment_id);
                formData.append("payable_amount", data.payable_amount);
                formData.append("fee_amount", data.fee_amount);
                formData.append("proof_deposit", proofDeposit);
                
                await axios.post(STORE_DEPOSIT_API, formData, config).then(response=>{

                    if(response.data.status_code === 200){
                        setDeposit(true);
                        if(gatewayName != 'Paypal') {
                            history.push('/deposit');
                        }
                        else {
                            window.location.href = response.data.data;
                        }
                        //history.push('/deposit');
                    }
                    else if(response.data.status_code === 500){
                        setErrorMesssage(response.data.message);
                        setAlertDiv(true);
                    }
                    setLoading(false);
                    setGatewayName(null);
                }).catch((error)=>{
                    if (error.response) {

                        setLoading(false);
                        let err = error.response.data.errors;
                        setError(err);
                        setGatewayName(null);

                    }
                });
                
            } catch (error) {
                
                if(error.response.status==401){
                    setLoading(false);
                    setLoading(false);
                    dispatch(redirectAsync());
                }
            }
    
        }

    };
    function getPaymentAmount(event) {
        let amount = event.target.value;
        if(charge) {
            let chargeAmount = amount * charge / 100;
            //let finalAmount = parseFloat(amount) - parseFloat(chargeAmount) - parseFloat(fixedFeeAmount);
            //let calculatePaymentAmount = parseFloat(amount) * parseFloat(amount) / finalAmount;
           // let with2Decimals = finalAmount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
            //let fee = with2Decimals - calculatePaymentAmount;
            // let confirmaa = parseFloat(amount) + chargeAmount + parseFloat(fixedFeeAmount);
            // let fee = confirmaa * charge / 100 + parseFloat(fixedFeeAmount);
            // let finalAmount = parseFloat(amount)+ fee;
            // let with2Decimals = parseFloat(finalAmount).toFixed(2);
            // setFeeAmount(fee);
            // setPaymentAmount(with2Decimals); 
            let finalAmount = parseFloat(amount) +  parseFloat(fixedFeeAmount);
            let finalAmounts = 1- charge / 100;
            let changeAmount = finalAmount/finalAmounts;
            let with2Decimals = parseFloat(changeAmount).toFixed(2);
            let fee = with2Decimals - amount;
            setFeeAmount(fee);
            setPaymentAmount(with2Decimals); 
        }
        else {
            setPaymentAmount(amount); 
        }
        
    }
    // async function paymentChange(e,id) {
    //     setFieldData([]);
    //     try {

    //         const config = {
    //             headers: { Authorization: `Bearer ${client.token}` }
    //         };
    //         paymentMethod.map((method,i) => {
    //             let paymentId = `${method.id}-${i}`;
    //             let myAnchors = document.getElementById(paymentId);
    //             let childeles = myAnchors.firstChild;
    //             childeles.classList.remove("active");
    
    //         })
    //         let myAnchor = document.getElementById(id);
    //         let childele = myAnchor.firstChild;
    //         setClientPayment(id);

    //         childele.classList.add("active");

    //         let gateway_type = myAnchor.getAttribute('data-type');
    //         let gateway_name = myAnchor.getAttribute('data-name');
    //         const data = { id: id,gateway_type:gateway_type,gateway_name:gateway_name  };

    //         await axios.post(GET_CHARGE_API, data, config).then(response=>{

    //             if(response.data.status_code === 200){

    //                 setCharge(response.data.data.domestic_charge);
    //                 setFixedFeeAmount(response.data.data.fixed_charge);
    //                 setGatewayType(response.data.data.gateway_type);
    //                 setGatewayName(response.data.data.gateway_name);
    //                 if(response.data.data.gateway_type == 'Manual') {
    //                     setFieldData(response.data.data.fields);

    //                 }

    //             }
    //         }).catch((error)=>{
    //             if (error.response) {
    //                 let err = error.response.data.errors;
    //                 setError(err);
    //             }
    //         });

    //     } catch (error) {
    //         
    //         if(error.response.status==401){
    //             dispatch(redirectAsync());
    //         }
    //     }
    // }
    async function paymentChange(event) {
        setFieldData([]);
        document.getElementById("amount").value = "";
        setPaymentAmount(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
            let myAnchor = document.getElementById(event.target.value);
            let gateway_type = event.target.getAttribute('data-type');
            let gateway_name = event.target.getAttribute('data-name');

            setSelectedMethod(gateway_name);

            const data = { id: event.target.value,gateway_type:gateway_type,gateway_name:gateway_name  };
            await axios.post(GET_CHARGE_API, data, config).then(response=>{

                if(response.data.status_code === 200){

                    setCharge(response.data.data.domestic_charge);
                    setFixedFeeAmount(response.data.data.fixed_charge);
                    setGatewayType(response.data.data.gateway_type);
                    setGatewayName(response.data.data.gateway_name);
                    if(gateway_name=='Epay'){
                        setEpayData(response.data.data.epay_fields);
                    }
                    if(gateway_type == 'Manual') {
                        setFieldData(response.data.data.fields);
                        setBankData(response.data.data.bank_information);
                        setValue(response.data.data.values);
                    }
                }
            }).catch((error)=>{
                if (error.response) {
                    let err = error.response.data.errors;
                    setError(err);
                }
            });

        } catch (error) {
            
            if(error.response.status==401){
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

                    setPaymentMethod(response.data.data);
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
            
            if(error.response.status==401){
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }
    useEffect(() => {
        let selectCountr = countries.find(country => country.label == client.client.country);
        setSelectedCountry(selectCountr);
        fetchData();
    },[])

    return (
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
                        <Link to='/deposit'><a href="#" className="back-arrow">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                            </svg>
                        </a></Link>
                        Create Deposit Request
                        </h2>
                        <div className="d-flex flex-wrap justify-content-between">
                            <div className="w-100 border-0">
                                {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                                <div className='p-40'>
                                {paymentMethod == null || paymentMethod.length==0 ? <>You need to add payment method for deposit money in wallet, <b><Link to="/create/payment/method" className="">Click Here</Link></b> To Add Payment Method</> : <>
                                    <form onSubmit={newDepositSubmitHandler} id='paymentForm'>
                                        
                                        <div className="row payment-logo ">

                                         {paymentMethod!==null && paymentMethod.map((method,i) =>
                                            <>
                                             <div className="form-group col-6 col-sm-3">
                                                <FormControl type="radio" onChange={(e)=>paymentChange(e)} value={method.id} data-name={method.name} data-type={method.gateway_type} name="client_payment_id" id={`${method.id}-${i}`} />
                                                <label htmlFor={`${method.id}-${i}`}><img src={method.logo} alt=""/><p className='text-center mt-2 pb-2'>{method.name}</p></label>
                                            </div>
                                            {/* <div onClick={(e)=>paymentChange(e,`${method.id}-${i}`)} id={`${method.id}-${i}`} data-name={method.name} data-type={method.gateway_type} className="col-6 col-sm-4">
                                                <img id={`${method.id}-${i}`}  src={method.logo} alt=""/>
                                            </div> */}
                                            </> )} 
                                        </div>
                                        {/* <FormGroup className="mb-3">
                                        <select onChange={(e)=>paymentChange(e)} className='form-control' name="client_payment_id">
                                            <option value={undefined}>Select an payment method</option>
                                            {paymentMethod!==null && paymentMethod.map((method,i) =>
                                            <option value={method.id} data-name={method.name} data-type={method.gateway_type} >{method.name}</option>
                                            )}
                                        </select>
                                        <small className="text-danger">{error.client_payment_id}</small>
                                        </FormGroup> */}
                                        
                                        { (gatewayName == 'Stripe') ? <>
                                        <FormGroup className="mb-3">
                                            <label>Card No</label>
                                            <FormControl type="number" maxlength="16" onInput= {(event)=> event.target.value.length > 1 ? 
                                                event.target.value = 
                                                event.target.value.slice(0, 16)
                                                : event.target.value} name="card_no" placeholder="Card No" />
                                            <small className="text-danger">{error.card_no}</small>
                                        </FormGroup>
                                        <div className="row">
                                        <div className="col-md-7 ">
                                            <label>Expiry Date</label>
                                            <FormGroup className="exp-wrapper">
                                                <FormControl onKeyUp={(e)=>monthInput(e)} autocomplete="off" name="expiry_month" id="month" maxlength="2" pattern="[0-9]*" inputmode="numerical" placeholder="MM" type="text" data-pattern-validate />
                                                <FormControl onKeyUp={(e)=>yearInput(e)} autocomplete="off"  name="expiry_year" id="year" maxlength="2" pattern="[0-9]*" inputmode="numerical" placeholder="YY" type="text" data-pattern-validate />
                                            </FormGroup>
                                            <small className="text-danger">{error.expiry_month}</small>

                                        </div>
                                        <div className="col-md-5">
                                            <label>CVV</label>
                                            <FormGroup className="mb-3">
                                                <FormControl name="cvv" type="number" maxlength="16" onInput= {(event)=> event.target.value.length > 1 ? 
                                                event.target.value = 
                                                event.target.value.slice(0, 3)
                                                : event.target.value} placeholder="CVV" />
                                                <small className="text-danger">{error.cvv}</small>
                                            </FormGroup>
                                        </div>

                                        </div> </>: '' }

                                        { (gatewayName == 'Epay') ? <>
                                        </>: '' }
                                        
                                        <FormGroup className="mb-3">
                                            <label>Amount</label>
                                            <FormControl type="text" name="amount" id="amount" min='1' step="0.01" onInput={(event) => event.target.value > 0 ? event.target.value : null} onKeyUp={(e)=>getPaymentAmount(e)} placeholder="Amount" />
                                            <small className="text-danger">{error.amount}</small>
                                            {/* <div className="d-flex justify-content-between align-items-center"><p className="mt-2 font-14 mb-0">Total payable amount : ${paymentAmount} </p>
                                            
                                            <svg xmlns="http://www.w3.org/2000/svg" id="info" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/> </svg></div>
                                            <ReactTooltip anchorId="info" place="top" content={`Processing fees ${charge}% + ${fixedFeeAmount} cent`} /> */}
                                        </FormGroup>
                                        <FormGroup className="mb-3">
                                            <Row>
                                            {
                                                fieldData!==null && fieldData.map(val=>(
                                                    <Col md={6} className="mb-3" >
                                                    {val.type !='textarea' ? 
                                                        <><label>{val.label}</label>
                                                        <input type={val.type} className='form-control' name={val.key} id={val.key} value={value[val.key]} placeholder={val.label} onChange={handleInput} readOnly={true} /></>
                                                    : <><label>{val.label}</label><FormControl as="textarea" name={val.key} id={val.key} onChange={handleInput} value={value[val.key]} rows={3} /></> }
                                                    <small className="text-danger">{error[val.key]}</small>
                                                    </Col>
                                                ))
                                            }
                                            </Row>

                                        </FormGroup>
                                        
                                        { (gatewayType == 'Manual') ? <>
                                        <Form.Group className="mb-3">
                                            <label>Comment</label>
                                            <FormControl as="textarea" name='detail' placeholder='Comment' rows={3} />
                                        </Form.Group>
                                                        {/* <Form.Group className="mb-3">
                                            <label>Proof</label>
                                            <Form.Control type="file" name='proof_deposit' onChange={handleProofPhoto} />
                                            </Form.Group> */}
                                                    </> : ''}
                                        { (gatewayType == 'Manual' && bankData.length>0) ? <><div className="broker-bank-information">
                                        <hr className="seprator-line" /><div className="row ">
                                                <h3 className="w-100 mb-3">Broker Information</h3>
                                                {
                                                bankData.map(val=>(
                                                    <><div className="col-md-6 mb-3">
                                                    <label>{val.label}</label>
                                                    <div className="form-control">{val.value}</div>
                                                </div></>
                                                ))
                                            }
                                            </div>
                                        </div></> :'' }

                                        <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                            <Link to="/deposit" className="order-5 order-sm-0">&laquo; Back</Link>
                                            <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Send Request</Button>
                                        </div>
                                    </form></>}
                                    
                                </div>
                            </div>
                        </div>
                        <hr style={{marginBottom:0}}/>
                        {
                            selectedMethod=='Digital Currency' ?
                            <div className="p-40">
                            
                                <p><strong style={{fontWeight:'bold'}}>Disclaimer:</strong> Important Information Regarding Digitalcurrency Transactions</p>

                                <p>We would like to bring to your attention some crucial information regarding cryptocurrency transactions conducted through our platform. Please read this disclaimer carefully as it outlines the following important points:</p>
                                
                                <h3>1. Transaction Charges:</h3>
                                <p>Every cryptocurrency transaction executed through our platform will be subject to specific transaction charges. These charges may vary depending on the type of transaction and market conditions. It is essential to understand the applicable charges associated with each transaction.</p>

                                <h3>2. Processing Times:</h3>
                                <p>Please be aware that cryptocurrency transactions may experience varying processing times due to network congestion, security protocols, or other factors. The time taken to confirm and complete transactions can fluctuate. We recommend your patience and understanding in such situations, and we will make every effort to process transactions promptly.</p>

                                <h3>3. Crypto Wallet Address Accuracy:</h3>
                                <p>One of the unique characteristics of cryptocurrencies is their irreversible nature. When initiating a cryptocurrency transfer, it is paramount to double-check the recipient's wallet address. Transferring cryptocurrency to an incorrect or incompatible wallet may result in the loss of your funds. We emphasize the utmost importance of verifying the recipient's wallet address before executing any transaction.</p>

                                <h3>Liability Disclaimer:</h3>
                                <p>CRM shall not be held responsible for losses resulting from transactions to incorrect wallet addresses. Our platform provides tools and information to assist in verifying wallet addresses, but the ultimate responsibility for ensuring the accuracy of the recipient's address lies with the user. By using our services, you acknowledge and accept the risk associated with cryptocurrency transactions and agree to hold CRM harmless for any such losses.</p>

                                <p>Your use of our platform implies your acceptance of these terms and your understanding of the associated risks.</p>

                                <p>If you have any questions or require clarification on any of the points mentioned above, please do not hesitate to contact our customer support team at <a className="link-text" href="mailto:info@crm.netulr.com">info@crm.netulr.com</a>.</p>

                            </div> :
                            <div className="p-40">
                                <h3>Disclaimer</h3> 
                                <p>There will be nominal charges associated with certain types of transactions made through your accounts with CRM. These charges will help us maintain and enhance the quality of services we provide to you.</p>
                                <p>Please note that these fees will be deducted directly from your account at the time of the respective transaction. This adjustment ensures transparency and ease of payment, allowing you to continue enjoying our services seamlessly.</p>
                                <p>We understand the importance of clear and open communication, If you have any questions or require further information regarding these changes, please don't hesitate to contact our customer support team at <a className="link-text" href="mailto:info@crm.netulr.com">info@crm.netulr.com</a>.</p>
                                <p>At CRM, we remain committed to serving your financial needs with excellence. We appreciate your trust in us, and we are confident that these changes will help us provide even better services to you in the future.</p>
                            </div>
                        }
                    </div>
                    </div>
                }
            </Innerlayout>
        </Fragment>
    );
};

export default Newdeposit;