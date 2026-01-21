import React, {Fragment, useState, useEffect} from "react";
import Innerlayout from "../Components/Innerlayout";
import {redirectAsync, showClient} from "../store/clientslice";
import {useDispatch, useSelector} from "react-redux";
import DocumentUpload from "./DocumentUpload";
import {useHistory} from "react-router-dom";
import { CustomRequest } from '../Components/RequestService';

const Accountstats = React.lazy(() => import("./Accountverify/Accountstats"));
// const Documents = React.lazy(() => import("./Accountverify/Documents"));

const base_url = process.env.REACT_APP_API_URL;
const DASHBOARD_API_URL = base_url + "/v1/client/list-document";

const Accountverification = (props) => {
    const [documentdata, setDocumentdata] = useState(null);
    const client = useSelector(showClient);
    const dispatch = useDispatch();
    const history = useHistory();

    if (client.islogin === false) {
        history.push("/login");
    }

    function fetchData() {
        const data = {
            key: "value",
        };
        CustomRequest('list-document', data, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                setDocumentdata(res.data);
            }
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Fragment>
            <Innerlayout>
                <Accountstats data={documentdata} verifyStatus={client.client.verify}/>
                <DocumentUpload
                    verifyStatus={client.client.verify}
                    fetchFunction={fetchData}
                />
            </Innerlayout>
        </Fragment>
    );
};

export default Accountverification;
