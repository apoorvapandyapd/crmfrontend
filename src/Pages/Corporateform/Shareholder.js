//Naidish Change
import React from "react";
import { Col, FormControl, FormGroup, Row, Button } from "react-bootstrap";
import Select from 'react-select';
import CountryArr from '../../Components/CountryArr';
import PhoneInput from "react-phone-input-2";
import { Link } from 'react-router-dom';

const Shareholder = ({ data, onSubmit, shareholderData, phoneChanger, countryChange, onChangeShareholderData, addShareholderForm, removeShareholderForm, error, curState, backChanger, fillLater }) => {

    const countries = CountryArr();
    const options = countries;
    const director_details = data.sole.map((data, i) => {
        return { value: i, label: `Director ${i + 1}` }
    }); 
    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth()+1)).padStart(2,'0');
    const day = String((today.getDate()+1)).padStart(2,'0');

    const todayDt = `${year}-${month}-${day}`;



    return (
        <div className={curState === 'ubo' ? 'tab-pane fade show active' : 'tab-pane fade'} id="tab-pane-4" role="tabpanel" aria-labelledby="tab-4" tabIndex="0">
            <form onSubmit={onSubmit}>
                <input type="hidden" name='check_key' value='ubo_key' />
                <div className="p-4 label-input">
                    <h2 className="mb-3"><b>Details of Shareholder</b></h2>
                    {shareholderData.map((shareholder, i) => {
                        return (
                            <><div className="row form-details">
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    <h3 className="mt-3">UBO/Shareholder {i + 1}</h3>
                                    {
                                        i === 0 ? "" : <Link className="red mb-2 mb-sm-0" style={{ textDecoration: 'underline' }} onClick={() => removeShareholderForm(i)}>Remove Block</Link>
                                    }

                                    <div className="w-100 mb-3 form-group cd-label">
                                        <Col sm={6} xl={6} xxl={7} className="mb-3">
                                            <label className="mr-3" for="ap-2"><b>Set Detail as</b></label>
                                            <Select
                                                name="setdirector_details"
                                                onChange={(e) => onChangeShareholderData(e, i, 'setdirector_details')}
                                                options={director_details}
                                                isClearable={true}
                                            />
                                        </Col>
                                    </div>



                                </div>
                                <Col sm={6} xl={6} xxl={8} className="mb-3">
                                    <FormGroup>
                                        <label>Full Name*</label>
                                        <FormControl type="text" name="full_name" value={shareholder.full_name} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.full_name`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Date of Birth*</label>
                                        <FormControl type="date" name="dob" value={shareholder.dob} onChange={(e) => onChangeShareholderData(e, i)} max={todayDt}/>
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.dob`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Nationality*</label>
                                        <FormControl type="text" name="nationality" value={shareholder.nationality} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.nationality`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Passport/ID Number*</label>
                                        <FormControl type="text" name="passport" value={shareholder.passport} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.passport`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Passport/ID Expiry Date*</label>
                                        <FormControl type="date" name="passport_exp_date" value={shareholder.passport_exp_date} onChange={(e) => onChangeShareholderData(e, i)} min={todayDt}/>
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.passport_exp_date`]}</small>
                                </Col>
                                <Col sm={12} className="mb-3">
                                    <form>
                                        <FormGroup>
                                            <label>Are you a USA citizen, Green Card holder or USA resident for tax purpose?</label>
                                            <div className="form-group mt-2 custom_radio">
                                                <input type="radio" id={`sh-usa-tax-yes${i}`} name="usa_citizen" value="Yes" onChange={(e) => onChangeShareholderData(e, i)} checked={shareholder.usa_citizen === 'Yes' ? true : false} />
                                                <label for={`sh-usa-tax-yes${i}`}>Yes</label>
                                                <input type="radio" id={`sh-usa-tax-no${i}`} name="usa_citizen" value="No" onChange={(e) => onChangeShareholderData(e, i)} checked={shareholder.usa_citizen === 'No' ? true : false} />
                                                <label for={`sh-usa-tax-no${i}`}>No</label>
                                            </div>
                                        </FormGroup>
                                    </form>
                                    <small className="text-danger">{error[`ubo.${i}.usa_citizen`]}</small>
                                </Col>
                                <Col sm={12} className="mb-3">
                                    <form>
                                        <FormGroup>
                                            <label>Are you a Politically Exposed Person (PEP) or related to a PEP?</label>
                                            <div className="form-group mt-2 custom_radio">
                                                <input type="radio" id={`sh-pep-tax-yes${i}`} name="pep_related" value="Yes" onChange={(e) => onChangeShareholderData(e, i)} checked={shareholder.pep_related === 'Yes' ? true : false} />
                                                <label for={`sh-pep-tax-yes${i}`}>Yes</label>
                                                <input type="radio" id={`sh-pep-tax-no${i}`} name="pep_related" value="No" onChange={(e) => onChangeShareholderData(e, i)} checked={shareholder.pep_related === 'No' ? true : false} />
                                                <label for={`sh-pep-tax-no${i}`}>No</label>
                                            </div>
                                        </FormGroup>
                                    </form>
                                    <small className="text-danger">{error[`ubo.${i}.pep_related`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Registered Address Line 1*</label>
                                        <FormControl type="text" name="address_1" value={shareholder.address_1} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.address_1`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Registered Address Line 2</label>
                                        <FormControl type="text" name="address_2" value={shareholder.address_2} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.address_2`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Registered Address Line 3</label>
                                        <FormControl type="text" name="address_3" value={shareholder.address_3} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.address_3`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Country*</label>
                                        <Select
                                            name='town'
                                            defaultValue={shareholder && shareholder.town}
                                            value={shareholder && { value: shareholder.town, label: shareholder.town }}
                                            onChange={(e) => countryChange(e, i,'town')}
                                            options={options}
                                            isClearable={true}
                                        />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.town`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>City*</label>
                                        <FormControl type="text" name="city" value={shareholder.city} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.city`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Post code*</label>
                                        <FormControl type="text" name="postal_code" value={shareholder.postal_code} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.postal_code`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={6} className="mb-3">
                                    <FormGroup>
                                        <label>Country of Residence</label>
                                        <Select
                                            name='residence_country'
                                            defaultValue={shareholder && shareholder.residence_country}
                                            value={shareholder && { value: shareholder.residence_country, label: shareholder.residence_country }}
                                            onChange={(e) => countryChange(e, i,'residence_country')}
                                            options={options}
                                            isClearable={true}
                                        />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.residence_country`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={6} className="mb-3">
                                    <FormGroup>
                                        <label>Email Address*</label>
                                        <FormControl type="text" name="email" value={shareholder.email} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.email`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={6} className="mb-3">
                                    <FormGroup>
                                        <label>Primary phone number* </label>
                                        <PhoneInput
                                            inputProps={{
                                                name: 'landline',
                                                required: true,
                                                min: "6",
                                            }}
                                            value={shareholder.landline}
                                            className="mb-3"
                                            countryCodeEditable={false}
                                            enableSearch={true}
                                            onChange={(value, country, e, formattedValue) => phoneChanger(value, country, 'landline', formattedValue, i, 'ubo')}
                                        />
                                        {/* <FormControl type="text" name="landline" value={shareholder.landline} onChange={(e) => onChangeShareholderData(e, i)} /> */}
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.landline`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={6} className="mb-3">
                                    <FormGroup>
                                        <label>Secondary phone number</label>
                                        <FormControl type="text" name="mobile_number" value={shareholder.mobile_number} onChange={(e) => onChangeShareholderData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`ubo.${i}.mobile_number`]}</small>
                                </Col>
                                {/* {
                                    i == 0 ? "" : <Button className="w-25 mb-3" onClick={() => removeShareholderForm(i)}>Remove</Button>
                                } */}
                            </div><hr/></>
                        )
                    }
                    )}

                    <Button onClick={addShareholderForm}>Add New</Button>

                    <Row className="form-details">
                        <Col sm={12} xl={12} xxl={12} className="mt-3">
                            <div className="buttons d-flex flex-wrap justify-content-between">
                                <button type="button" className="btn btn-light complete-later-btn" onClick={(e) => fillLater(e)}>Complete Later</button>
                                <div>
                                    <button type="button" className="btn btn-light" onClick={(e) => backChanger(e)}>Back</button>
                                    <button type="submit" className="btn btn-primary">Save and Next</button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </form>
        </div>
    );
}
export default Shareholder;