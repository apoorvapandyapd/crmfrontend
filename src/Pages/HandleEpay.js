import React from 'react'
import { useSelector } from 'react-redux';
import { showClient } from '../store/clientslice';
import axios from 'axios';
import { PropagateLoader } from 'react-spinners';

const base_url = process.env.REACT_APP_API_URL;
const EPAY_API = base_url + "/v1/client/pay-epay";

function HandleEpay() {

    const client = useSelector(showClient);

    let gatewayID = localStorage.getItem('gatewayID');
    let orderID = localStorage.getItem('orderID');
    let customerID = localStorage.getItem('customerID');
    let amounts = localStorage.getItem('amounts');

    const config = {
        headers: { Authorization: `Bearer ${client.token}` }
    };

    const data = {
      gateway_id: gatewayID,
      orderId: orderID,
      customerId: customerID,
      amount: amounts,
    };

    axios.post(EPAY_API, data, config).then(response=>{

        if(response.data.status_code === 200){
          window.location.href = '/mywallet'
        }

    }).catch((error)=>{
        if (error.response) {
            let err = error.response.data.errors;
        }
    });

    return (
        <PropagateLoader
            color={'#000b3e'}
            loading={true}
            cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    )
}

export default HandleEpay
