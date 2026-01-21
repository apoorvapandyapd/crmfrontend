import React, {useState, useEffect, Fragment, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import Innerlayout from "../../Components/Innerlayout";
import {redirectAsync, showClient} from "../../store/clientslice";
import {Link, useLocation, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import ReactQuill from "react-quill";
import Parser from "html-react-parser";
import moment from "moment";
import "react-quill/dist/quill.snow.css";
import ReadOnlyMessage from "./ReadOnlyMessage";
import EditMessage from "./EditMessage";
import {Alert} from "react-bootstrap";
import Swal from "sweetalert2";
import { BackArrowIcon, DeleteIcon, DotsIcon, EditIcon, FileDownloadIcon } from "../../Components/icons";

import { CustomRequest } from '../../Components/RequestService';

const ShowTicket = (props) => {

  const client = useSelector(showClient);

    let history = useHistory();
    let location = useLocation();
    const dispatch = useDispatch();

  var ticketId = location.state.ticketId;
  var ticketStatus = location.state.status;

  // let now = moment();

    // const [image, setImage] = useState(client.client.profile_photo != null ? client.client.profile_photo : `${process.env.PUBLIC_URL}/Images/no-image.png`);
    const [data, setData] = useState({});
    const [message, setMessage] = useState([]);
    // const [documents, setDocuments] = useState([]);
    const [richText, setRichText] = useState("");
    const [error, setError] = useState({});
    const [files, setFiles] = useState(null);
    const [editId, setEditId] = useState(null);
    const [isError, setIsError] = useState(null);
    const fileRef = useRef();

    function fetchData() {
        const data = {
            ticket_id: ticketId,
        };
        CustomRequest('show-ticket', data, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    setData(res.data.data);
                    setMessage(res.data.data.message);
                }
            }
        });
    }

    const handleText = (content, delta, source, editor) => {
        setRichText(editor.getHTML());
    };

    const submitMessage = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("ticket_id", ticketId);
        formData.append("message", richText);
        if (files !== null) {
            files.forEach((file) => {
                formData.append("files[]", file);
            });
        }
        CustomRequest('send-message', formData, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 401) {
                    
                    setError(res.error.message);
                }
            } else {
                if (res.data.status_code === 200) {
                    setMessage(res.data.data);
                    setRichText("");
                    setFiles(null);
                    fileRef.current.value = "";
                }
            }
        });
  };

    const deleteTicket = async (e) => {
        e.preventDefault();
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            showCancelButton: true,
        }).then((willDelete) => {
            if (willDelete.isConfirmed) {
                let formData = new FormData();
                formData.append("id", ticketId);

                CustomRequest('delete-ticket', formData, client.token, (res)=> {
                    if(res?.error) {
                        console.log(res.error);
                        if (res.error.response.status === 401) {
                            setIsError(res.error.response.message);
                        }
                    } else {
                        if (res.data.status_code === 200) {
                            history.push("/ticket");
                            Swal.fire("", "Record deleted successfully!", "success");
                        }
                    }
                });
            }
        });
    };

    const deleteMessage = async (e, id) => {
        e.preventDefault();
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            showCancelButton: true,
        }).then((willDelete) => {
            if (willDelete.isConfirmed) {
                let formData = new FormData();
                formData.append("id", id);


                CustomRequest('delete-message', formData, client.token, (res)=> {
                    if(res?.error) {
                        console.log(res.error);
                        if (res.error.response.status === 401) {
                            setIsError(res.error.message);
                        }
                    } else {
                        if (res.data.status_code === 200) {
                            setMessage(res.data.data);
                            Swal.fire("", "Record deleted successfully!", "success");
                        }
                    }
                });
            }
        });
    };

    const handleEdit = (e, id) => {
        e.preventDefault();
        setEditId(id);
    };

    const handleDocument = (e) => {
        let files = Array.from(e.target.files);
        setFiles(files);
    };

  // const submitDocuments = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const config = {
  //       "Content-Type": "multipart/form-data",
  //       headers: { Authorization: `Bearer ${client.token}` },
  //     };

  //     let formData = new FormData();
  //     formData.append("ticket_id", ticketId);
  //     files.forEach((file) => {
  //       formData.append("files[]", file);
  //     });

  //     await axios
  //       .post(STORE_DOCUMENT_API, formData, config)
  //       .then((response) => {
  //         if (response.data.status_code == 200) {

  //           // setDocuments(response.data.data);
  //         } else if (response.data.status_code == 500) {
  //           let err = response.data.errors;
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         if (error.response) {
  //           let err = error.response.data.errors;
  //           console.log(err);
  //         }
  //       });
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // };

    const deleteDocument = async (e, id) => {
        e.preventDefault();
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            showCancelButton: true,
        }).then((willDelete) => {
            if (willDelete.isConfirmed) {
                let formData = new FormData();
                formData.append("ticket_id", ticketId);
                formData.append("document_id", id);
                
                CustomRequest('delete-ticketDocument', formData, client.token, (res)=> {
                    if(res?.error) {
                        console.log(res.error);
                        if (res.error.response.status === 401) {
                            setIsError(res.error.message);
                        }
                    } else {
                        if (res.data.status_code === 200) {
                            setMessage(res.data.data);
                            Swal.fire("", "Record deleted successfully!", "");
                        }
                    }
                });
            }
        });
    };

    const downloadDocument = (e, id, extension) => {
        e.preventDefault();

        let today = new Date();
        let date = today.getFullYear() + "_" + (today.getMonth() + 1) + "_" + today.getDate();
        let time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();
        let file_name = date + "_" + time;
        CustomRequest('download-document/ticket', id, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 401) {
                    
                    setError(res.error.message);
                }
            } else {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", file_name + "." + extension); //or any other extension
                document.body.appendChild(link);
                link.click();
                link.remove(); // you need to remove that elelment which is created before.
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [editId]);

    // useEffect(() => {
    //     fetchData();
    // },[documents])

    return (<Fragment>
        <Innerlayout>
            <div className="card-body ticket-details-wrapper">
                <div className="top-block d-flex justify-content-between">
                    <Link to="/ticket" className="back-link d-flex align-items-center" >
                        <BackArrowIcon width="24" height="24" />
                        Back
                    </Link>
                    {ticketStatus !== "Solved" ? (<Link to="#"
                        onClick={deleteTicket}
                        className="delete-ticket-icon"
                        title="Delete Ticket"
                    >
                        <DeleteIcon width="20" height="20" />
                    </Link>) : null}
                </div>
                <div className="ticket-details-content">
                    <h2>{data.title}</h2>
                    <div className="tab-content" id="myTabContent">
                        <div
                            className="tab-pane fade show active"
                            id="message-tab-pane"
                            role="tabpanel"
                            aria-labelledby="message-tab"
                            tabIndex="0"
                        >
                            <div className="d-flex">
                                  <span className="thumb">
                                    <img src={client.client.profile_photo !== null
                                        ? client.client.profile_photo
                                        : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt="" />
                                  </span>
                                <div className="text-editor-block create-ticket">
                                    {ticketStatus !== "Solved" ? (<form onSubmit={submitMessage}>
                                        {isError !== null ? (<Alert className="alert alert-danger">
                                            {isError}
                                        </Alert>) : null}
                                        <Form.Group className="mb-3">
                                            <ReactQuill
                                                className="form-control"
                                                theme="snow"
                                                value={richText}
                                                onChange={handleText}
                                            />
                                            <small className="text-danger">{error.message}</small>
                                        </Form.Group>
                                        <Form.Group className="file-chooser">
                                            <input
                                                type="file"
                                                ref={fileRef}
                                                name="files"
                                                className="form-control"
                                                onChange={handleDocument}
                                                multiple
                                            />
                                            <div className="file-name-block d-flex mb-0 border-bottom-0">
                                                <p>
                                                    Provide files in JPG, PNG, DOC, PDF, SVG or MP4
                                                    format, 5 MB maximum
                                                </p>
                                            </div>
                                        </Form.Group>
                                        <div className="buttons">
                                            <Link to="/ticket" className="btn btn-light">
                                                Discard
                                            </Link>
                                            <button type="submit" className="btn btn-primary">
                                                Send
                                            </button>
                                        </div>
                                    </form>) : null}
                                </div>
                            </div>
                            <div className="comment-wrapper">
                                {message.length > 0 && message.map((val) => val.client_id == null ? (
                                    <div className="comment-box d-flex" key={val.id}>
                                        <span className="thumb">S</span>
                                        <div className="content">
                                            <Link to="#"
                                                className="red"
                                                style={{fontSize: "16px"}}
                                            >
                                                Support Desk
                                            </Link>
                                            <span>Replied</span>
                                            <span className="date-time">
                                                  {moment(val.created_at).format("LLLL")} (
                                                {moment().diff(val.created_at, "days")} days ago)
                                                </span>
                                            <p>{Parser(val.message)}</p>
                                            <span className="mt-2">
                                                  <b style={{fontSize: "16px"}}>
                                                    {val["ticket_documents"].length > 0 ? "Attachments :" : null}
                                                  </b>
                                                </span>
                                            {val["ticket_documents"].length > 0 && val["ticket_documents"].map((document,i) => (
                                                <div className="d-block file-upload-details" key={i}>
                                                      <span className="font-weight-bold">
                                                        {document.name}
                                                      </span>
                                                    <Link to="#" className='cursor-pointer' onClick={(event) => deleteDocument(event, document.id)}>
                                                        <FileDownloadIcon width="20" height="20" />
                                                    </Link>
                                                    {moment().diff(val.created_at, "days") < 1 ? (<>
                                                        <span></span>
                                                        <Link to="#" className="dot-icon" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <DotsIcon width="4" height="16" />
                                                        </Link>
                                                    </>) : null}
                                                </div>))}
                                        </div>
                                    </div>) : (<div className="comment-box d-flex">
                                        {moment().diff(val.created_at, "days") < 1 ? (<Link
                                            to="#"
                                            className="dot-icon"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <DotsIcon width="4" height="16" />
                                        </Link>) : null}
                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link
                                                    style={{color: "#00AEFF"}}
                                                    to="#"
                                                    onClick={(e) => handleEdit(e, val.id)}
                                                >
                                                    <EditIcon width="20" height="20" />
                                                    Edit
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    style={{color: "#FF0000"}}
                                                    to="#"
                                                    onClick={(event) => deleteMessage(event, val.id)}
                                                >
                                                    <DeleteIcon width="20" height="20" />
                                                    Delete
                                                </Link>
                                            </li>
                                        </ul>
                                        <span className="thumb">{data.client_name[0]}</span>
                                        <div className="content">
                                            <Link
                                                to="#"
                                                style={{color: "#00AEFF", fontSize: "16px"}}
                                            >
                                                {data.client_name}
                                            </Link>
                                            <span>Replied</span>
                                            <span className="date-time">
                                          {moment(val.created_at).format("LLLL")} (
                                                {moment().diff(val.created_at, "days")} days ago)
                                        </span>
                                            {/* <p>{Parser(val.message)}</p> */}
                                            {
                                                (parseInt(val.id) === parseInt(editId)) ?
                                                    <EditMessage message={val.message} handleEdit={handleEdit} id={val.id}/> :
                                                    <ReadOnlyMessage message={Parser(val.message)}/>
                                            }
                                            <span className="mt-2">
                                          <b>
                                            {val["ticket_documents"].length > 0 ? "Attachments :" : null}
                                          </b>
                                        </span>
                                            {val["ticket_documents"].length > 0 && val["ticket_documents"].map((document) => (
                                                <div className="d-block file-upload-details" key={document.id}>
                                                      <span className="text-bold">
                                                        {document.name}
                                                      </span>
                                                    <Link to="#" style={{cursor: "pointer"}}
                                                       onClick={(e) => downloadDocument(e, document.id, document.extension)}
                                                        className="#101f91">
                                                        <FileDownloadIcon width="20" height="20" />
                                                    </Link>
                                                    {moment().diff(val.created_at, "days") < 1 ? (<>
                                                        <span></span>
                                                        <Link to="#"
                                                            onClick={(event) => deleteDocument(event, document.id)}
                                                        >
                                                            <DeleteIcon width="18" height="18" />
                                                        </Link>
                                                    </>) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Innerlayout>
    </Fragment>);
};

export default ShowTicket;
