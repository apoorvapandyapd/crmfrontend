import axios from "axios";

const base_url = process.env.REACT_APP_API_URL;
const version = 'v1';

const EndPoints = [
    
    {key:"register", url:base_url+"/store",method:"post"},
    {key:"verify", url:base_url+"/verification-client",method:"post"},

    {key:"login", url:base_url+"/login",method:"post"},
    {key:"logout", url:base_url+"/logout",method:"post"},
    {key:"update-profilephoto", url:base_url+"/"+version+"/client/update-profilephoto",method:"post"},
    {key:"delete-profilephoto", url:base_url+"/"+version+"/client/delete-profilephoto",method:"post"},
    {key:"update", url:base_url+"/"+version+"/client/update",method:"put"},
    

    {key:"dashboard", url:base_url+"/"+version+"/dashboard",method:"post"},
    {key:"reset-password", url:base_url+"/reset-password",method:"post"},

    {key:"list-mtaccount", url:base_url+"/"+version+"/client/list-mtaccount",method:"post"},
    {key:"show-mtpassword", url:base_url+"/"+version+"/client/show-mtpassword",method:"post"},
    {key:"list-document", url:base_url+"/"+version+"/client/list-document",method:"post"},

    {key:"open-order", url:base_url+"/"+version+"/client/open-order",method:"post"},
    {key:"close-order", url:base_url+"/"+version+"/client/close-order",method:"post"},
    
    {key:"list-paymentmethods", url:base_url+"/"+version+"/client/list-paymentmethods",method:"post"},

    {key:"paymentreport", url:base_url+"/"+version+"/client/paymentreport",method:"post"},
    {key:"downloadreport", url:base_url+"/"+version+"/client/download-report",method:"get"},

    {key:"list-faq", url:base_url+"/"+version+"/client/list-faq",method:"post"},
    {key:"list-faq-ib", url:base_url+"/"+version+"/client/list-faq-ib",method:"post"},
    {key:"list-ticket", url:base_url+"/"+version+"/client/list-ticket",method:"post"},

    {key:"create-ticket", url:base_url+"/"+version+"/client/create-ticket",method:"post"},
    {key:"store-ticket", url:base_url+"/"+version+"/client/store-ticket",method:"post"},
    {key:"show-ticket", url:base_url+"/"+version+"/client/show-ticket",method:"post"},
    {key:"send-message", url:base_url+"/"+version+"/client/send-message",method:"post"},
    {key:"download-document/ticket", url:base_url+"/"+version+"/client/download-document/ticket",method:"get"},
    {key:"delete-ticket", url:base_url+"/"+version+"/client/delete-ticket",method:"post"},
    {key:"delete-message", url:base_url+"/"+version+"/client/delete-message",method:"post"},
    {key:"delete-ticketDocument", url:base_url+"/"+version+"/client/delete-ticketDocument",method:"post"},

    {key:"change-message", url:base_url+"/"+version+"/client/change-message",method:"post"},

    {key:"change-status", url:base_url+"/"+version+"/client/change-status",method:"post"},
    {key:"ticket-review", url:base_url+"/"+version+"/client/ticket-review",method:"post"},

    {key:"header-notification", url:base_url+"/"+version+"/client/header-notification",method:"post"},
    {key:"update-notification", url:base_url+"/"+version+"/client/update-notification",method:"post"},


    {key:"check-ib", url:base_url+"/"+version+"/ib/check-ib",method:"post"},
    { key: "store-ib", url: base_url + "/" + version + "/ib/store-ib", method: "post" },
    
    //Naidish change
    { key: "update-accounts", url: base_url + "/" + version + "/update-accounts", method: "post" },
    { key: "list-namedocument", url: base_url + "/" + version + "/client/list-namedocument", method: "post" },
    { key: "get-document", url: base_url + "/" + version + "/client/get-document", method: "post" },
    { key: "store-document", url: base_url + "/" + version + "/client/store-document", method: "post" },
    //mywallet - deposittable
    { key: "delete-depositrequest", url: base_url + "/" + version + "/client/delete-depositrequest", method: "post" },
    { key: "delete-proof", url: base_url + "/" + version + "/client/delete-proof", method: "post" },
    { key: "upload-proof", url: base_url + "/" + version + "/client/upload-proof", method: "post" },
    { key: "list-deposit", url: base_url + "/" + version + "/client/list-deposit", method: "post" },
    //mywallet - Withdrawtable
    { key: "delete-withdrawrequest", url: base_url + "/" + version + "/client/delete-withdrawrequest", method: "post" },
    { key: "list-withdraws", url: base_url + "/" + version + "/client/list-withdraws", method: "post" },
    //mywallet - transfertable
    { key: "list-mttranser", url: base_url + "/" + version + "/client/list-mttranser", method: "post" },
    //mywallet - depositrequest
    { key: "send-depositrequest", url: base_url + "/" + version + "/client/send-depositrequest", method: "post" },
    { key: "deposit-paymentmethods", url: base_url + "/" + version + "/client/deposit-paymentmethods", method: "post" },
    { key: "charge-paymentmethods", url: base_url + "/" + version + "/client/charge-paymentmethods", method: "post" },
    { key: "broker-bankDetails", url: base_url + "/" + version + "/client/broker-bankDetails", method: "get" },

    //mywallet - Ibwithdrawtable
    { key: "iblist-withdraws", url: base_url + "/" + version + "/client/iblist-withdraws", method: "post" },

    //mywallet - withdrawrequest
    { key: "send-withdrawrequest", url: base_url + "/" + version + "/client/send-withdrawrequest", method: "post" },
    { key: "withdraw-paymentmethods", url: base_url + "/" + version + "/client/withdraw-paymentmethods", method: "post" },
    // { key: "charge-paymentmethods", url: base_url + "/" + version + "/client/charge-paymentmethods", method: "post" },

    //mywallet - transferrequest
    { key: "send-mttransferrequest", url: base_url + "/" + version + "/client/send-mttransferrequest", method: "post" },
    //mywallet - ibcomwithdrawalrequest
    { key: "send-ibwithdrawrequest", url: base_url + "/" + version + "/client/send-ibwithdrawrequest", method: "post" },

    //ForgotPasswordOuter
    { key: "reset-password-outer", url: base_url + "/reset-password-outer", method: "post" },
    //ForgotPassword
    { key: "reset-password-email", url: base_url + "/reset-password-email", method: "post" },
    //ChangeMtPass
    { key: "update-mtpassword", url: base_url + "/" + version + "/client/update/mtpassword", method: "post" },
    //ChangeInvestPass
    { key: "update-investpassword", url: base_url + "/" + version + "/client/update/investpassword", method: "post" },
    //CreateDemo
    { key: "list-mtdetails", url: base_url + "/" + version + "/client/list-mtdetails", method: "post" },
    { key: "store-mtaccount", url: base_url + "/" + version + "/client/store-mtaccount", method: "post" },
    //Notification
    { key: "list-notification", url: base_url + "/" + version + "/client/list-notification", method: "post" },
    //TermsConditions
    { key: "save-emailtermsconditions", url: base_url + "/client/save-emailtermsconditions", method: "post" },
    { key: "get-termsconditions", url: base_url + "/client/get-termsconditions", method: "post" },
    //IbDashboard
    { key: "ib-dashboard", url: base_url + "/" + version + "/ib/dashboard", method: "post" },
    //IbDashboard - IbAllClientAccount
    { key: "getallibaccounts", url: base_url + "/" + version + "/ib/getallibaccounts", method: "post" },
    //IbDashboard - IbAllClientDeposit
    { key: "getallibdeposits", url: base_url + "/" + version + "/ib/getallibdeposits", method: "post" },
    //IbDashboard - IbAllClientWithdraw
    { key: "getallibwithdraw", url: base_url + "/" + version + "/ib/getallibwithdraw", method: "post" },
    //IbClient
    { key: "ib-client", url: base_url + "/" + version + "/ib/client", method: "post" },
    //IndividualForm
    { key: "fetch-individualform", url: base_url + "/" + version + "/client/fetch-individualform", method: "post" },
    { key: "store-individualform", url: base_url + "/" + version + "/client/store-individualform", method: "post" },
    //Corporate
    { key: "get-corporatedata", url: base_url + "/" + version + "/client/get-corporatedata", method: "post" },
    { key: "store-corporateform", url: base_url + "/" + version + "/client/store-corporateform", method: "post" },
    //HandleEpay
    { key: "pay-epay", url: base_url + "/" + version + "/client/pay-epay", method: "post" },




]

const checkKey  = (key) => {
    let urlArr = EndPoints.filter(element => element.key === key);

    if(urlArr.length)
        return {url: urlArr[0].url, method:urlArr[0].method};
    return '';
}

export const CustomRequest = (key, data, token, callBack) => {

    let {url,method} = checkKey(key);
    if(url === '') callBack({data:{status_code:0,error:'Invalid URL'}});
    let config;
    if(typeof(token) === 'object') {
        config = {
            headers: { 
                'Authorization': `Bearer `+token.token,
                'Content-Type': token.content_type
            }
        };
    } else {
        config = {
            headers: { Authorization: `Bearer `+token }
        };
    }
   
    if (method === 'get') {
        let params = '';
        if (typeof (data) === 'object') {
            for (let key in data) {
                params += "/" + key + "=" + data[key];
            }
        } else {
            params = "/" + data;
        }

        let urls = url + params;
        axios({
            url: urls,
            method: 'GET',
            responseType: 'blob', // important
        }).then((res) => {
            callBack(res);
        });
    } else {
        axios[method](url, data, config).then((res) => {

            callBack(res);
        }).catch((error) => {
            callBack({ error });
        });
    }

    // if (method === 'post') {
    //     axios[method](url, data, config).then((res) => {
    //         callBack(res);
    //     }).catch((error) => {
    //         callBack({ error });
    //     });
        
    // } else if(method === 'put') {
    //     axios.put(url, data, config).then((res)=>{
    //         callBack(res);
    //     }).catch((error) => {
    //        callBack({error});
    //     });
    // } else {
    //     let params = '';
    //     if(typeof(data) === 'object') {
    //         for (let key in data) {
    //             params += "/"+key+"="+data[key];
    //         }
    //     } else {
    //         params = "/"+data;
    //     }
       
    //     let urls = url+params;
    //     axios({
    //         url: urls,
    //         method: 'GET',
    //         responseType: 'blob', // important
    //     }).then((res) => {
    //         callBack(res);
    //     });
    // }
};