import { Fragment, useEffect, useState } from "react";
import Innerlayout from "../../Components/Innerlayout";
import Deposittable from "../Deposit/Deposittable";
import Withdrawtable from "../Withdraw/Withdrawtable";
import Transfertable from "../Transferpage/Transfertable";
import DepositRequest from "./DepositRequest";
import Disclaimer from "./Disclaimer";
import TransferRequest from "./TransferRequest";
import WithdrawRequest from "./WithdrawRequest";
import axios from "axios";
import { redirectAsync, showClient, updateClientDataAsync } from "../../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import Ibwithdrawtable from "../Withdraw/Ibwithdrawtable";
import IbComWithdrawRequest from "./IbComWithdrawRequest";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from 'react-router-dom';
import { DepositIcon, WithdrawalIcon, TransferIcon } from "../../Components/icons";

const base_url = process.env.REACT_APP_API_URL;
const CLIENT_DETAILS_API = base_url + "/v1/client/get-details";

const MyWallet = () => {

    const dispatch = useDispatch();
    let location = useLocation();
    const client = useSelector(showClient);

    // const [balance, setBalance] = useState(0)
    let [outerLoading, setOuterLoading] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');
    const [showList, setShowList] = useState(null)

    useEffect(() => {
        if (location?.state) {
            setShowList(location.state)
        } else {
            setShowList('all')
        }
    }, [location?.state])


    async function fetchWalletBalanceData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };

            await axios.post(CLIENT_DETAILS_API, bodyParameters, config).then(res => {
                if (res.data.status_code === 200) {
                    dispatch(updateClientDataAsync(res.data.data, client.token, 'not_update'));
                }
            })
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                dispatch(redirectAsync());
            }

        }
    }

    useEffect(() => {
        fetchWalletBalanceData();
    }, []);



    const actionHandler = (action) => {
        setSelectedAction(action);
    }

    const backHandler = (e) => {
        e.preventDefault();
        setShowList('all');
        setSelectedAction('');
        fetchWalletBalanceData();
    }

    const refetchWalletBalanceData = () => {
        fetchWalletBalanceData();
    }

    const checkHistory = (list) => {
        setShowList(list);
        setSelectedAction('');
    }

    return (
        <Fragment>
            <Innerlayout>
                {(location.pathname === "/mywallet") ?
                    <>
                        <div className="row align-items-center mt-32">
                            <div className="col-sm-12 col-lg-12 mb-3 mb-sm-0">
                                <h2 className="mb-0">Wallet Balance: ${client.client.wallet_balance}</h2>
                            </div>
                        </div>

                        <div className="mt-4 d-flex flex-wrap justify-content-center align-items-center my-wallet-button">

                            <Link to="#" className={`button alert alert-success  ${selectedAction === 'D' ? 'active' : ''} `} onClick={() => actionHandler('D')}>
                                <span className="icon">
                                    <DepositIcon width="32" height="32" />
                                </span>
                                Deposit
                            </Link>
                            <Link to="#" className={`button alert alert-danger  ${selectedAction === 'W' ? 'active' : ''} `} onClick={() => actionHandler('W')}>
                                <span className="icon">
                                    <WithdrawalIcon width="32" height="32" />
                                </span>
                                Withdraw
                            </Link>
                            <Link to="#" className={`button alert alert-primary ${selectedAction === 'T' ? 'active' : ''} `} onClick={() => actionHandler('T')}>
                                <span className="icon">
                                    <TransferIcon width="32" height="32" />
                                </span>
                                Transfer
                            </Link>
                        </div>


                        {!selectedAction && <div className={`my-wallet-table mt-4 ${(showList === 'deposit' || showList === 'depositRequest') || showList === 'all' ? "d-block" : "d-none"}`} >
                            <Deposittable setShowList={setShowList} showList={showList} setOuterLoading={setOuterLoading} outerLoading={outerLoading} refetchWalletBalanceData={refetchWalletBalanceData} />
                        </div>
                        }
                        {!selectedAction && <div className={`my-wallet-table mt-4 ${(showList === 'withdrawal' || showList === 'withdrawalRequest') || showList === 'all' ? "d-block" : "d-none"}`}>
                            <div className="card-body p-0 table-last-col mt-3">
                                <Withdrawtable setShowList={setShowList} showList={showList} setOuterLoading={setOuterLoading} outerLoading={outerLoading} refetchWalletBalanceData={refetchWalletBalanceData} />
                            </div>
                        </div>
                        }
                        {!selectedAction && <div className={`my-wallet-table mt-4 ${(showList === 'transfer' || showList === "transferRequest") || showList === 'all' ? "d-block" : "d-none"}`}>
                            <div className="card-body p-0 table-last-col mt-3">
                                <Transfertable setShowList={setShowList} showList={showList} setOuterLoading={setOuterLoading} outerLoading={outerLoading} />
                            </div>
                        </div>
                        }

                        {selectedAction && selectedAction === 'D' && <div className="my-wallet-table mt-4">
                            <DepositRequest checkHistory={checkHistory} backHandler={backHandler} />
                        </div>
                        }
                        {selectedAction && selectedAction === 'W' && <div className="my-wallet-table mt-4">
                            <WithdrawRequest checkHistory={checkHistory} backHandler={backHandler} />
                        </div>
                        }

                        {selectedAction && selectedAction === 'T' && <div className="my-wallet-table mt-4">
                            <TransferRequest checkHistory={checkHistory} backHandler={backHandler} />
                        </div>
                        }

                    </>
                    :
                    <>
                        <div className="mt-4 d-flex flex-wrap justify-content-center align-items-center my-wallet-button">
                            <Link to='#' className={`button alert alert-success  ${selectedAction === 'C' ? 'active' : ''} `} onClick={() => actionHandler('C')}>
                                <span className="icon">
                                    <DepositIcon width="32" height="32" />
                                </span>
                                Commission
                            </Link>
                        </div>

                        {!selectedAction && <div className={`my-wallet-table mt-4 ${(showList === 'ibComWithdrawal' || showList === 'ibComWithdrawalRequest') || showList === 'all' ? "d-block" : "d-none"}`} >
                            <Ibwithdrawtable setShowList={setShowList} showList={showList} setOuterLoading={setOuterLoading} outerLoading={outerLoading} />
                        </div>
                        }

                        {selectedAction && selectedAction === 'C' && <div className="my-wallet-table mt-4">
                            <IbComWithdrawRequest checkHistory={checkHistory} backHandler={backHandler} />
                        </div>
                        }
                    </>
                }
                <div className="card-body p-0 table-last-col mt-4 disclaimer-txt">
                    <Disclaimer />
                </div>

            </Innerlayout>
        </Fragment>
    );
}
export default MyWallet;