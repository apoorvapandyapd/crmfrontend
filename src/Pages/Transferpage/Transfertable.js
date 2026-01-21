import { Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { redirectAsync, showClient } from "../../store/clientslice";
import { Fragment, useState, useEffect } from "react";
import Pagination from "../../Components/Pagination";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { BackArrowIcon } from "../../Components/icons";
import DurationFilter from "../../Components/DurationFilter";
const base_url = process.env.REACT_APP_API_URL;
const TRANSFER_API_URL = base_url + "/v1/client/list-mttranser";
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS == null ? 10 : process.env.TBL_SHOW_RECORDS;
const TBL_PER_PAGE = process.env.TBL_PER_PAGE == null ? 2 : process.env.TBL_PER_PAGE;

const Transfertable = (props) => {

    const [transferData, setTransferData] = useState(null);
    const client = useSelector(showClient);
    const dispatch = useDispatch();
    let location = useLocation();
    const [filterData, setFilterData] = useState({
        from_date: null,
        to_date: null,
        duration: null,
        ib_client: location.state?.client_id,
    })
    const [error, setError] = useState({});


    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    //---use for not show all pages at time, It divide pages in given number
    const [pageNumberLimit, setPageNumberLimit] = useState(TBL_PER_PAGE);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = transferData != null && transferData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(transferData != null && transferData.length / recordsPerPage);

    const handleFilterDataChanger = (e) => {
        setFilterData((previousData) => ({
            ...previousData,
            [e.target.name]: e.target.value
        }))
    }

    function handleDurationChanger(e) {

        if (e.target.value !== "custom") {
            setFilterData({
                ...filterData,
                from_date: null,
                to_date: null,
                duration: e.target.value

            })
        } else {
            setFilterData({
                ...filterData,
                from_date: null,
                to_date: null,
                duration: e.target.value
            })
        }
    }

    const searchByDate = (e) => {
        fetchData()
        setCurrentPage(1)
        setPageNumberLimit(TBL_PER_PAGE);
        setMaxPageNumberLimit(TBL_PER_PAGE);
        setMinPageNumberLimit(0);
    }
    const clearDate = (e) => {
        fetchData("clr");
        setCurrentPage(1)
        setPageNumberLimit(TBL_PER_PAGE);
        setMaxPageNumberLimit(TBL_PER_PAGE);
        setMinPageNumberLimit(0);
    }

    async function fetchData(clr = null) {
        try {

            props.setOuterLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let data = { ...filterData };
            if (clr === "clr") {
                data.from_date = null;
                data.status = 'pending';
                data.to_date = null;
                data.duration = 'current_month';
                setFilterData((previousData) => ({
                    ...previousData,
                    'from_date': null,
                    'to_date': null,
                    'duration': "current_month"
                }))
            } else if (clr?.duration) {

                data.from_date = null;
                data.to_date = null;
                data.duration = clr.duration;
                if (location.pathname === "/ib/client") {
                    data.status = 'all';
                }


                setFilterData((previousData) => ({
                    ...previousData,
                    'from_date': null,
                    'to_date': null,
                    "duration": data.duration,
                }))

            }

            const response = await axios.post(TRANSFER_API_URL, data, config)

            if (response.data) {
                setTransferData(response.data.data);
                props.setOuterLoading(false);
                setError({});
            }

        } catch (error) {
            console.error(error);
            if (error.response.status === 400) {
                setError(error.response.data.errors);
                props.setOuterLoading(false);
            }
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }


    useEffect(() => {

        if ((props.showList === 'transfer' || props.showList === "transferRequest")) {

            if (props.showList === 'transfer') {
                fetchData({ duration: "current_month", status: "pending" });
                setCurrentPage(1)
                setPageNumberLimit(TBL_PER_PAGE);
                setMaxPageNumberLimit(TBL_PER_PAGE);
                setMinPageNumberLimit(0);
                setRecordsPerPage(10)

            } else if (props.showList === "transferRequest") {
                setCurrentPage(1)
                setPageNumberLimit(2);
                setMaxPageNumberLimit(2);
                setMinPageNumberLimit(0);
                fetchData({ duration: "current_month", status: "all" });
                setRecordsPerPage(10)
            }

        } else if (props.showList === 'all') {
            fetchData({ duration: 'all', status: "pending" });
            setCurrentPage(1)
            setPageNumberLimit(TBL_PER_PAGE);
            setMaxPageNumberLimit(TBL_PER_PAGE);
            setMinPageNumberLimit(0);
            setRecordsPerPage(5)

        }
    }, [props.showList])

    let totalTra = Array.isArray(transferData) && transferData.reduce((acc, cur) => {

        if (cur.type === "Account to Wallet") {

            acc.accountToWallet.amount = acc.accountToWallet.amount + cur.amount;
            acc.accountToWallet.count = ++acc.accountToWallet.count;
        } else if (cur.type === "Wallet to Account") {
            acc.walletToAccount.amount = acc.walletToAccount.amount + cur.amount;
            acc.walletToAccount.count = ++acc.walletToAccount.count;
        }
        return acc;
    }, { "accountToWallet": { 'amount': 0, 'count': 0 }, 'walletToAccount': { 'amount': 0, 'count': 0 } });

    let csvdata = Array.isArray(transferData) && transferData.map(data => {
        return {
            "Record ID": data.id,
            "Transaction ID": data.transaction_id ?? '-',
            Type: data.type,
            Account: data.account,
            Amount: data.amount.toLocaleString("en-US", { style: 'currency', currency: 'USD' }),
            Status: data.status,
            Date: data.created_at
        }
    })

    return (
        <Fragment>
            {
                (props.outerLoading === true) ? <PropagateLoader
                    color={'#000b3e'}
                    loading={true}
                    cssOverride={{ textAlign: 'center', alignItems: 'center', backgroundColor: 'rgb(251,252,252,0.8)', display: 'flex', justifyContent: 'center', width: '100%', height: '100vh' }}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                /> : <>
                        <div className={`table-last-col ${location.pathname === "/mywallet" && 'card-body'}`}>
                            {props.showList === "all" &&
                                <div className="transfer-title d-flex mb-3 flex-wrap justify-content-between align-items-center">
                                    <h3 className="mb-0">Transfers</h3>
                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="me-2">Total Account to Wallet: <span className="text-primary">{totalTra && ` $${totalTra.accountToWallet.amount.toFixed(2)}  (${totalTra.accountToWallet.count}) `}</span></div>
                                    <div>Total Wallet to Account: <span className="text-primary">{totalTra && ` $${totalTra.walletToAccount.amount.toFixed(2)}  (${totalTra.walletToAccount.count}) `}</span></div>
                                </div>
                                {/* <Link to='#' className="link-text" onClick={() => props.setShowList('transfer')}>Show more</Link> */}
                            </div>}
                            {(props.showList === 'transfer' || props.showList === "transferRequest") &&
                                <>
                                {location.pathname === "/mywallet" &&
                                    <>
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <h3 className="mb-0 d-flex flex-wrap justify-content-between" style={{ alignItems: 'center' }}>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Back To Wallet</Tooltip>}>
                                                    <Link to="#" onClick={() => props.setShowList('all')} className="back-arrow mr-1">
                                                        <BackArrowIcon width="24" height="24" />
                                                    </Link>
                                                </OverlayTrigger>
                                                <div className="mx-2">Transfers</div>
                                            </h3>
                                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                <div className="me-2">Total Account to Wallet: <span className="text-primary">{totalTra && ` $${totalTra.accountToWallet.amount.toFixed(2)}  (${totalTra.accountToWallet.count}) `}</span>
                                                </div>
                                                <div>Total Wallet to Account: <span className="text-primary">{totalTra && ` $${totalTra.walletToAccount.amount.toFixed(2)}  (${totalTra.walletToAccount.count}) `}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </>
                                }
                                <DurationFilter filterData={filterData} search={searchByDate} clear={clearDate} handleFilterDataChanger={handleFilterDataChanger} handleDurationChanger={handleDurationChanger} csvdata={csvdata} csvName={location.state?.client_name ? location.state?.client_name.replace(/ /g, "_") + "_transfer" : "transfers"} />
                                    <div className='d-flex flex-wrap'>
                                        <small className="text-danger m-1">{error['from_date']}</small>
                                        <small className="text-danger m-1">{error['to_date']}</small>
                                    </div>
                                </>
                            }
                            <div className="table-responsive">
                                <Table className="table m-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th scope="col" >Record ID</th>
                                            <th scope="col">Transaction ID</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Account</th>
                                            {/* <th scope="col">Destination</th> */}
                                            <th scope="col">Amount</th>
                                            <th scope="col">Status</th>
                                            {/* <th scope="col">Comment</th> */}
                                            <th scope="col">Date</th>
                                            {/* <th scope="col">Proof</th> */}
                                            {/* <th scope="col">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(currentRecords) && currentRecords.length <= 0 && <tr><td colSpan="8">No records found</td></tr>}
                                        {Array.isArray(currentRecords) && currentRecords.map((transfer, i) =>
                                            <tr>
                                                <th scope="row">{transfer.id}</th>
                                                <td>{transfer.transaction_id}</td>
                                            <td>{transfer.type}</td>
                                            <td>{transfer.account}</td>
                                            {/* <td>{transfer.destination}</td> */}
                                            <td>${transfer.amount}</td>
                                            <td>{transfer.status === 'rejected' ? <div className="text-danger">{transfer.status}</div> : transfer.status}</td>
                                            {/* <td>{transfer.comment}</td> */}
                                            {/* <td><a href={null} >{transfer.proof_transfer == '-' ? '-' : <img src={transfer.proof_transfer} height='50px' width='50px'></img>}</a></td> */}
                                            <td>{transfer.created_at}</td>
                                            {/* <td>
                                    {
                                        transfer.status == 'Pending' ?
                                            <a href={null} onClick={(e) => deleteRequest(e, transfer.id)} className="delete-icon" role='button'>
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.75 5.0476C15.735 5.0476 15.7125 5.0476 15.69 5.0476C11.7225 4.6501 7.7625 4.5001 3.84 4.8976L2.31 5.0476C1.995 5.0776 1.7175 4.8526 1.6875 4.5376C1.6575 4.2226 1.8825 3.9526 2.19 3.9226L3.72 3.7726C7.71 3.3676 11.7525 3.5251 15.8025 3.9226C16.11 3.9526 16.335 4.2301 16.305 4.5376C16.2825 4.8301 16.035 5.0476 15.75 5.0476Z" fill="#D61414" />
                                                    <path d="M6.37507 4.29C6.34507 4.29 6.31507 4.29 6.27757 4.2825C5.97757 4.23 5.76757 3.9375 5.82007 3.6375L5.98507 2.655C6.10507 1.935 6.27007 0.9375 8.01757 0.9375H9.98257C11.7376 0.9375 11.9026 1.9725 12.0151 2.6625L12.1801 3.6375C12.2326 3.945 12.0226 4.2375 11.7226 4.2825C11.4151 4.335 11.1226 4.125 11.0776 3.825L10.9126 2.85C10.8076 2.1975 10.7851 2.07 9.99007 2.07H8.02507C7.23007 2.07 7.21507 2.175 7.10257 2.8425L6.93007 3.8175C6.88507 4.095 6.64507 4.29 6.37507 4.29Z" fill="#D61414" />
                                                    <path d="M11.4075 17.0624H6.59255C3.97505 17.0624 3.87005 15.6149 3.78755 14.4449L3.30005 6.89243C3.27755 6.58493 3.51755 6.31493 3.82505 6.29243C4.14005 6.27743 4.40255 6.50993 4.42505 6.81743L4.91255 14.3699C4.99505 15.5099 5.02505 15.9374 6.59255 15.9374H11.4075C12.9825 15.9374 13.0125 15.5099 13.0875 14.3699L13.575 6.81743C13.5975 6.50993 13.8675 6.27743 14.175 6.29243C14.4825 6.31493 14.7225 6.57743 14.7 6.89243L14.2125 14.4449C14.13 15.6149 14.025 17.0624 11.4075 17.0624Z" fill="#D61414" />
                                                    <path d="M10.2451 12.9375H7.74756C7.44006 12.9375 7.18506 12.6825 7.18506 12.375C7.18506 12.0675 7.44006 11.8125 7.74756 11.8125H10.2451C10.5526 11.8125 10.8076 12.0675 10.8076 12.375C10.8076 12.6825 10.5526 12.9375 10.2451 12.9375Z" fill="#D61414" />
                                                    <path d="M10.875 9.9375H7.125C6.8175 9.9375 6.5625 9.6825 6.5625 9.375C6.5625 9.0675 6.8175 8.8125 7.125 8.8125H10.875C11.1825 8.8125 11.4375 9.0675 11.4375 9.375C11.4375 9.6825 11.1825 9.9375 10.875 9.9375Z" fill="#D61414" />
                                                </svg>
                                            </a> : null
                                    }
                                </td> */}
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                                {
                                    props.showList === 'transfer' && transferData != null && transferData.length > TBL_SHOW_RECORDS ?
                                        <Pagination
                                            nPages={nPages}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            maxPageLimit={maxPageNumberLimit}
                                            minPageLimit={minPageNumberLimit}
                                            perPageLimit={pageNumberLimit}
                                            setMaxPageNumberLimit={setMaxPageNumberLimit}
                                            setMinPageNumberLimit={setMinPageNumberLimit}
                                        /> : null
                                }
                            </div>
                            {
                                props.showList === 'all' &&
                                <div className="mt-3 d-flex justify-content-end">
                                    <Link to='#' className="link-text" onClick={() => props.setShowList('transfer')}>Show more</Link>
                                </div>
                            }
                    </div>
                </>}
        </Fragment>
    );
};
export default Transfertable;