import React, { useState } from 'react';
import { Modal, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import UserModels from './UserModels';
import SystemModels from './SystemModels';

type ShowTypes = 'userModels' | 'systemModels';

type Props = {
  showModal: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModal: (value: boolean) => void;
};

const ModalFormSelectTemplate = ({ showModal, setShowModal }: Props) => {
  const [show, setShow] = useState<ShowTypes>('userModels');

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Selecione um modelo de formulário pré-consulta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center">
          <ToggleButtonGroup defaultValue="userModels" type="radio" name="buttonOptions2">
            <ToggleButton id="tbg-radio-3" checked={show === 'userModels'} onChange={() => setShow('userModels')} value="userModels" variant="outline-primary">
              Meus modelos
            </ToggleButton>
            <ToggleButton
              checked={show === 'systemModels'}
              onChange={() => setShow('systemModels')}
              value="systemModels"
              id="tbg-radio-4"
              variant="outline-secondary"
            >
              Modelos do OdontCloud
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="mt-4">{show === 'userModels' ? <UserModels /> : <SystemModels />}</div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalFormSelectTemplate;
