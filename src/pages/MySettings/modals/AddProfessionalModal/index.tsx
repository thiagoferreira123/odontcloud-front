import React, { useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-dropzone-uploader/dist/styles.css';
import { useCreateAndEditModalStore } from '../../hooks/CreateAndEditModalStore';
import AsyncButton from '../../../../components/AsyncButton';
import FormAddProfessional from './FormAddProfessional';

interface FormConfigClassicEatingPlanRef {
  handleSubmit: () => void;
}

const CreateOrEditProfessionalModal = () => {
  const formRef = useRef<FormConfigClassicEatingPlanRef>();
  const [isSaving, setIsSaving] = useState(false);

  const showModal = useCreateAndEditModalStore((state) => state.showModal);
  const selectedProfessional = useCreateAndEditModalStore((state) => state.selectedProfessional);
  const { hideModal } = useCreateAndEditModalStore();

  const handleUpdateForm = async () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
  };

  return (
    <Modal className="modal-right large" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastrar procedimento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormAddProfessional ref={formRef} setIsSaving={setIsSaving} hideModal={hideModal} />
      </Modal.Body>
      <Modal.Footer>
        {/* Em caso de sucesso, é carregado um toastfy dizendo "Paciente cadastrado com sucesso", o mesmo para erro*/}
        <AsyncButton isSaving={isSaving} loadingText="Cadastrando procedimento..." type="button" className="mb-1 btn btn-primary" onClickHandler={handleUpdateForm}>
          {selectedProfessional && selectedProfessional.professional_id ? 'Atualizar' : 'Cadastrar'}
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateOrEditProfessionalModal;
