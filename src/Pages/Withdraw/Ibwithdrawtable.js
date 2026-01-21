import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { redirectAsync, showClient } from "../../store/clientslice";
import Pagination from "../../Components/Pagination";
import { Fragment, useState, useEffect } from "react";
import Swal from "sweetalert2";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BackArrowIcon, DeleteIcon } from "../../Components/icons";
import DurationFilter from "../../Components/DurationFilter";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const base_url = process.env.REACT_APP_API_URL;
const WITHDRAW_API_URL = base_url + "/v1/client/iblist-withdraws";
const DELETE_WITHDRAW_REQUEST_API = base_url + "/v1/client/delete-withdrawrequest";
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS == null ? 10 : process.env.TBL_SHOW_RECORDS;
const TBL_PER_PAGE = process.env.TBL_PER_PAGE == null ? 2 : process.env.TBL_PER_PAGE;

const Ibwithdrawtable = (props) => {

    // const data = props.lists.data;

    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth() + 1)).padStart(2, '0');
    const day = String((today.getDate() + 1)).padStart(2, '0');

    const todayDt = `${year}-${month}-${day}`;

    const client = useSelector(showClient);
    const dispatch = useDispatch();
    const [ibComWithdraw, setIbComWithdraw] = useState(null);
    const [error, setError] = useState({});
    const [filterData, setFilterData] = useState({
        from_date: null,
        to_date: null,
        status: "pending",
        duration: null,
    })

    const deleteRequest = async (e, id) => {
        e.preventDefault();
        // var targets = e.currentTarget;
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "error",
            confirmButtonText: "Yes, delete it!",
            showCloseButton: true,
            showConfirmButton: true,
            focusCancel: true,
            focusConfirm: false,
            allowOutsideClick: false,
            customClass: {
                cancelButton: 'cancel-button',
                confirmButton: 'submit-button confirm',
            },
        })
            .then((willDelete) => {
                if (willDelete.isConfirmed) {

                    let formData = new FormData();
                    formData.append("id", id);

                    try {
                        const config = {
                            headers: { Authorization: `Bearer ${client.token}` }
                        };

                        axios.post(DELETE_WITHDRAW_REQUEST_API, formData, config).then((res) => {
                            if (res.data.status_code === 200) {
                                fetchData();
                                Swal.fire("", "Record deleted successfully!", "success");
                            }
                            else if (res.data.status_code === 500) {
                                Swal.fire({
                                    icon: 'error',
                                    text: res.data.message,
                                    confirmButtonText: 'OK',
                                });
                                fetchData();
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
            });
    }


    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    //---use for not show all pages at time, It divide pages in given number
    const [pageNumberLimit, setPageNumberLimit] = useState(TBL_PER_PAGE);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = ibComWithdraw !== null && ibComWithdraw.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(ibComWithdraw !== null && ibComWithdraw.length / recordsPerPage);



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
        fetchData();
        setCurrentPage(1)
        // setPageNumberLimit(TBL_PER_PAGE);
        setMaxPageNumberLimit(TBL_PER_PAGE);
        setMinPageNumberLimit(0);
    }
    const clearDate = (e) => {
        fetchData("clr");
        setCurrentPage(1)
        // setPageNumberLimit(TBL_PER_PAGE);
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
                data.status = clr.status;
                data.to_date = null;
                data.duration = clr.duration;

                setFilterData((previousData) => ({
                    ...previousData,
                    'from_date': null,
                    'to_date': null,
                    "duration": clr.duration,
                    'status': clr.status
                }))

            }
            const response = await axios.post(WITHDRAW_API_URL, data, config)
            setError({})
            setIbComWithdraw(response.data.data)
            props.setOuterLoading(false);
        } catch (error) {
            console.error(error);
            if (error.response.status === 400) {
                setError(error.response.data.errors);
                props.setOuterLoading(false);
            }
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
            props.setOuterLoading(false);

        }
    }
    useEffect(() => {

        if ((props.showList === 'ibComWithdrawal' || props.showList === "ibComWithdrawalRequest")) {
            if (props.showList === 'ibComWithdrawal') {
                fetchData({ duration: "current_month", status: "pending" });
                setCurrentPage(1)
                // setPageNumberLimit(TBL_PER_PAGE);
                setMaxPageNumberLimit(TBL_PER_PAGE);
                setMinPageNumberLimit(0);
                setRecordsPerPage(10)

            } else if (props.showList === "ibComWithdrawalRequest") {
                setCurrentPage(1)
                // setPageNumberLimit(2);
                setMaxPageNumberLimit(2);
                setMinPageNumberLimit(0);
                fetchData({ duration: "current_month", status: "all" });
                setRecordsPerPage(10)
            }
        } else if (props.showList === 'all') {
            fetchData({ duration: 'all', status: "pending" });
            setCurrentPage(1)
            // setPageNumberLimit(TBL_PER_PAGE);
            setMaxPageNumberLimit(TBL_PER_PAGE);
            setMinPageNumberLimit(0);
            setRecordsPerPage(5)

        }
    }, [props.showList])


    let totalStatusAmt = Array.isArray(ibComWithdraw) && ibComWithdraw.reduce((acc, curr) => {

        if (curr.status === "Pending") {

            acc.pendingStatus.amount = acc.pendingStatus.amount + curr.amount;
            acc.pendingStatus.count = ++acc.pendingStatus.count;
        } else if (curr.status === "Approved") {
            acc.approvedStatus.amount = acc.approvedStatus.amount + curr.amount;
            acc.approvedStatus.count = ++acc.approvedStatus.count;
        }
        return acc
    }, { pendingStatus: { 'amount': 0, 'count': 0 }, approvedStatus: { 'amount': 0, 'count': 0 } });

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
                /> :
                    <div className="card-body table-last-col">
                        {props.showList === 'all' && <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <h3>Pending Commissions</h3>
                            <div>Total Amount: <span className="text-success">  {totalStatusAmt && ` $${totalStatusAmt?.pendingStatus.amount.toFixed(2)}  (${totalStatusAmt?.pendingStatus.count}) `}</span>
                            </div>
                        </div>}
                        {(props.showList === 'ibComWithdrawal' || props.showList === "ibComWithdrawalRequest") &&
                            <>
                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                    <h3 className="mb-0 d-flex flex-wrap justify-content-between" style={{ alignItems: 'center' }}>
                                        <Link to="#" onClick={() => props.setShowList('all')} className="back-arrow mr-1">
                                        <BackArrowIcon width="24" height="24" />
                                        </Link>
                                    <div className="mx-2">Commissions</div>
                                    </h3>
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        {
                                        filterData.status === "pending" && <div className="me-2">Total Pending Amount: <span className="text-success">{totalStatusAmt && ` $${totalStatusAmt?.pendingStatus.amount.toFixed(2)}  (${totalStatusAmt?.pendingStatus.count}) `}</span></div>

                                        }{
                                        filterData.status === "approved" && <div>Total Approved Amount: <span className="text-success">{totalStatusAmt && ` $${totalStatusAmt?.approvedStatus.amount.toFixed(2)}  (${totalStatusAmt?.approvedStatus.count}) `}</span></div>
                                        }{
                                        filterData.status === "all" && <>
                                                <div className="me-2">Total Pending Amount: <span className="text-success">{totalStatusAmt && ` $${totalStatusAmt?.pendingStatus.amount.toFixed(2)}  (${totalStatusAmt?.pendingStatus.count}) `}</span></div>
                                                <div>Total Approved Amount: <span className="text-success">{totalStatusAmt && ` $${totalStatusAmt?.approvedStatus.amount.toFixed(2)}  (${totalStatusAmt?.approvedStatus.count}) `}</span></div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <hr />
                            <DurationFilter filterData={filterData} search={searchByDate} clear={clearDate} handleFilterDataChanger={handleFilterDataChanger} handleDurationChanger={handleDurationChanger} />
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
                                        <th scope="col">Payment Method</th>
                                        {/* <th scope="col">Destination</th> */}
                                        <th scope="col">Amount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Comment</th>
                                        <th scpoe='col'>Date</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(currentRecords) && currentRecords.length <= 0 && <tr><td colSpan="8">No records found</td></tr>}
                                    {Array.isArray(currentRecords) && currentRecords.map((withdraw, i) =>
                                        <tr>
                                            <th scope="row">{withdraw.id}</th>
                                            <td>{withdraw.transaction_id != null ? withdraw.transaction_id : '-'}</td>
                                            <td>{withdraw.payment_method}</td>
                                            {/* <td>{withdraw.destination}</td> */}
                                            <td>${withdraw.amount}</td>
                                            <td>{withdraw.status}</td>
                                            <td>{withdraw.comment != null ? withdraw.comment : '-'}</td>
                                            <td>{withdraw.created_at}</td>
                                            <td>
                                                {
                                                    withdraw.status === 'Pending' ?
                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                                            <Link to='#' onClick={(e) => deleteRequest(e, withdraw.id)} className="delete-ticket-icon">
                                                                <DeleteIcon width="18" height="18" />
                                                            </Link>
                                                        </OverlayTrigger> : '-'
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            {
                                (props.showList === 'ibComWithdrawal' || props.showList === "ibComWithdrawalRequest") && ibComWithdraw !== null && ibComWithdraw.length > TBL_SHOW_RECORDS ?
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
                                <Link to='#' className="link-text" onClick={() => props.setShowList('ibComWithdrawal')}>Show more</Link>
                            </div>
                        }
                    </div>

            }
        </Fragment>
    );
}

export default Ibwithdrawtable;