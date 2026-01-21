import {
    Col,
    FormControl,
    FormGroup
} from "react-bootstrap";
import Select from "react-select";
import CountryArr from "../../Components/CountryArr";
import PhoneInput from "react-phone-input-2";

const Comanyinfo = ({ onSubmit, handleChanger, phoneChanger, data, countryChange, error, curState, fillLater, disableSaveBtn }) => {

    const countries = CountryArr();
    const options = countries;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() + 1).padStart(2, "0");

    const todayDt = `${year}-${month}-${day}`;


    return (
        <div
            className={
                curState == "company" ? "tab-pane fade show active" : "tab-pane fade"
            }
            id="tab-pane-2"
            role="tabpanel"
            aria-labelledby="tab-2"
            tabIndex="0"
        >
            <form onSubmit={onSubmit}>
                <input type="hidden" name="check_key" value="company_key"/>
                <div className="p-4 label-input">
                    <label className="mb-2">
                        <b>Base Currency</b>
                    </label>
                    <div className="d-flex">
                        <div className="form-group me-3">
                            <input
                                style={{marginRight: "4px"}}
                                type="radio"
                                id="usd"
                                name="base_currency"
                                value="USD"
                                onChange={(e) => handleChanger(e)}
                                checked
                            />
                            <label className="mr-3" htmlFor="usd">
                                USD
                            </label>
                        </div>
                        {/* <div className="form-group">
                            <input style={{ marginRight: '4px' }} type="radio" id="eur" name="base_currency" value="EUR" onChange={(e) => handleChanger(e)} checked={data.base_currency === 'EUR' ? true : false}/>
                            <label className="mr-3" htmlFor="eur">EUR</label>
                        </div> */}
                    </div>
                    <small className="text-danger">{error.base_currency}</small>
                    <hr/>
                    <h2 className="mb-2">
                        <b>Company Information</b>
                    </h2>
                    <div className="row form-details">
                        <h3>Corporate Details</h3>
                        <Col sm={12}>
                            <FormGroup>
                                <label htmlFor="business_name">Business Name*</label>
                                <FormControl
                                    type="text"
                                    name="business_name"
                                    value={data.business_name}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.business_name}</small>
                            </FormGroup>
                        </Col>
                        <Col sm={6} xl={6} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="registration_number">Registration Number*</label>
                                <FormControl
                                    type="text"
                                    name="registration_number"
                                    value={data.registration_number}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.registration_number}
                                </small>
                            </FormGroup>
                        </Col>
                        <Col sm={6} xl={6} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="date_of_incorporation">Date of Incorporation*</label>
                                <FormControl
                                    type="date"
                                    max={todayDt}
                                    name="date_of_incorporation"
                                    value={data.date_of_incorporation}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.date_of_incorporation}
                                </small>
                            </FormGroup>
                        </Col>

                        <Col sm={6} xl={6} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="country_of_incorporation">Country of Incorporation*</label>
                                <Select
                                    name="country_of_incorporation"
                                    defaultValue={data.country_of_incorporation}
                                    value={{
                                        value: data.country_of_incorporation,
                                        label: data.country_of_incorporation,
                                    }}
                                    onChange={countryChange}
                                    options={options}
                                    isClearable={true}
                                />
                                <small className="text-danger">
                                    {error.country_of_incorporation}
                                </small>
                            </FormGroup>
                        </Col>
                        <Col sm={6} xl={6} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="trading_name">Trading Name*</label>
                                <FormControl
                                    type="text"
                                    name="trading_name"
                                    value={data.trading_name}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.trading_name}</small>
                            </FormGroup>
                        </Col>

                        <Col sm={6} xl={6} xxl={8} className="mb-3">
                            <FormGroup>
                                <label htmlFor="nature_of_business">Nature of Business*</label>
                                <FormControl
                                    type="text"
                                    name="nature_of_business"
                                    value={data.nature_of_business}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.nature_of_business}
                                </small>
                            </FormGroup>
                        </Col>

                        <Col sm={6} xl={6} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="company_address_1">Registered Address Line 1*</label>
                                <FormControl
                                    type="text"
                                    name="company_address_1"
                                    value={data.company_address_1}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.company_address_1}</small>
                            </FormGroup>
                        </Col>

                        <Col sm={6} xl={6} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="company_address_2">Registered Address Line 2</label>
                                <FormControl
                                    type="text"
                                    name="company_address_2"
                                    value={data.company_address_2}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.company_address_2}</small>
                            </FormGroup>
                        </Col>

                        <Col sm={6} xl={6} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="company_address_3">Registered Address Line 3</label>
                                <FormControl
                                    type="text"
                                    name="company_address_3"
                                    value={data.company_address_3}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.company_address_3}</small>
                            </FormGroup>
                        </Col>

                        <Col sm={4} xl={4} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="town">Country*</label>
                                <Select
                                    name="town"
                                    defaultValue={{value: data.town, label: data.town}}
                                    value={{value: data.town, label: data.town}}
                                    onChange={countryChange}
                                    options={options}
                                    isClearable={true}
                                />
                                <small className="text-danger">{error.town}</small>
                            </FormGroup>
                        </Col>
                        <Col sm={4} xl={4} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="company_city">City*</label>
                                <FormControl
                                    type="text"
                                    name="company_city"
                                    value={data.company_city}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">{error.company_city}</small>
                            </FormGroup>
                        </Col>
                        <Col sm={4} xl={4} xxl={4} className="mb-3">
                            <FormGroup>
                                <label htmlFor="address_3">Post code*</label>
                                <FormControl
                                    type="text"
                                    name="company_postal_code"
                                    value={data.company_postal_code}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.company_postal_code}
                                </small>
                            </FormGroup>
                        </Col>

                        <Col sm={12} className="mb-3">
                            <FormGroup>
                                <label htmlFor="financial_services_regulator">
                                    Is your Company regulated by a Financial Services Regulator,
                                    such as Financial Services Commission, Mauritius or
                                    equivalent?
                                </label>
                                <div className="form-group mt-2 custom_radio">
                                    <input
                                        type="radio"
                                        id="usa-tax-yes"
                                        name="financial_services_regulator"
                                        value="Yes"
                                        onChange={(e) => handleChanger(e)}
                                        checked={
                                            data.financial_services_regulator === "Yes" ? true : false
                                        }
                                    />
                                    <label htmlFor="usa-tax-yes">Yes</label>
                                    <input
                                        type="radio"
                                        id="usa-tax-no"
                                        name="financial_services_regulator"
                                        value="No"
                                        onChange={(e) => handleChanger(e)}
                                        checked={
                                            data.financial_services_regulator === "No" ? true : false
                                        }
                                    />
                                    <label htmlFor="usa-tax-no">No</label>
                                </div>
                                <small className="text-danger">
                                    {error.financial_services_regulator}
                                </small>
                            </FormGroup>
                        </Col>
                        {data.financial_services_regulator === "Yes" ? (
                            <Col sm={12} className="mb-3">
                                <FormGroup>
                                    <label htmlFor="financial_services_regulator_name">
                                        If yes, Name of the Financial Services Regulator?
                                    </label>
                                    <FormControl
                                        type="text"
                                        name="financial_services_regulator_name"
                                        value={data.financial_services_regulator_name}
                                        onChange={(e) => handleChanger(e)}
                                    />
                                    <small className="text-danger">
                                        {error.financial_services_regulator_name}
                                    </small>
                                </FormGroup>
                            </Col>
                        ) : null}
                        <Col sm={6} xl={6} xxl={6} className="mb-3">
                            <FormGroup>
                                <label htmlFor="company_landline">Primary phone number* </label>
                                <PhoneInput
                                    inputProps={{
                                        name: "company_landline",
                                        required: true,
                                        min: "6",
                                    }}
                                    value={data.company_landline}
                                    className="mb-3"
                                    countryCodeEditable={false}
                                    enableSearch={true}
                                    onChange={(value, country, e, formattedValue) =>
                                        phoneChanger(
                                            value,
                                            country,
                                            "company_landline",
                                            formattedValue,
                                            null,
                                            "company"
                                        )
                                    }
                                />
                                <small className="text-danger">{error.company_landline}</small>
                            </FormGroup>
                        </Col>
                        <Col sm={6} xl={6} xxl={6} className="mb-3">
                            <FormGroup>
                                <label htmlFor="company_mobile_number">Secondary phone number</label>
                                <FormControl
                                    type="text"
                                    name="company_mobile_number"
                                    value={data.company_mobile_number}
                                    onChange={(e) => handleChanger(e)}
                                />
                                <small className="text-danger">
                                    {error.company_mobile_number}
                                </small>
                            </FormGroup>
                        </Col>

                        <Col sm={12} xl={12} xxl={12} className="mt-3">
                            <div className="buttons d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={(e) => fillLater(e)}
                                >
                                    Complete Later
                                </button>
                                <div>
                                    <button disabled={disableSaveBtn} type="submit" className="btn btn-primary">Save & Next </button>
                                </div>
                            </div>
                        </Col>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default Comanyinfo;
