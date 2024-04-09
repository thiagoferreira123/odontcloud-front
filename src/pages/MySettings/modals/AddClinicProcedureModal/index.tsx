import { useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-dropzone-uploader/dist/styles.css';
import AsyncButton from '../../../../components/AsyncButton';
import { useCreateAndProcedureEditModalStore } from '../../hooks/CreateAndProcedureEditModalStore';
import FormAddClinicProcedure from './FormAddClinicProcedure';

interface FormConfigClassicEatingPlanRef {
  handleSubmit: () => void;
}

const CreateOrEditClinicProcedureModal = () => {
  const formRef = useRef<FormConfigClassicEatingPlanRef>();
  const [isSaving, setIsSaving] = useState(false);

  const showModal = useCreateAndProcedureEditModalStore((state) => state.showModal);
  const selectedClinicProcedure = useCreateAndProcedureEditModalStore((state) => state.selectedClinicProcedure);
  const { hideModal } = useCreateAndProcedureEditModalStore();

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
        <FormAddClinicProcedure ref={formRef} setIsSaving={setIsSaving} hideModal={hideModal} />
      </Modal.Body>
      <Modal.Footer>
        {/* Em caso de sucesso, é carregado um toastfy dizendo "Paciente cadastrado com sucesso", o mesmo para erro*/}
        <AsyncButton isSaving={isSaving} loadingText="Cadastrando procedimento..." type="button" className="mb-1 btn btn-primary" onClickHandler={handleUpdateForm}>
          {selectedClinicProcedure && selectedClinicProcedure.clinic_procedure_id ? 'Atualizar' : 'Cadastrar'}
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateOrEditClinicProcedureModal;
