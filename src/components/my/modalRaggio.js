import { useState } from 'react';
import { Row , Col, Button, Form, Modal} from 'react-bootstrap';
import SliderRaggio from './sliderRaggio';
import BOLOMap from './BOLOmap';

export default function ModalRaggio() {

  const [show, setShow] = useState(false);

  const handleClose = () =>{
    /**AGGIORNA CON QUERY */
    setShow(false)
  }

  return (
    <>
    <Button onClick={() => setShow(true)} className="me-2">
        Cambia Raggio
      </Button>

    <Modal
        size="lg"
        show={show} centered
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className='title'>
            Modifica il raggio di vicinanza
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SliderRaggio button={false}/>
          <BOLOMap width="100%" height="55vh" clickable={false} circle={true} def={false}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
