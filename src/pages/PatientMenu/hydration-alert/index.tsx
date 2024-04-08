import { Alert, Button, Card, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import Select, { SingleValue } from 'react-select';
import AsyncButton from '../../../components/AsyncButton';
import HydratationAlertRow from './HydratationAlertRow';
import { timezones } from './constants';
import { Option } from '../../../types/inputs';
import usePatientMenuStore from '../hooks/patientMenuStore';
import Empty from '../../../components/Empty';
import useHydrationAlertStore from './hooks/HydrationAlertDetailsStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HydrationAlert } from './hooks/HydrationAlertDetailsStore/types';
import StaticLoading from '../../../components/loading/StaticLoading';
import { useAuth } from '../../Auth/Login/hook';
import { useParams } from 'react-router-dom';
import { notEmpty } from '../../../helpers/Utils';
import Async from 'react-select/dist/declarations/src/async/index';

interface FormValues {
  timeZone: SingleValue<Option> | null;
  total_quantity_ml: number;
  alerts: HydratationAlertValues[];
}

export interface HydratationAlertValues {
  id?: number;
  message: string;
  time: string;
  quantity_ml: number;
}

const initialValues = {
  timeZone: null,
  total_quantity_ml: 1000,
  alerts: [
    {
      message: 'Que tal uma pausa para se hidratar? 💦',
      time: '07:30',
      quantity_ml: 250,
    },
    {
      message: 'Que tal uma pausa para se hidratar? 💦',
      time: '12:30',
      quantity_ml: 250,
    },
    {
      message: 'Que tal uma pausa para se hidratar? 💦',
      time: '15:30',
      quantity_ml: 250,
    },
    {
      message: 'Que tal uma pausa para se hidratar? 💦',
      time: '19:30',
      quantity_ml: 250,
    },
  ],
};

const validationSchema = Yup.object().shape({
  timeZone: Yup.object().required('Selecione um fuso horário.'),
  alerts: Yup.array().of(
    Yup.object().shape({
      message: Yup.string().nullable().required('Insira uma messagem válida.').max(50, 'A messagem deve ter no máximo 50 caracteres.'),
      time: Yup.string().nullable().required('Insira um horário válido.'),
      quantity_ml: Yup.number().min(1, 'Insira uma quantidade válida.').required('Insira uma quantidade válida.'),
    })
  ),
});

export default function HydrationAlertPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = useAuth(state => state.user);
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const patient = usePatientMenuStore((state) => state.patient);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);

      if (!patient?.deviceToken) throw new Error('O paciente ainda não fez login no aplicativo!');

      const payload: HydrationAlert[] = values.alerts.map((alert) => {
        if (!patient.id) throw new Error('O paciente não foi encontrado!');

        const payload: HydrationAlert = {
          patient_id: patient.id,
          time_zone: values.timeZone?.label ?? '(UTC-03:00) Sao Paulo',
          total_quantity_ml: values.total_quantity_ml.toString(),
          ...alert,
        };

        return payload;
      });

      const response = await addHydrationAlert(payload, queryClient, patient.deviceToken);

      if(response === false) throw new Error('Erro ao adicionar alerta');

      setValues({
        timeZone: values.timeZone,
        total_quantity_ml: values.total_quantity_ml,
        alerts: [...values.alerts.filter(alert => alert.id), ...response],
      });

      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleAddAlert = () => {
    const newAlert = {
      message: '',
      time: '',
      quantity_ml: 0,
    };

    setFieldValue('alerts', [...values.alerts, newAlert]);
  };

  const handleRemoveAllAlerts = async () => {
    setIsDeleting(true);
    const ids = values.alerts.map((alert) => alert.id).filter(notEmpty);

    user?.token && id && await removeHydrationAlert(ids, user.token);

    setFieldValue('alerts', []);
    setIsDeleting(false);
  };

  const getHydrationAlertDetail_ = async () => {
    try {
      const response = await getHydrationAlertDetail(patient?.id ?? 0);

      if (response === false) throw new Error('Erro ao buscar alerta');

      response[0] && setValues({
        timeZone: { value: response[0].time_zone, label: response[0].time_zone },
        total_quantity_ml: +response[0].total_quantity_ml,
        alerts: response,
      });

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, setFieldValue, setValues, values, touched, errors } = formik;
  const { getHydrationAlertDetail, addHydrationAlert, removeHydrationAlert } = useHydrationAlertStore();

  const result = useQuery({ queryKey: ['alerts', Number(patient?.id)], queryFn: getHydrationAlertDetail_ })

  useEffect(() => {
    setFieldValue(
      'total_quantity_ml',
      values.alerts.reduce((acc, alert) => acc + +alert.quantity_ml, 0)
    );
  }, [values.alerts]);

  if (!patient?.deviceToken) {
    return (
      <Card>
        <Card.Body className="mb-n3 text-center sh-40">
          <Empty message="O paciente ainda não fez login no aplicativo!" classNames="mt-0" />
        </Card.Body>
      </Card>
    );
  } else if(result.isLoading) {
    return (
      <Card>
        <Card.Body className="mb-n3 text-center sh-40">
          <StaticLoading />
        </Card.Body>
      </Card>
    );
  } else if(result.isError) {
    return (
      <Card>
        <Card.Body className="mb-n3 text-center sh-40">
          <div>Erro ao buscar alerta!</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 text-center">
          <h4>Alerta de hidratação</h4>

          <Alert className="primary text-center">
            Os alertas serão enviados em forma de notificação no aparelho celular dos pacientes. As notificações do aparelho e do aplicativo do paciente devem
            estar ativadas para que o alerta seja emitido.
          </Alert>

          <Form onSubmit={handleSubmit} className="tooltip-end-top">
            <div>
              <p className="text-start mt-3">Primeiro, selecione o fuso horário do paciente</p>
            </div>

            <div className="d-flex align-items-center">
              <Col md={12} className="mb-3 top-label me-2">
                {/* <Form.Control type="text" name="timeZone" value={values.timeZone} onChange={handleChange} /> */}
                <Select
                  classNamePrefix="react-select"
                  options={timezones}
                  name="timeZone"
                  value={values.timeZone}
                  onChange={(e) => setFieldValue('timeZone', e)}
                  placeholder=""
                  className="text-start"
                />
                <Form.Label>FUSO HORÁRIO</Form.Label>
                {errors.timeZone && touched.timeZone && <div className="error">{errors.timeZone}</div>}
              </Col>
            </div>

            <div>
              <p className="text-start mt-3">Escreva uma messagem de alerta tex(até 50 caracteres)</p>
            </div>

            {values.alerts.map((alert, index) => (
              <HydratationAlertRow alert={alert} formik={formik} index={index} key={index} />
            ))}

            <div className="d-flex align-items-center">
              <Col md={7} className="mb-3 top-label me-2"></Col>
              <Col md={2} className="mb-3 top-label me-2"></Col>

              <Col md={2} className="mb-3 top-label me-2 position-relative">
                <Form.Control type="text" name="total_quantity_ml" value={values.total_quantity_ml} readOnly />
                <Form.Label>QUANTIDADE TOTAL</Form.Label>
                {errors.total_quantity_ml && touched.total_quantity_ml && (
                  <div className="error" style={{ top: '-86px' }}>
                    {errors.total_quantity_ml}
                  </div>
                )}
              </Col>

              <Col md={1} className="mb-3 top-label"></Col>
            </div>

            <div className="d-flex text-center">
              <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Adicione mais um alerta de hidratação</Tooltip>}>
                <Button variant="primary" className="btn mb-1 me-2" onClick={handleAddAlert}>
                  Adicinonar notificação <Icon.Plus />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Remover todos os alertas de hidratação</Tooltip>}>
                <AsyncButton isSaving={isDeleting} loadingText='Removendo, não feche a janela...' variant="danger" className="btn mb-1" onClickHandler={handleRemoveAllAlerts}>
                  Remover todos <Icon.Trash />
                </AsyncButton>
              </OverlayTrigger>
            </div>

            <div className="text-center mt-3">
              <AsyncButton isSaving={isSaving} type="submit" variant="primary" className="me-2">
                Salvar e iniciar notificações no aplicativo do paciente
              </AsyncButton>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
