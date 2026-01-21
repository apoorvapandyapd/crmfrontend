import { Fragment, useEffect, useState } from "react";

import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { showClient } from "../store/clientslice";
import { useSelector } from "react-redux";
// import axios from 'axios';
import { CustomRequest } from "../Components/RequestService";

// const base_url = process.env.REACT_APP_API_URL;
// const FORGOT_PASSWORD_API = base_url+"/reset-password-email";

const ForgotPassword = () => {

    const history = useHistory();
    const client = useSelector(showClient);
    // const dispatch = useDispatch();
    const [captchastate, setcaptchastate] = useState(false);
    const [value, setValue] = useState({});
    const [submitLabel, setSubmitLabel] = useState('Send Mail');
    const [error, setError] = useState({
        recaptch:null,
        email:null
    });


    useEffect(() => {
        if (client.iserror === true) {
            return;
        }

        // redirect user to verify page
        if (client.islogin === true && client.alreadyLogin === false)
            history.push('/verify')
        // redirect authenticated user to dashboard screen
        // if (client.islogin === true && client.isverify === true)
        //     history.push('/dashboard')
    }, [history, client])

    function onChange(value) {
        setcaptchastate(true);
    }

    const handleInput = (e) => {
        setValue({[e.target.name]:e.target.value});
    };

    const loginSubmitHandler = async(event) => {
        event.preventDefault();
        if (process.env.REACT_APP_ENV === 'local') {
            setSubmitLabel('Loading...');


            let data = {
                "email": value.email
            }

            CustomRequest('reset-password-email', data, (res) => {
                if (res?.error) {
                    console.log(res.error);
                    setSubmitLabel('Send Mail');
                } else {
                    if (res.data.status_code === 200) {

                        history.push('/login')
                    }
                    else if (res.data.status_code === 500) {
                        setError({ ...error, email: res.data.message });
                        setSubmitLabel('Send Mail');
                    }
                }
            });

        }
        else{
            setSubmitLabel('Loading...');
            if(captchastate===false){
                setError({...error, recaptch:'Please select ReCAPTCHA'});
            }
            else {

                let data = {
                    "email": value.email
                }

                CustomRequest('reset-password-email', data, (res) => {
                    if (res?.error) {
                        console.log(res.error);
                        setSubmitLabel('Send Mail');
                    } else {
                        if (res.data.status_code === 200) {

                            history.push('/login')
                        }
                        else if (res.data.status_code === 500) {
                            setError({ ...error, email: res.data.message });
                            setSubmitLabel('Send Mail');
                        }
                    }
                });
            }
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
                            <Link to="#" className="logo"><Image src={`${process.env.PUBLIC_URL}/Images/backend-logo.png`} alt="login" fluid /></Link>
                            <h1>Forgot Password</h1>
                            <p>Submit your registration email to restore access to your Personal Area. You will receive a link to your new password.</p>
                            <form onSubmit={loginSubmitHandler}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="email" name="email" placeholder="Email" onChange={handleInput} />
                                    <small className="text-danger">{error.email}</small>
                                </Form.Group>
                                <div className="google-captcha">
                                    <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPCHA_KEY} onChange={onChange} />
                                    <small className="text-danger">{error.recaptch}</small>
                                </div>
                                <Button type="submit">{submitLabel}</Button>
                            </form>
                            <div className="text-center mt-4 pt-2"><Link className="link-text" to='/login'>Back</Link></div>
                        </div>
                        <footer>&copy; {new Date().getFullYear()} CRM. All Right Reserved.</footer>
                    </Col>
                </div>
            </div>
        </Fragment>
    );
};

export default ForgotPassword;