import { Fragment, useEffect, useState } from "react"; 

import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { alertAsync, clearError, loginAsync, showClient } from "../store/clientslice";
import { useSelector, useDispatch } from "react-redux";
import { Toast } from "react-bootstrap";
import { VisibilityIcon, VisibilityOffIcon } from "../Components/icons";

const Login = () => {

    const history = useHistory();
    const client = useSelector(showClient);
    const dispatch = useDispatch();
    const [captchastate, setcaptchastate] = useState(false);
    // const [ipaddress, setIpaddress] = useState(null);
    const [alertDiv, setAlertDiv] = useState(false);
    const [submitLabel, setSubmitLabel] = useState('Sign In');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [viewpass, setViewpass] = useState(false);



    // let myIP ='';
    // let alertDiv = '';
    // if (client.iserror === true) {
    //     alertDiv = <div className="alert alert-danger">{client.message}</div>;
    // }

    useEffect(() => {
        if (client.iserror === true && client.alertDiv === false) {
            setAlertDiv(true);
            setLoading(false);
            setSubmitLabel('Sign In');
        }
        // redirect user to verify page
        // if(client.asIB==false || client.asIB=='both'){
        if (client.islogin === true && client.alreadyLogin === false)
            history.push('/verify')
        // redirect authenticated user to dashboard screen

        if (client.islogin === true && client.alreadyLogin === true){
            if (client.asIB === true) {
                if(client.client.verify==='Completed'){
                    history.push('/ib/dashboard')
                }
                else{
                    history.push('/accountverification')
                }
            }
            else{
                history.push('/dashboard')
            }
        }
        // }
        // else{
        //     history.push('/ib/dashboard')
        // }
        // setTimeout(() => {
        //     setAlertDiv(false)
        // }, 5000);
    }, [history, client])

    useEffect(() => {
        dispatch(clearError());
    },[])

    function handleClose() {
        setAlertDiv(false);
        dispatch(alertAsync(false));
    }
    function handlePass(){
        if(viewpass === true)
        {
            setViewpass(false);
        }
        else{
            setViewpass(true);
        }
    }

    function onChange(value) {
        setcaptchastate(true);
    }

    navigator.sayswho = (function () {
        var ua = navigator.userAgent;
        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        return M;
    })();

    const loginSubmitHandler = async(event) => {
        event.preventDefault();
        let browser_version;
        let platform;
        if (process.env.REACT_APP_ENV !== 'local') {
            if (captchastate === false) {
                setErrorMessage('Please check the reCAPTCHA.');
                setAlertDiv(true);
            }
            else{
                setLoading(true);
                setSubmitLabel('Loading...');
                const { email, password } = event.target.elements;

                browser_version = navigator.sayswho;
                platform = navigator.platform;

                const data = { email: email.value, password: password.value, browser: browser_version, platform: platform};
                if (captchastate === true)
                    dispatch(loginAsync(data));
            }
        }
        else{
            setLoading(true);
            setSubmitLabel('Loading...');
            const { email, password } = event.target.elements;

            browser_version = navigator.sayswho;
            platform = navigator.platform;

            const data = { email: email.value, password: password.value, browser: browser_version, platform: platform};
            dispatch(loginAsync(data));
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
                            <a href="https://crm.netulr.com/" target="_blank" className="logo" rel="noreferrer">
                                <Image src={`${process.env.PUBLIC_URL}/Images/backend-logo.png`} alt="login" fluid />
                            </a>
                            <h1>Sign In </h1>
                            {
                                client.message !== '' && <Toast show={alertDiv} onClose={handleClose} delay={7000} className="text-white bg-danger mb-3" autohide>
                                    <Toast.Body>{client.message}</Toast.Body>
                                </Toast>
                            }
                            <form onSubmit={loginSubmitHandler}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="email" name="email" placeholder="Email" required />
                                </Form.Group>
                                <Form.Group className="mb-3 position-relative" controlId="formBasicPassword">
                                    <Form.Control type={viewpass===true ? 'text' : 'password'} name="password" placeholder="Password" required />
                                    <span className="password-icon cursor-pointer" onClick={handlePass}>{viewpass === false ?
                                        <VisibilityIcon width="16" height="16" /> : <VisibilityOffIcon width="16" height="16" />
                                    }</span>
                                </Form.Group>
                                <Link to="/forgot/password" className="d-inline-block mb-3">Forgot password?</Link>
                                <div className="google-captcha">

                                    <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPCHA_KEY} onChange={onChange} />
                                    {
                                        alertDiv===true ?
                                            <small className="text-danger">{errorMessage}</small> : null
                                    }
                                </div>

                                <Button disabled={loading} type="submit">{submitLabel}</Button>

                            </form>
                            <div className="text-center mt-4 pt-3">Are you new? <Link to="/signup" className="link-text">Sign Up</Link></div>
                            {/* <div className="text-center mt-4 pt-3">Need any help? Contact us. <a className="link-text" href={`mailto:parekhjp@gmail.com`}>Click Here</a></div> */}
                        </div>
                        <footer>&copy; {new Date().getFullYear()} CRM. All Right Reserved.</footer>
                    </Col>
                </div>
            </div>
        </Fragment>
    );
};

export default Login;