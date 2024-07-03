import { Row, Col, Form, Tabs, Tab } from 'react-bootstrap';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic'; 
import ModalRaggio from '@components/my/modalRaggio';
import ModalZona from '@components/my/modalZone';
import ModalNCase from '@components/my/modalNCase';
import ModalTempo from '@components/my/modalTempo';
import { currentFeature, currentMap } from './api/state';

export default function Home() {
  const BOLOMap = useMemo(() => dynamic(() => import('@components/my/BOLOmap'), {
    loading: () => <p>A map is loading</p>,
    ssr: false
  }), []);
  const { getAllNamePoI, updateVisibilityPoI, initializeHouse, getValutazioneZone } = currentFeature();
  const { resetMap, updateElementMap } = currentMap();
  const [elem, setElem] = useState([]);
  const [key, setKey] = useState("caseR");

  useEffect(() => {
    resetMap();
    setElem(getAllNamePoI());
  }, []);

  return (
    <>
      <Row className='w-100 text-center'>
        <Col md={9}>
          <div className='position-fixed w-75'>
            <BOLOMap width="100%" height="100vh" circle={false} def={true} clickable={false} />
          </div>
        </Col>

        <Col md={3} className='px-1 py-4 colTab'>
        <Tabs defaultActiveKey="cercaCasa" id="uncontrolled-tab-example" className="mb-3 tabs" 
          activeKey={key} onSelect={(tab) => {setKey(tab); updateElementMap(tab)}}>
          <Tab eventKey="caseR" className='menu-tab'
          title={<><img src="./icon/home.svg" className="icon" alt=""/> 
            {key=="caseR" && <span className="tab-title">Cerca con Raggio</span>}
            </>} >
            <div className="p-1">
              <p>
                Qui puoi vedere le case che soddisfano le tue richieste, in base al raggio di distanza, 
                colorate in base alla pertineza con i punti d'interesse.
              </p>
              <div className='legend'>
                <small>Punteggio delle case</small>
                <div class="color-scale"></div>
                <div class="min-max"><span>Min</span><span>Max</span></div>
              </div>
              <div className='d-flex justify-content-around'>
                <ModalRaggio />
                <ModalNCase nRaggio={true}/>
              </div>
            </div>
          </Tab>
          <Tab eventKey="caseT"className='menu-tab'
            title={<><img src="./icon/home.svg" className="icon" alt=""/> 
            {key=="caseT" && <span className="tab-title">Cerca con Tempo</span>}
            </>} >
            <div className="p-1">
              <p>
                Qui puoi vedere le case che soddisfano le tue richieste, in base alla distanza in bici, 
                colorate in base alla pertineza con i punti d'interesse.
              </p>
              <div className='legend'>
                <small>Punteggio delle case</small>
                <div class="color-scale"></div>
                <div class="min-max"><span>Min</span><span>Max</span></div>
              </div>
              <div className='d-flex justify-content-around'>
                <ModalTempo />
                <ModalNCase nRaggio={false}/>
              </div>
            </div>
          </Tab>
          <Tab eventKey="zone" className='menu-tab'
            title={<><img src="./icon/home.svg" className="icon" alt=""/> 
            {key=="zone" && <span className="tab-title">Valutazione Zone</span>} </>} >
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
          <Tab eventKey="consigli" className='menu-tab'
            title={<><img src="./icon/home.svg" className="icon" alt=""/> 
            {key=="consigli" && <span className="tab-title">Consigli Zone</span>} </>} >
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