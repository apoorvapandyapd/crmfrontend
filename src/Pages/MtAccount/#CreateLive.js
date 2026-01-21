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
import Parser from 'html-react-parser';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import Swal from 'sweetalert2';

const base_url = process.env.REACT_APP_API_URL;
const MT_TYPE_API = base_url+"/v1/client/list-livemttype";
const MT_DETAILS_API = base_url+"/v1/client/list-mtdetails";
const CREATE_MT_ACCOUNT_API = base_url+"/v1/client/store-mtaccount";

function CreateLive(props) {

    let leverage_id, group_id, plan_id;
    const [alertDiv, setAlertDiv] = useState(false);
    const [errorMessage, setErrorMesssage] = useState(null);

    const [type, setType] = useState(null);
    const [group, setGroup] = useState(null);
    const [leverage, setLeverage] = useState(null);
    const [planType, setPlanType] = useState(null);
    const [data, setData] = useState(null);
    const [defaultData, setDefaultData] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPlanData, setSelectedPlanData] = useState({
        'account_type_id':'',
        'account_type':'live',
        'account_leverage_id':'',
        'account_group_id':'',
        'account_plan_id':'',
        'account_plan_type':''
    });

    const [newGroup, setNewGroup] = useState([]);
    const [newLeverage, setNewLeverage] = useState([]);
    let [loading, setLoading] = useState(false);

    let [firstTimeForm, setFirstTimeForm] = useState(false);

    const [error, setError] = useState({});

    const client = useSelector(showClient);
    let location = useLocation();
    let history = useHistory();

    const [value, setValue] = useState({
        'account_type_id': 2,
        'account_type': 'live'
    });

    if (client.islogin === false)
    {

        history.push('/login')
    }
    const dispatch = useDispatch();


    const settings = {
        dots: false,
        arrows: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                slidesToShow: 3,
                slidesToScroll: 3
                }
            },
            {
                breakpoint: 1200,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 2
                }
            },
            {
                breakpoint: 940,
                settings: {
                slidesToShow: 1,
                slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                slidesToShow: 2,
                slidesToScroll: 2
                }
            },
            {
                breakpoint: 575,
                settings: {
                slidesToShow: 1,
                slidesToScroll: 1
                }
            }
        ]
    };

    function chooseForm(){
        Swal.fire({
            title: 'Please select an account type',
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Individual Form',
            // cancelButtonClass: 'cancel-button',
            confirmButtonText: 'Corporate Form',
            // confirmButtonClass: 'submit-button confirm',
            focusCancel: true,
            focusConfirm: false,
            allowOutsideClick: false,
            customClass: {
                cancelButton: 'cancel-button',
                confirmButton: 'submit-button confirm',
            },
        }).then((result) => {
        if (result.isConfirmed) {
            history.push('/corporate');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            history.push('/individualdetails');
        } 
        else if (result.dismiss === Swal.DismissReason.close) {
            history.push('/dashboard');
        } 
        });

        setFirstTimeForm(false);
    }

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                type: client.client.form_type ?? 0
            };

            let terms_notactive = [0,3];

            await axios.post(MT_TYPE_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){

                    if((res.data.live_count < 1 && res.data.individual_status=='No') && res.data.live_count < 1 && res.data.corporate_status=='No'){
                        setFirstTimeForm(true);
                    }
                    else if((res.data.live_count < 1 && res.data.individual_status=='Yes' && res.data.form_status==0) || res.data.live_count < 1 && res.data.corporate_status=='Yes' && res.data.form_status==0){
                        if(res.data.corporate_status=='Yes'){
                            history.push('/corporate')
                        }
                        else{
                            history.push('/individualdetails')
                        }
                    }
                    else if(res.data.live_count < 1 && terms_notactive.includes(res.data.terms_active)){
                        history.push('/terms-condition')
                    }
                    else if(res.data.live_count < 1 && (client.client.form_terms_validation=='not_completed' || client.client.verify=='Not Completed')){
                        history.push('/accountverification')
                    }

                    setPlanType(res.data.plan_type);
                    setSelectedPlanData((preValues)=>({
                        ...preValues,
                        'account_plan_type': res.data.plan_type,
                    }));
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

    async function fetchData2(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                account_type_id: client.client.companyId ?? 2
            };

            await axios.post(MT_DETAILS_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){
                    setLoading(false);
                    setDefaultData(res.data.data);

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

        let selectPlansData = {
            'account_type_id':2,
            'account_type':'live',
            'account_leverage_id':leverage_id,
            'account_group_id':group_id,
            'account_plan_id':plan_id
        }
        
        const data = selectPlansData;
        setAlertDiv(false);
        setLoading(true);

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
                    console.log(error.response.data.errors);
                    setErrorMesssage(error.response.data.errors);
                    setAlertDiv(true);
                    setLoading(false);
                }
            });
        } catch (error) {
            setLoading(false);
            console.error(error);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    const selectPlanFunc=async (e,id)=>{
        const response = await Swal.fire({
            title: "Are you sure, you want select this plan?",
            text: "Once selected, you will not be able to change!",
            icon: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if(result.isConfirmed){
                setSelectedPlan(id);
                data.map((val)=>{
                    if(val.id==id){
                        leverage_id = val.leverage_id;
                        group_id = val.group_id;
                        plan_id = id;
                    }
                })
    
                accountPlanSubmit(e);
              }
          });
    }

    useEffect(() => {
        setLoading(true);
        fetchData();
        fetchData2();
    },[])

    // useEffect(() => {
    //     setLoading(true);
    //     fetchData();
    //     fetchData2();
    // },[])

    if (firstTimeForm) {
        chooseForm();
    }


    if ((planType==null && type == null && group==null && leverage==null) || (planType==null && data==null)) {
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
                                    <p><b>You will receive the following benefits with your Live account</b></p>
                                    <ul className='list-style'>
                                        <li>Leverage of {defaultData!=null && defaultData.leverage}</li>
                                        <li>Trade online, 24-hours a day, 5 days a week</li>
                                    </ul>
                                    <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                        <Link to="/list/trading-accounts" className='order-5 order-sm-0'>&laquo; Back</Link>
                                        <button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Create</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div> :
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card-body position-relative">
                                    <h2>All Plans</h2>
                                    {alertDiv && <AlertMessage type='danger' message={errorMessage} />}
                                    <Slider className='plans-slider' {...settings}>
                                    {
                                        data!=null && data.map(val=>(
                                            <div className="items">
                                            <div className="plan-box">
                                                <h2>{val.title}</h2>
                                                <ul>
                                                    {/* <li><span>Commission (per lot)</span> {val.commission_lot ? val.commission_lot+'$*' : '-'}</li> */}
                                                    <li><span>Starting Deposit (USD)</span> {val.commission_lot ? val.starting_deposit+'$*' : '-'}</li>
                                                    <li><span>Bonus</span> {val.bonus ? val.bonus+'%*' : '-'}</li>
                                                    <li><span>Max Leverage</span> {val.leverage ?? '-'}</li>
                                                    <li><span>Micro/Mini Lot Trading</span> {val.lot_trading+'*' ?? '-'}</li>
                                                    {/* <li><span>Currency Pairs</span> {val.currency_pairs ?? '-'}</li> */}
                                                    {/* <li><span>Crypto</span> {val.crypto ?? '-'}</li>
                                                    <li><span>Index CFD Trading</span> {val.cfd_trading ?? '-'}</li>
                                                    <li><span>Total Products</span> {val.total_products ?? '-'}</li> */}
                                                    <li><span>Stop Out Level</span> {val.stop_level ? val.stop_level+'%' : '-'}</li>
                                                    {/* <li><span>One Click Trading</span> {val.trading ?? '-'}</li> */}
                                                    <li><span>Hedging allowed</span> {val.trading_allowed ?? '-'}</li>
                                                    <li><span>Swap</span> {val.swap ?? '-'}</li>
                                                    <li className="justify-content-center py-3">
                                                        <button className="btn btn-primary btn-sm w-100" onClick={(e)=>selectPlanFunc(e,val.id)}>Open Live Account</button>
                                                    </li>
                                                </ul>
                                            </div>
                                            </div>
                                        ))
                                    }
                                    </Slider>
                                    <div className='mt-4 plan-notes'>
                                        <p><b>Starting deposit</b> is basic amount to get bonus you can deposit less but then you are not liable to get the bonus and max amount to deposit in <b>Classic plan</b> is 1000$ & For <b>Standard Plan</b> Max amount to Deposit is 5000 USD</p>
                                        <p>In <b>classic</b> bonus Is 20% upto 100$ & In <b>standered</b> Bonus is 10% Upto 250$</p>
                                        <p>According to trading pattern we are liable to shift client from One group to another group with different conditions.</p>
                                        <p>On Major Products Mini/Micro available not all</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
                
                </Innerlayout>
        </Fragment>
    );
}

export default CreateLive;