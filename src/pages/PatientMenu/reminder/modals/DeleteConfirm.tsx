import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useClassicPlans from '../hooks/useClassicPlans';
import { toast } from 'react-toastify';
import api from '../../../../services/useAxios';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { notify } from '../../../../components/toast/NotificationIcon';
import { useQueryClient } from '@tanstack/react-query';

const DeleteConfirm = (props: { showModal: boolean; handleCloseModal: () => void }) => {
  const queryClient = useQueryClient();
  const selectedPlan = useClassicPlans((state) => state.selectedPlan);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const onSubmit = async () => {
    setIsLoading(true);

    try {

      if(!selectedPlan?.id) throw new Error('Recordatório não encontrado');

      const response = await removePlan(selectedPlan, queryClient);
      if(!response) throw new Error('Erro ao remover recordatório');

      resetForm();
      setIsLoading(false);
      notify('Recordatório removido com sucesso', 'Sucesso', 'bin');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      notify('Erro ao remover recordatório', 'Erro', 'error-hexagon');
    }

    props.handleCloseModal();
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;
  const { removePlan } = useClassicPlans();

  return (
    <Modal show={props.showModal} onHide={props.handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Você realmente deseja excluir o recordatório? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="filled mt-4">
            <CsLineIcons icon="bin" />
            <Form.Control type="text" name="confirm" value={values.confirm} onChange={handleChange} placeholder="Digite excluir para confirmar" />
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
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirm;
