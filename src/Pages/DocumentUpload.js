import React,{useState, useEffect, Fragment, useRef} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import FileUpload from './DocumentUpload/FileUpload';
import axios from 'axios';
import { redirectAsync, showClient, updateClientDataAsync } from '../store/clientslice';
import { Col, Form, Row } from 'react-bootstrap';
import ImagePopup from '../Components/ImagePopup';
import PropagateLoader from "react-spinners/PropagateLoader";
import { Link } from 'react-router-dom';
import { RoundDangerIcon, RoundRightIcon, WarningIcon, VisibilityIcon, VisibilityOffIcon } from '../Components/icons';
// import { Tooltip as ReactTooltip } from 'react-tooltip'

const base_url = process.env.REACT_APP_API_URL;
const DOCUMENT_NAME_API = base_url+"/v1/client/list-namedocument";
const STORE_DOCUMENT_API = base_url+"/v1/client/store-document";
const GET_DOCUMENT_API = base_url+"/v1/client/get-document";

const DocumentUpload = (props) => {
    const [documentData, setDocumentData] = useState(null);
    const [documentName, setDocumentName] = useState(null);
    const [additionalDocument, setAdditionalDocument] = useState(null);
    const [selectedDocumentSide, setSelectedDocumentSide] = useState(null);
    const [uploadedDocumentList, setUploadedDocumentList] = useState(null);
    const [approvedDocuments, setApprovedDocuments] = useState(null);
    const [rejectedDocuments, setRejectedDocuments] = useState(null);
    const [pendingDocuments, setPendingDocuments] = useState(null);
    const [selectDocument, setSelectDocument] = useState(null);
    const [selectDocumentId, setSelectDocumentId] = useState(null);
    const [errorList, setErrorList] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentStatus, setSelectedDocumentStatus] = useState(null);
    const [kycNeeded, setKycNeeded] = useState(null);
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const [additionalDocumentCount, setAdditionalDocumentCount] = useState(null);
    const [message, setMessage] = useState(null);
    let [loading, setLoading] = useState(false);
    const [pwdDocState, setPwdDocState] = useState(null);

    const client = useSelector(showClient);
    const childRef = useRef();
    let history = useHistory();
    // let location = useLocation();
    const dispatch = useDispatch();


    const handleClose=()=>{
        setShow(false);
    }

    const showModal=(event,url)=>{
        setShow(true);
        setImage(url);
    }

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let types;

            if(client.asIB===true){
                types = 0;
            }
            else{
                types = client.client.form_type;
            }

            const bodyParameters = {
                type: types
            };
            await axios.post(DOCUMENT_NAME_API, bodyParameters, config).then(res => {
                if(res.data.status_code===200){

                    setDocumentData(res.data.data.regular);
                    setAdditionalDocument(res.data.data.additional);
                    setUploadedDocumentList(res.data.data.uploadedDocuments);
                    setPwdDocState(res.data.data.uploadedDocuments.map((data, i) => (false)))
                    setApprovedDocuments(res.data.data.approvedDocuments);
                    setRejectedDocuments(res.data.data.rejectedDocuments);
                    setPendingDocuments(res.data.data.pendingDocuments);
                    setKycNeeded(res.data.data.needofKyc);
                    setAdditionalDocumentCount(res.data.data.additionalDocumentCount);
                    setMessage(res.data.message);

                }
            })
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    var display_status;

    if(selectedDocument!==null && selectedDocument.status==='Approved'){
        display_status='none';
    }
    else{
        display_status='';
    }

    useEffect(() => {
        fetchData();
    },[])

    const handleInput=async(e)=>{
        e.preventDefault();
        setSelectDocument(e.target.value);

        await documentData.map(val=>{
            if (val.id === parseInt(e.target.value)) {
                setSelectedDocumentSide(val.document_side);
                setDocumentName(val.name);

                try {
                    const config = {
                        headers: { Authorization: `Bearer ${client.token}` }
                    };
        
                    let formData = new FormData();
                    formData.append("name",val.name);
                    
                    axios.post(GET_DOCUMENT_API, formData, config).then(response=>{
                        if(response.data.status_code === 200){

                            setSelectDocumentId(response.data.data.id);
                            setSelectedDocument(response.data.data);
                            setSelectedDocumentStatus(response.data.data.status);
                        }
                        else if(response.data.status_code === 500){
                            setSelectedDocument(null);
                            setSelectDocumentId(null);
                            setSelectedDocumentStatus('Not uploaded');
                        }
                    }).catch((error)=>{
                        if (error.response) {
                            // let err = error.response.data.errors;
                            // setError(err);
                        }
                    });
                } catch (error) {
                    console.error(error);
                    if (error.response.status === 401) {
                        dispatch(redirectAsync());
                    }
                }
            }
            else{
                setSelectedDocument(`${process.env.PUBLIC_URL}/Images/-no-image.png`);
                setSelectedDocumentStatus('Not uploaded');
            }
            return null;
        });

        await additionalDocument.map(val=>{
            if (val.id === parseInt(e.target.value)) {
                setSelectedDocumentSide(2);
                setDocumentName(val.name);
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${client.token}` }
                    };
        
                    let formData = new FormData();
                    formData.append("name",val.name);
                    
                    axios.post(GET_DOCUMENT_API, formData, config).then(response=>{
                        if(response.data.status_code === 200){

                            setSelectDocumentId(response.data.data.id);
                            setSelectedDocument(response.data.data);
                            setSelectedDocumentStatus(response.data.data.status);
                        }
                        else if(response.data.status_code === 500){
                            setSelectedDocument(null);
                            setSelectDocumentId(null);
                            setSelectedDocumentStatus('Not uploaded');
                        }
                    }).catch((error)=>{
                        if (error.response) {
                            // let err = error.response.data.errors;
                            // setError(err);
                        }
                    });
                } catch (error) {
                    console.error(error);
                    if (error.response.status === 401) {
                        dispatch(redirectAsync());
                    }
                }
            }
            else{
                setSelectedDocument(`${process.env.PUBLIC_URL}/Images/-no-image.png`);
                setSelectedDocumentStatus('Not uploaded');
            }
            return null;
        });

    }

    const uploadDocument=(e)=>{
        e.preventDefault();
        var imageData = childRef.current.callFromParent();
        var docName = documentName.replace(/\s+/g,"_");

        setLoading(true);
        setErrorList(null);

        try {
            const formData = new FormData();
            formData.append(docName, imageData.image);

            if (imageData.image === null) {
                formData.append('selected_id', selectDocumentId);
            }
            if (imageData.password !== null) {
                formData.append('password', imageData.password);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${client.token}`
                },
            };

            axios.post(STORE_DOCUMENT_API, formData, config).then((response) => {

                if (response.data.status_code === 200) {

                    setSelectedDocumentSide(null);
                    setDocumentName(null);
                    setSelectDocument(null);
                    setSelectDocumentId(null);
                    
                    setUploadedDocumentList(response.data.data.uploadedDocuments);
                    setPwdDocState(response.data.data.uploadedDocuments.map((data, i) => (false)));
                    fetchData();
                    dispatch(updateClientDataAsync(response.data.data.clientDetails,client.token));
                    history.push('/accountverification');
                }
                else if (response.data.status_code === 500) {
                    let err = response.data.errors;
                    let data=[
                        {'front':err[docName]},
                        {'back':err[docName+'_back']}
                    ]
                    setErrorList(data);
                }

                setLoading(false);
            }).catch((error)=>{
                console.log(error);
                if (error.response) {
                    setLoading(false);
                    let err = error.response.data.errors;
                    console.log(err);
                    setErrorList(err[docName]);
                }
            });
        }
        catch (err) {
            setLoading(false);
            throw new Error(err);
        }
    }


    const togglePwdDocState = (i) => {
        setPwdDocState((prevItems) => {
            const newItems = [...prevItems];
            newItems[i] = !newItems[i]; // Toggle the state
            return newItems;
        });
    };

    if(documentData===null){
        return (
            <Fragment>
                <PropagateLoader
                    color={'#000b3e'}
                    loading={true}
                    cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </Fragment>
        );
    }
    else{
        return (
            <div className="site-wrapper">
                <div className="verification-request-wrapper m-auto">
                    <div className="verification-content p-0">
                        <div className='box-wrapper'>
                            <div className='card-body create-ticket p-0 bg-white'>
                                <h2 className="mb-0 px-40">
                                    {/* <Link to='/accountverification'><a href={null} className="back-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                        <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                                    </svg>
                                </a></Link> */}
                                Upload Document
                                </h2>
                                <div className='p-40'>
                                <form onSubmit={uploadDocument} encType="multipart/form-data">
                                        {
                                            (loading === true) ? <PropagateLoader
                                                color={'#000b3e'}
                                                loading={true}
                                                cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                                                size={25}
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            /> : 
                                            <Row>
                                            <Col md="12" xl="6">
                                                <div className="upload-id">
                                                    <h3>Upload your ID</h3>
                                                    <Form.Group>
                                                        <select className="form-control select" value={selectDocument} onChange={handleInput}>
                                                            <optgroup label="Basic Documents">
                                                            <option value="" selected disabled>Select an option</option>
                                                            {
                                                                documentData.map(val => {
                                                                    if (!approvedDocuments.includes(val.id)) {
                                                                        if ((pendingDocuments !== null || pendingDocuments.length > 0) && pendingDocuments.includes(val.id)) {
                                                                            return <option className='label-pending' key={val.id} value={val.id}>{val.name}</option>;
                                                                        }
                                                                        else if ((rejectedDocuments !== null || rejectedDocuments.length > 0) && rejectedDocuments.includes(val.id)) {
                                                                            return <option className='label-reject' key={val.id} value={val.id}>{val.name}</option>;
                                                                        }
                                                                        else{
                                                                            return <option key={val.id} value={val.id}>{val.name}</option>;
                                                                        }
                                                                    }
                                                                    return null;
                                                                })
                                                            }
                                                            </optgroup>
                                                            {
                                                                (additionalDocumentCount > 0) ? <optgroup label="Additional Documents">
                                                                {
                                                                                (additionalDocument !== undefined) && additionalDocument.map(document => {
                                                                    if(!approvedDocuments.includes(document.id)) {
                                                                        if ((rejectedDocuments !== null || rejectedDocuments.length > 0) && pendingDocuments.includes(document.id)) {
                                                                            return <option key={document.id} className='label-pending' value={document.id}>{document.name}</option>;
                                                                        }
                                                                        else if ((rejectedDocuments !== null || rejectedDocuments.length > 0) && rejectedDocuments.includes(document.id)) {
                                                                            return <option key={document.id} className='label-reject' value={document.id}>{document.name}</option>;
                                                                        }
                                                                        else{
                                                                            return <option key={document.id} value={document.id}>{document.name}</option>;
                                                                        }
                                                                    }

                                                                    return null;
                                                                    })
                                                                } </optgroup> : null
                                                            }
                                                        </select>
                                                    </Form.Group>
                                                    {(selectedDocumentSide!==null) ? <FileUpload displayStatus={documentStatus} display={display_status} side={selectedDocumentSide} ref={childRef} error={errorList} uploadedImg={(selectedDocument!==null) ?  selectedDocument.image_path : null} data={selectedDocument} /> : <div></div>}
                                                </div>
                                            </Col>
                                            <Col md="12" xl="6">
                                                <div className="content">
                                                    {
                                                                (message !== null && props.verifyStatus !== 'Completed') ?
                                                        <p><h3>Waiting for approval, your documents are submitted successfully.</h3></p> : (props.verifyStatus !== 'Completed') ?
                                                                        (client.client.form_type === 1) ?
                                                            <p><h4>Please upload all your documents and await administrative approval.</h4></p> :
                                                                            <p><h4>You need to verify {kycNeeded} documents {(client.asIB === true) ? null : 'for creating live account'}.</h4></p>
                                                        : null
                                                    }
                                                </div>
                                            </Col>
                                            <Col sm="12">
                                                <div className="verification-requirements">
                                                    <span className="divider"></span>
                                                    <div className="vr-item">
                                                                <RoundRightIcon width="18" height="18" />
                                                        <p className="vr-item-text">Upload a colourful full-size photo or pdf of the document.</p>
                                                    </div>
                                                    <div className="vr-item">
                                                                <RoundDangerIcon width="18" height="18" />
                                                        <p className="vr-item-text">Do not upload selfies, screenshots and do not modify the images in graphic editors.</p>
                                                    </div>
                                                    <div className='vr-item'>
                                                                <WarningIcon width="18" height="18" />
                                                    <div className='d-flex flex-wrap mb-3 document-status'>
                                                        <div style={{ marginRight:'7px' }}>Document List Status : </div>
                                                        <div className='pending d-flex align-items-center'><span></span> Uploaded</div>
                                                        <div className='ms-3 rejected d-flex align-items-center'><span></span> Rejected</div>
                                                    </div>
                                                    </div>
                                                    {/* <div className="vr-item">
                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 5.0625C9.41421 5.0625 9.75 5.39829 9.75 5.8125V9.75C9.75 10.1642 9.41421 10.5 9 10.5C8.58579 10.5 8.25 10.1642 8.25 9.75V5.8125C8.25 5.39829 8.58579 5.0625 9 5.0625Z" fill="#FAB32A"/>
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.80422 2.46543C9.29885 2.17726 8.68396 2.17942 8.19011 2.46453L3.73787 5.03543C3.23843 5.32997 2.93262 5.86466 2.93262 6.43503V11.565C2.93262 12.1461 3.241 12.6777 3.73511 12.963L8.18723 15.5338C8.18769 15.5341 8.18815 15.5344 8.18862 15.5346C8.69395 15.8228 9.30878 15.8206 9.8026 15.5355C9.80262 15.5355 9.80258 15.5355 9.8026 15.5355L14.2549 12.9646C14.7543 12.6701 15.0602 12.1354 15.0602 11.565V6.43503C15.0602 5.8585 14.7555 5.33064 14.2549 5.03545L9.80554 2.46618C9.8051 2.46593 9.80466 2.46568 9.80422 2.46543ZM7.44014 1.16547C8.40086 0.610828 9.58536 0.612742 10.5497 1.16382L10.5527 1.1655L15.0126 3.74085C15.9657 4.30092 16.5602 5.31742 16.5602 6.43503V11.565C16.5602 12.6738 15.9669 13.6984 15.0126 14.2592L15.0077 14.262L10.5527 16.8345C9.59196 17.3892 8.4074 17.3873 7.44302 16.8362L7.44008 16.8345L2.98514 14.2621C2.02425 13.7073 1.43262 12.6789 1.43262 11.565V6.43503C1.43262 5.32624 2.02591 4.30161 2.98015 3.74087L2.98507 3.73798L7.44014 1.16547Z" fill="#FAB32A"/>
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 11.15C9.55228 11.15 10 11.5977 10 12.15V12.225C10 12.7773 9.55228 13.225 9 13.225C8.44772 13.225 8 12.7773 8 12.225V12.15C8 11.5977 8.44772 11.15 9 11.15Z" fill="#FAB32A"/>
                                                        </svg>
                                                        <p className="vr-item-text">If you re-upload the approved image, it will be marked as pending. </p>
                                                    </div> */}
                                                </div>
                                                <div className="d-flex justify-content-end flex-wrap">
                                                    {/* <Link to="/accountverification" className='order-5 order-sm-0'>&laquo; Back</Link> */}
                                                    <button style={{ display:display_status }} type="submit" className="btn btn-primary  float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Submit</button>
                                                </div>
                                            </Col>
                                            </Row>
                                        }
                                </form>
                                </div>
                                {
                                    (loading!==true) ? 
                                    <div className='p-40'>
                                            <div className='row' style={{ marginTop: '-24px' }}>

                                            {
                                                    uploadedDocumentList !== null && uploadedDocumentList.map((docValue, i) => (
                                                    (docValue.extension!=='pdf') ? 
                                                    <div className='col-lg-12 col-xl-6 mt-4'>
                                                        <div className='document-box d-flex flex-wrap'>
                                                            <h3>{docValue.name}</h3>
                                                            <div className='d-flex flex-wrap w-100 align-items-center'>
                                                                <div className='img-box'>
                                                                            <Link to='#' onClick={(e) => showModal(e, docValue.image_path)}><img src={docValue.image_path} className='mt-0' alt="" /></Link>
                                                                </div>
                                                                <div className='content'>
                                                                    <p><strong>Status:</strong> <span>{docValue.status}</span></p>
                                                                    <p><strong>Comment:</strong> <span>{ docValue.comment!==null ? docValue.comment : '-'}</span></p>
                                                                            <p><strong>Uploaded Date:</strong> <span>{docValue.date !== null ? docValue.date : '-'}</span></p>
                                                                            <div className='w-100 position-relative'>
                                                                                {docValue.document_password !== null ?
                                                                                    <span style={{ cursor: 'pointer' }} className="password-icon" onClick={() => togglePwdDocState(i)}>{pwdDocState[i] === false ?
                                                                                        <VisibilityIcon width="16" height="16" /> : <VisibilityOffIcon width="16" height="16" />
                                                                                    }</span> : ""
                                                                                }
                                                                                <p><strong>Password:</strong> {pwdDocState[i] === false && docValue.document_password !== null ? <span>********</span> : <span>{docValue.document_password !== null ? docValue.document_password : '-'}</span>}</p>
                                                                            </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> :
                                                    <div className='col-lg-12 col-xl-6 mt-4'>
                                                        <div className='document-box d-flex flex-wrap'>
                                                            <h3>{docValue.name}</h3>
                                                            <div className='d-flex flex-wrap w-100 align-items-center'>
                                                                <div className='img-box'>
                                                                            <a href={docValue.image_path} target="_blank" rel="noopener noreferrer"><img src={`${process.env.PUBLIC_URL}/Images/pdf_title_img.png`} className='mt-0' alt="" /></a>
                                                                </div>
                                                                <div className='content'>
                                                                    <p><strong>Status:</strong> <span>{docValue.status}</span></p>
                                                                    <p><strong>Comment:</strong> <span>{ docValue.comment!==null ? docValue.comment : '-'}</span></p>
                                                                            <p><strong>Uploaded Date:</strong> <span>{docValue.date !== null ? docValue.date : '-'}</span></p>
                                                                            <div className='w-100 position-relative'>
                                                                                {docValue.document_password !== null ?
                                                                                    <span style={{ cursor: 'pointer' }} className="password-icon" onClick={() => togglePwdDocState(i)}>{pwdDocState[i] === false ?
                                                                                        <VisibilityIcon width="16" height="16" /> : <VisibilityOffIcon width="16" height="16" />
                                                                                    }</span> : ""
                                                                                }
                                                                                <p><strong>Password:</strong> {pwdDocState[i] === false && docValue.document_password !== null ? <span>********</span> : <span>{docValue.document_password !== null ? docValue.document_password : '-'}</span>}</p>
                                                                            </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {/* <div className='col-lg-12 col-xl-6 mt-4'>
                                                <div className='document-box d-flex flex-wrap'>
                                                    <h3>Passport</h3>
                                                    <div className='d-flex flex-wrap w-100 align-items-center'>
                                                        <div className='img-box'>
                                                            <a href={null}><img src='https://crmoffice.netulr.com/documents/1679916055_202212090723all_for_image.jpg' alt=''/></a>
                                                        </div>
                                                        <div className='content'>
                                                            <p><strong>Status:</strong> <span>Approved</span></p>
                                                            <p><strong>Comment:</strong> <span>Upload a colourful full-size photo or pdf of the document.</span></p>
                                                            <p><strong>Date:</strong> <span>28/03/2023</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-12 col-xl-6 mt-4'>
                                                <div className='document-box d-flex flex-wrap'>
                                                    <h3>Passport</h3>
                                                    <div className='d-flex flex-wrap w-100 align-items-center'>
                                                        <div className='img-box'>
                                                            <a href={null}><img src='https://crmoffice.netulr.com/documents/1679916055_202212090723all_for_image.jpg' alt=''/></a>
                                                        </div>
                                                        <div className='content'>
                                                            <p><strong>Status:</strong> <span>Approved</span></p>
                                                            <p><strong>Comment:</strong> <span>Upload a colourful full-size photo or pdf of the document.</span></p>
                                                            <p><strong>Date:</strong> <span>28/03/2023</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-12 col-xl-6 mt-4'>
                                                <div className='document-box d-flex flex-wrap'>
                                                    <h3>Passport</h3>
                                                    <div className='d-flex flex-wrap w-100 align-items-center'>
                                                        <div className='img-box'>
                                                            <a href={null}><img src='https://crmoffice.netulr.com/documents/1679916055_202212090723all_for_image.jpg' alt=''/></a>
                                                        </div>
                                                        <div className='content'>
                                                            <p><strong>Status:</strong> <span>Approved</span></p>
                                                            <p><strong>Comment:</strong> <span>Upload a colourful full-size photo or pdf of the document.</span></p>
                                                            <p><strong>Date:</strong> <span>28/03/2023</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>  
                                    </div> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <ImagePopup image={image} handleOpen={show} handleClose={handleClose} />
            </div>
        );
    }
};

export default DocumentUpload;