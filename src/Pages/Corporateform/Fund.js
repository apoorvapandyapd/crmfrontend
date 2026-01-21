const Fund = ({
                  onSubmit,
                  handleChanger,
                  data,
                  error,
                  curState,
                  backChanger,
                  fillLater,
              }) => {
    return (
        <div
            className={
                curState === "fund" ? "tab-pane fade show active" : "tab-pane fade"
            }
            id="tab-pane-9"
            role="tabpanel"
            aria-labelledby="tab-9"
            tabIndex="0"
        >
            <div className="p-4 label-input">
                <form onSubmit={onSubmit}>
                    <input type="hidden" name="check_key" value="fund_key"/>

                    <h2 className="mb-3">
                        <b>Source of funds* (Please tick the most relevant answer)</b>
                    </h2>
                    <div className="row form-details">
                        <div className="col-12 mb-3">
                            <div className="form-group cd-label">
                                <input
                                    style={{marginRight: "8px"}}
                                    type="checkbox"
                                    id="saving-salary"
                                    name="commercial_activities"
                                    onChange={handleChanger}
                                    checked={
                                        data.commercial_activities == "1" ||
                                        data.commercial_activities == "true"
                                    }
                                />
                                <label className="mr-3" htmlFor="saving-salary">
                                    <b>Commercial Activities</b>
                                </label>
                                <small className="text-danger">
                                    {error.commercial_activites}
                                </small>
                            </div>
                        </div>
                        <div className="col-12 mb-3">
                            <div className="form-group cd-label">
                                <input
                                    style={{marginRight: "8px"}}
                                    type="checkbox"
                                    id="p-entrepreneur"
                                    name="third_party_funds"
                                    onChange={handleChanger}
                                    checked={
                                        data.third_party_funds == "1" ||
                                        data.third_party_funds == "true"
                                    }
                                />
                                <label className="mr-3" htmlFor="p-entrepreneur">
                                    <b>Third Party funds</b>
                                </label>
                                <small className="text-danger">{error.third_party_funds}</small>
                            </div>
                        </div>
                        <div className="col-12 mb-3">
                            <div className="form-group cd-label">
                                <input
                                    style={{marginRight: "8px"}}
                                    type="checkbox"
                                    id="inheritance"
                                    name="another_brokerage"
                                    onChange={handleChanger}
                                    checked={
                                        data.another_brokerage == "1" ||
                                        data.another_brokerage == "true"
                                    }
                                />
                                <label className="mr-3" htmlFor="inheritance">
                                    <b>Investment held at another brokerage firm</b>
                                </label>
                                <small className="text-danger">{error.another_brokerage}</small>
                            </div>
                        </div>
                        <div className="col-12 mb-3">
                            <div className="form-group cd-label">
                                <input
                                    style={{marginRight: "8px"}}
                                    type="checkbox"
                                    id="investments"
                                    name="loan"
                                    onChange={handleChanger}
                                    checked={data.loan == "1" || data.loan == "true"}
                                />
                                <label className="mr-3" htmlFor="investments">
                                    <b>Loan/credit</b>
                                </label>
                                <small className="text-danger">{error.loan}</small>
                            </div>
                        </div>
                        <div className="col-12 mb-3">
                            <div className="form-group">
                                <label htmlFor="others">Others (please specify)</label>
                                <div className="form-group mt-2 custom_radio">
                                    <input
                                        type="radio"
                                        id="others-yes"
                                        name="others"
                                        value="Yes"
                                        onChange={(e) => handleChanger(e)}
                                        checked={data.others === "Yes" ? true : false}
                                    />
                                    <label htmlFor="others-yes">Yes</label>
                                    <input
                                        type="radio"
                                        id="others-no"
                                        name="others"
                                        value="No"
                                        onChange={(e) => handleChanger(e)}
                                        checked={data.others === "No" ? true : false}
                                    />
                                    <label htmlFor="others-no">No</label>
                                </div>
                                <small className="text-danger">{error.others}</small>
                            </div>
                        </div>
                        {data.others === "Yes" ? (
                            <div className="col-12 mb-3">
                                <div className="form-group">
                                    <label htmlFor="source_details">If Yes, Please provide details</label>
                                    <textarea
                                        className="form-control"
                                        name="source_details"
                                        id="source_details"
                                        cols="30"
                                        rows="5"
                                        placeholder="Enter your details"
                                        value={data.source_details}
                                        onChange={(e) => handleChanger(e)}
                                    ></textarea>
                                    <small className="text-danger">{error.source_details}</small>
                                </div>
                            </div>
                        ) : null}
                        <div className="col-12 mt-3">
                            <div className="buttons d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={(e) => fillLater(e)}
                                >
                                    Complete Later
                                </button>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={(e) => backChanger(e)}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save & Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default Fund;
