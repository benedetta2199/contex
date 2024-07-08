import { Row, Col, Form, Tabs, Tab, Button } from 'react-bootstrap';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic'; 
import ModalRaggio from '@components/my/modalRaggio';
import ModalZona from '@components/my/modalZone';
import ModalNCase from '@components/my/modalNCase';
import ModalTempo from '@components/my/modalTempo';
import { currentMap, currentUpdate, currentValue } from './api/state';

export default function Home() {
  // Dynamic import for the map component
  const BOLOMap = useMemo(() => dynamic(() => import('@components/my/BOLOmap'), {
    loading: () =>
      <div className='w-100 h-100 d-flex justify-content-center align-items-center' style={style}>
        Caricamento...
      </div>,
    ssr: false
  }), []);

  // Style for the loading overlay
  const style = { position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000, color: '#fff' };

  // Get functions from state hooks
  const { getAllNamePoI, moran } = currentValue();
  const { updateVisibilityPoI } = currentUpdate();
  const { resetMap, updateElementMap } = currentMap();

  // Component state
  const [elem, setElem] = useState([]);
  const [key, setKey] = useState("caseR");

  // Divisions of points of interest (PoI) by category
  const division = {
    trasporti: ['fermate_bus', 'piste_ciclabili', 'parcheggi', 'stazioni'],
    servizi: ['impianti_sportivi', 'aree_verdi', 'negozi', 'ospedali'],
    cultura: ['teatri_cinema', 'chiese', 'biblio', 'scuole', 'musei'],
  };

  // Initial state for checkboxes
  const [checkboxState, setCheckboxState] = useState({
    trasporti: false,
    servizi: false,
    cultura: false,
    ...division.trasporti.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    ...division.servizi.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    ...division.cultura.reduce((acc, key) => ({ ...acc, [key]: false }), {}),
  });

  // Effect to reset map and set PoI names when component mounts
  useEffect(() => {
    resetMap();
    setElem(getAllNamePoI());
  }, []);

  // Update visibility of all PoIs in a division
  const updateDivision = async (division, checked) => {
    const updatedState = { ...checkboxState };
    for (const name of division) {
      updatedState[name] = checked;
      updateVisibilityPoI(name, checked);
    }
    setCheckboxState((prevState) => ({
      ...prevState,
      ...updatedState,
      [getCategoryKey(division)]: checked,
    }));
  };

  // Handle change of individual PoI checkbox
  const handleCheckboxChange = async (key, checked) => {
    updateVisibilityPoI(key, checked);
    setCheckboxState((prevState) => {
      const updatedState = { ...prevState, [key]: checked };
      const category = getCategoryKeyFromElemKey(key);
      updatedState[category] = checkAllSelected(division[category], updatedState);
      return updatedState;
    });
  };

  // Get the category key for a division array
  const getCategoryKey = (divisionArray) => {
    return Object.keys(division).find((key) => division[key] === divisionArray);
  };

  // Get the category key from an element key
  const getCategoryKeyFromElemKey = (elemKey) => {
    return Object.keys(division).find((key) => division[key].includes(elemKey));
  };

  // Check if all PoIs in a division are selected
  const checkAllSelected = (divisionArray, state) => {
    return divisionArray.every((key) => state[key]);
  };

  // Add all PoIs in a division
  const addAll = (division) => updateDivision(division, true);
  // Remove all PoIs in a division
  const removeAll = (division) => updateDivision(division, false);

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
            activeKey={key} onSelect={(tab) => { setKey(tab); updateElementMap(tab); }}>
            <Tab eventKey="caseR" className='menu-tab'
              title={<><img src="./icon/caseR.svg" className="icon" alt=""/>
                {key === "caseR" && <span className="tab-title ps-2">Cerca con Raggio</span>}
              </>}>
              <div className="p-1">
                <p>
                  Qui puoi vedere le case che soddisfano le tue richieste, in base al raggio di distanza,
                  colorate in base alla pertinenza con i punti d'interesse.
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
              title={<><img src="./icon/caseT.svg" className="icon" alt=""/>
                {key === "caseT" && <span className="tab-title ps-2">Cerca con Tempo</span>}
              </>}>
              <div className="p-1">
                <p>
                  Qui puoi vedere le case che soddisfano le tue richieste, in base alla distanza in bici,
                  colorate in base alla pertinenza con i punti d'interesse.
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
              title={<><img src="./icon/zone.svg" className="icon" alt=""/>
                {key === "zone" && <span className="tab-title ps-2">Valutazione Zone</span>} </>}>
              <div className="p-1">
                <p>
                  Guarda la valutazione delle zone che hai selezionato rispetto ai punti d'interesse.
                </p>
                <div className='legend'>
                  <small>Punteggio delle zone</small>
                  <div className="color-scale"></div>
                  <div className="min-max"><span>Min</span><span>Max</span></div>
                </div>
                <ModalZona />
              </div>
            </Tab>
            <Tab eventKey="consigli" className='menu-tab'
              title={<><img src="./icon/cluster.svg" className="icon" alt=""/>
                {key === "consigli" && <span className="tab-title ps-2">Consigli Zone</span>} </>}>
              <div className="p-1">
                <p>
                  Qui vengono mostrate le zone in base alle preferenze inserite, specificando il centro della zona.
                </p>
              </div>
            </Tab>
          </Tabs>

          <div>
            <hr />
            <p className='w-100 text-center'>Mostra gli elementi di rilevanza</p>
            <div className='text-start ps-3'>
              <div className='d-flex justify-content-between align-items-center'>
                <h2 className='h6 mt-3'>Trasporti</h2>
                <div>
                  <Button variant="outline-primary" size="sm" onClick={() => addAll(division.trasporti)}>Aggiungi</Button>
                  <Button variant="outline-dark" size="sm" className='ms-2' onClick={() => removeAll(division.trasporti)}>Rimuovi</Button>
                </div>
              </div>
              {elem.map((e) => (
                division.trasporti.includes(e.key) && (
                  <Form.Group key={e.key}>
                    <Form.Check.Input type='checkbox' id={`default-${e.key}`}
                      checked={checkboxState[e.key]}
                      onChange={(event) => handleCheckboxChange(e.key, event.target.checked)} />
                    <img src={`./icon/${e.key}.svg`} className='icon' alt={e.name} />
                    <Form.Check.Label htmlFor={`default-${e.key}`} className='px-2'> {`${e.name} (${e.value})`}</Form.Check.Label>
                  </Form.Group>
                )
              ))}
              <div className='d-flex justify-content-between align-items-center'>
                <h2 className='h6 mt-3'>Infrastrutture & Servizi</h2>
                <div>
                  <Button variant="outline-primary" size="sm" onClick={() => addAll(division.servizi)}>Aggiungi</Button>
                  <Button variant="outline-dark" size="sm" className='ms-2' onClick={() => removeAll(division.servizi)}>Rimuovi</Button>
                </div>
              </div>
              {elem.map((e) => (
                division.servizi.includes(e.key) && (
                  <Form.Group key={e.key}>
                    <Form.Check.Input type='checkbox' id={`default-${e.key}`}
                      checked={checkboxState[e.key]}
                      onChange={(event) => handleCheckboxChange(e.key, event.target.checked)} />
                    <img src={`./icon/${e.key}.svg`} className='icon' alt={e.name} />
                    <Form.Check.Label htmlFor={`default-${e.key}`} className='px-2'> {`${e.name} (${e.value})`}</Form.Check.Label>
                  </Form.Group>
                )
              ))}
              <div className='d-flex justify-content-between align-items-center'>
                <h2 className='h6 mt-3'>Cultura</h2>
                <div>
                  <Button variant="outline-primary" size="sm" onClick={() => addAll(division.cultura)}>Aggiungi</Button>
                  <Button variant="outline-dark" size="sm" className='ms-2' onClick={() => removeAll(division.cultura)}>Rimuovi</Button>
                </div>
              </div>
              {elem.map((e) => (
                division.cultura.includes(e.key) && (
                  <Form.Group key={e.key}>
                    <Form.Check.Input type='checkbox' id={`default-${e.key}`}
                      checked={checkboxState[e.key]}
                      onChange={(event) => handleCheckboxChange(e.key, event.target.checked)} />
                    <img src={`./icon/${e.key}.svg`} className='icon' alt={e.name} />
                    <Form.Check.Label htmlFor={`default-${e.key}`} className='px-2'> {`${e.name} (${e.value})`}</Form.Check.Label>
                  </Form.Group>
                )
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <div className='moran'>
        <h2 className='h6 mt-3'>Indice di Moran</h2>
        <div><p>Indice di Moran Rispetto ai PoI: {+(Math.round(moran.PoI + "e+2") + "e-2")}</p></div>
        <div><p>Indice di Moran Rispetto al Prezzo: {+(Math.round(moran.prezzo + "e+2") + "e-2")}</p></div>
      </div>
    </>
  );
}
