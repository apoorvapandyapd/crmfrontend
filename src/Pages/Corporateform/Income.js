import {Col, FormControl, FormGroup} from "react-bootstrap";
import {useState} from "react";

const Income = ({onSubmit, handleChanger, data, error, curState, backChanger, fillLater}) => {

    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth() + 1)).padStart(2, '0');
    const day = String((today.getDate() + 1)).padStart(2, '0');

    const todayDt = `${year}-${month}-${day}`;

    return (
        <div className={curState === 'income' ? 'tab-pane fade show active' : 'tab-pane fade'} id="tab-pane-7"
             role="tabpanel" aria-labelledby="tab-7" tabIndex="0">
            <form onSubmit={onSubmit}>
                <input type="hidden" name="check_key" value="income_key"/>
                <div className="p-4 label-input">

                    <h2 className="mb-2"><b>Income Information</b></h2>
                    <div className="row form-details">
                        <Col sm={6} xl={6} xxl={6} className="mb-3">
                            <FormGroup>
                                <label htmlFor="annual_income">Annual Turnover (approx. USD) *</label>
                                <FormControl type="text" name="annual_income" value={data.annual_income}
                                             onChange={(e) => handleChanger(e)}/>
                                <small className="text-danger">{error.annual_income}</small>
                            </FormGroup>
                        </Col>
                        <Col sm={6} xl={6} xxl={6} className="mb-3">
                            <FormGroup>
                                <label htmlFor="net_worth">Estimated total balance-sheet assets (USD)*</label>
                                <FormControl type="text" name="net_worth" value={data.net_worth}
                                             onChange={(e) => handleChanger(e)}/>
                                <small className="text-danger">{error.net_worth}</small>
                            </FormGroup>
                        </Col>
                        <Col sm={6} xl={6} xxl={6} className="mb-3">
                            <FormGroup>
                                <label htmlFor="available_trading_funds">Funds available for trading with PM Financials Ltd? (USD)*</label>
                                <FormControl type="text" name="available_trading_funds"
                                             value={data.available_trading_funds} onChange={(e) => handleChanger(e)}/>
                                <small className="text-danger">{error.available_trading_funds}</small>
                            </FormGroup>
                        </Col>
                        <Col sm={6} xl={6} xxl={6} className="mb-3">
                            <FormGroup>
                                <label htmlFor="latest_financial_statement">Date of Latest, Audited Financial Statement:</label>
                                <FormControl type="date" name="latest_financial_statement"
                                             value={data.latest_financial_statement} onChange={(e) => handleChanger(e)}
                                             max={todayDt}/>
                                <small className="text-danger">{error.latest_financial_statement}</small>
                            </FormGroup>
                        </Col>
                        <Col sm={12} xl={12} xxl={12} className="mt-3">
                            <div className="buttons d-flex justify-content-between">
                                <button type="button" className="btn btn-light" onClick={(e) => fillLater(e)}>Complete
                                    Later
                                </button>
                                <div>
                                    <button type="button" className="btn btn-light"
                                            onClick={(e) => backChanger(e)}>Back
                                    </button>
                                    <button type="submit" className="btn btn-primary">Save and Next</button>
                                </div>
                            </div>
                        </Col>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Income;