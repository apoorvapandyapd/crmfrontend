import { Row, Col } from "react-bootstrap";


const Accountstats = (props) => {

    var verify_status;
    
    if(Array.isArray(props.verifyStatus)){
        if (props.verifyStatus[0] === 'Completed') {
            verify_status = 'green';
        }
        else{
            verify_status = 'red';
        }
    }
    else{
        if (props.verifyStatus === 'Completed') {
            verify_status = 'green';
        }
        else{
            verify_status = 'red';
        }
    }
    

    return (
        <Row className="align-items-center mt-32">
            {/* <Col sm={12} md={12} lg={4} className="order-sm-first order-md-first order-lg-last mb-sm-3 mb-lg-0">
                <Link to='/document/upload'><Button className="btn btn-primary float-end">Upload</Button></Link>
                <Link to='/capture/document'><Button className="btn btn-primary float-end mr-2">Capture</Button></Link>
            </Col> */}
            <Col sm={6} md={6} lg={4}>
                <div className="verification-box">
                    KYC Verification <span className={verify_status}>
                    {(Array.isArray(props.verifyStatus)) ? props.verifyStatus[0] : props.verifyStatus}
                    </span>
                </div>
            </Col>
            {
                (Array.isArray(props.verifyStatus)) ? // Check if verifyStatus is an array
                    (props.verifyStatus[1] === 'Request_Not_Approved') ? // Check if the first element of verifyStatus is not 'Completed'
                        <div className="col-12">
                            <div className="verification-box red">
                            Your KYC has been successfully verified, but your IB request is pending. Please reach out to the administrator for any inquiries.
                            </div>
                        </div>
                    : null :
                (props.verifyStatus !== 'Completed') ? // This condition seems redundant
                    <Col sm={6} md={6} lg={4}>
                        <div className="verification-box">
                                KYC Status <span className="green">{(props?.data !== null) ? props.data.data.approved_count : ''} Approved</span>
                                <span className="red">{(props?.data !== null) ? props.data.data.rejected_count : ''} Rejected</span>
                        </div>
                    </Col>
                : <Col sm={6} md={6} lg={4} />
                // There is no corresponding else condition for the initial check
            }
        </Row>
    );
}

export default Accountstats;