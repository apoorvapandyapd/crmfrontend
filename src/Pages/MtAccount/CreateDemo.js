import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
// import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import PropagateLoader from "react-spinners/PropagateLoader";
import AlertMessage from '../AlertMessage';
import { BackArrowIcon } from '../../Components/icons';

const base_url = process.env.REACT_APP_API_URL;
const MT_DETAILS_API = base_url+"/v1/client/list-mtdetails";
const CREATE_MT_ACCOUNT_API = base_url+"/v1/client/store-mtaccount";
// const COMPANY_TITLE = process.env.COMPANY_TITLE;

function CreateDemo(props) {

    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);

    // const [error, setError] = useState({});
    let [loading, setLoading] = useState(false);

    const [data, setData] = useState(null);

    // const [value, setValue] = useState();


    const client = useSelector(showClient);
    let location = useLocation();
    let history = useHistory();
    if (client.islogin === false)
    {

        history.push('/login')
    }
    const dispatch = useDispatch();


    // var account = location.state.account;

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                account_type_id: 1
            };
            await axios.post(MT_DETAILS_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){
                    setLoading(false);
                    setData(res.data.data);

                }
            })
        } catch (error) {
            console.error(error);
            setLoading(false);
            if (error.response.status === 401) {
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }

    const accountSubmit=async(e)=>{
        e.preventDefault();
        setAlertDiv(false);
        setLoading(true);
        
        const data = {
            'account_type_id': 1,
        };

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
    
            await axios.post(CREATE_MT_ACCOUNT_API, data, config).then((res)=>{
                if(res.data.status_code===200){

                    history.push('/list/trading-accounts');
                }
                else if (res.data.status_code === 500) {
                    ;
                    setErrorMesssage(res.data.message);
                    setAlertDiv(true);
                }

                setLoading(false);
            }).catch((error) => {
                if (error.response) {
                    setLoading(false);
                    console.log(error.response.data.errors);
                    // setError(error.response.data.errors);
                }
            });
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchData();
    },[])


    if (data == null) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                        color={'#000b3e'}
                        loading={loading}
                        cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </Innerlayout>
            </Fragment>
        );
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
                        <div className="box-wrapper w-700">
                            <div className="card-body create-ticket p-0 bg-white">
                            <h2 className="mb-0 px-40">
                                    <Link to='/list/trading-accounts' className="back-arrow">
                                        <BackArrowIcon width="24" height="24" />
                                    </Link>
                                Demo Account
                            </h2>
                            {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                            <div className='p-40'>
                                <form onSubmit={accountSubmit}>
                                    <div className="form-group col-sm-12">
                                        {/* <h3 className="mb-1">{`${COMPANY_TITLE} Demo`}</h3> */}
                                        {/* <p><b>Group......</b>{data.group}</p> */}
                                        <p><b>You will receive the following benefits with your demo account</b></p>
                                        <ul className='demo-plan-box'>
                                            <li><b>Max Leverage</b> {data.leverage}</li>
                                            <li><b>Commisison(per lot)</b> 2.5$</li>
                                            <li><b>Starting Deposit(USD)</b> 5000$</li>
                                            <li><b>Micro/Mini Lot Trading</b> Micro</li>
                                            <li><b>Currency Pairs</b> More then 60</li>
                                            <li><b>Crypto</b> Yes</li>
                                            <li><b>Index CFD Trading</b> Yes</li>
                                            <li><b>Total Products</b> More then 60</li>
                                            <li><b>Stop Out Level</b> 10%</li>
                                            <li><b>One Click Trading</b> Yes</li>
                                            <li><b>Hedging allowed</b> Yes</li>
                                            <li><b>Swap</b> No</li>
                                        </ul>
                                    </div>
                                    <hr className='line-seperator'/>
                                        <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                        <Link to="/list/trading-accounts" className='order-5 order-sm-0'>&laquo; Back</Link>
                                            <button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Create</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                }
                </Innerlayout>
        </Fragment>
    );
}

export default CreateDemo;