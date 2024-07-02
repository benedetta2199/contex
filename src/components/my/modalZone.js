import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Row , Col, Button, Form, Modal} from 'react-bootstrap';
import SliderRaggio from './sliderRaggio';
import BOLOMap from './BOLOmap';
import { currentFeature } from 'src/pages/api/state';

export default function ModalZona() {

  const [show, setShow] = useState(false);
  const {initializedValutazioneZone} = currentFeature();

  const handleClose = () =>{
    initializedValutazioneZone();
    setShow(false)
  }

  return (
    <>
      <Button onClick={() => setShow(true)} className="me-2">
        Cambia Zone
      </Button>

      {show &&  
        <Modal size="lg" show={show} centered onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-sm" >
          <Modal.Header closeButton>
            <Modal.Title  className='title'>
              Modifica le zone da valutare
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <BOLOMap width="100%" height="75vh" clickable={true} circle={false} def={false}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={()=> handleClose()}>
              Conferma
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  )
}
