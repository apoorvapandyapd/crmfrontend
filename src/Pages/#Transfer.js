import { Fragment,useState, useEffect } from "react";
import Innerlayout from "../Components/Innerlayout";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Transfertable from "./Transferpage/Transfertable";
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader";

const base_url = process.env.REACT_APP_API_URL;
const TRANSFER_API_URL = base_url + "/v1/client/list-mttranser";


const Transfer = () => {

    const [transfer,setTransfer] = useState(null);
    const client = useSelector(showClient);
    const dispatch = useDispatch();
    let [loading, setLoading] = useState(false);
    const [date, setDate] = useState({
        from_date: null,
        to_date: null
    })
    const [error, setError] = useState({});

    async function fetchData(clr = null) {
        try {

            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {};
            bodyParameters.from_date = date.from_date;
            bodyParameters.to_date = date.to_date;

            if (clr == "clr") {
                bodyParameters.from_date = null;
                bodyParameters.to_date = null;
                setDate((previousData) => ({
                    ...previousData,
                    'from_date': null,
                    'to_date': null
                }))
            }

            const response = await axios.post(TRANSFER_API_URL, bodyParameters, config)

            if (response.data) {
                setTransfer(response.data)
                setLoading(false);
                setError({});
            }

        } catch (error) {
            
            if (error.response.status === 400) {
                setError(error.response.data.errors);
                setLoading(false);
            }
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, [])



    if (transfer === null) {
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
                <Row className="align-items-center mt-32">
                    <Col lg={6} className="ms-auto">
                        <Link to="/newtransfer" className="btn btn-primary float-end">Make Transfer Request</Link>
                    </Col>
                </Row>
                <Transfertable lists={transfer} loading={loading} setDate={setDate} error={error} setError={setError} setLoading={setLoading} date={date} fetchesData={fetchData} />
            </Innerlayout>
        </Fragment>
    );
}

export default Transfer;