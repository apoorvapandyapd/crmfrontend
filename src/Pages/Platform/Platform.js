import React from 'react'
import Innerlayout from '../../Components/Innerlayout';
import { Link } from "react-router-dom";
function Platform() {
    const companyTitle  = process.env.REACT_APP_TITLE;
    console.log(companyTitle);
    return (
        <Innerlayout>
            <div className='box-wrapper'>
                <div className="card-body create-ticket p-0 bg-white">
                    <h2 className="mb-0 px-40">
                        <Link to='/dashboard'><a href={null} className="back-arrow">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.56945 18.82C9.37945 18.82 9.18945 18.75 9.03945 18.6L2.96945 12.53C2.67945 12.24 2.67945 11.76 2.96945 11.47L9.03945 5.4C9.32945 5.11 9.80945 5.11 10.0995 5.4C10.3895 5.69 10.3895 6.17 10.0995 6.46L4.55945 12L10.0995 17.54C10.3895 17.83 10.3895 18.31 10.0995 18.6C9.95945 18.75 9.75945 18.82 9.56945 18.82Z" fill="#0B0B16" />
                                <path d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z" fill="#0B0B16" />
                            </svg>
                        </a></Link>
                        Platforms Download
                    </h2>
                    <div className='p-3'>
                        {/* <h3 style={{ marginBottom: '12px' }}>Online trading with better-than-market conditions</h3> */}
                        <p>Ready to take your trading to the next level? Download the <strong>{companyTitle}</strong> MetaTrader platform now and enjoy lightning-fast execution, customizable charts, advanced technical analysis tools, and much more. Experience the freedom to trade anytime, anywhere, with the reliability and security of <strong>{companyTitle}</strong> backing you every step of the way.</p>
                        <div className='download-boxes d-flex justify-content-between flex-wrap'>
                            <div className='box p-4 text-center'>
                                <h3>Android App</h3>
                                <p>This Android app connects users to brokers, offering real-time market data, advanced chart analysis, and seamless trading experiences.</p>
                                <a download href='https://download.mql5.com/cdn/mobile/mt5/android?server=ParkMoney-Demo,ParkMoney-Server' className='btn btn-primary '>Download</a>
                            </div>
                            <div className='box p-4 text-center'>
                                <h3>IOS App</h3>
                                <p>This app links you to brokers for real-time market data, chart analysis, and trading, enhancing your financial decision-making.</p>
                                <a download href='https://download.mql5.com/cdn/mobile/mt5/ios?server=ParkMoney-Demo,ParkMoney-Server' className='btn btn-primary '>Download</a>
                            </div>
                            <div className='box p-4 text-center'>
                                <h3>Windows PC</h3>
                                <p>This desktop application provides direct access to broker servers, offering real-time market data, advanced chart analysis, and smooth trading functionalities.</p>
                                <a download href='https://download.mql5.com/cdn/web/park.money.limited/mt5/parkmoney5setup.exe' className='btn btn-primary '>Download</a>
                            </div>
                            {/* <div className='box p-4 text-center'>
                                <h3>Android App</h3>
                                <p>Explore a world of possibilities with our innovative Android app—download now and elevate your digital journey!</p>
                                <a href='#' className='btn btn-primary d-block'>Download</a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </Innerlayout >
    )
}

export default Platform
