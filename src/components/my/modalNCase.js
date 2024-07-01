import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currentFeature } from 'src/pages/api/state';

export default function ModalNCase() {
  const { getNHouse, setNHouse } = currentFeature();
  

  const [show, setShow] = useState(false);
  const [value, setValue] = useState(getNHouse());

  const handleSliderChange = (event) => {
    setValue(event.target.value);
    setNHouse(event.target.value);
  };
  
  return (
    <>
      <Button onClick={() => setShow(true)} className="me-2">
        Case visualizzate
      </Button>

    <Modal size="lg" show={show} centered onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-sm" >
        <Modal.Header closeButton>
          <Modal.Title className='title'>
            Modifica il numero di case visualizzate
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicRange">
              <Form.Label>Valore: {getNHouse()}</Form.Label>
              <Form.Range type="range" min="0" max="51" step={1} value={value} onChange={handleSliderChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
