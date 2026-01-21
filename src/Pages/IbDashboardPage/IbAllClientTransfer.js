import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import {redirectAsync, showClient} from '../../store/clientslice';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas, getUniqueList } from '../../Components/util';
import { Link } from 'react-router-dom';
import { CsvDownloadIcon, RefatchIcon } from '../../Components/icons';
import { CSVLink } from "react-csv";
let allIbTransfer = [];
const DASHBOARD_API_URL = process.env.REACT_APP_API_URL + "/v1/ib/transfer-list";

function IbAllClientTransfer() {
    const dispatch = useDispatch();
    const [ibTransfer, setIbTransfer] = useState(null);
    const [clientsArr, setClientsArr] = useState([]);
    const [filter, setFilter] = useState({
        'search': '',
        'selclient': ''
    });
    const client = useSelector(showClient);
    async function fetchAllTransfer() {
        setIbTransfer(null);
        try {
            const config = {
                headers: {Authorization: `Bearer ${client.token}`}
            };

            const bodyParameters = {
                key: "value"
            };
            await axios.post(DASHBOARD_API_URL, bodyParameters, config).then((res) => {
                if (res.data.status_code === 200) {
                    allIbTransfer = res.data.data.mtTransfer;
                    setIbTransfer(res.data.data.mtTransfer);
                    let cArr = getUniqueList(allIbTransfer);
                    setClientsArr(cArr);
                    setFilter({search:'', selclient:''});
                } else if (res.data.status_code === 500) {

                }
            }).catch((error) => {
                if (error.response) {

                }
            });
        } catch (error) {
            
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }
        }
    }

    const clientChangeHandler = (e) => {
        setFilter({...filter, [e.target.name]: e.target.value});
    }

    const filterRecords = () => {
        let search = filter.search;
        let selclient = filter.selclient;
        let filteredAcc = [];
        
        if (search.trim() !== '' || selclient) {
            filteredAcc = allIbTransfer;
            if (search.trim() !== '') {
                filteredAcc = filteredAcc.filter((c) => {
                    const searchRegex = new RegExp(search, 'i');
                    let transactoinsearch = searchRegex.test(c.transaction_id);
                    let first_namesearch = searchRegex.test(c.first_name);
                    let last_namesearch = searchRegex.test(c.last_name);
                    
                    if(transactoinsearch || first_namesearch || last_namesearch) {
                        return c;
                    }
                });
            }
            if(selclient) {
                filteredAcc = filteredAcc.filter((c) => c.clientid == selclient);
            }
        } else {
            filteredAcc = allIbTransfer;
        }
        setIbTransfer(filteredAcc);
    }
    useEffect(() => {
        filterRecords();
    },[filter]);
    
    useEffect(() => {
        fetchAllTransfer();
    }, []);

    let csvdata = Array.isArray(ibTransfer) && ibTransfer.map(data => {
        return {
            "Name": `${data.first_name} ${data.last_name}`,
            "Transaction ID": data.transaction_id ?? '-',
            Type: data.type,
            Amount: data.amount.toLocaleString("en-US", { style: 'currency', currency: 'USD' }),
            Status: data.status,
            Date: data.date
        }
    })

    return (
        <>
        {
            (ibTransfer === null) ?
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
                    height: '37vh'
                }}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            :
            <>
            <div className="mt-3">
                <div className="row d-flex justify-content-end">
                    <div className="d-flex flex-wrap flex-sm-nowrap align-items-center col-md-8 col-lg-6 ms-auto">
                        <input type="text" className="form-control" placeholder="Search" name='search' value={filter.search} onChange={clientChangeHandler}/>
                        <select name='selclient' value={filter.selclient} className="form-control select mx-sm-3 mx-0 my-2 my-sm-0" onChange={clientChangeHandler}>
                            <option value=''>All</option>
                            {clientsArr.map((cl, i) =>
                                <option key={i} value={cl.clientid}>{cl.first_name} {cl.last_name}</option>
                            )}       
                        </select>
                                    <Link to="#" onClick={fetchAllTransfer} className="me-2">
                                        <RefatchIcon width="24" height="24" />
                                    </Link>
                                    <CSVLink
                                        data={csvdata}
                                        filename={"clienttransfers.csv"}
                                        target="_blank"
                                    >
                                        <CsvDownloadIcon width="24" height="24" />
                                    </CSVLink>
                    </div>
                </div>
            </div>
            <div className="fix-table-height mt-3">
                <div className="table-responsive">
                    <table className="table m-0">
                        <thead>
                        <tr>
                                            <th scope="col">Name</th>
                            <th scope="col">Transaction ID</th>
                            <th scope="col">Type</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Status</th>
                            <th scope="col">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(ibTransfer) && ibTransfer.length === 0 ? <tr className='text-center'><td colSpan="7">No records found</td></tr> : ibTransfer.map((acc, id) =>
                            <tr key={id}>
                                    <td>{acc.first_name} {acc.last_name}</td>
                                    <td>{acc.transaction_id}</td>
                                    <td>{acc.type}</td>
                                    <td>${formatNumberWithCommas(acc.amount)}</td>
                                    <td>{acc.status}</td>
                                    <td>{acc.date}</td>
                            </tr>
                            )}  
                        </tbody>
                </table>
                </div>
            </div>
            </>
            }
        </>
    )
}

export default IbAllClientTransfer;