import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Button, Col, Form, Modal, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { isValidHour } from '../../../helpers/Utils';
import { useCalendarStore } from '../hooks';
import DatepickerTime from '../../../views/interface/forms/controls/datepicker/DatepickerTime';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useModalConfigCalendarStore } from '../hooks/modals/ModalConfigCalendarStore';
import { useServiceLocationStore } from '../../../hooks/professional/ServiceLocationStore';
import { useQueryClient } from '@tanstack/react-query';
import { notify } from '../../../components/toast/NotificationIcon';

const daysOptions = [1, 2, 3, 4, 5, 6, 7, 8];

const validationSchema = yup.object({
  hora_inicio: yup.string().required('Informe a hora de início'),
  hora_final: yup
    .string()
    .nullable()
    .required('Escolha a hora final')
    .test('is-greater', 'A hora final deve ser maior que a hora inicial', function (this: any, value: string | null | undefined) {
      const { hora_inicio } = this.parent;
      if (!hora_inicio || !value) {
        return true;
      }
      const [hours1, minutes1] = hora_inicio.split(':').map(Number);
      const [hours2, minutes2] = value.split(':').map(Number);

      const date1 = new Date(0, 0, 0, hours1, minutes1);
      const date2 = new Date(0, 0, 0, hours2, minutes2);

      return date1 < date2;
    }),
  almoco_inicio: yup.string(),
  almoco_final: yup
    .string()
    .nullable()
    .test('is-greater', 'A hora final deve ser maior que a hora inicial', function (this: any, value: string | null | undefined) {
      const { almoco_inicio } = this.parent;
      if (!almoco_inicio || !value) {
        return true;
      }
      const [hours1, minutes1] = almoco_inicio.split(':').map(Number);
      const [hours2, minutes2] = value.split(':').map(Number);

      const date1 = new Date(0, 0, 0, hours1, minutes1);
      const date2 = new Date(0, 0, 0, hours2, minutes2);

      return date1 < date2;
    }),
  dias_semana: yup.array().required('Informe os dias da semana'),
  exibir_agenda: yup.number().required('Escolha uma opção'),
  duracao_consulta: yup
    .string()
    .required('Informe a duração da consulta')
    .test('is-valid', 'Insira uma hora válida', function (this: any, value: string | undefined) {
      if (!value) return false;
      return isValidHour(value);
    }),
  duracao_retorno: yup
    .string()
    .required('Informe a duração do retorno')
    .test('is-valid', 'Insira uma hora válida', function (this: any, value: string | undefined) {
      if (!value) return false;
      return isValidHour(value);
    }),
  valor_consulta: yup.string().required('Informe o valor da consulta'),
  valor_retorno: yup.string().required('Informe o valor do retorno'),
});

interface FormValues {
  hora_inicio: string;
  hora_final: string;
  almoco_inicio: string;
  almoco_final: string;
  dias_semana: number[];
  exibir_agenda: number;
  duracao_consulta: string;
  duracao_retorno: string;
  valor_consulta: string;
  valor_retorno: string;
}

const ModalConfigCalendar = () => {
  const queryClient = useQueryClient();
  const selectedLocal = useCalendarStore((state) => state.selectedLocal);
  const [isSaving, setIsSaving] = useState(false);

  const showModal = useModalConfigCalendarStore((state) => state.showModal);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);
      if (!selectedLocal || !values.dias_semana) return;

      const model = { ...values, id: selectedLocal.id, dias_semana: values.dias_semana.join(',') };

      const response = await updateServiceLocation(model, queryClient);

      setLocal({ ...selectedLocal, ...model });

      if (!response) throw new Error('Erro ao atualizar local de atendimento');

      notify('Local de atendimento atualizado com sucesso', 'Sucesso', 'check', 'success');
      setIsSaving(false);
      hideModal();
    } catch (error) {
      console.error(error);

      notify('Erro ao atualizar local de atendimento', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const { setLocal } = useCalendarStore();
  const { hideModal } = useModalConfigCalendarStore();
  const { updateServiceLocation } = useServiceLocationStore();

  const handleTimeChange = (value: Date | undefined | null, field: string) => {
    if (!value) return setFieldValue(field, value);
    const date = new Date(value);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHour = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    setFieldValue(field, formattedHour);
  };

  const handleAllDaysChange = () => {
    const currentValue = values.dias_semana;
    if (currentValue?.length === daysOptions.length) {
      return setFieldValue('dias_semana', []);
    }
    setFieldValue('dias_semana', daysOptions);
  };

  const { values, errors, touched, resetForm, handleChange, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      hora_inicio: selectedLocal?.hora_inicio || '',
      hora_final: selectedLocal?.hora_final || '',
      almoco_inicio: selectedLocal?.almoco_inicio || '',
      almoco_final: selectedLocal?.almoco_final || '',
      dias_semana: selectedLocal?.dias_semana?.split(',').map((value) => +value) ?? [],
      exibir_agenda: +(selectedLocal?.exibir_agenda ?? 0),
      duracao_consulta: selectedLocal?.duracao_consulta || '',
      duracao_retorno: selectedLocal?.duracao_retorno || '',
      valor_consulta: String(selectedLocal?.valor_consulta) || '',
      valor_retorno: String(selectedLocal?.valor_retorno) || '',
    },
    validationSchema,
    onSubmit,
  });

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
                <DatepickerTime id="hora_inicio" name="hora_inicio" value={values.hora_inicio} onChange={(value) => handleTimeChange(value, 'hora_inicio')} />
                <span>HORA INÍCIO</span>
                {errors.hora_inicio && touched.hora_inicio && <div className="error">{errors.hora_inicio}</div>}
              </div>
            </Col>
            <Col md={2} className="pe-2">
              <div className="mb-3 top-label">
                <DatepickerTime id="hora_final" name="hora_final" value={values.hora_final} onChange={(value) => handleTimeChange(value, 'hora_final')} />
                <span>HORA FIM</span>
                {errors.hora_final && touched.hora_final && <div className="error">{errors.hora_final}</div>}
              </div>
            </Col>
            <Col md={2} className="pe-2">
              <div className="mb-3 top-label">
                <DatepickerTime
                  id="almoco_inicio"
                  name="almoco_inicio"
                  value={values.almoco_inicio}
                  onChange={(value) => handleTimeChange(value, 'almoco_inicio')}
                />
                <span>INTERVALO INÍCIO</span>
                {errors.almoco_inicio && touched.almoco_inicio && <div className="error">{errors.almoco_inicio}</div>}
              </div>
            </Col>
            <Col md={2} className="pe-2">
              <div className="mb-3 top-label">
                <DatepickerTime
                  id="almoco_final"
                  name="almoco_final"
                  value={values.almoco_final}
                  onChange={(value) => handleTimeChange(value, 'almoco_final')}
                />
                <span>INTERVALO FIM</span>
                {errors.almoco_final && touched.almoco_final && <div className="error">{errors.almoco_final}</div>}
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
                checked={values.dias_semana?.length === daysOptions.length}
                value={8}
                onChange={handleAllDaysChange}
              >
                Todos os dias
              </ToggleButton>
              <ToggleButtonGroup
                id="dias_semana"
                name="dias_semana"
                value={values.dias_semana}
                onChange={(value) => {
                  setFieldValue('dias_semana', value);
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
                {errors.dias_semana && touched.dias_semana && <div className="error">{errors.dias_semana}</div>}
              </ToggleButtonGroup>
            </div>
          </Row>
          <Row>
            <label className="mb-3">Visibilidade da agenda no site pessoal</label>

            <ToggleButtonGroup
              id="exibir_agenda"
              name="exibir_agenda"
              value={values.exibir_agenda}
              onChange={(value) => setFieldValue('exibir_agenda', value)}
              type="radio"
              className="d-block"
            >
              <ToggleButton id="tbg-radio-3" value={1} variant="outline-primary">
                Exibir no site
              </ToggleButton>
              <ToggleButton id="tbg-radio-4" value={0} variant="outline-secondary">
                Ocultar no site
              </ToggleButton>
              {errors.exibir_agenda && touched.exibir_agenda && <div className="error">{errors.exibir_agenda}</div>}
            </ToggleButtonGroup>

            <Col md={3} className="pe-2 mt-3">
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
            </Col>

            <Col md={3} className="pe-2 mt-3">
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
            </Col>

            <Col md={3} className="pe-2 mt-3">
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
            </Col>
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
