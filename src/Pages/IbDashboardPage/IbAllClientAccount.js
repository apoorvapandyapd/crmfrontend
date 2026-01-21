// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import {redirectAsync, showClient} from '../../store/clientslice';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumberWithCommas, getUniqueList } from '../../Components/util';
import { Link } from 'react-router-dom';
import { CsvDownloadIcon, RefatchIcon } from '../../Components/icons';
import { CSVLink } from "react-csv";
import { CustomRequest } from '../../Components/RequestService';

let allIbAccounts = [];
// const DASHBOARD_API_URL = process.env.REACT_APP_API_URL + "/v1/ib/getallibaccounts";

function IbAllClientAccount() {
    const dispatch = useDispatch();
    
    const [ibAccounts, setIbAccounts] = useState(null);
    const [clientsArr, setClientsArr] = useState([]);
    const [filter, setFilter] = useState({
        'search': '',
        'selclient': ''
    });

    const client = useSelector(showClient);
    async function fetchAllAccounts() {
        setIbAccounts(null);

        let data = {
            key: "value"
        };
        CustomRequest('getallibaccounts', data, client.token, (res) => {
            if (res?.error) {
                if (res.error.response.status === 401) {
                    dispatch(redirectAsync());
                }
            } else {
                if (res.data.status_code === 200) {
                    allIbAccounts = res.data.data.accounts;
                    setIbAccounts(res.data.data.accounts);
                    let cArr = getUniqueList(allIbAccounts);
                    setClientsArr(cArr);
                    setFilter({ search: '', selclient: '' });
                }
            }
        });
    }

    const clientChangeHandler = (e) => {
        setFilter({...filter, [e.target.name]: e.target.value});
    }

    const filterRecords = () => {
        let search = filter.search;
        let selclient = filter.selclient;
        let filteredAcc = [];
        
        if (search.trim() !== '' || selclient) {
            filteredAcc = allIbAccounts;
            if (search.trim() !== '') {
                filteredAcc = filteredAcc.filter((c) => {
                    const searchRegex = new RegExp(search, 'i');
                    let loginsearch = searchRegex.test(c.login);
                    let first_namesearch = searchRegex.test(c.first_name);
                    let last_namesearch = searchRegex.test(c.last_name);
                    let statussearch = searchRegex.test(c.status);
                    
                    if(loginsearch || first_namesearch || last_namesearch || statussearch) {
                        return c;
                    }
                });
            }
            if(selclient) {
                filteredAcc = filteredAcc.filter((c) => c.clientid == selclient);
            }
        } else {
            filteredAcc = allIbAccounts;
        }
        setIbAccounts(filteredAcc);
    }
    useEffect(() => {
        filterRecords();
        console.log('use effect filter records');
    },[filter]);    
    
    useEffect(() => {
        fetchAllAccounts();
    }, []);

    let csvdata = Array.isArray(ibAccounts) && ibAccounts.map(data => {
        return {
            Name: `${data.first_name} ${data.last_name}`,
            Login: data.login,
            Balance: data.balance ? `$${formatNumberWithCommas(data.balance)}` : '$0',
            Equity: data.equity ? `$${formatNumberWithCommas(data.equity)}` : '$0',
            "Free Margin": data.free_margin ? `$${formatNumberWithCommas(data.free_margin)}` : '$0',
            Status: data.status
        }
    })

    return (
        <>
        {
            (ibAccounts === null) ?
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
                                    <Link to="#" onClick={fetchAllAccounts} className="me-2">
                                        <RefatchIcon width="24" height="24" />
                                    </Link>
                                    <CSVLink
                                        data={csvdata}
                                        filename={"clientaccounts.csv"}
                                        className=""
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
                            <th scope="col">Login</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Equity</th>
                            <th scope="col">Free Margin</th>
                            <th scope="col">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(ibAccounts) && ibAccounts.length === 0 ? <tr className='text-center'><td colSpan="6">No records found</td></tr> : ibAccounts.map((acc, id) =>
                            <tr key={id}>
                                    <td>{acc.first_name} {acc.last_name}</td>
                                    <td>{acc.login}</td>
                                    <td>${acc.balance ? formatNumberWithCommas(acc.balance) : '0'}</td>
                                    <td>${acc.equity ? formatNumberWithCommas(acc.equity) : '0'}</td>
                                    <td>${acc.free_margin ? formatNumberWithCommas(acc.free_margin) : '0'}</td>
                                <td>{acc.status}</td>
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

export default IbAllClientAccount;