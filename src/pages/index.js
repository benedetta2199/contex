import { Row , Col, Button, Form} from 'react-bootstrap';
import InputPref from '@components/my/inputPref';
import SliderRaggio from '@components/my/sliderRaggio';
import dynamic from 'next/dynamic';
import { currentFeature } from './api/state';
import { useEffect } from 'react';

export default function Home() {

  const BOLOMap = dynamic(() => import('@components/my/BOLOmap'), {ssr: false})
  const {resetFeature} = currentFeature();

  useEffect(()=>{
    resetFeature();
  }, []);
  

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
            <Form.Group className="my-2" controlId="raggio">
              <SliderRaggio button={true}/>
            </Form.Group>
            <BOLOMap width="100%" height="75vh" clickable={true} circle={false}/>
          </div>
        </Col>
        <Col md={6} className='px-4'>
          <div className="border rounded m-4  p-3">
            <h2 className="h6">
              Esprimi una valutazione da 1 a 5 per ogni caratteristica <br/>
              0 se non si ritiene rilevante, 5 se si ritiene molto rilevante
            </h2>

            <InputPref text='Quanto è rilevante la vicinanza al centro città?' id='1'/>
            <InputPref text='Quanto è importante per te la vicinanza ai trasporti pubblici?' id='2'/>
            <InputPref text='Quanto è importante per te la presenza di piste ciclabili?' id='3'/>
            <InputPref text='Quanto è importante per te la presenza di parcheggi disponibili?' id='4'/>
            <InputPref text='Quanto è importante per te la vicinanza a stazione?' id='5'/>
            <hr/>
            <InputPref text='Quanto è importante per te la vicinanza a ristoranti e bar?' id='6'/>
            <InputPref text='Quanto è importante per te la vicinanza a palestre e centri sportivi?' id='7'/>
            <InputPref text='Quanto è importante per te la presenza di supermercati nelle vicinanze?' id='8'/>
            <InputPref text='Quanto è importante per te la vicinanza a parchi e aree verdi?' id='9'/>
            <InputPref text='Quanto è importante per te la vicinanza a ospedali e cliniche?' id='10'/>
            <hr/>
            <InputPref text='Quanto è importante per te la vicinanza a biblioteche?' id='11'/>
            <InputPref text='Quanto è importante per te la vicinanza a scuole?' id='12'/>
            <InputPref text='Quanto è importante per te la vicinanza a musei ?' id='13'/>
            <InputPref text='Quanto è importante per te la vicinanza a cinema e teatri?' id='14'/>
            <InputPref text='Quanto è importante per te la vicinanza a chiese?' id='15'/>
            <InputPref text='?' id='16'/>
            <InputPref text='Quanto è importante per te la sicurezza del quartiere?' id='17'/>
          </div>
        </Col>
      </Row>
    </>
  )
}
