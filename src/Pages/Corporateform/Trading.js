const Trading = ({onSubmit, handleChanger, data, error, curState, backChanger,fillLater}) => {

    return(
        <div className={curState === 'trading' ? 'tab-pane fade show active' : 'tab-pane fade'} id="tab-pane-8" role="tabpanel" aria-labelledby="tab-8" tabIndex="0">
            <div className="p-4 label-input">
                <form onSubmit={onSubmit}>
                    <input type='hidden' name='trading_key' value='true'/>
                    <input type='hidden' name='check_key' value='trading_key'/>

                    <h2 className="mb-3"><b>Trading Experience and Knowledge</b></h2>
                    <div className="row form-details">
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="risk_of_trading">Do you understand the risks of trading margined/leverage products?*</label>
                                <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="risk-yes" name="risk_of_trading" onChange={handleChanger} value='Yes' checked={data.risk_of_trading === "Yes"} />
                                    <label htmlFor="risk-yes">Yes</label>
                                    <input type="radio" id="risk-no" name="risk_of_trading" onChange={handleChanger} value='No' checked={data.risk_of_trading === "No"} />
                                    <label htmlFor="risk-no">No</label>
                                </div>
                                {
                                    data.risk_of_trading === "No" &&
                                    <span className='mt-1 d-block'>Please refer to this document for more information <a style={{ color: '#00aeff' }} href='https://crm.netulr.com/pdf/Risk%20Warning-ParkmoneySVG.pdf' rel="noreferrer" target='_blank'>Risk Disclosure</a></span>
                                }
                            </div>
                            <small className="text-danger">{error.risk_of_trading}</small>
                        </div>
                        <div className="col-12"><hr/></div>
                        <div className="col-12">
                            <div className="form-group mb-3">
                                <label htmlFor="trading_experience">How many years trading experience you have?*</label>
                                <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="securities-0" name="trading_experience" onChange={handleChanger} value='Less than 1 year' checked={data.trading_experience === "Less than 1 year"} />
                                    <label htmlFor="securities-0">Less than 1 year</label>
                                    <input type="radio" id="securities-1" name="trading_experience" onChange={handleChanger} value='1 year' checked={data.trading_experience === "1 year"} />
                                    <label htmlFor="securities-1">1 year</label>
                                    <input type="radio" id="securities-1to3" name="trading_experience" onChange={handleChanger} value='1 to 3 years' checked={data.trading_experience === "1 to 3 years"} />
                                    <label htmlFor="securities-1to3">1 to 3 years</label>
                                    <input type="radio" id="securities-3" name="trading_experience" onChange={handleChanger} value='More than 3 years' checked={data.trading_experience === "More than 3 years"} />
                                    <label htmlFor="securities-3">More than 3 years</label>
                                </div>
                                <small className="text-danger">{error.trading_experience}</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="trading_experience_ft">Frequency of trades?*</label>
                                <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="securities-daily" name="trading_experience_ft" onChange={handleChanger} value='Daily' checked={data.trading_experience_ft === "Daily"} />
                                    <label htmlFor="securities-daily">Daily</label>
                                    <input type="radio" id="securities-weekly" name="trading_experience_ft" onChange={handleChanger} value='Weekly' checked={data.trading_experience_ft === "Weekly"} />
                                    <label htmlFor="securities-weekly">Weekly</label>
                                    <input type="radio" id="securities-monthly" name="trading_experience_ft" onChange={handleChanger} value='Monthly' checked={data.trading_experience_ft === "Monthly"} />
                                    <label htmlFor="securities-monthly">Monthly</label>
                                    <input type="radio" id="securities-yearly" name="trading_experience_ft" onChange={handleChanger} value='Yearly' checked={data.trading_experience_ft === "Yearly"} />
                                    <label htmlFor="securities-yearly">Yearly</label>
                                </div>
                            </div>
                            <small className="text-danger">{error.trading_experience_ft}</small>
                        </div>
                        <div className="col-12"><hr/></div>
                        <div className="col-12">
                            <div className="form-group mb-3">
                                <label htmlFor="trading_derivatives">What is your trading experience trading Derivatives?*</label>
                                <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="derivatives-0" name="trading_derivatives" onChange={handleChanger} value='Less than 1 year' checked={data.trading_derivatives === "Less than 1 year"} />
                                    <label htmlFor="derivatives-0">Less than 1 year</label>
                                    <input type="radio" id="derivatives-1" name="trading_derivatives" onChange={handleChanger} value='1 year' checked={data.trading_derivatives === "1 year"} />
                                    <label htmlFor="derivatives-1">1 year</label>
                                    <input type="radio" id="derivatives-1to3" name="trading_derivatives" onChange={handleChanger} value='1 to 3 years' checked={data.trading_derivatives === "1 to 3 years"} />
                                    <label htmlFor="derivatives-1to3">1 to 3 years</label>
                                    <input type="radio" id="derivatives-3" name="trading_derivatives" onChange={handleChanger} value='More than 3 years' checked={data.trading_derivatives === "More than 3 years"} />
                                    <label htmlFor="derivatives-3">More than 3 years</label>
                                </div>
                                <small className="text-danger">{error.trading_derivatives}</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="derivatives_ft">Frequency of trades?*</label>
                                <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="derivatives-daily" name="derivatives_ft" onChange={handleChanger} value='Daily' checked={data.derivatives_ft === "Daily"} />
                                    <label htmlFor="derivatives-daily">Daily</label>
                                    <input type="radio" id="derivatives-weekly" name="derivatives_ft" onChange={handleChanger} value='Weekly' checked={data.derivatives_ft === "Weekly"} />
                                    <label htmlFor="derivatives-weekly">Weekly</label>
                                    <input type="radio" id="derivatives-monthly" name="derivatives_ft" onChange={handleChanger} value='Monthly' checked={data.derivatives_ft === "Monthly"} />
                                    <label htmlFor="derivatives-monthly">Monthly</label>
                                    <input type="radio" id="derivatives-yearly" name="derivatives_ft" onChange={handleChanger} value='Yearly' checked={data.derivatives_ft === "Yearly"} />
                                    <label htmlFor="derivatives-yearly">Yearly</label>
                                </div>
                            </div>
                            <small className="text-danger">{error.derivatives_ft}</small>
                        </div>
                        <div className="col-12"><hr/></div>
                        <div className="col-12">
                            <div className="form-group mb-3">
                                <label htmlFor="trading_in_cfd">What is your trading experience trading CFDs?*</label>
                                <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="cfds-0" name="trading_in_cfd" onChange={handleChanger} value='Less than 1 year' checked={data.trading_in_cfd === "Less than 1 year"} />
                                    <label htmlFor="cfds-0">Less than 1 year</label>
                                    <input type="radio" id="cfds-1" name="trading_in_cfd" onChange={handleChanger} value='1 year' checked={data.trading_in_cfd === "1 year"} />
                                    <label htmlFor="cfds-1">1 year</label>
                                    <input type="radio" id="cfds-1to3" name="trading_in_cfd" onChange={handleChanger} value='1 to 3 years' checked={data.trading_in_cfd === "1 to 3 years"} />
                                    <label htmlFor="cfds-1to3">1 to 3 years</label>
                                    <input type="radio" id="cfds-3" name="trading_in_cfd" onChange={handleChanger} value='More than 3 years' checked={data.trading_in_cfd === "More than 3 years"} />
                                    <label htmlFor="cfds-3">More than 3 years</label>
                                </div>
                                <small className="text-danger">{error.trading_in_cfd}</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cfd_ft">Frequency of trades?*</label>
                                <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="cfds-daily" name="cfd_ft" onChange={handleChanger} value='Daily' checked={data.cfd_ft === "Daily"} />
                                    <label htmlFor="cfds-daily">Daily</label>
                                    <input type="radio" id="cfds-weekly" name="cfd_ft" onChange={handleChanger} value='Weekly' checked={data.cfd_ft === "Weekly"} />
                                    <label htmlFor="cfds-weekly">Weekly</label>
                                    <input type="radio" id="cfds-monthly" name="cfd_ft" onChange={handleChanger} value='Monthly' checked={data.cfd_ft === "Monthly"} />
                                    <label htmlFor="cfds-monthly">Monthly</label>
                                    <input type="radio" id="cfds-yearly" name="cfd_ft" onChange={handleChanger} value='Yearly' checked={data.cfd_ft === "Yearly"} />
                                    <label htmlFor="cfds-yearly">Yearly</label>
                                </div>
                            </div>
                            <small className="text-danger">{error.cfd_ft}</small>
                        </div>
                        <div className="col-12 mt-3">
                            <div className="buttons d-flex justify-content-between">
                                <button type="button" className="btn btn-light" onClick={(e)=>fillLater(e)}>Complete Later</button>
                                <div>
                                    <button type="button" className="btn btn-light" onClick={(e) => backChanger(e)}>Back</button>
                                    <button type="submit" className="btn btn-primary">Save and Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Trading;