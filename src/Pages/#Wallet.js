import { Fragment, useState, useEffect } from "react";
import Innerlayout from "../Components/Innerlayout";
import Accountstats from "./Accountverify/Accountstats";
import Documents from "./Accountverify/Documents";
import { redirectAsync, showClient } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pagination from "../Components/Pagination";
import PropagateLoader from "react-spinners/PropagateLoader";

const base_url = process.env.REACT_APP_API_URL;
const PAYMENT_METHODS_API_URL = base_url+"/v1/client/list-paymentmethods";
const TBL_SHOW_RECORDS = process.env.TBL_SHOW_RECORDS==null ? 10 : process.env.TBL_SHOW_RECORDS;
const TBL_PER_PAGE = process.env.TBL_PER_PAGE==null ? 2 : process.env.TBL_PER_PAGE;

const Wallet = () => {

    const [listData, setListData] = useState(null);
    let [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        'account_balance':'',
        'deposit':'',
        'withdraw':'',
        'mt_wallet':'',
        'wallet_mt':'',
    });

    const dispatch = useDispatch();
    const client = useSelector(showClient);

    async function fetchData() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            const bodyParameters = {
                key: "value"
            };

            const response = await axios.post(PAYMENT_METHODS_API_URL, bodyParameters, config)
            setListData(response.data.data.listing);
            setData((prevValue) => ({
                ...prevValue,
                'account_balance': response.data.data.accountBalance,
                'deposit': response.data.data.deposit_totalamount,
                'withdraw': response.data.data.withdraw_totalamount,
                'mt_wallet': response.data.data.mt5_to_wallet_totalamount,
                'wallet_mt': response.data.data.wallet_to_mt5_totalamount,
            }));

        } catch (error) {
            if(error.response.status==401){
                dispatch(redirectAsync());
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(TBL_SHOW_RECORDS);

    //---use for not show all pages at time, It divide pages in given number
    const [pageNumberLimit, setPageNumberLimit] = useState(TBL_PER_PAGE);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(TBL_PER_PAGE);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    //---pagination first and last record logic for show current page data
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = listData!==null && listData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(listData!==null && listData.length / recordsPerPage);


    //---pagination over

    function checkUserId(data){
        let id = '';
        if(data.payment_user_id != null) {
            id = data.payment_user_id;
        }
        else {
            if(data.connect != null) {
                id = <a href={`${data.connect}`} className="btn btn-primary btn-sm">{data.payment_name} Connect</a>;
            }
            else {
                id = '-';
            }
        }
        return id;
    }

    if (listData === null) {
        return (
            <Fragment>
                <Innerlayout>
                    <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
                        cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </Innerlayout>
            </Fragment>
        );
    }
    else{
        return(
            <Fragment>
                <Innerlayout>
                {
                    (client.asIB==false || client.asIB=='both') ?
                    <div className="row">
                        <div className="col-sm-6 col-lg-6 col-xl-3">
                            <div className="card-body account-details-box">
                                <span className="icon"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.25341 10.4133C7.93341 10.4133 7.64007 10.2666 7.44007 9.99994C7.21341 9.69327 7.18674 9.29323 7.36007 8.9599C7.58674 8.50656 7.90674 8.0666 8.32007 7.6666L12.6534 3.31992C14.8667 1.11992 18.4667 1.11992 20.6801 3.31992L23.0134 5.69329C24.0001 6.66663 24.6001 7.97329 24.6667 9.35996C24.6801 9.66663 24.5601 9.95993 24.3334 10.1599C24.1067 10.3599 23.8001 10.4533 23.5067 10.3999C23.2401 10.3599 22.9601 10.3466 22.6667 10.3466H9.33341C9.01341 10.3466 8.70674 10.3733 8.40007 10.4133C8.36007 10.4133 8.30674 10.4133 8.25341 10.4133ZM10.4801 8.33327H22.4267C22.2534 7.87994 21.9734 7.46661 21.6001 7.09328L19.2534 4.71991C17.8267 3.30657 15.4934 3.30657 14.0534 4.71991L10.4801 8.33327Z" fill="#4410AD"/>
                                    <path d="M6.66668 31.6667C4.45334 31.6667 2.37334 30.4933 1.25334 28.5867C0.653344 27.6267 0.333344 26.4933 0.333344 25.3333C0.333344 21.84 3.17334 19 6.66668 19C10.16 19 13 21.84 13 25.3333C13 26.4933 12.68 27.6267 12.08 28.6C10.96 30.4934 8.88001 31.6667 6.66668 31.6667ZM6.66668 21C4.28001 21 2.33334 22.9467 2.33334 25.3333C2.33334 26.12 2.54668 26.8933 2.96001 27.56C3.74668 28.8933 5.13334 29.6667 6.66668 29.6667C8.20001 29.6667 9.58668 28.88 10.3733 27.5733C10.7867 26.8933 11 26.1333 11 25.3333C11 22.9467 9.05334 21 6.66668 21Z" fill="#4410AD"/>
                                    <path d="M8.65302 26.3066H4.67969C4.13302 26.3066 3.67969 25.8533 3.67969 25.3066C3.67969 24.76 4.13302 24.3066 4.67969 24.3066H8.66635C9.21302 24.3066 9.66635 24.76 9.66635 25.3066C9.66635 25.8533 9.21302 26.3066 8.65302 26.3066Z" fill="#4410AD"/>
                                    <path d="M6.66666 28.3466C6.11999 28.3466 5.66666 27.8933 5.66666 27.3466V23.36C5.66666 22.8133 6.11999 22.36 6.66666 22.36C7.21332 22.36 7.66666 22.8133 7.66666 23.36V27.3466C7.66666 27.9066 7.21332 28.3466 6.66666 28.3466Z" fill="#4410AD"/>
                                    <path d="M22.6667 30.3334H10.1733C9.74665 30.3334 9.37332 30.0667 9.22665 29.6801C9.07998 29.2801 9.19998 28.84 9.51998 28.5734C9.83998 28.3067 10.1333 27.96 10.3467 27.5867C10.7733 26.9067 10.9867 26.1334 10.9867 25.3467C10.9867 22.9601 9.03998 21.0134 6.65332 21.0134C5.41332 21.0134 4.22665 21.5467 3.39998 22.4934C3.11998 22.8 2.67998 22.9201 2.29332 22.7734C1.90665 22.6267 1.63998 22.2534 1.63998 21.84V16C1.63998 11.8934 4.17332 8.92005 8.10665 8.42672C8.46665 8.37338 8.87998 8.33337 9.30665 8.33337H22.64C22.96 8.33337 23.3733 8.3467 23.8 8.41337C27.7333 8.8667 30.3067 11.8534 30.3067 16V22.6667C30.3333 27.2534 27.2533 30.3334 22.6667 30.3334ZM12.24 28.3334H22.6667C26.1067 28.3334 28.3333 26.1067 28.3333 22.6667V16C28.3333 12.88 26.5067 10.7333 23.5467 10.3867C23.2267 10.3333 22.9467 10.3334 22.6667 10.3334H9.33332C9.01332 10.3334 8.70665 10.36 8.39998 10.4C5.46665 10.7734 3.66665 12.9067 3.66665 16V19.7601C4.57332 19.2667 5.61332 19 6.66665 19C10.16 19 13 21.84 13 25.3334C13 26.3867 12.7333 27.4267 12.24 28.3334Z" fill="#4410AD"/>
                                    <path d="M29.3333 23H25.3333C23.3067 23 21.6667 21.36 21.6667 19.3333C21.6667 17.3066 23.3067 15.6666 25.3333 15.6666H29.3333C29.88 15.6666 30.3333 16.12 30.3333 16.6666C30.3333 17.2133 29.88 17.6666 29.3333 17.6666H25.3333C24.4133 17.6666 23.6667 18.4133 23.6667 19.3333C23.6667 20.2533 24.4133 21 25.3333 21H29.3333C29.88 21 30.3333 21.4533 30.3333 22C30.3333 22.5466 29.88 23 29.3333 23Z" fill="#4410AD"/>
                                    </svg>                            
                                </span>
                                <h2><span>Deposit</span> ${data!==null && data.deposit.toLocaleString()}</h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-6 col-xl-3">
                            <div className="card-body account-details-box">
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
                                <h2><span>Withdraw</span> ${data!==null && data.withdraw.toLocaleString()}</h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-6 col-xl-3">
                            <div className="card-body account-details-box">
                                <span className="icon"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.6533 30.3334H8.34667C5.02667 30.3334 2.33333 27.64 2.33333 24.32V15.3467C2.33333 12.0267 5.02667 9.33337 8.34667 9.33337H23.6533C26.9733 9.33337 29.6667 12.0267 29.6667 15.3467V17.2667C29.6667 17.8134 29.2133 18.2667 28.6667 18.2667H25.9733C25.5067 18.2667 25.08 18.4401 24.7733 18.7601L24.76 18.7734C24.3867 19.1334 24.2133 19.6267 24.2533 20.1333C24.3333 21.0133 25.1733 21.72 26.1333 21.72H28.6667C29.2133 21.72 29.6667 22.1733 29.6667 22.72V24.3067C29.6667 27.64 26.9733 30.3334 23.6533 30.3334ZM8.34667 11.3334C6.13333 11.3334 4.33333 13.1334 4.33333 15.3467V24.32C4.33333 26.5334 6.13333 28.3334 8.34667 28.3334H23.6533C25.8667 28.3334 27.6667 26.5334 27.6667 24.32V23.7334H26.1333C24.12 23.7334 22.4133 22.24 22.2533 20.32C22.1467 19.2267 22.5467 18.1467 23.3467 17.3601C24.04 16.6534 24.9733 16.2667 25.9733 16.2667H27.6667V15.3467C27.6667 13.1334 25.8667 11.3334 23.6533 11.3334H8.34667Z" fill="#4410AD"/>
                                    <path d="M3.33333 17.5466C2.78667 17.5466 2.33333 17.0933 2.33333 16.5466V10.4534C2.33333 8.46671 3.58667 6.66663 5.44 5.95997L16.0267 1.95997C17.12 1.54663 18.3333 1.69336 19.28 2.36003C20.24 3.0267 20.8 4.10669 20.8 5.26669V10.3333C20.8 10.88 20.3467 11.3333 19.8 11.3333C19.2533 11.3333 18.8 10.88 18.8 10.3333V5.26669C18.8 4.76002 18.56 4.29334 18.1333 4.00001C17.7067 3.70667 17.2 3.64 16.72 3.82667L6.13333 7.82666C5.05333 8.24 4.32 9.29337 4.32 10.4534V16.5466C4.33333 17.1066 3.88 17.5466 3.33333 17.5466Z" fill="#4410AD"/>
                                    <path d="M26.1333 23.7332C24.12 23.7332 22.4133 22.2399 22.2533 20.3199C22.1466 19.2132 22.5466 18.1333 23.3466 17.3466C24.0266 16.6533 24.96 16.2666 25.96 16.2666H28.7333C30.0533 16.3066 31.0666 17.3465 31.0666 18.6265V21.3733C31.0666 22.6533 30.0533 23.6932 28.7733 23.7332H26.1333ZM28.7066 18.2666H25.9733C25.5066 18.2666 25.08 18.4399 24.7733 18.7599C24.3866 19.1333 24.2 19.6399 24.2533 20.1466C24.3333 21.0266 25.1733 21.7332 26.1333 21.7332H28.7466C28.92 21.7332 29.08 21.5733 29.08 21.3733V18.6265C29.08 18.4265 28.92 18.2799 28.7066 18.2666Z" fill="#4410AD"/>
                                    <path d="M18.6667 17H9.33333C8.78667 17 8.33333 16.5467 8.33333 16C8.33333 15.4533 8.78667 15 9.33333 15H18.6667C19.2133 15 19.6667 15.4533 19.6667 16C19.6667 16.5467 19.2133 17 18.6667 17Z" fill="#4410AD"/>
                                    </svg>
                                </span>
                                <h2><span>Wallet To MT5</span> ${data!==null && data.wallet_mt.toLocaleString()}</h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-6 col-xl-3">
                            <div className="card-body account-details-box">
                                <span className="icon"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.6533 30.3334H8.34667C5.02667 30.3334 2.33333 27.64 2.33333 24.32V15.3467C2.33333 12.0267 5.02667 9.33337 8.34667 9.33337H23.6533C26.9733 9.33337 29.6667 12.0267 29.6667 15.3467V17.2667C29.6667 17.8134 29.2133 18.2667 28.6667 18.2667H25.9733C25.5067 18.2667 25.08 18.4401 24.7733 18.7601L24.76 18.7734C24.3867 19.1334 24.2133 19.6267 24.2533 20.1333C24.3333 21.0133 25.1733 21.72 26.1333 21.72H28.6667C29.2133 21.72 29.6667 22.1733 29.6667 22.72V24.3067C29.6667 27.64 26.9733 30.3334 23.6533 30.3334ZM8.34667 11.3334C6.13333 11.3334 4.33333 13.1334 4.33333 15.3467V24.32C4.33333 26.5334 6.13333 28.3334 8.34667 28.3334H23.6533C25.8667 28.3334 27.6667 26.5334 27.6667 24.32V23.7334H26.1333C24.12 23.7334 22.4133 22.24 22.2533 20.32C22.1467 19.2267 22.5467 18.1467 23.3467 17.3601C24.04 16.6534 24.9733 16.2667 25.9733 16.2667H27.6667V15.3467C27.6667 13.1334 25.8667 11.3334 23.6533 11.3334H8.34667Z" fill="#4410AD"/>
                                    <path d="M3.33333 17.5466C2.78667 17.5466 2.33333 17.0933 2.33333 16.5466V10.4534C2.33333 8.46671 3.58667 6.66663 5.44 5.95997L16.0267 1.95997C17.12 1.54663 18.3333 1.69336 19.28 2.36003C20.24 3.0267 20.8 4.10669 20.8 5.26669V10.3333C20.8 10.88 20.3467 11.3333 19.8 11.3333C19.2533 11.3333 18.8 10.88 18.8 10.3333V5.26669C18.8 4.76002 18.56 4.29334 18.1333 4.00001C17.7067 3.70667 17.2 3.64 16.72 3.82667L6.13333 7.82666C5.05333 8.24 4.32 9.29337 4.32 10.4534V16.5466C4.33333 17.1066 3.88 17.5466 3.33333 17.5466Z" fill="#4410AD"/>
                                    <path d="M26.1333 23.7332C24.12 23.7332 22.4133 22.2399 22.2533 20.3199C22.1466 19.2132 22.5466 18.1333 23.3466 17.3466C24.0266 16.6533 24.96 16.2666 25.96 16.2666H28.7333C30.0533 16.3066 31.0666 17.3465 31.0666 18.6265V21.3733C31.0666 22.6533 30.0533 23.6932 28.7733 23.7332H26.1333ZM28.7066 18.2666H25.9733C25.5066 18.2666 25.08 18.4399 24.7733 18.7599C24.3866 19.1333 24.2 19.6399 24.2533 20.1466C24.3333 21.0266 25.1733 21.7332 26.1333 21.7332H28.7466C28.92 21.7332 29.08 21.5733 29.08 21.3733V18.6265C29.08 18.4265 28.92 18.2799 28.7066 18.2666Z" fill="#4410AD"/>
                                    <path d="M18.6667 17H9.33333C8.78667 17 8.33333 16.5467 8.33333 16C8.33333 15.4533 8.78667 15 9.33333 15H18.6667C19.2133 15 19.6667 15.4533 19.6667 16C19.6667 16.5467 19.2133 17 18.6667 17Z" fill="#4410AD"/>
                                    </svg>
                                </span>
                                <h2><span>MT5 To Wallet</span> ${data!==null && data.mt_wallet.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div> : null
                }
                <div className="row align-items-center mt-32">
                    <div className="col-sm-6 col-lg-6 mb-3 mb-sm-0">
                        <h2 className="mb-0">Wallet Balance: ${data!==null && data.account_balance.toLocaleString()}</h2>
                    </div>
                    <div className="col-sm-6 col-lg-6 ms-auto">
                        <Link to="/create/payment/method" className="btn btn-primary float-end">Add Payment Method</Link>
                    </div>
                </div>
                <div className="card-body p-0 table-last-col">
                    <div className="table-responsive">
                        <Table className="table m-0 align-middle wallet-table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Payment Method</th>
                                    {/* <th scope="col">Type</th> */}
                                    <th scope="col">Setting</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                currentRecords.map((data,i) =>
                                <tr>
                                    <th scope="row">{i+1}</th>
                                    <td>{data.payment_name}</td>
                                    {/* <td>{data.payment_type}</td> */}
                                    <td>{checkUserId(data)}</td>                                    
                                    <td>
                                        <Link to={{ pathname:'/edit/payment/method', state:{payment_id:data.id} }} className="edit-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#0B0B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M16.0399 3.02001L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96001C22.3399 6.60001 22.9799 5.02001 20.9799 3.02001C18.9799 1.02001 17.3999 1.66001 16.0399 3.02001Z" stroke="#0B0B16" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M14.9102 4.15002C15.5802 6.54002 17.4502 8.41002 19.8502 9.09002" stroke="#0B0B16" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        </Link>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                        {
                            listData.length > TBL_SHOW_RECORDS ?
                            <Pagination
                                nPages={nPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                maxPageLimit={maxPageNumberLimit}
                                minPageLimit={minPageNumberLimit}
                                perPageLimit={pageNumberLimit}
                                setMaxPageNumberLimit={setMaxPageNumberLimit}
                                setMinPageNumberLimit={setMinPageNumberLimit}
                            /> : null
                        }
                    </div>
                </div>
                </Innerlayout>
            </Fragment>
        );
    }
}

export default Wallet;