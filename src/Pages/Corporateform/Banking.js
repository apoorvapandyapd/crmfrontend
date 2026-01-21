const Banking = ({
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
                curState === "banking" ? "tab-pane fade show active" : "tab-pane fade"
            }
            id="tab-pane-6"
            role="tabpanel"
            aria-labelledby="tab-6"
            tabIndex="0"
        >
            <form onSubmit={onSubmit}>
                <input type="hidden" name="check_key" value="banking_key"/>
                <div className="p-4 label-input">
                    <h2 className="mb-3">
                        <b>Banking Details</b>
                    </h2>
                    <div className="row form-details">
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="bank_holder_name">Name of Account Holder*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="bank_holder_name"
                                    value={data.bank_holder_name}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.bank_holder_name}</small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="bank_name">Bank Name*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="bank_name"
                                    value={data.bank_name}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.bank_name}</small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="bank_address">Bank Address*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="bank_address"
                                    value={data.bank_address}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.bank_address}</small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="bank_account_number">Account Number*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="bank_account_number"
                                    value={data.bank_account_number}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.bank_account_number}
                                </small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="bank_iban_number">IBAN Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="bank_iban_number"
                                    value={data.bank_iban_number}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.bank_iban_number}</small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="bank_swift_code">SWIFT or BIC Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="bank_swift_code"
                                    value={data.bank_swift_code}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.bank_swift_code}</small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="bank_sort_code">Sort Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="bank_sort_code"
                                    value={data.bank_sort_code}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.bank_sort_code}</small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="corresponding_bank_name">Corresponding Bank Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="corresponding_bank_name"
                                    value={data.corresponding_bank_name}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.corresponding_bank_name}
                                </small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="corresponding_bank_number">Corresponding Bank Account Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="corresponding_bank_number"
                                    value={data.corresponding_bank_number}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.corresponding_bank_number}
                                </small>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-6 col-xxl-6 mb-3">
                            <div className="form-group">
                                <label htmlFor="corresponding_bank_swift_code">Corresponding Bank Swift Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    name="corresponding_bank_swift_code"
                                    value={data.corresponding_bank_swift_code}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.corresponding_bank_swift_code}
                                </small>
                            </div>
                        </div>
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
                </div>
            </form>
        </div>
    );
};
export default Banking;
