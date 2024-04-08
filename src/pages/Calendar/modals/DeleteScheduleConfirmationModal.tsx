import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteScheduleConfirmationModalStore } from '../hooks/modals/DeleteScheduleConfirmationModalStore';
import useScheduleStore from '../hooks/ScheduleStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useModalAppointmentDetailsStore } from '../hooks/modals/ModalAppointmentDetailsStore';
import { ScheduleHistory, ScheduleHistoryOwnerType } from '../hooks/ScheduleHistoryStore/types';
import { useCalendarStore } from '../hooks';
import useScheduleHistoryStore from '../hooks/ScheduleHistoryStore';
import { useAuth } from '../../Auth/Login/hook';
import { useModalAddEditStore } from '../hooks/modals/ModalAddEditStore';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';

const DeleteScheduleConfirmationModal = () => {
  const showModal = useDeleteScheduleConfirmationModalStore((state) => state.showModal);
  const { resetEvent } = useCalendarStore((state) => state);

  const selectedSchedule = useDeleteScheduleConfirmationModalStore((state) => state.selectedSchedule);
  const { user } = useAuth((state) => state);
  const { selectedLocal } = useCalendarStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const { hideModal } = useDeleteScheduleConfirmationModalStore();
  const { removeSchedule } = useScheduleStore();
  const { addScheduleHistory } = useScheduleHistoryStore();
  const { hideModal: hideModalAppointmentDetails } = useModalAppointmentDetailsStore();
  const { hideModal: hideModalAddEdit } = useModalAddEditStore();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if (!selectedSchedule?.id) throw new AppException('selectedSchedule is not defined');
      if(!selectedLocal?.id) throw new AppException('selectedLocal is not defined');
      if(!user?.id) throw new AppException('user is not defined');

      const response = await removeSchedule(selectedSchedule.id, selectedLocal.id, queryClient);

      if (response === false) throw new Error('Erro ao remover agendamento');

      const history: ScheduleHistory = {
        calendar_history_description: `Cancelou um agendamento para o paciente ${selectedSchedule.calendar_name?.label}`,
        calendar_history_date: new Date().toISOString(),
        calendar_history_location_id: selectedLocal.id,
        calendar_history_schedule_id: selectedSchedule.id as number,
        calendar_history_owner_id: user.id,
        calendar_history_owner_type:
            'nome_completo' in user ? ScheduleHistoryOwnerType.PROFISSIONAL : ScheduleHistoryOwnerType.COLABORADOR ?? ScheduleHistoryOwnerType.COLABORADOR,
      };

      addScheduleHistory(history, queryClient);

      resetForm();
      setIsLoading(false);

      hideModal();
      hideModalAppointmentDetails();
      hideModalAddEdit();
      resetEvent();
    } catch (error) {
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      setIsLoading(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;

  if(!showModal) return null;

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Você realmente deseja excluir o agendamento? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
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

export default DeleteScheduleConfirmationModal;
