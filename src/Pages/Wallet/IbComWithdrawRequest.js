import { Fragment, useEffect, useState } from "react";
import { Button, FormControl, FormGroup } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { redirectAsync, showClient } from "../../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AlertMessage from "../AlertMessage";
import { PropagateLoader } from "react-spinners";
import Select from 'react-select';
import { BackArrowIcon } from "../../Components/icons";

const base_url = process.env.REACT_APP_API_URL;
const STORE_WITHDRAW_API = base_url + "/v1/client/send-ibwithdrawrequest";
const CREATE_WITHDRAW_API = base_url + "/v1/client/withdraw-paymentmethods";
// const GET_CHARGE_API = base_url + "/v1/client/charge-paymentmethods";

const IbComWithdrawRequest = ({ checkHistory, backHandler }) => {

    const history = useHistory();
    const client = useSelector(showClient);
    if (client.islogin === false) {

        history.push('/login')
    }

    const [error, setError] = useState({});
    const [alertDiv, setAlertDiv] = useState(false);
    const [balance, setBalance] = useState('0.00');
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [errorMessage, setErrorMesssage] = useState(null);
    let [loading, setLoading] = useState(false);
    const [selectPaymentMethord, setSelectPaymentMethord] = useState({
        value: '',
        label: "Select..."
    });
    const [amount, setAmount] = useState('')

    const dispatch = useDispatch();


    const newWithdrawSubmitHandler = async (event) => {
        event.preventDefault();
        setAlertDiv(false);
        setLoading(true);
        // const { amount } = event.target.elements;
        // const data = { amount: amount.value };

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData(event.target);
            // formData.append("amount", data.amount);
            // //formData.append("client_payment_id", data.client_payment_id);
            // //formData.append("gateway_type", gatewayType);
            formData.append("as_ib", true);
            formData.append("as_ib_withdraw", true);
            console.log(Object.fromEntries(formData.entries()))
            // if (client.client.ib_status == true) {
            //     formData.append("as_ib", true);
            // }

            await axios.post(STORE_WITHDRAW_API, formData, config).then(response => {
                if (response.data.status_code === 200) {
                    setLoading(false);
                    backFunction(event);
                }
                else if (response.data.status_code === 500) {
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
                setLoading(false);
                setError({});
            }).catch((error) => {
                if (error.response) {
                    console.log(error);
                    let err = error.response.data.errors;
                    setLoading(false);
                    setError(err);
                }
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
                setLoading(false);
            }
        }

    };

    const backFunction = (e) => {
        e.preventDefault();
        backHandler(e);
    }

    async function fetchData() {
        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const data = {
                value: ''
            };


            await axios.post(CREATE_WITHDRAW_API, data, config).then(response => {
                if (response.data.status_code === 200) {

                    let optionData;
                    if (client.client.ib_status === 'both') {
                        optionData = Object.entries(response.data.data.payment_methods).map(([status, methods]) => ({
                            label: status === 'approve' ? 'Used Payment Methods' : 'Other Payment Methods',
                            options: methods.map(({ id, name }) => ({ value: id, label: name }))
                        }));

                    } else {
                        optionData = response.data.data.payment_methods.pending.map(item => ({
                            value: item.id,
                            label: item.name
                        }));
                    }
                    setPaymentMethod(optionData);
                    setBalance(response.data.data.withdrawable_amount);
                }
                else if (response.data.status_code === 500) {
                    setErrorMesssage(response.data.message);
                    setAlertDiv(true);
                }
                setLoading(false);
            }).catch((error) => {
                if (error.response) {
                    console.log(error);
                    let err = error.response.data.errors;
                    setError(err);
                    setLoading(false);
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

    function handlePaymentMethordChange(e) {
        setSelectPaymentMethord(e)
    }
    function handleAmountChange(e) {
        setAmount(e.target.value)
    }
    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Fragment>
            {
                (loading === true) ? <PropagateLoader
                    color={'#000b3e'}
                    loading={true}
                    cssOverride={{ textAlign: 'center', alignItems: 'center', backgroundColor: 'rgb(251,252,252,0.8)', display: 'flex', justifyContent: 'center', width: '100%', height: '100vh' }}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                /> :
                    <div className="box-wrapper w-700">
                        <div className="card-body create-ticket p-0 bg-white">
                            <h2 className="mb-0 px-40 d-flex flex-wrap align-items-center justify-content-between">
                                <span>
                                    <Link to='#' onClick={(e) => backFunction(e)} className="back-arrow">
                                        <BackArrowIcon width="24" height="24" />
                                    </Link>
                                    Commission Request
                                </span>
                                <Link to='#' className="link-text" onClick={(e) => checkHistory('ibComWithdrawalRequest')}>Show History</Link>
                            </h2>
                            <div className="d-flex flex-wrap justify-content-between">
                                <div className="w-100 border-0">
                                    {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                                    <div className='p-40'>
                                        {<>
                                            <form onSubmit={newWithdrawSubmitHandler}>
                                                <div className="mb-3">
                                                    <label style={{ fontWeight: '500' }}>Total Balance</label>
                                                    <span style={{ float: 'right', fontWeight: '500' }}>${balance}</span>
                                                </div>

                                                <FormGroup className="mb-3">
                                                    <label>Select Payment Method</label>
                                                    <Select
                                                        name='client_payment_id'
                                                        defaultValue={selectPaymentMethord}
                                                        value={selectPaymentMethord}
                                                        options={paymentMethod}
                                                        onChange={(e) => handlePaymentMethordChange(e)}
                                                        isClearable={true}
                                                        isSearchable
                                                    />
                                                    <small className="text-danger">{error.client_payment_id}</small>
                                                </FormGroup>

                                                <FormGroup className="mb-3">
                                                    <label>Amount</label>
                                                    <FormControl type="text" name="amount" placeholder="Amount" min='1' step="0.01" value={amount} onChange={(e) => handleAmountChange(e)} />
                                                    <small className="text-danger">{error.amount}</small>
                                                </FormGroup>
                                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                                    <Link to='#' onClick={(e) => backFunction(e)} className="order-5 order-sm-0">&laquo; Back</Link>
                                                    <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Send Request</Button>
                                                </div>
                                            </form></>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </Fragment>
    );
}

export default IbComWithdrawRequest;