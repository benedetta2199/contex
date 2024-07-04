import { Row, Col, Form, Tabs, Tab } from 'react-bootstrap';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic'; 
import ModalRaggio from '@components/my/modalRaggio';
import ModalZona from '@components/my/modalZone';
import ModalNCase from '@components/my/modalNCase';
import ModalTempo from '@components/my/modalTempo';
import { currentFeature, currentMap } from './api/state';

export default function Home() {
  const BOLOMap = useMemo(() => dynamic(() => import('@components/my/BOLOmap'), {loading: () => <p>A map is loading</p>, ssr: false }), []);
  const { getAllNamePoI, updateVisibilityPoI, initializeHouse, getValutazioneZone, moran } = currentFeature();
  const { resetMap, updateElementMap } = currentMap();
  const [elem, setElem] = useState([]);
  const [key, setKey] = useState("caseR");

  const division = {
    trasporti: ['fermate_bus', 'piste_ciclabili', 'parcheggi', 'stazioni'],
    sevizi: ['impianti_sportivi', 'aree_verdi', 'negozi', 'ospedali'],
    cultura: ['teatri_cinema', 'chiese', 'biblio', 'scuole', 'musei'],
  };

  const [checkboxState, setCheckboxState] = useState({
    trasporti: false,
    sevizi: false,
    cultura: false,
    ...division.trasporti.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    ...division.sevizi.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    ...division.cultura.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
  });

  useEffect(() => {
    resetMap();
    setElem(getAllNamePoI());
  }, []);

  const updateDivision = async (division, checked) => {
    const updatedState = { ...checkboxState };
    for (const name of division) {
      updatedState[name] = checked;
      await updateVisibilityPoI(name, checked);
    }
    setCheckboxState((prevState) => ({
      ...prevState,
      ...updatedState,
      [getCategoryKey(division)]: checked,
    }));
  };

  const handleCheckboxChange = async (key, checked) => {
    setCheckboxState((prevState) => {
      const updatedState = { ...prevState, [key]: checked };
      const category = getCategoryKeyFromElemKey(key);
      updatedState[category] = checkAllSelected(division[category], updatedState);
      return updatedState;
    });
    await updateVisibilityPoI(key, checked);
  };

  const getCategoryKey = (divisionArray) => {
    return Object.keys(division).find((key) => division[key] === divisionArray);
  };

  const getCategoryKeyFromElemKey = (elemKey) => {
    return Object.keys(division).find((key) => division[key].includes(elemKey));
  };

  const checkAllSelected = (divisionArray, state) => {
    return divisionArray.every((key) => state[key]);
  };

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
            activeKey={key} onSelect={(tab) => { setKey(tab); updateElementMap(tab) }}>
            <Tab eventKey="caseR" className='menu-tab'
              title={<><img src="./icon/home.svg" className="icon" alt="" />
                {key === "caseR" && <span className="tab-title">Cerca con Raggio</span>}
              </>} >
              <div className="p-1">
                <p>
                  Qui puoi vedere le case che soddisfano le tue richieste, in base al raggio di distanza,
                  colorate in base alla pertineza con i punti d'interesse.
                </p>
                <div className='legend'>
                  <small>Punteggio delle case</small>
                  <div className="color-scale"></div>
                  <div className="min-max"><span>Min</span><span>Max</span></div>
                </div>
                <div className='d-flex justify-content-around'>
                  <ModalRaggio />
                  <ModalNCase nRaggio={true} />
                </div>
              </div>
            </Tab>
            <Tab eventKey="caseT" className='menu-tab'
              title={<><img src="./icon/home.svg" className="icon" alt="" />
                {key === "caseT" && <span className="tab-title">Cerca con Tempo</span>}
              </>} >
              <div className="p-1">
                <p>
                  Qui puoi vedere le case che soddisfano le tue richieste, in base alla distanza in bici,
                  colorate in base alla pertineza con i punti d'interesse.
                </p>
                <div className='legend'>
                  <small>Punteggio delle case</small>
                  <div className="color-scale"></div>
                  <div className="min-max"><span>Min</span><span>Max</span></div>
                </div>
                <div className='d-flex justify-content-around'>
                  <ModalTempo />
                  <ModalNCase nRaggio={false} />
                </div>
              </div>
            </Tab>
            <Tab eventKey="zone" className='menu-tab'
              title={<><img src="./icon/home.svg" className="icon" alt="" />
                {key === "zone" && <span className="tab-title">Valutazione Zone</span>} </>} >
              <div className="p-1">
                <p>
                  Guarda la valutazione delle zone che hai selezionato rispetto ai punti d'interesse.
                </p>
                <div className='legend'>
                  <small>Punteggio delle zone</small>
                  <div className="color-scale"></div>
                  <div className="min-max"><span>Min</span><span>Min</span></div>
                </div>
                <ModalZona />
              </div>
            </Tab>
            <Tab eventKey="consigli" className='menu-tab'
              title={<><img src="./icon/negozi.svg" className="icon" alt="" />
                {key === "consigli" && <span className="tab-title">Consigli Zone</span>} </>} >
              <div className="p-1">
                <p>Qui vengono mostrate le zone in base alle preferenze inserite, specificando il centro della zona</p>
              </div>
            </Tab>
          </Tabs>

          <div>
            <hr />
            <p className='w-100 text-center'> Mostra gli elementi di rilevanza </p>
            <div className='text-start ps-3'>
              <div className='d-flex justify-content-between '>
                <h2 className='h6 mt-3'>Trasporti</h2>
                <Form.Check.Input type='checkbox' id='trasporti'
                  checked={checkboxState.trasporti}
                  onChange={(event) => { updateDivision(division.trasporti, event.target.checked) }} />
              </div>
              {elem.map((e) => (
                division.trasporti.includes(e.key) &&
                <Form.Group key={e.key}>
                  <Form.Check.Input type='checkbox' id={`default-${e.key}`}
                    checked={checkboxState[e.key]}
                    onChange={(event) => { handleCheckboxChange(e.key, event.target.checked) }} />
                  <img src={`./icon/${e.key}.svg`} className='icon' />
                  <Form.Check.Label htmlFor={`default-${e.key}`} className='px-2'> {`${e.name} (${e.value})`}</Form.Check.Label>
                </Form.Group>
              ))}
              <div className='d-flex justify-content-between '>
                <h2 className='h6 mt-3'>Infrastrutture & Servizi</h2>
                <Form.Check.Input type='checkbox' id='sevizi'
                  checked={checkboxState.sevizi}
                  onChange={(event) => { updateDivision(division.sevizi, event.target.checked) }} />
              </div>
              {elem.map((e) => (
                division.sevizi.includes(e.key) &&
                <Form.Group key={e.key}>
                  <Form.Check.Input type='checkbox' id={`default-${e.key}`}
                    checked={checkboxState[e.key]}
                    onChange={(event) => { handleCheckboxChange(e.key, event.target.checked) }} />
                  <img src={`./icon/${e.key}.svg`} className='icon' />
                  <Form.Check.Label htmlFor={`default-${e.key}`} className='px-2'> {`${e.name} (${e.value})`}</Form.Check.Label>
                </Form.Group>
              ))}
              <div className='d-flex justify-content-between '>
                <h2 className='h6 mt-3'>Cultura</h2>
                <Form.Check.Input type='checkbox' id='cultura'
                  checked={checkboxState.cultura}
                  onChange={(event) => { updateDivision(division.cultura, event.target.checked) }} />
              </div>
              {elem.map((e) => (
                division.cultura.includes(e.key) &&
                <Form.Group key={e.key}>
                  <Form.Check.Input type='checkbox' id={`default-${e.key}`}
                    checked={checkboxState[e.key]}
                    onChange={(event) => { handleCheckboxChange(e.key, event.target.checked) }} />
                  <img src={`./icon/${e.key}.svg`} className='icon' />
                  <Form.Check.Label htmlFor={`default-${e.key}`} className='px-2'> {`${e.name} (${e.value})`}</Form.Check.Label>
                </Form.Group>
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <div className='moran'>
        <h2 className='h6 mt-3'>Indice di modan</h2>
        <div><p>Indice di Moran Rispetto ai PoI: {+(Math.round(moran.PoI + "e+2") + "e-2")}</p></div>
        <div><p>Indice di Moran Rispetto al Prezzo: {+(Math.round(moran.prezzo + "e+2") + "e-2")}</p></div>
      </div>
    </>
  );
}