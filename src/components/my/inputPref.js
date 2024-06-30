import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { currentFeature } from 'src/pages/api/state';

export default function InputPref(props) {

  const{id, keyMap, text} = props;
  const {updateValuePoI} = currentFeature();
  let [count,setCount] = useState(0);

  return (
    <Form.Group className="my-3">
      <Form.Label className='w-100 text-center'>
        {text}
      </Form.Label>
      <div className='d-flex justify-content-around w-75 mx-auto'> 
        {['c0', 'c1', 'c2', 'c3', 'c4', 'c5'].map((option, index) => (
            <Form.Check required type="radio" className={option} label={index}
            checked={count==index} // Imposta checked basato sullo stato
              onChange={()=>{
                setCount(index);
                updateValuePoI(keyMap, index);
              }}
              name={id} id={id+index+1} key={id+index}/>))
        }
      </div>
    </Form.Group>
  )
}
