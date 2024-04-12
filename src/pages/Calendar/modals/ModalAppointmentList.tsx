import classNames from 'classnames';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { format, parseISO } from 'date-fns';
import { FormEventModel, useCalendarStore } from '../hooks';
import React, { useMemo, useState } from 'react';
import { Badge, Button, Col, Form, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { EventStatusColor, Local, appointmentOptions, recurrenceOptions } from '../../../types/Events';
import useScheduleStore from '../hooks/ScheduleStore';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EventType, Schedule } from '../hooks/ScheduleStore/types';
import { Patient } from '../../../types/Patient';
import { HealthInsurance } from '../hooks/HealthInsuranceStore/types';
import { getTimeZones } from '../../../helpers/Utils';
import { SingleValue } from 'react-select';
import { Option } from '../../../types/inputs';
import { useModalAppointmentListStore } from '../hooks/modals/ModalAppointmentListStore';
import { useModalAddEditStore } from '../hooks/modals/ModalAddEditStore';
import { useAuth } from '../../Auth/Login/hook';

const formatDateTime = (event: Schedule) => {
  const parsedDate = parseISO(event.calendar_date);
  const date = format(parsedDate, 'dd/MM/yyyy');
  const calendar_start_time = `${event.calendar_start_time.split(':')[0]}:${event.calendar_start_time.split(':')[1]}`;
  const calendar_end_time = `${event.calendar_end_time.split(':')[0]}:${event.calendar_end_time.split(':')[1]}`;
  return `${date} | ${calendar_start_time} - ${calendar_end_time}`;
};

const ModalAppointmentList = () => {

  const user = useAuth((state) => state.user);

  const queryClient = useQueryClient();
  const showModal = useModalAppointmentListStore((state) => state.showModal);

  const { selectedLocal, setEvent } = useCalendarStore((state) => state);

  const [searchQuery, setSearchQuery] = useState('');

  const { setLocal } = useCalendarStore((state) => state);
  const { getSchedules } = useScheduleStore();
  const { hideModal } = useModalAppointmentListStore();
  const { openModalAddEdit } = useModalAddEditStore();

  const getSchedules_ = async () => {
    try {
      const result = await getSchedules();

      if (result === false) throw new Error('Could not get schedules');

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEditEvent = (event: Schedule) => {
    const eventModel = getEvent(event);
    setEvent(eventModel);
    hideModal();
    openModalAddEdit();
  };

  const openWhatsApp = (phoneNumber: string) => {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=55${phoneNumber}`;

    window.open(whatsappUrl, '_blank');
  };

  const getEvent = (event: Schedule): FormEventModel => {
    const {
      calendar_patient_id,
      calendar_type,
      calendar_recurrence_quantity,
      calendar_recurrency_type_qnt,
      calendar_start_time,
      calendar_end_time,
      calendar_date,
      calendar_medical_insurance,
      calendar_recurrence,
      calendar_recurrence_date_end,
      calendar_timezone,
      ...rest
    } = event;

    const patients = queryClient.getQueryData<Patient[]>(['patients']);
    const insurancies = queryClient.getQueryData<HealthInsurance[]>(['insurancies']);
    const timezones = getTimeZones();

    const foundPatient = patients?.find((patient) => patient.id === calendar_patient_id);
    const foundTipoConsulta = appointmentOptions.find((appointment) => appointment.value === calendar_type);
    const foundInsurancie = insurancies?.find((insurancie) => insurancie.calendar_medical_insurance === calendar_medical_insurance);
    const foundRecurrence = recurrenceOptions.find((option) => option?.value === calendar_recurrence);
    const foundTimezone = timezones.find(({ value }) => value === calendar_timezone);

    const formModel: FormEventModel = {
      ...rest,
      calendar_name: foundPatient ? ({ label: foundPatient.name, value: foundPatient.id?.toString() } as SingleValue<Option>) : { label: rest.calendar_name, value: '0' },
      calendar_type: foundTipoConsulta
        ? ({ label: foundTipoConsulta.label, value: foundTipoConsulta.value } as unknown as SingleValue<{ value: EventType; label: string }>)
        : null,
      calendar_observation: '',
      calendar_medical_insurance: (foundInsurancie as unknown as SingleValue<HealthInsurance>) || null,
      calendar_recurrence: foundRecurrence || null,
      calendar_timezone: foundTimezone || null,
      calendar_video_conference: rest.calendar_video_conference as number ?? 0,
      calendar_recurrence_date_end: calendar_recurrence_date_end || '',
      calendar_recurrence_quantity: calendar_recurrence_quantity?.toString(),
      calendar_recurrency_type_qnt: calendar_recurrency_type_qnt?.toString(),
      calendar_start_time: `${calendar_start_time.split(':')[0]}:${calendar_start_time.split(':')[1]}`,
      calendar_end_time: `${calendar_end_time.split(':')[0]}:${calendar_end_time.split(':')[1]}`,
      calendar_date: new Date(`${calendar_date}, 00:00:00`).toDateString(),
    };

    return formModel;
  };

  const result = useQuery({ queryKey: ['schedules'], queryFn: getSchedules_ });

  const filteredEvents = useMemo(() => {
    const eventsByQuery = result.data?.filter((event) => event.calendar_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return eventsByQuery?.sort((a, b) => new Date(b.calendar_date).getTime() - new Date(a.calendar_date).getTime());
  }, [result.data, searchQuery]);

  if(!showModal) return null;

  return (
    <Modal
      className="modal-close-out"
      size="xl"
      show={showModal}
      onHide={hideModal}
      backdrop="static"
      keyboard={false}
    >
      <div
        className={classNames('mb-5', {
          'overlay-spinner': result.isLoading,
        })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Lista de agendamentos realizados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="scroll-out">
            <div className="override-native overflow-auto sh-35 pe-3">
              <Col md="5" lg="6" xxl="4" className="mb-1">
                <div className="d-inline-block float-md-start me-1 mb-3 search-input-container w-100  bg-background">
                  <Form.Control onChange={handleSearchChange} type="text" placeholder="Digite o nome do agendamento" />
                  <span className="search-magnifier-icon">
                    <CsLineIcons icon="search" />
                  </span>
                </div>
              </Col>
              <Table striped>
                <thead>
                  <tr>
                    <th scope="col">Status | Nome do agendamento</th>
                    <th scope="col">Categorias do agendamento</th>
                    <th scope="col">Data | Horário</th>
                    <th scope="col">Contato</th>
                    <th scope="col">Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <th>
                        <CsLineIcons
                          fill={EventStatusColor[event.calendar_status]}
                          stroke={EventStatusColor[event.calendar_status]}
                          icon="circle"
                          className="text-primary align-top me-1"
                        />
                        {event.calendar_name}
                      </th>
                      <td>{event.calendar_type}</td>
                      <td>{formatDateTime(event)}</td>
                      <td>
                        {event.calendar_phone ? (
                          <>
                            {event.calendar_phone}
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-phone">Entre em contato por WhatsApp Web. O WhatsApp Web precisa estar aberto no navegador.</Tooltip>
                              }
                            >
                              <Button onClick={() => openWhatsApp(event.calendar_phone)} variant="outline-primary" className="btn-icon btn-icon-only ms-2" size="sm">
                                <CsLineIcons icon="phone" />
                              </Button>
                            </OverlayTrigger>
                          </>
                        ) : (
                          '--'
                        )}
                      </td>
                      <td>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-edit">Editar o agendamento.</Tooltip>}>
                          <Button onClick={() => handleEditEvent(event)} variant="outline-primary" className="btn-icon btn-icon-only" size="sm">
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <label className="my-custom-link me-3 text-center">
            <Badge pill bg="primary">
              Confirmada
            </Badge>{' '}
            <Badge pill bg="warning">
              Pendente
            </Badge>{' '}
            <Badge pill bg="danger">
              Desmarcada
            </Badge>{' '}
            <Badge pill bg="quaternary">
              Não compareceu
            </Badge>{' '}
          </label>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ModalAppointmentList;
