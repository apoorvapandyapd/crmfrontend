import { Fragment, useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Innerlayout from "../Components/Innerlayout";
import Deposittable from "./Deposit/Deposittable";
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import PropagateLoader from "react-spinners/PropagateLoader";
import axios from "axios";
import { Link } from "react-router-dom";



const Depositlist = () => {
    return(
        <Fragment>
            <Innerlayout>
                <Row className="align-items-center mt-32">
                    <Col lg={6} className="ms-auto">
                        <Link to='/mywallet' className="btn btn-primary float-end">Back</Link>
                    </Col>
                </Row>
                <Deposittable />
            </Innerlayout>
        </Fragment>
    );
}
export default Depositlist;