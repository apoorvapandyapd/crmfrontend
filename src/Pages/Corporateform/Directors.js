//Naidish Change
import React from "react";
import { Col, FormControl, FormGroup, Row, Button } from "react-bootstrap";
import Select from 'react-select';
import CountryArr from '../../Components/CountryArr';
import PhoneInput from "react-phone-input-2";
import { Link } from 'react-router-dom';

const Directors = ({ onSubmit, directorData, phoneChanger, countryChange, onChangeDirectorData, addDirectorForm, removeDirectorForm, error, curState, backChanger, fillLater }) => {

    const countries = CountryArr();
    const options = countries;

    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth()+1)).padStart(2,'0');
    const day = String((today.getDate()+1)).padStart(2,'0');

    const todayDt = `${year}-${month}-${day}`;



    return (
        <div className={curState === 'sole' ? 'tab-pane fade show active' : 'tab-pane fade'} id="tab-pane-3" role="tabpanel" aria-labelledby="tab-3" tabIndex="0">
            <form onSubmit={onSubmit}>
                <input type="hidden" name='check_key' value='sole_key' />
                <div className="p-4 label-input">
                    <h2 className="mb-2"><b>Details of Directors</b></h2>
                    {directorData.map((director, i) => {
                        return (
                            <><div className="row form-details">
                                <div className="d-flex align-items-center justify-content-between">
                                    <h3 className="mt-3">Sole Director/Director {i + 1}</h3>
                                    {
                                        i === 0 ? "" : <Link className="red" style={{ textDecoration: 'underline' }} onClick={() => removeDirectorForm(i)}>Remove Block</Link>
                                    }
                                </div>
                                <Col sm={6} xl={6} xxl={8} className="mb-3">
                                    <FormGroup>
                                        <label>Full Name*</label>
                                        <FormControl type="text" name="full_name" value={director.full_name} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.full_name`]}</small>
                                </Col>


                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Date of Birth*</label>
                                        <FormControl type="date"  max={todayDt} name="dob" value={director.dob} onChange={(e) => onChangeDirectorData(e, i)}/>
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.dob`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Nationality*</label>
                                        <FormControl type="text" name="nationality" value={director.nationality} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.nationality`]}</small>
                                </Col>


                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Passport/ID Number*</label>
                                        <FormControl type="text" name="passport" value={director.passport} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.passport`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Passport/ID Expiry Date*</label>
                                        <FormControl type="date" name="passport_exp_date" value={director.passport_exp_date} onChange={(e) => onChangeDirectorData(e, i)} min={todayDt}/>
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.passport_exp_date`]}</small>
                                </Col>


                                <Col sm={12} className="mb-3">
                                    <form>
                                        <FormGroup>
                                            <label>Are you a USA citizen, Green Card holder or USA resident for tax purpose?</label>
                                            <div className="form-group mt-2 custom_radio">

                                                <input type="radio" id={`usa-tax-yes${i}`} name='usa_citizen' value="Yes" onChange={(e) => { onChangeDirectorData(e, i) }} checked={director.usa_citizen === 'Yes'} />
                                                <label for={`usa-tax-yes${i}`}>Yes</label>
                                                <input type="radio" id={`usa-tax-no${i}`} name='usa_citizen' value="No" onChange={(e) => onChangeDirectorData(e, i)} checked={director.usa_citizen === 'No'} />
                                                <label for={`usa-tax-no${i}`}>No</label>
                                            </div>
                                        </FormGroup>
                                    </form>
                                    <small className="text-danger">{error[`sole.${i}.usa_citizen`]}</small>
                                </Col>

                                <Col sm={12} className="mb-3">

                                    <FormGroup>
                                        <form>
                                            <label>Are you a Politically Exposed Person (PEP) or related to a PEP?</label>
                                            <div className="form-group mt-2 custom_radio">
                                                <input type="radio" id={`pep-tax-yes${i}`} name='pep_related' value="Yes" onChange={(e) => onChangeDirectorData(e, i)} checked={director.pep_related === 'Yes'} />
                                                <label for={`pep-tax-yes${i}`}>Yes</label>
                                                <input type="radio" id={`pep-tax-no${i}`} name='pep_related' value="No" onChange={(e) => onChangeDirectorData(e, i)} checked={director.pep_related === 'No'} />
                                                <label for={`pep-tax-no${i}`}>No</label>
                                            </div>
                                        </form>
                                    </FormGroup>

                                    <small className="text-danger">{error[`sole.${i}.pep_related`]}</small>
                                </Col>

                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Registered Address Line 1*</label>
                                        <FormControl type="text" name="address_1" value={director.address_1} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.address_1`]}</small>
                                </Col>

                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Registered Address Line 2</label>
                                        <FormControl type="text" name="address_2" value={director.address_2} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.address_2`]}</small>
                                </Col>

                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Registered Address Line 3</label>
                                        <FormControl type="text" name="address_3" value={director.address_3} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.address_3`]}</small>
                                </Col>

                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Country*</label>
                                        <Select
                                            name='town'
                                            defaultValue={{ value: director.town, label: director.town }}
                                            value={{ value: director.town, label: director.town }}
                                            onChange={(e) => countryChange(e, i,'town')}
                                            options={options}
                                            isClearable={true}
                                        />
                                        
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.town`]}</small>
                                </Col>
                                
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>City*</label>
                                        <FormControl type="text" name="city" value={director.city} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.city`]}</small>

                                </Col>
                                <Col sm={6} xl={6} xxl={4} className="mb-3">
                                    <FormGroup>
                                        <label>Post code*</label>
                                        <FormControl type="text" name="postal_code" value={director.postal_code} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.postal_code`]}</small>
                                </Col>

                                <Col sm={6} xl={6} xxl={6} className="mb-3">
                                    <FormGroup>
                                        <label>Country of Residence</label>
                                        <Select
                                            name='residence_country'
                                            defaultValue={director && director.residence_country}
                                            value={director && { value: director.residence_country, label: director.residence_country }}
                                            onChange={(e) => countryChange(e, i,'residence_country')}
                                            options={options}
                                            isClearable={true}
                                        />
                                        
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.residence_country`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={6} className="mb-3">
                                    <FormGroup>
                                        <label>Email Address*</label>
                                        <FormControl type="text" name="email" value={director.email} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.email`]}</small>
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
                                            value={director.landline}
                                            className="mb-3"
                                            countryCodeEditable={false}
                                            enableSearch={true}
                                            onChange={(value, country, e, formattedValue) => phoneChanger(value, country, 'landline', formattedValue, i, 'sole')}
                                        />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.landline`]}</small>
                                </Col>
                                <Col sm={6} xl={6} xxl={6} className="mb-3">
                                    <FormGroup>
                                        <label>Secondary phone number</label>
                                        <FormControl type="text" name="mobile_number" value={director.mobile_number} onChange={(e) => onChangeDirectorData(e, i)} />
                                    </FormGroup>
                                    <small className="text-danger">{error[`sole.${i}.mobile_number`]}</small>
                                </Col>


                                {/* {
                                    i == 0 ? "" : <Button className="w-25 mb-3" onClick={() => removeDirectorForm(i)}>Remove</Button>
                                } */}
                            </div><hr/></>
                            )
                    }
                    )}


                    <Button onClick={addDirectorForm}>Add New</Button>

                    <Row className="form-details">
                        <Col sm={12} className="mt-3">
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
export default Directors;