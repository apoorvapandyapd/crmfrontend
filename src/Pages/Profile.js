import { Fragment, useEffect, useState } from "react";
import Innerlayout from "../Components/Innerlayout";
import { showClient, updateClientAsync } from "../store/clientslice";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

const Profile = () => {

    const client = useSelector(showClient);
    let history = useHistory();
    if (client.islogin === false)
    {

        history.push('/login')
    }

    // const noimg = process.env.PUBLIC_URL+"/Images/profile-photo.png";
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const [imgPreview, setImagePreview] = useState(client.client.profile_photo);
    const [submitText, setSubmitText] = useState('Upload New Picture');
    const [profilePhoto, setProfilePhoto] = useState(null);

    useEffect(() => {
        setSubmitText('Upload New Picture');
    },[client.client.profile_photo])

    // let location = useLocation();
    const dispatch = useDispatch();

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

    const getRole=()=>{
        if (client.asIB === true) {
            return 'IB';
        }
        else{
            if (client.client.ib_status === 'both') {
                return 'Client with IB';
            }
            else{
                return 'Client';
            }
        }
    }

    return (
        <Fragment>
            <Innerlayout>
                <div className="box-wrapper w-700">
                    <div className="card-body">
                        <h2>Your personal information</h2>
                        <p>Here you can view and change your personal information on our platform. Please note that the details should be correct and up-to-date.</p>
                        <div className="d-flex flex-wrap justify-content-between mt-4">
                            <div className="profile-img">
                                <form method="post" onSubmit={profilePhotoSubmit}>
                                    <div className="img-block position-relative">
                                        <img className="profile-thumb" src={(imgPreview!=null) ? imgPreview : `${process.env.PUBLIC_URL}/Images/no-image.png`} alt="profile" width='100%' />
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
                            <div className="profile-content">
                                <ul>
                                    <li>KYC Verification 
                                        {client.client.verify === 'Completed' ? <span className="text-success">Completed</span> : <span className="text-danger">Not Completed</span>}
                                    </li>
                                    <li>Name <span>{client.client.first_name} {client.client.last_name}</span></li>
                                    <li>Phone Number <span>{client.client.phone_no}</span></li>
                                    <li>Email <span>{client.client.email}</span></li>
                                    <li>Gender <span>{client.client.gender}</span></li>
                                    <li>Date Of Birth <span>{(client.client.dob != null) ? new Date(client.client.dob).toLocaleString("en-US", options) : '-'}</span></li>
                                    <li>Registered As <span>{getRole()}</span></li>
                                    <li>Location <span>{client.client.city}, {client.client.country}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Innerlayout>
        </Fragment>
    );
}

export default Profile;