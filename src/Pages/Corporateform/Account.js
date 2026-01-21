
import React from "react";
import { Col, FormControl, FormGroup, Row } from "react-bootstrap";
import Select from 'react-select';
import CountryArr from '../../Components/CountryArr';
import PhoneInput from "react-phone-input-2";

const Account = ({ onSubmit, handleChanger, data, phoneChanger, authChanger, error, curState, backChanger, fillLater }) => {
    
    const countries = CountryArr();
    const options = countries;
    const details_options = [...data.sole.map((data, i) => { return { value: `sole_${i}`, label: `Director ${i + 1}`, key: 'sole', index: i } }), ...data.ubo.map((data, i) => { return { value: `ubo_${i}`, label: `Shareholder ${i + 1}`, key: "ubo", index: i } })]

    const today = new Date();
    const year = today.getFullYear();
    const month = String((today.getMonth()+1)).padStart(2,'0');
    const day = String((today.getDate()+1)).padStart(2,'0');

    const todayDt = `${year}-${month}-${day}`;


    return(
        <div className={curState === 'auth' ? 'tab-pane fade show active' : 'tab-pane fade'} id="tab-pane-5" role="tabpanel" aria-labelledby="tab-5" tabIndex="0">
        <form onSubmit={onSubmit}>
        <input type="hidden" name='check_key' value='auth_key'/>
            <div className="p-4 label-input">
                    <h2 className="mb-3"><b>Details of Person(s) Authorised to operate the Account.</b></h2>
                    <div className="row form-details">
                    <h3 className="mt-3">Authorised Person 1</h3>
                        <div className="w-100 mb-3 form-group cd-label">
                            <Col sm={6} xl={6} xxl={7} className="mb-3">
                                <label className="mr-3" for="ap-2"><b>Set Detail as</b></label>
                                <Select
                                    name="sole_&_ubo_details"
                                    onChange={(e) => authChanger(null, '0', null, e)}
                                    options={details_options}
                                    isClearable={true}
                                />
                            </Col>
                        </div>
                    <Col sm={6} xl={6} xxl={8} className="mb-3">
                        <FormGroup>
                            <label>Full Name*</label>
                                <FormControl type="text" name="full_name" value={data.auth[0].full_name} onChange={(e) => authChanger('auth', '0', 'full_name', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.full_name']}</small>
                    </Col>
                    {/* <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Surname</label>
                            <FormControl type="text" name="surname" value={data.auth[0].surname} onChange={(e) => authChanger('auth','0', 'surname', e.target.value)}/>
                        </FormGroup>
                        <small className="text-danger">{error['auth.0.surname']}</small>
                    </Col> */}
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Date of Birth*</label>
                                <FormControl type="date" name="dob" value={data.auth[0].dob} onChange={(e) => authChanger('auth', '0', 'dob', e.target.value)} max={todayDt} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.dob']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Nationality*</label>
                                <FormControl type="text" name="nationality" value={data.auth[0].nationality} onChange={(e) => authChanger('auth', '0', 'nationality', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.nationality']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Passport/ID Number*</label>
                                <FormControl type="text" name="passport" value={data.auth[0].passport} onChange={(e) => authChanger('auth', '0', 'passport', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.passport']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Passport/ID Expiry Date*</label>
                                <FormControl type="date" name="passport_exp_date" value={data.auth[0].passport_exp_date} onChange={(e) => authChanger('auth', '0', 'passport_exp_date', e.target.value)} min={todayDt} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.passport_exp_date']}</small>
                    </Col>
                    <Col sm={12} className="mb-3">
                        <FormGroup>
                            <label>Are you a USA citizen, Green Card holder or USA resident for tax purpose?</label>
                            <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="ap-usa-tax-yes1" name="usa_citizen" value="Yes" onChange={(e) => authChanger('auth', '0', 'usa_citizen', e.target.value)} checked={data.auth[0].usa_citizen === 'Yes' ? true : false} />
                                <label for="ap-usa-tax-yes1">Yes</label>
                                    <input type="radio" id="ap-usa-tax-no1" name="usa_citizen" value="No" onChange={(e) => authChanger('auth', '0', 'usa_citizen', e.target.value)} checked={data.auth[0].usa_citizen === 'No' ? true : false} />
                                <label for="ap-usa-tax-no1">No</label>
                            </div>
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.usa_citizen']}</small>
                    </Col>
                    <Col sm={12} className="mb-3">
                        <FormGroup>
                            <label>Are you a Politically Exposed Person (PEP) or related to a PEP?</label>
                            <div className="form-group mt-2 custom_radio">
                                    <input type="radio" id="ap-pep-tax-yes1" name="pep_related" value="Yes" label="Yes" onChange={(e) => authChanger('auth', '0', 'pep_related', e.target.value)} checked={data.auth[0].pep_related === 'Yes' ? true : false} />
                                <label for="ap-pep-tax-yes1">Yes</label>
                                    <input type="radio" id="ap-pep-tax-no1" name="pep_related" value="No" label="No" onChange={(e) => authChanger('auth', '0', 'pep_related', e.target.value)} checked={data.auth[0].pep_related === 'No' ? true : false} />
                                <label for="ap-pep-tax-no1">No</label>
                            </div>
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.pep_related']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Registered Address Line 1*</label>
                                <FormControl type="text" name="address_1" value={data.auth[0].address_1} onChange={(e) => authChanger('auth', '0', 'address_1', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.address_1']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Registered Address Line 2</label>
                                <FormControl type="text" name="address_2" value={data.auth[0].address_2} onChange={(e) => authChanger('auth', '0', 'address_2', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.address_2']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Registered Address Line 3</label>
                                <FormControl type="text" name="address_3" value={data.auth[0].address_3} onChange={(e) => authChanger('auth', '0', 'address_3', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.address_3']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Country*</label>
                            <Select
                                name='town'
                                    defaultValue={data.auth[0].town}
                                    value={{ value: data.auth[0].town, label: data.auth[0].town }}
                                    onChange={(e) => authChanger('auth', '0', 'town', e.label)}
                                options={options}
                                isClearable={true}
                            />
                            
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.town']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>City*</label>
                                <FormControl type="text" name="city" value={data.auth[0].city} onChange={(e) => authChanger('auth', '0', 'city', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.city']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={4} className="mb-3">
                        <FormGroup>
                            <label>Post code*</label>
                                <FormControl type="text" name="postal_code" value={data.auth[0].postal_code} onChange={(e) => authChanger('auth', '0', 'postal_code', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.postal_code']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={6} className="mb-3">
                        <FormGroup>
                            <label>Country of Residence</label>
                            <Select
                                name='residence_country'
                                    defaultValue={data.auth[0].residence_country}
                                    value={{ value: data.auth[0].residence_country, label: data.auth[0].residence_country }}
                                    onChange={(e) => authChanger('auth', '0', 'residence_country', e.label)}
                                options={options}
                                isClearable={true}
                            />
                            
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.residence_country']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={6} className="mb-3">
                        <FormGroup>
                            <label>Email Address*</label>
                                <FormControl type="text" name="email" value={data.auth[0].email} onChange={(e) => authChanger('auth', '0', 'email', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.email']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={6} className="mb-3">
                        <FormGroup>
                            <label>Primary phone number</label>
                            <PhoneInput
                                inputProps={{
                                    name: 'landline',
                                    // required: true,
                                }}
                                    value={data.auth[0].landline}
                                className="mb-3"
                                countryCodeEditable={false}
                                enableSearch={true}
                                    onChange={(value, country, e, formattedValue) => phoneChanger(value, country, e, formattedValue, null, { type: 'auth', 'sub_type': '0', 'field': 'landline' })}
                            />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.landline']}</small>
                    </Col>
                    <Col sm={6} xl={6} xxl={6} className="mb-3">
                        <FormGroup>
                            <label>Secondary phone number </label>
                                <FormControl type="text" name="mobile_number" value={data.auth[0].mobile_number} onChange={(e) => authChanger('auth', '0', 'mobile_number', e.target.value)} />
                        </FormGroup>
                            <small className="text-danger">{error['auth.0.mobile_number']}</small>
                    </Col>
                </div>

                <hr />
                
                    <div className="form-details" >
                        <div className="form-group cd-label">
                            <input style={{ marginRight: '8px' }} id="ap-2" type="checkbox" name="auth1" value={data.auth1} onChange={(e) => handleChanger(e)} checked={data.auth1} />
                            <label className="mr-3" for="ap-2"><b>Authorised Person 2</b></label>
                    </div>
                        <div className={data.auth1 === true ? 'd-block' : 'd-none'} id="director2">
                            <h3 className="mt-3">Authorised Person 2</h3>
                            <div className="w-100 mb-3 form-group cd-label">
                                <Col sm={6} xl={6} xxl={7} className="mb-3">
                                    <label className="mr-3" for="ap-2"><b>Set Detail as</b></label>
                                    <Select
                                        name="setsole_&_ubo_details"
                                        onChange={(e) => authChanger(null, '1', null, e)}
                                        options={details_options}
                                        isClearable={true}
                                    />
                                </Col>
                            </div>
                        <div className="row">
                            <Col sm={6} xl={6} xxl={8} className="mb-3">
                                <FormGroup>
                                    <label>Full Name*</label>
                                        <FormControl type="text" name="full_name" value={data.auth[1].full_name} onChange={(e) => authChanger('auth', '1', 'full_name', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.full_name']}</small>
                            </Col>
                            {/* <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Surname</label>
                                    <FormControl type="text" name="surname" value={data.auth[1].surname} onChange={(e) => authChanger('auth','1', 'surname', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth.1.surname']}</small>
                            </Col> */}
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Date of Birth*</label>
                                        <FormControl type="date" name="dob" value={data.auth[1].dob} onChange={(e) => authChanger('auth', '1', 'dob', e.target.value)} max={todayDt} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.dob']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Nationality*</label>
                                        <FormControl type="text" name="nationality" value={data.auth[1].nationality} onChange={(e) => authChanger('auth', '1', 'nationality', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.nationality']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Passport/ID Number*</label>
                                        <FormControl type="text" name="passport" value={data.auth[1].passport} onChange={(e) => authChanger('auth', '1', 'passport', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.passport']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Passport/ID Expiry Date*</label>
                                        <FormControl type="date" name="passport_exp_date" value={data.auth[1].passport_exp_date} onChange={(e) => authChanger('auth', '1', 'passport_exp_date', e.target.value)} min={todayDt} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.passport_exp_date']}</small>
                            </Col>
                            <Col sm={12} className="mb-3">
                                <FormGroup>
                                    <label>Are you a USA citizen, Green Card holder or USA resident for tax purpose?</label>
                                    <div className="form-group mt-2 custom_radio">
                                            <input type="radio" id="ap-usa-tax-yes2" name="usa_citizen2" value="Yes" onChange={(e) => authChanger('auth', '1', 'usa_citizen', e.target.value)} checked={data.auth[1].usa_citizen === 'Yes' ? true : false} />
                                        <label for="ap-usa-tax-yes2">Yes</label>
                                            <input type="radio" id="ap-usa-tax-no2" name="usa_citizen2" value="No" onChange={(e) => authChanger('auth', '1', 'usa_citizen', e.target.value)} checked={data.auth[1].usa_citizen === 'No' ? true : false} />
                                        <label for="ap-usa-tax-no2">No</label>
                                    </div>
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.usa_citizen']}</small>
                            </Col>
                            <Col sm={12} className="mb-3">
                                <FormGroup>
                                    <label>Are you a Politically Exposed Person (PEP) or related to a PEP?</label>
                                    <div className="form-group mt-2 custom_radio">
                                            <input type="radio" id="ap-pep-tax-yes2" name="pep_related2" value="Yes" label="Yes" onChange={(e) => authChanger('auth', '1', 'pep_related', e.target.value)} checked={data.auth[1].pep_related === 'Yes' ? true : false} />
                                        <label for="ap-pep-tax-yes2">Yes</label>
                                            <input type="radio" id="ap-pep-tax-no2" name="pep_related2" value="No" label="No" onChange={(e) => authChanger('auth', '1', 'pep_related', e.target.value)} checked={data.auth[1].pep_related === 'No' ? true : false} />
                                        <label for="ap-pep-tax-no2">No</label>
                                    </div>
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.pep_related']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 1*</label>
                                        <FormControl type="text" name="address_1" value={data.auth[1].address_1} onChange={(e) => authChanger('auth', '1', 'address_1', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.address_1']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 2</label>
                                        <FormControl type="text" name="address_2" value={data.auth[1].address_2} onChange={(e) => authChanger('auth', '1', 'address_2', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.address_2']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 3</label>
                                        <FormControl type="text" name="address_3" value={data.auth[1].address_3} onChange={(e) => authChanger('auth', '1', 'address_3', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.address_3']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Country*</label>
                                    <Select
                                        name='town'
                                            defaultValue={data.auth[1].town}
                                            value={{ value: data.auth[1].town, label: data.auth[1].town }}
                                            onChange={(e) => authChanger('auth', '1', 'town', e.label)}
                                        options={options}
                                        isClearable={true}
                                    />
                                    
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.town']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>City*</label>
                                        <FormControl type="text" name="city" value={data.auth[1].city} onChange={(e) => authChanger('auth', '1', 'city', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.city']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Post code*</label>
                                        <FormControl type="text" name="postal_code" value={data.auth[1].postal_code} onChange={(e) => authChanger('auth', '1', 'postal_code', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.postal_code']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Country of Residence</label>
                                    <Select
                                        name='residence_country'
                                            defaultValue={data.auth[1].residence_country}
                                            value={{ value: data.auth[1].residence_country, label: data.auth[1].residence_country }}
                                            onChange={(e) => authChanger('auth', '1', 'residence_country', e.label)}
                                        options={options}
                                        isClearable={true}
                                    />
                                    
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.residence_country']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Email Address*</label>
                                        <FormControl type="text" name="email" value={data.auth[1].email} onChange={(e) => authChanger('auth', '1', 'email', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.email']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Primary phone number* </label>
                                    <PhoneInput
                                        inputProps={{
                                            name: 'landline',
                                            // required: true,
                                        }}
                                            value={data.auth[1].landline}
                                        className="mb-3"
                                        countryCodeEditable={false}
                                        enableSearch={true}
                                            onChange={(value, country, e, formattedValue) => phoneChanger(value, country, e, formattedValue, null, { type: 'auth', 'sub_type': '1', 'field': 'landline' })}
                                    />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.landline']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Secondary phone number </label>
                                        <FormControl type="text" name="mobile_number" value={data.auth[1].mobile_number} onChange={(e) => authChanger('auth', '1', 'mobile_number', e.target.value)} />
                                </FormGroup>
                                    <small className="text-danger">{error['auth.1.mobile_number']}</small>
                            </Col>
                        </div>
                    </div>
                </div>

                {/* <hr />

                <div className="form-details">
                    <div className="form-group cd-label">
                        <input style={{ marginRight: '8px'}} id="ap-3" type="checkbox" name="auth3" value={data[2]} onChange={(e)=>handleChanger(e)} checked={ data[2] }/>
                        <label className="mr-3" for="ap-3"><b>Authorised Person 3</b></label>
                    </div>
                    <div className={data[2]==true ? 'd-block':'d-none'} id="director3">
                        <h3 className="mt-3">Authorised Person 3</h3>
                        <div className="row">
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>First Name*</label>
                                    <FormControl type="text" name="first_name" value={data.auth[2].first_name} onChange={(e) => authChanger('auth','auth3', 'first_name', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].first_name']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Surname</label>
                                    <FormControl type="text" name="surname" value={data.auth[2].surname} onChange={(e) => authChanger('auth','auth3', 'surname', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].surname']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Date of Birth*</label>
                                    <FormControl type="date" name="dob" value={data.auth[2].dob} onChange={(e) => authChanger('auth','auth3', 'dob', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].dob']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Nationality*</label>
                                    <FormControl type="text" name="Director_1_nationality" />
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].nationality']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Passport/ID Number*</label>
                                    <FormControl type="text" name="passport" value={data.auth[2].passport} onChange={(e) => authChanger('auth','auth3', 'passport', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].passport']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Passport/ID Expiry Date*</label>
                                    <FormControl type="date" name="passport_exp_date" value={data.auth[2].passport_exp_date} onChange={(e) => authChanger('auth','auth3', 'passport_exp_date', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].passport_exp_date']}</small>
                            </Col>
                        
                            <Col sm={12} className="mb-3">
                                <FormGroup>
                                    <label>Are you a USA citizen, Green Card holder or USA resident for tax purpose?</label>
                                    <div className="form-group mt-2 custom_radio">
                                        <input type="radio" id="ap-usa-tax-yes3" name="usa_citizen3" value="Yes" onChange={(e) => authChanger('auth','auth3', 'usa_citizen', e.target.value)} checked={data.auth[2].usa_citizen === 'Yes' ? true : false}/>
                                        <label for="ap-usa-tax-yes3">Yes</label>
                                        <input type="radio" id="ap-usa-tax-no3" name="usa_citizen3" value="No" onChange={(e) => authChanger('auth','auth3', 'usa_citizen', e.target.value)} checked={data.auth[2].usa_citizen === 'No' ? true : false}/>
                                        <label for="ap-usa-tax-no3">No</label>
                                    </div>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].usa_citizen']}</small>
                            </Col>
                            <Col sm={12} className="mb-3">
                                <FormGroup>
                                    <label>Are you a Politically Exposed Person (PEP) or related to a PEP?</label>
                                    <div className="form-group mt-2 custom_radio">
                                        <input type="radio" id="ap-pep-tax-yes3" name="pep_related3" value="Yes" onChange={(e) => authChanger('auth','auth3', 'pep_related', e.target.value)} checked={data.auth[2].pep_related === 'Yes' ? true : false}/>
                                        <label for="ap-pep-tax-yes3">Yes</label>
                                        <input type="radio" id="ap-pep-tax-no3" name="pep_related3" value="No" onChange={(e) => authChanger('auth','auth3', 'pep_related', e.target.value)} checked={data.auth[2].pep_related === 'No' ? true : false}/>
                                        <label for="ap-pep-tax-no3">No</label>
                                    </div>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].pep_related']}</small>
                            </Col>                                              
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 1*</label>
                                    <FormControl type="text" name="address_1" value={data.auth[2].address_1} onChange={(e) => authChanger('auth','auth3', 'address_1', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].address_1']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 2</label>
                                    <FormControl type="text" name="address_2" value={data.auth[2].address_2} onChange={(e) => authChanger('auth','auth3', 'address_2', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].address_2']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 3</label>
                                    <FormControl type="text" name="address_3" value={data.auth[2].address_3} onChange={(e) => authChanger('auth','auth3', 'address_3', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].address_3']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Town*</label>
                                    <FormControl type="text" name="town" value={data.auth[2].town} onChange={(e) => authChanger('auth','auth3', 'town', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].town']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>City*</label>
                                    <FormControl type="text" name="city" value={data.auth[2].city} onChange={(e) => authChanger('auth','auth3', 'city', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].city']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Post code*</label>
                                    <FormControl type="text" name="postal_code" value={data.auth[2].postal_code} onChange={(e) => authChanger('auth','auth3', 'postal_code', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].postal_code']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Country of Residence</label>
                                    <FormControl type="text" name="residence_country" value={data.auth[2].residence_country} onChange={(e) => authChanger('auth','auth3', 'residence_country', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].residence_country']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Email Address*</label>
                                    <FormControl type="text" name="email" value={data.auth[2].email} onChange={(e) => authChanger('auth','auth3', 'email', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].email']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Primary phone number* <br /> <small>(incl country and area codes)</small></label>
                                    <FormControl type="text" name="landline" value={data.auth[2].landline} onChange={(e) => authChanger('auth','auth3', 'landline', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].landline']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Secondary phone number <br /> <small>(incl country and area codes)</small></label>
                                    <FormControl type="text" name="mobile_number" value={data.auth[2].mobile_number} onChange={(e) => authChanger('auth','auth3', 'mobile_number', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[2].mobile_number']}</small>
                            </Col>
                        </div>
                    </div>
                </div>

                <hr />

                <div className="form-details">
                    <div className="form-group cd-label">
                        <input style={{ marginRight: '8px'}} id="ap-4" type="checkbox" name="auth4" value={data[3]} onChange={(e)=>handleChanger(e)} checked={ data[3] }/>
                        <label className="mr-3" for="ap-4"><b>Authorised Person 4</b></label>
                    </div>
                    <div className={data[3]==true ? 'd-block':'d-none'} id="director4">
                        <h3 className="mt-3">Authorised Person 4</h3>
                        <div className="row">
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>First Name*</label>
                                    <FormControl type="text" name="first_name" value={data.auth[3].first_name} onChange={(e) => authChanger('auth','auth4', 'first_name', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].first_name']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Surname</label>
                                    <FormControl type="text" name="surname" value={data.auth[3].surname} onChange={(e) => authChanger('auth','auth4', 'surname', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].surname']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Date of Birth*</label>
                                    <FormControl type="date" name="dob" value={data.auth[3].dob} onChange={(e) => authChanger('auth','auth4', 'dob', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].dob']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Nationality*</label>
                                    <FormControl type="text" name="Director_1_nationality" />
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].nationality']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Passport/ID Number*</label>
                                    <FormControl type="text" name="passport" value={data.auth[3].passport} onChange={(e) => authChanger('auth','auth4', 'passport', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].passport']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Passport/ID Expiry Date*</label>
                                    <FormControl type="date" name="passport_exp_date" value={data.auth[3].passport_exp_date} onChange={(e) => authChanger('auth','auth4', 'passport_exp_date', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].passport_exp_date']}</small>
                            </Col>
                    
                            <Col sm={12} className="mb-3">
                                <FormGroup>
                                    <label>Are you a USA citizen, Green Card holder or USA resident for tax purpose?</label>
                                    <div className="form-group mt-2 custom_radio">
                                        <input type="radio" id="ap-usa-tax-yes4" name="usa_citizen4" value="Yes" onChange={(e) => authChanger('auth','auth4', 'usa_citizen', e.target.value)} checked={data.auth[3].usa_citizen === 'Yes' ? true : false}/>
                                        <label for="ap-usa-tax-yes4">Yes</label>
                                        <input type="radio" id="ap-usa-tax-no4" name="usa_citizen4" value="No" onChange={(e) => authChanger('auth','auth4', 'usa_citizen', e.target.value)} checked={data.auth[3].usa_citizen === 'No' ? true : false}/>
                                        <label for="ap-usa-tax-no4">No</label>
                                    </div>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].usa_citizen']}</small>
                            </Col>
                            <Col sm={12} className="mb-3">
                                <FormGroup>
                                    <label>Are you a Politically Exposed Person (PEP) or related to a PEP?</label>
                                    <div className="form-group mt-2 custom_radio">
                                        <input type="radio" id="ap-pep-tax-yes4" name="pep_related4" value="Yes" onChange={(e) => authChanger('auth','auth4', 'pep_related', e.target.value)} checked={data.auth[3].pep_related === 'Yes' ? true : false}/>
                                        <label for="ap-pep-tax-yes4">Yes</label>
                                        <input type="radio" id="ap-pep-tax-no4" name="pep_related4" value="No" onChange={(e) => authChanger('auth','auth4', 'pep_related', e.target.value)} checked={data.auth[3].pep_related === 'No' ? true : false}/>
                                        <label for="ap-pep-tax-no4">No</label>
                                    </div>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].pep_related']}</small>
                            </Col>
                        
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 1*</label>
                                    <FormControl type="text" name="address_1" value={data.auth[3].address_1} onChange={(e) => authChanger('auth','auth4', 'address_1', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].address_1']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 2</label>
                                    <FormControl type="text" name="address_2" value={data.auth[3].address_2} onChange={(e) => authChanger('auth','auth4', 'address_2', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].address_2']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Registered Address Line 3</label>
                                    <FormControl type="text" name="address_3" value={data.auth[3].address_3} onChange={(e) => authChanger('auth','auth4', 'address_3', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].address_3']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Town*</label>
                                    <FormControl type="text" name="town" value={data.auth[3].town} onChange={(e) => authChanger('auth','auth4', 'town', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].town']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>City*</label>
                                    <FormControl type="text" name="city" value={data.auth[3].city} onChange={(e) => authChanger('auth','auth4', 'city', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].city']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={4} className="mb-3">
                                <FormGroup>
                                    <label>Post code*</label>
                                    <FormControl type="text" name="postal_code" value={data.auth[3].postal_code} onChange={(e) => authChanger('auth','auth4', 'postal_code', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].postal_code']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Country of Residence</label>
                                    <FormControl type="text" name="residence_country" value={data.auth[3].residence_country} onChange={(e) => authChanger('auth','auth4', 'residence_country', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].residence_country']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Email Address*</label>
                                    <FormControl type="text" name="email" value={data.auth[3].email} onChange={(e) => authChanger('auth','auth4', 'email', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].email']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Primary phone number* <br /> <small>(incl country and area codes)</small></label>
                                    <FormControl type="text" name="landline" value={data.auth[3].landline} onChange={(e) => authChanger('auth','auth4', 'landline', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['auth[3].landline']}</small>
                            </Col>
                            <Col sm={6} xl={6} xxl={6} className="mb-3">
                                <FormGroup>
                                    <label>Secondary phone number <br /> <small>(incl country and area codes)</small></label>
                                    <FormControl type="text" name="mobile_number" value={data.auth[3].mobile_number} onChange={(e) => authChanger('sole','sole4', 'mobile_number', e.target.value)}/>
                                </FormGroup>
                                <small className="text-danger">{error['sole.sole4.mobile_number']}</small>
                            </Col>
                        </div>
                    </div>
                </div> */}

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
export default Account;