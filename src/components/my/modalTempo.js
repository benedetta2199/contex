import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currentFeature, currentInitialization, currentUpdate, currentValue } from 'src/pages/api/state';

export default function ModalTempo() {
  const { time} = currentValue();
  const { setTime } = currentUpdate();
  const { initializeHouseBici } = currentInitialization();
  
  const TIME_MAX = 40;

  const [show, setShow] = useState(false);
  const [value, setValue] = useState(time);

  const handleSliderChange = (n) => {
    n = Math.max(1, Math.min(TIME_MAX, n));
    setValue(n);
    setTime(n);
  };

  
  return (
    <>
      <Button onClick={() => setShow(true)} className="me-2">
        Cambia tempo
      </Button>

      {show &&  
        <Modal size="lg" show={show} centered onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-sm" >
          <Modal.Header closeButton>
            <Modal.Title className='title'>
              Modifica il tempo di vicinanza con i punti d'interesse
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label className='text-right me-3'>
                Tempo massimo di distanza in bici dai punti d'interesse: {value} minut{value==1? 'o':'i'}
              </Form.Label>
              <div className="d-flex justify-content-center align-items-center w-100">
                  <Button variant='light' className='m-1' onClick={() => handleSliderChange(value-1)}>-</Button>
                  <Form.Range value={value} min={1} max={TIME_MAX} step={1} className='w-50' onChange={e => handleSliderChange(e.target.value)}/>
                  <Button variant='light' className='m-1' onClick={() => handleSliderChange(value+1)}>+</Button>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => { initializeHouseBici(); setShow(false)}}>
              Conferma
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  )
}
