import axios from 'axios';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { showClient } from '../../store/clientslice';

const base_url = process.env.REACT_APP_API_URL;
const CHANGE_MESSAGE_API = base_url+"/v1/client/change-message";

function EditMessage(props) {

    const client = useSelector(showClient);


    const [richText, setRichText] = useState(props.message);


    const handleText = (content, delta, source, editor) => {
        setRichText(editor.getHTML());
    }

    const updateMessage=async(e)=>{
        e.preventDefault();
        
        try {

            const config = {
                headers: { Authorization: `Bearer ${client.token}` }
            };

            let formData = new FormData();
            formData.append("id",props.id);
            formData.append("message", richText);
        
            await axios.post(CHANGE_MESSAGE_API, formData, config).then((response) => {
                if (response.data.status_code === 200) {
                    props.handleEdit(e,null);
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
        
        } catch (err) {
        throw new Error(err);
        }
    }

    return (
        <div className="text-editor-block">
            <ReactQuill
                className='form-control'
                theme="snow"
                value={richText}
                onChange={handleText}
            />  
            <div className="buttons mt-3">
                <button type="button" className="btn btn-light" onClick={(e) => props.handleEdit(e, null)}>Discard</button>
                <button type="button" className="btn btn-primary" onClick={updateMessage}>Update</button>
            </div>
        </div>
    );
}

export default EditMessage;