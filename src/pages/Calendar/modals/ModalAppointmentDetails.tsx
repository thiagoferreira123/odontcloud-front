import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Button, Col, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { SingleValue } from 'react-select';
import { useAuth } from '../../Auth/Login/hook';
import { useCalendarStore } from '../hooks';
import { EventPrint, eventStatusColorMap, statusOptions } from '../../../types/Events';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import Select from '../../../components/Select';
import { useQueryClient } from '@tanstack/react-query';
import { useModalAppointmentDetailsStore } from '../hooks/modals/ModalAppointmentDetailsStore';
import { useModalAddEditStore } from '../hooks/modals/ModalAddEditStore';
import useScheduleStore from '../hooks/ScheduleStore';
import { AppException } from '../../../helpers/ErrorHelpers';
import { EventStatus } from '../hooks/ScheduleStore/types';
import useScheduleHistoryStore from '../hooks/ScheduleHistoryStore';
import { ScheduleHistory, ScheduleHistoryOwnerType } from '../hooks/ScheduleHistoryStore/types';
import { notify } from '../../../components/toast/NotificationIcon';
import { useDeleteScheduleConfirmationModalStore } from '../hooks/modals/DeleteScheduleConfirmationModalStore';

const ModalAppointmentDetails = () => {
  const queryClient = useQueryClient();
  const showModal = useModalAppointmentDetailsStore((state) => state.showModal);

  const event = useCalendarStore((state) => state.event);
  const user = useAuth((state) => state.user);

  const eventStatus = statusOptions.find((option) => option.value === event.calendar_status);
  const [selectedStatus, setSelectedStatus] = useState<SingleValue<{ label: string; value: string }>>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { updateSchedule } = useScheduleStore();
  const { addScheduleHistory } = useScheduleHistoryStore();
  const { openModalAddEdit } = useModalAddEditStore();
  const { hideModal } = useModalAppointmentDetailsStore();
  const { handleSelectScheduleToRemove } = useDeleteScheduleConfirmationModalStore();

  const eventParsedDate = () => {
    if (!event.calendar_date) return '---';
    const date = format(new Date(event.calendar_date), 'dd/MM/yyyy');
    return `${date} ${event.calendar_start_time} às ${event.calendar_end_time} `;
  };

  const handleUpdateStatus = async () => {
    try {
      setIsSaving(true);

      if (!selectedStatus?.value) throw new AppException('Selecione um status para atualizar o agendamento');
      if (!event.id) throw new AppException('Agendamento não encontrado');

      const response = await updateSchedule({ calendar_status: selectedStatus.value as EventStatus, id: event.id }, queryClient);

      if (!response) throw new Error('Erro ao atualizar o status do agendamento');

      if (!response.calendar_professional_id) throw new Error('Profissional não encontrado');
      if (!response.calendar_location_id) throw new Error('Local não encontrado');
      if(!user?.id) throw new Error('user is not defined');

      hideModal();

      const history: ScheduleHistory = {
        calendar_history_description: `Alterou o status de ${eventStatus?.value} para ${EventPrint[response.calendar_status]} na consulta do paciente ${
          event.calendar_name?.label
        }`,
        calendar_history_date: new Date().toISOString(),
        calendar_history_location_id: response.calendar_location_id,
        calendar_history_schedule_id: response.id as number,
        calendar_history_owner_id: response.calendar_professional_id,
        calendar_history_owner_type:
            'nome_completo' in user ? ScheduleHistoryOwnerType.PROFISSIONAL : ScheduleHistoryOwnerType.COLABORADOR ?? ScheduleHistoryOwnerType.COLABORADOR,
      };

      addScheduleHistory(history, queryClient);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
    }
  };

  useEffect(() => {
    setSelectedStatus(eventStatus as SingleValue<{ label: string; value: string }>);
  }, [eventStatus, event]);

  if(!showModal) return null;

  return (
    <Modal onHide={hideModal} className="fade" size="lg" show={showModal}>
      <Modal.Header closeButton>Detalhes do Agendamento</Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <ul className="list-unstyled border-last-none d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2">
                <CsLineIcons icon="user" />
                {event.calendar_name?.label}
              </li>
              <li className="d-flex align-items-center gap-2">
                <CsLineIcons icon="email" />
                {event.calendar_email || '--'}
              </li>
              <li className="d-flex align-items-center gap-2">
                <CsLineIcons icon="phone" />
                {event.calendar_phone || '--'}
              </li>
            </ul>
          </Col>
          <Col md={6} className="text-end">
            <h4>{eventParsedDate()}</h4>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={6}>
            <div className="mb-3 top-label">
              <Select id="recorrencia" name="recorrencia" value={selectedStatus} options={statusOptions} onChange={(value) => setSelectedStatus(value)} />
              <span>Status da consulta</span>
            </div>
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            <div className="d-flex align-items-center gap-2">
              <CsLineIcons
                className="flex-shrink-0"
                icon="circle"
                size={9}
                fill={eventStatusColorMap[eventStatus?.value ?? 'CONFIRMADO']}
                stroke={eventStatusColorMap[eventStatus?.value ?? 'CONFIRMADO']}
              />
              {eventStatus?.label}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex align-items-center justify-content-center w-100 gap-2">
          <Button disabled={isSaving} className="btn-icon btn-icon-start" onClick={handleUpdateStatus}>
            {isSaving ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <CsLineIcons icon="save" />
                <span className="ml-1">Atualizar status</span>
              </div>
            )}
          </Button>
          <Button
            disabled={isSaving}
            className="btn-icon btn-icon-start"
            onClick={() => {
              hideModal();
              openModalAddEdit();
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <CsLineIcons icon="edit" />
              <span className="ml-1">Editar</span>
            </div>
          </Button>
          <OverlayTrigger delay={{ show: 500, hide: 0 }} overlay={<Tooltip>Excluir agendamento</Tooltip>} placement="top">
            <Button variant="outline-primary" className="btn-icon btn-icon-only" onClick={() => handleSelectScheduleToRemove(event)}>
              <CsLineIcons icon="bin" />
            </Button>
          </OverlayTrigger>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAppointmentDetails;
