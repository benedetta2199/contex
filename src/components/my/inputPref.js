import Form from 'react-bootstrap/Form';

export default function InputPref(prop) {
  return (
    <Form.Group className="my-3">
      <Form.Label className='w-100 text-center'>
        {prop.text}
      </Form.Label>
      <div className='d-flex justify-content-around w-75 mx-auto'> 
        {['c1', 'c2', 'c3', 'c4', 'c5'].map((option, index) => (
            <Form.Check required type="radio" className={option} label={index+1} name={prop.id} id={prop.id+index+1} key={prop.id+index+1}/>))
        }
      </div>
    </Form.Group>
  )
}
