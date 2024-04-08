import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { SingleValue } from 'react-select';
import InsuranciesSelect from '../ModalWaitingList/InsuranciesSelect';
import PacientSelect from './PacientSelect';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAfter, isBefore, parse } from 'date-fns';
import { useAuth } from '../../../Auth/Login/hook';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { formatDateToApi, getTimeZones, getWeekDay, isObjectNotEmpty } from '../../../../helpers/Utils';

import { FormEventModel, useCalendarStore } from '../../hooks';
import { EventStatus, RecurrenceType, appointmentOptions, recurrenceOptions } from '../../../../types/Events';
import Select from '../../../../components/Select';
import DatePicker from '../../../../components/DatePicker';
import DatepickerTime from '../../../../views/interface/forms/controls/datepicker/DatepickerTime';
import { Option } from '../../../../types/inputs';
import useScheduleStore from '../../hooks/ScheduleStore';
import { EventType, Schedule } from '../../hooks/ScheduleStore/types';
import usePatients from '../../../../hooks/usePatients';
import { AppException } from '../../../../helpers/ErrorHelpers';
import { notify } from '../../../../components/toast/NotificationIcon';
import useScheduleHistoryStore from '../../hooks/ScheduleHistoryStore';
import { ScheduleHistory, ScheduleHistoryOwnerType } from '../../hooks/ScheduleHistoryStore/types';
import { useModalAddEditStore } from '../../hooks/modals/ModalAddEditStore';
import { useDeleteScheduleConfirmationModalStore } from '../../hooks/modals/DeleteScheduleConfirmationModalStore';
import { useModalDayOffModalStore } from '../../hooks/modals/ModalDayOffModalStore';
import DayOffModal from '../DayOffModal';

const validationSchema = yup.object({
  calendar_name: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable()
    .required('Escolha um paciente'),
  calendar_type: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable()
    .required('Escolha um tipo de consulta'),
  calendar_email: yup.string().email('Email inválido').notRequired(),
  calendar_phone: yup.string().notRequired(),
  calendar_date: yup.string().required('Escolha a data da consulta'),
  calendar_start_time: yup.string().nullable().required('Escolha a hora de início'),
  calendar_end_time: yup
    .string()
    .nullable()
    .required('Escolha a hora final')
    .test('is-greater', 'A hora final deve ser maior que a hora inicial', function (this: any, value: string | null | undefined) {
      const { calendar_start_time } = this.parent;
      if (!calendar_start_time || !value) {
        return true;
      }
      const [hours1, minutes1] = calendar_start_time.split(':').map(Number);
      const [hours2, minutes2] = value.split(':').map(Number);

      const date1 = new Date(0, 0, 0, hours1, minutes1);
      const date2 = new Date(0, 0, 0, hours2, minutes2);

      return date1 < date2;
    }),
  calendar_health_insurance_id: yup
    .object()
    .shape({
      id: yup.string(),
    })
    .nullable(),
  calendar_recurrence: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable(),

  calendar_recurrence_type: yup.string().when('calendar_recurrence', (calendar_recurrence, schema) => {
    return calendar_recurrence[0] !== null && calendar_recurrence[0] !== undefined && calendar_recurrence[0].value
      ? schema.required('Escolha o tipo de recorrência')
      : schema.notRequired();
  }),

  calendar_recurrence_date_end: yup.string().when('calendar_recurrence_type', (calendar_recurrence_type, schema) => {
    return calendar_recurrence_type[0] === 'data' ? schema.required('Escolha a data fim da calendar_recurrence') : schema.notRequired();
  }),

  calendar_recurrency_type_qnt: yup.number().when('calendar_recurrence_type', (calendar_recurrence_type, schema) => {
    return calendar_recurrence_type[0] === 'quantidade'
      ? schema.min(1, 'Escolha a quantidade de recorrências').required('Escolha a quantidade de recorrências')
      : schema.notRequired();
  }),

  calendar_recurrence_quantity: yup.number().when('calendar_recurrence', (calendar_recurrence, schema) => {
    return calendar_recurrence[0] !== null && calendar_recurrence[0] !== undefined && calendar_recurrence[0].value
      ? schema.min(1, 'Escolha a quantidade fim').required('Escolha a quantidade fim')
      : schema.notRequired();
  }),
});

const recurrenceTypeText = {
  days: 'dias',
  weeks: 'semanas',
  months: 'meses',
};

const ModalAddEdit = () => {
  const queryClient = useQueryClient();

  const showModal = useModalAddEditStore((state) => state.showModal);

  const { event, selectedLocal, resetEvent } = useCalendarStore((state) => state);
  const user = useAuth((state) => state.user);

  const formRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);

  const { addSchedule, buildRecurrencySchedules, updateSchedule } = useScheduleStore();
  const { handleSelectScheduleToRemove } = useDeleteScheduleConfirmationModalStore();
  const { openModalDayOffModal, hideModal: hideModalModalDayOffModal } = useModalDayOffModalStore();
  const { addScheduleHistory } = useScheduleHistoryStore();
  const { getPatients } = usePatients();
  const { hideModal } = useModalAddEditStore();

  const getPatients_ = async () => {
    try {
      const result = await getPatients();

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const patientsResult = useQuery({ queryKey: ['patients'], queryFn: getPatients_ });

  const onSubmit = async (values: FormEventModel) => {
    try {
      setIsSaving(true);

      const {
        calendar_name,
        calendar_type,
        calendar_health_insurance_id,
        calendar_timezone,
        calendar_recurrence,
        calendar_date,
        calendar_recurrence_date_end,
        calendar_status,
        ...rest
      } = values;

      if (!selectedLocal?.id) throw new Error('Local não selecionado');
      if (!values.calendar_start_time) throw new Error('Hora de início não selecionada');
      if (!values.calendar_end_time) throw new Error('Hora final não selecionada');

      const payload: Schedule = {
        calendar_status: (calendar_status as EventStatus) || 'AGENDADO',
        calendar_name: calendar_name?.label ?? '',
        calendar_type: calendar_type?.value as EventType,
        calendar_health_insurance_id: calendar_health_insurance_id?.calendar_health_insurance_id,
        calendar_timezone: calendar_timezone?.value,
        calendar_recurrence: calendar_recurrence?.value,
        calendar_recurrence_date_end: calendar_recurrence_date_end ? formatDateToApi(new Date(`${calendar_recurrence_date_end}, 00:00:00`)) : null,
        calendar_date: formatDateToApi(new Date(`${calendar_date}, 00:00:00`)),
        calendar_patient_id: calendar_name?.value ? +calendar_name?.value : undefined,
        calendar_location_id: selectedLocal?.id,
        calendar_professional_id: selectedLocal?.profissional,
        ...rest,
        calendar_video_conference: values.calendar_video_conference ? 1 : 0,
        calendar_start_time: values.calendar_start_time,
        calendar_end_time: values.calendar_end_time,
        calendar_recurrence_type: values.calendar_recurrence_type ? (values.calendar_recurrence_type as RecurrenceType) : undefined,
        calendar_recurrence_quantity: values.calendar_recurrence_quantity ? +values.calendar_recurrence_quantity : undefined,
        calendar_recurrency_type_qnt: values.calendar_recurrency_type_qnt ? +values.calendar_recurrency_type_qnt : undefined,
      };

      if (event.id) {
        const response = await updateSchedule({ ...payload, id: event.id, alertas: undefined }, queryClient);

        if (response === false) throw new Error('Erro ao atualizar agendamento');

        if (!user?.id) throw new Error('Profissional não encontrado');

        if (!response.calendar_location_id) throw new Error('Local não encontrado');

        const history: ScheduleHistory = {
          calendar_history_description: `Alterou o agendamento do paciente ${payload.calendar_name}`,
          calendar_history_date: new Date().toISOString(),
          calendar_history_location_id: payload.calendar_location_id,
          calendar_history_schedule_id: event.id as number,
          calendar_history_owner_id: user.id,
          calendar_history_owner_type:
            'nome_completo' in user ? ScheduleHistoryOwnerType.PROFISSIONAL : ScheduleHistoryOwnerType.COLABORADOR ?? ScheduleHistoryOwnerType.COLABORADOR,
        };

        addScheduleHistory(history, queryClient);
      } else if (calendar_recurrence?.value) {
        const schedules = buildRecurrencySchedules(payload);

        if (schedules === false) throw new Error('Erro ao adicionar agendamentos');

        for (const schedule of schedules) {
          const response = await addSchedule(schedule, queryClient);

          if (response === false) throw new Error('Erro ao adicionar agendamento');

          if (!user?.id) throw new Error('Profissional não encontrado');

          if (!response.calendar_location_id) throw new Error('Local não encontrado');

          const history: ScheduleHistory = {
            calendar_history_description: `Adicionou um novo agendamento para o paciente ${response.calendar_name}`,
            calendar_history_date: new Date().toISOString(),
            calendar_history_location_id: response.calendar_location_id,
            calendar_history_schedule_id: response.id as number,
            calendar_history_owner_id: user.id,
            calendar_history_owner_type:
            'nome_completo' in user ? ScheduleHistoryOwnerType.PROFISSIONAL : ScheduleHistoryOwnerType.COLABORADOR ?? ScheduleHistoryOwnerType.COLABORADOR,
          };

          addScheduleHistory(history, queryClient);
        }
      } else {
        const response = await addSchedule(payload, queryClient);

        if (response === false) throw new Error('Erro ao adicionar agendamento');

        if (!user?.id) throw new Error('Profissional não encontrado');

        if (!response.calendar_location_id) throw new Error('Local não encontrado');

        const history: ScheduleHistory = {
          calendar_history_description: `Adicionou um novo agendamento para o paciente ${response.calendar_name}`,
          calendar_history_date: new Date().toISOString(),
          calendar_history_location_id: response.calendar_location_id,
          calendar_history_schedule_id: response.id as number,
          calendar_history_owner_id: user.id,
          calendar_history_owner_type:
            'nome_completo' in user ? ScheduleHistoryOwnerType.PROFISSIONAL : ScheduleHistoryOwnerType.COLABORADOR ?? ScheduleHistoryOwnerType.COLABORADOR,
        };

        addScheduleHistory(history, queryClient);
      }

      hideModal();

      setIsSaving(false);
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      setIsSaving(false);
    }
  };

  const { values, errors, touched, resetForm, handleChange, setFieldValue, handleSubmit, submitForm, validateForm, setValues } = useFormik({
    initialValues: {
      ...event,
      calendar_recurrence: undefined,
      calendar_recurrence_type: '',
      calendar_recurrence_date_end: '',
      calendar_recurrence_quantity: '',
      calendar_recurrency_type_qnt: '',
      calendar_status: '',
      calendar_name: null,
      calendar_type: null,
      calendar_video_conference: 0,
      calendar_email: '',
      calendar_phone: '',
      calendar_date: '',
      calendar_start_time: undefined,
      calendar_end_time: undefined,
      calendar_timezone: null,
      calendar_observation: '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });

  const checkAvailability = async () => {
    const errors = await validateForm(values);
    if (!selectedLocal || isObjectNotEmpty(errors)) return false;

    const { calendar_date, calendar_start_time, calendar_end_time } = values;

    const parsedHoraInicio = parse(calendar_start_time || '', 'HH:mm', new Date());
    const parsedHoraFinal = parse(calendar_end_time || '', 'HH:mm', new Date());
    const parsedWorkHoraInicio = parse(selectedLocal.hora_inicio || '', 'HH:mm', new Date());
    const parsedWorkHoraFinal = parse(selectedLocal.hora_final || '', 'HH:mm', new Date());

    const workWeekDays = selectedLocal.dias_semana?.split(',').map((day) => +day);
    const weekDay = getWeekDay(new Date(`${calendar_date}, 00:00:00`));

    const isDayOff = !workWeekDays || !workWeekDays.includes(weekDay + 1);
    const isBeforeWorkHours = isBefore(parsedHoraInicio, parsedWorkHoraInicio);
    const isAfterWorkHours = isAfter(parsedHoraFinal, parsedWorkHoraFinal);

    return isDayOff || isBeforeWorkHours || isAfterWorkHours;
  };

  const handleSelectChange = (value: any, field: string) => {
    setFieldValue(field, value);
  };

  const handlePatientChange = (option: Option | null) => {
    if (!option) {
      return handleSelectChange(option, 'calendar_name');
    }
    const found = patientsResult.data?.find((patient) => patient.id && patient.id.toString() === option.value);
    if (found) {
      setFieldValue('calendar_email', found.email || '');
      setFieldValue('calendar_phone', found.phone || '');
    }
    handleSelectChange(option, 'calendar_name');
  };

  const handleRadioChange = (name: string, value: string) => {
    setFieldValue('calendar_recurrency_type_qnt', '');
    setFieldValue('calendar_recurrence_date_end', '');
    setFieldValue(name, value);
  };

  const handleRecurrenceChange = (value: SingleValue<{ value: string; label: string }>) => {
    setFieldValue('calendar_recurrence_type', '');
    setFieldValue('calendar_recurrence_date_end', '');
    setFieldValue('calendar_recurrence_quantity', '');
    setFieldValue('calendar_recurrency_type_qnt', '');
    handleSelectChange(value, 'calendar_recurrence');
  };

  const handleTimeChange = (value: Date | undefined | null, field: string) => {
    if (!value) return setFieldValue(field, value);
    const date = new Date(value);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHour = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    setFieldValue(field, formattedHour);
  };

  const handleRefSubmit = () => {
    submitForm();
  };

  useEffect(() => {
    if (!showModal) {
      resetForm();
      resetEvent();
      hideModalModalDayOffModal();
    }
  }, [showModal, resetEvent, resetForm]);

  useEffect(() => {
    event && setValues({ ...event, calendar_recurrence_type: '' });
  }, [event, setValues]);

  if (!showModal) return null;

  return (
    <>
      <Modal className="fade" size="lg" show={showModal} onHide={hideModal} backdrop="static" keyboard={false}>
        <Form
          ref={formRef}
          onSubmit={async (e) => {
            e.preventDefault();
            const isDayOff = await checkAvailability();
            if (isDayOff) {
              return openModalDayOffModal();
            }
            handleSubmit(e);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{event.id ? 'Editar agendamento' : 'Cadastre um agendamento'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column">
            <Row>
              <Col md={8}>
                <PacientSelect value={values.calendar_name as SingleValue<Option>} onChange={handlePatientChange} />
                {errors.calendar_name && touched.calendar_name && <div className="error">{errors.calendar_name.toString()}</div>}
              </Col>
              <Col className="relative" md={4}>
                <div className="mb-3 top-label position-relative">
                  <Select
                    id="calendar_type"
                    name="calendar_type"
                    value={values.calendar_type}
                    onChange={(value) => handleSelectChange(value, 'calendar_type')}
                    options={appointmentOptions}
                  />
                  <span>TIPO DE AGENDAMENTO</span>
                  {errors.calendar_type && touched.calendar_type && <div className="error">{errors.calendar_type}</div>}
                </div>
              </Col>
              <div className="mb-3 top-label">
                <Form.Check
                  name="calendar_video_conference"
                  id="calendar_video_conference"
                  value={1}
                  onChange={handleChange}
                  type="checkbox"
                  defaultChecked={values.calendar_video_conference === 1}
                  label="Videoconferência"
                />
              </div>
            </Row>
            <Row>
              <Col md={8}>
                <div className="mb-3 top-label position-relative">
                  <Form.Control id="calendar_email" name="calendar_email" value={values.calendar_email} onChange={handleChange} type="text" />
                  <Form.Label>EMAIL</Form.Label>
                  {errors.calendar_email && touched.calendar_email && <div className="error">{errors.calendar_email}</div>}
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3 top-label position-relative">
                  <Form.Control id="calendar_phone" value={values.calendar_phone} onChange={handleChange} type="text" />
                  <Form.Label>CELULAR</Form.Label>
                  {errors.calendar_phone && touched.calendar_phone && <div className="error">{errors.calendar_phone}</div>}
                </div>
              </Col>
            </Row>
            <Row className="g-0">
              <Col md={4} className="pe-1">
                <div className="mb-3 top-label position-relative">
                  <DatePicker
                    name="calendar_date"
                    id="calendar_date"
                    selected={values.calendar_date ? new Date(`${values.calendar_date}, 00:00:00`) : null}
                    onChange={(value) => setFieldValue('calendar_date', value?.toDateString())}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    showFullMonthYearPicker
                  />
                  <span style={{ background: 'transparent' }}>DATA DO AGENDAMENTO</span>
                  {errors.calendar_date && touched.calendar_date && <div className="error">{errors.calendar_date}</div>}
                </div>
              </Col>
              <Col md={2} className="pe-1">
                <div className="mb-3 top-label position-relative">
                  <DatepickerTime
                    id="calendar_start_time"
                    name="calendar_start_time"
                    value={values.calendar_start_time}
                    onChange={(value) => handleTimeChange(value, 'calendar_start_time')}
                  />
                  <span>HORA INÍCIO</span>
                  {errors.calendar_start_time && touched.calendar_start_time && <div className="error">{errors.calendar_start_time}</div>}
                </div>
              </Col>
              <Col md={2} className="pe-2">
                <div className="mb-3 top-label position-relative">
                  <DatepickerTime
                    id="horaFim"
                    name="horaFim"
                    value={values.calendar_end_time}
                    onChange={(value) => handleTimeChange(value, 'calendar_end_time')}
                  />
                  <span>HORA FIM</span>
                  {errors.calendar_end_time && touched.calendar_end_time && <div className="error">{errors.calendar_end_time}</div>}
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3 top-label ms-3">
                  <InsuranciesSelect
                    value={values.calendar_health_insurance_id}
                    onChange={(value) => handleSelectChange(value, 'calendar_health_insurance_id')}
                  />
                  {errors.calendar_health_insurance_id && touched.calendar_health_insurance_id && (
                    <div className="error">{errors.calendar_health_insurance_id.toString()}</div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <div className="mb-3 top-label">
                  <Select
                    id="calendar_timezone"
                    name="calendar_timezone"
                    value={values.calendar_timezone}
                    onChange={(value) => handleSelectChange(value, 'calendar_timezone')}
                    options={getTimeZones()}
                  />
                  <Form.Label>FUSO HORÁRIO</Form.Label>
                </div>
              </Col>
              {!event.id ? (
                <Col md={4}>
                  <div className="mb-3 top-label">
                    <Select
                      id="calendar_recurrence"
                      name="calendar_recurrence"
                      isClearable
                      options={recurrenceOptions}
                      value={values.calendar_recurrence}
                      onChange={handleRecurrenceChange}
                    />
                    <span>RECORRENCIA (OPCIONAL)</span>
                    {errors.calendar_recurrence && touched.calendar_recurrence && <div className="error">{errors.calendar_recurrence}</div>}
                  </div>
                </Col>
              ) : null}
            </Row>
            {values.calendar_recurrence && !event.id ? (
              <Row>
                <Col md={2}>
                  <div className="mb-3 top-label position-relative">
                    <Form.Control
                      id="calendar_recurrence_quantity"
                      name="calendar_recurrence_quantity"
                      value={values.calendar_recurrence_quantity}
                      onChange={handleChange}
                      type="text"
                      style={{ paddingRight: '50px' }}
                    />
                    <p className="position-absolute" style={{ right: '16px', bottom: '6px', marginBottom: '0' }}>
                      {recurrenceTypeText[values.calendar_recurrence.value as keyof typeof recurrenceTypeText]}
                    </p>
                    <Form.Label>Repetir a cada</Form.Label>
                    {errors.calendar_recurrence_quantity && touched.calendar_recurrence_quantity && (
                      <div className="error">{errors.calendar_recurrence_quantity}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex gap-2  h-100 pb-3">
                    <Form.Check
                      name="calendar_recurrence_type"
                      id="calendar_recurrence_type"
                      checked={values.calendar_recurrence_type === 'quantidade'}
                      onChange={() => handleRadioChange('calendar_recurrence_type', 'quantidade')}
                      type="radio"
                      label="E terminar após"
                    />
                    {errors.calendar_recurrence_type && touched.calendar_recurrence_type && <div className="error">{errors.calendar_recurrence_type}</div>}

                    <div className="mb-3 top-label position-relative">
                      <Form.Control
                        id="calendar_recurrency_type_qnt"
                        name="calendar_recurrency_type_qnt"
                        value={values.calendar_recurrency_type_qnt}
                        onChange={handleChange}
                        type="text"
                        style={{ paddingRight: '50px' }}
                        disabled={values.calendar_recurrence_type !== 'quantidade'}
                      />
                      <p className="position-absolute" style={{ right: '16px', bottom: '6px', marginBottom: '0' }}>
                        recorrências
                      </p>
                      <Form.Label>Recorrências</Form.Label>
                      {errors.calendar_recurrency_type_qnt && touched.calendar_recurrency_type_qnt && (
                        <div className="error">{errors.calendar_recurrency_type_qnt}</div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3 top-label">
                    <Form.Check
                      name="calendar_recurrence_type"
                      id="calendar_recurrence_type"
                      checked={values.calendar_recurrence_type === 'data'}
                      onChange={() => handleRadioChange('calendar_recurrence_type', 'data')}
                      type="radio"
                      label="Ou após a data"
                    />
                    {errors.calendar_recurrence_type && touched.calendar_recurrence_type && <div className="error">{errors.calendar_recurrence_type}</div>}
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3 top-label position-relative">
                    <DatePicker
                      name="calendar_recurrence_date_end"
                      id="calendar_recurrence_date_end"
                      selected={values.calendar_recurrence_date_end ? new Date(`${values.calendar_recurrence_date_end}, 00:00:00`) : null}
                      onChange={(value) => setFieldValue('calendar_recurrence_date_end', value?.toDateString())}
                      className="form-control"
                      showFullMonthYearPicker
                      dateFormat="dd/MM/yyyy"
                      disabled={values.calendar_recurrence_type !== 'data'}
                    />
                    <span className="bg-transparent">ou após a data</span>
                    {errors.calendar_recurrence_date_end && touched.calendar_recurrence_date_end && (
                      <div className="error">{errors.calendar_recurrence_date_end}</div>
                    )}
                  </div>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md={2}>
                  <div className="mb-3 top-label position-relative">
                    {errors.calendar_recurrence_quantity && touched.calendar_recurrence_quantity && (
                      <div className="error">{errors.calendar_recurrence_quantity}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex gap-2  h-100 pb-3">
                    {errors.calendar_recurrence_type && touched.calendar_recurrence_type && <div className="error">{errors.calendar_recurrence_type}</div>}

                    <div className="mb-3 top-label position-relative">
                      {errors.calendar_recurrency_type_qnt && touched.calendar_recurrency_type_qnt && (
                        <div className="error">{errors.calendar_recurrency_type_qnt}</div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3 top-label">
                    {errors.calendar_recurrence_type && touched.calendar_recurrence_type && <div className="error">{errors.calendar_recurrence_type}</div>}
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3 top-label position-relative">
                    {errors.calendar_recurrence_date_end && touched.calendar_recurrence_date_end && (
                      <div className="error">{errors.calendar_recurrence_date_end}</div>
                    )}
                  </div>
                </Col>
              </Row>
            )}

            <Row>
              <Col md={12}>
                <div className="mb-3 top-label">
                  <Form.Control
                    id="calendar_observation"
                    name="calendar_observation"
                    value={values.calendar_observation}
                    onChange={handleChange}
                    as="textarea"
                    rows={3}
                  />
                  <Form.Label>OBSERVAÇÕES</Form.Label>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            {event.id ? (
              <>
                <OverlayTrigger delay={{ show: 500, hide: 0 }} overlay={<Tooltip>Excluir agendamento</Tooltip>} placement="top">
                  <Button variant="outline-primary" className="btn-icon btn-icon-only" onClick={() => handleSelectScheduleToRemove(event)}>
                    <CsLineIcons icon="bin" />
                  </Button>
                </OverlayTrigger>

                <Button disabled={isSaving} className="btn-icon btn-icon-end" type="submit">
                  {isSaving ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <>
                      <span>Atualizar agendamento</span> <CsLineIcons icon="check" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button disabled={isSaving} className="btn-icon btn-icon-start" type="submit">
                {isSaving ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    <CsLineIcons icon="plus" /> <span>Cadastrar agendamento</span>
                  </>
                )}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>

      <DayOffModal handleRefSubmit={handleRefSubmit} isSaving={isSaving} />
    </>
  );
};

export default ModalAddEdit;
