import axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import PropagateLoader from "react-spinners/PropagateLoader";
import ReactSignatureCanvas from 'react-signature-canvas';
import Select from 'react-select';
import CountryArr from '../../Components/CountryArr';
import PhoneInput from 'react-phone-input-2';

const base_url = process.env.REACT_APP_API_URL;
const STORE_INDIVIDUAL_FORM_API = base_url+"/v1/client/store-individualform";
const FETCH_INDIVIDUAL_FORM_API = base_url+"/v1/client/fetch-individualform";

function IndividualForm() {

    const client = useSelector(showClient);
    let history = useHistory();
    const [disableSaveBtn, setDisableSaveBtn] = useState(false);



    if (client.client.form_terms_validation === "completed" && client.client.verify === "Completed") {
        history.push('/dashboard');
    } else if (client.client.form_terms_validation === "completed" && client.client.verify === "Not Completed") {
        history.push('/accountverification');
    } else if (client.client.form_type != null && client.client.form_type === 1) {
        history.push('/corporate');
    }




    // let location = useLocation();
    const dispatch = useDispatch();
    if (client.client.login === false) {
        dispatch(redirectAsync());
    }
    let signPad = useRef({});

    if (client.client.login === false) {
        dispatch(redirectAsync());
    }

    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = (nowDate.getMonth() + 1).toString().padStart(2, '0');
    const day = nowDate.getDate().toString().padStart(2, '0');

    const currentDate= `${year}-${month}-${day}`;

    // var countryAppendArr = [];

    const countries = CountryArr();

    let selectCountr = countries.find(country => country.label === client.client.country);

    let mobile_numbers = '+' + selectCountr?.countrycode + ' ' + client.client.phone_no;

    const options = countries;

    const [data, setData] = useState({
        'client_id':'',
        'check_key': '',
        'base_currency': 'USD',
        'title': '',
        'first_name': client.client.first_name,
        'surname': client.client.last_name,
        'birth_place': '',
        'nationality': '',
        'dob': client.client.dob,
        'address_1': client.client.address_1,
        'address_2': '',
        'address_3': '',
        'city': client.client.city,
        'country': client.client.country,
        'postal_code': '',
        'residence_country': client.client.country,
        'usa_citizen': '',
        'pep_related': '',
        'email': client.client.email,
        'landline': '',
        'mobile_number': '',
        'emp_status': '',
        'emp_name': '',
        'business_type': '',
        'emp_role': '',
        'work_experience': '',
        'company_by_fsc': '',
        'company_name':'',
        'company_licence_no':'',
        'company_address':'',
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
        'annual_income': '',
        'net_worth': '',
        'available_trading_funds': '',
        'investment_objective': '',
        'risk_of_trading': '',
        'trading_experience': '',
        'trading_experience_ft': '',
        'trading_derivatives': '',
        'derivatives_ft': '',
        'trading_in_cfd': '',
        'cfd_ft': '',
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
        'disclosure_details': false,
        'client_declarations': false,
        'consent_personal_information': false,
        'signature_details': ''
    });

    const [activeTab, setActiveTab] = useState('individual_key');
    
    // let [selectedCountry, setSelectedCountry] = useState(null);

    // const tabKeys = ['individual_key', 'emp_key', 'bank_key', 'finance_key', 'trading_key', 'source_key', 'general_key', 'declaration_key'];
    const tabKeys = ['individual_key', 'emp_key', 'bank_key', 'trading_key', 'general_key', 'declaration_key'];

    let [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const individualChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setData({
            ...data,
            'legal_status_details': data.legal_status_clear === 'No' ? null : data.legal_status_details,
            'poa_intent_details': data.poa_intent === 'No' ? null : data.poa_intent_details,
            'financial_industry_affiliation_details': data.financial_industry_affiliation === 'No' ? null : data.financial_industry_affiliation_details,
            'criminal_convictions_details': data.criminal_convictions === 'No' ? null : data.criminal_convictions_details,
            'external_control_details': data.external_control === 'No' ? null : data.external_control_details,
            'source_details': data.others === 'No' ? null : data.source_details,
            'investment_details': data.investment_objective !== 'Others' ? null : data.investment_details,
        });

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

    const selectChange=(e, attrib)=>{
        const inputName = attrib.name;

        setData((prevFormData) => ({
            ...prevFormData,
            [inputName]: e.label
        }));

        // if (inputName === 'residence_country') {
        //     setSelectedCountry(e.value);
        // }
    }

    // const handleTabClick = (key) => {
    //     setActiveTab(key);
    // };

    const backEvent=(e)=>{
        e.preventDefault();
        const currentIndex = tabKeys.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabKeys[currentIndex - 1]);
        }
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

                    if (res.data.data === 'completed') {
                        setTimeout(()=>{
                            setLoading(false);
                            history.push('/dashboard')
                        },1000);
                    }
                    else{
                        setActiveTab(res.data.data);
                    }
                }
                else if (res.data.status_code === 500) {
                    ;
                }
            }).catch((error) => {
                if (error.response) {
                    setLoading(false);
                    console.log(error.response.data.errors);
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
                key: "value"
            };
            setDisableSaveBtn(true);
            const response = await axios.post(FETCH_INDIVIDUAL_FORM_API, bodyParameters, config)

            if (response.data.data != null) {

                let countri = (response.data.data.residence_country === '' || response.data.data.residence_country === null) ? client.client.residence_country : response.data.data.residence_country;

                let contactNumber = (response.data.data.mobile_number === '' || response.data.data.mobile_number === null) ? client.client.phone_no : response.data.data.mobile_number;

                setData((prevFormData) => ({
                    ...prevFormData,
                    ...response.data.data,
                    'country': countri,
                    'mobile_number': contactNumber,
                }));
            } else {
                let selectCountrs = countries.find(country => country.label === client.client.country);
                
                let contactNumber = selectCountrs.countrycode+' '+client.client.phone_no;

                setData((prevFormData) => ({
                    ...prevFormData,
                    'country': client.client.country,
                    'mobile_number': contactNumber,
                }));
            }
            setDisableSaveBtn(false);


            setLoading(false);
            signPad.current.clear();

        } catch (error) {
            console.error(error);
            setLoading(false);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    const phoneChange=(value, country)=>{
        
        let finalNumber = value.replace(country.dialCode, `+${country.dialCode} `);

        setData((prevFormData) => ({
            ...prevFormData,
            'mobile_number': finalNumber
        }));
    }

    useEffect(() => {
        signPad.current.clear();
        fetchData();
    }, [])




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
        <Fragment>
        <Innerlayout>
            <div className="box-wrapper w-100 application-from">
                <div className="card-body p-0">
                    <div className="d-flex flex-wrap justify-content-between">
                        <div className="form-left">
                            <ul className="nav-tabs" id="myTab" role="tablist">
                                {/* <li className="nav-item" role="presentation">
                                    <Link className='active' id="tab-1" data-bs-toggle="tab" data-bs-target="#tab-pane-1" role="tab" aria-controls="tab-pane-1" aria-selected="false"  onClick={() => handleTabClick('emp_key')}>Required Documentation</Link>
                                </li> */}
                                <li className="nav-item" role="presentation">
                                        <Link className={activeTab === 'individual_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-1" data-bs-toggle="tab" data-bs-target="#tab-pane-1" role="tab" aria-controls="tab-pane-1" aria-selected="false">Individual Applicant</Link>
                                </li>
                                <li className="nav-item" role="presentation">
                                        <Link className={activeTab === 'emp_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-2" data-bs-toggle="tab" data-bs-target="#tab-pane-2" role="tab" aria-controls="tab-pane-2" aria-selected="false">Employment Information</Link>
                                </li>
                                <li className="nav-item" role="presentation">
                                        <Link className={activeTab === 'bank_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-3" data-bs-toggle="tab" data-bs-target="#tab-pane-3" role="tab" aria-controls="tab-pane-3" aria-selected="false">Banking Details</Link>
                                </li>
                                {/* <li className="nav-item" role="presentation">
                                    <Link className={activeTab=='finance_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-4" data-bs-toggle="tab" data-bs-target="#tab-pane-4" role="tab" aria-controls="tab-pane-4" aria-selected="false">Financial Details</Link>
                                </li> */}
                                <li className="nav-item" role="presentation">
                                        <Link className={activeTab === 'trading_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-5" data-bs-toggle="tab" data-bs-target="#tab-pane-5" role="tab" aria-controls="tab-pane-5" aria-selected="false">Trading Experience and Knowledge</Link>
                                </li>
                                {/* <li className="nav-item" role="presentation">
                                    <Link className={activeTab=='source_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-6" data-bs-toggle="tab" data-bs-target="#tab-pane-6" role="tab" aria-controls="tab-pane-6" aria-selected="false">Source of funds</Link>
                                </li> */}
                                <li className="nav-item" role="presentation">
                                        <Link className={activeTab === 'general_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-7" data-bs-toggle="tab" data-bs-target="#tab-pane-7" role="tab" aria-controls="tab-pane-7" aria-selected="false">General Disclosure</Link>
                                </li>
                                <li className="nav-item" role="presentation">
                                        <Link className={activeTab === 'declaration_key' ? 'active check_class disabled' : 'check_class disabled'} id="tab-8" data-bs-toggle="tab" data-bs-target="#tab-pane-8" role="tab" aria-controls="tab-pane-8" aria-selected="false">Client Declarations</Link>
                                </li>
                                {/* <li className="nav-item" role="presentation">
                                    <Link className="" id="tab-10" data-bs-toggle="tab" data-bs-target="#tab-pane-10" role="tab" aria-controls="tab-pane-10" aria-selected="false">Annexure A</Link>
                                </li> */}
                            </ul>
                        </div>
                        <div className="form-right">
                            <div className="tab-content" id="myTabContent">
                                    <div className={activeTab === 'individual_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-1" role="tabpanel" aria-labelledby="tab-1" tabIndex="0">
                                    <div className="p-4 label-input">
                                        <form onSubmit={individualSubmit}>
                                            <input type='hidden' name='individual_key' value='true'/>
                                            <input type='hidden' name='check_key' value='individual_key'/>
                                            <label className="mb-2"><b>Base Currency</b></label>
                                            <div className="d-flex">
                                                <div className="form-group me-3">
                                                    <input style={{ marginRight: '4px' }} type="radio" name='base_currency' id="usd" onChange={individualChange} value='USD' checked />
                                                    <label className="mr-3" htmlFor="usd">USD</label>
                                                </div>
                                                {/* <div className="form-group">
                                                    <input style={{ marginRight: '4px' }} type="radio" name='base_currency' id="eur" onChange={individualChange} value='EUR' checked={data.base_currency=="EUR"}/>
                                                    <label className="mr-3" htmlFor="eur">EUR</label>
                                                </div> */}
                                            </div>
                                            <small className="text-danger">{error.base_currency}</small>
                                            <hr/>
                                            <h2 className="mb-2"><b>Account Holder</b></h2>
                                            <div className="row form-details">
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                <div className="form-group">
                                                    <label>Title*</label>
                                                            <select className="form-control select" name='title' value={data.title} onChange={individualChange}>
                                                        <option>Select an option</option>
                                                        <option value='Mr.'>Mr.</option>
                                                        <option value='Miss'>Miss</option>
                                                        <option value='Ms.'>Ms.</option>
                                                        <option value='Mrs.'>Mrs.</option>
                                                    </select>
                                                </div>
                                                    <small className="text-danger">{error.title}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>First Name*</label>
                                                        <input type="text" name='first_name' className="form-control" placeholder="Enter first name" onChange={individualChange} value={data.first_name}/>
                                                    </div>
                                                    <small className="text-danger">{error.first_name}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Surname*</label>
                                                        <input type="text" name='surname' className="form-control" placeholder="Enter surname" onChange={individualChange} value={data.surname}/>
                                                        <small className="text-danger">{error.surname}</small>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Place of Birth*</label>
                                                        <input type="text" className="form-control" placeholder="Enter place of birth" name='birth_place' onChange={individualChange} value={data.birth_place}/>
                                                        <small className="text-danger">{error.birth_place}</small>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Nationality*</label>
                                                        <Select
                                                            name='nationality'
                                                            defaultValue={data.nationality}
                                                            value={{ value: data.nationality, label: data.nationality }}
                                                            onChange={selectChange}
                                                            options={options}
                                                            isClearable={true}
                                                        />
                                                        {/* <input type="text" className="form-control" placeholder="Enter nationality" onChange={individualChange} value={data.nationality}/> */}
                                                    </div>
                                                    <small className="text-danger">{error.nationality}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Date of Birth*</label>
                                                        <input type="date" className="form-control" placeholder="Enter date of birth" name='dob' onChange={individualChange} value={data.dob}/>
                                                    </div>
                                                    <small className="text-danger">{error.dob}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Email Address*</label>
                                                        <input type="email" className="form-control" placeholder="Enter email address" name='email' onChange={individualChange} value={data.email}/>
                                                    </div>
                                                    <small className="text-danger">{error.email}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Country of Residence*</label>
                                                        <Select
                                                            name='residence_country'
                                                            defaultValue={data.residence_country}
                                                            value={{ value: data.residence_country, label: data.residence_country }}
                                                            onChange={selectChange}
                                                            options={options}
                                                            isClearable={true}
                                                        />
                                                    </div>
                                                    <small className="text-danger">{error.residence_country}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>City*</label>
                                                        <input type="text" className="form-control" placeholder="Enter city" onChange={individualChange} name='city' value={data.city}/>
                                                    </div>
                                                    <small className="text-danger">{error.city}</small>
                                                </div>
                                                <div className="col-sm-12 col-xl-12 col-xxl-12 mb-3">
                                                    <label>Residence Address*</label>
                                                    <textarea className='form-control' onChange={individualChange} name='address_1' value={data.address_1} rows='3'></textarea>
                                                    <small className="text-danger">{error.address_1}</small>
                                                </div>
                                                {/* <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Residential Address Line 1*</label>
                                                        <input type="text" className="form-control" placeholder="Enter address" onChange={individualChange} name='address_1' value={data.address_1}/>
                                                    </div>
                                                    <small className="text-danger">{error.address_1}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Residential Address Line 2</label>
                                                        <input type="text" className="form-control" placeholder="Enter address" onChange={individualChange} name='address_2' value={data.address_2}/>
                                                    </div>
                                                    <small className="text-danger">{error.address_2}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Residential Address Line 3</label>
                                                        <input type="text" className="form-control" placeholder="Enter address" onChange={individualChange} name='address_3' value={data.address_3}/>
                                                    </div>
                                                    <small className="text-danger">{error.address_3}</small>
                                                </div> */}
                                                
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Country*</label>
                                                        <Select
                                                            name='country'
                                                            // defaultValue={{ value: data.country, label: data.country }}
                                                            value={{ value: data.country, label: data.country }}
                                                            onChange={selectChange}
                                                            options={options}
                                                            isClearable={true}
                                                        />
                                                    </div>
                                                    <small className="text-danger">{error.country}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Post code*</label>
                                                        <input type="number" className="form-control" placeholder="Enter post code" onChange={individualChange} name='postal_code' value={data.postal_code}/>
                                                    </div>
                                                    <label className='mt-1 red'>If you don't have a post code, please enter 000000.</label>
                                                    <small className="text-danger">{error.postal_code}</small>
                                                </div>
                                                <div className="col-12 mb-3">
                                                    <div className="form-group">
                                                        <label>Are you a USA citizen, Green Card holder or USA resident for tax purpose?</label>
                                                        <div className="form-group mt-2 custom_radio">
                                                                <input type="radio" id="usa-tax-yes" name="usa_citizen" onChange={individualChange} value='Yes' checked={data.usa_citizen === "Yes"} />
                                                            <label htmlFor="usa-tax-yes">Yes</label>
                                                                <input type="radio" id="usa-tax-no" name="usa_citizen" onChange={individualChange} value='No' checked={data.usa_citizen === "No"} />
                                                            <label htmlFor="usa-tax-no">No</label>
                                                        </div>
                                                    </div>
                                                    <small className="text-danger">{error.usa_citizen}</small>
                                                </div>
                                                <div className="col-12 mb-3">
                                                    <div className="form-group">
                                                        <label>Are you a Politically Exposed Person (PEP) or related to a PEP?</label>
                                                        <div className="form-group mt-2 custom_radio">
                                                                <input type="radio" id="pep-yes" name="pep_related" onChange={individualChange} value='Yes' checked={data.pep_related === "Yes"} />
                                                            <label htmlFor="pep-yes">Yes</label>
                                                                <input type="radio" id="pep-no" name="pep_related" onChange={individualChange} value='No' checked={data.pep_related === "No"} />
                                                            <label htmlFor="pep-no">No</label>
                                                        </div>
                                                    </div>
                                                    <small className="text-danger">{error.pep_related}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Landline Telephone*</label>
                                                        <input type="text" name='landline' className="form-control" placeholder="Enter landline telephone" onChange={individualChange} value={data.landline}/>
                                                    </div>
                                                    <small className="text-danger">{error.landline}</small>
                                                </div>
                                                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                                                    <div className="form-group">
                                                        <label>Mobile phone number*</label>
                                                        <PhoneInput
                                                            inputProps={{
                                                                name: 'phone',
                                                            }}

                                                            className="mb-3"
                                                                // country={selectedCountry !== null && selectedCountry}
                                                            countryCodeEditable={false}
                                                            disableDropdown={true}
                                                            value={data.mobile_number}
                                                            onChange={(value, country, e, formattedValue) => {
                                                                phoneChange(value,country)
                                                            }}
                                                        />
                                                        {/* <input type="text" name='mobile_number' className="form-control" placeholder="Enter mobile phone number" onChange={individualChange} value={data.mobile_number}/> */}
                                                    </div>
                                                    
                                                    <small className="text-danger">{error.mobile_number}</small>
                                                </div>
                                                <div className="col-12 mt-3">
                                                    <div className="buttons d-flex justify-content-between">
                                                    <button type="button" className="btn btn-light" onClick={(e)=>fillLater(e)}>Complete Later</button>
                                                            <button type="submit" disabled={disableSaveBtn} className="btn btn-primary">Save and Next</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                    <div className={activeTab === 'emp_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-2" role="tabpanel" aria-labelledby="tab-2" tabIndex="0">
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
                                                                <input type="radio" id="employed" name="emp_status" onChange={individualChange} value='Employed' checked={data.emp_status === "Employed"} />
                                                            <label htmlFor="employed">Employed</label>
                                                                <input type="radio" id="self-employed" name="emp_status" onChange={individualChange} value='Self-Employed' checked={data.emp_status === "Self-Employed"} />
                                                            <label htmlFor="self-employed">Self-Employed</label>
                                                                <input type="radio" id="unemployed" name="emp_status" onChange={individualChange} value='Unemployed' checked={data.emp_status === "Unemployed"} />
                                                            <label htmlFor="unemployed">Unemployed</label>
                                                                <input type="radio" id="retired" name="emp_status" onChange={individualChange} value='Retired' checked={data.emp_status === "Retired"} />
                                                            <label htmlFor="retired">Retired</label>
                                                                <input type="radio" id="student" name="emp_status" onChange={individualChange} value='Student' checked={data.emp_status === "Student"} />
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
                                                                <input type="radio" id="employer-yes" value='Yes' name="company_by_fsc" onChange={individualChange} checked={data.company_by_fsc === "Yes"} />
                                                            <label htmlFor="employer-yes" >Yes</label>
                                                                <input type="radio" id="employer-no" value='No' name="company_by_fsc" onChange={individualChange} checked={data.company_by_fsc === "No"} />
                                                            <label htmlFor="employer-no">No</label>
                                                        </div>
                                                    </div>
                                                    <small className="text-danger">{error.company_by_fsc}</small>
                                                </div>
                                                {
                                                        data.company_by_fsc === "Yes" && 
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
                                                                <input type="radio" id="hedging" name="investment_objective" onChange={individualChange} value='Hedging' checked={data.investment_objective === "Hedging"} />
                                                            <label htmlFor="hedging">Hedging</label>
                                                                <input type="radio" id="trading" name="investment_objective" onChange={individualChange} value='Trading' checked={data.investment_objective === "Trading"} />
                                                            <label htmlFor="trading">Trading</label>
                                                                <input type="radio" id="investment" name="investment_objective" onChange={individualChange} value='Investment' checked={data.investment_objective === "Investment"} />
                                                            <label htmlFor="investment">Investment</label>
                                                                <input type="radio" id="other" name="investment_objective" onChange={individualChange} value='Others' checked={data.investment_objective === "Others"} />
                                                            <label htmlFor="other">Others</label>
                                                        </div>
                                                    </div>
                                                    <small className="text-danger">{error.investment_objective}</small>
                                                </div>
                                                {
                                                        data.investment_objective === 'Others' && 
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
                                                                <input type="radio" id="others-yes" name="others" onChange={individualChange} value='Yes' checked={data.others === "Yes"} />
                                                            <label htmlFor="others-yes">Yes</label>
                                                                <input type="radio" id="others-no" name="others" onChange={individualChange} value='No' checked={data.others === "No"} />
                                                            <label htmlFor="others-no">No</label>
                                                        </div>
                                                        <small className="text-danger">{error.others}</small>
                                                    </div>
                                                </div>
                                                {
                                                        data.others === "Yes" && 
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
                                </div>
                                    <div className={activeTab === 'bank_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-3" role="tabpanel" aria-labelledby="tab-3" tabIndex="0">
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
                                </div>
                                    <div className={activeTab === 'finance_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-4" role="tabpanel" aria-labelledby="tab-4" tabIndex="0">
                                    <div className="p-4 label-input">
                                        <form onSubmit={individualSubmit}>
                                            <input type='hidden' name='finance_key' value='true'/>
                                            <input type='hidden' name='check_key' value='finance_key'/>
                                            <h2 className="mb-3"><b>Financial Details</b></h2>
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
                                                                <input type="radio" id="hedging" name="investment_objective" onChange={individualChange} value='Hedging' checked={data.investment_objective === "Hedging"} />
                                                            <label htmlFor="hedging">Hedging</label>
                                                                <input type="radio" id="trading" name="investment_objective" onChange={individualChange} value='Trading' checked={data.investment_objective === "Trading"} />
                                                            <label htmlFor="trading">Trading</label>
                                                                <input type="radio" id="investment" name="investment_objective" onChange={individualChange} value='Investment' checked={data.investment_objective === "Investment"} />
                                                            <label htmlFor="investment">Investment</label>
                                                                <input type="radio" id="other" name="investment_objective" onChange={individualChange} value='Others' checked={data.investment_objective === "Others"} />
                                                            <label htmlFor="other">Others</label>
                                                        </div>
                                                    </div>
                                                    <small className="text-danger">{error.investment_objective}</small>
                                                </div>
                                                {
                                                        data.investment_objective === 'Others' && 
                                                    <div className="col-12 mb-3">
                                                        <div className="form-group">
                                                            <label>Please provide details</label>
                                                            <textarea className="form-control" name="investment_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.investment_details} onChange={individualChange}></textarea>
                                                        </div>
                                                        <small className="text-danger">{error.investment_details}</small>
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
                                </div>
                                    <div className={activeTab === 'trading_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-5" role="tabpanel" aria-labelledby="tab-5" tabIndex="0">
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
                                                                <input type="radio" id="risk-yes" name="risk_of_trading" onChange={individualChange} value='Yes' checked={data.risk_of_trading === "Yes"} />
                                                            <label htmlFor="risk-yes">Yes</label>
                                                                <input type="radio" id="risk-no" name="risk_of_trading" onChange={individualChange} value='No' checked={data.risk_of_trading === "No"} />
                                                            <label htmlFor="risk-no">No</label>
                                                        </div>
                                                        {
                                                                data.risk_of_trading === "No" &&
                                                                <span className='mt-1 d-block'>Please refer to this document for more information <a style={{ color: '#00aeff' }} href='https://pmfinancials.mu/pdf/Risk_Disclosure.pdf' rel="noreferrer" target='_blank'>Risk Disclosure</a></span>
                                                        }
                                                    </div>
                                                    <small className="text-danger">{error.risk_of_trading}</small>
                                                </div>
                                                <div className="col-12"><hr/></div>
                                                <div className="col-12">
                                                    <div className="form-group mb-3">
                                                        <label>How many years trading experience you have?*</label>
                                                        <div className="form-group mt-2 custom_radio">
                                                                <input type="radio" id="securities-0" name="trading_experience" onChange={individualChange} value='Less than 1 year' checked={data.trading_experience === "Less than 1 year"} />
                                                            <label htmlFor="securities-0">Less than 1 year</label>
                                                                <input type="radio" id="securities-1" name="trading_experience" onChange={individualChange} value='1 year' checked={data.trading_experience === "1 year"} />
                                                            <label htmlFor="securities-1">1 year</label>
                                                                <input type="radio" id="securities-1to3" name="trading_experience" onChange={individualChange} value='1 to 3 years' checked={data.trading_experience === "1 to 3 years"} />
                                                            <label htmlFor="securities-1to3">1 to 3 years</label>
                                                                <input type="radio" id="securities-3" name="trading_experience" onChange={individualChange} value='More than 3 years' checked={data.trading_experience === "More than 3 years"} />
                                                            <label htmlFor="securities-3">More than 3 years</label>
                                                        </div>
                                                        <small className="text-danger">{error.trading_experience}</small>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Frequency of trades?*</label>
                                                        <div className="form-group mt-2 custom_radio">
                                                                <input type="radio" id="securities-daily" name="trading_experience_ft" onChange={individualChange} value='Daily' checked={data.trading_experience_ft === "Daily"} />
                                                            <label htmlFor="securities-daily">Daily</label>
                                                                <input type="radio" id="securities-weekly" name="trading_experience_ft" onChange={individualChange} value='Weekly' checked={data.trading_experience_ft === "Weekly"} />
                                                            <label htmlFor="securities-weekly">Weekly</label>
                                                                <input type="radio" id="securities-monthly" name="trading_experience_ft" onChange={individualChange} value='Monthly' checked={data.trading_experience_ft === "Monthly"} />
                                                            <label htmlFor="securities-monthly">Monthly</label>
                                                                <input type="radio" id="securities-yearly" name="trading_experience_ft" onChange={individualChange} value='Yearly' checked={data.trading_experience_ft === "Yearly"} />
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
                                                                <input type="radio" id="derivatives-0" name="trading_derivatives" onChange={individualChange} value='Less than 1 year' checked={data.trading_derivatives === "Less than 1 year"} />
                                                            <label htmlFor="derivatives-0">Less than 1 year</label>
                                                                <input type="radio" id="derivatives-1" name="trading_derivatives" onChange={individualChange} value='1 year' checked={data.trading_derivatives === "1 year"} />
                                                            <label htmlFor="derivatives-1">1 year</label>
                                                                <input type="radio" id="derivatives-1to3" name="trading_derivatives" onChange={individualChange} value='1 to 3 years' checked={data.trading_derivatives === "1 to 3 years"} />
                                                            <label htmlFor="derivatives-1to3">1 to 3 years</label>
                                                                <input type="radio" id="derivatives-3" name="trading_derivatives" onChange={individualChange} value='More than 3 years' checked={data.trading_derivatives === "More than 3 years"} />
                                                            <label htmlFor="derivatives-3">More than 3 years</label>
                                                        </div>
                                                        <small className="text-danger">{error.trading_derivatives}</small>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Frequency of trades?*</label>
                                                        <div className="form-group mt-2 custom_radio">
                                                                <input type="radio" id="derivatives-daily" name="derivatives_ft" onChange={individualChange} value='Daily' checked={data.derivatives_ft === "Daily"} />
                                                            <label htmlFor="derivatives-daily">Daily</label>
                                                                <input type="radio" id="derivatives-weekly" name="derivatives_ft" onChange={individualChange} value='Weekly' checked={data.derivatives_ft === "Weekly"} />
                                                            <label htmlFor="derivatives-weekly">Weekly</label>
                                                                <input type="radio" id="derivatives-monthly" name="derivatives_ft" onChange={individualChange} value='Monthly' checked={data.derivatives_ft === "Monthly"} />
                                                            <label htmlFor="derivatives-monthly">Monthly</label>
                                                                <input type="radio" id="derivatives-yearly" name="derivatives_ft" onChange={individualChange} value='Yearly' checked={data.derivatives_ft === "Yearly"} />
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
                                                                <input type="radio" id="cfds-0" name="trading_in_cfd" onChange={individualChange} value='Less than 1 year' checked={data.trading_in_cfd === "Less than 1 year"} />
                                                            <label htmlFor="cfds-0">Less than 1 year</label>
                                                                <input type="radio" id="cfds-1" name="trading_in_cfd" onChange={individualChange} value='1 year' checked={data.trading_in_cfd === "1 year"} />
                                                            <label htmlFor="cfds-1">1 year</label>
                                                                <input type="radio" id="cfds-1to3" name="trading_in_cfd" onChange={individualChange} value='1 to 3 years' checked={data.trading_in_cfd === "1 to 3 years"} />
                                                            <label htmlFor="cfds-1to3">1 to 3 years</label>
                                                                <input type="radio" id="cfds-3" name="trading_in_cfd" onChange={individualChange} value='More than 3 years' checked={data.trading_in_cfd === "More than 3 years"} />
                                                            <label htmlFor="cfds-3">More than 3 years</label>
                                                        </div>
                                                        <small className="text-danger">{error.trading_in_cfd}</small>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Frequency of trades?*</label>
                                                        <div className="form-group mt-2 custom_radio">
                                                                <input type="radio" id="cfds-daily" name="cfd_ft" onChange={individualChange} value='Daily' checked={data.cfd_ft === "Daily"} />
                                                            <label htmlFor="cfds-daily">Daily</label>
                                                                <input type="radio" id="cfds-weekly" name="cfd_ft" onChange={individualChange} value='Weekly' checked={data.cfd_ft === "Weekly"} />
                                                            <label htmlFor="cfds-weekly">Weekly</label>
                                                                <input type="radio" id="cfds-monthly" name="cfd_ft" onChange={individualChange} value='Monthly' checked={data.cfd_ft === "Monthly"} />
                                                            <label htmlFor="cfds-monthly">Monthly</label>
                                                                <input type="radio" id="cfds-yearly" name="cfd_ft" onChange={individualChange} value='Yearly' checked={data.cfd_ft === "Yearly"} />
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
                                </div>
                                    <div className={activeTab === 'source_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-6" role="tabpanel" aria-labelledby="tab-6" tabIndex="0">
                                    <div className="p-4 label-input">
                                        <form onSubmit={individualSubmit}>
                                            <input type='hidden' name='source_key' value='true'/>
                                            <input type='hidden' name='check_key' value='source_key'/>

                                            <h2 className="mb-3"><b>Source of funds (Please tick the most relevant answer)</b></h2>
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
                                                                <input type="radio" id="others-yes" name="others" onChange={individualChange} value='Yes' checked={data.others === "Yes"} />
                                                            <label htmlFor="others-yes">Yes</label>
                                                                <input type="radio" id="others-no" name="others" onChange={individualChange} value='No' checked={data.others === "No"} />
                                                            <label htmlFor="others-no">No</label>
                                                        </div>
                                                        <small className="text-danger">{error.others}</small>
                                                    </div>
                                                </div>
                                                {
                                                        data.others === "Yes" && 
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
                                </div>
                                    <div className={activeTab === 'general_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-7" role="tabpanel" aria-labelledby="tab-7" tabIndex="0">
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
                                                                <input type="radio" id="general-disclosure-1-yes" name="legal_status_clear" onChange={individualChange} value='Yes' checked={data.legal_status_clear === "Yes"} />
                                                            <label htmlFor="general-disclosure-1-yes">Yes</label>
                                                                <input type="radio" id="general-disclosure-1-no" name="legal_status_clear" onChange={individualChange} value='No' checked={data.legal_status_clear === "No"} />
                                                            <label htmlFor="general-disclosure-1-no">No</label>
                                                        </div>
                                                        <small className="text-danger">{error.legal_status_clear}</small>
                                                    </div>
                                                    {
                                                            data.legal_status_clear === 'Yes' && 
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
                                                                <input type="radio" id="general-disclosure-2-yes" name="poa_intent" onChange={individualChange} value='Yes' checked={data.poa_intent === "Yes"} />
                                                            <label htmlFor="general-disclosure-2-yes">Yes</label>
                                                                <input type="radio" id="general-disclosure-2-no" name="poa_intent" onChange={individualChange} value='No' checked={data.poa_intent === "No"} />
                                                            <label htmlFor="general-disclosure-2-no">No</label>
                                                        </div>
                                                        <small className="text-danger">{error.poa_intent}</small>
                                                    </div>
                                                    {
                                                            data.poa_intent === 'Yes' && 
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
                                                                <input type="radio" id="general-disclosure-3-yes" name="financial_industry_affiliation" onChange={individualChange} value='Yes' checked={data.financial_industry_affiliation === "Yes"} />
                                                            <label htmlFor="general-disclosure-3-yes">Yes</label>
                                                                <input type="radio" id="general-disclosure-3-no" name="financial_industry_affiliation" onChange={individualChange} value='No' checked={data.financial_industry_affiliation === "No"} />
                                                            <label htmlFor="general-disclosure-3-no">No</label>
                                                        </div>
                                                        <small className="text-danger">{error.financial_industry_affiliation}</small>
                                                    </div>
                                                    {
                                                            data.financial_industry_affiliation === 'Yes' && 
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
                                                                <input type="radio" id="general-disclosure-4-yes" name="criminal_convictions" onChange={individualChange} value='Yes' checked={data.criminal_convictions === "Yes"} />
                                                            <label htmlFor="general-disclosure-4-yes">Yes</label>
                                                                <input type="radio" id="general-disclosure-4-no" name="criminal_convictions" onChange={individualChange} value='No' checked={data.criminal_convictions === "No"} />
                                                            <label htmlFor="general-disclosure-4-no">No</label>
                                                        </div>
                                                        <small className="text-danger">{error.criminal_convictions}</small>
                                                    </div>
                                                    {
                                                            data.criminal_convictions === 'Yes' && 
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
                                                                <input type="radio" id="general-disclosure-5-yes" name="external_control" onChange={individualChange} value='Yes' checked={data.external_control === "Yes"} />
                                                            <label htmlFor="general-disclosure-5-yes">Yes</label>
                                                                <input type="radio" id="general-disclosure-5-no" name="external_control" onChange={individualChange} value='No' checked={data.external_control === "No"} />
                                                            <label htmlFor="general-disclosure-5-no">No</label>
                                                        </div>
                                                        <small className="text-danger">{error.external_control}</small>
                                                    </div>
                                                    {
                                                            data.external_control === 'Yes' && 
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
                                </div>
                                    <div className={activeTab === 'declaration_key' ? 'show active tab-pane fade ' : 'tab-pane fade '} id="tab-pane-8" role="tabpanel" aria-labelledby="tab-8" tabIndex="0">
                                    <div className="p-4 label-input">
                                        <form onSubmit={individualSubmit}>
                                            <input type='hidden' name='declaration_key' value='true'/>
                                            <input type='hidden' name='check_key' value='declaration_key'/>
                                            
                                            <h2 className="mb-3"><b>Client Declarations</b></h2>
                                            <div className="row form-details">
                                                <div className="col-12">
                                                    <div className="form-group cd-label">
                                                        <input style={{ marginRight: '8px' }} type="checkbox" id="declare" name='disclosure_details' onChange={individualChange} checked={data.disclosure_details} required/>
                                                        <label className="mr-3" htmlFor="declare"><b>I declare that:</b></label>
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
                                                        <label className="mr-3" htmlFor="personal-information"><b>I acknowledge and consent to personal information submitted by me to PM Financials Ltd:</b></label>
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
                                                        <label className="mr-3" htmlFor="signature"><b>I declare by our signature:</b></label>
                                                    </div>
                                                    <small className="text-danger">{error.consent_personal_information}</small>
                                                    <ul className="number-style">
                                                        <li>To have carefully and understood and agree to be bound by the PM Financials Ltd; 
                                                                <br />(a) <a href='https://pmfinancials.mu/pdf/PMFL-Terms_and_conditions.pdf' target='_blank' className='link-text' rel="noreferrer">Client Agreement </a>
                                                                <br />(b) <a href='https://pmfinancials.mu/pdf/Privacy%20_Policy.pdf' target='_blank' rel="noreferrer" className='link-text'>Privacy Policy</a>
                                                        {/* <br/>(c) Best Execution Policy 
                                                        <br/>(d) Regulations htmlFor Non-Trading Operations  */}
                                                                <br />(c) <a href='https://pmfinancials.mu/pdf/Complaints_Policy.pdf' target='_blank' rel="noreferrer" className='link-text'>Complaint Policy </a>
                                                                <br />(d) <a href='https://pmfinancials.mu/pdf/Risk_Disclosure.pdf' target='_blank' rel="noreferrer" className='link-text'>Risk Disclosure Policy</a>
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
                                                            <button className="btn btn-primary border mt-2" onClick={(e) => clearSignpad(e)}>Clear</button>
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
                                </div>
                                    {/* <div className="tab-pane fade" id="tab-pane-10" role="tabpanel" aria-labelledby="tab-10"tabIndex="0">
                                    <div className="p-4 label-input">
                                        <form action="">
                                            <h2 className="mb-3"><b>Annexure A</b></h2>
                                            <div className="row form-details">
                                                <div className="col-12 mb-3">
                                                    <p> The following <u><b>certified true copy documents</b></u> must accompany PM Financials Ltd Individual Application Form:</p>
                                                    <p><b> Proof of Identification</b></p>
                                                    <ol type="I" className="upper-roman">
                                                        <li>Valid Passport (identification and signature page required); or</li>
                                                        <li>Valid Driver's License; or</li>
                                                        <li>Valid National Identity Card.</li>
                                                    </ol>
                                                    <br/>
                                                    <p><b> Proof of address</b></p>
                                                    <p className="mb-1">This acceptable document must be recent (less than 3 months old), valid showing client's full name and current residential address.</p>
                                                    <p className="mb-1">Types of acceptable documents;</p>
                                                    <ol type="I" className="upper-roman">
                                                        <li>Valid Passport (identification and signature page required); or</li>
                                                        <li>Valid Driver's License; or</li>
                                                        <li>Valid National Identity Card.</li>
                                                    </ol>
                                                    <br/>
                                                    <ul className="list-style">
                                                        <li>Please be aware that the same document cannot be used as proof of identity and proof of address. Two separate documents must be provided.</li>
                                                        <li>PM Financials Ltd reserves the right to request for additional Enhance Due Diligence.</li>
                                                    </ul>
                                                </div>
                                                <div className="col-12 mt-3">
                                                    <div className="buttons d-flex">
                                                        <button type="submit" className="btn btn-light">Back</button><button type="submit" className="btn btn-primary">Save and Next</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Innerlayout>
        </Fragment>
    )
}

export default IndividualForm
