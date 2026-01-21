import React from 'react'
import { Button, Row, Col, FormGroup, FormSelect, FormControl } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { CsvDownloadIcon } from './icons';
function DurationFilter({ filterData, search, clear, handleFilterDataChanger, handleDurationChanger, csvdata, csvName }) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth() + 1)).padStart(2, '0');
    const day = String((today.getDate() + 1)).padStart(2, '0');
    const todayDt = `${year}-${month}-${day}`;
    return (
        <Row>
            {filterData?.status &&
                <Col sm={6} xl={2} className={"mt-2"}>
                    <FormSelect name="status" onChange={(e) => handleFilterDataChanger(e)} >
                        <option value="pending" selected={filterData.status === "pending"} >Pending</option>
                        <option value="approved" selected={filterData.status === "approved"}>Approved</option>
                        <option value="rejected" selected={filterData.status === "rejected"}>Rejected</option>
                        <option value="all" selected={filterData.status === "all"}>All</option>
                    </FormSelect>
                </Col>
            }

            <Col sm={6} xl={filterData.duration === "custom" ? 2 : 2} className={"mt-2"} >
                <FormSelect name="duration" onChange={handleDurationChanger} required>
                    <option value="current_month" selected={filterData.duration === "current_month"} >Current Month</option>
                    <option value="previous_month" selected={filterData.duration === "previous_month"}>Previous Month</option>
                    <option value="last_3_month" selected={filterData.duration === "last_3_month"}>Last 3 Month</option>
                    <option value="custom" selected={filterData.duration === "custom"}>Custom</option>
                </FormSelect>
            </Col>
            {
                filterData.duration === "custom" &&
                <Col xl={4}>
                    <div className='d-flex justify-content-center flex-wrap flex-sm-nowrap align-items-baseline mt-2'>
                        <FormControl type="date" className="uppercase-date w-100" name="from_date" max={todayDt} value={filterData.from_date ? filterData.from_date : ""} placeholder="dd-mm-yyyy" onChange={(e) => handleFilterDataChanger(e)} />
                        <div className='mx-2 text-center my-2'>To</div>
                        <FormControl type="date" className="uppercase-date w-100" name="to_date" max={todayDt} value={filterData.to_date ? filterData.to_date : ""} placeholder="Date TO" onChange={(e) => handleFilterDataChanger(e)} />
                    </div>
                </Col>
            }
            <Col xl={filterData.duration === "custom" ? 4 : 4}>
                <FormGroup className={`mt-3 mt-xl-2 d-flex flex-wrap justify-content-center justify-content-sm-start ${filterData.duration === "custom" ? "mb-2" : ""}`}>
                    <Button type="submit" className="btn btn-primary me-2 mb-2 mb-sm-0" onClick={(e) => { search(e) }} >Search</Button>
                    <Button className="btn funding-clear-btn me-2" onClick={(e) => { clear(e) }}>Clear</Button>
                    {csvdata &&
                        <CSVLink
                            className='mt-sm-0 mt-2'
                            data={csvdata}
                            filename={`${csvName}.csv`}
                            target="_blank"
                        >
                            <CsvDownloadIcon with="39" height="39" />
                        </CSVLink>
                    }
                </FormGroup>

            </Col>
        </Row>
    )
}

export default DurationFilter
