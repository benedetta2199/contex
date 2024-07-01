import { useRouter } from 'next/navigation';
import { Row , Col, Button, Form} from 'react-bootstrap';
import { currentFeature} from 'src/pages/api/state';

export default function SliderRaggio() {
  
  const {getRaggio, setRaggio} = currentFeature();

  const checkSetRaggio = (value) => {
    if(value<0.1){value=0.1}
    if(value>5){value=5}
    setRaggio(value);
  }

  return (
    <>
      <Row className="align-items-center">
        <Col xs={5}> 
          <Form.Label className='text-right w-100'>Raggio di vicinanza in km:</Form.Label>
        </Col>
        <Col xs={5}>
          <Form.Range value={getRaggio()} min={0.1} max={5} step={0.1} onChange={e => setRaggio(e.target.value)}
          />
        </Col>
        <Col xs="2" className='px-2'>
          <Form.Control value={getRaggio()} type="number" step={0.1} onChange={e => checkSetRaggio(e.target.value)}/>
        </Col>
      </Row>
    </>
  )
}
