import React, { useState } from 'react';
import Pagination from "../../Components/Pagination";
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS==null ? 10 : process.env.TBL_SHOW_RECORDS;
const TBL_PER_PAGE = process.env.TBL_PER_PAGE==null ? 2 : process.env.TBL_PER_PAGE;

function CommissionHistory(props) {

    const commissionData = props.data.data.commission_info;

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(TBL_SHOW_RECORDS);

    //---use for not show all pages at time, It divide pages in given number
    const [pageNumberLimit, setPageNumberLimit] = useState(TBL_PER_PAGE);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = commissionData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(commissionData.length / recordsPerPage);

    return (
        <>
            <div className="mt-4">
                
                        <div className="table-responsive">
                            <table className="table m-0">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Login</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Deal</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {currentRecords.length === 0 ? <tr><td className='text-center' colspan="5">No records found</td></tr> : currentRecords.map((data, i) =>
                                        <tr>
                                            <td scope="row">{data.ticket}</td>
                                            <td>{data.login}</td>
                                            <td>${data.profit}</td>
                                            <td>{data.deal}</td>
                                            <td>{data.datetime}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table> 
                            {
                                commissionData.length > TBL_SHOW_RECORDS ?
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