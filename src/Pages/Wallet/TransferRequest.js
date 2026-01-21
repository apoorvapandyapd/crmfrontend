import {  useEffect, useState } from "react";
import { Button, FormControl, FormGroup, FormSelect, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { redirectAsync, showClient } from "../../store/clientslice";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import AlertMessage from "../AlertMessage";
import { BackArrowIcon } from "../../Components/icons";

const base_url = process.env.REACT_APP_API_URL;
const ACCOUNT_API_URL = base_url + "/v1/client/list-mtaccount";
const NEW_TRANSFER_API_URL = base_url + "/v1/client/send-mttransferrequest";

const TransferRequest = ({checkHistory, backHandler, fetchData}) => {

    const history = useHistory();
    const [accountlist,setAccountlist] = useState(null);
    const client = useSelector(showClient);
    if (client.islogin === false)
    {

        history.push('/login')
    }
    const [error, setError] = useState({});
    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);
    let [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const newTransferSubmitHandler = (event) => {
        event.preventDefault();
        setAlertDiv(false);
        const { type, account_id, amount } = event.target.elements;
        const data = { type: type.value, account_id: account_id.value, amount: amount.value };
        addTransferData(event, data);
    }

    async function addTransferData(event, data) {
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("type", data.type);
            formData.append("account_id", data.account_id);
            formData.append("amount", data.amount);
            
            await axios.post(NEW_TRANSFER_API_URL, formData, config).then(response => {

                if(response.data.status_code === 200){
                    backFunction(event);
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
            console.error(error);
            if (error.response.status === 401) {
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
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const backFunction=(e)=>{
        e.preventDefault();
        backHandler(e);
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (accountlist === null) {
        return (
            <PropagateLoader
                    color={'#000b3e'}
                    loading={true}
                    cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
            />
        );
    }

    return(
        (loading === true) ? <PropagateLoader
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
                        Transfer Request
                        </span>
                        <Link to='#' className="link-text" onClick={(e) => checkHistory('transferRequest')}>Show History</Link>
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


                                <FormGroup className="mb-3">
                                    <FormSelect name="account_id" >
                                        <option value="">Select an account</option>
                                            {accountlist.map((account, i) => (parseInt(account.status) === 1) ? 
                                            <option value={account.id}>{account.login} (Balance - ${account.balance})</option> : null
                                        )}
                                    </FormSelect>
                                    <small className="text-danger">{error.account_id}</small>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <FormControl type="text" name="amount" placeholder="Amount" min='1' step="0.01" oninput={(event) => event.target.value > 0 ? event.target.value : null} />
                                    <small className="text-danger">{error.amount}</small>
                                </FormGroup>
                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                        <Link to='#' onClick={(e) => backFunction(e)} className="order-5 order-sm-0">&laquo; Back</Link>
                                    <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Send Request</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransferRequest;