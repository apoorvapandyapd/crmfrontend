import { Fragment, useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { alertAsync, clearError, registerAsync, showClient } from "../store/clientslice";
import { useSelector, useDispatch } from "react-redux";
import { Toast } from "react-bootstrap";
import Select from 'react-select';
import PhoneInput from "react-phone-input-2";
import CountryArr from "../Components/CountryArr";

import 'react-phone-input-2/lib/style.css';


const Signup = (props) => {

    var currentUrl = window.location.href;
    // var hasClientRefCode = false;
    // var hasIbRefCode = false;

    // if(props.type==='ib'){ 
    //     if(currentUrl.includes('ref_code')) {
    //         hasIbRefCode = true;
    //     }
    // }
    // else {
    //     if(currentUrl.includes('ref_code')) {
    //         hasClientRefCode = true;
    //     }
    // }
   
    const history = useHistory();
    const client = useSelector(showClient);
    const dispatch = useDispatch();
    const [captchastate, setcaptchastate] = useState(false);
    const [checked, setChecked] = useState(false);
    const [alertDiv, setAlertDiv] = useState(false);
    const [submitLabel, setSubmitLabel] = useState('Register');
    // const [ibRefUrl, setIbRefUrl] = useState(hasIbRefCode);
    const [clientRefUrl, setClientRefUrl] = useState(false);
    const [errorFieldMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [number, setNumber] = useState(null);





    const countries = CountryArr();
    const options = countries;

    const countryChange = (e, attrib) => {
        // const inputName = attrib.name;
        setSelectedCountry({ value: e.value, label: e.label, format: e.format });
    }

    useEffect(() => {
        if(checked===true){
            document.getElementById('referral_code').style.display = '';
        }
        else{
            document.getElementById('referral_code').style.display = "none";
        }
    },[checked])

  

    useEffect(() => {
        if (client.iserror === true && client.alertDiv===false) {
            setAlertDiv(true);
            // let  errorMessage = client.message;
            setSubmitLabel('Register');
            setLoading(false);
        }
        // redirect user to verify page
        if (client.islogin === true && client.alreadyLogin === false)
            history.push('/verify')
        // redirect authenticated user to dashboard screen
        if (client.islogin === true && client.alreadyLogin === true)
            history.push('/dashboard')
    }, [history, client])

    useEffect(() => {
        dispatch(clearError());
        if (props.type !== 'ib' && currentUrl.includes('ref_code')) {
            setClientRefUrl(true)
        }
    },[])

    function onChange(value) {
        setcaptchastate(true);
    }

    function handleClose() {
        setAlertDiv(false);
        dispatch(alertAsync(false));
    }

    const phoneChange=(value, country, e, formatVal)=>{
        setNumber(value.replace(country.dialCode, ""));
    }

    const signupSubmitHandler = (event) => {
        event.preventDefault();

        if(process.env.REACT_APP_ENV!=='local'){
            if(captchastate===false){
                setErrorMessage('Please check the reCAPTCHA.');
                setAlertDiv(true);
            }else{
                
                setLoading(true);
                setSubmitLabel('Loading...');
                const { first_name, last_name, city, email, password, referral_code } = event.target.elements;
        
                let type='';
        
                if(props.type==='ib'){
                    type='ib';
                }
                else{
                    type='client';
                }
        
                const data = { first_name: first_name.value, last_name: last_name.value, country: selectedCountry.label, city: city.value, phone_no: number, email: email.value, password: password.value, referral_code: referral_code.value, type:type, current_url:window.location.href};
        
                // dispatch(registerAsync(data));
    
                if (captchastate === true)
                    dispatch(registerAsync(data));
            }
        }
        else{
            setLoading(true);
            setSubmitLabel('Loading...');
            const { first_name, last_name, city, email, password, referral_code } = event.target.elements;
    
            let type='';
    
            if(props.type==='ib'){
                type='ib';
            }
            else{
                type='client';
            }
    
            const data = { first_name: first_name.value, last_name: last_name.value, country: selectedCountry.label, city: city.value, phone_no: number, email: email.value, password: password.value, referral_code: referral_code.value, type:type, current_url:window.location.href};
    
            dispatch(registerAsync(data));
        }
        
    };

    return (
        <Fragment>

            <div className="site-wrapper footer-fix">
                <div className="d-flex sign-form-wrapper flex-wrap">
                    <Col md={6} className='align-self-center col'>
                        <div className="img-block text-center">
                            <Image src={`${process.env.PUBLIC_URL}/Images/info-vector.png`} alt="login" fluid />
                        </div>
                    </Col>
                    <Col md={6} className="white-bg col">
                        <div className="content-box m-auto">
                            <a href="https://pmfinancials.mu/" target="_blank" className="logo" rel="noreferrer">
                                <Image src={`${process.env.PUBLIC_URL}/Images/backend-logo.png`} alt="login" fluid />
                            </a>
                            {
                                (props.type==='ib') ? 
                                <h1>Sign up as IB</h1>:
                                <h1>Sign up as client</h1>
                            }
                            {/* <h1>Sign up as client {alertDiv.toString()}</h1> */}
                            {
                                typeof(client.message)!=='string' && alertDiv && <Toast show={alertDiv} onClose={handleClose} delay={7000} className="text-white bg-danger mb-3" autohide>
                                <Toast.Body>
                                <ul>
                                    {Object.keys(client.message.error).map((error, index) => (
                                        <li className="text-white">
                                            {client.message.error[error][0]}
                                        </li>
                                    ))}
                                </ul>
                                </Toast.Body>
                                </Toast>
                            }
                            
                            <form onSubmit={signupSubmitHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" name="first_name" placeholder="First Name" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" name="last_name" placeholder="Last Name" required />
                                </Form.Group>
                                <Row className=" select-block">
                                    <Col md={6}>
                                    <Select
                                        defaultValue={selectedCountry}
                                        onChange={countryChange}
                                        options={options}
                                        isClearable={true}
                                    />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Control type="text" name="city" placeholder="City" required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* <Form.Group className="mb-3">
                                    <Form.Control type="text" name="address_1" placeholder="Address" required />
                                </Form.Group>

                                <Row className=" select-block mb-3">
                                <Col md={12}>
                                    <Form.Select name="gender" className="custom-select">
                                        <option>Male</option>
                                        <option>Female</option>
                                    </Form.Select>
                                </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Control type="date" name="dob" placeholderText={"Date of Birth"} required />
                                </Form.Group> */}

                                <Form.Group className="mb-3">
                                    <PhoneInput
                                        inputProps={{
                                            name: 'phone',
                                            required: true,
                                            min: "6",

                                        }}
                                        className="mb-3"
                                        country={selectedCountry?.value}
                                        countryCodeEditable={false}
                                        disableDropdown={true}
                                        onChange={(value, country, e, formattedValue)=>phoneChange(value,country,e,formattedValue) }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="email" name="email" placeholder="Email" required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="password" name="password" placeholder="Password" required />
                                </Form.Group>
                                {
                                    clientRefUrl === false && props.type !== 'ib' ?
                                    <div className="d-flex mb-3">
                                        <label className="mr-3">Do u have any referral code?</label>
                                        <input style={{ marginLeft:'10px' }} type="checkbox" id="referral_chk" defaultChecked={checked} onChange={() => setChecked(!checked)} />
                                    </div> : ''                                
                                }
                                {/* {
                                    ibRefUrl == false && props.type == 'ib' ?
                                    <div className="d-flex mb-3">
                                        <label className="mr-3">Do u have any referral code?</label>
                                        <input style={{ marginLeft:'10px' }} type="checkbox" id="referral_chk" defaultChecked={checked} onChange={() => setChecked(!checked)} />
                                    </div> : ''                                
                                } */}
                                
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" name="referral_code" id="referral_code" placeholder="Enter referral code" />
                                </Form.Group>
                                <div className="google-captcha">
                                    <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPCHA_KEY} onChange={onChange} />
                                    {
                                        alertDiv===true ? 
                                        <small className="text-danger">{errorFieldMessage}</small> : null
                                    }
                                </div>
                                <Button disabled={loading} type="submit">{submitLabel}</Button>
                                <div className="text-center mt-4 pt-3">Already have a account? <Link to="/login" className="link-text">Sign in</Link></div>
                                {
                                    (props.type==='ib') ? 
                                    <div className="text-center mt-1 pt-3">Want to become our client? <Link to="/signup" className="link-text">Click here</Link></div> :
                                    <div className="text-center mt-1 pt-3">Do you want to work as an IB? <Link to="/ib-signup" className="link-text">Click here</Link></div>
                                }
                            </form>
                        </div>
                        <footer>&copy; {new Date().getFullYear()} PM Financials Limited. All Right Reserved.</footer>
                    </Col>
                </div>
            </div>

        </Fragment>
    );
}

export default Signup;