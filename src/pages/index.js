import { Row , Col, Button, Form} from 'react-bootstrap';
import InputPref from '@components/my/inputPref';
import SliderRaggio from '@components/my/sliderRaggio';
import dynamic from 'next/dynamic';
import { currentFeature } from './api/state';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

export default function Home() {

  const BOLOMap =  useMemo(() => dynamic(() => import('@components/my/BOLOmap'), {
    loading: () => <p>A map is loading</p>,
    ssr: false
  }), []);


  const {resetAll, initializedZone, initializeHouse, initializeGeoPoI, initializeMoran, initializedValutazioneZone, initializedSuggestArea, initializeHouseBici} = currentFeature();
  
  const r = useRouter();

  useEffect(()=>{
    resetAll();
    initializedZone();
    //initializeMoran();
  }, []);

  const btnConferma = () =>{
    initializeHouse();
    initializeHouseBici();
    initializedValutazioneZone();
    initializedSuggestArea(); 
    r.push("./mainPage")
  }
  

  return (
    <>
      <div className='position-fixed fixed-top bg-body'>
        <h1 className="mt-2 text-center mx-4 my-3 pt-3"> Titolo </h1>
        <p className="w-100 text-center">Il modo migliore per cercare casa</p>
      </div>
      <div style={{height:"125px"}}></div>
      <Row className='w-100 text-center'>
        <Col md={6}>
          <div className='position-fixed mx-4 w-50'>
            <Form.Group className="my-2 d-flex justify-content-around" controlId="raggio">
              <SliderRaggio button={true}/>
              <Button variant="primary" onClick={() => btnConferma()}>Conferma</Button>
            </Form.Group>
            <BOLOMap width="100%" height="75vh" clickable={true} circle={false} def={false}/>
          </div>
        </Col>
        <Col md={6} className='px-4'>
          <div className="border rounded m-4  p-3">
            <h2 className="h6">
              Esprimi una valutazione da 1 a 5 per ogni caratteristica <br/>
              [ 0 se non si ritiene rilevante, 5 se si ritiene molto rilevante ]
            </h2>

            {/*<InputPref text='Quanto è rilevante la vicinanza al centro città?' keyMap='' id='1'/>
            NB sono da modificare gli Id*/}
            <InputPref text='Quanto è importante per te la vicinanza ai trasporti pubblici?' keyMap='fermate_bus' id='2'/>
            <InputPref text='Quanto è importante per te la presenza di piste ciclabili?' keyMap='piste_ciclabili' id='3'/>
            <InputPref text='Quanto è importante per te la presenza di parcheggi disponibili?' keyMap='parcheggi' id='4'/>
            <InputPref text='Quanto è importante per te la vicinanza a stazione?' keyMap='stazioni' id='5'/>
            <hr/>
            <InputPref text='Quanto è importante per te la vicinanza a palestre e centri sportivi?' keyMap='impianti_sportivi' id='7'/>
            <InputPref text='Quanto è importante per te la presenza di negozi nelle vicinanze?' keyMap='negozi' id='8'/>
            <InputPref text='Quanto è importante per te la vicinanza a parchi e aree verdi?' keyMap='aree_verdi' id='9'/>
            <InputPref text='Quanto è importante per te la vicinanza a ospedali e cliniche?' keyMap='ospedali' id='10'/>
            <hr/>
            <InputPref text='Quanto è importante per te la vicinanza a biblioteche?' keyMap='biblio' id='11'/>
            <InputPref text='Quanto è importante per te la vicinanza a scuole?' keyMap='scuole' id='12'/>
            <InputPref text='Quanto è importante per te la vicinanza a musei ?' keyMap='musei' id='13'/>
            <InputPref text='Quanto è importante per te la vicinanza a cinema e teatri?' keyMap='teatri' id='14'/>
            <InputPref text='Quanto è importante per te la vicinanza a chiese?' keyMap='chiese' id='15'/>
          </div>
        </Col>
      </Row>
    </>
  )
}
