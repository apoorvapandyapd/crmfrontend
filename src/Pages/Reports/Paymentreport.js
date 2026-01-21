import {Fragment, useState} from "react";
import Innerlayout from "../../Components/Innerlayout";
import {FormControl, FormGroup, Col, Row, Button, Table} from "react-bootstrap";
import axios from 'axios';
import {redirectAsync, showClient} from '../../store/clientslice';
import {useDispatch, useSelector} from "react-redux";
import {PropagateLoader} from "react-spinners";
import {Link} from 'react-router-dom';
import { CustomRequest } from "../../Components/RequestService";

const base_url = process.env.REACT_APP_API_URL;
const PAYEMNT_REPORT_API = base_url + "/v1/client/paymentreport";
const DOWNLOAD_REPORT_API = base_url + "/v1/client/download-report";

// const headers = [
//     { label: "Transaction ID", key: "transaction_id" },
//     { label: "Payment Method", key: "payment_method" },
//     { label: "Date", key: "request_date" },
//     { label: "Amount", key: "amount" },
//     { label: "Status", key: "status" },
//     { label: "Comment", key: "comment" }
// ];
// const transferheaders = [
//     { label: "Transaction ID", key: "transaction_id" },
//     { label: "Account", key: "account" },
//     { label: "Type", key: "type" },
//     { label: "Payment Method", key: "payment_method" },
//     { label: "Date", key: "request_date" },
//     { label: "Amount", key: "amount" },
//     { label: "Status", key: "status" },
//     { label: "Comment", key: "comment" }
// ];
//
// const data = [];


const Paymentreport = () => {

    const [reportdata, setReportdata] = useState(null);
    const [balance, setBalance] = useState({
        'closing':'',
        'deposit':'',
        'withdraw':'',
        'wallet_mt':'',
        'mt_wallet':'',
        'commission':'',
    });
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    let [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const client = useSelector(showClient);
    const dispatch = useDispatch();

    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth() + 1)).padStart(2, '0');
    const day = String((today.getDate() + 1)).padStart(2, '0');

    const todayDt = `${year}-${month}-${day}`;

    function fetchData(date_from, date_to) {
        let formData = new FormData();
        formData.append("date_from", date_from.value);
        formData.append("date_to", date_to.value);
        CustomRequest('paymentreport', formData, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 400) {
                    setError(res.error.response.data.errors);
                }
                if (res.error.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    setReportdata(res.data.data.list);
                    
                    setBalance((prevValue) => ({
                        ...prevValue,
                        'closing': res.data.data.closing_balance,
                        'deposit': res.data.data.deposit_balance,
                        'withdraw': res.data.data.withdraw_balance,
                        'wallet_mt': res.data.data.wallet_mt,
                        'mt_wallet': res.data.data.mt_wallet,
                        'commission': res.data.data.ib_commission,

                    }));
                    setError({})
                }
            }
            setLoading(false);
        });
    }



    const searchPayment = (e) => {
        e.preventDefault();
        setLoading(true);

        const {date_from, date_to} = e.target.elements;

        setFromDate(date_from.value);
        setToDate(date_to.value);

        fetchData(date_from, date_to);
    }

    const downloadReport = (e)=>{
        e.preventDefault();
        let formData = {client:client.client.id, fromDate, toDate}

        CustomRequest('downloadreport', formData, client.token, (res)=> {
            if(res?.error) {
                console.log(res.error);
                if (res.error.response.status === 400) {
                    setError(res.error.response.data.errors);
                }
                if (res.error.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download','report.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();// you need to remove that elelment which is created before.
            }
        });
    }


    return (
        <Fragment>
            <Innerlayout>
                <div className="card-body p-0 table-last-col">
                    <div className="d-flex flex-wrap justify-content-between">
                        <div className="w-100 border-0">
                            <div className='card-body mt-0'>
                                <h2>Transaction Report</h2>
                                <form onSubmit={searchPayment}>
                                    <Row>
                                        {/* <Col md={3}>
                                            <Form.Group>
                                                <label>Payment</label>
                                                <select className="form-control select" name="payment">
                                                    <option>Deposit</option>
                                                    <option>Withdraw</option>
                                                    <option>Transfer</option>
                                                </select>
                                            </Form.Group>
                                        </Col> */}
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <label htmlFor="date_from">Date From</label>
                                                <FormControl type="date" max={todayDt} className="uppercase-date" name="date_from" id="date_from" placeholder="dd-mm-yyyy" required />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <label htmlFor="date_to">Date To</label>
                                                <FormControl type="date" max={todayDt} className="uppercase-date" name="date_to" id="date_to" placeholder="Date TO" required />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup className="mt-4">
                                                <Button type="submit" className="btn btn-primary">Search</Button>
                                            </FormGroup>
                                        </Col>
                                        <small className="text-danger m-1">{error['date_to'] || error['date_from']}</small>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
                {reportdata === null && loading===true ? <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
                        cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    /> :
                    <div className="card-body table-last-col">
                        {/* {
                            paymenttype === 'Deposit' ? <CSVLink filename="Deposit Report " data={reportdata} headers={headers} className="btn btn-primary float-end mr-3 mb-3">Export CSV</CSVLink> : ''
                        }
                        {
                            paymenttype === 'Withdraw' ? <CSVLink filename="Withdraw Report " data={reportdata} headers={headers} className="btn btn-primary float-end mr-3 mb-3">Export CSV</CSVLink> : ''
                        }
                        {
                            paymenttype === 'Transfer' ? <CSVLink filename="Transfer Report " data={reportdata} headers={transferheaders} className="btn btn-primary float-end mr-3 mb-3">Export CSV</CSVLink> : ''
                        } */}
                        {
                            reportdata !== null &&
                            <>
                                <Link to="#" style={{cursor: 'pointer'}} className="btn btn-primary float-end mb-3"
                                      onClick={(e) => downloadReport(e)}>Export PDF</Link>
                                <div className="table-responsive w-100">

                                    <Table className="table m-0 align-middle table">
                                        <thead>
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Withdrawal</th>
                                            <th scope="col">Deposit</th>
                                            <th scope="col">Transfer</th>
                                            {(client.client.ib_status === 'both') ?
                                                <th scope="col">IB Commission</th> : null}
                                            <th scope="col">Balance</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {reportdata.map((data, i) =>
                                            <tr>
                                                <td>{data.date}</td>
                                                <td>
                                                    {
                                                        (data.type === 'withdraw') ?
                                                            <span className="text-danger">{data.withdraw}</span> : ''
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (data.type === 'deposit') ?
                                                            <span className="text-success">{data.deposit}</span> : ''
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (data.type === 'transfer') ?
                                                            (data.transfer.includes('Wallet to Account')) ?
                                                                <span className="text-danger">{data.transfer}</span> :
                                                                <span
                                                                    className="text-success">{data.transfer}</span> : null
                                                    }
                                                </td>
                                                {
                                                    (client.client.ib_status === 'both') ?
                                                        <td>
                                                            {
                                                                (data.type === 'commission') ?
                                                                    <span
                                                                        className="text-success">{data.commission}</span> : ''
                                                            }
                                                        </td> : null
                                                }
                                                <td>{data.total_balance}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td></td>
                                            {(client.client.ib_status === 'both') ? <td></td> : null}
                                            <td></td>
                                            <td><b>Total Deposit</b></td>
                                            <td></td>
                                            <td><b>${balance.deposit?.toLocaleString()}</b></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            {(client.client.ib_status === 'both') ? <td></td> : null}
                                            <td></td>
                                            <td><b>Total Withdrawal</b></td>
                                            <td></td>
                                            <td><b>${balance.withdraw?.toLocaleString()}</b></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            {(client.client.ib_status === 'both') ? <td></td> : null}
                                            <td></td>
                                            <td><b>Total Wallet To Account</b></td>
                                            <td></td>
                                            <td><b>${balance.wallet_mt?.toLocaleString()}</b></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            {(client.client.ib_status === 'both') ? <td></td> : null}
                                            <td></td>
                                            <td><b>Total Account To Wallet</b></td>
                                            <td></td>
                                            <td><b>${balance.mt_wallet?.toLocaleString()}</b></td>
                                        </tr>
                                        {
                                            (client.client.ib_status === 'both') ?
                                                <tr>
                                                    <td></td>
                                                    {(client.client.ib_status === 'both') ? <td></td> : null}
                                                    <td></td>
                                                    <td><b>IB Commission</b></td>
                                                    <td></td>
                                                    <td><b>${balance.commission?.toLocaleString()}</b></td>
                                                </tr> : null
                                        }
                                        <tr>
                                            <td></td>
                                            {(client.client.ib_status === 'both') ? <td></td> : null}
                                            <td></td>
                                            <td><b>Closing Balance</b></td>
                                            <td></td>
                                            <td><b>${balance.closing?.toLocaleString()}</b></td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        }
                    </div>
                }
            </Innerlayout>
        </Fragment>
    );

}

export default Paymentreport;