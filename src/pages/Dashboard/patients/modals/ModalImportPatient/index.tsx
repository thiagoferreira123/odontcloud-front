import { Modal } from 'react-bootstrap';
import { Wizard } from 'react-use-wizard';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';

interface ModalImportPatientProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ModalImportPatient = ({ showModal, setShowModal }: ModalImportPatientProps) => {

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        {' '}
        <Modal.Title>Importação de pacientes de outro Software</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mt-4">
        <Wizard>
          <StepOne />
          <StepTwo />
          <StepThree />
        </Wizard>
      </Modal.Body>
    </Modal>
  );
};

export default ModalImportPatient;
