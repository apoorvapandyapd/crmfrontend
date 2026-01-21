import { Fragment, useState, useEffect } from "react";
import Innerlayout from "../Components/Innerlayout";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Ibwithdrawtable from "./Withdraw/Ibwithdrawtable";
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";

const base_url = process.env.REACT_APP_API_URL;
const WITHDRAW_API_URL = base_url + "/v1/client/iblist-withdraws";

const Ibwithdrawrequest = () => {

    const [withdraw,setWithdraw] = useState(null);
    const client = useSelector(showClient);
    const dispatch = useDispatch();

    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {};
            const response = await axios.post(WITHDRAW_API_URL, bodyParameters, config)
            setWithdraw(response.data)
        } catch (error) {
            if(error.response.status==401){
                dispatch(redirectAsync());
            }

        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    if (withdraw === null) {
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

    return(
        <Fragment>
            <Innerlayout>
            <Row className="align-items-center mt-32">
                <Col lg={6} className="ms-auto">
                    <Link to='/newibwithdraw' className="btn btn-primary float-end">Create Commission Request</Link>
                </Col>
            </Row>
            <Ibwithdrawtable lists={withdraw} fetchesData={fetchData} />
            </Innerlayout>
        </Fragment>
    );
}

export default Ibwithdrawrequest;