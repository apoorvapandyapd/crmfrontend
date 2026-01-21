import React, {Suspense} from 'react';
import {Route} from "react-router-dom";
import {Switch} from 'react-router-dom';
import BecomeIb from '../Pages/IB/BecomeIb';
import Notification from '../Pages/Notification';
import Signup from '../Pages/Signup';
import TermsConditions from '../Pages/TermsConditions.js';
// import TermsCondition from '../Pages/#TermsCondition.js';
// import TradeHistory from '../Pages/#TradeHistory.js';
// import TradingSteps from '../Pages/#TradingSteps.js';
import IndividualForm from '../Pages/MtAccount/IndividualForm';
import HandleEpay from '../Pages/HandleEpay';
import TabIndex from '../Pages/Individualform/TabIndex.js';
import WithdrawRequest from '../Pages/Wallet/WithdrawRequest.js';
import ChooseForm from '../Pages/MtAccount/ChooseForm.js';


// const Home = React.lazy(() => import('../Pages/Home'));
// const Signup = React.lazy(() => import('../Pages/Signup'));
// const Newdeposit = React.lazy(() => import('../Pages/Newdeposit'));
// const Ibwithdrawrequest = React.lazy(() => import('../Pages/Ibwithdrawrequest'));
// const Newwithdraw = React.lazy(() => import('../Pages/Newwithdraw.js'));
// const Newtransfer = React.lazy(() => import('../Pages/Newtransfer'));
const CreateLive = React.lazy(() => import('../Pages/MtAccount/CreateLive'));

const MyWallet = React.lazy(() => import('../Pages/Wallet/MyWallet'));
const Login = React.lazy(() => import('../Pages/Login'));
const Nomatch = React.lazy(() => import('../Pages/Nomatch'));
const Verify = React.lazy(() => import('../Pages/Verify'));
const Dashboard = React.lazy(() => import('../Pages/Dashboard'));
const Accountverification = React.lazy(() => import('../Pages/Accountverification'));
const Profile = React.lazy(() => import('../Pages/Profile'));
const Settings = React.lazy(() => import('../Pages/Settings'));
const Faq = React.lazy(() => import('../Pages/Faq'));
const Changepassword = React.lazy(() => import('../Pages/Changepassword'));
// const Depositlist = React.lazy(() => import('../Pages/#Depositlist.js'));
// const Payment = React.lazy(() => import('../Pages/#Payment.js'));
// const Withdrawrequest = React.lazy(() => import('../Pages/#Withdrawrequest.js'));
// const Ibwithdrawrequest = React.lazy(() => import('../Pages/#Ibwithdrawrequest.js'));
// const Newwithdraw = React.lazy(() => import('../Pages/#Newwithdraw.js'));
// const Transfer = React.lazy(() => import('../Pages/#Transfer.js'));
const Ticket = React.lazy(() => import('../Pages/Ticket'));
const CreateTicket = React.lazy(() => import('../Pages/Ticketpages/CreateTicket'));
const ShowTicket = React.lazy(() => import('../Pages/Ticketpages/ShowTicket'));
const DocumentUpload = React.lazy(() => import('../Pages/DocumentUpload'));
// const UpdateDocument = React.lazy(() => import('../Pages/DocumentUpload/#UpdateDocument.js'));
const ForgotPassword = React.lazy(() => import('../Pages/ForgotPassword'));
const ForgotPasswordOuter = React.lazy(() => import('../Pages/ForgotPasswordOuter'));
const CreateDemo = React.lazy(() => import('../Pages/MtAccount/CreateDemo'));
// const EditAccount = React.lazy(() => import('../Pages/MtAccount/EditAccount'));
// const EditLiveAccount = React.lazy(() => import('../Pages/MtAccount/EditLiveAccount'));
const ChangeMtPass = React.lazy(() => import('../Pages/MtAccount/ChangeMtPass'));
const ChangeInvestPass = React.lazy(() => import('../Pages/MtAccount/ChangeInvestPass'));
const MtAccount = React.lazy(() => import('../Pages/MtAccount'));
// const Wallet = React.lazy(() => import('../Pages/#Wallet.js'));
// const CreatePayment = React.lazy(() => import('../Pages/WalletPage/#CreatePayment.js'));
// const EditPayment = React.lazy(() => import('../Pages/WalletPage/#EditPayment.js'));
// const IpCheck = React.lazy(() => import('../Pages/#IpCheck.js'));
const Paymentreport = React.lazy(() => import('../Pages/Reports/Paymentreport'));
const IbDashboard = React.lazy(() => import('../Pages/IB/IbDashboard'));
const IbClient = React.lazy(() => import('../Pages/IB/IbClient'));
// const SubIb = React.lazy(() => import('../Pages/IB/#SubIb.js'));
// const NewIbWithdraw = React.lazy(() => import('../Pages/IB/#Newibwithdraw.js'));
const Trades = React.lazy(() => import('../Pages/Trades'));
const Corporate = React.lazy(() => import('../Pages/Corporate'));
const Platform = React.lazy(() => import('../Pages/Platform/Platform.js'));

function Routes(props) {
    return (
        <Suspense fallback={<div></div>}>

            <Switch>
                <Route exact path="/">
                    <Login/>
                </Route>
                <Route path="/login" exact>
                    <Login/>
                </Route>
                <Route path="/signup">
                    <Signup/>
                </Route>
                <Route path="/ib-signup" exact>
                    <Signup type='ib'/>
                </Route>
                <Route path="/verify">
                    <Verify/>
                </Route>
                <Route path="/dashboard">
                    <Dashboard/>
                </Route>
                <Route path="/accountverification">
                    <Accountverification/>
                </Route>
                <Route path="/profile">
                    <Profile/>
                </Route>
                <Route path="/settings">
                    <Settings/>
                </Route>
                <Route path="/changepassword">
                    <Changepassword/>
                </Route>
                {/* <Route path="/deposit">
                    <Depositlist/>
                </Route> */}
                {/* <Route path="/newdeposit">
                    <Newdeposit />
                </Route> */}
                {/* <Route path="/payment/:id">
                    <Payment />
                </Route> */}
                {/* <Route path="/withdrawrequest">
                    <Withdrawrequest />
                </Route> */}
                <Route path="/ibwithdrawrequest">
                    <MyWallet />
                </Route>
                {/* <Route path="/newwithdraw">
                    <Newwithdraw />
                </Route> */}
                {/* <Route path="/withdrawalrequest">
                    <WithdrawRequest />
                </Route>
                <Route path="/newibwithdraw">
                    <NewIbWithdraw />
                </Route>

                <Route path="/transfer">
                    <Transfer />
                </Route> */}
                {/* <Route path="/newtransfer">
                    <Newtransfer />
                </Route> */}
                <Route path="/faq">
                    <Faq/>
                </Route>
                <Route path="/ticket">
                    <Ticket/>
                </Route>
                <Route path="/create/ticket">
                    <CreateTicket/>
                </Route>
                <Route path="/show/ticket">
                    <ShowTicket/>
                </Route>
                {/* <Route path="/document/upload">
                    <DocumentUpload/>
                </Route>
                <Route path="/update/document">
                    <UpdateDocument/>
                </Route> */}

                <Route path="/password/forgot/:token">
                    <ForgotPasswordOuter/>
                </Route>
                <Route path="/forgot/password">
                    <ForgotPassword/>
                </Route>
                <Route path="/list/trading-accounts">
                    <MtAccount/>
                </Route>
                {/* <Route path="/edit/account">
                    <EditAccount/>
                </Route>
                <Route path="/edit/liveaccount">
                    <EditLiveAccount/>
                </Route> */}
                <Route path="/change/main-password/:id">
                    <ChangeMtPass/>
                </Route>
                <Route path="/change/invest-password/:id">
                    <ChangeInvestPass/>
                </Route>
                <Route path="/create/demo/account">
                    <CreateDemo/>
                </Route>
                <Route path="/create/live/account">
                    <CreateLive />
                </Route>
                <Route path="/choose/form">
                    <ChooseForm />
                </Route>
                {/* <Route path="/list/wallet">
                    <Wallet/>
                </Route> */}
                {/* <Route path="/create/payment/method">
                    <CreatePayment/>
                </Route> */}
                {/* <Route path="/edit/payment/method">
                    <EditPayment/>
                </Route> */}
                <Route path="/all/notification">
                    <Notification/>
                </Route>
                {/* <Route path="/ip-check">
                    <IpCheck/>
                </Route> */}
                <Route path="/report/payment">
                    <Paymentreport/>
                </Route>
                <Route path="/terms/:token">
                    <TermsConditions/>
                </Route>
                {/* <Route path="/trade/history">
                    <TradeHistory/>
                </Route> */}
                <Route path="/ib/dashboard">
                    <IbDashboard/>
                </Route>
                <Route path="/ib/client">
                    <IbClient/>
                </Route>
                {/* <Route path="/ib/profile">
                    <SubIb/>
                </Route> */}
                <Route path="/becomeib">
                    <BecomeIb/>
                </Route>
                {/* <Route path="/tradingsteps">
                    <TradingSteps/>
                </Route> */}
                <Route path="/trades">
                    <Trades/>
                </Route>
                {/* <Route path="/terms-condition">
                    <TermsCondition/>
                </Route> */}
                <Route path="/individualdetails">
                    <IndividualForm/>
                </Route>
                <Route path="/corporate">
                    <Corporate/>
                </Route>
                <Route path="/handleEpay">
                    <HandleEpay/>
                </Route>
                <Route path="/mywallet">
                    <MyWallet/>
                </Route>
                <Route path="/ibmywallet">
                    <MyWallet/>
                </Route>
                <Route path="/individuals">
                    <TabIndex/>
                </Route>
                <Route path="/platform">
                    <Platform />
                </Route>
                <Route path="*">
                    <Nomatch/>
                </Route>

            </Switch>
        </Suspense>
    );
}

export default Routes;