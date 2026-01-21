import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import PropagateLoader from "react-spinners/PropagateLoader";
import AlertMessage from '../AlertMessage';

const base_url = process.env.REACT_APP_API_URL;
const MT_DETAILS_API = base_url+"/v1/client/list-mtdetails";
const CREATE_MT_ACCOUNT_API = base_url+"/v1/client/store-mtaccount";
const COMPANY_TITLE = process.env.COMPANY_TITLE;

function CerateLive(props) {

    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);

    const [error, setError] = useState({});
    let [loading, setLoading] = useState(false);

    const [data, setData] = useState(null);

    const [value, setValue] = useState({
        'account_type_id': 2,
    });


    const client = useSelector(showClient);
    let location = useLocation();
    let history = useHistory();
    if (client.islogin === false)
    {

        history.push('/login')
    }
    const dispatch = useDispatch();


    var account = location.state.account;

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                account_type_id: 2
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
            if(error.response.status==401){
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }

    const accountSubmit=async(e)=>{
        e.preventDefault();
        setAlertDiv(false);
        setLoading(true);
        
        const data = value;

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
    
            await axios.post(CREATE_MT_ACCOUNT_API, data, config).then((res)=>{
                if(res.data.status_code===200){

                    history.push('/list/trading-accounts');
                }
                else if(res.data.status_code==500){
                    ;
                    setErrorMesssage(res.data.message);
                    setAlertDiv(true);
                }

                setLoading(false);
            }).catch((error) => {
                if (error.response) {
                    setLoading(false);
                    console.log(error.response.data.errors);
                    setError(error.response.data.errors);
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
                    (loading==true) ? <PropagateLoader
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
                                    <Link to='/list/trading-accounts'><a href={null} className="back-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                        <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                                    </svg>
                                </a></Link>
                                Live Account
                            </h2>
                            {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                            <div className='p-40'>
                                <form onSubmit={accountSubmit}>
                                    <div className="form-group col-sm-12">
                                            {/* <h3 className="mb-1">{`${COMPANY_TITLE} Demo`}</h3> */}
                                            {/* <p><b>Group......</b>{data.group}</p> */}
                                            <p><b>You will receive the following benefits with your Live account</b></p>
                                            <ul className='list-style'>
                                                <li>Leverage of {data.leverage}</li>
                                                <li>Trade online, 24-hours a day, 5 days a week</li>
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

export default CerateLive;