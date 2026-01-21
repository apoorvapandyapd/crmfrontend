

const Disclosure = ({onSubmit, handleChanger, data, error, curState, backChanger,fillLater}) => {
  if(data.government_actions === 'No')
  {
      
  }
  return(
      <div className={curState === 'disclosure' ? 'tab-pane fade show active' : 'tab-pane fade'} id="tab-pane-10" role="tabpanel" aria-labelledby="tab-10" tabIndex="0">
          <div className="p-4 label-input general-disclosure">
              <form onSubmit={onSubmit}>
              <input type="hidden" name="check_key" value="disclosure_key" />

                  <h2 className="mb-3"><b>General Disclosure</b></h2>
                  <h4>This question relates to the Company and its officers (Directors, UBO’s, and Authorised Signatories) of the Company. If a question does not apply, you should leave it blank.</h4>
                  <div className="row form-details">
                      <div className="col-12 mb-3">
                          <div className="form-group">
                              <label>Is there any outstanding or upcoming civil or criminal litigation against you or any company of which you are an officer; or are there any current proceedings issued by you?</label>
                              <div className="form-group mt-2 custom_radio">
                                  <input type="radio" id="general-disclosure-1-yes" name="legal_actions"  value='Yes' onChange={(e) => handleChanger(e)} checked = { data.legal_actions === 'Yes' ? true : false }/>
                                  <label for="general-disclosure-1-yes">Yes</label>
                                  <input type="radio" id="general-disclosure-1-no" name="legal_actions"  value='No' onChange={(e) => handleChanger(e)} checked = { data.legal_actions === 'No' ? true : false }/>
                                  <label for="general-disclosure-1-no">No</label>
                              </div>
                              <small className="text-danger">{error.legal_actions}</small>
                          </div>
                          {
                              data.legal_actions=='Yes' && 
                              <div className="form-group">
                                  <label>If Yes, Please provide details</label>
                                  <textarea className="form-control" name="legal_status_details" id="legal_status_details" cols="30" rows="5" placeholder="Enter your details" value={data.legal_status_details} onChange={(e) => handleChanger(e)}></textarea>
                                  <small className="text-danger">{error.legal_status_details}</small>
                              </div>
                          }
                      </div>
                      <div className="col-12 mb-3">
                          <div className="form-group">
                              <label>Have you, in any capacity, ever had a formal warning or been censured, disciplined, or publicly criticized by any Court of Law or by any officially appointed enquiry, whether in your home country or elsewhere or by any professional or regulatory body or any trade association to which you have? belonged or do belong, or been the subject of a regulatory order or direction?</label>
                              <div className="form-group mt-2 custom_radio">
                                  <input type="radio" id="general-disclosure-2-yes" name="past_sanctions"  value='Yes' onChange={(e) => handleChanger(e)} checked = { data.past_sanctions === 'Yes' ? true : false }/>
                                  <label for="general-disclosure-2-yes">Yes</label>
                                  <input type="radio" id="general-disclosure-2-no" name="past_sanctions"  value='No' onChange={(e) => handleChanger(e)} checked = { data.past_sanctions === 'No' ? true : false }/>
                                  <label for="general-disclosure-2-no">No</label>
                              </div>
                              <small className="text-danger">{error.past_sanctions}</small>
                          </div>
                          {
                              data.past_sanctions=='Yes' && 
                              <div className="form-group">
                                  <label>If Yes, Please provide details</label>
                                  <textarea className="form-control" name="past_sanctions_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.past_sanctions_details} onChange={(e) => handleChanger(e)}></textarea>
                                  <small className="text-danger">{error.past_sanctions_details}</small>
                              </div>
                          }
                      </div>
                      <div className="col-12 mb-3">
                          <div className="form-group">
                              <label>Have you at any time been convicted of any criminal offence by any court? (Road Traffic offences should not be listed).</label>
                              <div className="form-group mt-2 custom_radio">
                                  <input type="radio" id="general-disclosure-3-yes" name="criminal_conviction"  value='Yes' onChange={(e) => handleChanger(e)} checked = { data.criminal_conviction === 'Yes' ? true : false }/>
                                  <label for="general-disclosure-3-yes">Yes</label>
                                  <input type="radio" id="general-disclosure-3-no" name="criminal_conviction"  value='No' onChange={(e) => handleChanger(e)} checked = { data.criminal_conviction === 'No' ? true : false }/>
                                  <label for="general-disclosure-3-no">No</label>
                              </div>
                              <small className="text-danger">{error.criminal_conviction}</small>
                          </div>
                          {
                              data.criminal_conviction=='Yes' && 
                              <div className="form-group">
                                  <label>If Yes, Please provide details</label>
                                  <textarea className="form-control" name="criminal_conviction_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.criminal_conviction_details} onChange={(e) => handleChanger(e)}></textarea>
                                  <small className="text-danger">{error.criminal_conviction_details}</small>
                              </div>
                          }
                      </div>
                      <div className="col-12 mb-3">
                          <div className="form-group">
                              <label>Have you ever been subject to any penalty or enforcement action by any other government agency (e.g., Tax Authority, Financial Intelligence Unit, etc.)?</label>
                              <div className="form-group mt-2 custom_radio">
                                  <input type="radio" id="general-disclosure-4-yes" name="government_actions"  value='Yes' onChange={(e) => handleChanger(e)} checked = { data.government_actions === 'Yes' ? true : false }/>
                                  <label for="general-disclosure-4-yes">Yes</label>
                                  <input type="radio" id="general-disclosure-4-no" name="government_actions"  value='No' onChange={(e) => handleChanger(e)} checked = { data.government_actions === 'No' ? true : false }/>
                                  <label for="general-disclosure-4-no">No</label>
                              </div>
                              <small className="text-danger">{error.government_actions}</small>
                          </div>
                          {
                              data.government_actions=='Yes' && 
                              <div className="form-group">
                                  <label>If Yes, Please provide details</label>
                                  <textarea className="form-control" name="government_actions_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.government_actions_details} onChange={(e) => handleChanger(e)}></textarea>
                                  <small className="text-danger">{error.government_actions_details}</small>
                              </div>
                          }
                      </div>
                      <div className="col-12 mb-3">
                          <div className="form-group">
                              <label>Have the company and/or the officers ever been subject of any justified complaint relating to regulated activities?</label>
                              <div className="form-group mt-2 custom_radio">
                                  <input type="radio" id="general-disclosure-5-yes" name="past_complaints"  value='Yes' onChange={(e) => handleChanger(e)} checked = { data.past_complaints === 'Yes' ? true : false }/>
                                  <label for="general-disclosure-5-yes">Yes</label>
                                  <input type="radio" id="general-disclosure-5-no" name="past_complaints"  value='No' onChange={(e) => handleChanger(e)} checked = { data.past_complaints === 'No' ? true : false }/>
                                  <label for="general-disclosure-5-no">No</label>
                              </div>
                              <small className="text-danger">{error.past_complaints}</small>
                          </div>
                          {
                              data.past_complaints=='Yes' && 
                              <div className="form-group">
                                  <label>If Yes, Please provide details</label>
                                  <textarea className="form-control" name="past_complaints_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.past_complaints_details} onChange={(e) => handleChanger(e)}></textarea>
                                  <small className="text-danger">{error.past_complaints_details}</small>
                              </div>
                          }
                      </div>
                      <div className="col-12 mb-3">
                          <div className="form-group">
                              <label>Does any third party have any controlling interest where financial or otherwise, in respect of any trading undertaken on this account?</label>
                              <div className="form-group mt-2 custom_radio">
                                  <input type="radio" id="general-disclosure-6-yes" name="third_party_control" value='Yes' onChange={(e) => handleChanger(e)} checked = { data.third_party_control === 'Yes' ? true : false }/>
                                  <label for="general-disclosure-6-yes">Yes</label>
                                  <input type="radio" id="general-disclosure-6-no" name="third_party_control" value='No' onChange={(e) => handleChanger(e)} checked = { data.third_party_control === 'No' ? true : false }/>
                                  <label for="general-disclosure-6-no">No</label>
                              </div>
                              <small className="text-danger">{error.third_party_control}</small>
                          </div>
                          {
                              data.third_party_control=='Yes' && 
                              <div className="form-group">
                                  <label>If Yes, Please provide details</label>
                                  <textarea className="form-control" name="third_party_control_details" id="" cols="30" rows="5" placeholder="Enter your details" value={data.third_party_control_details} onChange={(e) => handleChanger(e)}></textarea>
                                  <small className="text-danger">{error.third_party_control_details}</small>
                              </div>
                          }
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
export default Disclosure;