import { Fragment, useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Innerlayout from "../Components/Innerlayout";
import Deposittable from "./Deposit/Deposittable";
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import PropagateLoader from "react-spinners/PropagateLoader";
import axios from "axios";
import { Link } from "react-router-dom";

const base_url = process.env.REACT_APP_API_URL;
const DEPOSIT_API_URL = base_url + "/v1/client/list-deposit";

const Depositlist = () => {
  const [deposits, setDeposits] = useState(null);
  const client = useSelector(showClient);
  let [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [date, setDate] = useState({
    from_date: null,
    to_date: null,
  });
  const [error, setError] = useState({});

  async function fetchData(clr = null) {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${client.token}` },
      };

      const bodyParameters = {};
      bodyParameters.from_date = date.from_date;
      bodyParameters.to_date = date.to_date;

      if (clr === "clr") {
        bodyParameters.from_date = null;
        bodyParameters.to_date = null;
        setDate((previousData) => ({
          ...previousData,
          from_date: null,
          to_date: null,
        }));
      }

      const response = await axios.post(
        DEPOSIT_API_URL,
        bodyParameters,
        config
      );
      if (response.data) {
        setDeposits(response.data);
        setLoading(false);
        setError({});
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400) {
        setError(error.response.data.errors);
        setLoading(false);
      }
      if (error.response.status === 401) {
        dispatch(redirectAsync());
      }
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

    if (deposits === null) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                        color={"#000b3e"}
                        loading={true}
                        cssOverride={{
                            textAlign: "center",
                            alignItems: "center",
                            backgroundColor: "rgb(251,252,252,0.8)",
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            height: "100vh",
                        }}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </Innerlayout>
            </Fragment>
        );
    }

  return (
    <Fragment>
      <Innerlayout>
        <Row className="align-items-center mt-32">
          <Col lg={6} className="ms-auto">
            <Link to="/newdeposit" className="btn btn-primary float-end">
              Make Deposit Request
            </Link>
          </Col>
        </Row>
        <Deposittable
          lists={deposits}
          setDate={setDate}
          date={date}
          error={error}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
          fetchesData={fetchData}
        />
      </Innerlayout>
    </Fragment>
  );
};
export default Depositlist;
