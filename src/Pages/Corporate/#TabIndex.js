import Comanyinfo from "./Companyinfo";
import Directors from "./Directors";
import Shareholder from "./Shareholder";
import PropagateLoader from "react-spinners/PropagateLoader";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Account from "./Account";
import Banking from "./Banking";
import Income from "./Income";
import Trading from "./Trading";
import Fund from "./Fund";
import Disclosure from "./Disclosure";
import Declarations from "./Declarations";
import { showClient } from '../../store/clientslice';
import { useHistory } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from "axios";

const base_url = process.env.REACT_APP_API_URL;
const STORE_CORPORATE_FORM_API = base_url+"/v1/client/store-corporateform";
const GET_CORPORATE_FORM_API = base_url+"/v1/client/get-corporatedata";

const Tabcontent = () => {

    const [state, setState] = useState("company");
    const tabKeys = ['company', 'sole', 'ubo', 'auth', 'banking', 'income', 'trading', 'fund', 'disclosure', 'declaration'];
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const client = useSelector(showClient);
    let history = useHistory();

    //Naidish Change
    const [directorData, setDirectorData] = useState([{
        'full_name': '',
        'dob': '',
        'nationality': '',
        'passport': '',
        'passport_exp_date': '',
        'usa_citizen': '',
        'pep_related': '',
        'address_1': '',
        'address_2': '',
        'address_3': '',
        'town': '',
        'city': '',
        'country': '',
        'postal_code': '',
        'residence_country': '',
        'email': '',
        'landline': '',
        'mobile_number': ''
    }]);

    const [shareholderData, setShareholderData] = useState([{
        'full_name': '',
        'surname': '',
        'dob': '',
        'nationality': '',
        'passport': '',
        'passport_exp_date': '',
        'usa_citizen': '',
        'pep_related': '',
        'address_1': '',
        'address_2': '',
        'address_3': '',
        'town': '',
        'city': '',
        'country': '',
        'postal_code': '',
        'residence_country': '',
        'email': '',
        'landline': '',
        'mobile_number': ''
    }])

    let signpad = useRef([]);
    //Naidish Change End

    const [data, setData] = useState({
        'check_key':'',
        'client_id': client.client.id,
        'base_currency': 'USD',
        'business_name': '',
        'registration_number': '',
        'date_of_incorporation': '',
        'country_of_incorporation': '',
        'trading_name': '',
        'nature_of_business': '',
        'company_address_1': '',
        'company_address_2': '',
        'company_address_3': '',
        'town': '',
        'company_city': '',
        'company_postal_code': '',
        'financial_services_regulator': '',
        'financial_services_regulator_name': '',
        'company_landline': '',
        'company_mobile_number': '',
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
        'latest_financial_statement': '',
        'risk_of_trading': '',
        'trading_experience': '',
        'trading_experience_ft': '',
        'trading_derivatives': '',
        'derivatives_ft': '',
        'trading_in_cfd': '',
        'cfd_ft': '',
        'commercial_activities': '',
        'third_party_funds': '',
        'another_brokerage': '',
        'loan': '',
        'others': '',
        'source_details': '',
        'legal_actions': '',
        'legal_status_details': '',
        'past_sanctions': '',
        'past_sanctions_details': '',
        'criminal_conviction': '',
        'criminal_conviction_details': '',
        'government_actions': '',
        'government_actions_details': '',
        'past_complaints': '',
        'past_complaints_details': '',
        'third_party_control': '',
        'third_party_control_details': '',
        'general_details': '',
        'collective_declaration': '',
        'info_consent': '',
        'signature_declaration': '',
        'on_behalf': '',
        'sole_signature_path': [],
        'director_name': '',
        'signature_date': '',
        'auth0': true,
        'auth1': false,
        'auth2':false,
        'auth3': false,
        'sole': [],
        'ubo': [],
        'auth': [
            {
                'first_name': '',
                'surname': '',
                'dob': '',
                'nationality': '',
                'passport': '',
                'passport_exp_date': '',
                'usa_citizen': '',
                'pep_related': '',
                'address_1': '',
                'address_2': '',
                'address_3': '',
                'town': '',
                'city': '',
                'country': '',
                'postal_code': '',
                'residence_country': '',
                'email': '',
                'landline': '',
                'mobile_number': ''
            },
            {
                'first_name': '',
                'surname': '',
                'dob': '',
                'nationality': '',
                'passport': '',
                'passport_exp_date': '',
                'usa_citizen': '',
                'pep_related': '',
                'address_1': '',
                'address_2': '',
                'address_3': '',
                'town': '',
                'city': '',
                'country': '',
                'postal_code': '',
                'residence_country': '',
                'email': '',
                'landline': '',
                'mobile_number': ''
            },
            {
                'first_name': '',
                'surname': '',
                'dob': '',
                'nationality': '',
                'passport': '',
                'passport_exp_date': '',
                'usa_citizen': '',
                'pep_related': '',
                'address_1': '',
                'address_2': '',
                'address_3': '',
                'town': '',
                'city': '',
                'country': '',
                'postal_code': '',
                'residence_country': '',
                'email': '',
                'landline': '',
                'mobile_number': ''
            },
            {
                'first_name': '',
                'surname': '',
                'dob': '',
                'nationality': '',
                'passport': '',
                'passport_exp_date': '',
                'pep_related': '',
                'address_1': '',
                'address_2': '',
                'address_3': '',
                'town': '',
                'city': '',
                'country': '',
                'postal_code': '',
                'residence_country': '',
                'email': '',
                'landline': '',
                'mobile_number': ''
            }
        ],
    });

    const fillLater=(e)=>{
        e.preventDefault();
        history.push('/dashboard');
    }

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
    
            await axios.post(GET_CORPORATE_FORM_API, {}, config).then((res)=>{
                if(res.data.status_code===200){
                    console.log(res.data);
                    // setData(...data,...res.data.data);
                    setData((prevFormData) => ({
                        ...prevFormData,
                        ...res.data.data
                    }));

                    setDirectorData([...res.data.data.sole]);
                    setShareholderData([...res.data.data.ubo]);
                    
                }
                else if(res.data.status_code==500){
                    console.log(res);
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data.errors);
                    setError(error.response.data.errors);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
        console.log('calll');
    }, []);

    function handleChanger(e){
        console.log(e.target);
        console.log(e);
        console.log(e.target.name+' '+e.target.value);

        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        console.log('Name='+name);
        if(name === 'legal_actions')
        {
            setData((prevFormData) => ({
                ...prevFormData,
                ['legal_status_details']: ''
            }));
            
        }
        if(name === 'past_sanctions')
        {
            setData((prevFormData) => ({
                ...prevFormData,
                ['past_sanctions_details']: ''
            }));
            
        }
        if(name === 'criminal_conviction')
        {
            setData((prevFormData) => ({
                ...prevFormData,
                ['criminal_conviction_details']: ''
            }));
            
        }
        if(name === 'past_complaints')
        {
            setData((prevFormData) => ({
                ...prevFormData,
                ['past_complaints_details']: ''
            }));
            
        }
        if(name === 'government_actions')
        {
            setData((prevFormData) => ({
                ...prevFormData,
                ['government_actions_details']: ''
            }));
            
        }
        if(name === 'third_party_control')
        {
            setData((prevFormData) => ({
                ...prevFormData,
                ['third_party_control_details']: ''
            }));
            
        }
        if(name === 'financial_services_regulator')
        {
            setData((prevFormData) => ({
                ...prevFormData,
                ['financial_services_regulator_name']: ''
            }));
            
        }
        if(name === 'others')
        {
            setData((prevFormData) => ({
                ...prevFormData,
                ['source_details']: ''
            }));
            
        }
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
    }

    const phoneChanger = (value, country, field, formattedValue, i, key) => {
        console.log(field,key,value);
        if (key == 'company') {
            console.log(field);
            setData((prevFormData) => ({
                ...prevFormData,
                [field]: value.replace(country.dialCode, `+${country.dialCode} `)
            }));
        } else if (key == 'sole') {

            let newdirectorData = [...directorData]
            newdirectorData[i][field] = value.replace(country.dialCode, `+${country.dialCode} `)
            setDirectorData(newdirectorData);

        } else if (key == 'ubo') {

            let newshareholderData = [...shareholderData]

            newshareholderData[i][field] = value.replace(country.dialCode, `+${country.dialCode} `)
            setShareholderData(newshareholderData)
        } else if (key.type == "auth") {

            let authData = [...data.auth];
            authData[key.sub_type][key.field] = value;

            setData(prevFormData => ({
                ...prevFormData,
                auth: [...authData]
            }));

            setTimeout(() => {
                console.log(data);
            }, 2000);
        }
    }

    const selectChange=(e, attrib)=>{
        const inputName = attrib.name;
        console.log(attrib);
        console.log(e.label);

        setData((prevFormData) => ({
            ...prevFormData,
            [inputName]: e.label
        }));
    }

    const backEvent=(e)=>{
        e.preventDefault();
        const currentIndex = tabKeys.indexOf(state);
        if (currentIndex > 0) {
            setState(tabKeys[currentIndex - 1]);
        }
    }

    function authChanger(type, sub_type, field, value) {


        if (type == null && field == null) {

            if (value != null) {
                let authData = [...data.auth];

                for (const key in data[value.key][value.index]) {
                    if (Object.hasOwnProperty.call(data[value.key][value.index], key)) {
                        authData[sub_type] = {
                            ...authData[sub_type],
                            [key]: data[value.key][value.index][key]
                        }

                    }
                }
                setData(prevFormData => ({
                    ...prevFormData,
                    auth: [...authData]
                }));

            } else {
                let authData = [...data.auth];
                for (const key in data.sole[0]) {
                    if (Object.hasOwnProperty.call(data.sole[0], key)) {
                        authData[sub_type] = {
                            ...authData[sub_type],
                            [key]: ''
                        };
                    }
                }
                setData(prevFormData => ({
                    ...prevFormData,
                    auth: [...authData]
                }));
            }
        } else {
            console.log(type, sub_type)
            let authData = [...data.auth];
            authData[sub_type][field] = value;

            setData(prevFormData => ({
                ...prevFormData,
                auth: [...authData]
            }));
        }


    }

    //Naidish Change

    //Details of Directors

    const addDirectorForm = () => {
        setDirectorData([...directorData, {
            'full_name': '',
            'dob': '',
            'nationality': '',
            'passport': '',
            'passport_exp_date': '',
            'pep_related': '',
            'address_1': '',
            'address_2': '',
            'address_3': '',
            'town': '',
            'city': '',
            'country': '',
            'postal_code': '',
            'residence_country': '',
            'email': '',
            'landline': '',
            'usa_citizen': "",
            'mobile_number': ''
        }])
    }



    const removeDirectorForm = (i) => {
        const newdirectorData = [...directorData]
        newdirectorData.splice(i, 1)
        setDirectorData(newdirectorData);

        setError({});
    }

    const onChangeDirectorData = (e, i, sole) => {

        console.log("eeeee", i, e);

        let newdirectorData = [...directorData]

        newdirectorData[i][e.target.name] = e.target.value

        setDirectorData(newdirectorData)
    }
    const onChangeDirectorCountry = (e, i, name) => {

        console.log("country", i, e,name);

        let newdirectorData = [...directorData];

        newdirectorData[i][name] = e.label;

        setDirectorData(newdirectorData);
        console.log("director="+JSON.stringify(directorData));
    }
    const onChangeUBOCountry = (e, i, name) => {

        console.log("country", i, e,name);

        let newshareholderData = [...shareholderData]

        newshareholderData[i][name] = e.label

        setShareholderData(newshareholderData)
        console.log("director="+JSON.stringify(shareholderData));
    }
    //Details of Shareholders
    const addShareholderForm = () => {
        setShareholderData([...shareholderData, {
            'full_name': '',
            'dob': '',
            'nationality': '',
            'passport': '',
            'passport_exp_date': '',
            'usa_citizen': '',
            'pep_related': '',
            'address_1': '',
            'address_2': '',
            'address_3': '',
            'town': '',
            'city': '',
            'country': '',
            'postal_code': '',
            'residence_country': '',
            'email': '',
            'landline': '',
            'mobile_number': ''
        }])
    }

    const removeShareholderForm = (i) => {
        const newshareholderData = [...shareholderData]
        newshareholderData.splice(i, 1)
        setShareholderData(newshareholderData);

        setError({});
    }

    const onChangeShareholderData = (e, i, key) => {

        if (key == "setdirector_details") {

            if (e != null) {
                let newshareholderData = [...shareholderData];

                for (const key in directorData[e.value]) {
                    if (Object.hasOwnProperty.call(directorData[e.value], key)) {
                        newshareholderData[i] = {
                            ...newshareholderData[i],
                            [key]: directorData[e.value][key]
                        };
                    }
                }

                setShareholderData(newshareholderData);
            } else {
                let newshareholderData = [...shareholderData];
                for (const key in newshareholderData[i]) {
                    if (Object.hasOwnProperty.call(directorData[0], key)) {
                        newshareholderData[i] = {
                            ...newshareholderData[i],
                            [key]: ''
                        };
                    }
                }
                setShareholderData(newshareholderData);
            }
        } else {
            console.log("eeeee", i, e.target);
            let newshareholderData = [...shareholderData]

            newshareholderData[i][e.target.name] = e.target.value

            setShareholderData(newshareholderData)
        }

    }
    //Naidish Change End

    async function onSubmit(e){
        e.preventDefault();

        let final_data = {...data};

        if (e.target.elements.check_key) {
            final_data = {
                ...final_data,
                'check_key': e.target.elements.check_key.value,
                'client_id': client.client.id,
                'sole1':true,
                'auth0': true,
                'base_currency':'USD',
            };
        }

        console.log(final_data);

         //Naidish Change
         if (e.target.elements.check_key.value == 'sole_key') {
            console.log("sole")
            final_data = {
                ...final_data,
                'sole': [...directorData]
            };


            const newSignatureCanvases = directorData.map(() => React.createRef());

            console.log(newSignatureCanvases);

            setSignatureCanvases((prevSignatureCanvases) => [
                ...prevSignatureCanvases,
                ...newSignatureCanvases,
            ]);
        }

        if (e.target.elements.check_key.value == 'ubo_key') {
            final_data = {
                ...final_data,
                'ubo': [...shareholderData]
            };
        }

        if (final_data.check_key == 'declaration_key') {

            var sign_data = signpad.current.map((data, i) => {
                return (data.isEmpty() === false) ? { [`sole${i}`]: data.toDataURL() } : null;
            })

            if (e.target.elements.check_key) {
                final_data = {
                    ...final_data,
                    'check_key': e.target.elements.check_key.value,
                    'client_id': client.client.id,
                    'auth0': true,
                    'sole_signature_path': sign_data,
                };
            }
            setLoading(true);
        }
        //Naidish Change End

        setData(final_data); // Update the state

        await new Promise((resolve) => setTimeout(resolve, 0));

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };
    
            await axios.post(STORE_CORPORATE_FORM_API, final_data, config).then((res)=>{
                if(res.data.status_code===200){
                    console.log(res.data);
                    setError({});
                    setState(res.data.data);
                    console.log(state);

                    if (res.data.data == 'Completed') {
                        setLoading(false)
                        history.push('/create/live/account')
                    }
                    
                }
                else if(res.data.status_code==500){
                    console.log(res);
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data.errors);
                    setError(error.response.data.errors);
                    setLoading(false)
                }
            });
        } catch (error) {
            console.error(error);
        }


        console.log(final_data);
    }
    // alert(currentTab);
    // alert(state);
    console.log(data);

    if (loading) {
        return (
            <Fragment>
                <PropagateLoader
                    color={'#000b3e'}
                    loading={true}
                    cssOverride={{ textAlign: 'center', alignItems: 'center', backgroundColor: 'rgb(251,252,252,0.8)', display: 'flex', justifyContent: 'center', width: '100%', height: '100vh' }}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </Fragment>
        );
    }
    return (
        <Fragment>
        <div class="form-left">
            <ul class="nav-tabs" id="myTab" role="tablist">
                
                <li class="nav-item" role="presentation">
                    <a className={state == 'company' ? 'active disabled':'disabled'} id="tab-2" data-bs-toggle="tab" data-bs-target="#tab-pane-2" role="tab" aria-controls="tab-pane-2" aria-selected="false">Company Information</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a className={state == 'sole' ? 'active disabled':'disabled'} id="tab-3" data-bs-toggle="tab" data-bs-target="#tab-pane-3" role="tab" aria-controls="tab-pane-3" aria-selected="false">Details of Directors</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class={state == 'ubo' ? 'active disabled':'disabled'}  id="tab-4" data-bs-toggle="tab" data-bs-target="#tab-pane-4" role="tab" aria-controls="tab-pane-4" aria-selected="false">Details of Shareholders</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class={state == 'auth' ? 'active disabled':'disabled'}  id="tab-5" data-bs-toggle="tab" data-bs-target="#tab-pane-5" role="tab" aria-controls="tab-pane-5" aria-selected="false">Details of Person(s) Authorised to operate the Account.</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class={state == 'banking' ? 'active disabled':'disabled'}  id="tab-6" data-bs-toggle="tab" data-bs-target="#tab-pane-6" role="tab" aria-controls="tab-pane-6" aria-selected="false">Banking Details</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class={state == 'income' ? 'active disabled':'disabled'}  id="tab-7" data-bs-toggle="tab" data-bs-target="#tab-pane-7" role="tab" aria-controls="tab-pane-7" aria-selected="false">Income Information</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class={state == 'trading' ? 'active disabled':'disabled'}  id="tab-8" data-bs-toggle="tab" data-bs-target="#tab-pane-8" role="tab" aria-controls="tab-pane-8" aria-selected="false">Trading Experience and Knowledge</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class={state == 'fund' ? 'active disabled':'disabled'}  id="tab-9" data-bs-toggle="tab" data-bs-target="#tab-pane-9" role="tab" aria-controls="tab-pane-9" aria-selected="false">Source of funds</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class={state == 'disclosure' ? 'active disabled':'disabled'}  id="tab-10" data-bs-toggle="tab" data-bs-target="#tab-pane-10" role="tab" aria-controls="tab-pane-10" aria-selected="false">General Disclosure</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class={state == 'declaration' ? 'active disabled':'disabled'}  id="tab-11" data-bs-toggle="tab" data-bs-target="#tab-pane-11" role="tab" aria-controls="tab-pane-11" aria-selected="false">Declarations</a>
                </li>
                
            </ul>
        </div>
        <div className="form-right">
            <div className="tab-content" id="myTabContent">
                
                <Directors onSubmit={onSubmit} phoneChanger={phoneChanger} directorData={directorData} onChangeDirectorData={onChangeDirectorData} countryChange={onChangeDirectorCountry} addDirectorForm={addDirectorForm} removeDirectorForm={removeDirectorForm} error={error} curState={state} backChanger={backEvent} fillLater={fillLater} />
                <Comanyinfo onSubmit ={onSubmit} phoneChanger={phoneChanger} handleChanger={handleChanger} data={data} countryChange={selectChange} error={error} curState={state} backChanger={backEvent}  fillLater={fillLater}/>
                <Shareholder data={data} onSubmit={onSubmit} phoneChanger={phoneChanger} shareholderData={shareholderData} countryChange={onChangeUBOCountry} onChangeShareholderData={onChangeShareholderData} addShareholderForm={addShareholderForm} removeShareholderForm={removeShareholderForm} error={error} curState={state} backChanger={backEvent} fillLater={fillLater} />
                <Account onSubmit={onSubmit} phoneChanger={phoneChanger} handleChanger={handleChanger} data={data} authChanger={authChanger} error={error} curState={state} backChanger={backEvent} fillLater={fillLater} />
                <Banking onSubmit={onSubmit} handleChanger={handleChanger} data={data} error={error} curState={state} backChanger={backEvent}  fillLater={fillLater}/>
                <Income onSubmit={onSubmit} handleChanger={handleChanger} data={data} error={error} curState={state} backChanger={backEvent}  fillLater={fillLater}/>
                <Trading onSubmit={onSubmit} handleChanger={handleChanger} data={data} error={error} curState={state} backChanger={backEvent}   fillLater={fillLater}/>
                <Fund onSubmit={onSubmit} handleChanger={handleChanger} data={data} error={error} curState={state} backChanger={backEvent}  fillLater={fillLater}/>
                <Disclosure onSubmit={onSubmit} handleChanger={handleChanger} data={data} error={error} curState={state}  backChanger={backEvent}  fillLater={fillLater}/>
                <Declarations onSubmit={onSubmit} handleChanger={handleChanger} data={data} error={error} curState={state} backChanger={backEvent} signpad={signpad} fillLater={fillLater} directorData={directorData} />
            </div>
        </div>
        </Fragment>
    );
}
export default Tabcontent;