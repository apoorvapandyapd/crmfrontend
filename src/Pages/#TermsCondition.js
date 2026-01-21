import React, { Fragment, useEffect, useRef, useState } from 'react'
import Innerlayout from '../Components/Innerlayout'
import { Accordion, Col, Row } from 'react-bootstrap'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { redirectAsync, showClient } from '../store/clientslice';
import Parser from 'html-react-parser';
import SignatureCanvas from 'react-signature-canvas'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import AlertMessage from './AlertMessage';

const base_url = process.env.REACT_APP_API_URL;
const SAVE_TERMS_API_URL = base_url+"/v1/client/save-termsconditions";
const TERMS_API = base_url+"/client/get-termsconditions";

const TermsCondition = () => {

    const client = useSelector(showClient);
    const dispatch = useDispatch();
    const history = useHistory();

    const [termsData, setTermsData] = useState({
        'order_privacy': '',
        'complaint_privacy': '',
        'risk_privacy': '',
        'terms_privacy': '',
        'privacy': '',
    });
    const oepchecked = false;
    const [cpchecked, setCpchecked] = useState(false);
    const [rdchecked, setRdchecked] = useState(false);
    const [tschecked, setTschecked] = useState(false);
    const [ppchecked, setPpchecked] = useState(false);
    const [checked, setChecked] = useState(false);
    // const [url, setUrl] = useState(null);
    // const [data, setData] = useState(null);
    const [termsStatus, setTermsStatus] = useState(null);
    const [error, setError] = useState(null);
    const [msgError, setMsgError] = useState(null);
    const [alertDiv, setAlertDiv] = useState(false);
    let signPad = useRef({});

    async function fetchData(){
        setAlertDiv(false);
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                client_id: client.client.id
            };

            await axios.post(TERMS_API, bodyParameters, config).then(res => {
                if(res.data.status_code===200){
                    setTermsData({
                        ...termsData,
                        'order_privacy':res.data.data.order_privacy.value,
                        'complaint_privacy':res.data.data.complaint_privacy.value,
                        'risk_privacy':res.data.data.risk_privacy.value,
                        'terms_privacy':res.data.data.terms_privacy.value,
                        'privacy':res.data.data.privacy.value,
                    });

                    if(res.data.data.reject_comment){
                        setMsgError(res.data.data.reject_comment);
                    }

                    if(res.data.data.terms_status!=null){
                        setTermsStatus(res.data.data.terms_status);
                    }


                }
            })
        } catch (error) {
            console.error(error);
            if(error.response.status===401){
                dispatch(redirectAsync());
            }
        }
    }

    const clearSignpad=(e)=>{
        e.preventDefault();
        signPad.current.clear();
        // setUrl(null);
        // document.getElementById('submitBtn').classList.add('d-none');
        // document.getElementById('signature_img').classList.add('d-none');
    }
  
    // const saveSignpad=(e)=>{
    // e.preventDefault();
    // let data = signPad.current.toDataURL();
    // setUrl(data);
    // document.getElementById('submitBtn').classList.remove('d-none');
    // document.getElementById('signature_img').classList.remove('d-none');
    // // signPad.current.fromDataURL(data);
    // }

    const submit=async(e)=>{
    e.preventDefault();
    setAlertDiv(false);
    try {
        const config = {
            headers: { Authorization: `Bearer ${client.token}` }
        };
        if(signPad.current.isEmpty()===true){
            setError("Signature can not be Empty");
            setAlertDiv(true);
        }
        else{
            let data = signPad.current.toDataURL();
            // setUrl(data);
            let oep = (oepchecked === true) ? 1 : 0;
            let cp = (cpchecked === true) ? 1 : 0;
            let rd = (rdchecked === true) ? 1 : 0;
            let ts = (tschecked === true) ? 1 : 0;
            let pp = (ppchecked === true) ? 1 : 0;

            let formData = new FormData();
            formData.append("data_url",data);
            formData.append("order_execution_policy",oep);
            formData.append("complaint_policy",cp);
            formData.append("risk_disclosure",rd);
            formData.append("terms_of_service",ts);
            formData.append("privacy_policy",pp);
            
            
            await axios.post(SAVE_TERMS_API_URL, formData, config).then(response=>{
                if(response.data.status_code === 200){

                    history.push('/create/live/account');
                }
                else if(response.data.status_code === 500){

                    setError(response.data.message);
                    setAlertDiv(true);
                }
            }).catch((error)=>{
                if (error.response) {
                    let err = error.response.data.errors;
                    setError(err);
                }
            });
        }
        
    } catch (error) {
        console.error(error);
        if(error.response.status===401){
            dispatch(redirectAsync());
        }
    }
    }

    useEffect(() => {
        if(checked===true && cpchecked===true && rdchecked===true && tschecked===true && ppchecked===true){
            document.getElementById('signatureDiv').style.display = '';
            // document.getElementById('signature_img').classList.add('d-none');
        }
        else{
          document.getElementById('signatureDiv').style.display = 'none';
        }
    },[checked,oepchecked,cpchecked,rdchecked,tschecked,ppchecked])
    
    useEffect(() => {
        fetchData();
    },[])

    return (
    <div>
        <Fragment>
            <Innerlayout>
                <Row className="mt-5">
                <Col sm={12} md={12} lg={6}>
                    <div className="verification-box">
                        Terms & Conditions Status:
                        {
                            termsStatus===0 ?
                                <span>Not Accept</span>
                            :
                            termsStatus===2 ?
                                <span className="yellow">Pending</span>
                            :
                            termsStatus===3 ?
                                <span className="red">Rejected ({msgError})</span>
                            : <span className=""></span>
                        }
                    </div>
                </Col>
                {/* <div className="col-12">
                    <div className="verification-box mt-3 mb-3 flex-wrap">
                        You need to fill-up either individual or corporate form.
                        <div className='d-block w-100 mt-3'>
                        <div>Individual Form <a href={`${process.env.PUBLIC_URL}/documents/Individual_Parkmoney.pdf`} className='btn btn-primary ms-sm-2 ms-0' download>Download From</a></div>
                        <div className='mt-3'>Corporate Form <a href={`${process.env.PUBLIC_URL}/documents/Corporate_Parkmoney.pdf`} className='btn btn-primary ms-sm-2 ms-0 ' download>Download From</a></div>
                        </div>
                    </div>
                </div> */}
                <div className='mt-4'>
                    <Accordion className='pdf-terms-content'>
                    {
                        <>
                            {/* <Accordion.Item eventKey={1}>
                                <Accordion.Header>Order Execution Policy</Accordion.Header>
                                <Accordion.Body>
                                {Parser(termsData.order_privacy)}
                                </Accordion.Body>
                            </Accordion.Item>
                            <div className="form-check mb-4">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" onChange={() => setOepchecked(!oepchecked)} />
                                <label className="form-check-label" for="exampleCheck1">I Accept Order Execution Policy.</label>
                            </div> */}
                            <Accordion.Item eventKey={2}>
                            <Accordion.Header>Complaint Policy</Accordion.Header>
                            <Accordion.Body>
                            {Parser(termsData.complaint_privacy)}
                            </Accordion.Body>
                            </Accordion.Item>
                                        <div className="form-check mb-4">
                                            <input type="checkbox" className="form-check-input" id="exampleCheck2" onChange={() => setCpchecked(!cpchecked)} />
                                            <label className="form-check-label" for="exampleCheck2">I Accept Complaint Policy.</label>
                            </div>
                            <Accordion.Item eventKey={3}>
                            <Accordion.Header>Risk Disclosure</Accordion.Header>
                            <Accordion.Body>
                            {Parser(termsData.risk_privacy)}
                            </Accordion.Body>
                            </Accordion.Item>
                                        <div className="form-check mb-4">
                                            <input type="checkbox" className="form-check-input" id="exampleCheck3" onChange={() => setRdchecked(!rdchecked)} />
                                            <label className="form-check-label" for="exampleCheck3">I Accept Risk Disclosure.</label>
                            </div>
                            <Accordion.Item eventKey={4}>
                            <Accordion.Header>Terms of Service</Accordion.Header>
                            <Accordion.Body>
                            {Parser(termsData.terms_privacy)}
                            </Accordion.Body>
                            </Accordion.Item>
                                        <div className="form-check mb-4">
                                            <input type="checkbox" className="form-check-input" id="exampleCheck4" onChange={() => setTschecked(!tschecked)} />
                                            <label className="form-check-label" for="exampleCheck4">I Accept Terms of Service.</label>
                            </div>
                            <Accordion.Item eventKey={5}>
                            <Accordion.Header>Privacy Policy</Accordion.Header>
                            <Accordion.Body>
                                {Parser(termsData.privacy)}
                            </Accordion.Body>
                            </Accordion.Item>
                                        <div className="form-check mb-4">
                                            <input type="checkbox" className="form-check-input" id="exampleCheck5" onChange={() => setPpchecked(!ppchecked)} />
                                            <label className="form-check-label" for="exampleCheck5">I Accept Privacy Policy.</label>
                            </div>
                        </>
                    }
                    </Accordion>
                </div>
                </Row>
                    <div className="terms-content" style={{ maxWidth: '100%' }}>
                    <div className='list-point'>
                        <ul>
                            <li>The Client has appointed PM Financials as the Client's agent for the purpose of dealing in Spot Contracts in accordance with the terms of the Client Acknowledgement, Disclosure Statement and the terms of the Client Agreement. which has been read, understood and agreed by the client.</li>

                            <li>The Client agrees that the Client Agreement, Risk Disclosure Statement and Client Acknowledgement are the one agreement for the purposes of this agreement.</li>

                            <li>The Client confirms that it does not have any pending litigation, disputed accounts or other unresolved matters whatsoever. If the Clientdoes have any pending litigation, disputed accounts or other unresolved matters whatsoever then the Client must advise PM Financials in writing of such matters and PM Financials must consider such matters prior to approving the opening of the account.</li>

                            <li>The Client acknowledges that all information provided in this format including all information pertaining to the Client in the Client Information section of this agreement is true and accurate. Further, the Client will immediately notify PM Financials in writing if any representations materially change or cease to be true and accurate.</li>

                            <span>
                            THE RISK DISCLOSURE AND CLIENT AGREEMENT IS AVAILABLE ON THE COMPANY WEBSITE OR CAN BE PROVIDED BY THE COMPANY REPRESENTATIVE.

                            I/WE CONFIRM THAT I/WE HAVE READ, UNDERSTAND AND AGREED TO THE CLIENT AGREEMENT, RISK DISCLOSURE STATEMENT, EXECUTION TERMS AND THIS CLIENT ACKNOWLEDGEMENT. THE CLIENT FURTHER ACKNOWLEDGES THAT THE TRADING TERMS AND SERVICES USED IN IT HAVE BEEN EXPLAINED TO THE CLIENT BY THE GIVER OF THIS STATEMENT.
                            </span>
                        </ul>
                    </div>
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="accept_chk" onChange={() => setChecked(!checked)} />
                            <label className="form-check-label" for="accept_chk">BY ACCEPTING, THE CLIENT AGREES TO BE LEGALLY BOUND BY THE TERMS AND CONDITIONS OF THE CLIENT AGREEMENT.</label>
                    </div>
                        <div className="row mt-3 mt-md-4" id='signatureDiv'>
                            <div className="col-md-7">
                                <label className="mb-2">Your Signature*</label>
                                <div className="image-draw">
                            <SignatureCanvas penColor='blue' ref={signPad}
                            canvasProps={{width: '800px', height: '300px', className: 'sigCanvas', background: '#fff'}} />
                            </div>
                            {alertDiv && <AlertMessage type='danger' message={error} />}
                                <div className="buttons d-flex justify-content-between mt-3 mt-md-3">
                                    <div className="row w-100 ms-0">
                                        <div className="col-sm-6">
                                            <div className="d-flex">
                                                <button className="btn btn-primary border w-50" onClick={(e) => clearSignpad(e)}>Clear</button>
                                                {/* <button className="btn btn-secondary ms-2 w-50" onClick={(e)=>saveSignpad(e)}>Show</button> */}
                                        </div>
                                    </div>
                                        <div className="col-sm-6 text-end mt-3 mt-sm-0">
                                            <button id='submitBtn' className="btn btn-primary" onClick={(e) => submit(e)}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                            {/* <div className="col-md-5">
                            <div className="image-box mt-4 mt-md-0">
                                <img className="w-100" src={url} alt="Signature" id='signature_img'/>
                            </div>
                        </div> */}
                    </div>   
                    
                </div>
            </Innerlayout>
        </Fragment>
    </div>
    )
}

export default TermsCondition
