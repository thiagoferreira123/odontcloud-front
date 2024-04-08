import React, { useState } from 'react';
import { Button, Modal, Form as BootstrapForm } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useConfirmDeleteTrackingModalStore } from '../hooks/ConfirmDeleteTrackingModalStore';
import { useQueryClient } from '@tanstack/react-query';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useMetabolicTrakingLooseStore } from '../hooks';

const validationSchema = Yup.object().shape({
  confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
});

const initialValues = { confirm: '' };

const ConfirmDeleteMetabolicTrakingModal = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const showModal = useConfirmDeleteTrackingModalStore((state) => state.showModal);
  const selectedMetabolicTracking = useConfirmDeleteTrackingModalStore((state) => state.selectedMetabolicTracking);

  const { hideModal } = useConfirmDeleteTrackingModalStore();
  const { removeMetabolicTracking } = useMetabolicTrakingLooseStore();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if (!selectedMetabolicTracking) throw new Error('Rastreamento metabólico não encontrado');

      await removeMetabolicTracking(selectedMetabolicTracking, queryClient);
      hideModal();
      resetForm();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;
  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <BootstrapForm onSubmit={handleSubmit} className="tooltip-end-top">
          Tem certeza que deseja excluir o Rastreamento metabólico do paciente <b>{selectedMetabolicTracking?.name_patient}</b>? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
          <div className="filled mt-4">
            <CsLineIcons icon="bin" />
            <BootstrapForm.Control type="text" name="confirm" value={values.confirm} onChange={handleChange} placeholder="Digite excluir para confirmar" />
            {errors.confirm && touched.confirm && <div className="error">{errors.confirm}</div>}
          </div>
          <div className="d-flex justify-content-center mt-3">
            {isLoading ? (
              <Button type="button" variant="primary" className="mb-1 btn btn-primary" disabled>
                <span className="spinner-border spinner-border-sm"></span> Excluindo...
              </Button>
            ) : (
              <Button type="submit" variant="primary" className="mb-1 btn btn-primary">
                Confirmar e excluir
              </Button>
            )}
          </div>
        </BootstrapForm>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteMetabolicTrakingModal;
