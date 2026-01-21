import {Button, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {showClient} from "../../store/clientslice";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from 'react';
import Swal from "sweetalert2";

const base_url = process.env.REACT_APP_API_URL;
const DELETE_DOCUMENT_API = base_url + "/v1/client/delete-document";


const Documents = (props) => {

    const data = props.data.data.documents;

    const client = useSelector(showClient);
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);

    const handleClose = () => setShow(false);

    const deleteDocument = async (e, id) => {
        e.preventDefault();
        var targets = e.currentTarget;
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    let formData = new FormData();
                    formData.append("id", id);

                    try {
                        const config = {
                            headers: {Authorization: `Bearer ${client.token}`}
                        };

                        axios.post(DELETE_DOCUMENT_API, formData, config).then((res) => {
                            if (res.data.status_code === 200) {
                                targets.closest('tr').remove();
                                Swal("Record deleted successfully!", {
                                    icon: "success",
                                });
                            } else if (res.data.status_code == 500) {

                            }
                        }).catch((error) => {
                            if (error.response) {

                            }
                        });
                    } catch (error) {
                        
                    }
                }
            });
    }

    const showModal = (event, url) => {
        setShow(true);
        setImage(url);
    }

    return (
        <div className="card-body p-0 table-last-col">
            <div className="table-responsive">
                <Table className="table m-0">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Document</th>
                        <th scope="col">Status</th>
                        <th scope="col">Comment</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((doc, i) =>
                        <tr>
                            <th scope="row">{i + 1}</th>
                            <td>{doc.title}</td>
                            <td>
                                {/* <Link to="#" className="document-icon"> */}
                                {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 22.75H8C4.35 22.75 2.25 20.65 2.25 17V7C2.25 3.35 4.35 1.25 8 1.25H16C19.65 1.25 21.75 3.35 21.75 7V17C21.75 20.65 19.65 22.75 16 22.75ZM8 2.75C5.14 2.75 3.75 4.14 3.75 7V17C3.75 19.86 5.14 21.25 8 21.25H16C18.86 21.25 20.25 19.86 20.25 17V7C20.25 4.14 18.86 2.75 16 2.75H8Z" fill="#0B0B16" />
                                    <path d="M18.5 9.25H16.5C14.98 9.25 13.75 8.02 13.75 6.5V4.5C13.75 4.09 14.09 3.75 14.5 3.75C14.91 3.75 15.25 4.09 15.25 4.5V6.5C15.25 7.19 15.81 7.75 16.5 7.75H18.5C18.91 7.75 19.25 8.09 19.25 8.5C19.25 8.91 18.91 9.25 18.5 9.25Z" fill="#0B0B16" />
                                    <path d="M12 13.75H8C7.59 13.75 7.25 13.41 7.25 13C7.25 12.59 7.59 12.25 8 12.25H12C12.41 12.25 12.75 12.59 12.75 13C12.75 13.41 12.41 13.75 12 13.75Z" fill="#0B0B16" />
                                    <path d="M16 17.75H8C7.59 17.75 7.25 17.41 7.25 17C7.25 16.59 7.59 16.25 8 16.25H16C16.41 16.25 16.75 16.59 16.75 17C16.75 17.41 16.41 17.75 16 17.75Z" fill="#0B0B16" />
                                </svg> */}
                                <a href="#" onClick={(e) => showModal(e, doc.document)}><img
                                    src={doc.document} height='50px' width='50px'></img></a>
                                {/* </Link> */}
                            </td>
                            <td className={`${doc.status === 'Rejected' && "red"}`}>{doc.status}</td>
                            <td>{doc.comment}</td>
                            <td>
                                {
                                    doc.status === 'Rejected' ?
                                        <Link className="reupload-btn" to={{
                                            pathname: '/update/document',
                                            state: {title: doc.title, image: doc.document}
                                        }}><Button
                                            className="btn btn-primary float-end btn-small">Reupload</Button></Link>
                                        : <div></div>
                                }
                                {
                                    doc.status === 'Pending' ?
                                        <a href="#" onClick={(e) => deleteDocument(e, doc.id)}
                                           className="delete-icon">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M15.75 5.0476C15.735 5.0476 15.7125 5.0476 15.69 5.0476C11.7225 4.6501 7.7625 4.5001 3.84 4.8976L2.31 5.0476C1.995 5.0776 1.7175 4.8526 1.6875 4.5376C1.6575 4.2226 1.8825 3.9526 2.19 3.9226L3.72 3.7726C7.71 3.3676 11.7525 3.5251 15.8025 3.9226C16.11 3.9526 16.335 4.2301 16.305 4.5376C16.2825 4.8301 16.035 5.0476 15.75 5.0476Z"
                                                    fill="#D61414"/>
                                                <path
                                                    d="M6.37507 4.29C6.34507 4.29 6.31507 4.29 6.27757 4.2825C5.97757 4.23 5.76757 3.9375 5.82007 3.6375L5.98507 2.655C6.10507 1.935 6.27007 0.9375 8.01757 0.9375H9.98257C11.7376 0.9375 11.9026 1.9725 12.0151 2.6625L12.1801 3.6375C12.2326 3.945 12.0226 4.2375 11.7226 4.2825C11.4151 4.335 11.1226 4.125 11.0776 3.825L10.9126 2.85C10.8076 2.1975 10.7851 2.07 9.99007 2.07H8.02507C7.23007 2.07 7.21507 2.175 7.10257 2.8425L6.93007 3.8175C6.88507 4.095 6.64507 4.29 6.37507 4.29Z"
                                                    fill="#D61414"/>
                                                <path
                                                    d="M11.4075 17.0624H6.59255C3.97505 17.0624 3.87005 15.6149 3.78755 14.4449L3.30005 6.89243C3.27755 6.58493 3.51755 6.31493 3.82505 6.29243C4.14005 6.27743 4.40255 6.50993 4.42505 6.81743L4.91255 14.3699C4.99505 15.5099 5.02505 15.9374 6.59255 15.9374H11.4075C12.9825 15.9374 13.0125 15.5099 13.0875 14.3699L13.575 6.81743C13.5975 6.50993 13.8675 6.27743 14.175 6.29243C14.4825 6.31493 14.7225 6.57743 14.7 6.89243L14.2125 14.4449C14.13 15.6149 14.025 17.0624 11.4075 17.0624Z"
                                                    fill="#D61414"/>
                                                <path
                                                    d="M10.2451 12.9375H7.74756C7.44006 12.9375 7.18506 12.6825 7.18506 12.375C7.18506 12.0675 7.44006 11.8125 7.74756 11.8125H10.2451C10.5526 11.8125 10.8076 12.0675 10.8076 12.375C10.8076 12.6825 10.5526 12.9375 10.2451 12.9375Z"
                                                    fill="#D61414"/>
                                                <path
                                                    d="M10.875 9.9375H7.125C6.8175 9.9375 6.5625 9.6825 6.5625 9.375C6.5625 9.0675 6.8175 8.8125 7.125 8.8125H10.875C11.1825 8.8125 11.4375 9.0675 11.4375 9.375C11.4375 9.6825 11.1825 9.9375 10.875 9.9375Z"
                                                    fill="#D61414"/>
                                            </svg>
                                        </a> : null
                                }
                            </td>
                        </tr>
                    )}

                    </tbody>
                </Table>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={image} height='100%' width='100%'></img>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Documents;