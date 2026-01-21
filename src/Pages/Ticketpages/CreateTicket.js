import React,{useState, useEffect, Fragment} from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useHistory } from 'react-router-dom';
import { PropagateLoader } from "react-spinners";
import { FormGroup, FormSelect } from 'react-bootstrap';
import { BackArrowIcon } from '../../Components/icons';

const base_url = process.env.REACT_APP_API_URL;
const Ticket_STORE_API = base_url+"/v1/client/store-ticket";
const Ticket_CREATE_API = base_url+"/v1/client/create-ticket";

const CreateTicket = (props) => {
    let history = useHistory();
    const client = useSelector(showClient);

    const dispatch = useDispatch();

    const [ticketInput, setTicketInput] = useState({
        'title': '',
        'priority':'',
        'department':'',
        'login':''
    });

    const [accountlist,setAccountlist] = useState(null);
    const [department, setDepartment] = useState([]);
    const [priority, setPriority] = useState([]);
    const [richText, setRichText] = useState('');
    const [files, setFiles] = useState(null);
    const [error, setError] = useState({});
    let [loading, setLoading] = useState(false);

    async function fetchData(){
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            await axios.post(Ticket_CREATE_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){
                    setDepartment(res.data.data.departments);
                    setPriority(res.data.data.priorities);
                    setAccountlist(res.data.data.accounts);
                    setLoading(false);
                }
            })
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }

    const handleInput=(e)=>{
        setTicketInput({...ticketInput,[e.target.name]:e.target.value});
    }

    const handleText = (content, delta, source, editor) => {
        setRichText(editor.getHTML());
    }

    const fileUpload=(e)=>{
        let files = Array.from(e.target.files);
        setFiles(files);
        // files.map(file=>{
        //     let reader = new FileReader();
        //     reader.readAsDataURL(file);
        //     reader.onload=(e)=>{
        //         setFiles(e.target.result);
        //     }
        // });
    }

    const submitInput=async(e)=>{
        e.preventDefault();
        setLoading(true);

        let formData = new FormData();
        formData.append("title",ticketInput.title);
        formData.append("message",richText);
        formData.append("priority",ticketInput.priority);
        formData.append("department",ticketInput.department);
        formData.append("login",ticketInput.login);
        
        if(files!==null){
            files.forEach(file => {
                formData.append("ticket_documents[]",file);
            });
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            await axios.post(Ticket_STORE_API, formData, config).then(res => {
                if(res.data.status_code===200){

                    history.push('/ticket')
                }
                setLoading(false);

            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data.errors);
                    setError(error.response.data.errors);
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    },[])

    if ((department.length < 0 && priority.length < 0)) {
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
    else{
        return (
            <Fragment>
                    <Innerlayout>
                    {
                        (loading === true) ? <PropagateLoader
                            color={'#000b3e'}
                            loading={true}
                            cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        /> :
                            <div className="box-wrapper w-700">
                                <div className="card-body create-ticket p-0 bg-white">
                                <h2 className="mb-0 px-40">
                                        <Link to='/ticket' className="back-arrow"> 
                                            <BackArrowIcon width="24" height="24" />
                                        </Link>
                                    Create Ticket
                                </h2>
                                <div className='p-40'>
                                    <form onSubmit={submitInput}>
                                        <Form.Group className="mb-3">
                                                <input type="text" className="form-control" placeholder="Enter subject" name='title' onChange={handleInput} />
                                            <small className="text-danger">{error.title}</small>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <ReactQuill
                                                className='form-control'
                                                theme="snow"
                                                value={richText}
                                                onChange={handleText}
                                            />  
                                            <small className="text-danger">{error.message}</small>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                        <Form.Group controlId="formFileMultiple" className="mb-3">
                                            <Form.Control type="file" name='files' onChange={fileUpload} multiple />
                                            <small className="text-danger">{Object.keys(error).map((key) => (
                                                key.includes('ticket_documents') && error[key]
                                            ))}</small>
                                        </Form.Group>                                   
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                                <select className="form-control select" name='priority' value={ticketInput.priority} onChange={handleInput}>
                                                <option>Select Priority</option>
                                                {
                                                    priority.map(val=>(
                                                        <option value={val.id}>{val.priority}</option>
                                                    ))
                                                }
                                            </select>
                                            <small className="text-danger">{error.priority}</small>
                                        </Form.Group>
                                        <Form.Group className="mb-4">
                                                <select className="form-control select" name='department' value={ticketInput.department} onChange={handleInput}>
                                                <option>Select Department</option>
                                                {
                                                    department.map(val=>(
                                                        <option value={val.id}>{val.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <small className="text-danger">{error.department}</small>
                                        </Form.Group>
                                        <FormGroup className="mb-3">
                                            <FormSelect name="login" onChange={handleInput}>
                                                <option value="">Select an account</option>
                                                { accountlist!=null && accountlist.map((account,i) => 
                                                    <option value={account}>{account}</option> 
                                                )}
                                            </FormSelect>
                                            <small className="text-danger">{error.login}</small>
                                        </FormGroup>
                                        <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                            <Link to="/ticket" className='order-5 order-sm-0'>&laquo; Back</Link>
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
    }

export default CreateTicket;