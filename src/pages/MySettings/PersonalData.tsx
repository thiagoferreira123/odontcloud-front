import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../Auth/Login/hook';
import api, { apiUrl } from '../../services/useAxios';
import { notify } from '../../components/toast/NotificationIcon';
import AsyncButton from '../../components/AsyncButton';
import { User } from '../Auth/Login/hook/types';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import Dropzone, { IFileWithMeta, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import DropzonePreview from '../../components/dropzone/DropzonePreview';

interface FormikValues {
  email: string;
  nome_completo: string;
  especialidades: string;
  crn: string;
  cpf: string;
  telefone: string;
  zipCode: string;
  id_estado: string;
  id_cidade: string;
  bairro: string;
  endereco: string;

  image: string;
}

const PersonalData = () => {
  const [isSaving, setIsSaving] = useState(false);

  const user = useAuth((state) => state.user);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Insira um e-mail válido').required('O e-mail é obrigatório'),
    nome_completo: Yup.string()
      .matches(/^[\p{L} ]+$/u, 'Insira um nome completo válido')
      .required('O nome completo é obrigatório'),
    especialidades: Yup.string().required('A especialidade é obrigatória'),
    crn: Yup.string()
      .matches(/^[0-9]+$/, 'O CRN deve conter apenas números')
      .required('O CRN é obrigatório'),
    cpf: Yup.string()
      .matches(/^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/, 'Insira um CPF ou CNPJ válido')
      .required('O CPF ou CNPJ é obrigatório')
      .transform((value) => value && value.replace(/\D/g, '')),
    telefone: Yup.string()
      .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}[-\s]?\d{4}$/, 'Insira um número de telefone válido')
      .required('O telefone é obrigatório'),
    zipCode: Yup.string().matches(/^\d{5}-\d{3}$/, 'Insira um CEP válido'),
    id_estado: Yup.string().matches(/^[A-Za-z]{2}$/, 'Insira uma sigla de estado válida'),
    id_cidade: Yup.string(),
    bairro: Yup.string(),
    endereco: Yup.string(),
  });

  const initialValues: FormikValues = {
    email: '',
    nome_completo: '',
    especialidades: '',
    crn: '',
    cpf: '',
    telefone: '',
    zipCode: '',
    id_estado: '',
    id_cidade: '',
    bairro: '',
    endereco: '',
    image: '',
  };

  const { setUser } = useAuth();

  const onSubmit = async (values: FormikValues) => {
    try {
      setIsSaving(true);

      const { data } = await api.put<User>('/profissional', values);

      setUser(data);

      notify('Dados cadastrais atualizados com sucesso', 'Sucesso', 'check', 'success');
      setIsSaving(false);
    } catch (error) {
      notify('Erro ao atualizar dados cadastrais', 'Error', 'close', 'danger');
      setIsSaving(false);
      console.error('Erro ao atualizar dados cadastrais', error);
    }
  };
  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setValues, setFieldValue, values, touched, errors } = formik;

  const applyCpfCnpjMask = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 11) {
      return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})?/, '$1.$2.$3-$4');
    }
    return numericValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})?/, '$1.$2.$3/$4-$5');
  };

  const applyZipCodeMask = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const handleCpfCnpjChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyCpfCnpjMask(event.target.value);
    formik.setFieldValue('cpf', maskedValue);
  };

  const handleZipCodeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawZipCode = event.target.value;
    const maskedZipCode = applyZipCodeMask(rawZipCode);
    formik.setFieldValue('zipCode', maskedZipCode);

    if (maskedZipCode.length === 9) {
      try {
        const numericZipCode = maskedZipCode.replace('-', '');
        const response = await axios.get(`https://viacep.com.br/ws/${numericZipCode}/json/`);
        const { uf, localidade, bairro, logradouro } = response.data;

        formik.setFieldValue('id_estado', uf);
        formik.setFieldValue('id_cidade', localidade);
        formik.setFieldValue('bairro', bairro);
        formik.setFieldValue('endereco', logradouro);
      } catch (error) {
        console.error('Erro ao buscar CEP', error);
      }
    }
  };

  const getUploadParams = () => ({ url: apiUrl + '/profissional/upload-image' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      if (!user) return console.error('Usuário não encontrado');

      setFieldValue('image', file.xhr.response);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      if (!user) return console.error('Usuário não encontrado');

      api.delete('/profissional/upload-image', { data: { url: file.xhr.response } });
      setUser({ ...user, image: '' });
    }
  };

  useEffect(() => {
    if (!user) return;

    setValues({
      email: user.email,
      nome_completo: user.nome_completo,
      especialidades: user.especialidades ?? '',
      crn: user.crn ?? '',
      cpf: user.cpf ?? '',
      telefone: user.telefone ?? '',
      zipCode: user.zipCode ?? '',
      id_estado: user.id_estado ?? '',
      id_cidade: user.id_cidade?.toString() ?? '',
      bairro: user.bairro ?? '',
      endereco: user.endereco ?? '',
      image: user.image ?? '',
    });
  }, [setValues, user]);

  return (
    <>
      <Row className="g-0 mb-2">
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="filled mb-4">
            <CsLineIcons icon="upload" />
            <Dropzone
              getUploadParams={getUploadParams}
              PreviewComponent={DropzonePreview}
              submitButtonContent={null}
              accept="image/*"
              submitButtonDisabled
              inputWithFilesContent={null}
              onChangeStatus={onChangeStatus}
              classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
              inputContent="Insira uma foto de perfil"
            />
          </div>

          <div className="mb-3 top-label">
            <Form.Control type="text" name="nome_completo" value={values.nome_completo} onChange={handleChange} />
            <Form.Label>NOME COMPLETO</Form.Label>
            {errors.nome_completo && touched.email && <div className="error">{errors.nome_completo}</div>}
          </div>

          <div className="mb-3 top-label">
            <Form.Control type="text" name="email" value={values.email} onChange={handleChange} readOnly />
            <Form.Label className='bg-transparent'>EMAIL</Form.Label>
            {errors.email && touched.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="mb-3 top-label">
            <Form.Control type="text" name="especialidades" value={values.especialidades} onChange={handleChange} />
            <Form.Label>ESPECIALIDADE</Form.Label>
            {errors.especialidades && touched.especialidades && <div className="error">{errors.especialidades}</div>}
          </div>

          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="crn" value={values.crn} onChange={handleChange} />
                <Form.Label>REGISTRO PROFISSIONAL</Form.Label>
                {errors.crn && touched.crn && <div className="error">{errors.crn}</div>}
              </div>
            </Col>

            <Col xl={6}>
              <div className="mb-3 top-label d-flex">
                <Form.Control type="text" name="cpf" value={values.cpf} onChange={handleCpfCnpjChange} />
                <Form.Label>CNPJ OU CPF</Form.Label>
                {errors.cpf && touched.cpf && <div className="error">{errors.cpf}</div>}
              </div>
            </Col>
          </div>

          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="telefone" value={values.telefone} onChange={handleChange} />
                <Form.Label>CONTATO</Form.Label>
                {errors.telefone && touched.telefone && <div className="error">{errors.telefone}</div>}
              </div>
            </Col>

            <Col xl={6}>
              <div className="mb-3 top-label d-flex">
                <Form.Control type="text" name="zipCode" value={formik.values.zipCode} onChange={handleZipCodeChange} />
                <Form.Label>CEP</Form.Label>
                {errors.zipCode && touched.zipCode && <div className="error">{errors.zipCode}</div>}
              </div>
            </Col>
          </div>
          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="id_estado" value={values.id_estado} onChange={handleChange} />
                <Form.Label>ESTADO</Form.Label>
                {errors.id_estado && touched.id_estado && <div className="error">{errors.id_estado}</div>}
              </div>
            </Col>

            <Col xl={6}>
              <div className="mb-3 top-label d-flex">
                <Form.Control type="text" name="id_cidade" value={values.id_cidade} onChange={handleChange} />
                <Form.Label>CIDADE</Form.Label>
                {errors.id_cidade && touched.id_cidade && <div className="error">{errors.id_cidade}</div>}
              </div>
            </Col>
          </div>

          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="bairro" value={values.bairro} onChange={handleChange} />
                <Form.Label>BAIRRO</Form.Label>
                {errors.bairro && touched.bairro && <div className="error">{errors.bairro}</div>}
              </div>
            </Col>

            <Col xl={6}>
              <div className="mb-3 top-label d-flex">
                <Form.Control type="text" name="endereco" value={values.endereco} onChange={handleChange} />
                <Form.Label>ENDEREÇO</Form.Label>
                {errors.endereco && touched.endereco && <div className="error">{errors.endereco}</div>}
              </div>
            </Col>
          </div>

          <div className="text-center">
            <AsyncButton isSaving={isSaving} type="submit" size="lg" variant="primary">
              Atualizar dados cadastrais
            </AsyncButton>
          </div>
        </Form>
      </Row>
    </>
  );
};

export default PersonalData;
