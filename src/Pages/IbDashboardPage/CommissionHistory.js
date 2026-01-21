import React, { useEffect, useState } from 'react';
import Pagination from "../../Components/Pagination";
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { CsvDownloadIcon } from '../../Components/icons';
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS==null ? 10 : process.env.TBL_SHOW_RECORDS;
const TBL_PER_PAGE = process.env.TBL_PER_PAGE==null ? 2 : process.env.TBL_PER_PAGE;

function CommissionHistory(props) {

    const commision = props.data.data.commission_info;

    const [clientData, setClientData] = useState(commision)

    const [filter, setFilter] = useState({
        'search': '',
    });

    //Update the data after refresh call is done
    useEffect(() => {
        setClientData(commision);
    }, [commision]);

    //Call when anything changes in search textbox
    const clientChangeHandler = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    }

    //Call the filter function according to filter state
    useEffect(() => {
        filterRecords();
    }, [filter]);

    //Filter records
    const filterRecords = () => {
        let search = filter.search;
        let selclient = filter.selclient;
        let filteredAcc = [];

        if (search.trim() !== '' || selclient) {
            filteredAcc = commision;
            if (search.trim() !== '') {
                filteredAcc = filteredAcc.filter((c) => {
                    const searchRegex = new RegExp(search, 'i');
                    let typesearch = searchRegex.test(c.type);
                    let commissionsearch = searchRegex.test(c.total_commission);
                    let datesearch = searchRegex.test(c.date);

                    if (typesearch || commissionsearch || datesearch) {
                        return c;
                    }
                });
            }
        } else {
            filteredAcc = commision;
        }
        setClientData(filteredAcc);
    }
    let csvdata = Array.isArray(clientData) && clientData.map(data => {
        return {
            type: data.type,
            total_commission: data.total_commission,
            date: data.date,
        }
    })

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(TBL_SHOW_RECORDS);

    //---use for not show all pages at time, It divide pages in given number
    // const [pageNumberLimit, setPageNumberLimit] = useState(TBL_PER_PAGE);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = clientData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(clientData.length / recordsPerPage);

    return (
        <>
            <div className="mt-32">
                <div className="row d-flex align-items-sm-center justify-content-end">
                    <div className="col-md-6 col-lg-4 col-xl-3 ms-auto d-flex align-items-center">
                        <input type="text" className="form-control" placeholder="Search" name='search' value={filter.search} onChange={clientChangeHandler} />
                        <CSVLink
                            data={csvdata}
                            filename={"clientdetails.csv"}
                            className="ms-2"
                            target="_blank"
                        >
                            <CsvDownloadIcon width="24" height="24" />
                        </CSVLink>
                    </div>
                    {/* <div className="col-sm-2">
                        <select name='selclient' value="" className="form-control select"
                                onChange="">
                            <option value=''>All</option>
                            {clientData.map((cl, i) =>{    
                                <option key={i} value={cl.id}>{cl.name}</option>
                                }
                            )}
                        </select>
                    </div> */}
                    

                </div>
            </div>
            <div className="mt-4">
                
                        <div className="table-responsive">
                            <table className="table m-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Type</th>
                                        <th scope="col">Commision</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {clientData.length === 0 ? <tr><td className='text-center' colspan="5">No records found</td></tr> : clientData.map((data, i) =>
                                        <tr>
                                            <td>{data.type}</td>
                                            <td>${data.total_commission}</td>
                                            <td>{data.date}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table> 
                            {
                                clientData.length > TBL_SHOW_RECORDS ?
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
                            }
                        </div>
        </div>

            {/* <div className="table-responsive mt-32">
                <table className="table m-0">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Client</th>
                            <th scope="col">Level</th>
                            <th scope="col">Percentage</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Description</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {commissionData.map((data,index) =>
                        <tr>
                            <td scope="row">{index + 1}</td>
                            <td><a href={null}>{data.client}</a></td>
                            <td>{(data.level !== null) ? data.level : '-' }</td>
                            <td>{(data.percentage !== null) ? data.percentage : '-' }</td>
                            <td>${data.amount}</td>
                            <td>{data.description}</td>
                            <td>{data.created}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div> */}
        </>
    );
}

export default CommissionHistory;