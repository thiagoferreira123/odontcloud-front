import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Col, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import InputMask from 'react-input-mask';
import { RegisterValues } from '../Login/hook/types';
import { useAuth } from '../Login/hook';
import AsyncButton from '../../../components/AsyncButton';
import { AxiosError } from 'axios';
import { notify } from '../../../components/toast/NotificationIcon';
import SelectCountry from './SelectCountry';
import { Option } from '../../../types/inputs';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import HtmlHead from '../../../components/html-head/HtmlHead';
import LayoutFullpage from '../../../layout/LayoutFullpage';

const Register = () => {
  const title = 'Register';
  const description = 'Register Page';

  const [isLoging, setIsLoging] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Definindo o estado showPassword
  const history = useNavigate();

  const nacionalidades = [
    { label: 'Portugal', value: 'PT' },
    { label: 'Brasil', value: 'BR' },
  ];

  const [telefoneMask, setTelefoneMask] = useState('');

  const handleNacionalidadeChange = (option: Option) => {
    if (option) {
      const mask = option.value === 'PT' ? '351 999 999 999' : '55 99 99999-9999'; // Define a máscara com base na nacionalidade
      setTelefoneMask(mask);
    } else {
      setTelefoneMask('');
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Digite um nome valido.'),
    email: Yup.string().email().required('Digite um email valido.'),
    telefone: Yup.string().required('Digite um WhatsApp válido.'),
    terms: Yup.bool().required().oneOf([true], 'Os termos devem ser aceitos!'),
    password: Yup.string()
      .min(6, 'Deve ter pelo menos 6 caracteres')
      .matches(/[a-z]/, 'Deve conter pelo menos uma letra')
      .matches(/[^a-zA-Z0-9]/, 'Deve conter pelo menos um símbolo.')
      .required('Digite uma senha válida.'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'As senhas devem coincidir.')
      .required('Confirme a senha.'),
  });

  const initialValues: RegisterValues = { name: '', email: '', password: '', passwordConfirm: '', telefone: '', terms: false };

  const { register } = useAuth();

  const onSubmit = async (values: RegisterValues) => {
    try {
      setIsLoging(true);
      await register(values);

      setIsLoging(false);

      history('/app/');
    } catch (error) {
      setIsLoging(false);

      if (error instanceof AxiosError) notify(error.response?.data.message, 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } = formik;
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordType = showPassword ? 'text' : 'password';
  const eyeIcon = showPassword ? 'eye-off' : 'eye';

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
      </div>
    </div>
  );

  const rightSide = (
    <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <Col xs="12" sm={25} className='text-center'>
          <img src="/img/logo/logo.webp" className="img-fluid rounded-md" alt="Fluid image" />
        </Col>
        <div className="mb-2 mt-3">
          <h4 className="cta-1 mb-3 text-alternate">Boas-vindas ao DietSystem!</h4>
        </div>
        <div className="mb-5">
          <p className="h6 text-alternate">Cadastre-se gratuitamente inserindo seus dados, a confirmação será feita via WhatsApp.</p>
        </div>
        <div>
          <form id="registerForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>

            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="user" />
              <Form.Control type="text" name="name" placeholder="Nome completo" value={values.name} onChange={handleChange} />
              {errors.name && touched.name && <div className="d-block invalid-tooltip">{errors.name}</div>}
            </div>

            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email profissional" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>

            <div>

              <div className="mb-3 filled form-group tooltip-end-top text-alternate">
                <CsLineIcons icon="pin" />
                <SelectCountry options={nacionalidades} onChange={option => handleNacionalidadeChange(option as Option)} />
              </div>

              <div className="mb-3 filled form-group tooltip-end-top">
                <CsLineIcons icon="phone" />
                <InputMask mask={telefoneMask} value={values.telefone} onChange={(e) => setFieldValue('telefone', e.target.value)} className="form-control" name="telefone" placeholder="WhatsApp">
                  {(inputProps) => <Form.Control {...inputProps} />}
                </InputMask>
                {errors.telefone && touched.telefone && <div className="d-block invalid-tooltip">{errors.telefone}</div>}
              </div>
            </div>

            <div className="mb-3 filled form-group tooltip-end-top position-relative">
              <CsLineIcons icon="lock-on" />
              <Form.Control
                type={passwordType}
                name="password"
                onChange={handleChange}
                value={values.password}
                placeholder="Senha (6 dígitos, símbolo e letra)"
              />
              <div
                className="position-absolute end-0 top-50 translate-middle-y"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer', paddingRight: '10px' }}
              >
                <CsLineIcons icon={eyeIcon} />
              </div>
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>

            <div className="mb-3 filled form-group tooltip-end-top position-relative">
              <CsLineIcons icon="lock-on" />
              <Form.Control
                type={passwordType}
                name="passwordConfirm"
                onChange={handleChange}
                value={values.passwordConfirm}
                placeholder="Confirme sua senha"
              />
              <div
                className="position-absolute end-0 top-50 translate-middle-y"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer', paddingRight: '10px' }}
              >
                <CsLineIcons icon={eyeIcon} />
              </div>
              {errors.passwordConfirm && touched.passwordConfirm && <div className="d-block invalid-tooltip">{errors.passwordConfirm}</div>}
            </div>

            <div className="mb-3 position-relative form-group">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" name="terms" onChange={handleChange} value={values.terms ? 1 : 0} checked={values.terms} />
                <label className="form-check-label">
                  Eu li e aceito os{' '}
                  <NavLink to="https://dietsystem.com.br/termos-de-uso" target="_blank" className="text-alternate">
                    Termos de uso,
                  </NavLink>{' '}
                  <NavLink to="https://dietsystem.com.br/politica-de-privacidade" target="_blank" className="text-alternate">
                    Políticas de privacidade,
                  </NavLink>{' '}
                  <NavLink to="https://dietsystem.com.br/politica-de-pagamentos" target="_blank" className="text-alternate">
                    Políticas de pagamentos e
                  </NavLink>{' '}
                  <NavLink to="https://dietsystem.com.br/politica-de-cookies" target="_blank" className="text-alternate">
                    Políticas de cookies
                  </NavLink>
                </label>

                {errors.terms && touched.terms && <div className="d-block invalid-tooltip">{errors.terms}</div>}
              </div>
            </div>

            <div className='text-center'>
              <AsyncButton isSaving={isLoging} size="lg" type="submit">
                Criar conta gratuita
              </AsyncButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default Register;
