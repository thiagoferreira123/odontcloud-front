import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { notify } from '../../components/toast/NotificationIcon';
import { useState } from 'react';
import useMetabolicTrackingStore from './hooks';
import { MetabolicTracking } from './hooks/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import StaticLoading from '../../components/loading/StaticLoading';
import 'react-datepicker/dist/react-datepicker.css';
import { PatternFormat } from 'react-number-format';
import { parseBrDateToIso } from '../../helpers/DateHelper';

type FormValues = {
  email: string;
  name_patient: string;
  wpp: string;
};

const PatientData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { key } = useParams<{ key: string }>();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Digite um e-mail válido'),
    name_patient: Yup.string()
      .matches(/^[aA-zZ\s]+$/, 'Apenas letras são permitidas no nome')
      .required('nome é obrigatório'),
    wpp: Yup.string(),
  });

  const initialValues = { email: '', name_patient: '', wpp: '' };

  const { setPatientData } = useMetabolicTrackingStore();

  const onSubmit = async (values: FormValues) => {
    try {
      const { name_patient, email, wpp } = values;
      setIsLoading(true);

      const payload: Partial<MetabolicTracking> = {
        name_patient,
        email,
        wpp: parseBrDateToIso(values.wpp),
      };

      const response = await setPatientData(payload);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      notify('Erro ao enviar resposta', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } = formik;
  const { getMetabolicTracking } = useMetabolicTrackingStore();

  const getMetabolicTracking_ = async () => {
    try {
      if (!key) throw new Error('key não informada');

      const response = await getMetabolicTracking(key);

      if (!response) throw new Error('Erro ao buscar rastreamento metabólico');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['metabolic-tracking', key], queryFn: getMetabolicTracking_ });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  if (result.isError) return <div className="vh-100 w-100 d-flex align-items-center pb-5">Ocorreu um erro ao buscar dados do rastreamento metabólico</div>;

  const imageLogo =
    !result.data?.profissional?.locationsService || result.data?.profissional?.locationsService.length === 0
      ? null
      : `https://${result.data?.profissional.locationsService[0].url_base_logo}/${result.data?.profissional.locationsService[0].logo}`;

  return (
    <Row className="h-100 d-flex justify-content-center align-items-center">
      <Col md={6}>
        <Card className="p-2">
          {imageLogo ? (
            <div className="mt-5">
              <img
                src={imageLogo}
                className="rounded mx-auto mb-1 d-block sw-30"
                alt={`${result.data?.profissional?.locationsService ? result.data?.profissional?.locationsService[0].nome : '?'}`}
              />
            </div>
          ) : null}
          <h4 className="text-center mt-4">
            Por gentileza, forneça suas informações pessoais antes de procedermos com o preenchimento do rastreamento metabólico.
          </h4>
          <Card.Body className="mb-n3 border-last-none">
            <Form onSubmit={handleSubmit} className="tooltip-end-top">
              <div className="mb-3 filled">
                <CsLineIcons icon="user" />
                <Form.Control type="text" name="name_patient" value={values.name_patient} onChange={handleChange} placeholder="Nome completo" />
                {errors.name_patient && touched.name_patient && <div className="error">{errors.name_patient}</div>}
              </div>
              <div className="mb-3 filled">
                <CsLineIcons icon="email" />
                <Form.Control type="text" name="email" value={values.email} onChange={handleChange} placeholder="Email (opcional)" />
                {errors.email && touched.email && <div className="error">{errors.email}</div>}
              </div>
              <div className="mb-3 filled">
                <CsLineIcons icon="phone" />
                <Form.Control type="text" name="wpp" value={values.wpp} onChange={handleChange} placeholder="Contato (opcional)" />
                {errors.wpp && touched.wpp && <div className="error">{errors.wpp}</div>}
              </div>
              <div className="text-center mt-2">
                <Button variant="primary" size="lg" className="hover-scale-down" type="submit">
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <>
                      {' '}
                      <CsLineIcons icon="send" /> <span>Iniciar rastreamento metabólico</span>
                    </>
                  )}
                </Button>{' '}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PatientData;
