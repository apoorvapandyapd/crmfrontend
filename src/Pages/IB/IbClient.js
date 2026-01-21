import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Innerlayout from '../../Components/Innerlayout';
import { redirectAsync, showClient } from '../../store/clientslice';
import { PropagateLoader } from "react-spinners";
import ClientAccounts from '../IbDashboardPage/ClientAccounts';
import ClientInfo from '../IbDashboardPage/ClientInfo';
import MtTradeList from "../Trades/MtTradeList";
import { BackArrowIcon } from '../../Components/icons';
import Deposittable from '../Deposit/Deposittable';
import Withdrawtable from '../Withdraw/Withdrawtable';
import Transfertable from "../Transferpage/Transfertable";

const base_url = process.env.REACT_APP_API_URL;
const CLIENTDETAIL_API_URL = base_url + "/v1/ib/client";

function IbClient(props) {

  const [clientinfo, setClientInfo] = useState(null);
  const client = useSelector(showClient);
  const [activeTab, setActiveTab] = useState(null);
  let [outerLoading, setOuterLoading] = useState(false);
  let location = useLocation();

  const dispatch = useDispatch();

  async function fetchData() {
    try {
      const config = {
        headers: { Authorization: `Bearer ${client.token}` }
      };

      const data = {
        id: location.state.client_id,
        key: 'clientDetails'
      };
      await axios.post(CLIENTDETAIL_API_URL, data, config).then((res) => {
        if (res.data.status_code === 200) {

          setClientInfo(res.data);
        }
        else if (res.data.status_code == 500) {
          ;
        }
      }).catch((error) => {
        if (error.response) {
          console.log(error.response.data.errors);
        }
      });
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        dispatch(redirectAsync());
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Update the active tab
  };

  if (clientinfo === null) {
    return (
      <Fragment>
        <Innerlayout>
          <PropagateLoader
            color={'#000b3e'}
            loading={true}
            cssOverride={{ textAlign: 'center', alignItems: 'center', backgroundColor: 'rgb(251,252,252,0.8)', display: 'flex', justifyContent: 'center', width: '100%', height: '100vh' }}
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
        <div className="row">
          <div className="col-xl-12">

            <div className="card-body ib-dashboard-content">
              <div className=' d-flex mb-3'>
                <Link to='/ib/dashboard' className="back-arrow">
                  <BackArrowIcon width="24" height="24" />
                </Link>
              </div>

              <ul className="c-tabs nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <Link to="#" className="active" id="c-tab" data-bs-toggle="tab" data-bs-target="#client-tab" role="tab" aria-controls="client-tab" aria-selected="false" onClick={() => handleTabClick('clientDetails')}>Client Details</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#deposit-tab" role="tab" aria-controls="deposit-tab" aria-selected="false" onClick={() => handleTabClick('deposit')}>Deposits</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#withdrawal-tab" role="tab" aria-controls="client-tab" aria-selected="false" onClick={() => handleTabClick('withdrawal')}>Withdrawals</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link to="#" className="" id="c-tab" data-bs-toggle="tab" data-bs-target="#transfer-tab" role="tab" aria-controls="client-tab" aria-selected="false" onClick={() => handleTabClick('transfer')}>Transfers</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link to="#" className="" id="sib-tab" data-bs-toggle="tab" data-bs-target="#live-accounts" role="tab" aria-controls="live-accounts" aria-selected="false" onClick={() => handleTabClick('liveAccounts')}>Live Accounts</Link>
                </li>
                <li className="nav-item" role="presentation">
                  <Link to="#" className="" id="trade-tab" data-bs-toggle="tab" data-bs-target="#client-trades" role="tab" aria-controls="client-trades" aria-selected="false" onClick={() => handleTabClick('trades')}>Trades</Link>
                </li>
              </ul>

              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="client-tab" role="tabpanel" aria-labelledby="c-tab" tabIndex="0">
                  <ClientInfo data={clientinfo} />
                </div>
                <div className="tab-pane fade" id="deposit-tab" role="tabpanel" aria-labelledby="c-tab" tabIndex="0">
                  <Deposittable showList={activeTab} setOuterLoading={setOuterLoading} outerLoading={outerLoading} />
                </div>
                <div className="tab-pane fade" id="withdrawal-tab" role="tabpanel" aria-labelledby="c-tab" tabIndex="0">
                  <Withdrawtable showList={activeTab} setOuterLoading={setOuterLoading} outerLoading={outerLoading} />
                </div>
                <div className="tab-pane fade" id="transfer-tab" role="tabpanel" aria-labelledby="c-tab" tabIndex="0">
                  <Transfertable showList={activeTab} setOuterLoading={setOuterLoading} outerLoading={outerLoading} />
                </div>
                <div className="tab-pane fade" id="live-accounts" role="tabpanel" aria-labelledby="sib-tab" tabIndex="0">
                  <ClientAccounts data={clientinfo} />
                </div>
                <div className="tab-pane fade" id="client-trades" role="tabpanel" aria-labelledby="sib-tab" tabIndex="0">
                  {activeTab === 'trades' && <MtTradeList />}
                </div>
              </div>
            </div>
          </div>

        </div>
      </Innerlayout>
    </Fragment>
  );
}

export default IbClient;