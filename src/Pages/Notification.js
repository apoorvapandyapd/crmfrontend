import React, { Fragment, useEffect, useState } from 'react';
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Table } from 'react-bootstrap';
import Innerlayout from '../Components/Innerlayout';
import { PropagateLoader } from "react-spinners";

const base_url = process.env.REACT_APP_API_URL;
const NOTIFICATION_API = base_url + "/v1/client/list-notification";

function Notification() {

    const [notification,setNotification] = useState(null);

    const client = useSelector(showClient);
    const dispatch = useDispatch();

    // const options = {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //     hour: '2-digit',
    //     minute: '2-digit',
    // };

    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {};
            await axios.post(NOTIFICATION_API, bodyParameters, config).then((res)=>{
                if(res.data.status_code===200){

                    setNotification(res.data.data);
                }
                else if (res.data.status_code === 500) {
                    ;
                }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data.errors);
                }
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    if (notification === null) {
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

    return (
        <Fragment>
            <Innerlayout>
            <div className="card-body p-0 table-last-col">
                <div className="table-responsive">
                    <Table className="table m-0 align-middle">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Notifications</th>
                                <th scope="col" style={{ width:'200px' }}>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                        {notification.map((data,i) =>
                            <tr>
                                <th scope="row">{i+1}</th>
                                <td>{data.notification_message}</td>
                                <td>{data.created_at}</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </div>
            </div>
            </Innerlayout>
        </Fragment>
    );
}

export default Notification;