import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { currentUpdate } from 'src/pages/api/state';

/**
 * InputPref Component - Displays a set of radio buttons for user preference input.
 * @param {object} props - Component props.
 * @param {string} props.id - Unique identifier for the form group.
 * @param {string} props.keyMap - Key used to update the state.
 * @param {string} props.text - Label text for the form group.
 * @returns {JSX.Element} - The rendered component.
 */
export default function InputPref({ id, keyMap, text }) {
  const { updateValuePoI } = currentUpdate(); // Function to update the PoI value
  const [count, setCount] = useState(0); // State to track the selected radio button

  /**
   * Handles the change event for the radio buttons.
   * @param {number} index - The index of the selected radio button.
   */
  const handleChange = (index) => {
    setCount(index);
    updateValuePoI(keyMap, index);
  };

  return (
    <Form.Group className="my-3">
      <Form.Label className='w-100 text-center'>
        {text}
      </Form.Label>
      <div className='d-flex justify-content-around w-75 mx-auto'>
        {['c0', 'c1', 'c2', 'c3', 'c4', 'c5'].map((option, index) => (
          <Form.Check
            required
            type="radio"
            className={option}
            label={index}
            checked={count === index} // Set checked based on state
            onChange={() => handleChange(index)}
            name={id}
            id={`${id}${index + 1}`}
            key={`${id}${index}`}
          />
        ))}
      </div>
    </Form.Group>
  );
}
