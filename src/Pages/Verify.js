import { Fragment, useEffect } from "react";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { verifyAsync, showClient, redirectAsync, alertAsync } from "../store/clientslice";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Image, Toast } from "react-bootstrap";



const Verify = () => {

    const [loading, setLoading] = useState(false);
    const [submitLbl, setSubmitLbl] = useState('Submit');
    const [alertDiv, setAlertDiv] = useState(false);

    let history = useHistory();
    const client = useSelector(showClient);
    const dispatch = useDispatch();

    useEffect(() => {

        if (client.iserror === true && client.alertDiv === false) {
            setAlertDiv(true);
            setLoading(false);
            setSubmitLbl('Submit');
        }
        // redirect authenticated user to dashboard screen
        if (client.islogin === true && client.alreadyLogin === true)
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
    }, [history, client])

    const loginSubmitHandler = (event) => {
        event.preventDefault();
        const { code } = event.target.elements;
        const data = { verification_code: code.value, id: client.client.id };

        setAlertDiv(false);
        setLoading(true);
        setSubmitLbl('Loading...');

        dispatch(verifyAsync(data));
        
    };

    const backLogin = (event) => {
        event.preventDefault();
        dispatch(redirectAsync());
        history.push('/login')
    };

    function handleClose() {
        setAlertDiv(false);
        dispatch(alertAsync(false));
    }

    return (
        <Fragment>

            <div className="site-wrapper">
                <div className="email-verification-wrapper m-auto">
                    <Link to="#" className="logo"><Image src={`${process.env.PUBLIC_URL}/Images/backend-logo.png`} alt="login" fluid /></Link>
                    {
                        typeof(client.message)!='string' && alertDiv && <Toast style={{ width:'100%', backgroundColor:'#ffcccc' }} show={alertDiv} onClose={handleClose} delay={7000} className="text-white bg-danger mb-3" autohide>
                        <Toast.Body>
                        <ul>
                            {Object.keys(client.message.error).map((error, index) => (
                                <li className="text-white" key={index}>
                                    {client.message.error[error][0]}
                                </li>
                            ))}
                        </ul>
                        </Toast.Body>
                        </Toast>
                    }
                    <div className="email-content-box">
                        <h1>Hey {client.client.first_name} {client.client.last_name}!</h1>
                        {/* <p>This device or location seems unfamilier to us.</p> */}
                        <p>To make sure it is you, Please submit the code from the email we sent you to {client.client.email}.</p>
                        <div className="email-code">
                            <form onSubmit={loginSubmitHandler} className="m-b-10">
                                <Form.Group className="mb-4">
                                    <Form.Control type="text" name="code" placeholder="Code from email" required/>
                                    {/* <p>
                                        This code is valid for 10 min.
                                    </p> */}
                                </Form.Group>
                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                    <Link onClick={backLogin} className="order-5 order-sm-0">&laquo; Back</Link>
                                    <Button disabled={loading} type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">{submitLbl}</Button>
                                </div>
                                {/* <Button type="button" variant="light">Request a New Code</Button> */}
                                {/* <Button type="submit" className="m-l-25">submit</Button> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Verify;