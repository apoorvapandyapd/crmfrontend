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

function Employment({setActiveTab, backEvent, activeTab}) {

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
        'emp_status': '',
        'emp_name': '',
        'business_type': '',
        'emp_role': '',
        'work_experience': '',
        'company_by_fsc': '',
        'company_name':'',
        'company_licence_no':'',
        'company_address':'',
        'annual_income': '',
        'net_worth': '',
        'available_trading_funds': '',
        'investment_objective': '',
        'saving_from_salary': '',
        'private_entrepreneur': '',
        'inheritance': '',
        'investments': '',
        'investment_details': '',  //new
        'source_details': '',  //new
        'general_details': '',  //new
        'real_estate': '',
        'royalties': '',
        'others': '',
        'other_details': '',
    });

    let [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const individualChange=(e)=>{

        setData({
            ...data,
            'company_name': data.company_by_fsc === 'No' ? null : data.company_name,
            'company_licence_no': data.company_by_fsc === 'No' ? null : data.company_licence_no,
            'company_address': data.company_by_fsc === 'No' ? null : data.company_address,
            'other_details': data.others === 'No' ? null : data.other_details,
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

                    if(res.data.data==='completed'){
                        setTimeout(()=>{
                            setLoading(false);
                            history.push('/create/live/account')
                        },1000);
                    }
                    else{
                        setActiveTab(res.data.data);
                    }
                }
                else if(res.data.status_code===500){
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
                key: "emp_key"
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
            if(error.response.status===401){
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        if(activeTab==='emp_key'){
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
                <input type='hidden' value='emp_key' name='emp_key'/>
                <input type='hidden' name='check_key' value='emp_key'/>
                <h2 className="mb-3"><b>Employment Information</b></h2>
                <div className="row form-details">
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>Employment Status*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="employed" name="emp_status" onChange={individualChange} value='Employed' checked={data.emp_status==="Employed"}/>
                                <label htmlFor="employed">Employed</label>
                                <input type="radio" id="self-employed" name="emp_status" onChange={individualChange} value='Self-Employed' checked={data.emp_status==="Self-Employed"}/>
                                <label htmlFor="self-employed">Self-Employed</label>
                                <input type="radio" id="unemployed" name="emp_status" onChange={individualChange} value='Unemployed' checked={data.emp_status==="Unemployed"}/>
                                <label htmlFor="unemployed">Unemployed</label>
                                <input type="radio" id="retired" name="emp_status" onChange={individualChange} value='Retired' checked={data.emp_status==="Retired"}/>
                                <label htmlFor="retired">Retired</label>
                                <input type="radio" id="student" name="emp_status" onChange={individualChange} value='Student' checked={data.emp_status==="Student"}/>
                                <label htmlFor="student">Student</label>
                            </div>
                        </div>
                        <small className="text-danger">{error.emp_status}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Employer Name*</label>
                            <input type="text" className="form-control" placeholder="Enter employer name" name='emp_name' value={data.emp_name} onChange={individualChange}/>
                        </div>
                        <small className="text-danger">{error.emp_name}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Type of Business*</label>
                            <input type="text" className="form-control" placeholder="Enter type of business" name='business_type' value={data.business_type} onChange={individualChange}/>
                        </div>
                        <small className="text-danger">{error.business_type}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Position/Role Held*</label>
                            <input type="text" className="form-control" placeholder="Enter position/role held" name='emp_role' value={data.emp_role} onChange={individualChange}/>
                        </div>
                        <small className="text-danger">{error.emp_role}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Total Work Experience (Years)*</label>
                            <input type="text" className="form-control" placeholder="Enter total work experience" name='work_experience' value={data.work_experience} onChange={individualChange}/>
                        </div>
                        <small className="text-danger">{error.work_experience}</small>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>Is your employer (or Company) regulated by FSC or any other regulator in financial markets*?</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="employer-yes" value='Yes'  name="company_by_fsc" onChange={individualChange} checked={data.company_by_fsc==="Yes"}/>
                                <label htmlFor="employer-yes" >Yes</label>
                                <input type="radio" id="employer-no" value='No'  name="company_by_fsc" onChange={individualChange} checked={data.company_by_fsc==="No"}/>
                                <label htmlFor="employer-no">No</label>
                            </div>
                        </div>
                        <small className="text-danger">{error.company_by_fsc}</small>
                    </div>
                    {
                        data.company_by_fsc==="Yes" && 
                        <div className="col-12 mb-3">
                            <div className="form-group">
                                <label>If Yes, Please provide details</label>
                            </div>
                            <div className="row mt-3">
                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                <div className="form-group">
                                    <label>Complete Company Name*</label>
                                    <input type="text" className="form-control" placeholder="Enter company name" name='company_name' value={data.company_name} onChange={individualChange}/>
                                </div>
                                <small className="text-danger">{error.company_name}</small>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                    <div className="form-group">
                                        <label>Licence Number*</label>
                                        <input type="text" className="form-control" placeholder="Enter licence number" name='company_licence_no' value={data.company_licence_no} onChange={individualChange}/>
                                    </div>
                                    <small className="text-danger">{error.company_licence_no}</small>
                                </div>
                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                    <div className="form-group">
                                        <label>Rigister Address*</label>
                                        <input type="text" className="form-control" placeholder="Enter register address" name='company_address' value={data.company_address} onChange={individualChange}/>
                                    </div>
                                    <small className="text-danger">{error.company_address}</small>
                                </div>
                                </div>
                        </div>
                    }
                    {/* <div className="col-12 mt-3">
                        <div className="buttons d-flex justify-content-between">
                            <button type="button" className="btn btn-light" onClick={(e)=>fillLater(e)}>Complete Later</button>

                            <div>
                                <button type="button" className="btn btn-light" onClick={(e)=>backEvent(e)}>Back</button><button type="submit" className="btn btn-primary">Save and Next</button>
                            </div>
                        </div>
                    </div> */}
                </div>
                <hr/>
                <h2 className="mb-3 mt-4"><b>Financial Details</b></h2>
                <div className="row form-details">
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Approximate Annual Income (USD)*</label>
                            <input type="number" className="form-control" placeholder="Enter approximate annual income (USD)" name='annual_income' onChange={individualChange} value={data.annual_income}/>
                        </div>
                        <small className="text-danger">{error.annual_income}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Approximate Net Worth (USD)*</label>
                            <input type="number" className="form-control" placeholder="Enter approximate net worth (USD)" name='net_worth' onChange={individualChange} value={data.net_worth}/>
                        </div>
                        <small className="text-danger">{error.net_worth}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Funds available for trading? (USD)*</label>
                            <input type="number" className="form-control" placeholder="Enter Funds available for trading (USD)" name='available_trading_funds' onChange={individualChange} value={data.available_trading_funds}/>
                        </div>
                        <small className="text-danger">{error.available_trading_funds}</small>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>Investment Objective?*</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="hedging" name="investment_objective" onChange={individualChange} value='Hedging' checked={data.investment_objective==="Hedging"}/>
                                <label htmlFor="hedging">Hedging</label>
                                <input type="radio" id="trading" name="investment_objective" onChange={individualChange} value='Trading' checked={data.investment_objective==="Trading"}/>
                                <label htmlFor="trading">Trading</label>
                                <input type="radio" id="investment" name="investment_objective" onChange={individualChange} value='Investment' checked={data.investment_objective==="Investment"}/>
                                <label htmlFor="investment">Investment</label>
                                <input type="radio" id="other" name="investment_objective" onChange={individualChange} value='Others' checked={data.investment_objective==="Others"}/>
                                <label htmlFor="other">Others</label>
                            </div>
                        </div>
                        <small className="text-danger">{error.investment_objective}</small>
                    </div>
                    {
                        data.investment_objective==='Others' && 
                        <div className="col-12 mb-3">
                            <div className="form-group">
                                <label>Please provide details</label>
                                <textarea className="form-control" name="investment_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.investment_details} onChange={individualChange}></textarea>
                            </div>
                            <small className="text-danger">{error.investment_details}</small>
                        </div>
                    }
                    
                    {/* <div className="col-12 mt-3">
                        <div className="buttons d-flex justify-content-between">
                            <button type="button" className="btn btn-light" onClick={(e)=>fillLater(e)}>Complete Later</button>

                            <div>
                                <button type="button" className="btn btn-light" onClick={(e)=>backEvent(e)}>Back</button><button type="submit" className="btn btn-primary">Save and Next</button>
                            </div>
                        </div>
                    </div> */}
                </div>
                <hr/>
                <h2 className="mb-3 mt-4"><b>Source of funds (Please tick the most relevant answer)</b></h2>
                <div className="row form-details">
                    <div className="col-12 mb-3">
                        <div className="form-group cd-label">
                            <input style={{ marginRight:'8px' }} type="checkbox" id="saving-salary" name='saving_from_salary' onChange={individualChange} checked={data.saving_from_salary} />
                            <label className="mr-3" htmlFor="saving-salary"><b>Saving from Salary/Pension</b></label>
                            <small className="text-danger">{error.saving_from_salary}</small>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group cd-label">
                            <input style={{ marginRight:'8px' }} type="checkbox" id="p-entrepreneur" name='private_entrepreneur' onChange={individualChange} checked={data.private_entrepreneur} />
                            <label className="mr-3" htmlFor="p-entrepreneur"><b>Private Entrepreneur</b></label>
                            <small className="text-danger">{error.private_entrepreneur}</small>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group cd-label">
                            <input style={{ marginRight:'8px' }} type="checkbox" id="inheritance" name='inheritance' onChange={individualChange} checked={data.inheritance} />
                            <label className="mr-3" htmlFor="inheritance"><b>Inheritance</b></label>
                            <small className="text-danger">{error.inheritance}</small>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group cd-label">
                            <input style={{ marginRight:'8px' }} type="checkbox" id="investments" name='investments' onChange={individualChange} checked={data.investments} />
                            <label className="mr-3" htmlFor="investments"><b>Investments</b></label>
                            <small className="text-danger">{error.investments}</small>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group cd-label">
                            <input style={{ marginRight:'8px' }} type="checkbox" id="real-estate" name='real_estate' onChange={individualChange} checked={data.real_estate} />
                            <label className="mr-3" htmlFor="real-estate"><b>Real Estate</b></label>
                            <small className="text-danger">{error.real_estate}</small>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group cd-label">
                            <input style={{ marginRight:'8px' }} type="checkbox" id="royalties" name='royalties' onChange={individualChange} checked={data.royalties} />
                            <label className="mr-3" htmlFor="royalties"><b>Royalties</b></label>
                            <small className="text-danger">{error.royalties}</small>
                        </div>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="form-group">
                            <label>Others</label>
                            <div className="form-group mt-2 custom_radio">
                                <input type="radio" id="others-yes" name="others" onChange={individualChange} value='Yes' checked={data.others==="Yes"}/>
                                <label htmlFor="others-yes">Yes</label>
                                <input type="radio" id="others-no" name="others" onChange={individualChange} value='No' checked={data.others==="No"}/>
                                <label htmlFor="others-no">No</label>
                            </div>
                            <small className="text-danger">{error.others}</small>
                        </div>
                    </div>
                    {
                        data.others==="Yes" && 
                        <div className="col-12 mb-3">
                            <div className="form-group">
                                <label>If Yes, Please provide details</label>
                                <textarea className="form-control" name="source_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.source_details} onChange={individualChange}></textarea>
                            </div>
                            <small className="text-danger">{error.source_details}</small>
                        </div>
                    }
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

export default Employment
