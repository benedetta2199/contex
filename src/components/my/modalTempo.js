import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currentInitialization, currentUpdate, currentValue } from 'src/pages/api/state';

/**
 * ModalTempo Component - Displays a modal to change the maximum bike travel time to points of interest.
 * @returns {JSX.Element} - The rendered component.
 */
export default function ModalTempo() {
  const { time } = currentValue(); // Get the current bike travel time
  const { setTime } = currentUpdate(); // Function to update the bike travel time
  const { initializeHouseBici } = currentInitialization(); // Function to initialize house data based on bike travel time
  
  const TIME_MAX = 40; // Maximum allowed bike travel time

  const [show, setShow] = useState(false); // State to control modal visibility
  const [value, setValue] = useState(time); // State to control the slider value

  /**
   * Handles changes to the slider value, ensuring it stays within the allowed range.
   * @param {number} n - The new slider value.
   */
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

      {show && (
        <Modal size="lg" show={show} centered onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-sm">
          <Modal.Header closeButton>
            <Modal.Title className='title'>
              Modifica il tempo di vicinanza con i punti d'interesse
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label className='text-right me-3'>
                Tempo massimo di distanza in bici dai punti d'interesse: {value} minut{value === 1 ? 'o' : 'i'}
              </Form.Label>
              <div className="d-flex justify-content-center align-items-center w-100">
                <Button variant='light' className='m-1' onClick={() => handleSliderChange(value - 1)}>-</Button>
                <Form.Range value={value} min={1} max={TIME_MAX} step={1} className='w-50' onChange={e => handleSliderChange(parseInt(e.target.value))}/>
                <Button variant='light' className='m-1' onClick={() => handleSliderChange(value + 1)}>+</Button>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => { initializeHouseBici(); setShow(false); }}>
              Conferma
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
