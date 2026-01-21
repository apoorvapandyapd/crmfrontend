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

function Disclouser({setActiveTab, backEvent, activeTab}) {

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
        'legal_status_clear': '',
        'legal_status_details': '',
        'poa_intent': '',
        'poa_intent_details': '',
        'financial_industry_affiliation': '',
        'financial_industry_affiliation_details': '',
        'criminal_convictions': '',
        'criminal_convictions_details': '',
        'external_control': '',
        'external_control_details': '',
    });

    let [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const individualChange=(e)=>{
        
        setData({
            ...data,
            'legal_status_details': data.legal_status_clear === 'No' ? null : data.legal_status_details,
            'poa_intent_details': data.poa_intent === 'No' ? null : data.poa_intent_details,
            'financial_industry_affiliation_details': data.financial_industry_affiliation === 'No' ? null : data.financial_industry_affiliation_details,
            'criminal_convictions_details': data.criminal_convictions === 'No' ? null : data.criminal_convictions_details,
            'external_control_details': data.external_control === 'No' ? null : data.external_control_details,
            'source_details': data.others === 'No' ? null : data.source_details,
            'investment_details': data.investment_objective != 'Others' ? null : data.investment_details,
        });

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
                key: "general_key"
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
        if(activeTab=='general_key'){
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
        <div className="p-4 label-input general-disclosure">
            <form onSubmit={individualSubmit}>
                <input type='hidden' name='general_key' value='true'/>  
                <input type='hidden' name='check_key' value='general_key'/>

                <h2 className="mb-3"><b>General Disclosure</b></h2>
                <div className="row form-details">
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>Do you have any pending litigation, disputed account(s) or any other unresolved matter with any other broker and/or company or have been sanctioned by any regulatory authority within the financial services industry?</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="general-disclosure-1-yes" name="legal_status_clear" onChange={individualChange} value='Yes' checked={data.legal_status_clear=="Yes"}/>
                                <label for="general-disclosure-1-yes">Yes</label>
                                <input type="radio" id="general-disclosure-1-no" name="legal_status_clear" onChange={individualChange} value='No' checked={data.legal_status_clear=="No"}/>
                                <label for="general-disclosure-1-no">No</label>
                            </div>
                            <small className="text-danger">{error.legal_status_clear}</small>
                        </div>
                        {
                            data.legal_status_clear=='Yes' && 
                            <div className="form-group">
                                <label>If Yes, Please provide details</label>
                                <textarea className="form-control" name="legal_status_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.legal_status_details} onChange={individualChange}></textarea>
                                <small className="text-danger">{error.legal_status_details}</small>
                            </div>
                        }
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>Do you intend to provide power of attorney of this trading account to other any person/persons?</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="general-disclosure-2-yes" name="poa_intent" onChange={individualChange} value='Yes' checked={data.poa_intent=="Yes"}/>
                                <label for="general-disclosure-2-yes">Yes</label>
                                <input type="radio" id="general-disclosure-2-no" name="poa_intent" onChange={individualChange} value='No' checked={data.poa_intent=="No"}/>
                                <label for="general-disclosure-2-no">No</label>
                            </div>
                            <small className="text-danger">{error.poa_intent}</small>
                        </div>
                        {
                            data.poa_intent=='Yes' && 
                            <div className="form-group">
                                <label>If Yes, Please provide details</label>
                                <textarea className="form-control" name="poa_intent_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.poa_intent_details} onChange={individualChange}></textarea>
                                <small className="text-danger">{error.poa_intent_details}</small>
                            </div>
                        }
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>You/have you during the past 5 years been a partner, director, officer or employee of any broker, or any other company within the financial services industry, or the same of any exchange, board of trade, contract market or clearing organisation?</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="general-disclosure-3-yes" name="financial_industry_affiliation" onChange={individualChange} value='Yes' checked={data.financial_industry_affiliation=="Yes"}/>
                                <label for="general-disclosure-3-yes">Yes</label>
                                <input type="radio" id="general-disclosure-3-no" name="financial_industry_affiliation" onChange={individualChange} value='No' checked={data.financial_industry_affiliation=="No"}/>
                                <label for="general-disclosure-3-no">No</label>
                            </div>
                            <small className="text-danger">{error.financial_industry_affiliation}</small>
                        </div>
                        {
                            data.financial_industry_affiliation=='Yes' && 
                            <div className="form-group">
                                <label>If Yes, Please provide details</label>
                                <textarea className="form-control" name="financial_industry_affiliation_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.financial_industry_affiliation_details} onChange={individualChange}></textarea>
                                <small className="text-danger">{error.financial_industry_affiliation_details}</small>
                            </div>
                        }
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>Have you at any time been convicted of any offence by any court? (Road Traffic offences should not be listed).</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="general-disclosure-4-yes" name="criminal_convictions" onChange={individualChange} value='Yes' checked={data.criminal_convictions=="Yes"}/>
                                <label for="general-disclosure-4-yes">Yes</label>
                                <input type="radio" id="general-disclosure-4-no" name="criminal_convictions" onChange={individualChange} value='No' checked={data.criminal_convictions=="No"}/>
                                <label for="general-disclosure-4-no">No</label>
                            </div>
                            <small className="text-danger">{error.criminal_convictions}</small>
                        </div>
                        {
                            data.criminal_convictions=='Yes' && 
                            <div className="form-group">
                                <label>If Yes, Please provide details</label>
                                <textarea className="form-control" name="criminal_convictions_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.criminal_convictions_details} onChange={individualChange}></textarea>
                                <small className="text-danger">{error.criminal_convictions_details}</small>
                            </div>
                        }
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>Does any third party have any controlling interest where financial or otherwise, in respect of any trading undertaken on this account?</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="general-disclosure-5-yes" name="external_control" onChange={individualChange} value='Yes' checked={data.external_control=="Yes"}/>
                                <label for="general-disclosure-5-yes">Yes</label>
                                <input type="radio" id="general-disclosure-5-no" name="external_control" onChange={individualChange} value='No' checked={data.external_control=="No"}/>
                                <label for="general-disclosure-5-no">No</label>
                            </div>
                            <small className="text-danger">{error.external_control}</small>
                        </div>
                        {
                            data.external_control=='Yes' && 
                            <div className="form-group">
                                <label>If Yes, Please provide details</label>
                                <textarea className="form-control" name="external_control_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.external_control_details} onChange={individualChange}></textarea>
                                <small className="text-danger">{error.external_control_details}</small>
                            </div>
                        }
                    </div>
                    {/* <div className="col-12 mb-3">
                        <div className="form-group">
                            <label><b>IF THE ANSWER TO ANY OF ABOVE QUESTIONS IS 'YES' PLEASE PROVIDE DETAILS.</b></label>
                            <div className="form-group mt-2">
                                <textarea className="form-control" name="general_details" id="" cols="30" rows="5" placeholder="Enter your details" onChange={individualChange} value={data.general_details}></textarea>
                            </div>
                        </div>
                    </div> */}
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

export default Disclouser
