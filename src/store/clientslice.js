import {createSlice} from "@reduxjs/toolkit";

import {DeviceUUID} from 'device-uuid';
import { CustomRequest } from '../Components/RequestService';

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
    alertDiv: false
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
        updateClient: (state, action) => {
            state.client = action.payload;
            state.islogin = true;
            state.alreadyLogin = true;
        },
        errorClient: (state, action) => {
            state.multiMessage = action.payload.messages;
            state.iserror = action.payload.error;
        },
        alertHandle: (state, action) => {
            state.alertDiv = action.payload.alert;
        },
        clearError: (state, action) => {
            state.iserror = false;
            state.message = '';
            state.multiMessage = '';
        },
    }
});

// Login Request
export const registerAsync = (data) => async (dispatch) => {
    let formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("country", data.country);
    formData.append("city", data.city);
    formData.append("phone_no", data.phone_no);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("ib_referral_code", data.referral_code);
    formData.append("client_type", data.type);
    formData.append("current_url", data.current_url);
    CustomRequest('register', formData, '', (res)=> {
        if(res?.error) {
            console.log(res.error);
            if (res.error.response.status === 401) {
                const clientdata = {
                    login: false,
                    verify: false,
                    alreadyLogin: false,
                    client: res.data.data,
                    error: true,
                    message: res.data.error,
                    alert: false
                };
                dispatch(login(clientdata));
            }
        } else {
            let clientdata = null;
            if(res.data.status_code === 200) {
                if (res.data.data.already_login === true) {
                    clientdata = {
                        login: true,
                        verify: true,
                        alreadyLogin: true,
                        client: res.data.data,
                        error: false,
                        message: '',
                        token: res.data.token,
                        alert: false
                    };
                } else {
                    clientdata = {
                        login: true,
                        verify: false,
                        alreadyLogin: false,
                        client: res.data.data,
                        error: false,
                        message: '',
                        token: null,
                        alert: false
                    };
                }
            } else {
                clientdata = {
                    login: false,
                    verify: false,
                    alreadyLogin: false,
                    client: res.data.data,
                    error: true,
                    message: res.data.error,
                    alert: false
                };
            }
            dispatch(login(clientdata));
        }
    });
};


// Login Request
export const loginAsync = (data) => async (dispatch) => {
    
    let formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("browser", data.browser);
    formData.append("platform", data.platform);
    formData.append("ip_address", data.ip_address);
    formData.append("device_id", uuid);

    CustomRequest('login', formData, '', (res)=> {
        if(res?.error) {
            console.log(res.error);
            if (res.error.response.status === 401) {
                dispatch(redirectAsync());
            }
        } else {
            let clientdata = null;
            if(res.data.status_code === 200) {
                if (res.data.data.already_login === true) {
                    clientdata = {
                        login: true,
                        verify: true,
                        alreadyLogin: true,
                        client: res.data.data,
                        error: false,
                        message: '',
                        token: res.data.token,
                        balance: res.data.data.live_balance,
                        demoBalance: res.data.data.demo_balance,
                        asIb: res.data.data.ib_status,
                        alert: false
                    };
                } else {
                    clientdata = {
                        login: true,
                        verify: false,
                        alreadyLogin: false,
                        client: res.data.data,
                        error: false,
                        message: '',
                        token: null,
                        balance: res.data.data.live_balance,
                        demoBalance: res.data.data.demo_balance,
                        asIb: res.data.data.ib_status,
                        alert: false
                    };
                }
                
            } else {
                clientdata = {
                    login: false,
                    verify: false,
                    alreadyLogin: false,
                    client: res.data.data,
                    error: true,
                    message: res.data.message,
                    alert: false
                };
            }
            dispatch(login(clientdata));
        }
    });
};

// Verify Request
export const verifyAsync = (data) => (dispatch) => {

    let formData = new FormData();
    formData.append("verification_code", data.verification_code);
    formData.append("id", data.id);
    
    CustomRequest('verify', formData, '', (res)=> {
        if (res?.error) {
            if (res.error.response.status === 401) {
                dispatch(redirectAsync());
            }
        } else {
            let clientdata = null;
            if(res.data.status_code === 200) {
                clientdata = {
                    login: true,
                    verify: true,
                    alreadyLogin: true,
                    client: res.data.data,
                    error: false,
                    message: '',
                    verifyerror: false,
                    token: res.data.token,
                    balance: res.data.data.live_balance,
                    demoBalance: res.data.data.demo_balance,
                    asIb: res.data.data.ib_status,
                    alert: false
                };
            } else {
                clientdata = {
                    login: true,
                    verify: false,
                    alreadyLogin: false,
                    client: showClient,
                    error: true,
                    message: res.data.error,
                    verifyerror: true,
                    alert: false
                };
            }
            dispatch(verify(clientdata));
        }
    });
};

// Logout Request
export const logoutAsync = (data) => async (dispatch) => {

    CustomRequest('logout', {}, data.token, (res)=> {
        if(res?.error) {
            console.log(res.error);
            if (res.error.response.status === 401) {
            }
        } else {
            if(res.data.status_code === 200) {
                let clientdata = {login: false, verify: true, alreadyLogin: false, client: null, error: false, message: ''};
                setTimeout(() => {
                    dispatch(logout(clientdata));
                }, 1000);
                
            } else {
            }
        }
    });
};

export const updateClientAsync = (data, token, status) => async (dispatch) => {
    let endpoint;
    let formData = {};
    if (status !== 'delete') {
        formData = new FormData();
        formData.append('profile_photo', data);
        endpoint = 'update-profilephoto';

    } else {
        endpoint = 'delete-profilephoto';
    }
    CustomRequest(endpoint, formData, {token:token, content_type:'multipart/form-data'}, (res)=> {
        if(res?.error) {
            console.log(res.error);
            if (res.error.response.status === 401) {
            }
        } else {
            
            if(res.data.status_code === 200) {
                const clientData = res.data.data;
                dispatch(updateClient(clientData));
            } else {
                let err = res.data.message;
                console.log(err);
            }
        }
    });
};

export const updateClientDataAsync = (data, token, isUpdate = null) => (dispatch) => {
    if (isUpdate !== null) {
        dispatch(updateClient(data));
    } else {
        CustomRequest('update', data, token, (res)=> {
            if(res?.error) {
                // console.log(res.error);
                let data = {error: true, messages: res.error.response.data.error}
                dispatch(errorClient(data));
            } else {
                if(res.data.status_code === 200) {
                    const clientData = res.data;
                    dispatch(updateClient(clientData));

                    // let data = {error: false, messages: {}}
                    // dispatch(errorClient(data));
                } else {
                    let err = res.data.message;
                    console.log(err);
                }
            }
        });
    }
};

export const redirectAsync = () => async (dispatch) => {
    try {

        let clientdata = {
            login: false,
            verify: true,
            alreadyLogin: false,
            client: null,
            error: false,
            message: '',
            multiMessage: {}
        };

        dispatch(logout(clientdata));

    } catch (err) {
        throw new Error(err);
    }
};

export const alertAsync = (value) => async (dispatch) => {
    try {

        let data = {alertDiv: value};

        dispatch(alertHandle(data));

    } catch (err) {
        throw new Error(err);
    }
};

export const {login, verify, logout, updateClient, errorClient, alertHandle, clearError} = clientslice.actions;
export const showClient = (state) => state.client;
export default clientslice.reducer;