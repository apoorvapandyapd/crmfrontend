import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import {DeviceUUID} from 'device-uuid';

const base_url = process.env.REACT_APP_API_URL;
const REGISTER_API_URL = base_url+"/store";
const LOGIN_API_URL = base_url+"/login";
const VERIFY_API_URL = base_url+"/verification-client";
const LOGOUT_API_URL = base_url+"/logout";

const PROFILE_UPDATE_API = base_url+"/v1/client/update-profilephoto";
const PROFILE_DELETE_API = base_url+"/v1/client/delete-profilephoto";
const CLIENT_UPDATE_API = base_url+"/v1/client/update";
var uuid = new DeviceUUID().get();
const clientstate = {
  client: null,
  islogin: false,
  alreadyLogin: false,
  active: true,
  isverify: false,
  iserror: false,
  message: '',
  multiMessage: {},
  verifyerror: false,
  token: null,
  liveBalance: 0,
  demoBalance: 0,
  asIB: false,
  alertDiv:false
}

export const clientslice = createSlice({
  name: "client",
  initialState: clientstate,
  reducers: {
    register: (state, action) => {
      state.islogin = action.payload.login;
      state.isverify = action.payload.verify;
      state.alreadyLogin = action.payload.alreadyLogin;
      state.client = action.payload.client;
      state.iserror = action.payload.error;
      state.message = action.payload.message;
      state.alertDiv = action.payload.alert;
      state.verifyerror = false;
    },
    login: (state, action) => {
      state.islogin = action.payload.login;
      state.isverify = action.payload.verify;
      state.alreadyLogin = action.payload.alreadyLogin;
      state.client = action.payload.client;
      state.iserror = action.payload.error;
      state.message = action.payload.message;
      state.multiMessage = action.payload.multiMessage;
      state.token = action.payload.token;
      state.liveBalance = action.payload.balance;
      state.demoBalance = action.payload.demoBalance;
      state.asIB = action.payload.asIb;
      state.alertDiv = action.payload.alert;
      state.verifyerror = false;
    },
    verify: (state, action) => {
      state.islogin = action.payload.login;
      state.isverify = action.payload.verify;
      state.alreadyLogin = action.payload.alreadyLogin;
      if (action.payload.verifyerror === false)
        state.client = action.payload.client;
      state.iserror = action.payload.error;
      state.message = action.payload.message;
      state.verifyerror = action.payload.verifyerror;
      state.liveBalance = action.payload.balance;
      state.demoBalance = action.payload.demoBalance;
      state.asIB = action.payload.asIb;
      state.alertDiv = action.payload.alert;
      if (action.payload.verifyerror === false)
        state.token = action.payload.token;
    },
    logout: (state, action) => {
      state.client = [action.payload];
      state.isverify = false;
      state.islogin = false;
      state.alreadyLogin = false;
      state.iserror = false;
      state.message = '';
      state.verifyerror = false;
      state.token = null;
    },
    updateClient:(state,action)=>{
      state.client = action.payload;
      state.islogin = true;
      state.alreadyLogin = true;
    },
    errorClient:(state,action)=>{
      state.multiMessage = action.payload.messages;
      state.iserror = action.payload.error;
    },
    alertHandle:(state,action)=>{
      state.alertDiv = action.payload.alert;
    },
    clearError:(state,action)=>{
      state.iserror = false;
      state.message = '';
      state.multiMessage = '';
    },
  }
});

// Login Request
export const registerAsync = (data) => async (dispatch) => {
  try {

    // Adding files to the formdata
    let formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("country", data.country);
    formData.append("city", data.city);
    formData.append("phone_no", data.phone_no);
    formData.append("email", data.email);
    formData.append("password", data.password);
    // formData.append("address_1", data.address_1);
    // formData.append("gender", data.gender);
    // formData.append("dob", data.dob);
    formData.append("ib_referral_code", data.referral_code);
    formData.append("client_type",data.type);
    formData.append("current_url",data.current_url);


    const response = await axios.post(REGISTER_API_URL, formData);

    if (response.status === 200 && response.data.status_code === 200) {
      let clientdata = null;
      if (response.data.data.already_login === 1) {
        clientdata = { login: true, verify: true,alreadyLogin: true, client: response.data.data, error: false, message: '', token:response.data.token,alert:false };
      }
      else {
        clientdata = { login: true, verify: false,alreadyLogin: false, client: response.data.data, error: false, message: '', token: null,alert:false };
      }
      dispatch(login(clientdata));
    }
    else {

      const clientdata = { login: false, verify: false,alreadyLogin: false, client: response.data.data, error: true, message: response.data.error,alert:false };
      dispatch(login(clientdata));
    }

  } catch (err) {
    const clientdata = { login: false, verify: false,alreadyLogin: false, client: null, error: true,message: err.response.data,alert:false };
    dispatch(login(clientdata));
    throw new Error(err);
  }
};


// Login Request
export const loginAsync = (data) => async (dispatch) => {
  try {

    // Adding files to the formdata
    let formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("browser", data.browser);
    formData.append("platform", data.platform);
    formData.append("ip_address", data.ip_address);
    formData.append("device_id", uuid);


    const response = await axios.post(LOGIN_API_URL, formData);

    if (response.status === 200 && response.data.status_code === 200) {
      let clientdata = null;
      if (response.data.data.already_login === 1) {
        clientdata = { login: true, verify: true,alreadyLogin: true, client: response.data.data, error: false, message: '', token:response.data.token, balance:response.data.data.live_balance, demoBalance:response.data.data.demo_balance, asIb:response.data.data.ib_status,alert:false };
      }
      else {
        clientdata = { login: true, verify: false, alreadyLogin: false, client: response.data.data, error: false, message: '', token: null, balance:response.data.data.live_balance, demoBalance:response.data.data.demo_balance, asIb:response.data.data.ib_status,alert:false };
      }
      dispatch(login(clientdata));
    }
    else {
      const clientdata = { login: false, verify: false, alreadyLogin: false, client: response.data.data, error: true, message: response.data.message,alert:false };
      dispatch(login(clientdata));
    }

  } catch (err) {
    throw new Error(err);
  }
};

// Verify Request
export const verifyAsync = (data) => async (dispatch) => {

  try {

    // Adding files to the formdata
    let formData = new FormData();
    formData.append("code", data.code);
    formData.append("id", data.id);


    const response = await axios.post(VERIFY_API_URL, data);

    if (response.status === 200 && response.data.status_code === 200) {
      const clientdata = { login: true, verify: true, alreadyLogin: true, client: response.data.data, error: false, message: '', verifyerror: false, token:response.data.token, balance:response.data.data.live_balance, demoBalance:response.data.data.demo_balance, asIb:response.data.data.ib_status, alert:false  };
      dispatch(verify(clientdata));
    }
    else {
      const clientdata = { login: true, verify: false,alreadyLogin: false, client: showClient, error: true, message: response.data.error, verifyerror: true, alert:false };
      dispatch(verify(clientdata));
    }

  } catch (err) {
    throw new Error(err);
  }
};

// Logout Request
export const logoutAsync = (data) => async (dispatch) => {
  try {



    const config = {
      headers: { Authorization: `Bearer ${data.token}` }
    };

    
    const response = await axios.post(LOGOUT_API_URL, {}, config);

    if (response.status === 200 && response.data.status_code === 200) {
      let clientdata = { login: false, verify: true, alreadyLogin: false, client: null, error: false, message: '' };
      
      dispatch(logout(clientdata));
    }
    

  } catch (err) {
    throw new Error(err);
  }
};

export const updateClientAsync = (data,token,status) => async (dispatch) => {
  try {
    if (status !== 'delete') {
          const formData = new FormData();
          formData.append('profile_photo',data);

          const config = {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${token}`
              },
          };
    
          axios.post(PROFILE_UPDATE_API, formData, config).then((response) => {
            if (response.data.status_code === 200) {

                  const clientData = response.data.data;
                  dispatch(updateClient(clientData));
              }
              else if (response.data.status_code === 500) {
                  let err = response.data.errors;
                  console.log(err);
              }
          }).catch((error)=>{
              console.log(error);
              if (error.response) {
                  let err = error.response.data.errors;
                  console.log(err);
              }
          });
      }
      else{
        const data = {
          key: "value"
        };

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        };
        axios.post(PROFILE_DELETE_API, data, config).then((response) => {
          if (response.data.status_code === 200) {

              const clientData = response.data.data;
              dispatch(updateClient(clientData));
          }
          else if (response.data.status_code === 500) {
              let err = response.data.errors;
              console.log(err);
          }
        }).catch((error)=>{
            console.log(error);
            if (error.response) {
                let err = error.response.data.errors;
                console.log(err);
            }
        });
      }
    }
    catch (err) {
        throw new Error(err);
    }
};

export const updateClientDataAsync = (data,token,isUpdate=null) => async (dispatch) => {
      try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        if(isUpdate!==null){
          dispatch(updateClient(data));
        }
        else{
          await axios.put(CLIENT_UPDATE_API, data, config).then((res)=>{
              if(res.data.status_code===200){

                  const clientData = res.data.data;
                  dispatch(updateClient(clientData));

                  let data = { error:false,  messages: {}}
                  dispatch(errorClient(data));

              }
              else if (res.data.status_code === 500) {
                ;
              }
          }).catch((error) => {
              if (error.response) {
                  console.log(error.response.data.error);
                  let data = { error:true ,messages: error.response.data.error}
                  dispatch(errorClient(data));
              }
          });
        }

        
    } catch (error) {
        console.error(error);
    }
};

export const redirectAsync = () => async (dispatch) => {
  try {
    
    let clientdata = { login: false, verify: true, alreadyLogin: false, client: null, error: false, message: '', multiMessage: {} };

    dispatch(logout(clientdata));

  } catch (err) {
    throw new Error(err);
  }
};

export const alertAsync = (value) => async (dispatch) => {
  try {
    
    let data = { alertDiv: value};

    dispatch(alertHandle(data));

  } catch (err) {
    throw new Error(err);
  }
};

export const { login, verify, logout, updateClient, errorClient, alertHandle, clearError } = clientslice.actions;
export const showClient = (state) => state.client;
export default clientslice.reducer;
