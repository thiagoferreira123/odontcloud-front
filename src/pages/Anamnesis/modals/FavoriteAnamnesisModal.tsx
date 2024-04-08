import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFavoriteAnamnesisModalStore } from '../hooks/modals/FavoriteAnamnesisModal';
import { useEditModalStore } from '../hooks/EditModalStore';
import { useQueryClient } from '@tanstack/react-query';
import { notify } from '../../../components/toast/NotificationIcon';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';

interface FormValues {
  titulo: string;
}

const FavoriteAnamnesisModal: React.FC = () => {
  const [isSaving, setIsSaving] = React.useState(false);

  const queryClient = useQueryClient();

  const showModal = useFavoriteAnamnesisModalStore((state) => state.showModal);
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);

  const initialValues: FormValues = { titulo: '' };

  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('Insira um titulo válido'),
  });

  const { hideModal, parseToAnamnesisTemplate } = useFavoriteAnamnesisModalStore();

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);

    try {
      if (!selectedAnamnesis) throw new Error('Anamnesis not found');

      const response = await parseToAnamnesisTemplate(values.titulo, selectedAnamnesis, queryClient);

      if (response !== false) hideModal();
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      notify('Erro ao salvar anamnese como modelo', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, values, touched, errors } = formik;

  return (
    <Modal show={showModal} onHide={hideModal} backdrop="static" className="modal-close-out">
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Salve esse plano alimentar para usar depois</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3 filled mt-2">
            <CsLineIcons icon="cupcake" />
            <Form.Control type="text" name="titulo" value={values.titulo} onChange={handleChange} placeholder="Digite um titulo para essa anamnese" />
            {errors.titulo && touched.titulo && <div className="error">{errors.titulo}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
            Salvar plano alimentar
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default FavoriteAnamnesisModal;
