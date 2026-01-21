import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Innerlayout from "../Components/Innerlayout";
import CountryArr from "../Components/CountryArr";
import Image from "react-bootstrap/Image";
import { Button, Col, Form, FormControl, FormLabel, Row } from "react-bootstrap";
import { showClient, updateClientDataAsync, updateClientAsync } from "../store/clientslice";
import { useDispatch, useSelector } from "react-redux";
import PropagateLoader from "react-spinners/PropagateLoader";
import Select from 'react-select';

import PhoneInput from "react-phone-input-2";
import { DeleteIcon } from "../Components/icons";
// const base_url = process.env.REACT_APP_API_URL;
// const CLIENT_UPDATE_API = base_url + "/v1/client/update-profile";


const Settings = () => {

    const client = useSelector(showClient);

    // const noimg = process.env.PUBLIC_URL + "/Images/profile-photo.png";

    const history = useHistory();
    if (client.islogin === false)
    {

        history.push('/login')
    }
    const dispatch = useDispatch();

    const [value, setValue] = useState({
        first_name: client.client.first_name,
        last_name: client.client.last_name,
        country: client.client.country,
        city: client.client.city,
        address_1: client.client.address_1,
        phone_no: client.client.phone_no,
        gender: client.client.gender,
        dob: client.client.dob,
        email: client.client.email
    });

    const [imgPreview, setImagePreview] = useState(client.client.profile_photo);
    const [submitText, setSubmitText] = useState('Upload New Picture');
    const [profilePhoto, setProfilePhoto] = useState(null);
    // const [submitClick, setSubmitClick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitLabel, setSubmitLabel] = useState('Update');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [number, setNumber] = useState(null);


    const countries = CountryArr();

    const options = countries;

    useEffect(() => {
        setSubmitText('Upload New Picture');
    },[client.client.profile_photo])

    useEffect(() => {
        if (client.islogin === false && client.alreadyLogin === false){
            history.push('/login')
        }
        if (client.iserror === true && client.alertDiv === false) {
            setLoading(false);
            setSubmitLabel('Update');
        }

        if (client.iserror === false) {
            setLoading(false);
            setSubmitLabel('Update');
        }

    },[client])

    useEffect(() => {
        let selectCountr = countries.find(country => country.label === client.client.country);
        setSelectedCountry(selectCountr);

        setTimeout(() => {
            setNumber(selectCountr.countrycode+client.client.phone_no);
        },1000);

    },[]);
    

    const handleInput = (e) => {
        setValue((prevValue) => ({
            ...prevValue,
            [e.target.name]: e.target.value,
        }));
    };

    const handleProfilePhoto=(e)=>{
        e.preventDefault();
        let files = e.target.files[0];
        setImagePreview(URL.createObjectURL(files));
        setSubmitText('Save');
        setProfilePhoto(files);
    }

    const profilePhotoSubmit=(e)=>{
        e.preventDefault();
        let data = profilePhoto;
        dispatch(updateClientAsync(data,client.token));
    }

    const deleteProfilePhoto=(e)=>{
        e.preventDefault();
        let data = profilePhoto;
        dispatch(updateClientAsync(data,client.token,'delete'));
        setTimeout(() => {
            window.location.reload();
        },1000);
    }

    const phoneChange=(value, country)=>{
        setNumber(value);
    }

    const updateClientSubmit = async(event) => {
        event.preventDefault();

        setLoading(true);
        setSubmitLabel('Loading...');

        let selectCountr = countries.find(country => country.label === selectedCountry.label ?? client.client.country);
        let finalNumber = number.replace(selectCountr.countrycode, '');

        let updatedObject;

        if (selectedCountry != null) {
            updatedObject = {
                ...value,
                country: selectedCountry.label,
                phone_no: finalNumber
            };
        }
        else{
            updatedObject = value;
        }
        

        const data = updatedObject;
        dispatch(updateClientDataAsync(data,client.token));
    }; 
    
    const countryChange = (e, attrib) => {
        // const inputName = attrib.name;

        setSelectedCountry({ value: e.value, label: e.label, format: e.format });
    }

    return (
        <Fragment>
            <Innerlayout>
            {
                    loading === true ? <PropagateLoader
                        color={'#000b3e'}
                        loading={true}
                        cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />:  <div className="box-wrapper w-700">
                    <div className="card-body">
                        {
                            loading && <PropagateLoader
                                color={'#000b3e'}
                                loading={true}
                                cssOverride={{textAlign:'center', alignItems:'center', backgroundColor:'rgb(251,252,252,0.8)', display:'flex', justifyContent:'center', width:'100%', height:'100vh'}}
                                size={25}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        }
                        <h2>Edit Profile</h2>
                        <div className="d-flex flex-wrap justify-content-between mt-4">
                            <div className="profile-img">
                                <form>
                                    <div className="img-block position-relative">
                                        <Button className="delete-icon" onClick={deleteProfilePhoto}>
                                                    <DeleteIcon width="18" height="18" />
                                            </Button>
                                        <Image className="profile-thumb" src={(imgPreview!=null) ? imgPreview : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt="profile photo" width='100%' />
                                    </div>
                                </form>
                                <form method="post" onSubmit={profilePhotoSubmit}>
                                    <div className="img-block position-relative">
                                    </div>
                                    <div className="form-group">
                                        <input type="file" name="" onChange={handleProfilePhoto} />
                                        {
                                                    (submitText === 'Save') ? 
                                                        <button type="submit" className="btn btn-primary btn-sm">Change Photo</button> :
                                                        <button type="button" className="btn btn-primary btn-sm">{submitText}</button>
                                        }
                                    </div>
                                    <div className="form-group">
                                    {
                                                    (submitText === 'Save') ? 
                                                        <button type="submit" className="btn btn-primary btn-sm mt-2">{submitText}</button> : null 
                                    }
                                    </div>
                                </form>
                            </div>
                            <div className="profile-content border-0">
                                <form onSubmit={updateClientSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <FormLabel className="mb-1">First Name</FormLabel>
                                        <FormControl type="text" name="first_name" value={value.first_name} onChange={handleInput}  />
                                                <small className="text-danger">{client.hasOwnProperty('multiMessage') && client.multiMessage !== undefined ? client.multiMessage.first_name : null}</small>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <FormLabel className="mb-1">Last Name</FormLabel>
                                        <FormControl type="text" name="last_name" value={value.last_name} onChange={handleInput}  />
                                                <small className="text-danger">{(client.hasOwnProperty('multiMessage') && client.multiMessage !== undefined) ? client.multiMessage.last_name : null}</small>
                                    </Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <FormLabel>Country</FormLabel>
                                                <Select
                                                    defaultValue={selectedCountry}
                                                    value={selectedCountry}
                                                    onChange={countryChange}
                                                    options={options}
                                                    isClearable={true}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <FormLabel>City</FormLabel>
                                                <Form.Control type="text" name="city" placeholder="City" value={value.city} onChange={handleInput} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <FormLabel>Address</FormLabel>
                                        <Form.Control as="textarea" Rows={2} name="address_1" placeholder="Address" value={value.address_1} onChange={handleInput} />
                                                <small className="text-danger">{(client.hasOwnProperty('multiMessage') && client.multiMessage !== undefined) ? client.multiMessage.address_1 : null}</small>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                    <FormLabel>Phone Number</FormLabel>
                                    <PhoneInput
                                        inputProps={{
                                            name: 'phone',
                                            required: true,
                                        }}

                                        className="mb-3"
                                        country={selectedCountry?.value}
                                        countryCodeEditable={false}
                                        disableDropdown={true}
                                        value={number}
                                        onChange={(value, country, e, formattedValue) => {
                                            phoneChange(value,country)
                                        }}
                                    />
                                    </Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <FormLabel>Gender</FormLabel>
                                                <Form.Select value={value.gender} name="gender" className="custom-select" onChange={handleInput} >
                                                    <option value="" selected>Select an option</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </Form.Select>
                                                        <small className="text-danger">{(client.hasOwnProperty('multiMessage') && client.multiMessage !== undefined) ? client.multiMessage.gender : null}</small>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <FormLabel>Date Of Birth</FormLabel>
                                                <Form.Control type="date" name="dob" placeholder="Date Of Birth" value={value.dob} onChange={handleInput} />
                                                        <small className="text-danger">{(client.hasOwnProperty('multiMessage') && client.multiMessage !== undefined) ? client.multiMessage.dob : null}</small>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <FormLabel className="mb-1">Email</FormLabel>
                                        <FormControl type="email" name="email" value={value.email} onChange={handleInput} />
                                                <small className="text-danger">{(client.hasOwnProperty('multiMessage') && client.multiMessage !== undefined) ? client.multiMessage.email : null}</small>
                                    </Form.Group>
                                    <Button disabled={loading} type="submit" className="btn btn-primary float-end">{submitLabel}</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>}
              
            </Innerlayout>
        </Fragment>
    );
}

export default Settings;