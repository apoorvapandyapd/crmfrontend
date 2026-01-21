import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";


const Rightsidecontent = (props) => {
    // const client = useSelector(showClient);
    // const client_name = client.client.first_name + ' ' + client.client.last_name;
    // function handleAccountClick(name) {
    // }
    
    return (
        <Row>
            <Col md={12} lg={6} xl={12}>
                <div className="card-body">
                    <h2>Accounts</h2>
                    <ul className="test-account">
                        <li>Demo Accounts <span style={{cursor:'pointer'}} onClick={() => props.handleclick('demo')}>{props.data.data.demoList.length}</span></li>
                        <li>Live Accounts <span style={{cursor:'pointer'}} onClick={() => props.handleclick('live')}>{props.data.data.liveList.length}</span></li>
                    </ul>
                </div>
            </Col>
            
            <Col md={12} lg={6} xl={12}>
                <div className="card-body">
                    <h2>Customer Support</h2>
                    <ul className="get-touch">
                        <li><span>Submit Query</span><Link to="/create/ticket" className="link-text">Click Here</Link></li>
                        {/* <li><span>Using Email</span><Link to="#" onClick={() => window.location = "mailto:parekhjp@gmail.com"} className="link-text">parekhjp@gmail.com</Link></li> */}
                    </ul>
                </div>
            </Col>

        </Row>
    );
}

export default Rightsidecontent;