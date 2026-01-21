import { Fragment, useEffect, useState } from "react";

import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { showClient } from "../store/clientslice";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { Alert } from "react-bootstrap";
const base_url = process.env.REACT_APP_API_URL;
const FORGOT_PASSWORD_API = base_url+"/reset-password-outer";

const ForgotPasswordOuter = (props) => {

    let { token } = useParams();

    const history = useHistory();
    const client = useSelector(showClient);
    const dispatch = useDispatch();
    const [captchastate, setcaptchastate] = useState(false);
    const [value, setValue] = useState({
        password:'',
        confirm_password:''
    });
    const [error, setError] = useState({});
    const [errorOuter, setErrorOuter] = useState(null);


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

    const handleInput = (e) => {
        setValue((prevValue) => ({
            ...prevValue,
            [e.target.name]: e.target.value,
        }));
    };

    const resetPasswordSubmit = async(event) => {
        event.preventDefault();
       
        let formData = new FormData();
        formData.append("token",token);
        formData.append("password",value.password);
        formData.append("confirm_password",value.confirm_password);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            await axios.post(FORGOT_PASSWORD_API, formData, config).then((res)=>{
                if(res.data.status_code===200){

                    history.push('/login')
                }
                else if(res.data.status_code==500){
                    setErrorOuter(res.data.message);
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data.errors);
                    setError(error.response.data.errors);
                }
            });
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    return (
        <Fragment>
            <div className="site-wrapper">
                <div className="d-flex sign-form-wrapper">
                    <Col md={6} className='align-self-center'>
                        <div className="img-block text-center">
                            <Image src={`${process.env.PUBLIC_URL}/Images/info-vector.png`} alt="login" fluid />
                        </div>
                    </Col>
                    <Col md={6} className="white-bg">
                        <div className="content-box m-auto">
                            <Link to="#" className="logo"><Image src={`${process.env.PUBLIC_URL}/Images/backend-logo.png`} alt="login" fluid /></Link>
                            <h1>Reset Password</h1>
                            {
                                (errorOuter!=null) ? 
                                <Alert variant="danger">
                                    <p>
                                        {errorOuter}
                                    </p> 
                                </Alert> : null
                            }
                            <p>Please enter a password and confirm it for the complete process. Thank you.</p>
                            <form onSubmit={resetPasswordSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="password" name="password" placeholder="password" onChange={handleInput} value={value.password} />
                                    <small className="text-danger">{error.password}</small>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleInput} value={value.confirm_password} />
                                    <small className="text-danger">{error.confirm_password}</small>
                                </Form.Group>
                                <Button type="submit">Reset Password</Button>
                            </form>
                        </div>
                    </Col>
                </div>
            </div>
        </Fragment>
    );
};

export default ForgotPasswordOuter;