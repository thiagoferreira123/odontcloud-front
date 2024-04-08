import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import AsyncButton from '/src/components/AsyncButton';
import { useEditFileNameModalStore } from '../hooks/modals/EditFileNameModalStore';
import usePatientFolderStore from '../hooks';
import { useQueryClient } from '@tanstack/react-query';

const EditFileNameModal: React.FC = () => {
  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = React.useState(false);
  const showModal = useEditFileNameModalStore((state) => state.showModal);
  const selectedFile = useEditFileNameModalStore((state) => state.selectedFile);

  const initialValues = { fileName: '' };

  const validationSchema = Yup.object().shape({
    fileName: Yup.string().required('Insira um fileName válido'),
  });
  const { hideModal } = useEditFileNameModalStore();
  const { updatePatientFile } = usePatientFolderStore();

  const onSubmit = async (values: { fileName: string }) => {

    setIsSaving(true)

    try {

      if(!selectedFile) throw new Error('Arquivo não selecionado');

      await updatePatientFile({...selectedFile, ...values}, queryClient)

      hideModal();
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false)
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setValues, values, touched, errors } = formik;

  useEffect(() => {
    setValues({
      fileName: selectedFile?.fileName || '',
    })
  }, [selectedFile?.fileName, setValues])

  return (
    <Modal show={showModal} onHide={hideModal} backdrop="static" className="modal-close-out">
      <form onSubmit={handleSubmit}>
        {/* <Modal.Header closeButton>
          <Modal.Title>...</Modal.Title>
        </Modal.Header> */}

        <Modal.Body>
          <div className="mb-3 filled mt-2">
            <CsLineIcons icon="cupcake" />
            <Form.Control type="text" name="fileName" value={values.fileName} onChange={handleChange} placeholder="Digite um fileName para esse arquivo" />
            {errors.fileName && touched.fileName && <div className="error">{errors.fileName}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton
            isSaving={isSaving}
            onClickHandler={handleSubmit}
            type="submit"
            className="mb-1 btn btn-primary"
          >Salvar nome do arquivo</AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditFileNameModal;
