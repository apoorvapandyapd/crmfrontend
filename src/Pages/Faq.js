import React, {useState, useEffect, Fragment} from 'react';
import {redirectAsync, showClient} from "../store/clientslice";
import {useSelector} from "react-redux";

import Innerlayout from '../Components/Innerlayout';
import {Accordion, Row} from 'react-bootstrap';
import PropagateLoader from "react-spinners/PropagateLoader";
import Parser from 'html-react-parser';

import { CustomRequest } from '../Components/RequestService';

const Faq = () => {

    const [faqData, setFaqData] = useState(null);
    const client = useSelector(showClient);

    let FAQ_API = 'list-faq';
    if (client.asIB === true) {
        FAQ_API = "list-faq-ib";
    }

    function fetchData() {

        var faqType = 0;

        if (client.client.ib_status === true) {
            faqType = 1;
        } else if (client.client.ib_status === 'both') {
            faqType = 2;
        }
        const data = {
            type: faqType
        };
        CustomRequest(FAQ_API, data, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                // if (res.error.response.status === 400) {
                //     setError(res.error.response.data.errors);
                // }
                if (res.error.response.status === 401) {
                    dispatchEvent(redirectAsync());
                }
            } else {
                if(res.data.status_code===200){
                    setFaqData(res.data.data);
                }
            }
        });
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
                        cssOverride={{
                            textAlign: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgb(251,252,252,0.8)',
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100vh'
                        }}
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
                        {faqData.length===0 && 
                            <div className="card-body text-center">
                                <p className='mb-0'>No FAQs</p> 
                            </div>
                        }
                        
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
