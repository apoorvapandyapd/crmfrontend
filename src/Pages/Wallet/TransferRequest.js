import {  useEffect, useState } from "react";
import { Button, FormControl, FormGroup, FormSelect, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { redirectAsync, showClient } from "../../store/clientslice";
// import axios from "axios";
import { PropagateLoader } from "react-spinners";
import { BackArrowIcon } from "../../Components/icons";
import { CustomRequest } from "../../Components/RequestService";

// const base_url = process.env.REACT_APP_API_URL;
// const ACCOUNT_API_URL = base_url + "/v1/client/list-mtaccount";
// const NEW_TRANSFER_API_URL = base_url + "/v1/client/send-mttransferrequest";

const TransferRequest = ({checkHistory, backHandler}) => {

    const history = useHistory();
    const [accountlist,setAccountlist] = useState(null);
    // const [tranfer,SetTransfer] = useState(false);
    // const [balance,setBalance] = useState(null);
    const client = useSelector(showClient);
    const [transferData, setTransferData] = useState({
        type: '3',
        account_id: '',
        to_account_id: '',
        amount: '',

    });
    const [showAccToAccOption, setShowAccToAccOption] = useState(false);
    const [totalLiveAccount, setTotalLiveAccount] = useState(null);

    console.log(transferData);

    if (client.islogin === false)
    {

        history.push('/login')
    }
    // const [iserror, setIserror] = useState(null);
    const [error, setError] = useState({});
    // const [proofTransfer, setProofTransfer] = useState(null);
    let [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


    function handleOnChangeTransferData(event) {
        const { name, value } = event.target;
        if (name == 'type' && value == 5) {
            setShowAccToAccOption(true)

        } else if (name == 'type' && value != 5) {
            setShowAccToAccOption(false)
        }
        setTransferData((prev) => ({
            ...prev,
            [name]: value
        }));
        setError({});
    }

    async function newTransferSubmitHandler(event, data) {

        event.preventDefault();
        let formData;
        if (showAccToAccOption) {
            formData = {
                "type": transferData.type,
                "account_id": transferData.account_id,
                "to_account_id": transferData.to_account_id,
                "amount": transferData.amount
            }
        } else {
            formData = {
                "type": transferData.type,
                "account_id": transferData.account_id,
                "amount": transferData.amount
            }
        }
        setLoading(true);
        CustomRequest('send-mttransferrequest', formData, client.token, (res) => {
            if (res?.error) {
                console.log(res.error);
                let err = res?.error?.response.data.errors;
                setLoading(false);
                setError(err);
                if (res?.error?.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    // SetTransfer(true);
                    backFunction(event);
                }
                setLoading(false);
            }
        });

    }

    async function fetchData() {
        setLoading(true);
        let data = {};

        CustomRequest('list-mtaccount', data, client.token, (res) => {
            if (res?.error) {
                console.log(res.error);
                setLoading(false);
                if (res?.error?.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                setAccountlist(res.data.data.live)
                setTotalLiveAccount(res.data.data.live.reduce((accu, account) => {
                    if (parseInt(account.status) === 1) {
                        accu = ++accu;
                    }
                    return accu
                }, 0))
                setLoading(false);
            }
        });
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
                        <div className='p-40'>
                            <form onSubmit={newTransferSubmitHandler}>

                                <FormGroup className="mb-3">
                                        <FormSelect name="type" onChange={(e) => { handleOnChangeTransferData(e) }} required>
                                            <option value='3' selected={transferData.type === '3'}>Account to Wallet</option>
                                            <option value='4' selected={transferData.type === '4'}>Wallet to Account</option>
                                            {totalLiveAccount > 1 && <option value='5' selected={transferData.type === '5'}>Account to Account</option>}
                                    </FormSelect>
                                </FormGroup>

                                    {
                                        showAccToAccOption === false ? <FormGroup className="mb-3">
                                            <FormSelect name="account_id" onChange={(e) => { handleOnChangeTransferData(e) }} required>
                                                <option value="">Select an account</option>
                                                {accountlist.map((account, i) => (parseInt(account.status) === 1) ?
                                                    <option value={account.id} selected={transferData.account_id == account.id}>{account.login} (Balance - ${account.balance})</option> : null
                                                )}
                                            </FormSelect>
                                            <small className="text-danger">{error.account_id}</small>
                                        </FormGroup>
                                            :
                                            <FormGroup className="mb-3" >
                                                <div className='d-flex justify-content-center flex-wrap flex-sm-nowrap align-items-baseline m-auto'>
                                                    <FormGroup className="w-100">
                                                        <FormSelect name="account_id" onChange={(e) => { handleOnChangeTransferData(e) }} required>
                                                            <option value="">Select an account</option>
                                                            {
                                                                accountlist.filter((account) => {
                                                                    return parseInt(account.status) === 1 && account.id != transferData.to_account_id
                                                                }).map((account) => {

                                                                    if (parseInt(account.status) === 1) {
                                                                        return <option value={account.id} selected={transferData.account_id == account.id}>{account.login} (Balance - ${account.balance})</option>
                                                                    } else {
                                                                        return null;
                                                                    }
                                                                })
                                                            }
                                                        </FormSelect>
                                                        <small className="text-danger">{error.account_id}</small>
                                                    </FormGroup>
                                                    <div className='mx-2 text-center my-2'>To</div>
                                                    <FormGroup className="w-100">
                                                        <FormSelect name="to_account_id" onChange={(e) => { handleOnChangeTransferData(e) }} required>
                                                            <option value="">Select an account</option>
                                                            {
                                                                accountlist.filter((account) => {
                                                                    return parseInt(account.status) === 1 && account.id != transferData.account_id
                                                                }).map((account) => {

                                                                    if (parseInt(account.status) === 1) {
                                                                        return <option value={account.id} selected={transferData.to_account_id == account.id}>{account.login} (Balance - ${account.balance})</option>
                                                                    } else {
                                                                        return null;
                                                                    }
                                                                })
                                                            }
                                                        </FormSelect>
                                                        <small className="text-danger">{error.to_account_id}</small>
                                                    </FormGroup>
                                                </div>

                                            </FormGroup>
                                    }


                                <FormGroup className="mb-3">
                                        <FormControl type="text" name="amount" placeholder="Amount" min='1' step="0.01" value={transferData.amount} onChange={(e) => { handleOnChangeTransferData(e) }} oninput={(event) => event.target.value > 0 ? event.target.value : null} required />
                                    <small className="text-danger">{error.amount}</small>
                                </FormGroup>
                                {/* <Form.Group className="mb-3">
                                        <Form.Control type="file" name='proof_transfer' onChange={handleProofTransfer} />
                                </Form.Group> */}
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