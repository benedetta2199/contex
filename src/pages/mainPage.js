import Head from 'next/head';

import { Row , Col, Button, Form} from 'react-bootstrap';
import ModalRaggio from '@components/my/modalRaggio';
import ModalZona from '@components/my/modalZone';
import dynamic from 'next/dynamic'; 
import { useEffect, useState } from 'react';
import { currentFeature, currentMap } from './api/state';


export default function Home() {
  
  const BOLOMap = dynamic(() => import('@components/my/BOLOmap'), {ssr: false});
  
  //const {addSelect} = currentState();

  const {feature, updateFeature, setRecomZone} = currentFeature();
  const {resetMap} = currentMap();
  const [elem, setElem] = useState([]);

  useEffect(()=>{
    setElem(feature);
    resetMap();
  }, [elem]);
  

  return (
    <>
      <Row className='w-100 text-center'>
          <Col md={9}>
            <div className='position-fixed w-75'>
              <BOLOMap width="100%" height="100vh" circle={false} icon={true} clickable={false}/>
            </div>
          </Col>
          <Col md={3} className='p-4'>
            <div className='d-flex justify-content-around'>
              <ModalRaggio/>
              <ModalZona/>
            </div>
            <Form className='w-100 d-flex justify-content-center my-4'>
              <Form.Check type="switch" id="custom-switch" label="elem consigliate" onChange={(event)=>setRecomZone(event.target.checked)}/>
            </Form>
            <div>
              <hr/>
              <p className='w-100 text-center'> Mostra gli elementi di rilevanza</p>
              {elem.map((e) => (
                  <Form.Check type={'checkbox'} label={e} className=' w-75 d-flex justify-content-start mx-auto' id={`default-${e}`} key={e}
                    onChange={(event)=>updateFeature(e, event.target.checked)}/>
              ))}
            </div>
          </Col>
      </Row>
    </>
  )
}
