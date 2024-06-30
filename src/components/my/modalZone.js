import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Row , Col, Button, Form, Modal} from 'react-bootstrap';
import SliderRaggio from './sliderRaggio';
import BOLOMap from './BOLOmap';

export default function ModalZona() {

  const [show, setShow] = useState(false);

  const handleClose = () =>{
    /**AGGIORNA CON QUERY */
    setShow(false)
  }

  return (
    <>
    <Button onClick={() => setShow(true)} className="me-2">
        Cambia Zone
      </Button>

    <Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title  className='title'>
            Modifica il raggio di vicinanza
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <BOLOMap width="100%" height="75vh" clickable={true} circle={false}/>
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
