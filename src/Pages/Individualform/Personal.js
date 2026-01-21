import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import PropagateLoader from "react-spinners/PropagateLoader";
import Select from 'react-select';
import CountryArr from '../../Components/CountryArr';
import PhoneInput from 'react-phone-input-2';

const base_url = process.env.REACT_APP_API_URL;
const STORE_INDIVIDUAL_FORM_API = base_url+"/v1/client/store-individualform";
const FETCH_INDIVIDUAL_FORM_API = base_url+"/v1/client/fetch-individualform";

function Personal({setActiveTab, activeTab}) {

    const client = useSelector(showClient);
    if (client.client.login === false)
    {
        dispatch(redirectAsync());
    }

    let history = useHistory();
    const dispatch = useDispatch();

    const countries = CountryArr();

    let selectCountr = countries.find(country => country.label == client.client.country);

    let mobile_numbers = selectCountr?.countrycode+client.client.phone_no;

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
        'mobile_number': mobile_numbers,
    });

    let [number, setNumber] = useState(mobile_numbers);
    let [selectedCountry, setSelectedCountry] = useState(null);

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

    const selectChange=(e, attrib)=>{
        const inputName = attrib.name;

        setData((prevFormData) => ({
            ...prevFormData,
            [inputName]: e.label
        }));

        if(inputName=='residence_country'){
            setSelectedCountry(e.value);
        }
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
                key: "individual_key"
            };
            const response = await axios.post(FETCH_INDIVIDUAL_FORM_API, bodyParameters, config)

            setData((prevFormData) => ({
                ...prevFormData,
                ...response.data.data,
            }));

            let countri = (response.data.data.residence_country=='' || response.data.data.residence_country==null) ? client.client.residence_country : response.data.data.residence_country;
            
            let selectCountrs = countries.find(country => country.label == countri);
            setSelectedCountry(selectCountrs.value);

            setData((prevFormData) => ({
                ...prevFormData,
                'country':countri
            }));

            let contactNumber = (response.data.data.mobile_number=='' || response.data.data.mobile_number==null) ? client.client.phone_no : response.data.data.mobile_number;

            setTimeout(() => {
                setNumber(selectCountrs.countrycode+contactNumber);
            },3000);

            setLoading(false);

        } catch (error) {
            console.error(error);
            setLoading(false);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    const phoneChange=(value, country)=>{
        setNumber(value);

        let finalNumber = value.replace(selectCountr.countrycode, '');

        setData((prevFormData) => ({
            ...prevFormData,
            'mobile_number': finalNumber
        }));
    }

    useEffect(() => {
        fetchData();
    },[]);

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
            <input type='hidden' name='individual_key' value='true'/>
            <input type='hidden' name='check_key' value='individual_key'/>
            <label className="mb-2"><b>Base Currency</b></label>
            <div className="d-flex">
                <div className="form-group me-3">
                    <input style={{ marginRight: '4px' }} type="radio" name='base_currency' id="usd" onChange={individualChange} value='USD' checked />
                    <label className="mr-3" for="usd">USD</label>
                </div>
                {/* <div className="form-group">
                    <input style={{ marginRight: '4px' }} type="radio" name='base_currency' id="eur" onChange={individualChange} value='EUR' checked={data.base_currency=="EUR"}/>
                    <label className="mr-3" for="eur">EUR</label>
                </div> */}
            </div>
            <small className="text-danger">{error.base_currency}</small>
            <hr/>
            <h2 className="mb-2"><b>Account Holder</b></h2>
            <div className="row form-details">
                <div className="col-sm-6 col-xl-6 col-xxl-4 mb-3">
                <div className="form-group">
                    <label>Title*</label>
                    <select class="form-control select" name='title' value={data.title} onChange={individualChange}>
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
                            <input type="radio" id="usa-tax-yes" name="usa_citizen" onChange={individualChange} value='Yes' checked={data.usa_citizen=="Yes"}/>
                            <label for="usa-tax-yes">Yes</label>
                            <input type="radio" id="usa-tax-no" name="usa_citizen" onChange={individualChange} value='No' checked={data.usa_citizen=="No"}/>
                            <label for="usa-tax-no">No</label>
                        </div>
                    </div>
                    <small className="text-danger">{error.usa_citizen}</small>
                </div>
                <div className="col-12 mb-3">
                    <div className="form-group">
                        <label>Are you a Politically Exposed Person (PEP) or related to a PEP?</label>
                        <div className="form-group mt-2 custom_radio">
                            <input type="radio" id="pep-yes" name="pep_related" onChange={individualChange} value='Yes' checked={data.pep_related=="Yes"}/>
                            <label for="pep-yes">Yes</label>
                            <input type="radio" id="pep-no" name="pep_related" onChange={individualChange} value='No' checked={data.pep_related=="No"}/>
                            <label for="pep-no">No</label>
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
                            country={selectedCountry!=null && selectedCountry}
                            countryCodeEditable={false}
                            disableDropdown={true}
                            value={number}
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
                    <button type="submit" className="btn btn-primary">Save and Next</button>
                    </div>
                </div>
            </div>
        </form>
        </div>
    )
}

export default Personal
