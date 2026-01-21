import { Fragment, useEffect, useState } from "react";
import Innerlayout from "../Components/Innerlayout";
import { Alert,Button, Form, FormControl, FormGroup, FormSelect } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { redirectAsync, showClient } from "../store/clientslice";
import axios from "axios";
import AlertMessage from "./AlertMessage";
import { PropagateLoader } from "react-spinners";

const base_url = process.env.REACT_APP_API_URL;
const ACCOUNT_API_URL = base_url + "/v1/client/list-mtaccount";
const NEW_TRANSFER_API_URL = base_url + "/v1/client/send-mttransferrequest";

const Newtransfer = () => {

    const history = useHistory();
    const [accountlist,setAccountlist] = useState(null);
    const [tranfer,SetTransfer] = useState(false);
    const [balance,setBalance] = useState(null);
    const client = useSelector(showClient);
    if (client.islogin === false)
    {
        history.push('/login')
    }
    const [iserror, setIserror] = useState(null);
    const [error, setError] = useState({});
    const [proofTransfer, setProofTransfer] = useState(null);
    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);
    let [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // let alertDiv = '';
    // if (tranfer === true) {
    //     alertDiv = <Alert className="alert alert-success">Transfer Request successfully</Alert>;
    // }
    // let errorDiv = '';
    // if (iserror !== null) {
    //     errorDiv = <Alert className="alert alert-danger">{iserror}</Alert>;
    // }

    const newTransferSubmitHandler = (event) => {
        event.preventDefault();
        setAlertDiv(false);
        const { type, account_id, amount } = event.target.elements;
        const data = { type:type.value, account_id:account_id.value, amount: amount.value };
        addTransferData(data);
    }

    const handleProofTransfer=(e)=>{
        e.preventDefault();
        let files = e.target.files[0];
        setProofTransfer(files);
    }

    async function addTransferData(data) {
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("type", data.type);
            formData.append("account_id", data.account_id);
            formData.append("amount", data.amount);
            formData.append("proof_transfer", proofTransfer);

            
            const response = await axios.post(NEW_TRANSFER_API_URL, formData, config).then(response=>{
                if(response.data.status_code === 200){
                    SetTransfer(true);
                    history.push('/transfer');
                }
                else if(response.data.status_code === 500){
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
                setLoading(false);

            }).catch((error)=>{
                if (error.response) {
                    let err = error.response.data.errors;
                    setLoading(false);
                    setError(err);
                }
            });
        } catch (error) {
            
            if(error.response.status==401){
                setLoading(false);
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

            const bodyParameters = {};
            const response = await axios.post(ACCOUNT_API_URL, bodyParameters, config)
            setAccountlist(response.data.data.live)
            setBalance(response.data.data.balance)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (accountlist === null) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                            color={'#000b3e'}
                            loading={true}
                            cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                    />
                </Innerlayout>
            </Fragment>
        );
    }

    return(
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
                    <div className="box-wrapper w-480">
                        <div className="card-body create-ticket p-0 bg-white">
                            <h2 className="mb-0 px-40">
                            <Link to='/transfer'><a href="#" className="back-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                    <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                                </svg>
                            </a></Link>
                            New Transfer Request
                            </h2>

                            <div className="d-flex flex-wrap justify-content-between">

                                <div className="w-100 border-0">

                                    {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                                    <div className='p-40'>
                                        <form onSubmit={newTransferSubmitHandler}>

                                            <FormGroup className="mb-3">
                                                <FormSelect name="type" >
                                                    <option value='3'>Account to Wallet</option>
                                                    <option value='4'>Wallet to Account</option>
                                                </FormSelect>
                                            </FormGroup>
                                            <div className="mb-3">
                                                <label style={{ fontWeight:'500' }}>Wallet Balance</label>
                                                <span style={{ float:'right',fontWeight:'500' }}>${balance}</span>
                                            </div>

                                            <FormGroup className="mb-3">
                                                <FormSelect name="account_id" >
                                                    <option value={undefined}>Select an account</option>
                                                    { accountlist.map((account,i) => (account.status==1) ? 
                                                        <option value={account.id}>{account.login} (Balance - ${account.balance})</option> : null
                                                    )}
                                                </FormSelect>
                                                <small className="text-danger">{error.account_id}</small>
                                            </FormGroup>

                                            <FormGroup className="mb-3">
                                                <FormControl type="text" name="amount" placeholder="Amount" min='1' step="0.01" onInput={(event) => event.target.value > 0 ? event.target.value : null} />
                                                <small className="text-danger">{error.amount}</small>
                                            </FormGroup>
                                            {/* <Form.Group className="mb-3">
                                                    <Form.Control type="file" name='proof_transfer' onChange={handleProofTransfer} />
                                            </Form.Group> */}
                                            <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                                <Link to="/transfer" className="order-5 order-sm-0">&laquo; Back</Link>
                                                <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Send Request</Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
            </Innerlayout>
        </Fragment>
    );
}

export default Newtransfer;