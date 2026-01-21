import { Fragment, useState } from "react";
import Innerlayout from "../../Components/Innerlayout";
import { Link, useHistory } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { FormControl, FormGroup, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { redirectAsync, showClient } from "../../store/clientslice";
import AlertMessage from "../AlertMessage";
import { PropagateLoader } from "react-spinners";
import { BackArrowIcon } from "../../Components/icons";

const base_url = process.env.REACT_APP_API_URL;
const SHOWPASSWORD_API_URL = base_url + "/v1/client/show-mtpassword";
const MTACCOUNT_CHANGE_PASSWORD_API_URL = base_url + "/v1/client/update/mtpassword";

function ChangeMtPass(){

    const history = useHistory();
    let { id } = useParams();
    const client = useSelector(showClient);
    // const [mtPasswrod, setMtPasswrod] = useState(false);
    const [alertDiv, setAlertDiv] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    // const [show, setShow] = useState(false);
    const [login, setLogin] = useState(null);
    // const [modalBtnDisable, setModalBtnDisable] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);
    const [mainPassword, setMainPassword] = useState(null);
    // const [oldMainPassword, setOldMainPassword] = useState(null);
    const [confirmMainPassword, setConfirmMainPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const dispatch = useDispatch();


    const newMtPasswordSubmitHandler = async(event) => {
        event.preventDefault();
        setAlertDiv(false);
        
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("account_id",id);
            // formData.append("old_main_password",oldMainPassword);
            formData.append("main_password",mainPassword);
            formData.append("confirm_main_password",confirmMainPassword);

//            formData.append("invest_password", data.invest_password);
            

            await axios.post(MTACCOUNT_CHANGE_PASSWORD_API_URL, formData, config).then(response=>{

                if(response.data.status_code === 200){
                    // setMtPasswrod(true);
                    setLoading(false);
                    history.push('/list/trading-accounts');
                }
                else if(response.data.status_code === 500){
                    setLoading(false);
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
            }).catch((error)=>{
                if (error.response) {
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

    const handleClose=()=>{
        // setShow(false);
        setShowPwd(false);
    }

    const checkPassword=(event)=>{
        event.preventDefault();

        const { main_password,confirm_main_password } = event.target.elements;
        setMainPassword(main_password.value);
        // setOldMainPassword(old_main_password.value);
        setConfirmMainPassword(confirm_main_password.value);

        setShowPwd(true);
        setLogin(id);
    }

    const showPasswordForm = async(event) => {
        event.preventDefault();
        setAlertDiv(false);
        setLoading(true);

        const { password } = event.target.elements;

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("password", password.value);
            formData.append("login", login);
            
            await axios.post(SHOWPASSWORD_API_URL, formData, config).then(response => {

                if(response.data.status_code === 200){

                    setShowPwd(false);
                    newMtPasswordSubmitHandler(event);
                }
                else if(response.data.status_code === 500){
                    setLoading(false);
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }

            }).catch((error)=>{
                if (error.response) {
                    setLoading(false);
                    let err = error.response.data.errors;
                    setErrorMesssage(err);
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
    

    return(
        <Fragment>
            <Innerlayout>
            {
                    loading === true ?
                <PropagateLoader
                    color={'#000b3e'}
                    loading={loading}
                    cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                /> :
                <>
                            <div className="box-wrapper w-700">
                                <div className="card-body create-ticket p-0 bg-white">
                        <h2 className="mb-0 px-40">
                                        <Link to='/list/trading-accounts' className="back-arrow">
                                            <BackArrowIcon width="24" height="24" />
                                        </Link>
                            Change Main Password
                        </h2>
                        <div className='p-40'>
                            {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                            <form onSubmit={checkPassword}>
                                <input type="hidden" name="account_id" value={id}/>
                                {/* <FormGroup className="mb-3">
                                    <FormControl type="password" name="old_main_password" placeholder="Old Main Password" />
                                    <small className="text-danger">{error.old_main_password}</small>
                                </FormGroup> */}
                                <FormGroup className="mb-3">
                                    <FormControl type="password" name="main_password" placeholder="Main Password" />
                                    <small className="text-danger">{error.main_password}</small>
                                </FormGroup>
                                <FormGroup className="mb-3">
                                    <FormControl type="password" name="confirm_main_password" placeholder="Confirm Main Password" />
                                    <small className="text-danger">{error.confirm_main_password}</small>
                                </FormGroup>

                                {/* <FormGroup className="mb-3">
                                    <FormControl type="password" name="invest_password" placeholder="Investor Password" />
                                </FormGroup> */}
                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                    <Link to="/list/trading-accounts" className="order-5 order-sm-0">&laquo; Back</Link>
                                    {/* <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Change Password</Button> */}
                                    <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Change Password</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Modal show={showPwd} onHide={(e)=>handleClose(e)} centered animation={false}>
                        <form onSubmit={showPasswordForm}>
                        <Modal.Header>
                        <Modal.Title>
                        Verification Password
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                            <FormGroup className="mb-3">
                                <FormControl type="password" name="password"/>
                            </FormGroup>               
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={(e)=>handleClose(e)}>
                            Close
                        </Button>
                                        <Button type="submit" variant="primary" >Change</Button>
                        </Modal.Footer>
                        </form>
                </Modal>
                </>
            }
            </Innerlayout>
        </Fragment>
    );
}
export default ChangeMtPass;