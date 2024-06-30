import { useRouter } from 'next/navigation';
import { Row , Col, Button, Form} from 'react-bootstrap';
import { currentFeature} from 'src/pages/api/state';

export default function SliderRaggio(props) {

  const {button}= props
  
  const {getRaggio, setRaggio} = currentFeature();
  const r = useRouter();
  const wCol = button ? 4:5;

  const checkSetRaggio = (value) => {
    if(value<0.1){value=0.1}
    if(value>5){value=5}
    setRaggio(value);
  }

  return (
    <>
      <Row className="align-items-center">
        <Col xs={wCol}> 
          <Form.Label className='text-right w-100'>Raggio di vicinanza in km:</Form.Label>
        </Col>
        <Col xs={wCol}>
          <Form.Range value={getRaggio()} min={0.1} max={5} step={0.1} onChange={e => setRaggio(e.target.value)}
          />
        </Col>
        <Col xs="2" className='px-2'>
          <Form.Control value={getRaggio()} type="number" step={0.1} onChange={e => checkSetRaggio(e.target.value)}/>
        </Col>
        {button && <Col xs="2" className='px-2'>
          <Button variant="primary" onClick={() => r.push("./mainPage")}>Conferma</Button>
        </Col>}
      </Row>
    </>
  )
}
