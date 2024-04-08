import { Col, Modal, Row } from 'react-bootstrap';
import { useWebcamPermissionModalStore } from '../hooks/WebcamPermissionModalStore';

const WebcamPermissionModal = () => {
  const showModal = useWebcamPermissionModalStore((state) => state.showModal);
  const { hideModal } = useWebcamPermissionModalStore();

  return (
    <Modal size="lg" show={showModal} onHide={hideModal}>
      <Modal.Body className="text-center">
        <Row>
          <Col md={6}>
            <img src="/img/webcam-permission.svg" className="sh-35 rounded" alt="thumb" />
          </Col>
          <Col md={6}>
            <div className="text-start mt-5">
              <h1 className="mb-2">Não temos permissão para usar sua câmera</h1>
              <ol className="N8Yj4c">
                <li className="mb-1 fs-5">
                  Clique no ícone de informações da página{' '}
                  <span className="e4Ipmf">
                    <svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 -960 960 960">
                      <path
                        fill="currentColor"
                        d="M700-130q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q733-190 756.5-213.265q23.5-23.264 23.5-56.5Q780-303 756.735-326.5q-23.264-23.5-56.5-23.5Q667-350 643.5-326.735q-23.5 23.264-23.5 56.5Q620-237 643.265-213.5q23.264 23.5 56.5 23.5ZM120-240v-60h360v60H120Zm140-310q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-.235-60Q293-610 316.5-633.265q23.5-23.264 23.5-56.5Q340-723 316.735-746.5q-23.264-23.5-56.5-23.5Q227-770 203.5-746.735q-23.5 23.264-23.5 56.5Q180-657 203.265-633.5q23.264 23.5 56.5 23.5ZM480-660v-60h360v60H480Z"
                      ></path>
                    </svg>
                  </span>{' '}
                  na barra de endereço do seu navegador
                </li>
                <li className="mb-1 fs-5">Ativar câmera</li>
              </ol>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default WebcamPermissionModal;
