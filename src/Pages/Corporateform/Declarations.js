
import ReactSignatureCanvas from 'react-signature-canvas';
// import { useDispatch, useSelector } from 'react-redux';
// import { redirectAsync, showClient } from '../../store/clientslice';

const Declarations = ({onSubmit, handleChanger, data, error, curState, backChanger, signpad, fillLater, directorData}) => {
    // let signPad = useRef({});
    // const client = useSelector(showClient);
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = (nowDate.getMonth() + 1).toString().padStart(2, '0');
    const day = nowDate.getDate().toString().padStart(2, '0');

    const currentDate= `${year}-${month}-${day}`;

    //Naidish Change
    const clearSignpad=(e, signpad)=>{
        e.preventDefault();

        signpad.clear();
    }

    // for (const key in myObject) {
    //     if (myObject.hasOwnProperty(key)) {
    //         const value = myObject[key];
    //     }
    // }
    //Naidish Change End

    return(
        <div className={curState === 'declaration' ? 'tab-pane fade show active' : 'tab-pane fade'} id="tab-pane-11" role="tabpanel" aria-labelledby="tab-11" tabIndex="0">
            <div className="p-4 label-input">
                <form onSubmit={onSubmit}>
                    <input type='hidden' name='declaration_key' value='true'/>
                    <input type='hidden' name='check_key' value='declaration_key'/>
                    
                    <h2 className="mb-3"><b>Declarations</b></h2>
                    <div className="row form-details">
                        <div className="col-12">
                            <div className="form-group cd-label">
                                <input style={{ marginRight: '8px' }} type="checkbox" id="declare" name='collective_declaration' onChange={(e) => handleChanger(e)} checked = { data.collective_declaration} required/>
                                <label className="mr-3" for="declare"><b>I/We, jointly and severally, declare that:</b></label>
                            </div>
                            <small className="text-danger">{error.collective_declaration}</small>
                            <ul className="number-style">
                                <li>That the information provided by us and inserted in this form is correct and that I/We acknowledge that I/We shall be obliged to inform PM Financials Ltd immediately in case of any changes to this information;</li>
                                <li>That the investment amount has been chosen by us taking our total financial circumstances into consideration and is by us considered reasonable under such circumstances;</li>
                                <li>That the funds deposited now or at any time in the future to PM Financials Ltd are/will not be derived from or otherwise relate to any activity which is illegal or unlawful. I/We will provide the required evidence of the source of funds if required doing so in future; and</li>
                                <li>To have received satisfactory answers to all our questions regarding the terms, conditions and other issues relating to the relevant products.</li>
                            </ul>
                        </div>
                        <div className="col-12"><hr/></div>
                        <div className="col-12">
                            <div className="form-group cd-label">
                                <input style={{ marginRight: '8px' }} type="checkbox" id="personal-information" name='info_consent' onChange={(e) => handleChanger(e)} checked = { data.info_consent} required/>
                                <label className="mr-3" for="personal-information"><b>I/We acknowledge and consent to personal information submitted by us to PM Financials Ltd:</b></label>
                            </div>
                            <small className="text-danger">{error.info_consent}</small>
                            <ul className="number-style">
                                <li>Acknowledges, understands, and agrees that PM Financials Ltd shall, for the performance of its obligations hereunder, collect and, where necessary or required, process, personal information which the Investor hereby voluntarily discloses to it (the “Personal Data”).</li>
                                <li>When PM Financials Ltd is required to carry out electronic verification, data may be used to undertake a search with the third-party authentication service provider. A record of the search and verification will be maintained for 7 years; and</li>
                                <li>Maybe disclosed to other group companies of the PM Financials Ltd.</li>
                                <li>I/We hereby agree that PM Financials Ltd may contact us to give information about their product and services via email.</li>
                            </ul>
                        </div>
                        <div className="col-12"><hr/></div>
                        <div className="col-12">
                            <div className="form-group cd-label">
                                <input style={{ marginRight: '8px' }} type="checkbox" id="signature" name='signature_declaration' onChange={(e) => handleChanger(e)}  checked = { data.signature_declaration} required/>
                                <label className="mr-3" for="signature"><b>I/We declare by our signature:</b></label>
                            </div>
                            <small className="text-danger">{error.signature_declaration}</small>

                            <ul className="number-style">
                                <li>To have carefully and understood and agree to be bound by the PM Financials Ltd;
                                    <br />(a) <a href='https://pmfinancials.mu/pdf/PMFL-Terms_and_conditions.pdf' target='_blank' className='link-text'>Client Agreement </a>
                                    <br />(b) <a href='https://pmfinancials.mu/pdf/Privacy%20_Policy.pdf' target='_blank' className='link-text'>Privacy Policy</a>
                                    {/* <br />(c) Best Execution Policy */}
                                    {/* <br />(d) Regulations for Non-Trading Operations */}
                                    <br />(c) <a href='https://pmfinancials.mu/pdf/Complaints_Policy.pdf' target='_blank' className='link-text'>Complaint Policy </a>
                                    <br />(d) <a href='https://pmfinancials.mu/pdf/Risk_Disclosure.pdf' target='_blank' className='link-text'>Risk Disclosure Policy</a>
                                    <br />(e) (as amended from time to time) that may apply to our entire trading relationship with PM Financials Ltd;</li>

                                {/* <li>To have carefully and understood and agree to be bound by the PM Financials Ltd; <br />(a) Corporate Client Agreement <br />(b) Privacy Policy <br />(c) Best Execution Policy <br />(d) Regulations for Non-Trading Operations <br />(e) Complaints Handling Policy <br />(f) Risk Disclosure Policy and any other document <br />(g) (as amended from time to time) that may apply to our entire trading relationship with PM Financials Ltd;</li> */}
                                <li>To have received, read, and understood the product information material relating to the relevant products;</li>
                                <li>To have understood that the trading service provided by PM Financials Ltd carries a high level of risk and can result in losses that exceed the balance of cash held on our account at any time.</li>

                            </ul>
                        </div>
                        
                        
                        <div className="col-12">
                            <hr/>
                        </div>
                        { //Naidish Change
                            data.auth.map((auth, i) => {
                                return i == 0 ? (
                                    <div className="col-sm-6">
                                        <div className="signature-box">
                                            <label>Signature:</label>
                                            <div className="signature-write">
                                                <ReactSignatureCanvas penColor='blue'
                                                    ref={el => { (signpad.current[i] = el) }}
                                                    canvasProps={{ width: '600px', height: '150px', className: 'sigCanvas', background: '#fff' }}
                                                />
                                            </div>
                                            <small className="text-danger">{error[`sole_signature_path.${i}.sole${i}`]}</small>
                                        </div>
                                        <div className="mt-3 d-flex justify-content-between">
                                            <button className="btn btn-primary border" onClick={(e) => clearSignpad(e, signpad.current[i])}>Clear</button>
                                            <div>
                                                {auth.full_name}<br />
                                                {currentDate}
                                            </div>
                                        </div>
                                    </div>

                                ) : null;

                            })
                            //Naidish Change End   
                        }
                        <div className="col-sm-6">
                        </div>
                        <div className="col-12 mt-3">
                            <div className="buttons d-flex justify-content-between">
                                <button type="button" className="btn btn-light" onClick={(e)=>fillLater(e)}>Complete Later</button>
                                <div>
                                    <button type="button" className="btn btn-light" onClick={(e) => backChanger(e)}>Back</button>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Declarations;