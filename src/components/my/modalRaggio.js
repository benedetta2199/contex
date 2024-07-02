import { useState } from 'react';
import { Row , Col, Button, Form, Modal} from 'react-bootstrap';
import SliderRaggio from './sliderRaggio';
import BOLOMap from './BOLOmap';
import { currentFeature } from 'src/pages/api/state';

export default function ModalRaggio() {
  
  const {initializeHouse} = currentFeature();
  const [show, setShow] = useState(false);

  const handleClose = () =>{
    initializeHouse();
    setShow(false)
  }

  return (
    <>
    <Button onClick={() => setShow(true)} className="me-2">
      Cambia Raggio
    </Button>

    {show &&  
      <Modal size="lg" show={show} centered onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-sm" >
        <Modal.Header closeButton>
          <Modal.Title className='title'>
            Modifica il raggio di vicinanza con i punti d'interesse
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SliderRaggio button={false}/>
          <BOLOMap width="100%" height="55vh" clickable={false} circle={true} def={false}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>handleClose()}>
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    }
    </>
  )
}
