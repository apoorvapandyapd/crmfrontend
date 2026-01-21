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

function Bank({setActiveTab, backEvent, activeTab}) {

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
        'bank_holder_name': '',
        'bank_name': '',
        'bank_address': '',
        'bank_account_number': '',
        'bank_iban_number': '',
        'bank_swift_code': '',
        'bank_sort_code': '',
        'corresponding_bank_number': '',
        'corresponding_bank_name': '',
        'corresponding_bank_swift_code': '',
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
                key: "bank_key"
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
        if(activeTab=='bank_key'){
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
                <input type='hidden' value='bank_key' name='bank_key'/>
                <input type='hidden' name='check_key' value='bank_key'/>
                <h2 className="mb-3"><b>Banking Details</b></h2>
                <div className="row form-details">
                    <div className="col-sm-6 col-xl-6 mb-3">
                        <div className="form-group">
                            <label>Name of Account Holder*</label>
                            <input type="text" className="form-control" placeholder="Enter name of account holder" name='bank_holder_name' onChange={individualChange} value={data.bank_holder_name}/>
                        </div>
                        <small className="text-danger">{error.bank_holder_name}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 mb-3">
                        <div className="form-group">
                            <label>Bank Name*</label>
                            <input type="text" className="form-control" placeholder="Enter bank name" name='bank_name' onChange={individualChange} value={data.bank_name}/>
                        </div>
                        <small className="text-danger">{error.bank_name}</small>
                    </div>
                    <div className="col-sm-12 mb-3">
                        <div className="form-group">
                            <label>Bank Address*</label>
                            <input type="text" className="form-control" placeholder="Enter bank address" name='bank_address' onChange={individualChange} value={data.bank_address}/>
                        </div>
                        <small className="text-danger">{error.bank_address}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Account Number*</label>
                            <input type="text" className="form-control" placeholder="Enter account number" name='bank_account_number' onChange={individualChange} value={data.bank_account_number}/>
                        </div>
                        <small className="text-danger">{error.bank_account_number}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>IBAN Number</label>
                            <input type="text" className="form-control" placeholder="Enter IBAN number" name='bank_iban_number' onChange={individualChange} value={data.bank_iban_number}/>
                        </div>
                        <small className="text-danger">{error.bank_iban_number}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>SWIFT or BIC Code</label>
                            <input type="text" className="form-control" placeholder="Enter SWIFT or BIC code" name='bank_swift_code' onChange={individualChange} value={data.bank_swift_code}/>
                        </div>
                        <small className="text-danger">{error.bank_swift_code}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Sort Code</label>
                            <input type="text" className="form-control" placeholder="Enter sort code" name='bank_sort_code' onChange={individualChange} value={data.bank_sort_code}/>
                            <small className="text-danger">{error.bank_sort_code}</small>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Corresponding Bank Name</label>
                            <input type="text" className="form-control" placeholder="Enter corresponding bank name" name='corresponding_bank_name' onChange={individualChange} value={data.corresponding_bank_name}/>
                        </div>
                        <small className="text-danger">{error.corresponding_bank_name}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Corresponding Bank Account Number</label>
                            <input type="text" className="form-control" placeholder="Enter corresponding bank account number" name='corresponding_bank_number' onChange={individualChange} value={data.corresponding_bank_number}/>
                        </div>
                        <small className="text-danger">{error.corresponding_bank_number}</small>
                    </div>
                    <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                        <div className="form-group">
                            <label>Corresponding Bank Swift Code</label>
                            <input type="text" className="form-control" placeholder="Enter corresponding bank swift code" name='corresponding_bank_swift_code' onChange={individualChange} value={data.corresponding_bank_swift_code}/>
                        </div>
                        <small className="text-danger">{error.corresponding_bank_swift_code}</small>
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

export default Bank
