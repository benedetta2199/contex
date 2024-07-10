import { Button, Form } from 'react-bootstrap';
import { currentUpdate, currentValue } from 'src/pages/api/state';

/**
 * SliderRaggio Component - Allows user to adjust the radius value using a slider.
 * @returns {JSX.Element} - The rendered component.
 */
export default function SliderRaggio() {
  // Get current radius value and the function to update it from state
  const { raggio } = currentValue();
  const { setRaggio } = currentUpdate();

  return (
    <div className="d-flex justify-content-center align-items-center w-100">
      <Form.Label className='text-right me-3'>Raggio di {raggio} m:</Form.Label>
      <Button variant='light' onClick={() => setRaggio(raggio - 10)} className='m-1'>-</Button>
      <Form.Range value={raggio} min={1} max={5000} step={1} className='w-50' onChange={e => setRaggio(e.target.value)}/>
      <Button variant='light' onClick={() => setRaggio(raggio + 10)} className='m-1'>+</Button>
    </div>
  );
}
