import React,{useState, useEffect, Fragment, useRef} from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { redirectAsync, showClient } from '../../store/clientslice';
import Innerlayout from '../../Components/Innerlayout';

const base_url = process.env.REACT_APP_API_URL;
const DOCUMENT_NAME_API = base_url+"/v1/client/list-namedocument";
const STORE_DOCUMENT_API = base_url+"/v1/client/store-document";

const UpdateDocument = (props) => {

    const client = useSelector(showClient);
    var history = useHistory();
    const childRef = useRef();
    const dispatch = useDispatch();

    var location = useLocation();
    var title = location.state.title;
    var image = location.state.image;

    const [documentData, setDocumentData] = useState(null);
    const [documentName, setDocumentName] = useState(null);
    const [selectedDocumentSide, setSelectedDocumentSide] = useState(null);
    const [selectDocument, setSelectDocument] = useState(null);
    const [frontImage, setFrontImage] = useState(null);
    const [previewFront, setPreviewFront] = useState(image);
    const [errorList, setErrorList] = useState(null);

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                type : client.client.form_type
            };

            const response = await axios.post(DOCUMENT_NAME_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){
                    setDocumentData(res.data);
                    res.data.data.map(val => {
                        if(title.includes(val.name)){
                            setSelectedDocumentSide(val.document_side)
                            setDocumentName(title)
                            setSelectDocument(val.id)
                        }
                    });
                }
            })
        } catch (error) {
            console.error(error);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        fetchData();
    },[])

    const handleFront=(e)=>{
        let files = e.target.files[0];
        setPreviewFront(URL.createObjectURL(files));
        setFrontImage(files);
    }

    const closeFront=(e)=>{
        setPreviewFront(null);
    }

    const uploadDocument=(e)=>{
        e.preventDefault();
        var imageData = frontImage;
        var docName = documentName.replace(/\s+/g,"_");


        try {
            const formData = new FormData();
            formData.append(docName, imageData);


            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${client.token}`
                },
            };
            axios.post(STORE_DOCUMENT_API, formData, config).then(response=> {

                if(response.data.status_code==200){
                    history.push('/accountverification');
                }
            }).catch((error)=>{
                if (error.response) {
                    let err = error.response.data.errors;
                    setErrorList(err[docName]);
                }
            });
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }

        
    }

    if(documentData===null){
        return (
            <Fragment>
                <Innerlayout>Loading ...</Innerlayout>
            </Fragment>
        );
    }
    else{
        return (
            <Fragment>
                <Innerlayout>
                <div className="site-wrapper">
                    <div className="verification-request-wrapper m-auto">
                        <div className="verification-content p-0">
                            <div className='box-wrapper'>
                                <div className='card-body create-ticket p-0 bg-white'>
                                <h2 className="mb-0 px-40">
                                            <Link to='/accountverification'><a href={null} className="back-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16"/>
                                        <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16"/>
                                    </svg>
                                </a></Link>
                                Update Document
                                </h2>
                                <div className='p-40'>
                                    <form onSubmit={uploadDocument} encType="multipart/form-data">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="upload-id">
                                                    <h3>1. Upload your ID</h3>
                                                    <div className="form-group">
                                                        <select disabled className="form-control select" value={selectDocument}>
                                                            <option>Select your ID type</option>
                                                            {
                                                                documentData.data.map(val=>(
                                                                    <option value={val.id}>{val.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="file-upload mt-3">
                                                        <div className="file-upload-field">
                                                            <input type="file" onChange={handleFront}/>
                                                            <label className="file-upload-field-label">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" fill="white"/><path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V18C12.75 18.41 12.41 18.75 12 18.75Z" fill="white"/></svg>
                                                            </label>
                                                        </div>
                                                        <div className="file-upload-image">
                                                            <img src={previewFront} className='mt-3' alt="" width="100%"/>
                                                            <span className="close-icon" onClick={closeFront}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" fill="white"/><path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V18C12.75 18.41 12.41 18.75 12 18.75Z" fill="white"/></svg></span>
                                                        </div>
                                                        <small className='text-danger'>{errorList}</small>
                                                        <div className="file-upload-text">
                                                            {/* <h4>Front side</h4> */}
                                                            <p>Provide files in jpg, jpeg, png, gif, svg or pdf format, 5 MB maximum.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="content">
                                                    <p>The document you are providing must be valid at least 30 days and contain all of the following details</p>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="verification-requirements">
                                                    <span className="divider"></span>
                                                    <div className="vr-item">
                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 17.0625C4.5525 17.0625 0.9375 13.4475 0.9375 9C0.9375 4.5525 4.5525 0.9375 9 0.9375C13.4475 0.9375 17.0625 4.5525 17.0625 9C17.0625 13.4475 13.4475 17.0625 9 17.0625ZM9 2.0625C5.175 2.0625 2.0625 5.175 2.0625 9C2.0625 12.825 5.175 15.9375 9 15.9375C12.825 15.9375 15.9375 12.825 15.9375 9C15.9375 5.175 12.825 2.0625 9 2.0625Z" fill="#2FD614"/>
                                                            <path d="M7.93508 11.685C7.78508 11.685 7.64258 11.625 7.53758 11.52L5.41508 9.39751C5.19758 9.18001 5.19758 8.82001 5.41508 8.60251C5.63258 8.38501 5.99258 8.38501 6.21008 8.60251L7.93508 10.3275L11.7901 6.47251C12.0076 6.25501 12.3676 6.25501 12.5851 6.47251C12.8026 6.69001 12.8026 7.05001 12.5851 7.26751L8.33258 11.52C8.22758 11.625 8.08508 11.685 7.93508 11.685Z" fill="#2FD614"/>
                                                        </svg>
                                                        <p className="vr-item-text">Upload a colourful full-size (4 sides visible) photo of the document.</p>
                                                    </div>
                                                    <div className="vr-item">
                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 17.0625C4.5525 17.0625 0.9375 13.4475 0.9375 9C0.9375 4.5525 4.5525 0.9375 9 0.9375C13.4475 0.9375 17.0625 4.5525 17.0625 9C17.0625 13.4475 13.4475 17.0625 9 17.0625ZM9 2.0625C5.175 2.0625 2.0625 5.175 2.0625 9C2.0625 12.825 5.175 15.9375 9 15.9375C12.825 15.9375 15.9375 12.825 15.9375 9C15.9375 5.175 12.825 2.0625 9 2.0625Z" fill="#D61414"/>
                                                            <path d="M6.87752 11.685C6.73502 11.685 6.59252 11.6325 6.48002 11.52C6.26252 11.3025 6.26252 10.9425 6.48002 10.725L10.725 6.48002C10.9425 6.26252 11.3025 6.26252 11.52 6.48002C11.7375 6.69752 11.7375 7.05752 11.52 7.27502L7.27502 11.52C7.17002 11.6325 7.02002 11.685 6.87752 11.685Z" fill="#D61414"/>
                                                            <path d="M11.1225 11.685C10.98 11.685 10.8375 11.6325 10.725 11.52L6.48002 7.27502C6.26252 7.05752 6.26252 6.69752 6.48002 6.48002C6.69752 6.26252 7.05752 6.26252 7.27502 6.48002L11.52 10.725C11.7375 10.9425 11.7375 11.3025 11.52 11.52C11.4075 11.6325 11.265 11.685 11.1225 11.685Z" fill="#D61414"/>
                                                        </svg>
                                                        <p className="vr-item-text">Do not upload selfies, screenshots and do not modify the images in graphic editors.</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                                    <Link to="/accountverification" className='order-5 order-sm-0'>&laquo; Back</Link>
                                                    <button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Submit request</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Innerlayout>
            </Fragment> 
        );
    }
};

export default UpdateDocument;