import { Fragment, useState } from "react";
import Innerlayout from "../Components/Innerlayout";
import { Button, Form } from "react-bootstrap";
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AlertMessage from "./AlertMessage";
import { PropagateLoader } from "react-spinners";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { VisibilityIcon, VisibilityOffIcon } from "../Components/icons";

const base_url = process.env.REACT_APP_API_URL;
const CHANGE_PASSWORD_API_URL = base_url + "/reset-password";


const Changepassword = () => {

    const client = useSelector(showClient);
    // const [passwordupdate, setPasswordupdate] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);
    const [error, setError] = useState({});
    const [alertDiv, setAlertDiv] = useState(false);
    let [loading, setLoading] = useState(false);
    const [oldpassstate,setOldpassstate] = useState(false);
    const [newpassstate,setNewpassstate] = useState(false);
    const [confirmpassstate,setConfirmpassstate] = useState(false);
    const dispatch = useDispatch();
    let history = useHistory();


    const changepasswordSubmitHandler = (event) => {
        event.preventDefault();
        setAlertDiv(false);
        const { old_password, password, confirm_password } = event.target.elements;
        const data = { old_password: old_password.value, password: password.value, confirm_password: confirm_password.value};
         fetchData(data);

    };
    async function fetchData(data) {
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("id",client.client.id);
            formData.append("old_password", data.old_password);
            formData.append("password", data.password);
            formData.append("confirm_password", data.confirm_password);
            
            await axios.post(CHANGE_PASSWORD_API_URL, formData, config).then(response=>{
                if(response.data.status_code === 200){

                    // setPasswordupdate(true);
                    if (client.asIB === true) {
                        history.push('/ib/dashboard');
                    } else {
                        history.push('/dashboard');
                    }

                }
                else if(response.data.status_code === 500){

                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
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
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }
    function handleOldPass(){
        if(oldpassstate === true)
        {
            setOldpassstate(false);
        }
        else{
            setOldpassstate(true);
        }
    }
    function handleNewPass(){
        if(newpassstate === true)
        {
            setNewpassstate(false);
        }
        else{
            setNewpassstate(true);
        }
    }
    function handleConfirmPass(){
        if(confirmpassstate === true)
        {
            setConfirmpassstate(false);
        }
        else{
            setConfirmpassstate(true);
        }
    }
    return (
        <Fragment>
            <Innerlayout>
            {
                    (loading === true) ? <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
                        cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    /> :

                <div className="box-wrapper w-480">
                    <div className="card-body">
                        <h2>Change Password</h2>
                        <div className="d-flex flex-wrap justify-content-between mt-4">
                            <div className="w-100 border-0">
                                {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                                <form onSubmit={changepasswordSubmitHandler}>
                                    <Form.Group className="mb-3  position-relative">
                                        <Form.Control type={oldpassstate===true ? 'text' : 'password'} name="old_password" placeholder="Old Password" />
                                                <span className="password-icon cursor-pointer" onClick={handleOldPass}>{oldpassstate === false ?
                                                    <VisibilityIcon width="16" height="16" /> :
                                                    <VisibilityOffIcon width="16" height="16" />
                                    }</span>
                                        <small className="text-danger">{error.old_password}</small>
                                    </Form.Group>
                                    <Form.Group className="mb-3 position-relative">
                                        <Form.Control type={newpassstate===true ? 'text' : 'password'} name="password" placeholder="New Password" />
                                                <span className="password-icon cursor-pointer" onClick={handleNewPass}>{newpassstate === false ?
                                                    <VisibilityIcon width="16" height="16" /> :
                                                    <VisibilityOffIcon width="16" height="16" />
                                    }</span>
                                        <small className="text-danger">{error.password}</small>
                                    </Form.Group>
                                    <Form.Group className="mb-3 position-relative">
                                        <Form.Control type={confirmpassstate===true ? 'text' : 'password'} name="confirm_password" placeholder="Confirm Password" />
                                                <span className="password-icon cursor-pointer" onClick={handleConfirmPass}>{confirmpassstate === false ?
                                                    <VisibilityIcon width="16" height="16" /> :
                                                    <VisibilityOffIcon width="16" height="16" />
                                    }</span>
                                        <small className="text-danger">{error.confirm_password}</small>
                                    </Form.Group>
                                    <Button type="submit" className="btn btn-primary float-end">Change Password</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div> }
            </Innerlayout>
        </Fragment>
    );
}

export default Changepassword;