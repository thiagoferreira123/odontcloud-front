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
  clinic_email: string;
  clinic_full_name: string;
  clinic_phone: string;
  clinic_cnpj_or_cpf?: string;
  clinic_zipcode?: string;
  clinic_state?: string;
  clinic_city?: string;
  clinic_neighborhood?: string;
  clinic_street?: string;
  clinic_number?: string;
  clinic_logo_link?: string;
}

const PersonalData = () => {
  const [isSaving, setIsSaving] = useState(false);

  const user = useAuth((state) => state.user);

  const validationSchema = Yup.object().shape({
    clinic_email: Yup.string().email('Insira um e-mail válido').required('O e-mail é obrigatório'),
    clinic_full_name: Yup.string()
      .matches(/^[\p{L} ]+$/u, 'Insira um nome completo válido')
      .required('O nome completo é obrigatório'),
    clinic_cnpj_or_cpf: Yup.string()
      .matches(/^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/, 'Insira um CPF ou CNPJ válido')
      .required('O CPF ou CNPJ é obrigatório')
      .transform((value) => value && value.replace(/\D/g, '')),
    clinic_phone: Yup.string()
      .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}[-\s]?\d{4}$/, 'Insira um número de telefone válido')
      .required('O telefone é obrigatório'),
    clinic_zipcode: Yup.string().matches(/^\d{5}-\d{3}$/, 'Insira um CEP válido'),
    clinic_state: Yup.string().matches(/^[A-Za-z]{2}$/, 'Insira uma sigla de estado válida'),
    clinic_city: Yup.string(),
    clinic_neighborhood: Yup.string(),
    clinic_street: Yup.string(),
    clinic_logo_link: Yup.string(),
    clinic_number: Yup.number(),
  });

  const initialValues: FormikValues = {
    clinic_email: '',
    clinic_full_name: '',
    clinic_cnpj_or_cpf: '',
    clinic_phone: '',
    clinic_zipcode: '',
    clinic_state: '',
    clinic_street: '',
    clinic_city: '',
    clinic_neighborhood: '',
    clinic_number: '',
  };

  const { setUser } = useAuth();

  const onSubmit = async (values: FormikValues) => {
    try {
      setIsSaving(true);

      const { data } = await api.put<User>('/clinic/', values);

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
    formik.setFieldValue('clinic_cnpj_or_cpf', maskedValue);
  };

  const handleZipCodeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawZipCode = event.target.value;
    const maskedZipCode = applyZipCodeMask(rawZipCode);
    formik.setFieldValue('clinic_zipcode', maskedZipCode);

    if (maskedZipCode.length === 9) {
      try {
        const numericZipCode = maskedZipCode.replace('-', '');
        const response = await axios.get(`https://viacep.com.br/ws/${numericZipCode}/json/`);
        const { uf, localidade, clinic_neighborhood, logradouro } = response.data;

        formik.setFieldValue('clinic_state', uf);
        formik.setFieldValue('clinic_city', localidade);
        formik.setFieldValue('clinic_neighborhood', clinic_neighborhood);
        formik.setFieldValue('clinic_street', logradouro);
      } catch (error) {
        console.error('Erro ao buscar CEP', error);
      }
    }
  };

  const getUploadParams = () => ({ url: apiUrl + '/clinic/upload-logo' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      if (!user) return console.error('Usuário não encontrado');

      setFieldValue('clinic_logo_link', file.xhr.response);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      if (!user) return console.error('Usuário não encontrado');

      api.delete('/clinic/upload-logo', { data: { url: file.xhr.response } });
      setUser({ ...user, clinic_logo_link: '' });
    }
  };

  useEffect(() => {
    if (!user) return;

    setValues({
      clinic_email: user.clinic_email,
      clinic_full_name: user.clinic_full_name,
      clinic_cnpj_or_cpf: user.clinic_cnpj_or_cpf ?? '',
      clinic_phone: user.clinic_phone ?? '',
      clinic_zipcode: user.clinic_zipcode ?? '',
      clinic_state: user.clinic_state ?? '',
      clinic_city: user.clinic_city?.toString() ?? '',
      clinic_neighborhood: user.clinic_neighborhood ?? '',
      clinic_street: user.clinic_street ?? '',
      clinic_logo_link: user.clinic_logo_link ?? '',
      clinic_number: user.clinic_number?.toString() ?? '',
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
              inputContent="Insira a logo da clínica"
            />
          </div>

          <div className="mb-3 top-label">
            <Form.Control type="text" name="clinic_full_name" value={values.clinic_full_name} onChange={handleChange} />
            <Form.Label>NOME COMPLETO</Form.Label>
            {errors.clinic_full_name && touched.clinic_full_name && <div className="error">{errors.clinic_full_name}</div>}
          </div>

          <div className="mb-3 top-label">
            <Form.Control type="text" name="clinic_email" value={values.clinic_email} readOnly />
            <Form.Label className='bg-transparent'>EMAIL</Form.Label>
            {errors.clinic_email && touched.clinic_email && <div className="error">{errors.clinic_email}</div>}
          </div>

          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex">
                <Form.Control type="text" name="clinic_cnpj_or_cpf" value={values.clinic_cnpj_or_cpf} onChange={handleCpfCnpjChange} />
                <Form.Label>CNPJ OU CPF</Form.Label>
                {errors.clinic_cnpj_or_cpf && touched.clinic_cnpj_or_cpf && <div className="error">{errors.clinic_cnpj_or_cpf}</div>}
              </div>
            </Col>
          </div>

          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="clinic_phone" value={values.clinic_phone} onChange={handleChange} />
                <Form.Label>CONTATO</Form.Label>
                {errors.clinic_phone && touched.clinic_phone && <div className="error">{errors.clinic_phone}</div>}
              </div>
            </Col>

            <Col xl={6}>
              <div className="mb-3 top-label d-flex">
                <Form.Control type="text" name="clinic_zipcode" value={formik.values.clinic_zipcode} onChange={handleZipCodeChange} />
                <Form.Label>CEP</Form.Label>
                {errors.clinic_zipcode && touched.clinic_zipcode && <div className="error">{errors.clinic_zipcode}</div>}
              </div>
            </Col>
          </div>
          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="clinic_state" value={values.clinic_state} onChange={handleChange} />
                <Form.Label>ESTADO</Form.Label>
                {errors.clinic_state && touched.clinic_state && <div className="error">{errors.clinic_state}</div>}
              </div>
            </Col>

            <Col xl={6}>
              <div className="mb-3 top-label d-flex">
                <Form.Control type="text" name="clinic_city" value={values.clinic_city} onChange={handleChange} />
                <Form.Label>CIDADE</Form.Label>
                {errors.clinic_city && touched.clinic_city && <div className="error">{errors.clinic_city}</div>}
              </div>
            </Col>
          </div>

          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="clinic_neighborhood" value={values.clinic_neighborhood} onChange={handleChange} />
                <Form.Label>BAIRRO</Form.Label>
                {errors.clinic_neighborhood && touched.clinic_neighborhood && <div className="error">{errors.clinic_neighborhood}</div>}
              </div>
            </Col>
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="clinic_street" value={values.clinic_street} onChange={handleChange} />
                <Form.Label>RUA</Form.Label>
                {errors.clinic_street && touched.clinic_street && <div className="error">{errors.clinic_street}</div>}
              </div>
            </Col>
          </div>

          <div className="d-flex">
            <Col xl={6}>
              <div className="mb-3 top-label d-flex me-2">
                <Form.Control type="text" name="clinic_number" value={Number(values.clinic_number) ? values.clinic_number : ''} onChange={handleChange} />
                <Form.Label>Nº</Form.Label>
                {errors.clinic_number && touched.clinic_number && <div className="error">{errors.clinic_number}</div>}
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
