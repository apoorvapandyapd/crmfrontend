import ReactSignatureCanvas from "react-signature-canvas";

const Declarations = ({
                          onSubmit,
                          handleChanger,
                          data,
                          error,
                          curState,
                          backChanger,
                          signpad,
                          fillLater,
                          directorData,
                      }) => {

    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = (nowDate.getMonth() + 1).toString().padStart(2, "0");
    const day = nowDate.getDate().toString().padStart(2, "0");

    const currentDate = `${year}-${month}-${day}`;

    //Naidish Change
    const clearSignpad = (e, signpad) => {
        e.preventDefault();

        signpad.clear();
    };
    //Naidish Change End

    return (
        <div
            className={
                curState === "declaration"
                    ? "tab-pane fade show active"
                    : "tab-pane fade"
            }
            id="tab-pane-11"
            role="tabpanel"
            aria-labelledby="tab-11"
            tabIndex="0"
        >
            <div className="p-4 label-input">
                <form onSubmit={onSubmit}>
                    <input type="hidden" name="declaration_key" value="true"/>
                    <input type="hidden" name="check_key" value="declaration_key"/>

                    <h2 className="mb-3">
                        <b>Declarations</b>
                    </h2>
                    <div className="row form-details">
                        <div className="col-12">
                            <div className="form-group cd-label">
                                <input
                                    style={{marginRight: "8px"}}
                                    type="checkbox"
                                    id="declare"
                                    name="collective_declaration"
                                    onChange={(e) => handleChanger(e)}
                                    checked={data.collective_declaration}
                                    required
                                />
                                <label className="mr-3" htmlFor="declare">
                                    <b>I/We, jointly and severally, declare that:</b>
                                </label>
                            </div>
                            <small className="text-danger">
                                {error.collective_declaration}
                            </small>
                            <ul className="number-style">
                                <li>
                                    That the information provided by us and inserted in this form
                                    is correct and that I/We acknowledge that I/We shall be
                                    obliged to inform CRM immediately in case of any
                                    changes to this information;
                                </li>
                                <li>
                                    That the investment amount has been chosen by us taking our
                                    total financial circumstances into consideration and is by us
                                    considered reasonable under such circumstances;
                                </li>
                                <li>
                                    That the funds deposited now or at any time in the future to
                                    CRM are/will not be derived from or otherwise
                                    relate to any activity which is illegal or unlawful. I/We will
                                    provide the required evidence of the source of funds if
                                    required doing so in future; and
                                </li>
                                <li>
                                    To have received satisfactory answers to all our questions
                                    regarding the terms, conditions and other issues relating to
                                    the relevant products.
                                </li>
                            </ul>
                        </div>
                        <div className="col-12">
                            <hr/>
                        </div>
                        <div className="col-12">
                            <div className="form-group cd-label">
                                <input
                                    style={{marginRight: "8px"}}
                                    type="checkbox"
                                    id="personal-information"
                                    name="info_consent"
                                    onChange={(e) => handleChanger(e)}
                                    checked={data.info_consent}
                                    required
                                />
                                <label className="mr-3" htmlFor="personal-information">
                                    <b>
                                        I/We acknowledge and consent to personal information
                                        submitted by us to CRM:
                                    </b>
                                </label>
                            </div>
                            <small className="text-danger">{error.info_consent}</small>
                            <ul className="number-style">
                                <li>
                                    Acknowledges, understands, and agrees that CRM
                                    shall, for the performance of its obligations hereunder,
                                    collect and, where necessary or required, process, personal
                                    information which the Investor hereby voluntarily discloses to
                                    it (the “Personal Data”).
                                </li>
                                <li>
                                    When CRM is required to carry out electronic
                                    verification, data may be used to undertake a search with the
                                    third-party authentication service provider. A record of the
                                    search and verification will be maintained for 7 years; and
                                </li>
                                <li>
                                    Maybe disclosed to other group companies of the CRM.
                                </li>
                                <li>
                                    I/We hereby agree that CRM may contact us to give
                                    information about their product and services via email.
                                </li>
                            </ul>
                        </div>
                        <div className="col-12">
                            <hr/>
                        </div>
                        <div className="col-12">
                            <div className="form-group cd-label">
                                <input
                                    style={{marginRight: "8px"}}
                                    type="checkbox"
                                    id="signature"
                                    name="signature_declaration"
                                    onChange={(e) => handleChanger(e)}
                                    checked={data.signature_declaration}
                                    required
                                />
                                <label className="mr-3" htmlFor="signature">
                                    <b>I/We declare by our signature:</b>
                                </label>
                            </div>
                            <small className="text-danger">
                                {error.signature_declaration}
                            </small>

                            <ul className="number-style">
                                <li>
                                    To have carefully and understood and agree to be bound by the
                                    CRM;
                                    <br/>
                                    {/* (a){" "}
                  <a
                    href="https://www.crm.netulr.com/pdf/Order%20Execution%20Policy-ParkmoneySVG.pdf"
                    target="_blank"
                    className="link-text"
                  >
                    Order Execution Policy{" "}
                  </a>
                  <br /> */}
                                    (a){" "}
                                    <a
                                        href="https://crm.netulr.com/pdf/Compliant%20Policy%20-ParkmoneySVG.pdf"
                                        target="_blank"
                                        className="link-text"
                                    >
                                        Complaint Policy{" "}
                                    </a>
                                    <br/>
                                    (b){" "}
                                    <a
                                        href="https://crm.netulr.com/pdf/Risk%20Warning-ParkmoneySVG.pdf"
                                        target="_blank"
                                        className="link-text"
                                    >
                                        Risk Disclosure Policy
                                    </a>
                                    <br/>
                                    (c){" "}
                                    <a
                                        href="https://www.crm.netulr.com/pdf/Order%20Execution%20Policy-ParkmoneySVG.pdf"
                                        target="_blank"
                                        className="link-text"
                                    >
                                        Terms of Service
                                    </a>
                                    <br/>
                                    (d){" "}
                                    <a
                                        href="https://www.crm.netulr.com/pdf/Privacy%20Policy-ParkmoneySVG.pdf"
                                        target="_blank"
                                        className="link-text"
                                    >
                                        Privacy Policy
                                    </a>
                                    <br/>
                                    (e) (as amended from time to time) that may apply to our
                                    entire trading relationship with CRM;
                                </li>

                                {/* <li>To have carefully and understood and agree to be bound by the CRM; <br />(a) Corporate Client Agreement <br />(b) Privacy Policy <br />(c) Best Execution Policy <br />(d) Regulations for Non-Trading Operations <br />(e) Complaints Handling Policy <br />(f) Risk Disclosure Policy and any other document <br />(g) (as amended from time to time) that may apply to our entire trading relationship with CRM;</li> */}
                                <li>
                                    To have received, read, and understood the product information
                                    material relating to the relevant products;
                                </li>
                                <li>
                                    To have understood that the trading service provided by Park
                                    Money Ltd carries a high level of risk and can result in
                                    losses that exceed the balance of cash held on our account at
                                    any time.
                                </li>
                            </ul>
                        </div>

                        <div className="col-12">
                            <hr/>
                        </div>
                        {
                            //Naidish Change

                            data.auth.map((auth, i) => {
                                return i === 0 ? (
                                    <div className="col-sm-6" key={i}>
                                        <div className="signature-box">
                                            <label>Signature:</label>
                                            <div className="signature-write">
                                                <ReactSignatureCanvas
                                                    penColor="blue"
                                                    ref={(el) => {
                                                        signpad.current[i] = el;
                                                    }}
                                                    canvasProps={{
                                                        width: "600px",
                                                        height: "150px",
                                                        className: "sigCanvas",
                                                        background: "#fff",
                                                    }}
                                                />
                                            </div>
                                            <small className="text-danger">
                                                {error[`sole_signature_path.${i}.sole${i}`]}
                                            </small>
                                        </div>
                                        <div className="mt-3 d-flex justify-content-between">
                                            <button
                                                className="btn btn-primary border"
                                                onClick={(e) => clearSignpad(e, signpad.current[i])}
                                            >
                                                Clear
                                            </button>
                                            <div>
                                                {auth.full_name}
                                                <br/>
                                                {currentDate}
                                            </div>
                                        </div>
                                    </div>
                                ) : null;
                            })
                            //Naidish Change End
                        }
                        <div className="col-sm-6"></div>
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
                                        Submit
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
export default Declarations;
