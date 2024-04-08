import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useLayout from '../../hooks/useLayout';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Schedule, ScheduleDto, ServiceLocation, TipoConsulta, useSchedulesStore } from './hooks';
import { AppException } from '../../helpers/ErrorHelpers';
import StaticLoading from '../../components/loading/StaticLoading';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AsyncButton from '../../components/AsyncButton';
import { notify } from '../../components/toast/NotificationIcon';
import Select from 'react-select';
import { Option } from '../../types/inputs';
import { ptBR } from 'date-fns/locale/pt-BR';
import { parseDateToIso } from '../../helpers/DateHelper';
registerLocale('pt-BR', ptBR);

const queryClient = new QueryClient();

interface ScheduleFormValues {
  firstName: string;
  scheduleType: TipoConsulta | '';
  horario: number;
  email: string;
  phone: string;
  observation: string;
}
const verificaHorario = (schedules: Schedule[], time: number) => {
  // Verifica cada consulta para encontrar se o horário está dentro do intervalo de alguma unidade
  for (const consulta of schedules) {
    const inicio = Number(consulta.calendar_start_time.replace(':', '.').replace(':', ''));
    const final = Number(consulta.calendar_end_time.replace(':', '.').replace(':', ''));

    // Verifica se o horário está dentro do intervalo
    if (time >= Math.round(inicio) && time < Math.ceil(final)) {
      return true; // Horário está dentro do intervalo de alguma unidade
    }
  }

  // Nenhum horário correspondente foi encontrado
  return false;
};

const getAvailableServiceLocationTimes = (serviceLocation: ServiceLocation, schedules: Schedule[], date: Date) => {
  let times: number[] = [];

  const filteredSchedules = schedules.filter((schedule) => schedule.dia == date.getDate() && schedule.mes == date.getMonth() + 1);

  for (let i = Number(serviceLocation.hora_inicio.split(':')[0]); i <= Number(serviceLocation.hora_final.split(':')[0]); i++) {
    if (verificaHorario(filteredSchedules, i)) continue;

    times[i] = i;
  }

  return times;
};

const ProfessionalWebSiteSchedule = () => {
  useLayout();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [value, setValue] = useState<Option>();

  const navigate = useNavigate();

  const { base64LocationId } = useParams<{ base64LocationId: string }>();

  const { getSchedules, getServiceLocation, createSchedule } = useSchedulesStore();

  const getSchedules_ = async () => {
    try {
      if (!base64LocationId) throw new AppException('base64LocationId não informada');

      const response = await getSchedules(base64LocationId);

      if (!response) throw new Error('Site não encontrado');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getServiceLocation_ = async () => {
    try {
      if (!base64LocationId) throw new AppException('base64LocationId não informada');

      const response = await getServiceLocation(base64LocationId);

      if (!response) throw new Error('Site não encontrado');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const schedulesResult = useQuery({ queryKey: ['schedules', base64LocationId], queryFn: getSchedules_ });
  const serviceLocationResult = useQuery({ queryKey: ['serviceLocation', base64LocationId], queryFn: getServiceLocation_ });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Insira um nome válido'),
    scheduleType: Yup.string().required('Selecione um tipo de atendimento'),
    horario: Yup.number().min(1, 'Selecione um horário').required('Selecione um horário'),
    email: Yup.string(),
    phone: Yup.string().required('Insira um contato válido'),
    observation: Yup.string(),
  });
  const initialValues: ScheduleFormValues = { firstName: '', horario: 0, scheduleType: '', email: '', phone: '', observation: '' };
  const onSubmit = async (values: ScheduleFormValues) => {
    try {
      if (!base64LocationId) throw new AppException('base64LocationId não informada');
      if (!startDate) throw new AppException('Data não informada');

      setIsSaving(true);

      const payload: ScheduleDto = {
        calendar_name: values.firstName,
        calendar_phone: values.phone,
        calendar_email: values.email,
        calendar_observation: values.observation,
        calendar_type: values.scheduleType as TipoConsulta,
        calendar_health_insurance_id: 0,
        calendar_date: parseDateToIso(startDate),
        calendar_start_time: `${values.horario}:00`,
        calendar_end_time: `${values.horario + 1}:00`,
        calendar_location_id: +atob(base64LocationId),
        calendar_recurrence: 'recorrencia',
        calendar_recurrence_type: 'quantidade',
        calendar_recurrence_quantity: 0,
        calendar_recurrency_type_qnt: 0,
        calendar_status: 'AGENDADO',
      };

      const response = await createSchedule(payload);

      if (!response) throw new Error('Erro ao agendar atendimento');

      notify('Atendimento agendado com sucesso', 'Sucesso', 'check', 'success');

      setIsSaving(false);
      const url = `/p/${serviceLocationResult.data?.profissional}`;
      // navigate(-1);
    } catch (error) {
      console.error(error);

      error instanceof AppException ? notify(error.message, 'Erro', 'close', 'danger') : notify('Erro ao agendar atendimento', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } = formik;

  if (schedulesResult.isLoading || serviceLocationResult.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );
  else if (schedulesResult.isError)
    return (
      <Container>
        <Row className="text-center justify-content-center m-0 pt-5">
          <Col>
            <h1 className="display-3">Erro ao consultar disponibilidade do local de atendimento</h1>
          </Col>
        </Row>
      </Container>
    );
  else if (serviceLocationResult.isError)
    return (
      <Container>
        <Row className="text-center justify-content-center m-0 pt-5">
          <Col>
            <h1 className="display-3">Erro ao consultar local de atendimento</h1>
          </Col>
        </Row>
      </Container>
    );

  const times =
    serviceLocationResult.data && schedulesResult.data && startDate
      ? getAvailableServiceLocationTimes(serviceLocationResult.data, schedulesResult.data, startDate)
      : [];

  const scheduleTypeOptions = [
    { label: `Consulta (R$ ${serviceLocationResult.data?.valor_consulta})`, value: TipoConsulta.CONSULTA },
    { label: `Retorno (R$ ${serviceLocationResult.data?.valor_retorno})`, value: TipoConsulta.RETORNO },
  ];

  return (
    <Container>
      <Col xs="auto" className='text-center mt-5 mb-4'>
        <img src={serviceLocationResult.data?.userr?.image ? serviceLocationResult.data?.userr?.image : '/img/profile/profile-11.webp'} className="card-img rounded-xl sh-7 sw-7" alt="thumb" />
        <div className='mt-2'>Agende o seu atendimento com {serviceLocationResult.data?.userr?.nome_completo} 🍏</div>
      </Col>
      <form onSubmit={handleSubmit} className="text-start">
        <Row className="text-center justify-content-center m-0 pt-5">
          <Col xs="auto">
            <label className="mb-2">Escolha uma data</label>
            <Card className="mb-5">
              <Card.Body className="inline-datepicker-container">
                <DatePicker className="form-control" inline selected={startDate} onChange={(date) => setStartDate(date)} locale="pt-BR" dateFormat="dd/MM/yyyy" />
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} md="3">
            <label className="mb-2">Selecione um horário</label>
            <Card className="mb-5">
              <Card.Body>
                {times.map((time) => (
                  <div className="mb-1" key={time}>
                    <Button
                      variant="outline-primary"
                      className={`w-100 ${values.horario === time ? 'active' : ''}`}
                      onClick={() => setFieldValue('horario', time)}
                    >
                      {`${time}:00`}
                    </Button>
                  </div>
                ))}
                {errors.horario && touched.horario ? <div className="d-block invalid-tooltip">{errors.horario}</div> : null}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <label className="mb-2">Preencha com os seus dados</label>
            <Card className="mb-5 text-start">
              <Card.Body>
                <Row className="mb-3 g-3">
                  <Col>
                    <Form.Group className="form-group position-relative tooltip-end-top">
                      <Form.Label>Nome completo</Form.Label>
                      <Form.Control type="text" name="firstName" onChange={handleChange} value={values.firstName} />
                      {errors.firstName && touched.firstName && <div className="d-block invalid-tooltip">{errors.firstName}</div>}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3 g-3">
                  <Col>
                    <Form.Group className="form-group position-relative tooltip-end-top">
                      <Form.Label>Tipo de atendimento</Form.Label>
                      <Select
                        classNamePrefix="react-select"
                        options={scheduleTypeOptions}
                        value={value}
                        onChange={(e) => {
                          setValue(e as Option);
                          setFieldValue('scheduleType', e?.value as TipoConsulta);
                        }}
                        placeholder="Selecione um tipo de atendimento"
                      />
                      {errors.scheduleType && touched.scheduleType ? <div className="d-block invalid-tooltip">{errors.scheduleType}</div> : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3 g-3">
                  <Col>
                    <Form.Group className="form-group position-relative tooltip-end-top">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="text" name="email" value={values.email} onChange={handleChange} />
                      {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3 g-3">
                  <Col>
                    <Form.Group className="form-group position-relative tooltip-end-top">
                      <Form.Label>Contato</Form.Label>
                      <Form.Control type="text" name="phone" value={values.phone} onChange={handleChange} />
                      {errors.phone && touched.phone && <div className="d-block invalid-tooltip">{errors.phone}</div>}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3 g-3">
                  <Col>
                    <Form.Group className="form-group position-relative tooltip-end-top">
                      <Form.Label>Observação</Form.Label>
                      <Form.Control type="text" name="observation" value={values.observation} onChange={handleChange} />
                      {errors.observation && touched.observation && <div className="d-block invalid-tooltip">{errors.observation}</div>}
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center">
                  <AsyncButton isSaving={isSaving} type="submit">
                    Agendar atendimento
                  </AsyncButton>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Alert variant="light">
            <Row className='text-center'>
              <strong>Local de atendimento</strong>
              <p className='text-alternate'>{serviceLocationResult.data?.nome} - {serviceLocationResult.data?.endereco_completo}</p>
            </Row>
            <Row className='text-center'>
              <strong>Nome do profissional</strong>
              <p className='text-alternate'>{serviceLocationResult.data?.userr?.nome_completo}</p>
            </Row>
            <Row className='text-center'>
              <strong>Contato</strong>
              <p className='text-alternate'>{serviceLocationResult.data?.telefone}</p>
            </Row>
          </Alert>
        </Row>
      </form>
    </Container>
  );
};

const Main = () => {
  useLayout();

  return (
    <QueryClientProvider client={queryClient}>
      <ProfessionalWebSiteSchedule />
    </QueryClientProvider>
  );
};

export default Main;
