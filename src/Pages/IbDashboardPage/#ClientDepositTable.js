import axios from "axios";
import { Fragment, useState, useEffect } from "react";
import { Button, Table, Row, Col, FormGroup, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { redirectAsync, showClient } from "../../store/clientslice";
import Pagination from "../../Components/Pagination";
import { PropagateLoader } from "react-spinners";

const base_url = process.env.REACT_APP_API_URL;
const CLIENTDETAIL_API_URL = base_url + "/v1/ib/client";
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS == null ? 10 : process.env.TBL_SHOW_RECORDS;
const TBL_PER_PAGE = process.env.TBL_PER_PAGE == null ? 2 : process.env.TBL_PER_PAGE;


function ClientDepositTable(props) {

    const [deposits, setDeposits] = useState([]);
    let [loading, setLoading] = useState(false);
    const client = useSelector(showClient);
    const dispatch = useDispatch();
    let location = useLocation();
    const [date, setDate] = useState({
        from_date: null,
        to_date: null
    })
    const [error, setError] = useState({});

    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth() + 1)).padStart(2, '0');
    const day = String((today.getDate() + 1)).padStart(2, '0');

    const todayDt = `${year}-${month}-${day}`;

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(TBL_SHOW_RECORDS);

    //---use for not show all pages at time, It divide pages in given number
    const [pageNumberLimit, setPageNumberLimit] = useState(TBL_PER_PAGE);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = deposits.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(deposits.length / recordsPerPage);




    async function fetchData(clr = null) {
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                id: location.state.client_id,
                key: "depositRequest"
            };
            bodyParameters.from_date = date.from_date;
            bodyParameters.to_date = date.to_date;

            if (clr === "clr") {
                bodyParameters.from_date = null;
                bodyParameters.to_date = null;
                setDate((previousData) => ({
                    ...previousData,
                    'from_date': null,
                    'to_date': null
                }))
            }

            const response = await axios.post(CLIENTDETAIL_API_URL, bodyParameters, config)

            if (response.data) {
                setDeposits(response.data.data);
                setLoading(false);
                setError({})
            }

        } catch (error) {
            console.error(error);
            if (error.response.status === 400) {
                setError(error.response.data.errors);
                setLoading(false);
            }
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }
    useEffect(() => {
        if (props.activeTab === 'deposit') {
            fetchData();
        }
    }, [props.activeTab])



    const dateChanger = (e) => {
        setDate((previousData) => ({
            ...previousData,
            [e.target.name]: e.target.value
        }))
    }

    const searchByDate = (e) => {

        e.preventDefault();
        fetchData();
        setCurrentPage(1);
        setPageNumberLimit(TBL_PER_PAGE);
        setMaxPageNumberLimit(TBL_PER_PAGE);
        setMinPageNumberLimit(0);
    }

    const clearDate = (e) => {
        e.preventDefault()
        fetchData("clr");
        setCurrentPage(1)
        setPageNumberLimit(TBL_PER_PAGE);
        setMaxPageNumberLimit(TBL_PER_PAGE);
        setMinPageNumberLimit(0);

    }
    return (
        <Fragment>
            {
                (loading === true) ? <PropagateLoader
                    color={'#000b3e'}
                    loading={true}
                    cssOverride={{ textAlign: 'center', alignItems: 'center', backgroundColor: 'rgb(251,252,252,0.8)', display: 'flex', justifyContent: 'center', width: '100%', height: '100vh' }}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                /> : <>
                    <div className="card-body table-last-col p-0">
                        <form onSubmit={searchByDate}>
                            <Row>
                                <Col lg={3}>
                                    <FormGroup className="mb-3">
                                        <label>Date From</label>
                                        <FormControl type="date" className="uppercase-date" name="from_date" max={todayDt} value={date.from_date ? date.from_date : ""} placeholder="dd-mm-yyyy" onChange={(e) => dateChanger(e)} required />
                                    </FormGroup>
                                </Col>
                                <Col lg={3}>
                                    <FormGroup className="mb-3">
                                        <label>Date To</label>
                                        <FormControl type="date" className="uppercase-date" name="to_date" max={todayDt} value={date.to_date ? date.to_date : ""} placeholder="Date TO" onChange={(e) => dateChanger(e)} required />
                                    </FormGroup>
                                </Col>
                                <Col lg={6}>
                                    <FormGroup className="mt-0 mt-lg-4">
                                        <Button type="submit" className="btn btn-primary me-3 mb-2 mb-sm-0" >Search</Button>
                                        <Button className="btn funding-clear-btn" onClick={(e) => { clearDate(e) }}>Clear</Button>
                                    </FormGroup>
                                </Col>
                                <small className="text-danger m-1">{error['to_date'] || error['from_date']}</small>
                            </Row>
                        </form>
                        <div className="table-responsive mt-3 mt-lg-0">
                            <Table className="table m-0 align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col" >Record ID</th>
                                        {/* <th scope="col">Transaction ID</th> */}
                                        <th scope="col">Payment Method</th>
                                        {/* <th scope="col">Destination</th> */}
                                        <th scope="col">Amount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Comment</th>
                                        <th scope="col">Date</th>

                                    </tr>
                                </thead>
                                <tbody>
                                        {currentRecords.length === 0 ? <tr><td colspan="6">No records found</td></tr> : currentRecords.map((deposit, i) =>
                                            <tr>
                                                <th scope="row">{deposit.id}</th>
                                                {/* <td>{deposit.transaction_id}</td> */}
                                                <td>{deposit.payment_method}</td>
                                                {/* <td>{deposit.destination}</td> */}
                                                <td>${deposit.amount}</td>
                                                {/* <td>{deposit.status === 'approved' ? <Link to={"/payment/" + deposit.transaction_id} className="btn btn-primary btn-sm">Pay Now</Link> : deposit.status}</td> */}
                                                <td>{deposit.status === 'Approved' ? 'Approved' : deposit.status}</td>
                                                <td>{deposit.comment != null ? deposit.comment : '-'}</td>
                                                <td>{deposit.created_at}</td>
                                            </tr>
                                        )} 
                                </tbody>
                            </Table>
                            {
                                deposits.length > TBL_SHOW_RECORDS ?
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
                    </div></>}
        </Fragment>
    );
}

export default ClientDepositTable
