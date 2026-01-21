import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, FormGroup, Button, FormSelect } from "react-bootstrap";
import axios from "axios"
import { redirectAsync, showClient } from "../../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Pagination from "../../Components/Pagination";
import { PropagateLoader } from "react-spinners";
import { Link } from 'react-router-dom';
import DurationFilter from "../../Components/DurationFilter";
const base_url = process.env.REACT_APP_API_URL;
const TRADES_OPEN_API = base_url + "/v1/client/open-order";
const TRADES_CLOSE_API = base_url + "/v1/client/close-order";
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS == null ? 10 : process.env.TBL_SHOW_RECORDS;
const TBL_PER_PAGE = process.env.TBL_PER_PAGE == null ? 2 : process.env.TBL_PER_PAGE;
const MTACCOUNT_API_URL = base_url + "/v1/client/list-mtaccount";


const MtTradeList = () => {

    let location = useLocation();

    const [tradeData, seTradeData] = useState(null);
    const [tradeLiveData, setLiveTradeData] = useState(null);
    const [tradeDemoCloseData, setDemoTradeCloseData] = useState(null);
    const [liveAccountlist, setLiveAccountlist] = useState(null);
    const [demoAccountlist, setDemoAccountlist] = useState(null);
    const [tradeLiveCloseData, setLiveTradeCloseData] = useState(null);
    // const [datepickerVisible, setDatepickerVisible] = useState(false);
    const [positionTabCheck, setPositionTabCheck] = useState({ demo: "Position", live: "Position" });
    const [error, setError] = useState({});
    const [data, setData] = useState({
        type: 'live',
        order_type: 'Open',
        from_date: null,
        to_date: null,
        account_id: null,
        duration: "current_month",
        ib_client: location.state?.client_id
    });
    const [tab, setTab] = useState('close');
    const [demoVisible, setDemoVisible] = useState(false);
    const [liveVisible, setLiveVisible] = useState(false);

    //---use for not show all pages at time, It divide pages in given number

    let [loading, setLoading] = useState(false);
    const client = useSelector(showClient);

    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(TBL_SHOW_RECORDS);

    //---use for not show all pages at time, It divide pages in given number
    // const [pageNumberLimit, setPageNumberLimit] = useState(TBL_PER_PAGE);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = tradeData !== null && tradeData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(tradeData !== null && tradeData.length / recordsPerPage);

    const currentLiveRecords = tradeLiveData !== null && tradeLiveData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nLivePages = Math.ceil(tradeLiveData !== null && tradeLiveData.length / recordsPerPage);

    // const currentClosePage = 1;

    // const [closerecordsPerPage] = useState(TBL_SHOW_RECORDS);

    //---use for not show all pages at time, It divide pages in given number
    // const [pageCloseNumberLimit, setClosePageNumberLimit] = useState(TBL_PER_PAGE);
    // const [maxClosePageNumberLimit, setCloseMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    // const [minClosePageNumberLimit, setCloseMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    // const indexOfCloseLastRecord = currentClosePage * closerecordsPerPage;
    // const indexOfCloseFirstRecord = indexOfCloseLastRecord - recordsPerPage;
    // const currentCloseRecords = tradeDemoCloseData!==null && tradeDemoCloseData.slice(indexOfCloseFirstRecord, indexOfCloseLastRecord);
    // const nClosePages = Math.ceil(tradeDemoCloseData!==null && tradeDemoCloseData.length / closerecordsPerPage);

    // const currentLiveCloseRecords = tradeLiveCloseData!==null && tradeLiveCloseData.slice(indexOfCloseFirstRecord, indexOfCloseLastRecord);
    // const nLiveClosePages = Math.ceil(tradeLiveCloseData!==null && tradeLiveCloseData.length / closerecordsPerPage);





    async function fetchOpenOrder() {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = data;

            const response = await axios.post(TRADES_OPEN_API, bodyParameters, config)


            if (data.type === "demo") {
                seTradeData(response.data.data);
            }
            else {

                setLiveTradeData(response.data.data);
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    async function fetchCloseOrder(clr = null) {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = data;

            if (clr === "clr") {
                formData.duration = "current_month";
                formData.to_date = null;
                formData.from_date = null;
                setData((previousData) => ({
                    ...previousData,
                    ...formData
                }))
            }

            const response = await axios.post(TRADES_CLOSE_API, formData, config)

            if (response.data.data.type === "demo") {
                setPositionTabCheck({
                    ...positionTabCheck,
                    demo: "Position"
                })
                setDemoTradeCloseData(response.data.data);
            }
            else {
                setPositionTabCheck({
                    ...positionTabCheck,
                    live: "Position"
                })
                setLiveTradeCloseData(response.data.data);
            }
            setError({})
            setLoading(false);
        } catch (error) {
            console.error(error);
            if (error.response.status === 400) {
                setError(error.response.data.errors);
            }
            setLoading(false);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    const searchOrder = (e) => {

        e.preventDefault();
        if (data.type === 'demo' && data.order_type === 'Open') {
            fetchOpenOrder();
        }
        else if (data.type === 'demo' && data.order_type === 'Close') {
            fetchCloseOrder();
        }
        else if (data.type === 'live' && data.order_type === 'Open') {
            fetchOpenOrder();
        }
        else if (data.type === 'live' && data.order_type === 'Close') {

            fetchCloseOrder();
        }
    }

    // const handleFromDate = (e) => {
    //     setFromDate(e.target.value);
    // }

    // const handleToDate = (e) => {
    //     setToDate(e.target.value);
    // }

    const tabCheck = (e) => {
        if (e === 'close') {
            setData({
                ...data,
                type: 'live',
                order_type: 'Open',
                from_date: null,
                to_date: null,
                account_id: null,
                duration: "current_month"
            });
            setTab('close');
            setLiveVisible(false);
        } else {
            setData({
                ...data,
                type: 'demo',
                order_type: 'Open',
                from_date: null,
                to_date: null,
                account_id: null,
                duration: "current_month"
            });
            setTab('open');
            setDemoVisible(false);
        }
        setError({})
        setDemoTradeCloseData(null);
        setLiveTradeCloseData(null)
    }

    const handleDemoType = (e) => {
        if (e.target.value === "Close") {
            setData({
                ...data,
                type: 'demo',
                order_type: e.target.value
            });
            setDemoVisible(true);
        }
        else {
            setData({
                ...data,
                type: 'demo',
                order_type: e.target.value
            });
            setDemoVisible(false);
        }
    }

    async function fetchMTAccount() {
        try {

            console.log("calll")
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = {
                key: "value",
                ib_client: location.state?.client_id,
            };

            await axios.post(MTACCOUNT_API_URL, formData, config).then((res) => {
                if (res.data.status_code === 200) {

                    // let totalLiveAcc = 0;
                    // res.data.data.live.map((account, i) => {
                    //     if (account.status == 1) {
                    //         totalLiveAcc++
                    //     }
                    // })

                    // let liveAcc = res.data.data.live.find((data) => { return data.status == 1 });
                    // if (totalLiveAcc === 1) {
                    //     setData({
                    //         ...data,
                    //         account_id: liveAcc.id
                    //     })
                    // }
                    setDemoAccountlist(res.data.data.demo);

                    setLiveAccountlist(res.data.data.live);
                }
                else if (res.data.status_code === 500) {

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

    const handleLiveType = (e) => {
        if (e.target.value === "Close") {

            // let totalLiveAcc = 0;
            // liveAccountlist.map((account, i) => {
            //     if (account.status == 1) {
            //         totalLiveAcc++
            //     }
            // })
            // if (totalLiveAcc === 1) {
            //     fetchCloseOrder();
            // }

            setData({
                ...data,
                type: 'live',
                order_type: e.target.value
            });

            setLiveVisible(true);
        }
        else {

            setLiveVisible(false);
            setData({
                ...data,
                type: 'live',
                order_type: e.target.value
            });
        }


    }


    const handleFilterDataChanger = (e) => {
        setData((previousData) => ({
            ...previousData,
            [e.target.name]: e.target.value
        }))
    }

    const handleData = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        setLoading(true);
        fetchOpenOrder();
        fetchMTAccount();

        if (client.client.verify === "Not Completed") {
            setTab('open');
            setData({
                ...data,
                type: 'demo',
                order_type: 'Open',
            })
        }

    }, [])

    function handleDurationChanger(e) {
        setError({})
        if (e.target.value !== "custom") {
            // setDatepickerVisible(false)
            setData({
                ...data,
                from_date: null,
                to_date: null,
                duration: e.target.value

            })
        } else {
            // setDatepickerVisible(true);
            setData({
                ...data,
                from_date: null,
                to_date: null,
                duration: e.target.value
            })
        }
    }


    useEffect(() => {
        fetchOpenOrder();
    }, [tab]);


    const clearDate = (e) => {
        fetchCloseOrder('clr');
    }


    let profitOrLossLivePosition = Array.isArray(tradeLiveCloseData?.position) && tradeLiveCloseData?.position.reduce((accumulator, currentValue) => {
        return +accumulator + +currentValue.profit + (+currentValue.swap_charges) + (+currentValue.commission) + (+currentValue.fee);
    }, 0);

    let profitOrLossLiveDeal = Array.isArray(tradeLiveCloseData?.deal) && tradeLiveCloseData?.deal.reduce((accumulator, currentValue) => {
        return +accumulator + (+currentValue.profit) + (+currentValue.swap_charges) + (+currentValue.commission) + (+currentValue.fee);
    }, 0);


    let profitOrLossDemoPosition = Array.isArray(tradeDemoCloseData?.position) && tradeDemoCloseData?.position.reduce((accumulator, currentValue) => {
        return +accumulator + +currentValue.profit + (+currentValue.swap_charges) + (+currentValue.commission) + (+currentValue.fee);
    }, 0);

    let profitOrLossDemoDeal = Array.isArray(tradeDemoCloseData?.deal) && tradeDemoCloseData?.deal.reduce((accumulator, currentValue) => {
        return +accumulator + (+currentValue.profit) + (+currentValue.swap_charges) + (+currentValue.commission) + (+currentValue.fee);
    }, 0);


    function findChangePercentage(entry_price, exit_price, entry) {
        let per;
        if (parseInt(entry) === 1) {
            let diff = entry_price - exit_price;
            per = 100 * (diff / entry_price);
        } else {
            let diff = (exit_price - entry_price);
            per = (diff / entry_price) * 100;
        }
        return per.toFixed(2);
    }

    return (
        <Fragment>

            <Row>
                <Col xl={12}>
                    <div className={location.pathname === "/trades" && 'card-body'}>
                        <div className="d-flex flex-wrap mb-3 align-items-center justify-content-between">
                            <h2 className={`mb-2 mb-sm-0`} style={{ visibility: location.pathname === "/trades" ? "visible" : "hidden" }}>
                                Trade History
                            </h2>
                            <div className="d-flex">
                                <ul className="tab-style-2 nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <Link to="#" className={tab === 'close' ? 'active' : null} onClick={() => tabCheck('close')} id="live-tab" data-bs-toggle="tab" data-bs-target="#live-tab-pane" role="tab" aria-controls="live-tab-pane" aria-selected="false">Live Orders</Link>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <Link to="#" className={tab === 'open' ? 'active' : null} onClick={() => tabCheck('open')} id="demo-tab" data-bs-toggle="tab" data-bs-target="#demo-tab-pane" role="tab" aria-controls="demo-tab-pane" aria-selected="false">Demo Orders</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {(loading === true) ?
                            <PropagateLoader
                                color={'#000b3e'}
                                loading={true}
                                cssOverride={{ textAlign: 'center', alignItems: 'center', backgroundColor: 'rgb(251,252,252,0.8)', display: 'flex', justifyContent: 'center', width: '100%', height: '70vh' }}
                                size={25}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            /> : <>
                                <div className="tab-content account-details" id="myTabContent">
                                    <div className={tab === 'open' ? 'tab-pane fade show active' : 'tab-pane fade show'} id="demo-tab-pane" role="tabpanel" aria-labelledby="demo-tab" tabIndex="0">
                                        <Row>
                                            <Col lg={6} xl={3}>
                                                <FormSelect className="select" name="order_type" onChange={handleDemoType} value={data.type === 'demo' ? data.order_type : null}>
                                                    <option selected disabled>Select an Order Type</option>
                                                    <option>Open</option>
                                                    <option>Close</option>
                                                </FormSelect>
                                            </Col>
                                            {
                                                demoVisible && <>
                                                    <Col lg={6} xl={3} className="mt-2 mt-lg-0">
                                                        <FormSelect name="account_id" onChange={handleData} required>
                                                            <option value="">Select an Account</option>
                                                            {Array.isArray(demoAccountlist) && demoAccountlist.map((account, i) =>
                                                                (parseInt(account.status) === 1) ?
                                                                    <option selected={parseInt(data.account_id) === parseInt(account.id)} value={account.id}>{account.login}</option> : null
                                                            )}
                                                        </FormSelect>
                                                    </Col>

                                                    <Col xl={data.duration === 'custom' ? 12 : 12} className="mt-0 mt-xl-2">
                                                        <DurationFilter filterData={data} search={searchOrder} clear={clearDate} handleFilterDataChanger={handleFilterDataChanger} handleDurationChanger={handleDurationChanger} />
                                                    </Col>
                                                    <div className='d-flex flex-wrap'>
                                                        <small className="text-danger m-1">{error['from_date'] || error['account_id']}</small>
                                                        <small className="text-danger m-1">{error['to_date']}</small>
                                                    </div>
                                                </>
                                            }
                                            {data.order_type === 'Open' &&
                                                <Col md={2}>
                                                    <FormGroup className="mt-2 mt-lg-0">
                                                        <Button type="submit" className="btn btn-primary" onClick={(e) => { searchOrder(e) }}>Search</Button>
                                                    </FormGroup>
                                                </Col>
                                            }

                                        </Row>
                                        {
                                            (data.type === 'demo' && data.order_type === "Open") ?
                                                <div className="fix-table-height  mt-3">
                                                    <div className="table-responsive">
                                                        <table className="table m-0 account-detils-table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Ticket</th>
                                                                    <th scope="col">Type</th>
                                                                    <th scope="col">Lots</th>
                                                                    <th scope="col">Symbol</th>
                                                                    <th scope="col">Buy Price</th>
                                                                    <th scope="col">S/L</th>
                                                                    <th scope="col">T/P</th>
                                                                    <th scope="col">Gain</th>
                                                                    <th scope="col">Current Price</th>
                                                                    <th scope="col">Open Time</th>
                                                                </tr>
                                                            </thead>
                                                            {
                                                                tradeData !== null ?
                                                                    <tbody>
                                                                        {Array.isArray(tradeData) && tradeData.length <= 0 && <tr><td colSpan="10" className="text-center">No records found</td></tr>}
                                                                        {tradeData !== null && tradeData.map((data) =>
                                                                            <tr>
                                                                                <td>{data.ticket}</td>
                                                                                <td>{data.type}</td>
                                                                                <td>{data.volume}</td>
                                                                                <td>{data.symbol}</td>
                                                                                <td>${data.price_open}</td>
                                                                                <td>${data.sl}</td>
                                                                                <td>${data.tp}</td>
                                                                                <td>${data.gain}</td>
                                                                                <td>${data.price_current}</td>
                                                                                <td>{data.open_time}</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody> :
                                                                    <tbody>
                                                                        <tr>
                                                                            <td ><center>No records found.</center></td>
                                                                        </tr>
                                                                    </tbody>
                                                            }

                                                        </table>
                                                        {/* {
                                                            tradeData !== null && tradeData.length > TBL_SHOW_RECORDS ?
                                                                <Pagination
                                                                    nPages={nPages}
                                                                    currentPage={currentPage}
                                                                    setCurrentPage={setCurrentPage}
                                                                    maxPageLimit={maxPageNumberLimit}
                                                                    minPageLimit={minPageNumberLimit}
                                                                    perPageLimit={TBL_PER_PAGE}
                                                                    setMaxPageNumberLimit={setMaxPageNumberLimit}
                                                                    setMinPageNumberLimit={setMinPageNumberLimit}
                                                                /> : null
                                                        } */}
                                                    </div>
                                                </div> :
                                                (data.type === 'demo' && data.order_type === "Close") ?
                                                    <>
                                                        <div className='d-flex justify-content-between align-items-center p-3 px-0'>

                                                            {
                                                                positionTabCheck.demo === "Position" ?

                                                                    <div>Net Profit/Loss:
                                                                        <span className={profitOrLossDemoPosition < 0 ? 'text-danger' : 'text-success'}>
                                                                            {profitOrLossDemoPosition && ' $' + profitOrLossDemoPosition?.toFixed(2)}
                                                                        </span>
                                                                    </div>


                                                                    : <div>Net Profit/Loss:
                                                                        <span className={profitOrLossDemoDeal < 0 ? 'text-danger' : 'text-success'}>
                                                                            {profitOrLossDemoDeal && '$' + profitOrLossDemoDeal?.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                            }

                                                            <div className="custom-dropdown">
                                                                <Link to="#" className="cursor-pointer" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    {positionTabCheck.demo}
                                                                    <span className="d-flex justify-content-end"><img src={`${process.env.PUBLIC_URL}/Images/user-thumb-arrow.svg`} alt="user" /></span>
                                                                </Link>
                                                                <ul className="dropdown-menu" id="myTab" role="tablist">
                                                                    <li className="nav-item" role="presentation">
                                                                        <Link to="#" className="active cursor-pointer" onClick={() => setPositionTabCheck({ ...positionTabCheck, demo: "Position" })} id="p-tab" data-bs-toggle="tab" data-bs-target="#position-tab-pane" role="tab" aria-controls="position-tab-pane" aria-selected="false">Position</Link>
                                                                    </li>
                                                                    <li className="nav-item" role="presentation">
                                                                        <Link to="#" className="cursor-pointer" onClick={() => setPositionTabCheck({ ...positionTabCheck, demo: "Deal" })} id="d-tab" data-bs-toggle="tab" data-bs-target="#deals-tab-pane" role="tab" aria-controls="deals-tab-pane" aria-selected="false">Deals</Link>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="tab-content account-details" id="myTabContent">
                                                            <div className='tab-pane fade show active' id="position-tab-pane" role="tabpanel" aria-labelledby="p-tab" tabIndex="0">
                                                                <div className="fix-table-height mt-3">
                                                                    <div className="table-responsive">
                                                                        <table className="table m-0 account-detils-table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope="col">Symbol</th>
                                                                                    <th scope="col">Type</th>
                                                                                    <th scope="col">Entry Time</th>
                                                                                    <th scope="col">Entry Price</th>
                                                                                    <th scope="col">Volume</th>
                                                                                    <th scope="col">Swap</th>
                                                                                    <th scope="col">Commission</th>
                                                                                    <th scope="col">Fee</th>
                                                                                    <th scope="col">S/L</th>
                                                                                    <th scope="col">T/P</th>
                                                                                    <th scope="col">Exit Time</th>
                                                                                    <th scope="col">Exit Price</th>
                                                                                    <th scope="col">Profit</th>
                                                                                    <th scope="col">Change %</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {
                                                                                tradeDemoCloseData !== null ?
                                                                                    <tbody>
                                                                                        {Array.isArray(tradeDemoCloseData?.position) && tradeDemoCloseData?.position.length <= 0 && <tr><td colSpan="12">No records found</td></tr>}
                                                                                        {
                                                                                            tradeDemoCloseData?.position.map((data) => {
                                                                                                let entryTime = new Date(+data.entry_time);
                                                                                                let exitTime = new Date(+data.exit_time);
                                                                                                let changePer = findChangePercentage(+data.entry_price, +data.exit_price, +data.entry_action);
                                                                                                let tradeVolumeData = '';
                                                                                                if (data.entry_volume === data.exit_volume) {
                                                                                                    tradeVolumeData = +data.entry_volume / 10000;
                                                                                                }
                                                                                                else if (data.entry_volume !== data.exit_volume) {
                                                                                                    tradeVolumeData = +data.exit_volume / 10000 + '/' + +data.entry_volume / 10000;
                                                                                                }
                                                                                                else if (data.entry_action === 'sell') {
                                                                                                    tradeVolumeData = +data.entry_volume / 10000 + '/' + +data.exit_volume / 10000;
                                                                                                }
                                                                                                return <tr>
                                                                                                    <td>{data.symbol}</td>
                                                                                                    <td>{data.entry_action}</td>
                                                                                                    <td>{entryTime.toLocaleString('ja-JP', '').replace(/\//g, '-')}</td>
                                                                                                    <td>{data.entry_price}</td>
                                                                                                    <td>{tradeVolumeData}</td>
                                                                                                    <td>${data.swap_charges}</td>
                                                                                                    <td>${data.commission}</td>
                                                                                                    <td>${data.fee}</td>
                                                                                                    <td>${data.stop_loss}</td>

                                                                                                    <td>${data.take_profit}</td>
                                                                                                    <td>{exitTime.toLocaleString('ja-JP', '').replace(/\//g, '-')}</td>
                                                                                                    <td>${data.exit_price}</td>
                                                                                                    <td className={data.profit < 0 ? 'text-danger' : 'text-success'}>${data.profit}</td>
                                                                                                    <td className={data.profit < 0 ? 'text-danger' : 'text-success'}>{changePer}%</td>
                                                                                                </tr>
                                                                                            })
                                                                                        }
                                                                                    </tbody> :
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td colSpan="14" className="text-center">No records found.</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                            }
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='tab-pane fade' id="deals-tab-pane" role="tabpanel" aria-labelledby="d-tab" tabIndex="0">
                                                                <div className="fix-table-height mt-3">
                                                                    <div className="table-responsive">
                                                                        <table className="table m-0 account-detils-table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th scope="col">Time</th>
                                                                                    <th scope="col">Symbol</th>
                                                                                    <th scope="col">Deal</th>
                                                                                    <th scope="col">Type</th>
                                                                                    <th scope="col">Direction</th>
                                                                                    <th scope="col">Volume</th>
                                                                                    <th scope="col">Price</th>
                                                                                    <th scope="col">S/L</th>
                                                                                    <th scope="col">T/P</th>
                                                                                    <th scope="col">Profit</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {
                                                                                tradeDemoCloseData !== null ?
                                                                                    <tbody>
                                                                                        {Array.isArray(tradeDemoCloseData?.deal?.deal) && tradeDemoCloseData?.deal.length <= 0 && <tr><td colSpan="12">No records found</td></tr>}

                                                                                        {tradeDemoCloseData?.deal.map((data) => {
                                                                                            return <tr>
                                                                                                <td>{data.time}</td>
                                                                                                <td>{data.symbol == '' ? "-" : data.symbol}</td>
                                                                                                <td>{data.deal}</td>
                                                                                                <td>{data.type}</td>
                                                                                                <td>{data.direction}</td>
                                                                                                <td>${data.volume}</td>
                                                                                                <td>${data.price}</td>
                                                                                                <td>${data.sl}</td>
                                                                                                <td>${data.tp}</td>
                                                                                                <td className={data.profit < 0 ? 'text-danger' : 'text-success'}>{data.profit}</td>
                                                                                            </tr>
                                                                                        })

                                                                                        }
                                                                                    </tbody> :
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td>No records found.</td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                            }
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </> : null
                                        }
                                    </div>
                                    <div className={tab === 'close' ? 'tab-pane fade show active' : 'tab-pane fade show'} id="live-tab-pane" role="tabpanel" aria-labelledby="live-tab" tabIndex="0">
                                        <Row>
                                            <Col lg={6} xl={3}>
                                                <FormSelect className="select" name="order_type" onChange={handleLiveType} value={data.type === 'live' ? data.order_type : null}>
                                                    <option selected disabled>Select an option</option>
                                                    <option>Open</option>
                                                    <option>Close</option>
                                                </FormSelect>
                                            </Col>
                                            {
                                                liveVisible && <>
                                                    <Col lg={6} xl={3} className="mt-2 mt-lg-0">
                                                        <FormSelect name="account_id" onChange={handleData} required>
                                                            <option value="">Select an account</option>
                                                            {Array.isArray(liveAccountlist) && liveAccountlist.map((account, i) =>
                                                                (parseInt(account.status) === 1) ?
                                                                    <option selected={parseInt(data.account_id) === parseInt(account.id)} value={account.id}>{account.login}</option> : null
                                                            )}
                                                        </FormSelect>
                                                    </Col>
                                                    <Col xl={data.duration === 'custom' ? 12 : 12} className="mt-0 mt-xl-2">
                                                        <DurationFilter filterData={data} search={searchOrder} clear={clearDate} handleFilterDataChanger={handleFilterDataChanger} handleDurationChanger={handleDurationChanger} />
                                                    </Col>
                                                    <div className='d-flex flex-wrap'>
                                                        <small className="text-danger m-1">{error['from_date'] || error['account_id']}</small>
                                                        <small className="text-danger m-1">{error['to_date']}</small>
                                                    </div>
                                                </>
                                            }
                                            {data.order_type === 'Open' &&
                                                <Col md={2}>
                                                    <FormGroup className="mt-2 mt-lg-0">
                                                        <Button type="submit" className="btn btn-primary" onClick={(e) => { searchOrder(e) }}>Search</Button>
                                                    </FormGroup>
                                                </Col>
                                            }
                                        </Row>
                                        {
                                            (data.type === 'live' && data.order_type === "Open") ?
                                                <div className="fix-table-height mt-3">
                                                    <div className="table-responsive">
                                                        <table className="table m-0 account-detils-table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Ticket</th>
                                                                    <th scope="col">Type</th>
                                                                    <th scope="col">Lots</th>
                                                                    <th scope="col">Symbol</th>
                                                                    <th scope="col">Buy Price</th>
                                                                    <th scope="col">S/L</th>
                                                                    <th scope="col">T/P</th>
                                                                    <th scope="col">Gain</th>
                                                                    <th scope="col">Current Price</th>
                                                                    <th scope="col">Open Time</th>
                                                                </tr>
                                                            </thead>
                                                            {
                                                                (tradeLiveData !== null) ?
                                                                    <tbody>
                                                                        {Array.isArray(tradeLiveData) && tradeLiveData.length <= 0 && <tr><td colSpan="10" className="text-center">No records found</td></tr>}
                                                                        {tradeLiveData != null && tradeLiveData.map((data) =>
                                                                            <tr>
                                                                                <td>{data.ticket}</td>
                                                                                <td>{data.type}</td>
                                                                                <td>{data.volume}</td>
                                                                                <td>{data.symbol}</td>
                                                                                <td>${data.price_open}</td>
                                                                                <td>${data.sl}</td>
                                                                                <td>${data.tp}</td>
                                                                                <td>${data.gain}</td>
                                                                                <td>${data.price_current}</td>
                                                                                <td>{data.open_time}</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody> :
                                                                    <tbody>
                                                                        <tr>
                                                                            <td ><center>No records found.</center></td>
                                                                        </tr>
                                                                    </tbody>
                                                            }

                                                        </table>
                                                        {/* {
                                                            tradeLiveData !== null && tradeLiveData.length > TBL_SHOW_RECORDS ?
                                                                <Pagination
                                                                    nPages={nLivePages}
                                                                    currentPage={currentPage}
                                                                    setCurrentPage={setCurrentPage}
                                                                    maxPageLimit={maxPageNumberLimit}
                                                                    minPageLimit={minPageNumberLimit}
                                                                    perPageLimit={TBL_PER_PAGE}
                                                                    setMaxPageNumberLimit={setMaxPageNumberLimit}
                                                                    setMinPageNumberLimit={setMinPageNumberLimit}
                                                                /> : null
                                                        } */}
                                                    </div>
                                                </div> : null

                                        }
                                        {
                                            (data.type === 'live' && data.order_type === "Close") ?
                                                <>
                                                    <div className='d-flex justify-content-between align-items-center p-3 px-0'>
                                                        <div className="">
                                                            {
                                                                positionTabCheck.live === "Position" ?
                                                                    <div>Net Profit/Loss:
                                                                        <span className={profitOrLossLivePosition && profitOrLossLivePosition < 0 ? 'text-danger' : 'text-success'}>
                                                                            {profitOrLossLivePosition && ' $' + profitOrLossLivePosition?.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    : <div>Net Profit/Loss:
                                                                        <span className={profitOrLossLiveDeal && profitOrLossLiveDeal < 0 ? 'text-danger' : 'text-success'}>
                                                                            {profitOrLossLiveDeal && ' $' + profitOrLossLiveDeal?.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div className="custom-dropdown">
                                                            <Link to="#" className="cursor-pointer" data-bs-toggle="dropdown" aria-expanded="false">
                                                                {positionTabCheck.live}
                                                                <span className="d-flex justify-content-end"><img src={`${process.env.PUBLIC_URL}/Images/user-thumb-arrow.svg`} alt="user" /></span>
                                                            </Link>
                                                            <ul className="dropdown-menu" id="myTab" role="tablist">
                                                                <li className="nav-item" role="presentation">
                                                                    <Link to="#" className="active cursor-pointer" onClick={() => setPositionTabCheck({ ...positionTabCheck, live: "Position" })} id="p-tab" data-bs-toggle="tab" data-bs-target="#position-tab-pane" role="tab" aria-controls="position-tab-pane" aria-selected="false">Position</Link>
                                                                </li>
                                                                <li className="nav-item" role="presentation">
                                                                    <Link to="#" className="cursor-pointer" onClick={() => setPositionTabCheck({ ...positionTabCheck, live: "Deal" })} id="d-tab" data-bs-toggle="tab" data-bs-target="#deals-tab-pane" role="tab" aria-controls="deals-tab-pane" aria-selected="false">Deals</Link>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="tab-content account-details" id="myTabContent">
                                                        <div className='tab-pane fade show active' id="position-tab-pane" role="tabpanel" aria-labelledby="p-tab" tabIndex="0">
                                                            <div className="fix-table-height mt-3">
                                                                <div className="table-responsive">
                                                                    <table className="table m-0 account-detils-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th scope="col">Symbol</th>
                                                                                <th scope="col">Type</th>
                                                                                <th scope="col">Entry Time</th>
                                                                                <th scope="col">Entry Price</th>
                                                                                <th scope="col">Volume</th>
                                                                                <th scope="col">Swap</th>
                                                                                <th scope="col">Commission</th>
                                                                                <th scope="col">Fee</th>
                                                                                <th scope="col">S/L</th>
                                                                                <th scope="col">T/P</th>
                                                                                <th scope="col">Exit Time</th>
                                                                                <th scope="col">Exit Price</th>
                                                                                <th scope="col">Profit</th>
                                                                                <th scope="col">Change %</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {
                                                                            tradeLiveCloseData !== null ?

                                                                                <tbody>
                                                                                    {Array.isArray(tradeLiveCloseData?.position) && tradeLiveCloseData?.position.length <= 0 && <tr><td colSpan="14">No records found</td></tr>}
                                                                                    {
                                                                                        tradeLiveCloseData?.position.map((data) => {
                                                                                            let entryTime = new Date(+data.entry_time);
                                                                                            let exitTime = new Date(+data.exit_time);
                                                                                            let changePer = findChangePercentage(+data.entry_price, +data.exit_price, +data.entry_action);
                                                                                            let tradeVolumeData = '';
                                                                                            if (parseInt(data.entry_volume) === parseInt(data.exit_volume)) {
                                                                                                tradeVolumeData = +data.entry_volume / 10000;
                                                                                            }
                                                                                            else if (parseInt(data.entry_volume) !== parseInt(data.exit_volume)) {
                                                                                                tradeVolumeData = +data.exit_volume / 10000 + '/' + +data.entry_volume / 10000;
                                                                                            }
                                                                                            else if (data.entry_action === 'sell') {
                                                                                                tradeVolumeData = +data.entry_volume / 10000 + '/' + +data.exit_volume / 10000;
                                                                                            }

                                                                                            return <tr>
                                                                                                <td>{data.symbol}</td>
                                                                                                <td>{data.entry_action}</td>
                                                                                                <td>{entryTime.toLocaleString('ja-JP', '').replace(/\//g, '-')}</td>
                                                                                                <td>{data.entry_price}</td>
                                                                                                <td>
                                                                                                    {tradeVolumeData}
                                                                                                </td>
                                                                                                <td>${data.swap_charges}</td>
                                                                                                <td>${data.commission}</td>
                                                                                                <td>${data.fee}</td>
                                                                                                <td>${data.stop_loss}</td>
                                                                                                <td>${data.take_profit}</td>
                                                                                                <td>{exitTime.toLocaleString('ja-JP', '').replace(/\//g, '-')}</td>
                                                                                                <td>${data.exit_price}</td>
                                                                                                <td className={data.profit < 0 ? 'text-danger' : 'text-success'}>${data.profit}</td>
                                                                                                <td className={data.profit < 0 ? 'text-danger' : 'text-success'}>{changePer}%</td>
                                                                                            </tr>
                                                                                        })

                                                                                    }
                                                                                </tbody> :
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td colSpan="14" className="text-center">No records found.</td>
                                                                                    </tr>
                                                                                </tbody>

                                                                        }
                                                                    </table>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='tab-pane fade' id="deals-tab-pane" role="tabpanel" aria-labelledby="d-tab" tabIndex="0">
                                                            <div className="fix-table-height mt-3">
                                                                <div className="table-responsive">
                                                                    <table className="table m-0 account-detils-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th scope="col">Time</th>
                                                                                <th scope="col">Symbol</th>
                                                                                <th scope="col">Deal</th>
                                                                                <th scope="col">Type</th>
                                                                                <th scope="col">Direction</th>
                                                                                <th scope="col">Volume</th>
                                                                                <th scope="col">Price</th>
                                                                                <th scope="col">S/L</th>
                                                                                <th scope="col">T/P</th>
                                                                                <th scope="col">Profit</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {
                                                                            tradeLiveCloseData !== null ?
                                                                                <tbody>
                                                                                    {Array.isArray(tradeLiveCloseData?.deal) && tradeLiveCloseData?.deal.length <= 0 && <tr><td colSpan="12">No records found</td></tr>}
                                                                                    {tradeLiveCloseData?.deal.map((data) => {
                                                                                        // let time = new Date(+data.time);

                                                                                        return <tr>
                                                                                            <td>{data.time}</td>

                                                                                            <td>{data.symbol == '' ? "-" : data.symbol}</td>
                                                                                            <td>{data.deal}</td>
                                                                                            <td>{data.type}</td>
                                                                                            <td>{data.type === 'Deposit' || data.type === 'Withdraw' ? "-" : data.direction}</td>
                                                                                            <td>{data.type === 'Deposit' || data.type === 'Withdraw' ? "-" : `$${data.volume}`}</td>
                                                                                            <td>{data.type === 'Deposit' || data.type === 'Withdraw' ? "-" : `$${data.price}`}</td>
                                                                                            <td>{data.type === 'Deposit' || data.type === 'Withdraw' ? "-" : `$${data.sl}`}</td>
                                                                                            <td>{data.type === 'Deposit' || data.type === 'Withdraw' ? "-" : `$${data.tp}`}</td>
                                                                                            <td className={data.profit < 0 ? 'text-danger' : 'text-success'}>{data.profit}</td>
                                                                                        </tr>
                                                                                    })

                                                                                    }
                                                                                </tbody> :
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td>No records found.</td>
                                                                                    </tr>
                                                                                </tbody>
                                                                        }
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </> : null
                                        }
                                    </div>
                                </div>
                            </>}
                    </div>
                </Col>
            </Row>


        </Fragment>
    );
}

export default MtTradeList;