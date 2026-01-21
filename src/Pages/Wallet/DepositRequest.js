import {  useEffect, useState  } from "react";
import { Button, Col, Form, FormControl, FormGroup, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { redirectAsync, showClient } from "../../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
import AlertMessage from "../AlertMessage";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { PropagateLoader } from "react-spinners";
import CountryArr from "../../Components/CountryArr";
import Select from 'react-select';
import { BackArrowIcon, FileDownloadIcon } from "../../Components/icons";
import { CustomRequest } from "../../Components/RequestService";

const base_url = process.env.REACT_APP_API_URL;
// const STORE_DEPOSIT_API = base_url + "/v1/client/send-depositrequest";
// const CREATE_DEPOSIT_API = base_url + "/v1/client/deposit-paymentmethods";
// const GET_CHARGE_API = base_url + "/v1/client/charge-paymentmethods";
const EPAY_API = base_url + "/v1/client/pay-epay";
// const DOWNLOAD_BANK_DETAILS_API = base_url + "/v1/client/broker-bankDetails";
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
            (e.which === 8) || // delete key
            (match && match["0"]) === match.input; // pattern regex isMatch - workaround for passing [0-9]* into RegExp
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

    // const [deposit, setDeposit] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentOption, setPaymentOption] = useState(null);
    // const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedMethodId, setSelectedMethodId] = useState(null);
    // const [charge, setCharge] = useState(null);
    // const [paymentAmount, setPaymentAmount] = useState(null);
    // const [proofDeposit, setProofDeposit] = useState(null);
    // const [feeAmount, setFeeAmount] = useState(null);
    // const [fixedFeeAmount, setFixedFeeAmount] = useState(null);
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

    // const [clicked, setClicked] = useState(false);
    let [loading, setLoading] = useState(false);

    const cryptoKey = `${client.client.id}-${client.client.email}`;

    const [value, setValue] = useState({
        'payment_gateway':''
    });

    // const initValue = {
    //     'payment_gateway':''
    // };

    const [error, setError] = useState({});
    const dispatch = useDispatch();

    // const handleProofPhoto=(e)=>{
    //     e.preventDefault();
    //     let files = e.target.files[0];
    //     setProofDeposit(files);
    // }
    const handleInput=(e, index)=>{
        // setValue({...value,[e.target.name]:e.target.value});
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

    const newDepositSubmitHandler = async(event) => {
        event.preventDefault();
        let timer = '';

        clearTimeout(timer);

        let data = '';
        if(gatewayName == null) {
            console.log(gatewayName);
            setAlertDiv(true);
            setErrorMesssage('Please select payment method');
            setLoading(false);

            timer = setTimeout(() => {
                setAlertDiv(false);
                setErrorMesssage('');
                setLoading(false);
            }, 15000);
        } else {

            let formData = new FormData();
            const { amount, client_payment_id, detail } = event.target.elements;
            data = { amount: amount.value, client_payment_id: client_payment_id.value, value };


            if (gatewayType === 'Manual') {
                if (parseInt(currenyWise) === 1) {
                    data = { amount: amount.value, client_payment_id: client_payment_id.value, detail: detail.value, curreny: selectedCurreny, ...value };

                    formData.append("detail", detail.value);

                    if (selectedCurreny !== null) {
                        formData.append("currency", selectedCurreny);
                    }

                    Object.keys(value).forEach(function (key) {
                        formData.append(key, value[key]);
                    });

                }
                else {
                    // setValue({ ...value, ...setFieldData });

                    data = { amount: amount.value, client_payment_id: client_payment_id.value, detail: detail.value, ...value };

                    let updatedFormData = fieldData.map((val, i) => {
                        formData.append(val.key, val.value);
                        return { key: val.key, value: val.value };
                    })

                    updatedFormData = [].concat(...updatedFormData);
                    Object.keys(fieldData).forEach(function (key) {
                        console.log(fieldData[key]);
                        formData.append(fieldData[key], fieldData[value]);
                    });
                    formData.append("detail", data.detail);
                }

            }
            else if (gatewayName === 'Epay') {
                handleEpay(data.amount, epayData['redirect_url']['value'], epayData['merchant_id']['value'], epayData['merchant_logo']['value'], data.client_payment_id, client, selectedCountry);
                setLoading(false);
                return true;
            }
            else if (gatewayName !== 'Paypal') {
                const { amount, client_payment_id, expiry_month, expiry_year, card_no, cvv } = event.target.elements;
                data = { amount: amount.value, client_payment_id: client_payment_id.value, expiry_month: expiry_month.value, expiry_year: expiry_year.value, card_no: card_no.value, cvv: cvv.value };
                formData.append("card_no", CryptoJS.AES.encrypt(JSON.stringify(data.card_no), cryptoKey).toString());
                formData.append("expiry_month", CryptoJS.AES.encrypt(JSON.stringify(data.expiry_month), cryptoKey).toString());
                formData.append("expiry_year", CryptoJS.AES.encrypt(JSON.stringify(data.expiry_year), cryptoKey).toString());
                formData.append("cvv", CryptoJS.AES.encrypt(JSON.stringify(data.cvv), cryptoKey).toString());
            }
            formData.append("currency_wise", currenyWise);
            formData.append("gateway_type", gatewayType);
            formData.append("amount", data.amount);
            formData.append("client_payment_id", data.client_payment_id);
            // formData.append("proof_deposit", proofDeposit);


            CustomRequest('send-depositrequest', formData, client.token, (res) => {
                if (res?.error) {
                    console.log(res.error);
                    setLoading(false);
                    let err = res?.error?.response.data.errors;
                    setError(err);
                    setGatewayName('');
                    if (res?.error?.response.status === 401) {
                        dispatch(redirectAsync());
                    }
                } else {
                    if (res.data.status_code === 200) {
                        // setDeposit(true);
                        // if(gatewayName != 'Paypal') {
                        //     history.push('/deposit');
                        // }
                        // else {
                        //     window.location.href = res.data.data;
                        // }
                        backFunction(event);
                        //history.push('/deposit');
                    }
                    else if (res.data.status_code === 500) {
                        setErrorMesssage(res.data.message);
                        setAlertDiv(true);
                    }
                    setLoading(false);
                    setGatewayName('');
                }
            });




            // try {

            //     const config = {
            //         headers: { Authorization: `Bearer ${client.token}` }
            //     };
            //     let formData = new FormData();
            //     const { amount,client_payment_id,detail } = event.target.elements;
            //     data = { amount: amount.value,client_payment_id: client_payment_id.value,value };


            //     if(gatewayType === 'Manual') {
            //         if(parseInt(currenyWise) === 1){
            //             data = { amount: amount.value,client_payment_id: client_payment_id.value,detail: detail.value, curreny:selectedCurreny ,...value };

            //             formData.append("detail", detail.value);

            //             if(selectedCurreny!==null){
            //                 formData.append("currency", selectedCurreny);
            //             }

            //             Object.keys(value).forEach(function(key) {
            //                 formData.append(key, value[key]);
            //             });

            //         }
            //         else{
            //             // setValue({ ...value, ...setFieldData });

            //             data = { amount: amount.value,client_payment_id: client_payment_id.value,detail: detail.value ,...value };

            //             let updatedFormData = fieldData.map((val,i)=>{
            //                 formData.append(val.key, val.value);
            //                 return { key: val.key, value: val.value };
            //             })

            //             updatedFormData = [].concat(...updatedFormData);
            //             Object.keys(fieldData).forEach(function(key) {
            //                 console.log(fieldData[key]);
            //                 formData.append(fieldData[key], fieldData[value]);
            //             });
            //             formData.append("detail", data.detail);
            //         }
                    
            //     }
            //     else if(gatewayName === 'Epay') {
            //         handleEpay(data.amount, epayData['redirect_url']['value'],epayData['merchant_id']['value'],epayData['merchant_logo']['value'],data.client_payment_id,client,selectedCountry);
            //         setLoading(false);
            //         return true;
            //     }
            //     else if(gatewayName !== 'Paypal') {
            //         const { amount,client_payment_id,expiry_month,expiry_year,card_no,cvv } = event.target.elements;
            //         data = { amount: amount.value,client_payment_id: client_payment_id.value,expiry_month: expiry_month.value,expiry_year: expiry_year.value,card_no: card_no.value,cvv: cvv.value  };    
            //         formData.append("card_no", CryptoJS.AES.encrypt(JSON.stringify(data.card_no), cryptoKey).toString());
            //         formData.append("expiry_month", CryptoJS.AES.encrypt(JSON.stringify(data.expiry_month), cryptoKey).toString());
            //         formData.append("expiry_year", CryptoJS.AES.encrypt(JSON.stringify(data.expiry_year), cryptoKey).toString());
            //         formData.append("cvv", CryptoJS.AES.encrypt(JSON.stringify(data.cvv), cryptoKey).toString());    
            //     }
            //     formData.append("currency_wise", currenyWise);
            //     formData.append("gateway_type", gatewayType);
            //     formData.append("amount", data.amount);
            //     formData.append("client_payment_id", data.client_payment_id);
            //     // formData.append("proof_deposit", proofDeposit);


                
            //     await axios.post(STORE_DEPOSIT_API, formData, config).then(response=>{
                    
            //         if(response.data.status_code === 200){
            //             // setDeposit(true);
            //             // if(gatewayName != 'Paypal') {
            //             //     history.push('/deposit');
            //             // }
            //             // else {
            //             //     window.location.href = response.data.data;
            //             // }
            //             backFunction(event);
            //             //history.push('/deposit');
            //         }
            //         else if(response.data.status_code === 500){
            //             setErrorMesssage(response.data.message);
            //             setAlertDiv(true);
            //         }
            //         setLoading(false);
            //         setGatewayName('');
            //     }).catch((error)=>{
            //         if (error.response) {
            //             console.log(error.response);
            //             setLoading(false);
            //             let err = error.response.data.errors;
            //             setError(err);
            //             setGatewayName('');

            //         }
            //     });
                
            // } catch (error) {
            //     console.error(error);
            //     if(error.response.status===401){
            //         setLoading(false);
            //         setLoading(false);
            //         dispatch(redirectAsync());
            //     }
            // }
    
        }

    };
    // function getPaymentAmount(event) {
    //     let amount = event.target.value;
    //     if(charge) {
    //         let chargeAmount = amount * charge / 100;
    //         //let finalAmount = parseFloat(amount) - parseFloat(chargeAmount) - parseFloat(fixedFeeAmount);
    //         //let calculatePaymentAmount = parseFloat(amount) * parseFloat(amount) / finalAmount;
    //        // let with2Decimals = finalAmount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    //         //let fee = with2Decimals - calculatePaymentAmount;
    //         // let confirmaa = parseFloat(amount) + chargeAmount + parseFloat(fixedFeeAmount);
    //         // let fee = confirmaa * charge / 100 + parseFloat(fixedFeeAmount);
    //         // let finalAmount = parseFloat(amount)+ fee;
    //         // let with2Decimals = parseFloat(finalAmount).toFixed(2);
    //         // setFeeAmount(fee);
    //         // setPaymentAmount(with2Decimals); 
    //         let finalAmount = parseFloat(amount) +  parseFloat(fixedFeeAmount);
    //         let finalAmounts = 1- charge / 100;
    //         let changeAmount = finalAmount/finalAmounts;
    //         let with2Decimals = parseFloat(changeAmount).toFixed(2);
    //         let fee = with2Decimals - amount;
    //         setFeeAmount(fee);
    //         // setPaymentAmount(with2Decimals); 
    //     }
    //     else {
    //         // setPaymentAmount(amount); 
    //     }
        
    // }
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
    //                 
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
    //         console.error(error);
    //         if(error.response.status==401){
    //             dispatch(redirectAsync());
    //         }
    //     }
    // }
    async function paymentChange(event) {
        let payment_id = event.value;

        const selectedMethod = paymentMethod.find(item => item.id === payment_id);
        setFieldData([]);
        document.getElementById("amount").value = "";
        // setPaymentAmount(null);

        setSelectedMethodId(payment_id);

        let gateway_type = selectedMethod.gateway_type;
        let gateway_name = selectedMethod.name;

        const data = { id: payment_id, gateway_type: gateway_type, gateway_name: gateway_name };

        CustomRequest('charge-paymentmethods', data, client.token, (res) => {
            if (res?.error) {
                console.log(res.error);
                let err = res?.error?.response.data.errors;
                setError(err);
                if (res?.error?.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {

                    // setCharge(res.data.data.domestic_charge);
                    // setFixedFeeAmount(res.data.data.fixed_charge);
                    setGatewayType(res.data.data.gateway_type);
                    setGatewayName(res.data.data.gateway_name);
                    if (gateway_name === 'Epay') {
                        setEpayData(res.data.data.epay_fields);
                    }
                    if (gateway_type === 'Manual') {
                        setFieldData(res.data.data.fields);
                        setBankData(res.data.data.bank_information);
                        setValue(res.data.data.values);
                        setCurrencyWise(res.data.data.currency_wise);

                        if (parseInt(res.data.data.currency_wise) === 1) {
                            setCurrency(res.data.data.currency);
                            setCurrencyBankData(res.data.data.bank_information);
                        }
                    }
                }
            }
        });
        

        // try {
        //     const config = {
        //         headers: { Authorization: `Bearer ${client.token}` }
        //     };

        //     let gateway_type = selectedMethod.gateway_type;
        //     let gateway_name = selectedMethod.name;

        //     // setSelectedMethod(gateway_name);

        //     const data = { id: payment_id,gateway_type:gateway_type,gateway_name:gateway_name  };
        //     await axios.post(GET_CHARGE_API, data, config).then(response=>{
                
        //         if(response.data.status_code === 200){

        //             // setCharge(response.data.data.domestic_charge);
        //             // setFixedFeeAmount(response.data.data.fixed_charge);
        //             setGatewayType(response.data.data.gateway_type);
        //             setGatewayName(response.data.data.gateway_name);
        //             if(gateway_name==='Epay'){
        //                 setEpayData(response.data.data.epay_fields);
        //             }
        //             if(gateway_type === 'Manual') {
        //                 setFieldData(response.data.data.fields);
        //                 setBankData(response.data.data.bank_information);
        //                 setValue(response.data.data.values);
        //                 setCurrencyWise(response.data.data.currency_wise);

        //                 if(parseInt(response.data.data.currency_wise) === 1){
        //                     setCurrency(response.data.data.currency);
        //                     setCurrencyBankData(response.data.data.bank_information);
        //                 }
        //             }
        //         }
        //     }).catch((error)=>{
        //         if (error.response) {
        //             let err = error.response.data.errors;
        //             setError(err);
        //         }
        //     });

        // } catch (error) {
        //     console.error(error);
        //     if(error.response.status===401){
        //         dispatch(redirectAsync());
        //     }
        // }
    }
    async function fetchData() {
        setLoading(true);

        const data = {
            value: ''
        };
        
        CustomRequest('deposit-paymentmethods', data, client.token, (res) => {
            if (res?.error) {
                console.log(res.error);
                let err = res?.error?.response.data.errors;
                setError(err);
                setLoading(false);
                if (res?.error?.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    let data = res.data.data;
                    setPaymentMethod(data);

                    let optionData = data.map(item => ({
                        value: item.id,
                        label: item.name
                        // label: '<div style="color: black;"><img src="'+item.logo+'" style="height:20px;width:auto;" />'+item.name+'</div>'
                    }));

                    setPaymentOption(optionData);
                }
                setLoading(false);
            }
        });




        // try {
        //     const config = {
        //         headers: { Authorization: `Bearer ${client.token}` }
        //     };

        //     const data = {
        //         value: ''
        //     };
            
        //     await axios.post(CREATE_DEPOSIT_API, data, config).then(response=>{
                
        //         if(response.data.status_code === 200){
        //             let data = response.data.data;
        //             setPaymentMethod(data);

        //             let optionData = data.map(item => ({
        //                 value: item.id,
        //                 label: item.name
        //                 // label: '<div style="color: black;"><img src="'+item.logo+'" style="height:20px;width:auto;" />'+item.name+'</div>'
        //             }));

        //             setPaymentOption(optionData);
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
        //     if(error.response.status===401){
        //         setLoading(false);
        //         dispatch(redirectAsync());
        //     }
        // }
    }

    const downloadBankDetails=async(e)=>{
        e.preventDefault();

        let urls = selectedMethodId + '/' + selectedCurreny;


        CustomRequest('broker-bankDetails', urls, client.token, (res) => {
            if (res?.error) {
                console.log(res.error);
                if (res.error.response.status === 400) {
                    setError(res.error.response.data.errors);
                }
                if (res.error.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();// you need to remove that elelment which is created before.
            }
        });

        // try {
        //     axios({
        //         url: urls,
        //         method: 'GET',
        //         responseType: 'blob', // important
        //       }).then((response) => {
        //         const url = window.URL.createObjectURL(new Blob([response.data]));
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.setAttribute('download','bank-details.pdf'); //or any other extension
        //         document.body.appendChild(link);
        //         link.click();
        //         link.remove();// you need to remove that elelment which is created before.
        //       });
        // } catch (error) {
        //     console.error(error);
        // }
    }

    const backFunction=(e)=>{
        e.preventDefault();
        backHandler(e);
    }

    // const options = [
    //     { value: '1', label: '<b>Option 1</b>' },
    //     { value: '2', label: '<i>Option 2</i>' },
    //     { value: '3', label: '<div style="color: red;"><img src="https://demooffice.pmfinancials.mu/paymentgateway/202312201221MAU BANK.svg" style="height:20px;width:auto;" />Option 3</div>' },
    // ];
    const formatOptionLabel = ({ label }) => (
        <div dangerouslySetInnerHTML={{ __html: label }} />
    );

    useEffect(() => {
        let selectCountr = countries.find(country => country.label === client.client.country);
        setSelectedCountry(selectCountr);
        fetchData();
        
    },[])

    // useEffect(() => {
    //     if(gatewayName!=''){
    //         setErrorMesssage('');
    //         setAlertDiv(false);
    //         setGatewayName('');
    //     }
        
    // },[gatewayName])


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
                            {/* <FormGroup>
                            <Select
                                options={options}
                                isSearchable
                                formatOptionLabel={formatOptionLabel}
                            />
                            </FormGroup> */}
                            {/* <FormGroup className="mb-3">
                            <select onChange={(e)=>paymentChange(e)} className='form-control' name="client_payment_id">
                                <option value="">Select an payment method</option>
                                {paymentMethod!==null && paymentMethod.map((method,i) =>
                                <option value={method.id} data-name={method.name} data-type={method.gateway_type} >{method.name}</option>
                                )}
                            </select>
                            <small className="text-danger">{error.client_payment_id}</small>
                            </FormGroup> */}
                            
                            { (gatewayName === 'Stripe') ? <>
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
                                    {/* <div className="d-flex justify-content-between align-items-center"><p className="mt-2 font-14 mb-0">Total payable amount : ${paymentAmount} </p>
                                    
                                    <svg xmlns="http://www.w3.org/2000/svg" id="info" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/> </svg></div>
                                    <ReactTooltip anchorId="info" place="top" content={`Processing fees ${charge}% + ${fixedFeeAmount} cent`} /> */}
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
                                    {/* <div className="d-flex justify-content-between align-items-center"><p className="mt-2 font-14 mb-0">Total payable amount : ${paymentAmount} </p>
                                    
                                    <svg xmlns="http://www.w3.org/2000/svg" id="info" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/> </svg></div>
                                    <ReactTooltip anchorId="info" place="top" content={`Processing fees ${charge}% + ${fixedFeeAmount} cent`} /> */}
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