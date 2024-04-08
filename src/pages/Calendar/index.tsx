import React, { useState, useRef, useMemo } from 'react';
import { Row, Col, Card, Button, Dropdown, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import EventContentArg from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { SingleValue } from 'react-select';
import * as Icon from 'react-bootstrap-icons';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { FormEventModel, useCalendarStore } from './hooks';
import { EventColor, EventStatusColor, Local, appointmentOptions, recurrenceOptions } from '../../types/Events';
import { formatDateToApi, formatHourToApi, getTimeZones, isBeforeThanToday } from '../../helpers/Utils';
import { notify } from '../../components/toast/NotificationIcon';
import HtmlHead from '../../components/html-head/HtmlHead';
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventChangeArg, EventClickArg } from '@fullcalendar/core';

import ModalAddEdit from './modals/ModalAddEdit';
import ModalWaitingList from './modals/ModalWaitingList';
import ModalHistoric from './modals/ModalHistoric';
import ModalAppointmentList from './modals/ModalAppointmentList';
import ModalConfigCalendar from './modals/ModalConfigCalendar';
import LocalsSelect from './LocalsSelect';
import ModalAppointmentDetails from './modals/ModalAppointmentDetails';
import { useModalWaitingListStore } from './hooks/modals/ModalWaitingListStore';
import { useModalAddEditStore } from './hooks/modals/ModalAddEditStore';
import { useModalAppointmentListStore } from './hooks/modals/ModalAppointmentListStore';
import { useModalHistoricStore } from './hooks/modals/ModalHistoricStore';
import { useModalConfigCalendarStore } from './hooks/modals/ModalConfigCalendarStore';
import useScheduleStore from './hooks/ScheduleStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EventType, Schedule } from './hooks/ScheduleStore/types';
import { Patient } from '../../types/Patient';
import { HealthInsurance } from './hooks/HealthInsuranceStore/types';
import { Option } from '../../types/inputs';
import { useModalAppointmentDetailsStore } from './hooks/modals/ModalAppointmentDetailsStore';
import DeleteScheduleConfirmationModal from './modals/DeleteScheduleConfirmationModal';
import StaticLoading from '../../components/loading/StaticLoading';
import { useAuth } from '../Auth/Login/hook';
import { Role } from '../Auth/Login/hook/types';

const CustomToggle = React.forwardRef<HTMLButtonElement | null, { onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }>(
  ({ onClick }, ref) => (
    <Button
      ref={ref}
      size="sm"
      variant="foreground"
      className="btn-icon btn-icon-only shadow align-top mt-n2"
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <CsLineIcons icon="more-horizontal" data-cs-size="15" />
    </Button>
  )
);

const CalendarApp = () => {
  const user = useAuth((state) => state.user);
  const queryClient = useQueryClient();
  const { selectedLocal, setLocal, setEvent } = useCalendarStore((state) => state);

  const htmlTitle = 'Calendar';
  const htmlDescription = 'Implementation for a basic events and schedule application that built on top of Full Calendar plugin.';

  const calendarRef = useRef<FullCalendar>(null);
  const [dateTitle, setDateTitle] = useState('');
  const [selectedView, setSelectedView] = useState('dayGridMonth');

  const { openModalWaitingList } = useModalWaitingListStore();
  const { openModalAddEdit } = useModalAddEditStore();
  const { openModalAppointmentList } = useModalAppointmentListStore();
  const { openModalHistoric } = useModalHistoricStore();
  const { openModalConfigCalendar } = useModalConfigCalendarStore();
  const { openModalAppointmentDetails } = useModalAppointmentDetailsStore();
  const { getSchedules, updateSchedule } = useScheduleStore();

  const location_id = (user && 'id_local' in user && user.id_local ? user.id_local : null) ?? selectedLocal?.id;

  const getSchedules_ = async () => {
    try {
      if (!location_id) throw new AppException('Selecione um local para visualizar os agendamentos');

      const result = await getSchedules(location_id);

      if (result === false) throw new Error('Could not get schedules');

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  // Função para gerar eventos de bloqueio

  const result = useQuery({ queryKey: ['schedules', location_id], queryFn: getSchedules_, enabled: !!location_id });

  const events = useMemo(() => {
    const colorEvents =
      result.data?.map((event) => ({
        id: event.id?.toString(),
        title: event.calendar_name,
        start: `${event.calendar_date} ${event.calendar_start_time}`,
        end: `${event.calendar_date} ${event.calendar_end_time}`,
        category: event.calendar_type,
        color: EventColor[event.calendar_type],
        eventDisplay: 'block',
      })) ?? [];

    if (!selectedLocal) {
      return colorEvents;
    }

    const foundOptions = result.data?.filter((event) => event.calendar_location_id === selectedLocal.id);

    return colorEvents.filter((event) => foundOptions?.some((found) => found.id?.toString() == event.id));
  }, [result.data, selectedLocal]);

  const onPrevButtonClick = () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setDateTitle(calendarApi.view.title);
  };

  const onNextButtonClick = () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setDateTitle(calendarApi.view.title);
  };

  const viewDidMount = ({ view }: { view: { title: string } }) => {
    setDateTitle(view.title);
  };

  const changeView = (view: string) => {
    setSelectedView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  // handlers for user actions
  // ------------------------------------------------------------------------------------------
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    setEvent({ calendar_date: formatDateToApi(new Date(selectInfo.start.toDateString())) });
    openModalAddEdit();
  };

  const getEvent = (event: Schedule): FormEventModel => {
    const {
      calendar_patient_id,
      calendar_type,
      calendar_location_id,
      calendar_health_insurance_id,
      calendar_recurrence,
      calendar_recurrence_date_end,
      calendar_recurrence_quantity,
      calendar_recurrency_type_qnt,
      calendar_timezone,
      calendar_start_time,
      calendar_end_time,
      calendar_date,
      ...rest
    } = event;

    const patients = queryClient.getQueryData<Patient[]>(['patients']);
    const insurancies = queryClient.getQueryData<HealthInsurance[]>(['insurancies']);
    const locals = queryClient.getQueryData<Local[]>(['locals']);
    const timezones = getTimeZones();

    const foundPatient = patients?.find((patient) => patient.id === calendar_patient_id);
    const foundTipoConsulta = appointmentOptions.find((appointment) => appointment.value === calendar_type);
    const foundInsurancie = insurancies?.find((insurancie) => insurancie.calendar_health_insurance_id === calendar_health_insurance_id);
    const foundRecurrence = recurrenceOptions.find((option) => option?.value === calendar_recurrence);
    const foundLocal = locals?.find((local) => local.id === calendar_location_id);
    const foundTimezone = timezones.find(({ value }) => value === calendar_timezone);

    const formModel: FormEventModel = {
      ...rest,
      calendar_name: foundPatient
        ? ({ label: foundPatient.name, value: foundPatient.id?.toString() } as SingleValue<Option>)
        : { label: rest.calendar_name, value: '0' },
      calendar_type: foundTipoConsulta
        ? ({ label: foundTipoConsulta.label, value: foundTipoConsulta.value } as unknown as SingleValue<{ value: EventType; label: string }>)
        : null,
      calendar_observation: '',
      calendar_health_insurance_id: (foundInsurancie as unknown as SingleValue<HealthInsurance>) || null,
      calendar_recurrence: foundRecurrence || null,
      calendar_timezone: foundTimezone || null,
      calendar_video_conference: (rest.calendar_video_conference as number) ?? 0,
      calendar_recurrence_date_end: calendar_recurrence_date_end || '',
      calendar_recurrence_quantity: calendar_recurrence_quantity?.toString(),
      calendar_recurrency_type_qnt: calendar_recurrency_type_qnt?.toString(),
      calendar_start_time: `${calendar_start_time.split(':')[0]}:${calendar_start_time.split(':')[1]}`,
      calendar_end_time: `${calendar_end_time.split(':')[0]}:${calendar_end_time.split(':')[1]}`,
      calendar_date: new Date(`${calendar_date}, 00:00:00`).toDateString(),
    };

    foundLocal && setLocal(foundLocal);

    return formModel;
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const { id } = clickInfo.event;
    const foundEvent = result.data?.find((event) => event.id === +id);

    if (!foundEvent) return;

    const model = getEvent(foundEvent);

    setEvent(model);
    openModalAppointmentDetails();
  };

  const handleLocalSelect = (value: SingleValue<Local>) => {
    setLocal(value);
  };

  // handlers that initiate reads/writes via the 'action' props
  // ------------------------------------------------------------------------------------------
  const handleEventChange = async (changeInfo: EventChangeArg) => {
    try {
      const { event } = changeInfo;

      const foundEvent = result.data?.find(({ id }) => id === +event.id);
      if (!event.start || !event.end || !foundEvent) return;

      if (isBeforeThanToday(event.start)) {
        changeInfo.revert();
        return notify('Não é possível alterar a data para o passado!', 'Erro', 'close', 'danger');
      }

      if (!foundEvent.id) throw new Error('Event id not found');

      const response = await updateSchedule(
        {
          ...foundEvent,
          id: foundEvent.id,
          calendar_date: formatDateToApi(new Date(event.start)),
          calendar_start_time: formatHourToApi(new Date(event.start)),
          calendar_end_time: formatHourToApi(new Date(event.end)),
          alertas: undefined,
        },
        queryClient
      );

      if (!response) throw new Error('Could not update schedule');

      changeInfo.revert();
    } catch (error) {
      console.error(error);
    }
  };

  const renderEventContent = (eventInfo: EventContentArg & { event: any }) => {
    const { title, id } = eventInfo.event;
    const foundEvent = result.data?.find((event) => event.id?.toString() === id);
    const getHour = (hourString: string) => {
      const [hour, minute] = hourString.split(':');
      return `${hour}: ${minute}`;
    };
    if (!foundEvent) return;

    return (
      <div className="position-relative">
        <div className="fc-event-main-frame">
          <div className="fc-event-title-container d-flex justify-content-between align-items-center">
            <div className='d-flex align-items-center flex-wrap"'>
              <CsLineIcons
                className="flex-shrink-0"
                icon="circle"
                size={9}
                fill={EventStatusColor[foundEvent.calendar_status]}
                stroke={EventStatusColor[foundEvent.calendar_status]}
              />
              <div className="fc-event-title fc-sticky">{getHour(foundEvent.calendar_start_time)}</div>
              <div className="fc-event-title fc-sticky ml-1">{title}</div>
            </div>
            {foundEvent.calendar_video_conference ? <CsLineIcons className="flex-shrink-0 justify-self-end" icon="video" size={12} /> : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <HtmlHead title={htmlTitle} description={htmlDescription} />

      {/* Title Start */}
      <div className="page-title-container">
        <Row className="g-0">
          <div className="w-100 d-md-none" />
          <Col xs="auto" className="d-flex align-items-start justify-content-end">
            <Button variant="primary" className="btn-icon btn-icon-only ms-1" onClick={onPrevButtonClick}>
              <CsLineIcons icon="chevron-left" />
            </Button>
            <Button variant="primary" className="btn-icon btn-icon-only ms-1" onClick={onNextButtonClick}>
              <CsLineIcons icon="chevron-right" />
            </Button>
          </Col>
          <Col md="auto" className="d-flex align-items-start justify-content-end"></Col>
        </Row>
      </div>
      {/* Title End */}
      {/* Calendar Title Start */}
      <div className="d-flex justify-content-between">
        <h2 className="small-title">{dateTitle}</h2>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
          <Dropdown.Menu
            className="super-colors shadow dropdown-menu-end"
            popperConfig={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 5],
                  },
                },
                {
                  name: 'computeStyles',
                  options: {
                    gpuAcceleration: false,
                  },
                },
              ],
            }}
          >
            <Dropdown.Item eventKey="dayGridMonth" active={selectedView === 'dayGridMonth'} onClick={() => changeView('dayGridMonth')}>
              Mês
            </Dropdown.Item>
            <Dropdown.Item eventKey="timeGridWeek" active={selectedView === 'timeGridWeek'} onClick={() => changeView('timeGridWeek')}>
              Semana
            </Dropdown.Item>
            <Dropdown.Item eventKey="timeGridDay" active={selectedView === 'timeGridDay'} onClick={() => changeView('timeGridDay')}>
              Dia
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {/* Calendar Title End */}

      <Row className="justify-content-between mb-3">
        <Col md={4} className={user?.role === Role.SECRETARY ? 'd-none' : undefined}>
          <LocalsSelect onChange={handleLocalSelect} />
        </Col>
        <Col md={8} className="text-md-end gap-2 d-flex flex-wrap align-items-center">
          <Button variant="primary" className="btn-icon btn-icon-start ms-1 w-100 w-md-auto" disabled={selectedLocal === null} onClick={openModalAddEdit}>
            <CsLineIcons icon="plus" /> <span>Cadastrar agendamento</span>
          </Button>

          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add">Lista de espera</Tooltip>}>
            <Button variant="primary" disabled={selectedLocal === null} className="btn-icon btn-icon-start ms-1 w-100 w-md-auto" onClick={openModalWaitingList}>
              <Icon.Clock />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add">Lista de agendamentos realizados</Tooltip>}>
            <Button
              variant="primary"
              disabled={selectedLocal === null}
              className="btn-icon btn-icon-start ms-1 w-100 w-md-auto"
              onClick={openModalAppointmentList}
            >
              <Icon.List />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add">Histórico de ações</Tooltip>}>
            <Button disabled={selectedLocal === null} variant="primary" className="btn-icon btn-icon-start ms-1 w-100 w-md-auto" onClick={openModalHistoric}>
              <Icon.ListCheck />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add">Configuração da agenda</Tooltip>}>
            <Button
              variant="primary"
              disabled={selectedLocal === null}
              className="btn-icon btn-icon-start ms-1 w-100 w-md-auto"
              onClick={openModalConfigCalendar}
            >
              <Icon.Gear />
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
      {result.isLoading || result.isPending ? (
        <div className="sh-60 d-flex align-items-center justify-content-center">
          <StaticLoading />
        </div>
      ) : result.isError ? (
        <div className="sh-60 d-flex align-items-center justify-content-center">Erro ao buscar agendamentos</div>
      ) : (
        <Card body className='z-1'>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrapPlugin]}
            headerToolbar={false}
            initialView="dayGridMonth"
            themeSystem="bootstrap"
            eventDisplay="block"
            editable
            selectable
            selectMirror
            dayMaxEvents
            weekends
            height={'auto'}
            select={handleDateSelect}
            events={events}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventChange={handleEventChange} // called for drag-n-drop/resize
            viewDidMount={viewDidMount}
            locale="pt-br"
            viewHeight={'auto'}
            contentHeight={'auto'}
            eventMinHeight={30}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
            }}
            slotMinTime={selectedLocal?.hora_inicio ?? '08:00:00'}
            slotMaxTime={selectedLocal?.hora_final ?? '18:00:00'}
            allDaySlot={false}
            businessHours={selectedLocal?.hora_inicio ? [
              {
                daysOfWeek: selectedLocal?.dias_semana?.split(',').map((day) => +day - 1) ?? [],
                startTime: selectedLocal?.hora_inicio ?? '08:00:00',
                endTime: selectedLocal?.almoco_inicio ?? '12:00:00',
              },
              {
                daysOfWeek: selectedLocal?.dias_semana?.split(',').map((day) => +day - 1) ?? [],
                startTime: selectedLocal?.almoco_final ?? '13:00:00',
                endTime: selectedLocal?.hora_final ?? '18:00:00',
              },
            ] : {
              daysOfWeek: selectedLocal?.dias_semana?.split(',').map((day) => +day - 1) ?? [],
              startTime: selectedLocal?.hora_inicio ?? '08:00:00',
              endTime: selectedLocal?.hora_final ?? '18:00:00',
            }}
          />
          <Row>
            <Col md={6} className="mt-5">
              <label className="my-custom-link text-end">
                Categorias de agendamentos:
                <Badge pill className='bg-consulta'>
                  Consulta
                </Badge>{' '}
                <Badge pill bg="warning">
                  Retorno
                </Badge>{' '}
                <Badge pill bg="danger">
                  Possível retorno
                </Badge>{' '}
                <Badge pill bg="tertiary">
                  Agendado pelo site
                </Badge>{' '}
                <Badge pill bg="quaternary">
                  Outros
                </Badge>{' '}
              </label>
            </Col>
            <Col md={6} className="mt-5">
              <label className="my-custom-link text-end">
                Status dos agendamentos:
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
            </Col>
          </Row>
        </Card>
      )}

      <ModalAddEdit />

      <ModalWaitingList />
      <ModalHistoric />
      <ModalAppointmentList />
      <ModalConfigCalendar />
      <ModalAppointmentDetails />

      <DeleteScheduleConfirmationModal />
    </>
  );
};

export default CalendarApp;
