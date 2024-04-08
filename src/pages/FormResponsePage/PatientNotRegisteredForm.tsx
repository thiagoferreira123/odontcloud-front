import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from 'react-router-dom';
import { Form as FormType } from '../../types/FormBuilder';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { useNotSignedAnswerStoreStore } from '../FormLoose/Hooks/NotSignedAnswerStore';
import { notify } from '../../components/toast/NotificationIcon';
import { useState } from 'react';

type FormValues = {
  email_paciente: string;
  nome_paciente: string;
  wpp_paciente: string;
};

type Props = {
  form: FormType;
};

const PatientNotRegisteredForm = ({ form }: Props) => {
  const [searchParams, setSeachParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const imageLogo =
    !form.profissional?.locationsService || form.profissional?.locationsService.length === 0
      ? null
      : `https://${form.profissional.locationsService[0].url_base_logo}/${form.profissional.locationsService[0].logo}`;

  const validationSchema = Yup.object().shape({
    email_paciente: Yup.string().email('Digite um e-mail válido'),
    nome_paciente: Yup.string()
      .matches(/^[aA-zZ\s]+$/, 'Apenas letras são permitidas no nome')
      .required('nome é obrigatório'),
    wpp_paciente: Yup.string().nullable().matches(/^\d+$/, 'Digite apenas números no telefone'),
  });

  const initialValues = { email_paciente: '', nome_paciente: '', wpp_paciente: '' };

  const { createFormAnswer } = useNotSignedAnswerStoreStore();

  const onSubmit = async (values: FormValues) => {
    try {
      if (!form) return;
      const { nome_paciente, email_paciente, wpp_paciente } = values;
      setIsLoading(true);

      const payload = {
        nome: form.nome,
        nome_paciente,
        email_paciente,
        wpp_paciente,
        data: new Date().toISOString(),
        form: '',
        status: form.status,
        profissional_id: form.id_dono,
        tipo: 'PROFISSIONAL',
        key: '8b1856e4025bfb9db4510f68aed69a405bb11ac050192c02d187e7051c663cf6',
        respostas: '',
      };

      const response = await createFormAnswer(payload);

      if(response === false) throw new Error('Erro ao criar resposta do formulário');

      searchParams.set('nome_paciente', values.nome_paciente);
      searchParams.set('email_paciente', values.email_paciente);
      searchParams.set('wpp_paciente', values.wpp_paciente);
      searchParams.set('answer_id', response.id.toString());
      setSeachParams(searchParams);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      notify('Erro ao enviar resposta', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  return (
    <Row className="h-100 d-flex justify-content-center align-items-center">
      <Col md={6}>
        <Card className="p-2">
          {imageLogo ? (
            <div className="mt-5">
              <img src={imageLogo} className="rounded mx-auto mb-1 d-block sw-30" alt={`${form.profissional?.locationsService ? form.profissional?.locationsService[0].nome : '?'}`} />
            </div>
          ) : null}
          <h4 className="text-center mt-4">Por gentileza, forneça suas informações pessoais antes de procedermos com o preenchimento do formulário.</h4>
          <Card.Body className="mb-n3 border-last-none">
            <Form onSubmit={handleSubmit} className="tooltip-end-top">
              <div className="mb-3 filled">
                <CsLineIcons icon="user" />
                <Form.Control type="text" name="nome_paciente" value={values.nome_paciente} onChange={handleChange} placeholder="Nome completo" />
                {errors.nome_paciente && touched.nome_paciente && <div className="error">{errors.nome_paciente}</div>}
              </div>
              <div className="mb-3 filled">
                <CsLineIcons icon="email" />
                <Form.Control type="text" name="email_paciente" value={values.email_paciente} onChange={handleChange} placeholder="Email (opcional)" />
                {errors.email_paciente && touched.email_paciente && <div className="error">{errors.email_paciente}</div>}
              </div>
              <div className="mb-3 filled">
                <CsLineIcons icon="phone" />
                <Form.Control type="text" name="wpp_paciente" value={values.wpp_paciente} onChange={handleChange} placeholder="Contato (opcional)" />
                {errors.wpp_paciente && touched.wpp_paciente && <div className="error">{errors.wpp_paciente}</div>}
              </div>
              <div className="text-center mt-2">
                <Button variant="primary" size="lg" className="hover-scale-down" type="submit">
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <>
                      {' '}
                      <CsLineIcons icon="send" /> <span>Iniciar formulário</span>
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

export default PatientNotRegisteredForm;
