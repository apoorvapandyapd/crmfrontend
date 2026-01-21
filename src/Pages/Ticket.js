import React,{useState, useEffect, Fragment} from 'react';
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Innerlayout from '../Components/Innerlayout';
import { Link } from 'react-router-dom';
import Pagination from '../Components/Pagination';
import PropagateLoader from "react-spinners/PropagateLoader";

const TicketPriority = React.lazy(() => import('./Ticketpages/TicketPriority'));	
const TicketDeparment = React.lazy(() => import('./Ticketpages/TicketDeparment'));	

const base_url = process.env.REACT_APP_API_URL;
const Ticket_API = base_url+"/v1/client/list-ticket";
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS==null ? 10 : process.env.TBL_SHOW_RECORDS;
const TBL_PER_PAGE = process.env.TBL_PER_PAGE==null ? 2 : process.env.TBL_PER_PAGE;

const Ticket = () => {

    const [ticketData, setTicketData] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [priorities, setPriorities] = useState(null);
    const [statuses, setStatuses] = useState(null);

    const client = useSelector(showClient);
    const dispatch = useDispatch();

    async function fetchData(){
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            
            await axios.post(Ticket_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){
                    setTicketData(res.data.data.tickets);
                    setDepartments(res.data.data.departments);
                    setPriorities(res.data.data.priorities);
                    setStatuses(res.data.data.statuses);

                }
            })
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    const callFetchData=()=>{
        fetchData();
    }

    useEffect(() => {
        fetchData();
    }, [])

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(TBL_SHOW_RECORDS);

    //---use for not show all pages at time, It divide pages in given number
    // const [pageNumberLimit, setPageNumberLimit] = useState(TBL_PER_PAGE);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = ticketData != null && ticketData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(ticketData != null && ticketData.length / recordsPerPage);

    if (ticketData === null) {
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
    else {
        return (
            <Fragment>
                    <Innerlayout>
                    <div className="row align-items-center mt-32">
                    <div className="col-sm-6 col-lg-6 ms-auto"><h2 className="mb-3 mb-sm-0">Tickets</h2></div>
                        <div className="col-sm-6 col-lg-6 ms-auto">
                            <Link to="/create/ticket"><button className="btn btn-primary float-end">Create Ticket</button></Link>
                        </div>
                    </div>
                    {
                            currentRecords.map(value=>(
                                <div className="ticket-list-wrapper">
                                    <div className="ticket-box mt-32">
                                        <div className="d-flex">
                                            <span className="thumb"><img src={(client.client.profile_photo!=null) ? client.client.profile_photo : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt=""/></span>
                                            <div className="content">
                                            {
                                                <Link to={{ pathname:'/show/ticket', state:{ticketId:value.id, status:value.status} }}>
                                                    <h4>{ value.title }</h4>
                                                </Link>
                                            }
                                                {/* <span className="id">#{ value.id }</span><span title="Observer" className="name"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.08031 9.01999C8.06698 9.01999 8.04698 9.01999 8.03365 9.01999C8.01365 9.01999 7.98698 9.01999 7.96698 9.01999C6.45365 8.97332 5.32031 7.79332 5.32031 6.33999C5.32031 4.85999 6.52698 3.65332 8.00698 3.65332C9.48698 3.65332 10.6936 4.85999 10.6936 6.33999C10.687 7.79999 9.54698 8.97332 8.10031 9.01999C8.08698 9.01999 8.08698 9.01999 8.08031 9.01999ZM8.00031 4.64665C7.06698 4.64665 6.31365 5.40665 6.31365 6.33332C6.31365 7.24665 7.02698 7.98665 7.93365 8.01999C7.95364 8.01332 8.02031 8.01332 8.08698 8.01999C8.98031 7.97332 9.68031 7.23999 9.68698 6.33332C9.68698 5.40665 8.93365 4.64665 8.00031 4.64665Z" fill="#9890AE"/>
                                                    <path d="M8.00022 15.1666C6.20688 15.1666 4.49355 14.5 3.16688 13.2866C3.04688 13.18 2.99355 13.02 3.00688 12.8666C3.09355 12.0733 3.58688 11.3333 4.40688 10.7866C6.39355 9.46663 9.61355 9.46663 11.5935 10.7866C12.4135 11.34 12.9069 12.0733 12.9935 12.8666C13.0135 13.0266 12.9535 13.18 12.8335 13.2866C11.5069 14.5 9.79355 15.1666 8.00022 15.1666ZM4.05355 12.7333C5.16022 13.66 6.55355 14.1666 8.00022 14.1666C9.44688 14.1666 10.8402 13.66 11.9469 12.7333C11.8269 12.3266 11.5069 11.9333 11.0335 11.6133C9.39355 10.52 6.61355 10.52 4.96022 11.6133C4.48688 11.9333 4.17355 12.3266 4.05355 12.7333Z" fill="#9890AE"/>
                                                    <path d="M7.99967 15.1667C4.04634 15.1667 0.833008 11.9534 0.833008 8.00004C0.833008 4.04671 4.04634 0.833374 7.99967 0.833374C11.953 0.833374 15.1663 4.04671 15.1663 8.00004C15.1663 11.9534 11.953 15.1667 7.99967 15.1667ZM7.99967 1.83337C4.59967 1.83337 1.83301 4.60004 1.83301 8.00004C1.83301 11.4 4.59967 14.1667 7.99967 14.1667C11.3997 14.1667 14.1663 11.4 14.1663 8.00004C14.1663 4.60004 11.3997 1.83337 7.99967 1.83337Z" fill="#9890AE"/>
                                                    </svg>
                                                    {value.observer}
                                                </span> */}
                                                <p>{ value.message}</p>
                                                {/* <span className="response">Response Due in 2 hr</span> */}
                                            </div>
                                        </div>
                                        <div className="ticket-box-bottom d-flex flex-wrap align-items-center">
                                            <TicketDeparment data={departments} ticketId={value.id} ticketDepartment={value.department} />
                                            <TicketPriority data={priorities} ticketStatus={statuses} ticketCreated={value.created_at} ticketId={value.id} statusId={value.status_id} priorityId={value.priority} callFetchData={callFetchData} />
                                        </div>
                                        </div>
                                </div>
                        ))
                    }
                    {
                        (currentRecords.length===0) ? 
                        <div className="card-body text-center">
                            <p className='mb-0'>You dont have any tickets</p> 
                        </div>:
                        <div>
                        {
                            ticketData.length > TBL_SHOW_RECORDS ?
                            <Pagination
                                nPages={nPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                maxPageLimit={maxPageNumberLimit}
                                minPageLimit={minPageNumberLimit}
                                            perPageLimit={TBL_PER_PAGE}
                                setMaxPageNumberLimit={setMaxPageNumberLimit}
                                setMinPageNumberLimit={setMinPageNumberLimit}
                            /> : null
                        }
                        </div>
                    }
                    </Innerlayout>
            </Fragment>
        );
    }
};

export default Ticket;