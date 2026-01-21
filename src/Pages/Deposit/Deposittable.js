import axios from "axios";
import { Fragment, useState, useEffect } from "react";
import { Modal, Button, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { redirectAsync, showClient } from "../../store/clientslice";
import Pagination from "../../Components/Pagination";
import { PropagateLoader } from "react-spinners";
import Swal from "sweetalert2";
import { AddProofIcon, DeleteIcon, VisibilityIcon, VisibilityOffIcon, BackArrowIcon } from "../../Components/icons";
import DurationFilter from "../../Components/DurationFilter";
const base_url = process.env.REACT_APP_API_URL;
const DEPOSIT_API_URL = base_url + "/v1/client/list-deposit";
const DELETE_DEPOSIT_REQUEST_API = base_url + "/v1/client/delete-depositrequest";
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS == null ? 10 : process.env.TBL_SHOW_RECORDS;
// const TBL_PER_PAGE = process.env.TBL_PER_PAGE == null ? 2 : process.env.TBL_PER_PAGE;
const UPLOAD_PROOF_API = base_url + "/v1/client/upload-proof";
const DELETE_PROOF_API = base_url + "/v1/client/delete-proof";


const Deposittable = (props) => {

    const client = useSelector(showClient);
    let location = useLocation();
    const [modal, setModal] = useState(false);
    const [file, setFile] = useState(null);
    const [passwordFile, setFilePassword] = useState(null);
    const [depositId, setDepositId] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [filterData, setFilterData] = useState({
        from_date: null,
        to_date: null,
        status: "pending",
        duration: null,
        ib_client: location.state?.client_id,
    })
    const [error, setError] = useState({});
    const [depositData, setDeposits] = useState(null);
    const [editState, setEditState] = useState({
        'path': null,
        'type': null,
        'status': null
    });


    // const [editImagePreview, setEditImagePreview] = useState(null);
    const [editPwdState, setEditPwdState] = useState(false);
    const [pwdState, setPwdState] = useState(false);

    const dispatch = useDispatch();


    const deleteRequest = async (e, id) => {
        e.preventDefault();
        await Swal.fire({
            title: "Are you sure, you want to delete this ?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "error",
            focusCancel: true,
            confirmButtonText: "Yes, delete it!",
            showCloseButton: true,
            showConfirmButton: true,
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

                        axios.post(DELETE_DEPOSIT_REQUEST_API, formData, config).then((res) => {
                            if (res.data.status_code === 200) {

                                Swal.fire("", "Record deleted successfully!", "success");
                                fetchData();
                            } else if (res.data.status_code === 500) {
                                Swal.fire({
                                    icon: 'error',
                                    text: res.data.message,
                                    confirmButtonText: 'OK',
                                });
                                fetchData();
                                props.refetchWalletBalanceData();
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
    const [pageNumberLimit, setPageNumberLimit] = useState(2);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(2);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = depositData !== null && depositData?.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = depositData !== null && Math.ceil(depositData.length / recordsPerPage);




    const handleProof = (e) => {
        e.preventDefault();
        let files = e.target.files[0];
        setFile(files);
    }

    const handleModal = (e, id) => {
        e.preventDefault();
        setModal(true);
        setDepositId(id);
        setError({});
    }

    async function SubmintProof(e) {
        e.preventDefault();

        let formData = new FormData();
        formData.append("proof_deposit", file);
        formData.append("proof_password", passwordFile);
        formData.append("id", depositId);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${client.token}`
            },
        };

        axios.post(UPLOAD_PROOF_API, formData, config).then((res) => {
            if (res.data.status_code === 200) {
                fetchData();
                setModal(false);
                setEditModal(false);
                setError({});
            }
            else if (res.data.status_code === 500) {

                setError(res.proof_deposit);

            }

        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data.errors);
                setFile("");
                setError(error.response.data.errors);
            }
        });
    }

    const modalPreview = (e, path, type, id, status) => {
        e.preventDefault();
        setDepositId(id);
        setEditState((previous) => ({
            ...previous,
            'path': path,
            "type": type,
            "status": status
        }));
        setEditModal(true);
        setError({});
    }

    const editPreview = (e) => {
        e.preventDefault();
        let files = e.target.files[0];
        setFile(files);
        setError({});

        let file = URL.createObjectURL(files);

        let fileType = files.type;

        if (fileType.indexOf("pdf") !== -1) {
            setEditState((previous) => ({
                ...previous,
                'path': file,
                "type": "pdf"
            }));
        } else {
            setEditState((previous) => ({
                ...previous,
                'path': file,
                "type": "img"
            }));
        }


    }

    const deleteProofDeposit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("id", depositId);

        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            axios.post(DELETE_PROOF_API, formData, config).then((res) => {
                if (res.data.status_code === 200) {
                    fetchData();
                    setEditModal(false);
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

    const handleFilterDataChanger = (e) => {
        setFilterData((previousData) => ({
            ...previousData,
            [e.target.name]: e.target.value
        }))
    }

    const searchByDate = (e) => {

        fetchData();
        setCurrentPage(1);
        setPageNumberLimit(2);
        setMaxPageNumberLimit(2);
        setMinPageNumberLimit(0);
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


    const clearDate = (e) => {
        fetchData("clr");
        setCurrentPage(1)
        setPageNumberLimit(2);
        setMaxPageNumberLimit(2);
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
                    'duration': "current_month",
                    'status': "pending"
                }))
            } else if (clr?.duration) {

                data.from_date = null;
                data.to_date = null;
                data.duration = clr.duration;
                data.status = clr.status;
                if (location.pathname === "/ib/client") {
                    data.status = 'all';
                }


                setFilterData((previousData) => ({
                    ...previousData,
                    'from_date': null,
                    'to_date': null,
                    "duration": data.duration,
                    'status': data.status
                }))

            }
            const response = await axios.post(DEPOSIT_API_URL, data, config)
            if (response.data) {
                setDeposits(response.data.data)
                props.setOuterLoading(false);

                setError({})
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
        if ((props.showList === 'deposit' || props.showList === "depositRequest")) {
            if (props.showList === 'deposit') {
                setCurrentPage(1)
                setPageNumberLimit(2);
                setMaxPageNumberLimit(2);
                setMinPageNumberLimit(0);
                fetchData({ duration: "current_month", status: "pending" });
                setRecordsPerPage(10)
            } else if (props.showList === "depositRequest") {
                setCurrentPage(1)
                setPageNumberLimit(2);
                setMaxPageNumberLimit(2);
                setMinPageNumberLimit(0);
                fetchData({ duration: "current_month", status: "all" });
                setRecordsPerPage(10)
            }
        } else if (props.showList === 'all') {
            setCurrentPage(1)
            setPageNumberLimit(2);
            setMaxPageNumberLimit(2);
            setMinPageNumberLimit(0);
            setRecordsPerPage(5)
            fetchData({ duration: 'all', status: "pending" });

        }
    }, [props.showList])

    let totalStatusAmt = Array.isArray(depositData) && depositData.reduce((acc, curr) => {

        if (curr.status === "Pending") {

            acc.pendingStatus.amount = acc.pendingStatus.amount + curr.amount;
            acc.pendingStatus.count = ++acc.pendingStatus.count;
        } else if (curr.status === "Approved") {
            acc.approvedStatus.amount = acc.approvedStatus.amount + curr.final_amount;
            acc.approvedStatus.count = ++acc.approvedStatus.count;
        }
        return acc
    }, { pendingStatus: { 'amount': 0, 'count': 0 }, approvedStatus: { 'amount': 0, 'count': 0 } });

    let csvdata = Array.isArray(depositData) && depositData.map(data => {
        return {
            "Record ID": data.id,
            "Transaction ID": data.transaction_id ?? '-',
            "Payment Method": data.payment_method,
            Amount: data.amount?.toLocaleString(data.currency.currency_locale, { style: 'currency', currency: data.currency.currency_code }),
            "Final Amount": data.final_amount != null ? data.final_amount?.toLocaleString("en-US", { style: 'currency', currency: 'USD' }) : "$0.00",
            Status: data.status,
            Comment: data.comment != null ? data.comment : "-",
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
                />
                    : <>
                        <div className={`table-last-col ${location.pathname === "/mywallet" && 'card-body'}`}>
                            {props.showList === 'all' &&
                                <div className="title d-flex justify-content-between flex-wrap">
                                    <h3>Pending Deposits</h3>
                                    <div className="mb-3 mb-md-0">Total Amount: <span className="text-success">  {totalStatusAmt && ` $${totalStatusAmt?.pendingStatus.amount.toFixed(2)}  (${totalStatusAmt?.pendingStatus.count}) `}</span>
                                    </div>
                                </div>}
                            {(props.showList === 'deposit' || props.showList === "depositRequest") &&
                                <>
                                {location.pathname === "/mywallet" &&
                                    <>
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <h3 className="mb-0 d-flex flex-wrap justify-content-between" style={{ alignItems: 'center' }}>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Back To Wallet</Tooltip>}>
                                                <Link to="#" onClick={() => props.setShowList('all')} className="back-arrow mr-1">
                                                    <BackArrowIcon width="24" height="24" />
                                                </Link>
                                            </OverlayTrigger>
                                            <div className="mx-2">Deposits</div>
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
                                    </>
                                }
                                <DurationFilter filterData={filterData} search={searchByDate} clear={clearDate} handleFilterDataChanger={handleFilterDataChanger} handleDurationChanger={handleDurationChanger} csvdata={csvdata} csvName={location.state?.client_name ? location.state?.client_name.replace(/ /g, "_") + "_deposit" : "deposits"} />
                                <div className='d-flex flex-wrap mb-2'>
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
                                            <th scope="col">Final Amount</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Comment</th>
                                            {location.pathname === "/mywallet" && <th scope="col">Payment Proof</th>}
                                            <th scope="col">Date</th>
                                            {location.pathname === "/mywallet" && <th scope="col">Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(currentRecords) && currentRecords.length <= 0 && <tr><td colSpan="10">No records found</td></tr>}
                                        {Array.isArray(currentRecords) && currentRecords.map((deposit, i) => {
                                            return <tr>
                                                <th>{deposit.id}</th>
                                                <td>{deposit.transaction_id != null ? deposit.transaction_id : '-'}</td>
                                                <td>{deposit.payment_method}</td>
                                                {/* <td>{deposit.destination}</td> */}
                                                {/* <td>${deposit.amount}</td> */}
                                                <td>
                                                    {
                                                        deposit.amount?.toLocaleString(deposit.currency.currency_locale, { style: 'currency', currency: deposit.currency.currency_code })
                                                    }
                                                </td>
                                                <td>${deposit.final_amount ?? 0}</td>
                                                {/* <td>{deposit.status === 'approved' ? <Link to={"/payment/"+deposit.transaction_id} className="btn btn-primary btn-sm">Pay Now</Link> : deposit.status }</td> */}
                                                <td>{deposit.status === 'Approved' ? 'Approved' : deposit.status}</td>
                                                <td>{deposit.comment !== null ? deposit.comment : '-'}</td>
                                                {
                                                    location.pathname === "/mywallet" && <td>
                                                        {((deposit.status === 'Approved' || deposit.status === 'Rejected' || deposit.status === 'Waiting for response') && deposit.proof_deposit === '-') ? "-" : (deposit.status === "Pending" && deposit.proof_deposit === '-') ?
                                                            <OverlayTrigger placement="top" overlay={<Tooltip>Add Proof</Tooltip>}>
                                                                <Link to="#" className="link-text" onClick={(e) => handleModal(e, deposit.id)}>
                                                                    <AddProofIcon width='20' height="20" />
                                                                </Link>
                                                            </OverlayTrigger> :
                                                            (
                                                                ['jpg', 'jpeg', 'JPEG', 'JPG', 'png', 'PNG', 'svg'].includes(
                                                                    deposit.proof_deposit.toLowerCase().split('.').pop()
                                                                ) ? (
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>View Proof</Tooltip>}>
                                                                        <Link to="#" className="link-text" onClick={(e) => modalPreview(e, deposit.proof_deposit, "img", deposit.id, deposit.status)}>
                                                                            {/* View Payment Proof */}

                                                                            <img src={process.env.PUBLIC_URL + '/Images/doc.png'} height='20px' width='20px' alt='' />
                                                                        </Link>
                                                                    </OverlayTrigger>
                                                                ) : (
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>View Proof</Tooltip>}>
                                                                        <Link to="#" className="link-text" onClick={(e) => modalPreview(e, deposit.proof_deposit, "doc", deposit.id, deposit.status)}>
                                                                            <img src={process.env.PUBLIC_URL + '/Images/doc.png'} height='20px' width='20px' alt='' />
                                                                            {/* View Payment Proof */}
                                                                            {/* <img src={`${process.env.PUBLIC_URL}/Images/pdf_title_img.png`} height='50px' width='50px' alt='' /> */}
                                                                        </Link>
                                                                    </OverlayTrigger>
                                                                )
                                                            )
                                                        }
                                                    </td>
                                                }

                                                <td>{deposit.created_at}</td>
                                                {
                                                    location.pathname === "/mywallet" && <td>
                                                        {
                                                            deposit.status === 'Pending' ?
                                                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                                                    <Link to="#" onClick={(e) => deleteRequest(e, deposit.id)} className="delete-ticket-icon" >
                                                                        <DeleteIcon width="18" height="18" />
                                                                    </Link>
                                                                </OverlayTrigger> : '-'
                                                        }
                                                    </td>
                                                }

                                            </tr>
                                        })}
                                    </tbody>
                                </Table>

                                {   // View Proof Modal
                                    <Modal show={editModal} className={"modal-lg"}>
                                        <form onSubmit={SubmintProof} encType="multipart/form-data">
                                            <Modal.Body className="pdf-body">
                                                {editState.type === 'img' ?
                                                    <img src={editState.path} width='100%' alt='' /> :
                                                    <iframe title="file" src={editState.path} width="100%" height="500px"></iframe>
                                                }
                                                {editState.status === "Pending" ?
                                                    <><div className="my-3">
                                                        <label className="mb-2">Upload new payment proof</label>
                                                        <input className="form-control" onChange={(e) => editPreview(e)} name="proof_deposit" type="file" />
                                                        <small className="text-danger">{error[`proof_deposit`]}</small>

                                                        {/* <div className="mb-3 mt-3">
                                                <input type={viewpass===true ? 'text' : 'password'} className="form-control" name='proof_password' onChange={(e) => setFilePassword(e.target.value)} placeholder="Enter proof password (if required)" />
                                            </div> */}
                                                    </div>
                                                        <div className="mb-3">
                                                            <div className='mt-3 w-100 position-relative'>
                                                                <span style={{ cursor: 'pointer' }} className="password-icon" onClick={() => setEditPwdState(!editPwdState)}>{editPwdState === false ?
                                                                    <VisibilityIcon width="16" height="16" /> : <VisibilityOffIcon width="16" height="16" />
                                                                }</span>
                                                                <input type={editPwdState ? 'text' : 'password'} className="form-control" name='proof_password' onChange={(e) => setFilePassword(e.target.value)} placeholder="Enter/Change payment proof password (if required)" />
                                                            </div>
                                                            {/* <input className="form-control" name='proof_password' onChange={(e) => setFilePassword(e.target.value)} type="text" placeholder="Enter/Change proof password (if required)" /> */}
                                                        </div></> : ""
                                                }

                                                <small className="text-danger">{error[`proof_deposit`]}</small>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                {/* <input name='proof_deposit' className="btn" type="file" onChange={(e) => editPreview(e)} /> */}
                                                {
                                                    editState.status === "Pending" ? <Button className="delete-btn-link" onClick={(e) => deleteProofDeposit(e)}>
                                                        <DeleteIcon width="18" height="18" />
                                                    </Button> : ""
                                                }
                                                <div className="ms-auto proof-modal-footer">
                                                    <Button className="me-2" variant="secondary" onClick={() => setEditModal(false)}>
                                                        Close
                                                    </Button>
                                                    {editState.status === "Pending" ? <Button variant="primary" type="submit">
                                                        Submit
                                                    </Button> : ""
                                                    }
                                                </div>
                                            </Modal.Footer>
                                        </form>
                                    </Modal>
                                }

                                {   //Add Proof Modal
                                    <Modal show={modal}>
                                        <form onSubmit={SubmintProof} encType="multipart/form-data">
                                            <Modal.Header>
                                                <h3 className="mb-0">Add Payment Proof</h3>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="mb-3">
                                                    <input className="form-control" name='proof_deposit' onChange={(e) => handleProof(e)} type="file" />
                                                </div>
                                                <small className="text-danger">{error[`proof_deposit`]}</small>

                                                <div className="mb-3">
                                                    <div className='mt-3 w-100 position-relative'>
                                                        <span style={{ cursor: 'pointer' }} className="password-icon" onClick={() => setPwdState(!pwdState)}>{pwdState === false ?
                                                            <VisibilityIcon width="16" height="16" /> : <VisibilityOffIcon width="16" height="16" />
                                                        }</span>
                                                        <input type={pwdState ? 'text' : 'password'} className="form-control" name='proof_password' onChange={(e) => setFilePassword(e.target.value)} placeholder="Enter/Change payment proof password (if required)" />
                                                    </div>
                                                    {/* <input className="form-control" name='proof_password' onChange={(e) => setFilePassword(e.target.value)} type="text" placeholder="Enter proof password (if required)" /> */}
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => setModal(false)}>
                                                    Close
                                                </Button>
                                                <Button variant="primary" type="submit">
                                                    Submit
                                                </Button>
                                            </Modal.Footer>
                                        </form>
                                    </Modal>
                                }
                                {
                                    (props.showList === 'deposit' || props.showList === 'depositRequest') && depositData !== null && depositData.length > TBL_SHOW_RECORDS ?
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
                                    <Link to='#' className="link-text" onClick={() => props.setShowList('deposit')}>Show more</Link>
                                </div>
                            }

                        </div>
                    </>
            }
        </Fragment>
    );
};

export default Deposittable;