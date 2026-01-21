import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { DepositIcon, ReferralCodeIcon, TradingAccountsIcon } from '../../Components/icons';
function IbDashboardHeader(props) {

    // const ReferralSplit = () => {
    //     let referral_split = props.data.data.referral_link.split('?');
    //     let split_link = referral_split[0] + ' ....';
    //     document.getElementById("ref_link").innerHTML = split_link;
    // }

    const copyLink = async () => {
        try {
          await navigator.clipboard.writeText(props.data.data.referral_link);
          
          document.getElementById("ibdashboardcopyid").classList.toggle("active")
          setTimeout(() => {
            document.getElementById("ibdashboardcopyid").classList.toggle("active")
          }, "2000")          
        } catch (err) {
        }
    }

    useEffect(() => {
        // ReferralSplit();
    }, [])

    return (
        <>
            <div className="col-sm-6 col-sm-6 col-xl-6 col-xxl-3">
                <div className="card-body account-details-box">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Commission History</Tooltip>}>
                        <Link to={{ pathname: '/ibmywallet', state: 'ibComWithdrawal' }}>
                            <span className="icon">
                                <DepositIcon width="32" height="32" />
                            </span>
                        </Link>
                    </OverlayTrigger>
                    <h2><span>Commission</span> ${props.data.data.withdrawable_amount}</h2>
                </div>
            </div>
            {/* <div className="col-sm-6 col-sm-6 col-xl-6 col-xxl-3">
                    <div className="card-body account-details-box flex-wrap position-relative">
                        <span className="icon"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.6536 30.3334H16.347C15.8003 30.3334 15.347 29.88 15.347 29.3334C15.347 28.7867 15.8003 28.3334 16.347 28.3334H23.6536C25.867 28.3334 27.667 26.5334 27.667 24.32V23.7334H26.1336C24.1203 23.7334 22.4136 22.24 22.2536 20.32C22.147 19.2134 22.547 18.1334 23.347 17.3467C24.027 16.6534 24.9603 16.2667 25.9603 16.2667H27.6536V15.3467C27.6536 13.1334 25.8536 11.3334 23.6403 11.3334H8.33364C6.12031 11.3334 4.32031 13.1334 4.32031 15.3467V17.6534C4.32031 18.2 3.86698 18.6534 3.32031 18.6534C2.77365 18.6534 2.32031 18.2 2.32031 17.6534V15.3467C2.32031 12.0267 5.01364 9.33337 8.33364 9.33337H23.6403C26.9603 9.33337 29.6536 12.0267 29.6536 15.3467V17.2667C29.6536 17.8134 29.2003 18.2667 28.6536 18.2667H25.9603C25.4936 18.2667 25.067 18.4401 24.7603 18.7601C24.3736 19.1334 24.187 19.64 24.2403 20.1467C24.3203 21.0267 25.1603 21.7334 26.1203 21.7334H28.6536C29.2003 21.7334 29.6536 22.1867 29.6536 22.7334V24.32C29.667 27.64 26.9736 30.3334 23.6536 30.3334Z" fill="#4410AD"/>
                            <path d="M3.33331 17.5466C2.78665 17.5466 2.33331 17.0933 2.33331 16.5466V10.4534C2.33331 8.46671 3.58665 6.66663 5.43998 5.95997L16.0267 1.95997C17.12 1.54663 18.3333 1.69336 19.28 2.36003C20.24 3.0267 20.8 4.10669 20.8 5.26669V10.3333C20.8 10.88 20.3467 11.3333 19.8 11.3333C19.2533 11.3333 18.8 10.88 18.8 10.3333V5.26669C18.8 4.76002 18.56 4.29334 18.1333 4.00001C17.7067 3.70667 17.2 3.64 16.72 3.82667L6.13332 7.82666C5.05332 8.24 4.31999 9.29337 4.31999 10.4534V16.5466C4.33332 17.1066 3.87998 17.5466 3.33331 17.5466Z" fill="#4410AD"/>
                            <path d="M26.1333 23.7332C24.12 23.7332 22.4133 22.2399 22.2533 20.3199C22.1466 19.2132 22.5466 18.1333 23.3466 17.3466C24.0266 16.6533 24.96 16.2666 25.96 16.2666H28.7333C30.0533 16.3066 31.0666 17.3465 31.0666 18.6265V21.3733C31.0666 22.6533 30.0533 23.6932 28.7733 23.7332H26.1333ZM28.7066 18.2666H25.9733C25.5066 18.2666 25.08 18.4399 24.7733 18.7599C24.3866 19.1333 24.2 19.6399 24.2533 20.1466C24.3333 21.0266 25.1733 21.7332 26.1333 21.7332H28.7466C28.92 21.7332 29.08 21.5733 29.08 21.3733V18.6265C29.08 18.4265 28.92 18.2799 28.7066 18.2666Z" fill="#4410AD"/>
                            <path d="M18.6666 17H9.33331C8.78665 17 8.33331 16.5467 8.33331 16C8.33331 15.4533 8.78665 15 9.33331 15H18.6666C19.2133 15 19.6666 15.4533 19.6666 16C19.6666 16.5467 19.2133 17 18.6666 17Z" fill="#4410AD"/>
                            <path d="M12.6667 26.2533C12.12 26.2533 11.6667 25.8 11.6667 25.2533V23.5466C11.6667 23.2533 11.4267 23 11.12 23H4C3.45333 23 3 22.5467 3 22C3 21.4533 3.45333 21 4 21H11.12C12.52 21 13.6667 22.1466 13.6667 23.5466V25.2533C13.6667 25.8 13.2133 26.2533 12.6667 26.2533Z" fill="#4410AD"/>
                            <path d="M5.62657 24.6265C5.37323 24.6265 5.1199 24.5333 4.9199 24.3333L3.29323 22.7066C2.90657 22.32 2.90657 21.6799 3.29323 21.2932L4.9199 19.6666C5.30657 19.2799 5.94657 19.2799 6.33323 19.6666C6.7199 20.0533 6.7199 20.6933 6.33323 21.0799L5.41323 21.9999L6.33323 22.9199C6.7199 23.3066 6.7199 23.9466 6.33323 24.3333C6.13323 24.5333 5.8799 24.6265 5.62657 24.6265Z" fill="#4410AD"/>
                            <path d="M12.6667 30.0401H5.54667C4.14667 30.0401 3 28.8934 3 27.4934V25.7867C3 25.2401 3.45333 24.7867 4 24.7867C4.54667 24.7867 5 25.2401 5 25.7867V27.4934C5 27.7867 5.24001 28.0401 5.54667 28.0401H12.6667C13.2133 28.0401 13.6667 28.4934 13.6667 29.0401C13.6667 29.5867 13.2133 30.0401 12.6667 30.0401Z" fill="#4410AD"/>
                            <path d="M11.0403 31.6666C10.787 31.6666 10.5336 31.5733 10.3336 31.3733C9.94697 30.9866 9.94697 30.3465 10.3336 29.9599L11.2536 29.04L10.3336 28.12C9.94697 27.7333 9.94697 27.0933 10.3336 26.7066C10.7203 26.32 11.3603 26.32 11.747 26.7066L13.3736 28.3333C13.7603 28.7199 13.7603 29.3599 13.3736 29.7466L11.747 31.3733C11.5603 31.5733 11.2936 31.6666 11.0403 31.6666Z" fill="#4410AD"/>
                            </svg>
                        </span>
                        <h2>
                            <span>Withdraw</span> ${props.data.data.withdrawable_amount}<br/>
                            <Link to='/newibwithdraw' id="withdraw_ib" className="link">
                                <svg width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M29.653 30.3334H14.3463C11.0263 30.3334 8.33301 27.64 8.33301 24.32V15.3467C8.33301 12.0267 11.0263 9.33337 14.3463 9.33337H29.653C32.973 9.33337 35.6663 12.0267 35.6663 15.3467V17.2667C35.6663 17.8134 35.213 18.2667 34.6663 18.2667H31.973C31.5063 18.2667 31.0797 18.4401 30.773 18.7601L30.7597 18.7734C30.3863 19.1334 30.213 19.6267 30.253 20.1333C30.333 21.0133 31.173 21.72 32.133 21.72H34.6663C35.213 21.72 35.6663 22.1733 35.6663 22.72V24.3067C35.6663 27.64 32.973 30.3334 29.653 30.3334ZM14.3463 11.3334C12.133 11.3334 10.333 13.1334 10.333 15.3467V24.32C10.333 26.5334 12.133 28.3334 14.3463 28.3334H29.653C31.8663 28.3334 33.6663 26.5334 33.6663 24.32V23.7334H32.133C30.1197 23.7334 28.413 22.24 28.253 20.32C28.1463 19.2267 28.5463 18.1467 29.3463 17.3601C30.0397 16.6534 30.973 16.2667 31.973 16.2667H33.6663V15.3467C33.6663 13.1334 31.8663 11.3334 29.653 11.3334H14.3463V11.3334Z" fill="currentcolor"/>
                                    <path d="M9.33301 17.5466C8.78634 17.5466 8.33301 17.0933 8.33301 16.5466V10.4534C8.33301 8.46671 9.58634 6.66663 11.4397 5.95997L22.0263 1.95997C23.1197 1.54663 24.333 1.69336 25.2797 2.36003C26.2397 3.0267 26.7997 4.10669 26.7997 5.26669V10.3333C26.7997 10.88 26.3463 11.3333 25.7997 11.3333C25.253 11.3333 24.7997 10.88 24.7997 10.3333V5.26669C24.7997 4.76002 24.5597 4.29334 24.133 4.00001C23.7063 3.70667 23.1997 3.64 22.7197 3.82667L12.133 7.82666C11.053 8.24 10.3197 9.29337 10.3197 10.4534V16.5466C10.333 17.1066 9.87967 17.5466 9.33301 17.5466Z" fill="currentcolor"/>
                                    <path d="M32.1333 23.7332C30.12 23.7332 28.4133 22.2399 28.2533 20.3199C28.1466 19.2132 28.5466 18.1333 29.3466 17.3466C30.0266 16.6533 30.96 16.2666 31.96 16.2666H34.7333C36.0533 16.3066 37.0666 17.3465 37.0666 18.6265V21.3733C37.0666 22.6533 36.0533 23.6932 34.7733 23.7332H32.1333ZM34.7066 18.2666H31.9733C31.5066 18.2666 31.08 18.4399 30.7733 18.7599C30.3866 19.1333 30.2 19.6399 30.2533 20.1466C30.3333 21.0266 31.1733 21.7332 32.1333 21.7332H34.7466C34.92 21.7332 35.08 21.5733 35.08 21.3733V18.6265C35.08 18.4265 34.92 18.2799 34.7066 18.2666Z" fill="currentcolor"/>
                                    <path d="M24.6663 17H15.333C14.7863 17 14.333 16.5467 14.333 16C14.333 15.4533 14.7863 15 15.333 15H24.6663C25.213 15 25.6663 15.4533 25.6663 16C25.6663 16.5467 25.213 17 24.6663 17Z" fill="currentcolor"/>
                                    <path d="M9 20L1 20L4 17" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M1 20L4 23" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                            <ReactTooltip anchorId='withdraw_ib' place="top" content='Withdraw amount to wallet' />
                        </h2>
                    </div>
                </div>
                <div className="col-sm-6 col-sm-6 col-xl-6 col-xxl-3">
                    <div className="card-body account-details-box">
                    <span className="icon copylink" onClick={copyLink} title="Click to copy referral link"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.7993 30.3332H9.19935C3.98602 30.3332 1.66602 28.0132 1.66602 22.7998V17.1998C1.66602 11.9865 3.98602 9.6665 9.19935 9.6665H14.7993C20.0127 9.6665 22.3327 11.9865 22.3327 17.1998V22.7998C22.3327 28.0132 20.0127 30.3332 14.7993 30.3332ZM9.19935 11.6665C5.06602 11.6665 3.66602 13.0665 3.66602 17.1998V22.7998C3.66602 26.9332 5.06602 28.3332 9.19935 28.3332H14.7993C18.9327 28.3332 20.3327 26.9332 20.3327 22.7998V17.1998C20.3327 13.0665 18.9327 11.6665 14.7993 11.6665H9.19935V11.6665Z" fill="#4410AD"/>
                            <path d="M22.7993 22.3332H21.3327C20.786 22.3332 20.3327 21.8798 20.3327 21.3332V17.1998C20.3327 13.0665 18.9327 11.6665 14.7993 11.6665H10.666C10.1193 11.6665 9.66602 11.2132 9.66602 10.6665V9.19984C9.66602 3.9865 11.986 1.6665 17.1993 1.6665H22.7993C28.0127 1.6665 30.3327 3.9865 30.3327 9.19984V14.7998C30.3327 20.0132 28.0127 22.3332 22.7993 22.3332ZM22.3327 20.3332H22.7993C26.9327 20.3332 28.3327 18.9332 28.3327 14.7998V9.19984C28.3327 5.0665 26.9327 3.6665 22.7993 3.6665H17.1993C13.066 3.6665 11.666 5.0665 11.666 9.19984V9.6665H14.7993C20.0127 9.6665 22.3327 11.9865 22.3327 17.1998V20.3332Z" fill="#4410AD"/>
                            </svg>
                        </span>

                        <h2><span id="copied" className='mb-0'></span> <span className='mt-1 mb-0'>Referral Link</span>  <a className='font-14' href='javascript:void(0)' onClick={copyLink}><b>Copy Link</b></a></h2>
                    </div>
                </div> */}
            <div className="col-sm-6 col-sm-6 col-xl-6 col-xxl-3">
                <div className="card-body account-details-box">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Click icon to copy referal link</Tooltip>}>
                        <Link to="#" id="ibdashboardcopyid" className='font-14 position-relative' onClick={copyLink}>
                            <span className='copied-text'>Copied</span>
                            <span className="icon">
                                <ReferralCodeIcon width="32" height="32" />
                            </span>
                        </Link>
                    </OverlayTrigger>
                    <h2>
                        <span>Referral Code</span>  {props.data.data.referral_code}
                    </h2>
                </div>
            </div>
            <div className="col-sm-6 col-sm-6 col-xl-6 col-xxl-3">
                <div className="card-body account-details-box">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Verified / Active</Tooltip>}>
                        <span className="icon">
                            <TradingAccountsIcon width="32" height="32" />
                        </span>
                    </OverlayTrigger>
                    <h2>
                        <span>Clients</span>
                        {props.data.data.sub_clients.verified_client} / {props.data.data.sub_clients.active_client}
                        {/* <span className='d-flex justify-content-between'>
                                <span title="Verified Clients">{props.data.data.sub_clients.verified_client}</span>
                                <span title="Unverified Clients">{props.data.data.sub_clients.unverified_client}</span>
                            </span> */}
                    </h2>
                </div>
            </div>
        </>
    );
}

export default IbDashboardHeader;
