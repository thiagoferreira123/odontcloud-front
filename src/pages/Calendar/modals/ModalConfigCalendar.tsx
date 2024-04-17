import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Button, Col, Form, Modal, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import DatepickerTime from '../../../views/interface/forms/controls/datepicker/DatepickerTime';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useModalConfigCalendarStore } from '../hooks/modals/ModalConfigCalendarStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notify } from '../../../components/toast/NotificationIcon';
import useCalendarConfigStore from '../hooks/CalendarConfigStore';
import { AppException } from '../../../helpers/ErrorHelpers';

const daysOptions = [1, 2, 3, 4, 5, 6, 7, 8];

const validationSchema = yup.object({
  calendar_config_time_start: yup.string().required('Informe a hora de início'),
  calendar_config_time_end: yup
    .string()
    .nullable()
    .required('Escolha a hora final')
    .test('is-greater', 'A hora final deve ser maior que a hora inicial', function (this: any, value: string | null | undefined) {
      const { calendar_config_time_start } = this.parent;
      if (!calendar_config_time_start || !value) {
        return true;
      }
      const [hours1, minutes1] = calendar_config_time_start.split(':').map(Number);
      const [hours2, minutes2] = value.split(':').map(Number);

      const date1 = new Date(0, 0, 0, hours1, minutes1);
      const date2 = new Date(0, 0, 0, hours2, minutes2);

      return date1 < date2;
    }),
  calendar_config_interval_start: yup.string(),
  calendar_config_interval_end: yup
    .string()
    .nullable()
    .test('is-greater', 'A hora final deve ser maior que a hora inicial', function (this: any, value: string | null | undefined) {
      const { calendar_config_interval_start } = this.parent;
      if (!calendar_config_interval_start || !value) {
        return true;
      }
      const [hours1, minutes1] = calendar_config_interval_start.split(':').map(Number);
      const [hours2, minutes2] = value.split(':').map(Number);

      const date1 = new Date(0, 0, 0, hours1, minutes1);
      const date2 = new Date(0, 0, 0, hours2, minutes2);

      return date1 < date2;
    }),
  calendar_config_service_days: yup.array().required('Informe os dias da semana'),
  // duracao_consulta: yup
  //   .string()
  //   .required('Informe a duração da consulta')
  //   .test('is-valid', 'Insira uma hora válida', function (this: any, value: string | undefined) {
  //     if (!value) return false;
  //     return isValidHour(value);
  //   }),
  // duracao_retorno: yup
  //   .string()
  //   .required('Informe a duração do retorno')
  //   .test('is-valid', 'Insira uma hora válida', function (this: any, value: string | undefined) {
  //     if (!value) return false;
  //     return isValidHour(value);
  //   }),
  // valor_consulta: yup.string().required('Informe o valor da consulta'),
  // valor_retorno: yup.string().required('Informe o valor do retorno'),
});

interface FormValues {
  calendar_config_time_start: string;
  calendar_config_time_end: string;
  calendar_config_interval_start: string;
  calendar_config_interval_end: string;
  calendar_config_service_days: number[];
  // duracao_consulta: string;
  // duracao_retorno: string;
  // valor_consulta: string;
  // valor_retorno: string;
}

const ModalConfigCalendar = () => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const showModal = useModalConfigCalendarStore((state) => state.showModal);

  const getCalendarConfigs_ = async () => {
    try {
      const result = await getCalendarConfigs();

      if (result === false) throw new Error('Could not get calendar config');

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const result = useQuery({ queryKey: ['calendar-config'], queryFn: getCalendarConfigs_ });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);
      if (!values.calendar_config_service_days) throw new AppException('Informe os dias da semana');

      const model = { ...values, calendar_config_service_days: values.calendar_config_service_days.join(',') };

      const response =
        result.data && result.data.calendar_config_id
          ? await updateCalendarConfig({ ...model, calendar_config_id: result.data.calendar_config_id }, queryClient)
          : await addCalendarConfig(model, queryClient);

      if (!response) throw new Error('Erro ao atualizar configurações da agenda');

      setIsSaving(false);
      hideModal();
    } catch (error) {
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const { hideModal } = useModalConfigCalendarStore();
  const { getCalendarConfigs, updateCalendarConfig, addCalendarConfig } = useCalendarConfigStore();

  const handleTimeChange = (value: Date | undefined | null, field: string) => {
    if (!value) return setFieldValue(field, value);
    const date = new Date(value);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHour = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    setFieldValue(field, formattedHour);
  };

  const handleAllDaysChange = () => {
    const currentValue = values.calendar_config_service_days;
    if (currentValue?.length === daysOptions.length) {
      return setFieldValue('calendar_config_service_days', []);
    }
    setFieldValue('calendar_config_service_days', daysOptions);
  };

  const { values, errors, touched, resetForm, handleChange, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      calendar_config_time_start: (result.data?.calendar_config_time_start) ?? '07:00',
      calendar_config_time_end: (result.data?.calendar_config_time_end) ?? '18:00',
      calendar_config_interval_start: (result.data?.calendar_config_interval_start) ?? '',
      calendar_config_interval_end: (result.data?.calendar_config_interval_end) ?? '',
      calendar_config_service_days: (result.data?.calendar_config_service_days?.split(',').map((value) => +value)) || [0, 1, 2, 3, 4, 5, 6, 7],
      // duracao_consulta: selectedLocal?.duracao_consulta || '',
      // duracao_retorno: selectedLocal?.duracao_retorno || '',
      // valor_consulta: String(selectedLocal?.valor_consulta) || '',
      // valor_retorno: String(selectedLocal?.valor_retorno) || '',
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (result.data && showModal) {
      setFieldValue('calendar_config_time_start', result.data.calendar_config_time_start ?? '07:00');
      setFieldValue('calendar_config_time_end', result.data.calendar_config_time_end ?? '18:00');
      setFieldValue('calendar_config_interval_start', result.data.calendar_config_interval_start ?? '');
      setFieldValue('calendar_config_interval_end', result.data.calendar_config_interval_end ?? '');
      result.data.calendar_config_service_days &&
        setFieldValue(
          'calendar_config_service_days',
          result.data.calendar_config_service_days.split(',').map((value) => +value)
        );
    }
  }, [result.data, setFieldValue, showModal]);

  useEffect(() => {
    if (!showModal) {
      resetForm();
    }
  }, [showModal, resetForm]);

  if (!showModal) return null;

  return (
    <Modal className="modal-close-out" size="lg" show={showModal} onHide={hideModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Configurar agenda: (Local de atendimento)</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <label className="mb-3">Horário de atendimento</label>
            <Col md={2} className="pe-2">
              <div className="mb-3 top-label">
                <DatepickerTime
                  id="calendar_config_time_start"
                  name="calendar_config_time_start"
                  value={values.calendar_config_time_start}
                  onChange={(value) => handleTimeChange(value, 'calendar_config_time_start')}
                />
                <span>HORA INÍCIO</span>
                {errors.calendar_config_time_start && touched.calendar_config_time_start && <div className="error">{errors.calendar_config_time_start}</div>}
              </div>
            </Col>
            <Col md={2} className="pe-2">
              <div className="mb-3 top-label">
                <DatepickerTime
                  id="calendar_config_time_end"
                  name="calendar_config_time_end"
                  value={values.calendar_config_time_end}
                  onChange={(value) => handleTimeChange(value, 'calendar_config_time_end')}
                />
                <span>HORA FIM</span>
                {errors.calendar_config_time_end && touched.calendar_config_time_end && <div className="error">{errors.calendar_config_time_end}</div>}
              </div>
            </Col>
            <Col md={2} className="pe-2">
              <div className="mb-3 top-label">
                <DatepickerTime
                  id="calendar_config_interval_start"
                  name="calendar_config_interval_start"
                  value={values.calendar_config_interval_start}
                  onChange={(value) => handleTimeChange(value, 'calendar_config_interval_start')}
                />
                <span>INTERVALO INÍCIO</span>
                {errors.calendar_config_interval_start && touched.calendar_config_interval_start && (
                  <div className="error">{errors.calendar_config_interval_start}</div>
                )}
              </div>
            </Col>
            <Col md={2} className="pe-2">
              <div className="mb-3 top-label">
                <DatepickerTime
                  id="calendar_config_interval_end"
                  name="calendar_config_interval_end"
                  value={values.calendar_config_interval_end}
                  onChange={(value) => handleTimeChange(value, 'calendar_config_interval_end')}
                />
                <span>INTERVALO FIM</span>
                {errors.calendar_config_interval_end && touched.calendar_config_interval_end && (
                  <div className="error">{errors.calendar_config_interval_end}</div>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <label className="mb-3">Dias de atendimento</label>
            <div className="d-flex gap-2">
              <ToggleButton
                id="tbg-check-8"
                type="checkbox"
                variant="outline-primary mb-3"
                checked={values.calendar_config_service_days?.length === daysOptions.length}
                value={8}
                onChange={handleAllDaysChange}
              >
                Todos os dias
              </ToggleButton>
              <ToggleButtonGroup
                id="calendar_config_service_days"
                name="calendar_config_service_days"
                value={values.calendar_config_service_days}
                onChange={(value) => {
                  setFieldValue('calendar_config_service_days', value);
                }}
                type="checkbox"
                className="mb-3 d-block"
              >
                <ToggleButton id="tbg-check-2" value={2} variant="outline-secondary">
                  Seg
                </ToggleButton>
                <ToggleButton id="tbg-check-3" value={3} variant="outline-primary">
                  Ter
                </ToggleButton>
                <ToggleButton id="tbg-check-4" value={4} variant="outline-secondary">
                  Qua
                </ToggleButton>
                <ToggleButton id="tbg-check-5" value={5} variant="outline-primary">
                  Qui
                </ToggleButton>
                <ToggleButton id="tbg-check-6" value={6} variant="outline-secondary">
                  Sex
                </ToggleButton>
                <ToggleButton id="tbg-check-7" value={7} variant="outline-secondary">
                  Sab
                </ToggleButton>
                <ToggleButton id="tbg-check-1" value={1} variant="outline-secondary">
                  Dom
                </ToggleButton>
                {errors.calendar_config_service_days && touched.calendar_config_service_days && (
                  <div className="error">{errors.calendar_config_service_days}</div>
                )}
              </ToggleButtonGroup>
            </div>
          </Row>
          <Row>
            <label className="mb-3">Visibilidade da agenda no site pessoal</label>

            {/* <Col md={3} className="pe-2 mt-3">
              <div className="mb-3 top-label">
                <PatternFormat
                  id="duracao_consulta"
                  name="duracao_consulta"
                  onChange={handleChange}
                  value={values.duracao_consulta}
                  className="form-control"
                  format="##:##"
                />
                <span>DURAÇÃO DA CONSULTA</span>
                {errors.duracao_consulta && touched.duracao_consulta && <div className="error">{errors.duracao_consulta}</div>}
              </div>
            </Col> */}

            {/* <Col md={3} className="pe-2 mt-3">
              <div className="mb-3 top-label">
                <PatternFormat
                  id="duracao_retorno"
                  name="duracao_retorno"
                  onChange={handleChange}
                  value={values.duracao_retorno}
                  className="form-control"
                  format="##:##"
                />
                <span>DURAÇÃO DO RETORNO</span>
                {errors.duracao_retorno && touched.duracao_retorno && <div className="error">{errors.duracao_retorno}</div>}
              </div>
            </Col>
            <Col md={3} className="pe-2 mt-3">
              <div className="mb-3 top-label">
                <NumericFormat
                  id="valor_consulta"
                  name="valor_consulta"
                  value={values.valor_consulta}
                  onChange={handleChange}
                  className="form-control"
                  thousandSeparator=","
                  decimalSeparator="."
                  prefix="R$"
                />
                <Form.Label>VALOR DA CONSULTA $</Form.Label>
                {errors.valor_consulta && touched.valor_consulta && <div className="error">{errors.valor_consulta}</div>}
              </div>
            </Col> */}

            {/* <Col md={3} className="pe-2 mt-3">
              <div className="mb-3 top-label">
                <NumericFormat
                  id="valor_retorno"
                  name="valor_retorno"
                  value={values.valor_retorno}
                  onChange={handleChange}
                  className="form-control"
                  thousandSeparator=","
                  decimalSeparator="."
                  prefix="R$"
                />
                <Form.Label>VALO DO RETORNO $</Form.Label>
                {errors.valor_retorno && touched.valor_retorno && <div className="error">{errors.valor_retorno}</div>}
              </div>
            </Col> */}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button disabled={isSaving} className="btn-icon btn-icon-start" type="submit">
            {isSaving ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <>
                <CsLineIcons icon="plus" /> <span>Configurar agenda</span>
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalConfigCalendar;
