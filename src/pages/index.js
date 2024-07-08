import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Row, Col, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import InputPref from '@components/my/inputPref';
import SliderRaggio from '@components/my/sliderRaggio';
import { currentInitialization } from './api/state';

/**
 * Home component - The main landing page for the application.
 */
export default function Home() {
  // Dynamic import for the map component
  const BOLOMap = useMemo(() => dynamic(() => import('@components/my/BOLOmap'), {
    loading: () => 
      <div className='w-100 d-flex justify-content-center align-items-center mt-5' style={style}>
        Caricamento...
      </div>
    ,
    ssr: false
  }), []);

  const style = { height: '75vh', position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000, color: '#fff' };
  const [show, setShow] = useState(false);

  // Destructure initialization functions from state management
  const { resetAll, initializeValue, checkQuestionario } = currentInitialization();

  const router = useRouter();

  // Effect to reset all values when the component mounts
  useEffect(() => {
    resetAll();
  }, []);

  // Button click handler to confirm questionnaire values
  const btnConferma = () => {
    if (checkQuestionario()) {
      initializeValue();
      router.push("./mainPage");
    } else {
      setShow(true);
    }
  }

  return (
    <>
      {/* Header */}
      <div className='position-fixed fixed-top bg-body'>
        <h1 className="mt-2 text-center mx-4 my-3 pt-3">Your Place</h1>
        <p className="w-100 text-center">Il modo migliore per cercare casa</p>
      </div>

      {/* Toast notification */}
      <ToastContainer position="middle-center" className="p-3">
        <Toast show={show} onClose={() => setShow(false)} delay={3000} autohide bg={'primary'}>
          <Toast.Header className="d-flex justify-content-end" />
          <Toast.Body className="text-white">
            Inserire almeno una valutazione nel questionario
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Per Spostare più in basso la mappa */}
      <div style={{ height: "125px" }}></div>

      <Row className='w-100 text-center'>
        <Col md={6}>
          <div className='position-fixed mx-4 w-50'>
            <Form.Group className="my-2 d-flex justify-content-around" controlId="raggio">
              <SliderRaggio button={true} />
              <Button variant="primary" onClick={btnConferma}>Conferma</Button>
            </Form.Group>
            <BOLOMap width="100%" height="75vh" clickable={true} circle={false} def={false} />
          </div>
        </Col>
        <Col md={6} className='px-4'>
          <div className="border rounded m-4 p-3">
            <h2 className="h6">
              Esprimi una valutazione da 1 a 5 per ogni caratteristica <br />
              [ 0 se non si ritiene rilevante, 5 se si ritiene molto rilevante ]
            </h2>

            {/* Preference inputs */}
            <InputPref text='Quanto è importante per te la presenza di almeno 5 fermate del bus?' keyMap='fermate_bus' id='1' />
            <InputPref text='Quanto è importante per te la vicinanza di parcheggi?' keyMap='parcheggi' id='2' />
            <InputPref text='Quanto è importante per te la vicinanza a stazione?' keyMap='stazioni' id='3' />
            <InputPref text='Quanto è importante per te la vicinanza di piste ciclabili?' keyMap='piste_ciclabili' id='4' />
            <hr />
            <InputPref text='Quanto è importante per te la vicinanza a palestre e centri sportivi?' keyMap='impianti_sportivi' id='5' />
            <InputPref text='Quanto è importante per te la vicinanza a parchi e aree verdi?' keyMap='aree_verdi' id='6' />
            <InputPref text='Quanto è importante per te la presenza di almeno 8 negozi?' keyMap='negozi' id='7' />
            <InputPref text='Quanto è importante per te la vicinanza a ospedali e cliniche?' keyMap='ospedali' id='8' />
            <hr />
            <InputPref text='Quanto è importante per te la vicinanza a cinema e teatri?' keyMap='teatri' id='9' />
            <InputPref text='Quanto è importante per te la vicinanza a chiese?' keyMap='chiese' id='10' />
            <InputPref text='Quanto è importante per te la vicinanza a scuole?' keyMap='scuole' id='11' />
            <InputPref text='Quanto è importante per te la vicinanza a musei?' keyMap='musei' id='12' />
            <InputPref text='Quanto è importante per te la vicinanza a biblioteche?' keyMap='biblio' id='13' />
          </div>
        </Col>
      </Row>
    </>
  );
}