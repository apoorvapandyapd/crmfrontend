import axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import PropagateLoader from "react-spinners/PropagateLoader";
import ReactSignatureCanvas from 'react-signature-canvas';

const base_url = process.env.REACT_APP_API_URL;
const STORE_INDIVIDUAL_FORM_API = base_url+"/v1/client/store-individualform";
const FETCH_INDIVIDUAL_FORM_API = base_url+"/v1/client/fetch-individualform";

function Declaration({setActiveTab, backEvent, activeTab}) {
    const client = useSelector(showClient);
    if (client.client.login === false)
    {
        dispatch(redirectAsync());
    }

    let history = useHistory();
    const dispatch = useDispatch();
    let signPad = useRef({});

    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = (nowDate.getMonth() + 1).toString().padStart(2, '0');
    const day = nowDate.getDate().toString().padStart(2, '0');

    const currentDate= `${year}-${month}-${day}`;

    const [data, setData] = useState({
        'client_id':'',
        'check_key': '',
        'disclosure_details': false,
        'client_declarations': false,
        'consent_personal_information': false,
        'signature_details': ''
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

    const clearSignpad=(e)=>{
        e.preventDefault();
        signPad.current.clear();
        setData((prevFormData) => ({
            ...prevFormData,
            'signature_details': ''
        }));
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
        
        if (e.target.elements.declaration_key) {
            if(signPad.current.isEmpty()===false){
                let signatureData = signPad.current.toDataURL();
                updatedData = {
                    ...updatedData,
                    'signature_details': signatureData,
                };
            } 
            setLoading(true);
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
                key: "declaration_key"
            };
            const response = await axios.post(FETCH_INDIVIDUAL_FORM_API, bodyParameters, config)

            setData((prevFormData) => ({
                ...prevFormData,
                ...response.data.data,
            }));

            setLoading(false);
            // signPad.current.clear();

        } catch (error) {
            console.error(error);
            setLoading(false);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        if(activeTab=='declaration_key'){
            fetchData();
        }    
    }, [activeTab]);
    

    if (loading===true) {
        return (
            <PropagateLoader
                color={'#000b3e'}
                loading={loading}
                cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        );
    }

    return (
        <div className="p-4 label-input">
            <form onSubmit={individualSubmit}>
                <input type='hidden' name='declaration_key' value='true'/>
                <input type='hidden' name='check_key' value='declaration_key'/>
                
                <h2 className="mb-3"><b>Client Declarations</b></h2>
                <div className="row form-details">
                    <div className="col-12">
                        <div className="form-group cd-label">
                            <input style={{ marginRight: '8px' }} type="checkbox" id="declare" name='disclosure_details' onChange={individualChange} checked={data.disclosure_details} required/>
                            <label className="mr-3" for="declare"><b>I declare that:</b></label>
                        </div>
                        <small className="text-danger">{error.disclosure_details}</small>
                        <ul className="number-style">
                            <li>That the information provided by me and inserted in this form is correct and that I acknowledge that I shall be obliged to inform PM Financials Ltd immediately in case of any changes to this information;</li>
                            <li>That the investment amount has been chosen by me taking total financial circumstances into consideration and is by me considered reasonable under such circumstances;</li>
                            <li>That the funds deposited now or at any time in the future to PM Financials Ltd are/will not be derived from or otherwise relate to any activity which is illegal or unlawful. I will provide the required evidence of the source of funds if required doing so in future; and</li>
                            <li>To have received satisfactory answers to all our questions regarding the terms, conditions and other issues relating to the relevant products.</li>
                        </ul>
                    </div>
                    <div className="col-12"><hr/></div>
                    <div className="col-12">
                        <div className="form-group cd-label">
                            <input style={{ marginRight: '8px' }} type="checkbox" id="personal-information" name='client_declarations' onChange={individualChange} checked={data.client_declarations} required/>
                            <label className="mr-3" for="personal-information"><b>I acknowledge and consent to personal information submitted by me to PM Financials Ltd:</b></label>
                        </div>
                        <small className="text-danger">{error.client_declarations}</small>
                        <ul className="number-style">
                            <li>Acknowledges, understands, and agrees that PM Financials Ltd shall, for the performance of its obligations hereunder, collect and, where necessary or required, process, personal information which the client hereby voluntarily discloses to it (the “Personal Data”).</li>
                            <li>When PM Financials Ltd is required to carry out electronic verification, data may be used to undertake a search with the third-party authentication service provider. A record of the search and verification will be maintained for 7 years; and</li>
                            <li>Maybe disclosed to other group companies of the PM Financials Ltd.</li>
                            <li>I hereby agree that PM Financials Ltd may contact us to give information about their product and services via email.</li>
                        </ul>
                    </div>
                    <div className="col-12"><hr/></div>
                    <div className="col-12">
                        <div className="form-group cd-label">
                            <input style={{ marginRight: '8px' }} type="checkbox" id="signature" name='consent_personal_information' onChange={individualChange} checked={data.consent_personal_information} required/>
                            <label className="mr-3" for="signature"><b>I declare by our signature:</b></label>
                        </div>
                        <small className="text-danger">{error.consent_personal_information}</small>
                        <ul className="number-style">
                            <li>To have carefully and understood and agree to be bound by the PM Financials Ltd; 
                            <br/>(a) <a href='https://pmfinancials.mu/pdf/PMFL-Terms_and_conditions.pdf' target='_blank' className='link-text'>Client Agreement </a>
                            <br/>(b) <a href='https://pmfinancials.mu/pdf/Privacy%20_Policy.pdf' target='_blank' className='link-text'>Privacy Policy</a>
                            {/* <br/>(c) Best Execution Policy 
                            <br/>(d) Regulations for Non-Trading Operations  */}
                            <br/>(c) <a href='https://pmfinancials.mu/pdf/Complaints_Policy.pdf' target='_blank' className='link-text'>Complaint Policy </a>
                            <br/>(d) <a href='https://pmfinancials.mu/pdf/Risk_Disclosure.pdf' target='_blank' className='link-text'>Risk Disclosure Policy</a>
                            <br/>(e) (as amended from time to time) that may apply to our entire trading relationship with PM Financials Ltd;</li>
                            <li>To have received, read, and understood the product information material relating to the relevant products;</li>
                            <li>To have understood that the trading service provided by PM Financials Ltd carries a high level of risk and can result in losses that exceed the balance of cash held on our account at any time.</li>
                        </ul>
                    </div>
                    <div className="col-12"><hr/></div>
                    <div className="col-sm-8 mb-3">
                        <div className="signature-box">
                            <label>Signature:</label>
                            <div className="signature-write">
                            <ReactSignatureCanvas penColor='blue' ref={signPad}
                            canvasProps={{width: '600px', height: '150px', className: 'sigCanvas', background: '#fff'}} />
                            <small className="text-danger">{error.signature_details}</small>
                            </div>
                            <button class="btn btn-primary border mt-2" onClick={(e)=>clearSignpad(e)}>Clear</button>
                        </div>
                        <div className="mt-3">
                            {client.client.first_name+' '+client.client.last_name}
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <label>Date:</label> {currentDate}
                    </div>
                    <div className="col-12 mt-3">
                        <div className="buttons d-flex justify-content-between">
                            <button type="button" className="btn btn-light" onClick={(e)=>fillLater(e)}>Complete Later</button>

                            <div>
                                <button type="button" className="btn btn-light" onClick={(e)=>backEvent(e)}>Back</button><button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>   
    )
}

export default Declaration
