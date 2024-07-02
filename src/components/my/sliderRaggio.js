import { useRouter } from 'next/navigation';
import { Row , Col, Button, Form} from 'react-bootstrap';
import { currentFeature} from 'src/pages/api/state';

export default function SliderRaggio() {
  
  const {raggio, setRaggio} = currentFeature();

  const checkSetRaggio = (value) => {
    if(value<0.1){value=0.1}
    if(value>5){value=5}
    setRaggio(value);
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center w-100">
          <Form.Label className='text-right me-3'>Raggio di {raggio} m:</Form.Label>
          <Button variant='light' onClick={()=>setRaggio(raggio-10)} className='m-1'>-</Button>
          <Form.Range value={raggio} min={1} max={5000} step={1} className='w-50' onChange={e => setRaggio(e.target.value)}/>
          <Button variant='light' onClick={()=>setRaggio(raggio+10)} className='m-1'>+</Button>
      </div>
    </>
  )
}
