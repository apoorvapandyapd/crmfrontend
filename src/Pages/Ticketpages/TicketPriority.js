import React, { useState } from 'react';
import { useSelector } from "react-redux";
import {showClient} from '../../store/clientslice';
import Swal from 'sweetalert2';
import { ClockIcone } from '../../Components/icons';

import { CustomRequest } from '../../Components/RequestService';

const TicketPriority = (props) => {
    const [priority, setPriority] = useState(props.priorityId);
    const [status, setStatus] = useState(props.statusId);
    const client = useSelector(showClient);

    let rating = null;

    const SubmitStatus = async (selected_val) => {
        var selected_status = selected_val;
        const bodyParameters = {
            status: selected_status,
            ticket_id: props.ticketId
        };
        CustomRequest('change-status', bodyParameters, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 401) {
                }
            } else {
                if (res.data.status_code === 200) {
                }
            }
        });
    }

    function reply(feel) {
        rating = feel;
        const buttons = document.querySelectorAll('.emoji-btn');
        buttons.forEach((button) => {
            button.classList.remove('active');
        });

        let buttonId = 'btn' + rating;
        document.getElementById(buttonId).classList.add('active');
    }

    async function ask(selected_val) {
        const wrap = document.createElement('div');
        wrap.className = 'text-muted';

        const button1 = document.createElement('button');
        button1.className = 'emoji-btn';
        button1.id = 'btn1';
        button1.onclick = () => reply(1);
        const img1 = document.createElement('img');
        img1.src = `${process.env.PUBLIC_URL}/Images/realrating-1.png`;
        button1.appendChild(img1);
        wrap.appendChild(button1);

        const button2 = document.createElement('button');
        button2.className = 'emoji-btn';
        button2.id = 'btn2';
        button2.onclick = () => reply(2);
        const img2 = document.createElement('img');
        img2.src = `${process.env.PUBLIC_URL}/Images/realrating-2.png`;
        button2.appendChild(img2);
        wrap.appendChild(button2);

        const button3 = document.createElement('button');
        button3.className = 'emoji-btn';
        button3.id = 'btn3';
        button3.onclick = () => reply(3);
        const img3 = document.createElement('img');
        img3.src = `${process.env.PUBLIC_URL}/Images/realrating-3.png`;
        button3.appendChild(img3);
        wrap.appendChild(button3);

        const button4 = document.createElement('button');
        button4.className = 'emoji-btn';
        button4.id = 'btn4';
        button4.onclick = () => reply(4);
        const img4 = document.createElement('img');
        img4.src = `${process.env.PUBLIC_URL}/Images/realrating-4.png`;
        button4.appendChild(img4);
        wrap.appendChild(button4);

        const button5 = document.createElement('button');
        button5.className = 'emoji-btn';
        button5.id = 'btn5';
        button5.onclick = () => reply(5);
        const img5 = document.createElement('img');
        img5.src = `${process.env.PUBLIC_URL}/Images/realrating-5.png`;
        button5.appendChild(img5);
        wrap.appendChild(button5);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'user_input';
        input.placeholder = 'Enter your feedback here';
        wrap.appendChild(input);

        const hr = document.createElement('hr');
        wrap.appendChild(hr);

        try {
            Swal.fire({
                title: 'Please give your feedback',
                html: wrap,
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                showConfirmButton: true,
                confirmButtonText: 'Solved',
                allowOutsideClick: false,
                preConfirm: () => {
                    const userFeedback = document.getElementById('user_input').value;
              
                    if (!userFeedback.trim() || rating == null) {
                        ask();
                    } else {
                    
                        const bodyParameters = {
                        feed_back: userFeedback,
                        rating: rating,
                        ticket_id: props.ticketId,
                        status: selected_val,
                        };

                        CustomRequest('ticket-review', bodyParameters, client.token, (res)=> {
                            if(res?.error) {
                                console.log(res.error);
                                if (res.error.response.status === 401) {
                                }
                            } else {
                                if (res.data.status_code === 200) {
                                    setStatus(selected_val);
                                    props.callFetchData();
                                }
                            }
                        });
                    }
                },
            }).then((result) => {
                // Handle modal close event if needed
                if (result.dismiss === Swal.DismissReason.cancel) {
                    setStatus('1');
                }
            });
        } catch (err) {

            throw new Error(err);
        }
    }

    const handleInput = (e) => {
        setStatus(e.target.value);

        if (parseInt(e.target.value) !== 1) {
            ask(e.target.value);
        } else {
            SubmitStatus(e.target.value);
        }
    }

    // useEffect((e) => { 
    //     SubmitPriority();
    // },[priority])

    return (
        <div className="ms-auto d-flex align-items-center flex-wrap">
            <div className="date">

                <ClockIcone width="20" height="20" />
                <span>{props.ticketCreated}</span>
            </div>
            <div className="d-flex">
                <div className="status d-flex align-items-center ms-auto" key={props.ticketId}>
                    Priority
                    {
                        props.data.map(value =>
                            (value.id === props.priorityId) ? <span key={value.id}>{value.priority}</span> : null
                        )
                    }
                </div>
                <div className="priority d-flex align-items-center ms-3">
                    Status
                    <select className="form-control select low" onChange={handleInput} value={status} disabled={status === 2}>
                        {
                            props.ticketStatus.map(value => (
                                <option value={value.id} key={value.id}>{value.name}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TicketPriority;