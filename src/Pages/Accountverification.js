import React, { Fragment, useState, useEffect } from "react";
import Innerlayout from "../Components/Innerlayout";
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import DocumentUpload from "./DocumentUpload";
import { useHistory } from 'react-router-dom';
const Accountstats = React.lazy(() => import('./Accountverify/Accountstats'));

const base_url = process.env.REACT_APP_API_URL;
const DASHBOARD_API_URL = base_url+"/v1/client/list-document";

const Accountverification = (props) => {

    const [documentdata, setDocumentdata] = useState(null);
    // let [loading, setLoading] = useState(false);
    const client = useSelector(showClient);
    const dispatch = useDispatch();
    const history = useHistory();

    if (client.islogin === false)
    {

        history.push('/login')
    }

    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };
            const response = await axios.post(DASHBOARD_API_URL, bodyParameters, config)

            
            setDocumentdata(response.data)
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
    

    return(
        <Fragment>
            <Innerlayout>
                <Accountstats data={documentdata} verifyStatus={client.client.verify} />
                <DocumentUpload verifyStatus={client.client.verify} fetchFunction={fetchData}/>
            </Innerlayout>
        </Fragment>
    );
}


export default Accountverification;