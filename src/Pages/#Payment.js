import { Fragment } from "react";
import { FormControl, FormGroup, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Innerlayout from "../Components/Innerlayout";
import { Link } from "react-router-dom";



const Payment = () => {

    let { id } = useParams();

    return (
        <Fragment>
            <Innerlayout>
                <div className="box-wrapper w-480">
                    <div className="card-body">
                        <h2>Pay Now {id}</h2>
                        <div className="d-flex flex-wrap justify-content-between mt-4">
                            <div className="w-100 border-0">
                                <form action="">
                                    <FormGroup className="mb-3">
                                        <FormControl type="text" name="card_no" placeholder="Card NO" />
                                    </FormGroup>
                                    <FormGroup className="mb-3">
                                        <FormControl type="text" name="card_holder_name" placeholder="Card Holder Name" />
                                    </FormGroup>
                                    <Form.Group className="form-group mb-3 input-date">
                                       
                                        <FormControl type="date" name="expiry_date" placeholder="expiry_date" />
                                    </Form.Group>
                                    <FormGroup className="mb-3">
                                        <FormControl type="text" name="cvv" placeholder="CVV" />
                                    </FormGroup>
                                    <div className="d-flex justify-content-center justify-content-sm-between align-items-center flex-wrap">
                                        <Link to="/deposit" className="order-5 order-sm-0">&laquo; Back</Link>
                                        <Button type="submit" className="btn btn-primary float-end btn btn-primary mb-3 mb-sm-0 order-1 order-sm-0">Deposit</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Innerlayout>
        </Fragment>
    );
}

export default Payment;