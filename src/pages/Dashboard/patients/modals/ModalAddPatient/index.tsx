import React, { useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-dropzone-uploader/dist/styles.css';

import FormAddPatiente from './FormAddPatiente/index.tsx';
import AsyncButton from '../../../../../components/AsyncButton.tsx';
import { useModalAddPatientStore } from '../../hooks/ModalAddPatientStore.ts';

interface FormConfigClassicEatingPlanRef {
  handleSubmit: () => void;
}

const ModalAddPatient = () => {
  const formRef = useRef<FormConfigClassicEatingPlanRef>();
  const [isSaving, setIsSaving] = useState(false);

  const showModal = useModalAddPatientStore((state) => state.showModal);
  const selectedPatient = useModalAddPatientStore((state) => state.selectedPatient);
  const { handleCloseModal } = useModalAddPatientStore();

  const handleUpdateForm = async () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
  };

  return (
    <Modal className="modal-right large" show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastrar paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormAddPatiente ref={formRef} setIsSaving={setIsSaving} handleCloseModal={handleCloseModal} />
      </Modal.Body>
      <Modal.Footer>
        {/* Em caso de sucesso, é carregado um toastfy dizendo "Paciente cadastrado com sucesso", o mesmo para erro*/}
        <AsyncButton isSaving={isSaving} loadingText="Cadastrando paciente..." type="button" className="mb-1 btn btn-primary" onClickHandler={handleUpdateForm}>
          {selectedPatient && selectedPatient.patient_id ? 'Atualizar' : 'Cadastrar'}
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddPatient;
