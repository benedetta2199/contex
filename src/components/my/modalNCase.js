import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currentFeature } from 'src/pages/api/state';

export default function ModalNCase(props) {
  const { nhouse, nhouseT, setNHouse, setNHouseT } = currentFeature();
  const {nRaggio} = props;
  

  const [show, setShow] = useState(false);
  const [value, setValue] = useState(nRaggio? nhouse : nhouseT);

  const handleSliderChange = (n) => {
    n = Math.max(1, Math.min(50, n));
    setValue(n);
    if(nRaggio){
      setNHouse(n);
    } else {
      setNHouseT(n);
    }
    
  };
  
  return (
    <>
      <Button onClick={() => setShow(true)} className="me-2">
        Case visualizzate
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
              <Form.Label className='text-right me-3'>Numero massimo di case visualizzate: {value}</Form.Label>
              <div className="d-flex justify-content-center align-items-center w-100">
                  <Button variant='light' className='m-1' onClick={() => handleSliderChange(value-1)}>-</Button>
                  <Form.Range value={value} min={1} max={50} step={1} className='w-50' onChange={e => handleSliderChange(e.target.value)}/>
                  <Button variant='light' className='m-1' onClick={() => handleSliderChange(value+1)}>+</Button>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShow(false)}>
              Conferma
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  )
}
