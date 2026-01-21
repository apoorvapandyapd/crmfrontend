import React,{useState, useEffect, Fragment} from 'react';
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Innerlayout from '../Components/Innerlayout';
import { Accordion, Row } from 'react-bootstrap';
import PropagateLoader from "react-spinners/PropagateLoader";
import Parser from 'html-react-parser';

const base_url = process.env.REACT_APP_API_URL;

function TradingSteps() {
    const [demoData, setDemoData] = useState(null);
    const [liveData, setLiveData] = useState(null);
    const client = useSelector(showClient);

    const dispatch = useDispatch();

    let STEPS_API = base_url+"/v1/client/mt-steps";

    async function fetchData(){

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                value: ''
            };

            const response = await axios.post(STEPS_API, bodyParameters, config).then(res=>{
                if(res.data.status_code===200){
                    setDemoData(res.data.data.demo);
                    setLiveData(res.data.data.live);

                }
            })
        } catch (error) {
            console.error(error);
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        fetchData();
    },[])

    const accordionSetItem = (value) => {
        
    }

    if (demoData === null && liveData === null) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                        color={process.env.REACT_APP_LOADER_COLOR}
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
                    <Row className="mt-5">
                    <h2 className='ml-5'>Trading Steps</h2>
                    <Accordion>
                        <Accordion.Item eventKey={1}>
                            <Accordion.Header>Demo Steps</Accordion.Header>
                            <Accordion.Body>
                                {Parser(demoData)}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey={2}>
                            <Accordion.Header>Live Steps</Accordion.Header>
                            <Accordion.Body>
                                {Parser(liveData)}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    </Row>
                </Innerlayout>
            </Fragment>
        );
    }
}

export default TradingSteps
