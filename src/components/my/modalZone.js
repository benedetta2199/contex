import { useState, useEffect, useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { currentInitialization } from 'src/pages/api/state';
import dynamic from 'next/dynamic';

/**
 * ModalZona Component - Displays a modal to change the evaluation zones.
 * @returns {JSX.Element} - The rendered component.
 */
export default function ModalZona() {
  // Dynamic import of the BOLOMap component
  const BOLOMap = useMemo(() => dynamic(() => import('@components/my/BOLOmap'), { ssr: false }), []);

  // State to control the visibility of the modal
  const [show, setShow] = useState(false);

  // Destructuring initialization function from state management
  const { initializedValutazioneZone } = currentInitialization();

  // Effect to handle side-effects when the modal visibility changes
  useEffect(() => {
    if (show) {
      // Handle any additional side-effects or state updates related to `show` here
    }
  }, [show]);

  // Handler for the confirm button
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
            <BOLOMap
              width="100%"
              height="75vh"
              clickable={true}
              circle={false}
              def={false}
              suppressHydrationWarning={true}
            />
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