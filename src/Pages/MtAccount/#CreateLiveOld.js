import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import PropagateLoader from "react-spinners/PropagateLoader";
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import AlertMessage from '../AlertMessage';

const base_url = process.env.REACT_APP_API_URL;
const MT_TYPE_API = base_url+"/v1/client/list-livemttype";
const CREATE_MT_ACCOUNT_API = base_url+"/v1/client/store-mtaccount";

function CreateLive(props) {

    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);

    const [type, setType] = useState(null);
    const [group, setGroup] = useState(null);
    const [leverage, setLeverage] = useState(null);
    const [planType, setPlanType] = useState(null);
    const [data, setData] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPlanData, setSelectedPlanData] = useState({
        'account_type_id':'',
        'account_leverage_id':'',
        'account_group_id':'',
        'account_plan_id':''
    });

    const [newGroup, setNewGroup] = useState([]);
    const [newLeverage, setNewLeverage] = useState([]);
    let [loading, setLoading] = useState(false);

    const [value, setValue] = useState({
        'account_type_id':'',
        'account_group_id':'',
        'account_leverage_id':'',
    });

    const [error, setError] = useState({});

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
                key: "value"
            };
            await axios.post(MT_TYPE_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){
                    setPlanType(res.data.plan_type);
                    if(res.data.plan_type=='default_group'){

                        setType(res.data.data.type);
                        setGroup(res.data.data.group);
                        setLeverage(res.data.data.leverage);
                    }
                    else{

                        setData(res.data.data);
                    }
                    setLoading(false);
                }
            })
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const handleType=(e)=>{
        let type_id = e.target.value;
        let new_group = [];
        let new_leverage = [];

        setValue((prevValue) => ({
            ...prevValue,
            'account_type_id': type_id,
        }));

        // group.map(val=>[
        //     (val.account_type_id==type_id) ?
        //     new_group.push(<option value={val.id}>{val.group}</option>) : null
        // ]);

        leverage.map(val=>[
            (val.account_type_id==type_id) ?
            new_leverage.push(<option value={val.id}>{val.leverage}</option>) : null
        ]);

        // setNewGroup([new_group]);
        setNewLeverage([new_leverage]);
    }

    const handleInput=(e)=>{
        setValue((prevValue) => ({
            ...prevValue,
            [e.target.name]: e.target.value,
        }));
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
            if(error.response.status==401){
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }

    const accountPlanSubmit=async(e)=>{
        e.preventDefault();
        
        const data = selectedPlanData;
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
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data.errors);
                    setError(error.response.data.errors);
                }
            });
        } catch (error) {
            console.error(error);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    const selectPlanFunc=(e,id)=>{
        setSelectedPlan(id);
        data.map((val)=>{
            if(val.id==id){
                setSelectedPlanData({
                    ...selectedPlanData,
                    ['account_type_id']: 2,
                    ['account_group_id']: val.group_id,
                    ['account_leverage_id']: val.leverage_id,
                    ['account_plan_id']: id,
                });
            }
        })
    }

    useEffect(() => {
        setLoading(true);
        fetchData();
    },[])

    if ((planType==null && type == null && group==null && leverage==null) || (planType==null && data==null)) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
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
                    (planType=='default_group') ? 
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
                                    <Form.Group className="mb-3 custom_radio">                            
                                        {
                                            type.map(val=>(
                                                (val.type=='live') ? 
                                                <><input type="radio" id={val.account} name='account' value={val.id} onChange={handleType} />
                                                <label for={val.account}>PM Financials Live</label></> : null
                                            ))
                                        }
                                        <br/><small className="text-danger">{error.account_type_id}</small>
                                    </Form.Group>
                                    {/* <Form.Group className="mb-4">
                                        <select className="form-control select" name='account_group_id' onChange={handleInput}>
                                            <option>Select Group</option>
                                            {
                                                (newGroup!==[]) ? newGroup : null
                                            }
                                        </select>
                                        <small className="text-danger">{error.account_group_id}</small>
                                    </Form.Group> */}
                                    <Form.Group className="mb-4">
                                                <select className="form-control select" name='account_leverage_id' onChange={handleInput}>
                                            <option>Select Leverage</option>
                                            {
                                                        (Array.isArray(newLeverage) ? newLeverage : null)
                                            }
                                        </select>
                                        <small className="text-danger">{error.account_leverage_id}</small>
                                    </Form.Group>
                                            <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                        <Link to="/list/trading-accounts" className='order-5 order-sm-0'>&laquo; Back</Link>
                                                <button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Create</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div> :
                            <div className="box-wrapper w-700">
                                <div className="card-body create-ticket p-0 bg-white">
                            <h2 className="mb-0 px-40">
                                        <Link to='/list/trading-accounts'><a href={null} className="back-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                        <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                                    </svg>
                                </a></Link>
                                MT Live Account
                            </h2>
                            <div className='p-40'>
                                <form onSubmit={accountPlanSubmit}>
                                    <div className="row payment-logo group-plan-select">
                                    {
                                        data!=null && data.map(val=>(
                                            <div className="form-group col-6 col-sm-4">
                                                <FormControl type="radio" name="radio-group" id={val.id} onChange={(e)=>selectPlanFunc(e,val.id)} />
                                                <label for={val.id}>
                                                    <h3 className="mb-1">{val.title}</h3>
                                                    <p className="mb-1"><b>Group......</b>{val.group}</p>
                                                    <p className="mb-1">{val.group_description}</p>
                                                    <span><b>Leverage.....</b>{val.leverage}</span>
                                                </label>
                                            </div>
                                        ))
                                    }
                                    </div>
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

export default CreateLive;