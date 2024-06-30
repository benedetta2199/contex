import Head from 'next/head';
import { Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import ModalRaggio from '@components/my/modalRaggio';
import ModalZona from '@components/my/modalZone';
import dynamic from 'next/dynamic'; 
import { useEffect, useState } from 'react';
import { currentFeature, currentMap } from './api/state';
//import Preload from '@components/my/sliderRaggio'; // Import the Preload component
//import { useRouter } from 'next/router';

export default function Home() {
  const BOLOMap = dynamic(() => import('@components/my/BOLOmap'), {ssr: false});
  const { getAllNamePoI, setRecomZone, updateVisibilityPoI, initializeHouse } = currentFeature();
  const { resetMap } = currentMap();
  const [elem, setElem] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    resetMap();
    const fetchData = async () => {
      setElem(getAllNamePoI());
      await initializeHouse();
      setLoading(false);
    };
    

    fetchData();
  }, []);

  // Render the loading page if data is still being loaded
  /*if (loading) {
    return <Preload />;
  }*/

  // Render the main content once data is loaded
  return (
    <>
      <Row className='w-100 text-center'>
        <Col md={9}>
          <div className='legend'>
            <small>Punteggio delle case</small>
            <div class="color-scale"></div>
            <div class="min-max"><span>Min</span><span>Min</span></div>
          </div>
          <div className='position-fixed w-75'>
            <BOLOMap width="100%" height="100vh" circle={false} icon={true} clickable={false} />
          </div>
        </Col>
        <Col md={3} className='p-4'>
          <div className='d-flex justify-content-around'>
            <ModalRaggio />
            <ModalZona />
          </div>
          <Form className='w-100 d-flex justify-content-center my-4'>
            <Form.Check type="switch" id="custom-switch" label="elem consigliate" onChange={(event) => setRecomZone(event.target.checked)} />
          </Form>
          <div>
            <hr />
            <p className='w-100 text-center'> Mostra gli elementi di rilevanza</p>
            <div className='text-start ps-3'>
              {elem.map((e) => (
                <Form.Group key={e.key}>
                  <Form.Check.Input type='checkbox'  id={`default-${e.kay}`} 
                  onChange={(event) => updateVisibilityPoI(e.key, event.target.checked)} />
                  <img src={`./icon/${e.key}.svg`} className='icon' />
                  <Form.Check.Label htmlFor={`default-${e.key}`} className='px-2'> {e.name} </Form.Check.Label>
                </Form.Group>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
