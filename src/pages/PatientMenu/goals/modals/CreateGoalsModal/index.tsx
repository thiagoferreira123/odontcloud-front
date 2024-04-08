import { Alert, Col, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PatternFormat } from 'react-number-format';
import * as Icon from 'react-bootstrap-icons';
import { useCreateGoalModalStore } from '../../hooks/ModalCreateGoalsStore';
import TemplateSelect from './TemplateSelect';
import { useEffect, useState } from 'react';
import AsyncButton from '../../../../../components/AsyncButton';
import useGoalStore from '../../hooks/GoalStore';
import { useQueryClient } from '@tanstack/react-query';
import { FrequencyType, Goal } from '../../hooks/GoalStore/types';
import FrequencySelect from './FrequencySelect';
import { useParams } from 'react-router-dom';
import { AppException } from '../../../../../helpers/ErrorHelpers';
import { notify } from '../../../../../components/toast/NotificationIcon';
import { convertIsoToBrDate, parseBrDateToIso } from '../../../../../helpers/DateHelper';
import useGoalTemplateStore from '../../hooks/GoalTemplateStore';

export interface CreateGoalsModalFormValues {
  name: string;
  start_date: string;
  end_date: string;
  frequency: number;
  period: FrequencyType;
  description: string;
}

const CreateGoalsModal = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const showModal = useCreateGoalModalStore((state) => state.showModal);
  const selectedGoal = useCreateGoalModalStore((state) => state.selectedGoal);

  const [isSaving, setIsSaving] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Insira um nome válido'),
    start_date: Yup.string().required('Insira uma data válida'),
    end_date: Yup.string().required('Insira uma data válida'),
    frequency: Yup.number().typeError('Insira um valor válido').required('Insira uma frequência válida'),
    period: Yup.string().required('Insira um período válido'),
    description: Yup.string(),
  });

  const initialValues: CreateGoalsModalFormValues = { name: '', start_date: '', end_date: '', frequency: 1, period: 'd' as FrequencyType, description: '' };

  const onSubmit = async (values: CreateGoalsModalFormValues) => {
    setIsSaving(true);

    try {
      if (!id) throw new AppException('Id não informado');

      const payload: Partial<Goal> = {
        ...values,
        frequency: +values.frequency,
        start_date: parseBrDateToIso(values.start_date),
        end_date: parseBrDateToIso(values.end_date),
        patient_id: +id,
        recordsPatient: [],
      };

      if (selectedGoal?.id) {
        const response = await updateGoal({ ...selectedGoal, ...payload }, queryClient);

        if (!response) throw new Error('Erro ao atualizar meta');
      } else {
        const response = await addGoal(payload, queryClient);

        if (!response) throw new Error('Erro ao adicionar meta');
      }

      setIsSaving(false);
      hideModal();
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      error instanceof AppException && notify('Erro ao adicionar meta', 'Erro', 'close', 'danger');
    }
  };

  const onTemplateSubmit = async () => {
    setIsSavingTemplate(true);

    try {
      if (!id) throw new AppException('Id não informado');

      if (!values.name) return setFieldError('name', 'Insira um nome válido');
      else if (!values.description) return setFieldError('description', 'Insira uma descrição válida');

      const payload: Partial<Goal> = {
        ...values,
      };

      const response = await addGoalTemplate(payload, queryClient);

      if (!response) throw new Error('Erro ao adicionar modelo de meta');

      setIsSavingTemplate(false);
    } catch (error) {
      console.error(error);
      setIsSavingTemplate(false);
      error instanceof AppException && notify('Erro ao adicionar modelo de meta', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, setValues, setFieldError, values, touched, errors } = formik;
  const { hideModal } = useCreateGoalModalStore();
  const { addGoal, updateGoal } = useGoalStore();
  const { addGoalTemplate } = useGoalTemplateStore();

  useEffect(() => {
    if (selectedGoal) {
      setValues({
        name: selectedGoal.name,
        start_date: convertIsoToBrDate(selectedGoal.start_date),
        end_date: convertIsoToBrDate(selectedGoal.end_date),
        frequency: selectedGoal.frequency,
        period: selectedGoal.period,
        description: selectedGoal.description,
      });
    } else {
      setValues(initialValues);
    }
  }, [selectedGoal]);

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        {' '}
        <Modal.Title>Estipule uma meta para o paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert className="text-center">
          O estabelecimento de metas pelo nutricionista ajuda o paciente a ter direção e foco, promovendo a adesão ao tratamento e maximizando os resultados da
          intervenção nutricional 🏆
        </Alert>

        <div className="mb-3 top-label border-bottom border-separator-light mb-2 pb-2">
          <TemplateSelect setFieldValue={setFieldValue} />
          <Form.Label>USAR UM MODELO DE META</Form.Label>
        </div>

        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="d-flex justify-content-end">
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-item">Salvr meta para utilizar com outros pacientes</Tooltip>}>
              <span>
                <AsyncButton
                  isSaving={isSavingTemplate}
                  onClickHandler={onTemplateSubmit}
                  variant="outline-primary"
                  className="mb-2"
                  size="sm"
                  loadingText=' '
                  disabled={!values.name || !values.description}
                >
                  <Icon.Star />
                </AsyncButton>
              </span>
            </OverlayTrigger>
          </div>

          <div className="mb-3 top-label">
            <Form.Control type="text" name="name" value={values.name} onChange={handleChange} />
            <Form.Label>NOME DA META</Form.Label>
            {errors.name && touched.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="d-flex justify-content-center">
            <Col md={3} className="mb-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="start_date"
                format="##/##/####"
                mask="_"
                placeholder="DD/MM/YYYY"
                value={values.start_date}
                onChange={handleChange}
              />
              <Form.Label>DATA INICIAL</Form.Label>
              {errors.start_date && touched.start_date && <div className="error">{errors.start_date}</div>}
            </Col>

            <Col md={3} className="mb-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="end_date"
                format="##/##/####"
                mask="_"
                placeholder="DD/MM/YYYY"
                value={values.end_date}
                onChange={handleChange}
              />
              <Form.Label>DATA FINAL</Form.Label>
              {errors.end_date && touched.end_date && <div className="error">{errors.end_date}</div>}
            </Col>

            <Col md={2} className="mb-3 top-label me-2">
              <Form.Control type="text" name="frequency" value={values.frequency} onChange={handleChange} />
              <Form.Label>Nº DE VEZES</Form.Label>
              {errors.frequency && touched.frequency && <div className="error">{errors.frequency}</div>}
            </Col>

            <Col md={3} className="mb-3 top-label me-2">
              <FrequencySelect fieldValue={values.period} setFieldValue={setFieldValue} />
              <Form.Label>FREQUÊNCIA</Form.Label>
              {errors.period && touched.period && <div className="error">{errors.period}</div>}
            </Col>
          </div>

          <div className="mb-3 top-label">
            <Form.Control name="description" as="textarea" rows={3} value={values.description} onChange={handleChange} />
            <Form.Label>OBSERVAÇÃO</Form.Label>
            {errors.description && touched.description && <div className="error">{errors.description}</div>}
          </div>

          <div className="text-center">
            <AsyncButton isSaving={isSaving} type="submit" variant="primary">
              Salvar metas
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGoalsModal;
