import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import axios from 'axios';
import {showClient} from '../../store/clientslice';

const base_url = process.env.REACT_APP_API_URL;
const TICKET_DEPARMENT_API = base_url + "/v1/client/change-deparment";

const TicketDeparment = (props) => {

    const [department, setDepartment] = useState(props.ticketDepartment);
    const client = useSelector(showClient);

    const SubmitDepartment = async (selected_val) => {
        var selected_department = selected_val;
        try {
            const config = {
                headers: {Authorization: `Bearer ${client.token}`}
            };

            const bodyParameters = {
                department_id: selected_department,
                ticket_id: props.ticketId
            };

            const response = await axios.post(TICKET_DEPARMENT_API, bodyParameters, config);

            if (response.status === 200 && response.data.status_code === 200) {

            }
        } catch (err) {

            throw new Error(err);
        }
    }

    const handleInput = async (e) => {
        setDepartment(e.target.value);
        SubmitDepartment(e.target.value);
    }

    // useEffect(() => { 
    //     SubmitDepartment();  
    // },[department])


    return (
        <div className="status department-select d-flex align-items-center ms-0" key={props.ticketId}>
            Department:
            {
                props.data.map(value=>(
                    (value.id === props.ticketDepartment) ? <span>{value.name}</span> : null
                ))
            }
        </div>
    );
};

export default TicketDeparment;