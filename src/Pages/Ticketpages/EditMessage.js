import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import {useSelector} from 'react-redux';
import {showClient} from '../../store/clientslice';

import { CustomRequest } from '../../Components/RequestService';

function EditMessage(props) {

    const client = useSelector(showClient);

    const [richText, setRichText] = useState(props.message);


    const handleText = (content, delta, source, editor) => {
        setRichText(editor.getHTML());
    }
    const updateMessage = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("id", props.id);
        formData.append("message", richText);
        CustomRequest('change-message', formData, client.token, (res)=> {
            if(res?.error) {
                // console.log(res.error);
                console.log(res.error.response.data.errors)
            } else {
                if (res.data.status_code === 200) {
                    props.handleEdit(e,null);
                }
            }
        });
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
                <button type="button" className="btn btn-light" onClick={(e) => props.handleEdit(e, null)}>Discard
                </button>
                <button type="button" className="btn btn-primary" onClick={updateMessage}>Update</button>
            </div>
        </div>
    );
}

export default EditMessage;