import React from 'react';
import { Modal } from 'react-bootstrap';

function ImagePopup(props) {

    return (
        <Modal show={props.handleOpen} onHide={(e)=>props.handleClose(e)} className={"modal-lg"}>
            <Modal.Header closeButton>
            <h3 className="mb-0">{props.name}</h3>    
            </Modal.Header>
            <Modal.Body>
                <img alt='' src={props.image} height='100%' width='100%'></img>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
}

export default ImagePopup;