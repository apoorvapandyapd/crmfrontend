import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function ImagePopup(props) {

    return (
        <Modal show={props.handleOpen} onHide={(e)=>props.handleClose(e)}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <img src={props.image} height='100%' width='100%'></img>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={(e)=>props.handleClose(e)}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ImagePopup;