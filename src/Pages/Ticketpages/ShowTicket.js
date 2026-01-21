import React,{useState, useEffect, Fragment, useRef} from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import ReactQuill from 'react-quill';
import Parser from 'html-react-parser';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css';
import ReadOnlyMessage from './ReadOnlyMessage';
import EditMessage from './EditMessage';
import { Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { BackArrowIcon, DeleteIcon, DotsIcon, EditIcon, FileDownloadIcon } from "../../Components/icons";

const base_url = process.env.REACT_APP_API_URL;
const SHOW_Ticket_API = base_url+"/v1/client/show-ticket";
const SEND_MESSAGE_API = base_url+"/v1/client/send-message";
const DELETE_TICKET_API = base_url+"/v1/client/delete-ticket";
const DELETE_MESSAGE_API = base_url+"/v1/client/delete-message";
const DELETE_DOCUMENT_API = base_url+"/v1/client/delete-ticketDocument";
// const STORE_DOCUMENT_API = base_url+"/v1/client/ticket-documentUpload";
const DOWNLOAD_DOCUMENT_API = base_url+"/v1/client/download-document";

const ShowTicket = (props) => {

    const client = useSelector(showClient);

    let history = useHistory();
    let location = useLocation();
    const dispatch = useDispatch();

    var ticketId = location.state.ticketId;
    var ticketStatus = location.state.status;

    // let now = moment();

    // const [image, setImage] = useState(client.client.profile_photo!=null ? client.client.profile_photo : `${process.env.PUBLIC_URL}/Images/no-image.png`);
    const [data, setData] = useState({});
    const [message, setMessage] = useState([]);
    
    // const [documents, setDocuments] = useState([]);
    const [richText, setRichText] = useState('');
    const [error, setError] = useState({});
    const [files, setFiles] = useState(null);
    const [editId, setEditId] = useState(null);
    const [isError, setIsError] = useState(null);
    const fileRef = useRef();

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const data = {
                ticket_id: ticketId
            };
            await axios.post(SHOW_Ticket_API, data, config).then(res=>{
                if(res.data.status_code===200){

                    setData(res.data.data);
                    setMessage(res.data.data.message);

                    // setDocuments(res.data.data.documents);
                }
            })
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    const handleText = (content, delta, source, editor) => {
        setRichText(editor.getHTML());
    }

    const submitMessage=async(e)=>{
        e.preventDefault();

        try {

            const config = {
                'Content-Type': 'multipart/form-data',
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("ticket_id",ticketId);
            formData.append("message", richText);
            if(files!==null){
                files.forEach(file => {
                    formData.append("files[]", file);
                });
            }
        
            await axios.post(SEND_MESSAGE_API, formData, config).then((response) => {

                if (response.data.status_code === 200) {
                    // history.push('/ticket');
                    setMessage(response.data.data);
                    setRichText('');
                    setFiles(null);
                    fileRef.current.value = "";
                }
                else if (response.data.status_code === 500) {
                    let err = response.data.errors;
                    console.log(err);
                }
            }).catch((error)=>{
                console.log(error);
                if (error.response) {
                    let err = error.response.data.errors;
                    setError(err);
                }
            });
        
        } catch (err) {
        throw new Error(err);
        }
    }

    const deleteTicket=async(e)=>{
        e.preventDefault();
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            showCancelButton: true,
          })
          .then((willDelete) => {
            if (willDelete.isConfirmed){

                let formData = new FormData();
                formData.append("id",ticketId);

                try {
                    const config = {
                        headers: { Authorization: `Bearer ${client.token}` }
                    };

                     axios.post(DELETE_TICKET_API, formData, config).then((res)=>{
                        if(res.data.status_code===200){
                            history.push('/ticket');
                            Swal.fire("","Record deleted successfully!","success");
                        }
                        else if (res.data.status_code === 500) {
                            ;
                            setIsError(res.data.message);
                        }
                    }).catch((error) => {
                        if (error.response) {
                            console.log(error.response.data.errors);
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    const deleteMessage=async(e,id)=>{
        e.preventDefault();
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            showCancelButton: true,
          })
          .then((willDelete) => {
            if (willDelete.isConfirmed){

                let formData = new FormData();
                formData.append("id",id);

                try {
                    const config = {
                        headers: { Authorization: `Bearer ${client.token}` }
                    };

                     axios.post(DELETE_MESSAGE_API, formData, config).then((res)=>{
                         ;
                        if(res.data.status_code===200){
                            setMessage(res.data.data);
                            Swal.fire("","Record deleted successfully!","success");
                        }
                        else if (res.data.status_code === 500) {
                            ;
                            setIsError(res.data.message);
                        }
                    }).catch((error) => {
                        if (error.response) {
                            console.log(error.response.data.errors);
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    const handleEdit=(e,id)=>{
        e.preventDefault();

        setEditId(id);
    }

    const handleDocument=(e)=>{
        let files = Array.from(e.target.files);
        setFiles(files);
    }

    // const submitDocuments=async(e)=>{
    //     e.preventDefault();
    //     try {

    //         const config = {
    //             'Content-Type': 'multipart/form-data',
    //             headers: { Authorization: `Bearer ${client.token}` }
    //         };

    //         let formData = new FormData();
    //         formData.append("ticket_id",ticketId);
    //         files.forEach(file => {
    //             formData.append("files[]", file);
    //         });

    //         await axios.post(STORE_DOCUMENT_API, formData, config).then((response) => {
    //             if(response.data.status_code==200){

    //                 // setDocuments(response.data.data);
    //             }
    //             else if(response.data.status_code==500){
    //                 let err = response.data.errors;

    //             }
    //         }).catch((error)=>{
    //             console.log(error);
    //             if (error.response) {
    //                 let err = error.response.data.errors;
    //                 console.log(err);
    //             }
    //         });

    //     } catch (err) {
    //     throw new Error(err);
    //     }
    // }

    const deleteDocument=async(e,id)=>{
        e.preventDefault();
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            showCancelButton: true,
          })
          .then((willDelete) => {
            if (willDelete.isConfirmed){

                let formData = new FormData();
                formData.append("ticket_id",ticketId);
                formData.append("document_id",id);

                try {
                    const config = {
                        headers: { Authorization: `Bearer ${client.token}` }
                    };

                     axios.post(DELETE_DOCUMENT_API, formData, config).then((res)=>{
                        if(res.data.status_code===200){
                            setMessage(res.data.data);
                            Swal.fire("","Record deleted successfully!","");
                        }
                        else if (res.data.status_code === 500) {
                            ;
                            setIsError(res.data.message);
                        }
                    }).catch((error) => {
                        if (error.response) {
                            console.log(error.response.data.errors);
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }

    const downloadDocument=async(e,id,extension)=>{
        e.preventDefault();

        let today = new Date();
        let date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
        let time = today.getHours()+'_'+today.getMinutes()+'_'+today.getSeconds();
        let file_name = date+ '_'+ time;

        try {

            let urls = `${DOWNLOAD_DOCUMENT_API}/ticket/${id}`;

            axios({
                url: urls,
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download',file_name+'.'+extension); //or any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();// you need to remove that elelment which is created before.
              });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    },[])

    useEffect(() => {
        fetchData();
    },[editId])

    // useEffect(() => {
    //     fetchData();
    // },[documents])

    return (
        <Fragment>
                <Innerlayout>
                <div className="card-body ticket-details-wrapper">
                    <div className="top-block d-flex justify-content-between">
                        <Link to='/ticket' className="back-link d-flex align-items-center">
                            <BackArrowIcon width="24" height="24" />
                            Back
                        </Link>
                        {
                            ticketStatus !== 'Solved' ?
                                <Link to="#" onClick={deleteTicket} className="delete-ticket-icon cursor-pointer" title="Delete Ticket">
                                    <DeleteIcon width="20" height="20" />
                                </Link> : null
                        }
                    </div>
                    <div className="ticket-details-content">
                        <h2>{data.title}</h2>
                        {/* <ul className="c-tabs nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a className="active" id="message-tab" data-bs-toggle="tab" data-bs-target="#message-tab-pane" role="tab" aria-controls="message-tab-pane" aria-selected="false">Message</a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a className="" id="files-tab" data-bs-toggle="tab" data-bs-target="#files-tab-pane" role="tab" aria-controls="files-tab-pane" aria-selected="false">Files</a>
                            </li>
                        </ul> */}
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="message-tab-pane" role="tabpanel" aria-labelledby="message-tab" tabIndex="0">
                                <div className="d-flex">
                                    <span className="thumb"><img src={client.client.profile_photo !== null
                                        ? client.client.profile_photo
                                        : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt="" /></span>
                                    <div className="text-editor-block create-ticket">
                                        {
                                            ticketStatus !== 'Solved' ? 
                                            <form onSubmit={submitMessage}>
                                            {
                                                (isError!==null) ? 
                                                <Alert className="alert alert-danger">{isError}</Alert>
                                                : null
                                            }
                                            <Form.Group className="mb-3">
                                            <ReactQuill
                                                className='form-control'
                                                theme="snow"
                                                value={richText}
                                                onChange={handleText}
                                            />  
                                            <small className="text-danger">{error.message}</small>
                                            </Form.Group>
                                            <Form.Group className='file-chooser'>
                                                <input type="file" ref={fileRef} name='files' className='form-control' onChange={handleDocument} multiple/>
                                                <div className="file-name-block d-flex mb-0 border-bottom-0">
                                                    <p>Provide files in JPG, PNG, DOC, PDF, SVG or MP4 format, 5 MB maximum</p>
                                                </div>
                                            </Form.Group>
                                                    <div className="buttons">
                                                        <Link to='/ticket' className="btn btn-light">Discard</Link>
                                                        <button type="submit" className="btn btn-primary">Send</button>
                                            </div>
                                            </form> : null
                                        }
                                    </div>
                                </div>
                                <div className="comment-wrapper">
                                    {
                                        (message.length > 0) && message.map(val=>(
                                            (val.client_id==null) ?
                                            <div className="comment-box d-flex">
                                                <span className="thumb">S</span>
                                                <div className="content">
                                                        <Link to="#" className='red'>Supporter</Link>
                                                    <span>replied</span>
                                                    <span className="date-time">{moment(val.created_at).format('LLLL')} ({moment().diff(val.created_at,'days')} days ago)</span>
                                                    <p>{Parser(val.message)}</p>
                                                    <span className='mt-2'>
                                                    {
                                                        (val['ticket_documents'].length > 0) ? 'Attachments:' : null
                                                    }
                                                    </span> 
                                                    {
                                                        (val['ticket_documents'].length > 0) && val['ticket_documents'].map(document=>(
                                                            <div className='d-block file-upload-details'>
                                                                <span className='font-weight-bold'>{document.name}</span>
                                                                <Link to="#" style={{ cursor: 'pointer' }} onClick={(e) => downloadDocument(e, document.id, document.extension)}> <FileDownloadIcon width="20" height="20" /></Link>
                                                                {
                                                                    (moment().diff(val.created_at,'days') < 1) ? 
                                                                    <>
                                                                    <span></span>
                                                                            <Link to="#" className='cursor-pointer' onClick={(event) => deleteDocument(event, document.id)}>
                                                                                <DeleteIcon width="18" height="18" />
                                                                            </Link> 
                                                                    </> : null
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div> :
                                            <div className="comment-box d-flex">
                                                {
                                                    (moment().diff(val.created_at,'days') < 1) ? 
                                                            <Link to="#" className="dot-icon" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <DotsIcon width="4" height="16" />
                                                            </Link> : null
                                                }
                                                <ul className="dropdown-menu">
                                                        <li><Link to="#" className='cursor-pointer' onClick={(e) => handleEdit(e, val.id)}>
                                                            <EditIcon width="20" height="20" />
                                                            Edit Message</Link></li>
                                                        <li><Link to="#" className='cursor-pointer' onClick={(event) => deleteMessage(event, val.id)}>
                                                            <DeleteIcon width="20" height="20" />Delete</Link></li>
                                                </ul>
                                                <span className="thumb">{data.client_name[0]}</span>
                                                <div className="content">
                                                        <Link to="#">{data.client_name}</Link>
                                                    <span>replied</span>
                                                    <span className="date-time">{moment(val.created_at).format('LLLL')} ({moment().diff(val.created_at,'days')} days ago)</span>
                                                    {/* <p>{Parser(val.message)}</p> */}
                                                    {
                                                            (parseInt(val.id) === parseInt(editId)) ? 
                                                        <EditMessage message={val.message} handleEdit={handleEdit} id={val.id}/> : 
                                                        <ReadOnlyMessage message={Parser(val.message)}/>
                                                    }
                                                    <span className='mt-2'>
                                                    {
                                                        (val['ticket_documents'].length > 0) ? 'Attachments:' : null
                                                    }
                                                    </span> 
                                                    {
                                                        (val['ticket_documents'].length > 0) && val['ticket_documents'].map(document=>(
                                                            <div className='d-block file-upload-details'>
                                                                <span className='text-bold'>{document.name}</span>
                                                                <Link to="#" style={{ cursor: 'pointer' }} onClick={(e) => downloadDocument(e, document.id, document.extension)}><FileDownloadIcon width="20" height="20" /></Link>
                                                                {
                                                                    (moment().diff(val.created_at,'days') < 1) ? 
                                                                    <>
                                                                    <span></span>
                                                                            <Link to="#" onClick={(event) => deleteDocument(event, document.id)}>
                                                                                <DeleteIcon width="18" height="18" />
                                                                            </Link> 
                                                                    </> : null
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            {/* <div className="tab-pane fade" id="files-tab-pane" role="tabpanel" aria-labelledby="files-tab"tabIndex="0">
                                <div className="files-wrapper">
                                    <form onSubmit={submitDocuments} enctype="multipart/form-data">
                                        {
                                            (isError!==null) ?
                                            <Alert className="alert alert-danger">{isError}</Alert>
                                            : null
                                        }
                                        <div className="text-editor-block">
                                            <input type="file" name='files' className='form-control' onChange={handleDocument} multiple/>
                                            <div className="file-name-block d-flex mb-0 border-bottom-0">
                                                <p>Provide files in JPG or PDF format, 10 MB maximum</p>
                                            </div>
                                            <div className='buttons'>
                                                <button type="submit" className="btn btn-primary">Save</button>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="file-list">
                                        {
                                            documents!==[] && documents.map(val=>(
                                                <div className="file-block d-flex">
                                                    <span className="thumb">{val.extension}</span>
                                                    <div className="w-100 d-flex justify-content-between">
                                                        <div className="details">
                                                            <a href={null} className="file-name">{val.name}</a>
                                                            <div className="d-block file-upload-details">
                                                                <span>Attached by Darshan Soni</span>
                                                                <span>{val.created_at}</span>
                                                                <a onClick={(e)=>downloadDocument(e,val.id)}>Download</a>
                                                            </div>
                                                        </div>
                                                        <div className="icon">
                                                            <a href={null} onClick={(event)=>deleteDocument(event,val.id)}>
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M15.7507 5.04748C15.7357 5.04748 15.7132 5.04748 15.6907 5.04748C11.7232 4.64998 7.76323 4.49998 3.84073 4.89748L2.31073 5.04748C1.99573 5.07748 1.71823 4.85248 1.68823 4.53748C1.65823 4.22248 1.88323 3.95248 2.19073 3.92248L3.72073 3.77248C7.71073 3.36748 11.7532 3.52498 15.8032 3.92248C16.1107 3.95248 16.3357 4.22998 16.3057 4.53748C16.2832 4.82998 16.0357 5.04748 15.7507 5.04748Z" fill="#D61414"/>
                                                            <path d="M6.37556 4.29C6.34556 4.29 6.31556 4.29 6.27806 4.2825C5.97806 4.23 5.76806 3.9375 5.82056 3.6375L5.98556 2.655C6.10556 1.935 6.27056 0.9375 8.01806 0.9375H9.98306C11.7381 0.9375 11.9031 1.9725 12.0156 2.6625L12.1806 3.6375C12.2331 3.945 12.0231 4.2375 11.7231 4.2825C11.4156 4.335 11.1231 4.125 11.0781 3.825L10.9131 2.85C10.8081 2.1975 10.7856 2.07 9.99056 2.07H8.02556C7.23056 2.07 7.21556 2.175 7.10306 2.8425L6.93056 3.8175C6.88556 4.095 6.64556 4.29 6.37556 4.29Z" fill="#D61414"/>
                                                            <path d="M11.4078 17.0626H6.59279C3.97529 17.0626 3.87029 15.6151 3.78779 14.4451L3.30029 6.89256C3.27779 6.58506 3.51779 6.31506 3.82529 6.29256C4.14029 6.27756 4.40279 6.51006 4.42529 6.81756L4.91279 14.3701C4.99529 15.5101 5.02529 15.9376 6.59279 15.9376H11.4078C12.9828 15.9376 13.0128 15.5101 13.0878 14.3701L13.5753 6.81756C13.5978 6.51006 13.8678 6.27756 14.1753 6.29256C14.4828 6.31506 14.7228 6.57756 14.7003 6.89256L14.2128 14.4451C14.1303 15.6151 14.0253 17.0626 11.4078 17.0626Z" fill="#D61414"/>
                                                            <path d="M10.2455 12.9375H7.74805C7.44055 12.9375 7.18555 12.6825 7.18555 12.375C7.18555 12.0675 7.44055 11.8125 7.74805 11.8125H10.2455C10.553 11.8125 10.808 12.0675 10.808 12.375C10.808 12.6825 10.553 12.9375 10.2455 12.9375Z" fill="#D61414"/>
                                                            <path d="M10.875 9.9375H7.125C6.8175 9.9375 6.5625 9.6825 6.5625 9.375C6.5625 9.0675 6.8175 8.8125 7.125 8.8125H10.875C11.1825 8.8125 11.4375 9.0675 11.4375 9.375C11.4375 9.6825 11.1825 9.9375 10.875 9.9375Z" fill="#D61414"/>
                                                            </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                </Innerlayout>
        </Fragment>
    );
    }

export default ShowTicket;