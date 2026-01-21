import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import {redirectAsync, showClient} from '../store/clientslice';
import {useDispatch, useSelector} from 'react-redux';
import Innerlayout from '../Components/Innerlayout';
import Pagination from '../Components/Pagination';
import {PropagateLoader} from 'react-spinners';
import {Tooltip as ReactTooltip} from 'react-tooltip'
import {Link} from 'react-router-dom';

const base_url = process.env.REACT_APP_API_URL;
const TRADEHISTORY_API_URL = base_url + "/v1/client/tradehistory";
const NEWTRADEHISTORY_API_URL = base_url + "/v1/client/fetch-newtradehistory";

function TradeHistory() {

    const [demoData, setDemoData] = useState(null);
    const [liveData, setLiveData] = useState(null);
    let [loading, setLoading] = useState(false);

    const client = useSelector(showClient);
    const dispatch = useDispatch();

    async function fetchData() {
        try {
            const config = {
                headers: {Authorization: `Bearer ${client.token}`}
            };

            const data = {
                key: "value"
            };

            await axios.post(TRADEHISTORY_API_URL, data, config).then((res) => {
                if (res.data.status_code === 200) {

                    setDemoData(res.data.data.demoData);
                    setLiveData(res.data.data.liveData);
                } else if (res.data.status_code === 500) {

                }
            }).catch((error) => {

            });

        } catch (error) {

            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    //---use for not show all pages at time, It devide pages in given number
    // const [pageNumberLimit, setPageNumberLimit] = useState(2);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(2);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const demoRecords = demoData !== null && demoData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(demoData !== null && demoData.length / recordsPerPage);

    const liveRecords = liveData !== null && liveData.slice(indexOfFirstRecord, indexOfLastRecord);
    const livePages = Math.ceil(liveData !== null && liveData.length / recordsPerPage);


    //---pagination over

    const fetchNewRecord = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {Authorization: `Bearer ${client.token}`}
            };

            const data = {
                key: "value"
            };

            setLoading(true);

            await axios.post(NEWTRADEHISTORY_API_URL, data, config).then((res) => {
                if (res.data.status_code === 200) {

                    setDemoData(res.data.data.demoData);
                    setLiveData(res.data.data.liveData);
                }
                setLoading(false);
            }).catch((error) => {
                if (error.response) {
                    setLoading(false);
                }
            });

        } catch (error) {
            if (error.response.status === 401) {
                setLoading(false);
                dispatch(redirectAsync());
            }
        }
    }

    if (demoData === null && liveData === null) {
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

    return (
        <Fragment>
            <Innerlayout>
                {
                    (loading === true) ? <PropagateLoader
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
                        /> :
                        <div className="card-body">
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <h2 className='mb-0'>Trade History</h2>
                                <Link to="#" style={{cursor: 'pointer'}} id="trade_fetch" className="ms-auto mb-3"
                                      onClick={(e) => fetchNewRecord(e)}><ReactTooltip anchorId="trade_fetch"
                                                                                       place="top"
                                                                                       content="Refresh trade"></ReactTooltip>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56"
                                            stroke="#fff" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                </Link>
                            </div>
                            <ul className="c-tabs nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <Link to="#" className="active" id="demo-tab" data-bs-toggle="tab"
                                       data-bs-target="#demo-tab-pane" role="tab" aria-controls="demo-tab-pane"
                                       aria-selected="false">Demo</Link>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <Link to="#" className="" id="live-tab" data-bs-toggle="tab" data-bs-target="#live-tab-pane"
                                       role="tab" aria-controls="live-tab-pane" aria-selected="false">Live</Link>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="demo-tab-pane" role="tabpanel"
                                     aria-labelledby="demo-tab" tabIndex="0">
                                    <div className="table-responsive">
                                        <table className="table m-0">
                                            <thead>
                                            <tr>
                                                <th scope="col">Login</th>
                                                <th scope="col">Symbol</th>
                                                <th scope="col">Ticket</th>
                                                <th scope="col">Volume</th>
                                                <th scope="col">Open Price</th>
                                                <th scope="col">Close Price</th>
                                                <th scope="col">Profit/Loss</th>
                                                <th scope="col">Open Time</th>
                                                <th scope="col">Close Time</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {demoRecords !== false && demoRecords.map((demo) =>
                                                <tr>
                                                    <td>{demo.login}</td>
                                                    <td>{demo.symbol}</td>
                                                    <td>{demo.ticket}</td>
                                                    <td>{demo.volume}</td>
                                                    <td>{demo.open_price}</td>
                                                    <td>{demo.close_price}</td>
                                                    <td>{demo.profit_loss}</td>
                                                    <td>{demo.open_time}</td>
                                                    <td>{demo.close_time}</td>
                                                    <td>{demo.status}</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination
                                        nPages={nPages}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        maxPageLimit={maxPageNumberLimit}
                                        minPageLimit={minPageNumberLimit}
                                        perPageLimit={2}
                                        setMaxPageNumberLimit={setMaxPageNumberLimit}
                                        setMinPageNumberLimit={setMinPageNumberLimit}
                                    />

                                </div>
                                <div className="tab-pane fade" id="live-tab-pane" role="tabpanel"
                                     aria-labelledby="live-tab" tabIndex="0">
                                    <div className="table-responsive">
                                        <table className="table m-0">
                                            <thead>
                                            <tr>
                                                <th scope="col">Login</th>
                                                <th scope="col">Symbol</th>
                                                <th scope="col">Ticket</th>
                                                <th scope="col">Volume</th>
                                                <th scope="col">Open Price</th>
                                                <th scope="col">Close Price</th>
                                                <th scope="col">Profit/Loss</th>
                                                <th scope="col">Open Time</th>
                                                <th scope="col">Close Time</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {liveRecords !== false && liveRecords.map((live) =>
                                                <tr>
                                                    <td>{live.login}</td>
                                                    <td>{live.symbol}</td>
                                                    <td>{live.ticket}</td>
                                                    <td>{live.volume}</td>
                                                    <td>{live.open_price}</td>
                                                    <td>{live.close_price}</td>
                                                    <td>{live.profit_loss}</td>
                                                    <td>{live.open_time}</td>
                                                    <td>{live.close_time}</td>
                                                    <td>{live.status}</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination
                                        nPages={livePages}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        maxPageLimit={maxPageNumberLimit}
                                        minPageLimit={minPageNumberLimit}
                                        perPageLimit={2}
                                        setMaxPageNumberLimit={setMaxPageNumberLimit}
                                        setMinPageNumberLimit={setMinPageNumberLimit}
                                    />
                                </div>
                            </div>
                        </div>
                }
            </Innerlayout>
        </Fragment>
    );
}

export default TradeHistory;