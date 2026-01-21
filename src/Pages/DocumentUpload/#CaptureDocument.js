import { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { CameraFeed } from "../../Components/CameraFeed";
import Innerlayout from "../../Components/Innerlayout";
import axios from 'axios';
import { showClient } from '../../store/clientslice';
import { useSelector } from "react-redux";
import { Col, Form, Row } from 'react-bootstrap';


const base_url = process.env.REACT_APP_API_URL;
const DOCUMENT_NAME_API = base_url + "/v1/client/list-namedocument";
const STORE_DOCUMENT_API = base_url + "/v1/client/store-document";


const CaptureDocument = () => {

    const client = useSelector(showClient);
    let history = useHistory();
    const [documentData, setDocumentData] = useState(null);
    const [imagefront, setImagefront] = useState(null);
    const [front, setFront] = useState(null);
    const [back, setBack] = useState(null);
    const [imageback, setImageback] = useState(null);
    const [selectDocument, setSelectDocument] = useState(null);
    const [documentName, setDocumentName] = useState(null);
    const [selectedDocumentSide, setSelectedDocumentSide] = useState(null);

    const handleInput = (e) => {
        setSelectDocument(e.target.value);
        documentData.data.map(val => {
            if (val.id == e.target.value) {
                setSelectedDocumentSide(val.document_side)
                setDocumentName(val.name)
            }
        });
    }

    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            const response = await axios.post(DOCUMENT_NAME_API, bodyParameters, config).then(res => {
                if (res.data.status_code === 200) {
                    setDocumentData(res.data);

                }
            })
        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchData();
    }, [])


    const uploadImage = async file => {
        file['name'] = 'front_img';
        setImagefront(file);
        setFront(URL.createObjectURL(file));
       
        
    };
    const uploadImageback = async fileback => {
        setImageback(fileback);
       
        setBack(URL.createObjectURL(fileback));
    };


    const uploadDocument = (e) => {
        e.preventDefault();
        // var docName = documentName.replace(/\s+/g,"_");

        try {
            const formData = new FormData();
            let docName = documentName.replace(' ','_');
            // formData.append('Driving_Licence_front', image);
            if(selectedDocumentSide==2){
                formData.append(docName+'_front', imagefront,'front.png');
                formData.append(docName+'_back', imageback,'back.png');
            }
            else{
                formData.append(docName+'_front', imagefront);
            }



            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${client.token}`
                },
            };

            axios.post(STORE_DOCUMENT_API, formData, config).then((response) => {

                if (response.data.status_code == 200) {
                    history.push('/accountverification');
                }
                else if (response.data.status_code == 500) {
                    let err = response.data.errors;
                    // let data=[
                    //     {'front':err[docName+'_front']},
                    //     {'back':err[docName+'_back']}
                    // ]

                }
            }).catch((error) => {

                if (error.response) {
                    let err = error.response.data.errors;


                }
            });
        }
        catch (err) {
            throw new Error(err);
        }


    }
    if (documentData === null) {
        return (
            <Fragment>
                <Innerlayout>Loading ...</Innerlayout>
            </Fragment>
        );
    }
    return (
        <Fragment>
            <Innerlayout>
                <Row>
                <div className="site-wrapper">
                    <div className="box-wrapper">
                        <div className="card-body create-ticket p-0 bg-white">
                            <h2 className="mb-0 px-40">
                                <Link to='/accountverification'><a href="#" className="back-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16" />
                                        <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16" />
                                    </svg>
                                </a></Link>
                                Capture Photo
                            </h2>
                            <form onSubmit={uploadDocument} encType="multipart/form-data">
                                <div className='p-40'>
                                <Row>
                                    <Col md={6}>
                                        <div className="upload-id">
                                            <h3>1. Upload your ID</h3>
                                            <Form.Group>
                                                <select className="form-control select" value={selectDocument} onChange={handleInput}>
                                                    <option>Select your ID type</option>
                                                    {
                                                        documentData.data.map(val => (
                                                            <option value={val.id}>{val.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </Form.Group>
                                        </div>
                                    </Col>
                                </Row>
                                </div>
                                {/* { 
                                    selectedDocumentSide==1 ? (<Col lg={6}><CameraFeed sendFile={uploadImage} /></Col>) : (<Row><Col lg={6}><CameraFeed sendFile={uploadImage} /></Col> <Col lg={6}><CameraFeed sendFile={uploadImageback} /></Col></Row>)
                                } */}
                                {/* <img src={front} /> */}
                                {/* <img src={back} /> */}
                                
                                <div className='p-40'>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link to="/accountverification">&laquo; Back</Link>
                                        <button type="submit" className="btn btn-primary">Submit request</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                </Row>
            </Innerlayout>
        </Fragment>
    );
}

export default CaptureDocument;