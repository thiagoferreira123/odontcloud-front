import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEditFileNameModalStore } from '../hooks/modals/EditFileNameModalStore';
import usePatientFolderStore from '../hooks/PatientFolderStore';
import { useQueryClient } from '@tanstack/react-query';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../../components/AsyncButton';

const EditFileNameModal: React.FC = () => {
  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = React.useState(false);
  const showModal = useEditFileNameModalStore((state) => state.showModal);
  const selectedFile = useEditFileNameModalStore((state) => state.selectedFile);

  const initialValues = { documents_folder_name: '' };

  const validationSchema = Yup.object().shape({
    documents_folder_name: Yup.string().required('Insira um documents_folder_name válido'),
  });
  const { hideModal } = useEditFileNameModalStore();
  const { updatePatientFile } = usePatientFolderStore();

  const onSubmit = async (values: { documents_folder_name: string }) => {
    setIsSaving(true);

    try {
      if (!selectedFile) throw new Error('Arquivo não selecionado');

      await updatePatientFile({ ...selectedFile, ...values }, queryClient);

      hideModal();
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setValues, values, touched, errors } = formik;

  useEffect(() => {
    setValues({
      documents_folder_name: selectedFile?.documents_folder_name || '',
    });
  }, [selectedFile?.documents_folder_name, setValues]);

  return (
    <Modal show={showModal} onHide={hideModal} backdrop="static" className="modal-close-out">
      <form onSubmit={handleSubmit}>
        {/* <Modal.Header closeButton>
          <Modal.Title>...</Modal.Title>
        </Modal.Header> */}

        <Modal.Body>
          <div className="mb-3 filled mt-2">
            <CsLineIcons icon="cupcake" />
            <Form.Control
              type="text"
              name="documents_folder_name"
              value={values.documents_folder_name}
              onChange={handleChange}
              placeholder="Digite um documents_folder_name para esse arquivo"
            />
            {errors.documents_folder_name && touched.documents_folder_name && <div className="error">{errors.documents_folder_name}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
            Salvar nome do arquivo
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditFileNameModal;
