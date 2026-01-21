import React,{useState, useEffect, Fragment} from 'react';
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Innerlayout from '../Components/Innerlayout';
import { Accordion, Row } from 'react-bootstrap';
import PropagateLoader from "react-spinners/PropagateLoader";
import Parser from 'html-react-parser';

const base_url = process.env.REACT_APP_API_URL;

const Faq = () => {

    const [faqData, setFaqData] = useState(null);
    const client = useSelector(showClient);

    // 

    const dispatch = useDispatch();

    let FAQ_API;

    if (client.asIB === true) {
        FAQ_API = base_url+"/v1/client/list-faq-ib";
    }
    else{
        FAQ_API = base_url+"/v1/client/list-faq";
    }

    async function fetchData(){

        var faqType = 0;

        if (client.client.ib_status === true) {
            faqType = 1;
        }
        else if (client.client.ib_status === 'both') {
            faqType = 2;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                type: faqType
            };

            await axios.post(FAQ_API, bodyParameters, config).then(res => {
                if(res.data.status_code===200){
                    setFaqData(res.data.data);

                }
            })
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        fetchData();
    },[])


    
    if (faqData === null) {
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
                    <Row className="mt-5">
                    <h2 className='ml-5'>FAQ</h2>
                    <Accordion>
                    {
                                Array.isArray(faqData) && faqData.map(value => (  
                            <Accordion.Item eventKey={value.id}>
                                <Accordion.Header>{value.question}</Accordion.Header>
                                <Accordion.Body>
                                    {Parser(value.answer)}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))
                    }
                    </Accordion>
                    </Row>
                </Innerlayout>
            </Fragment>
        );
    }
};

export default Faq;
