import { Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { showClient } from "../../store/clientslice";
import { useSelector } from "react-redux";
import { WalletIcon, DepositIcon, WithdrawalIcon, TradingAccountsIcon } from "../../Components/icons";
const Stats = (props) => {
    const client = useSelector(showClient);
    let display_status = false;
    if (client.client.verify === 'Completed') {
        display_status = false;
    }
    else {
        display_status = true;
    }
    return (
        <Row>
            <Col sm={6} lg={6} xl={3}>
                <div className="card-body account-details-box">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>My Wallet</Tooltip>}>
                        <Link to='/mywallet' style={display_status ? { pointerEvents: 'none' } : {}}>
                            <span className="icon">
                                <WalletIcon width="32" height="32" />
                                {/* <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.6533 30.3334H8.34667C5.02667 30.3334 2.33333 27.64 2.33333 24.32V15.3467C2.33333 12.0267 5.02667 9.33337 8.34667 9.33337H23.6533C26.9733 9.33337 29.6667 12.0267 29.6667 15.3467V17.2667C29.6667 17.8134 29.2133 18.2667 28.6667 18.2667H25.9733C25.5067 18.2667 25.08 18.4401 24.7733 18.7601L24.76 18.7734C24.3867 19.1334 24.2133 19.6267 24.2533 20.1333C24.3333 21.0133 25.1733 21.72 26.1333 21.72H28.6667C29.2133 21.72 29.6667 22.1733 29.6667 22.72V24.3067C29.6667 27.64 26.9733 30.3334 23.6533 30.3334ZM8.34667 11.3334C6.13333 11.3334 4.33333 13.1334 4.33333 15.3467V24.32C4.33333 26.5334 6.13333 28.3334 8.34667 28.3334H23.6533C25.8667 28.3334 27.6667 26.5334 27.6667 24.32V23.7334H26.1333C24.12 23.7334 22.4133 22.24 22.2533 20.32C22.1467 19.2267 22.5467 18.1467 23.3467 17.3601C24.04 16.6534 24.9733 16.2667 25.9733 16.2667H27.6667V15.3467C27.6667 13.1334 25.8667 11.3334 23.6533 11.3334H8.34667Z" fill="#4410AD" />
                                    <path d="M3.33333 17.5466C2.78667 17.5466 2.33333 17.0933 2.33333 16.5466V10.4534C2.33333 8.46671 3.58667 6.66663 5.44 5.95997L16.0267 1.95997C17.12 1.54663 18.3333 1.69336 19.28 2.36003C20.24 3.0267 20.8 4.10669 20.8 5.26669V10.3333C20.8 10.88 20.3467 11.3333 19.8 11.3333C19.2533 11.3333 18.8 10.88 18.8 10.3333V5.26669C18.8 4.76002 18.56 4.29334 18.1333 4.00001C17.7067 3.70667 17.2 3.64 16.72 3.82667L6.13333 7.82666C5.05333 8.24 4.32 9.29337 4.32 10.4534V16.5466C4.33333 17.1066 3.88 17.5466 3.33333 17.5466Z" fill="#4410AD" />
                                    <path d="M26.1333 23.7332C24.12 23.7332 22.4133 22.2399 22.2533 20.3199C22.1466 19.2132 22.5466 18.1333 23.3466 17.3466C24.0266 16.6533 24.96 16.2666 25.96 16.2666H28.7333C30.0533 16.3066 31.0666 17.3465 31.0666 18.6265V21.3733C31.0666 22.6533 30.0533 23.6932 28.7733 23.7332H26.1333ZM28.7066 18.2666H25.9733C25.5066 18.2666 25.08 18.4399 24.7733 18.7599C24.3866 19.1333 24.2 19.6399 24.2533 20.1466C24.3333 21.0266 25.1733 21.7332 26.1333 21.7332H28.7466C28.92 21.7332 29.08 21.5733 29.08 21.3733V18.6265C29.08 18.4265 28.92 18.2799 28.7066 18.2666Z" fill="#4410AD" />
                                    <path d="M18.6667 17H9.33333C8.78667 17 8.33333 16.5467 8.33333 16C8.33333 15.4533 8.78667 15 9.33333 15H18.6667C19.2133 15 19.6667 15.4533 19.6667 16C19.6667 16.5467 19.2133 17 18.6667 17Z" fill="#4410AD" />
                                </svg> */}
                            </span>
                        </Link>
                    </OverlayTrigger>
                    <h2><span>Wallet Balance</span> ${(props.data.data.accountBalance !== undefined) ? props.data.data.accountBalance : '0'} </h2>
                </div>
            </Col>
            <Col sm={6} lg={6} xl={3}>
                <div className="card-body account-details-box">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Deposit History</Tooltip>}>
                        <Link to={{ pathname: '/mywallet', state: 'deposit' }} style={display_status ? { pointerEvents: 'none' } : {}}>
                            <span className="icon">
                                <DepositIcon width="32" height="32" />
                            </span>
                        </Link>
                    </OverlayTrigger>
                    <h2><span>Deposit</span> ${props.data.data.totalDeposit}</h2>
                </div>
            </Col>
            <Col sm={6} lg={6} xl={3}>
                <div className="card-body account-details-box">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Withdrawal History</Tooltip>}>
                        <Link to={{ pathname: '/mywallet', state: 'withdrawal' }} style={display_status ? { pointerEvents: 'none' } : {}}>
                            <span className="icon">
                                <WithdrawalIcon width="32" height="32" />
                            </span>
                        </Link>
                    </OverlayTrigger>
                    <h2><span>Withdraw</span> ${props.data.data.totalWithdraw}</h2>
                </div>
            </Col>
            <Col sm={6} lg={6} xl={3}>
                <div className="card-body account-details-box">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Accounts</Tooltip>}>
                        <Link to='/list/trading-accounts' style={display_status ? { pointerEvents: 'none' } : {}}>
                            <span className="icon">
                                <TradingAccountsIcon width="32" height="32" />
                            </span>
                        </Link>
                    </OverlayTrigger>
                    <h2><span>Accounts</span>{props.data.data.demoList.length + props.data.data.liveList.length}</h2>
                </div>
            </Col>
        </Row>

    );
}

export default Stats;