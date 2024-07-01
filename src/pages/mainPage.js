import Head from 'next/head';
import { Row, Col, Button, Form, Tabs, Tab } from 'react-bootstrap';
import ModalRaggio from '@components/my/modalRaggio';
import ModalZona from '@components/my/modalZone';
import dynamic from 'next/dynamic'; 
import { useEffect, useState } from 'react';
import { currentFeature, currentMap } from './api/state';
import ModalNCase from '@components/my/modalNCase';
//import Preload from '@components/my/sliderRaggio'; // Import the Preload component
//import { useRouter } from 'next/router';

export default function Home() {
  const BOLOMap = dynamic(() => import('@components/my/BOLOmap'), {ssr: false});
  const { getAllNamePoI, updateVisibilityPoI, initializeHouse, getValutazioneZone } = currentFeature();
  const { resetMap, updateElementMap } = currentMap();
  const [elem, setElem] = useState([]);
  const [key, setKey] = useState("case");
  const [loading, setLoading] = useState(true); // State to manage loading
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    resetMap();
    getValutazioneZone();
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
          <div className='position-fixed w-75'>
            <BOLOMap width="100%" height="100vh" circle={false} def={true} clickable={false} />
          </div>
        </Col>

        <Col md={3} className='p-4'>
        <Tabs defaultActiveKey="cercaCasa" id="uncontrolled-tab-example" className="mb-3" 
          activeKey={key} onSelect={(tab) => {setKey(tab); updateElementMap(tab)}}>
          <Tab eventKey="case" title="Cerca Casa" className='menu-tab'>
            <div className="p-1">
              <p>
                Qui puoi vedere le case che soddisfano le tue richieste colorate in base alla pertineza con i punti d'interesse.
              </p>
              <div className='legend'>
                <small>Punteggio delle case</small>
                <div class="color-scale"></div>
                <div class="min-max"><span>Min</span><span>Min</span></div>
              </div>
              <div className='d-flex justify-content-around'>
                <ModalRaggio />
                <ModalNCase />
              </div>
            </div>
          </Tab>
          <Tab eventKey="zone" title="Valuta Zone" className='menu-tab'>
            <div className="p-1">
              <p>
                Guarda la valutazione delle zone che hai selezionato rispetto ai punti d'interesse.
              </p>
              <div className='legend'>
                <small>Punteggio delle zone</small>
                <div class="color-scale"></div>
                <div class="min-max"><span>Min</span><span>Min</span></div>
              </div>
              <ModalZona />
            </div>
          </Tab>
          <Tab eventKey="consigli" title="Consigli" className='menu-tab'>
            <div className="p-1">
              <p>Qui vengono mostrate le zone in base alle preferenze inserite, specificando il centro del</p>
            </div>
          </Tab>
        </Tabs>
          <div>
            <hr />
            <p className='w-100 text-center'> Mostra gli elementi di rilevanza </p>
            <div className='text-start ps-3'>
              {elem.map((e) => (
                <Form.Group key={e.key}>
                  <Form.Check.Input type='checkbox'  id={`default-${e.kay}`} 
                  onChange={(event) => updateVisibilityPoI(e.key, event.target.checked)} />
                  <img src={`./icon/${e.key}.svg`} className='icon' />
                  <Form.Check.Label htmlFor={`default-${e.key}`} className='px-2'> {`${e.name} (${e.value})`}</Form.Check.Label>
                </Form.Group>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
