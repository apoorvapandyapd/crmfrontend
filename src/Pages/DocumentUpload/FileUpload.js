import React ,{useState, forwardRef, useImperativeHandle, useEffect} from 'react';
import ImagePopup from '../../Components/ImagePopup';
import { MultiplyIcon, PlusIcon, VisibilityIcon, VisibilityOffIcon } from "../../Components/icons";
function FileUpload(props,ref) {


    const [previewFront, setPreviewFront] = useState(null);
    const [frontImage, setFrontImage] = useState(null);

    const [show, setShow] = useState(false);
    const [image, setImage] = useState(null);
    const [passwordFile, setFilePassword] = useState(null);
    const [pwdState,setPwdState] = useState(false);

    useEffect(() => {
        if(props.data!==null && props.data.extension=='pdf'){
            setPreviewFront(`${process.env.PUBLIC_URL}/Images/pdf_title_img.png`);
        }
        else if(props.displayStatus!=='Approved' && props.displayStatus!=='Rejected' && props.displayStatus!=='Pending'){
            setPreviewFront(`${process.env.PUBLIC_URL}/Images/-no-image.png`);
        }
        else{
            setPreviewFront(props.uploadedImg);
        }
    },[props.uploadedImg]);


    var displayStatus = '';
    var status = '';

    if(props.displayStatus=='Approved'){
        displayStatus = <span className='text-success'>Approved</span>
        status = 'Approved';
    }
    else if(props.displayStatus=='Rejected' && props.data!=null){
        displayStatus = <span className='text-danger'>Rejected ({props.data.comment})</span>
        status = 'Rejected';
    }
    else if(props.displayStatus=='Pending'){
        displayStatus = <span>Pending</span>
        status = 'Pending';
    }
    else{
        displayStatus = <span>Not uploaded</span>
        status = 'Not uploaded';
    }

    const handleClose=()=>{
        setShow(false);
    }

    const showModal=(event,url)=>{
        setShow(true);
        setImage(url);
    }


    const handleFront=(e)=>{
        let files = e.target.files[0];
        if(files['type']=='application/pdf'){
            setPreviewFront(`${process.env.PUBLIC_URL}/Images/pdf_title_img.png`);
        }
        else{
            setPreviewFront(URL.createObjectURL(files));
        }
        setFrontImage(files);
    }

    const closeFront=()=>{
        setPreviewFront(null);
    }


    useImperativeHandle(ref, () => ({
        callFromParent:()=>{
            let sendData = {
                'image': frontImage,
                'password': passwordFile,
            }
    
            return sendData;
        },
    }));


    return (
        <>
        <div className="verification-form-field-wrapper d-flex">
        {
            <div className="file-upload flex-wrap">
                <div className="file-upload-box">
                    <div className="file-upload-field" style={{ display:props.display }}>
                        <input type="file" onChange={handleFront}/>
                        <label className="file-upload-field-label">
                                    <PlusIcon width="24" height="24" />
                        </label>
                    </div>
                    {
                        (props.displayStatus!=='Approved') ? 
                        <>
                        <div className="file-upload-text">
                            <p>Provide files in jpg, jpeg, png, gif, svg or pdf format, 10 MB maximum.</p>
                        </div></> : ''
                    }
                    
                </div>
                {/* {
                    (props.displayStatus!='Approved' && props.side==2) ? '(You need to upload the front and back sides, otherwise it can be rejected)' : ''
                } */}
                <div className="file-upload-image">
                    {
                        (props.data!==null && props.data.extension!='pdf') ? 
                                    <a href={null} onClick={(e) => showModal(e, previewFront)}><img src={previewFront != null ? previewFront : `${process.env.PUBLIC_URL}/Images/no-image.png`} className='mt-0' alt="" /></a> :
                        <a href={props.data!==null && props.data.image_path} target="_blank"><img src={previewFront !=null ? previewFront : `${process.env.PUBLIC_URL}/Images/no-image.png`} className='mt-0' alt="" /></a>
                    }
                    {
                        (status!=='Not uploaded') ? 
                                    <span style={{ display: props.display }} className="close-icon" onClick={closeFront}><MultiplyIcon width="24" height="24" /></span> : 
                        <span></span>
                    }
                </div>
                <div className='mt-3 w-100 position-relative'>
                            <span style={{ cursor: 'pointer' }} className="password-icon" onClick={() => setPwdState(!pwdState)}>{pwdState === false ?
                                (
                                    <VisibilityIcon width="16" height="16" />
                                ) : (
                                    <VisibilityOffIcon width="16" height="16" />
                                )
                    }</span>
                    <input type={pwdState ? 'text' : 'password'} className="form-control" name='proof_password' onChange={(e) => setFilePassword(e.target.value)} placeholder="Enter document password (if required)" />
                </div>
                <div className='mt-3 w-100'>
                    <h5>Status: {displayStatus}</h5>
                </div>
                
                <small className='text-danger'>{(props.error!==null) ? props.error.map(val=> val.front) : ''}</small>
            </div>
        }
        </div>
        <ImagePopup image={image} handleOpen={show} handleClose={handleClose} />
        </>
    );
}

export default forwardRef(FileUpload);