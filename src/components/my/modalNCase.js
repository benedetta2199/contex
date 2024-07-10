import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currentUpdate, currentValue } from 'src/pages/api/state';

/**
 * ModalNCase Component - Displays a modal to change the number of houses to be displayed.
 * @param {object} props - Component props.
 * @param {boolean} props.nRaggio - Determines if the modal is for houses within a radius.
 * @returns {JSX.Element} - The rendered component.
 */
export default function ModalNCase({ nRaggio }) {
  const { nhouse, nhouseT } = currentValue(); // Get current number of houses
  const { setNHouse, setNHouseT } = currentUpdate(); // Functions to update the number of houses

  const [show, setShow] = useState(false); // State to control modal visibility
  const [value, setValue] = useState(nRaggio ? nhouse : nhouseT); // State to control the slider value

  /**
   * Handles changes to the slider value, ensuring it stays within the allowed range.
   * @param {number} n - The new slider value.
   */
  const handleSliderChange = (n) => {
    n = Math.max(1, Math.min(50, n));
    setValue(n);
    if (nRaggio) {
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

      {show && (
        <Modal size="lg" show={show} centered onHide={() => setShow(false)} aria-labelledby="example-modal-sizes-title-sm" >
          <Modal.Header closeButton>
            <Modal.Title className='title'>
              Modifica il numero massimo di case visualizzate
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label className='text-right me-3'>
                Numero massimo di case visualizzate: {value}
              </Form.Label>
              <div className="d-flex justify-content-center align-items-center w-100">
                <Button variant='light' className='m-1' onClick={() => handleSliderChange(value - 1)}>
                  -
                </Button>
                <Form.Range value={value} min={1} max={50} step={1} className='w-50' 
                  onChange={e => handleSliderChange(parseInt(e.target.value))} />
                <Button variant='light' className='m-1' onClick={() => handleSliderChange(value + 1)}>
                  +
                </Button>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShow(false)}> Conferma </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
