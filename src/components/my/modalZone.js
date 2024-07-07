import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import BOLOMap from './BOLOmap';
import { currentFeature } from 'src/pages/api/state';

export default function ModalZona() {
  const [show, setShow] = useState(false);
  const { initializedValutazioneZone } = currentFeature();

  // Effect to handle side-effects safely
  useEffect(() => {
    if (show) {
      // Any additional side-effects or state updates related to show can be handled here
    }
  }, [show]);

  const handleConfirm = () => {
    initializedValutazioneZone();
    setShow(false);
  };

  return (
    <>
      <Button onClick={() => setShow(true)} className="me-2">
        Cambia Zone
      </Button>

      {show && (
        <Modal
          size="lg"
          show={show}
          centered
          onHide={() => setShow(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title className='title'>
              Modifica le zone da valutare
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BOLOMap width="100%" height="75vh" clickable={true} circle={false} def={false} suppressHydrationWarning={true}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleConfirm}>
              Conferma
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
