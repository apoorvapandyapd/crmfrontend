import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import PropagateLoader from "react-spinners/PropagateLoader";

const base_url = process.env.REACT_APP_API_URL;
const STORE_INDIVIDUAL_FORM_API = base_url+"/v1/client/store-individualform";
const FETCH_INDIVIDUAL_FORM_API = base_url+"/v1/client/fetch-individualform";

function Experience({setActiveTab, backEvent, activeTab}) {

    const client = useSelector(showClient);
    if (client.client.login === false)
    {
        dispatch(redirectAsync());
    }

    let history = useHistory();
    const dispatch = useDispatch();

    const [data, setData] = useState({
        'client_id':'',
        'check_key': '',
        'risk_of_trading': '',
        'trading_experience': '',
        'trading_experience_ft': '',
        'trading_derivatives': '',
        'derivatives_ft': '',
        'trading_in_cfd': '',
        'cfd_ft': '',
    });

    let [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const individualChange=(e)=>{
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        // Set checkbox value to false if unchecked
        if (type === 'checkbox' && !checked) {
            setData((prevFormData) => ({
                ...prevFormData,
                [name]: false
            }));
        } else {
            setData((prevFormData) => ({
                ...prevFormData,
                [name]: newValue
            }));
        }

        // setData((prevValue) => ({
        //     ...prevValue,
        //     [e.target.name]: e.target.value,
        // }));
    }

    const fillLater=(e)=>{
        e.preventDefault();
        history.push('/dashboard');
    }

    const individualSubmit=async(e)=>{
        e.preventDefault();

        let updatedData = { ...data };

        if (e.target.elements.check_key) {
            updatedData = {
                ...updatedData,
                'check_key': e.target.elements.check_key.value,
                'client_id': client.client.id
            };
        }
        
        setData(updatedData); // Update the state

        // Wait for the state update to complete
        await new Promise((resolve) => setTimeout(resolve, 0));

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            await axios.post(STORE_INDIVIDUAL_FORM_API, updatedData, config).then((res)=>{
                if(res.data.status_code===200){
                    updatedData = {
                        ...updatedData,
                        [res.data.data]: true,
                    };

                    setData(updatedData); // Update the state
                    setError({});

                    if(res.data.data=='completed'){
                        setTimeout(()=>{
                            setLoading(false);
                            history.push('/create/live/account')
                        },1000);
                    }
                    else{
                        setActiveTab(res.data.data);
                    }
                }
                else if(res.data.status_code==500){
                }
            }).catch((error) => {
                if (error.response) {
                    setLoading(false);
                    setError(error.response.data.errors);
                }
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }

    }

    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "trading_key"
            };
            const response = await axios.post(FETCH_INDIVIDUAL_FORM_API, bodyParameters, config)

            setData((prevFormData) => ({
                ...prevFormData,
                ...response.data.data,
            }));

            setLoading(false);

        } catch (error) {
            console.error(error);
            setLoading(false);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        if(activeTab=='trading_key'){
            fetchData();
        } 
    }, [activeTab]);
    
    if (loading===true) {
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
        <div className="p-4 label-input">
            <form onSubmit={individualSubmit}>
                <input type='hidden' name='trading_key' value='true'/>
                <input type='hidden' name='check_key' value='trading_key'/>

                <h2 className="mb-3"><b>Trading Experience and Knowledge</b></h2>
                <div className="row form-details">
                    <div className="col-12">
                        <div className="form-group">
                            <label>Do you understand the risks of trading margined/leverage products?*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="risk-yes" name="risk_of_trading" onChange={individualChange} value='Yes' checked={data.risk_of_trading=="Yes"}/>
                                <label htmlFor="risk-yes">Yes</label>
                                <input type="radio" id="risk-no" name="risk_of_trading" onChange={individualChange} value='No' checked={data.risk_of_trading=="No"}/>
                                <label htmlFor="risk-no">No</label>
                            </div>
                            {
                                data.risk_of_trading=="No" && 
                                <span className='mt-1 d-block'>Please refer to this document for more information <a style={{ color:'#00aeff' }} href='https://crm.netulr.com/pdf/Risk%20Warning-ParkmoneySVG.pdf' target='_blank'>Risk Disclosure</a></span>
                            }
                        </div>
                        <small className="text-danger">{error.risk_of_trading}</small>
                    </div>
                    <div className="col-12"><hr/></div>
                    <div className="col-12">
                        <div className="form-group mb-3">
                            <label>How many years trading experience you have?*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="securities-0" name="trading_experience" onChange={individualChange} value='Less than 1 year' checked={data.trading_experience=="Less than 1 year"}/>
                                <label htmlFor="securities-0">Less than 1 year</label>
                                <input type="radio" id="securities-1" name="trading_experience" onChange={individualChange} value='1 year' checked={data.trading_experience=="1 year"}/>
                                <label htmlFor="securities-1">1 year</label>
                                <input type="radio" id="securities-1to3" name="trading_experience" onChange={individualChange} value='1 to 3 years' checked={data.trading_experience=="1 to 3 years"}/>
                                <label htmlFor="securities-1to3">1 to 3 years</label>
                                <input type="radio" id="securities-3" name="trading_experience" onChange={individualChange} value='More than 3 years' checked={data.trading_experience=="More than 3 years"}/>
                                <label htmlFor="securities-3">More than 3 years</label>
                            </div>
                            <small className="text-danger">{error.trading_experience}</small>
                        </div>
                        <div className="form-group">
                            <label>Frequency of trades?*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="securities-daily" name="trading_experience_ft" onChange={individualChange} value='Daily' checked={data.trading_experience_ft=="Daily"}/>
                                <label htmlFor="securities-daily">Daily</label>
                                <input type="radio" id="securities-weekly" name="trading_experience_ft" onChange={individualChange} value='Weekly' checked={data.trading_experience_ft=="Weekly"}/>
                                <label htmlFor="securities-weekly">Weekly</label>
                                <input type="radio" id="securities-monthly" name="trading_experience_ft" onChange={individualChange} value='Monthly' checked={data.trading_experience_ft=="Monthly"}/>
                                <label htmlFor="securities-monthly">Monthly</label>
                                <input type="radio" id="securities-yearly" name="trading_experience_ft" onChange={individualChange} value='Yearly' checked={data.trading_experience_ft=="Yearly"}/>
                                <label htmlFor="securities-yearly">Yearly</label>
                            </div>
                        </div>
                        <small className="text-danger">{error.trading_experience_ft}</small>
                    </div>
                    <div className="col-12"><hr/></div>
                    <div className="col-12">
                        <div className="form-group mb-3">
                            <label>What is your trading experience trading Derivatives?*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="derivatives-0" name="trading_derivatives" onChange={individualChange} value='Less than 1 year' checked={data.trading_derivatives=="Less than 1 year"}/>
                                <label htmlFor="derivatives-0">Less than 1 year</label>
                                <input type="radio" id="derivatives-1" name="trading_derivatives" onChange={individualChange} value='1 year' checked={data.trading_derivatives=="1 year"}/>
                                <label htmlFor="derivatives-1">1 year</label>
                                <input type="radio" id="derivatives-1to3" name="trading_derivatives" onChange={individualChange} value='1 to 3 years' checked={data.trading_derivatives=="1 to 3 years"}/>
                                <label htmlFor="derivatives-1to3">1 to 3 years</label>
                                <input type="radio" id="derivatives-3" name="trading_derivatives" onChange={individualChange} value='More than 3 years' checked={data.trading_derivatives=="More than 3 years"}/>
                                <label htmlFor="derivatives-3">More than 3 years</label>
                            </div>
                            <small className="text-danger">{error.trading_derivatives}</small>
                        </div>
                        <div className="form-group">
                            <label>Frequency of trades?*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="derivatives-daily" name="derivatives_ft" onChange={individualChange} value='Daily' checked={data.derivatives_ft=="Daily"}/>
                                <label htmlFor="derivatives-daily">Daily</label>
                                <input type="radio" id="derivatives-weekly" name="derivatives_ft" onChange={individualChange} value='Weekly' checked={data.derivatives_ft=="Weekly"}/>
                                <label htmlFor="derivatives-weekly">Weekly</label>
                                <input type="radio" id="derivatives-monthly" name="derivatives_ft" onChange={individualChange} value='Monthly' checked={data.derivatives_ft=="Monthly"}/>
                                <label htmlFor="derivatives-monthly">Monthly</label>
                                <input type="radio" id="derivatives-yearly" name="derivatives_ft" onChange={individualChange} value='Yearly' checked={data.derivatives_ft=="Yearly"}/>
                                <label htmlFor="derivatives-yearly">Yearly</label>
                            </div>
                        </div>
                        <small className="text-danger">{error.derivatives_ft}</small>
                    </div>
                    <div className="col-12"><hr/></div>
                    <div className="col-12">
                        <div className="form-group mb-3">
                            <label>What is your trading experience trading CFDs?*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="cfds-0" name="trading_in_cfd" onChange={individualChange} value='Less than 1 year' checked={data.trading_in_cfd=="Less than 1 year"}/>
                                <label htmlFor="cfds-0">Less than 1 year</label>
                                <input type="radio" id="cfds-1" name="trading_in_cfd" onChange={individualChange} value='1 year' checked={data.trading_in_cfd=="1 year"}/>
                                <label htmlFor="cfds-1">1 year</label>
                                <input type="radio" id="cfds-1to3" name="trading_in_cfd" onChange={individualChange} value='1 to 3 years' checked={data.trading_in_cfd=="1 to 3 years"}/>
                                <label htmlFor="cfds-1to3">1 to 3 years</label>
                                <input type="radio" id="cfds-3" name="trading_in_cfd" onChange={individualChange} value='More than 3 years' checked={data.trading_in_cfd=="More than 3 years"}/>
                                <label htmlFor="cfds-3">More than 3 years</label>
                            </div>
                            <small className="text-danger">{error.trading_in_cfd}</small>
                        </div>
                        <div className="form-group">
                            <label>Frequency of trades?*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="cfds-daily" name="cfd_ft" onChange={individualChange} value='Daily' checked={data.cfd_ft=="Daily"}/>
                                <label htmlFor="cfds-daily">Daily</label>
                                <input type="radio" id="cfds-weekly" name="cfd_ft" onChange={individualChange} value='Weekly' checked={data.cfd_ft=="Weekly"}/>
                                <label htmlFor="cfds-weekly">Weekly</label>
                                <input type="radio" id="cfds-monthly" name="cfd_ft" onChange={individualChange} value='Monthly' checked={data.cfd_ft=="Monthly"}/>
                                <label htmlFor="cfds-monthly">Monthly</label>
                                <input type="radio" id="cfds-yearly" name="cfd_ft" onChange={individualChange} value='Yearly' checked={data.cfd_ft=="Yearly"}/>
                                <label htmlFor="cfds-yearly">Yearly</label>
                            </div>
                        </div>
                        <small className="text-danger">{error.cfd_ft}</small>
                    </div>
                    <div className="col-12 mt-3">
                        <div className="buttons d-flex justify-content-between">
                            <button type="button" className="btn btn-light" onClick={(e)=>fillLater(e)}>Complete Later</button>

                            <div>
                                <button type="button" className="btn btn-light" onClick={(e)=>backEvent(e)}>Back</button><button type="submit" className="btn btn-primary">Save and Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Experience
