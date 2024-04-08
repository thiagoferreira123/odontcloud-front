import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AsyncButton from '../../components/AsyncButton';
import api from '../../services/useAxios';
import { useAuth } from '../Auth/Login/hook';
import { notify } from '../../components/toast/NotificationIcon';
import { AxiosError } from 'axios';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { User } from '../Auth/Login/hook/types';

interface FormValues {
  clinic_current_password: string;
  clinic_new_password: string;
  clinic_new_password_confirmation: string;
}

const Password: React.FC = () => {
  const [showPasswordOld, setShowPasswordOld] = useState<boolean>(false);
  const [showPasswordNew, setShowPasswordNew] = useState<boolean>(false);
  const [showPasswordNewConfirm, setShowPasswordNewConfirm] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const user = useAuth((state) => state.user);

  const toggleShowPasswordOld = () => setShowPasswordOld(!showPasswordOld);
  const toggleShowPasswordNew = () => setShowPasswordNew(!showPasswordNew);
  const toggleShowPasswordNewConfirm = () => setShowPasswordNewConfirm(!showPasswordNewConfirm);

  const validationSchema = Yup.object().shape({
    clinic_current_password: Yup.string().required('A senha atual é obrigatória'),
    clinic_new_password: Yup.string()
      .required('A nova senha é obrigatória')
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .matches(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula')
      .matches(/[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`]/, 'A senha deve conter ao menos um símbolo'),
    clinic_new_password_confirmation: Yup.string()
      .oneOf([Yup.ref('clinic_new_password'), undefined], 'As senhas devem coincidir.')
      .required('Confirme a senha.'),
  });

  const initialValues: FormValues = { clinic_current_password: '', clinic_new_password: '', clinic_new_password_confirmation: '' };
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);

      if (!user) throw new Error('Usuário não encontrado');

      const payload = {
        clinic_email: user?.clinic_email,
        clinic_current_password: values.clinic_current_password,
        clinic_new_password: values.clinic_new_password,
      };

      const { data } = await api.post('/clinic/update-password', payload);

      console.log(data);

      notify('Senha alterada com sucesso', 'Sucesso', 'check', 'success');
      setIsSaving(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          notify('Senha atual incorreta', 'Erro', 'alert', 'danger');
          setIsSaving(false);
          return;
        }
      }

      notify('Erro ao alterar a senha', 'Erro', 'alert', 'danger');
      setIsSaving(false);
      console.error(error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { handleSubmit, handleChange, values, touched, errors } = formik;

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Senha Atual */}
        <div className="mb-3 mt-2 top-label">
          <Form.Label>DIGITE A SENHA ATUAL</Form.Label>
          <InputGroup>
            <Form.Control type={showPasswordOld ? 'text' : 'password'} name="clinic_current_password" value={values.clinic_current_password} onChange={handleChange} />
            <InputGroup.Text onClick={toggleShowPasswordOld}>{showPasswordOld ? <CsLineIcons icon="eye-off" /> : <CsLineIcons icon="eye" />}</InputGroup.Text>
          </InputGroup>
          {errors.clinic_current_password && touched.clinic_current_password && <div className="error">{errors.clinic_current_password}</div>}
        </div>

        {/* Nova Senha */}
        <div className="mb-3 mt-2 top-label">
          <Form.Label>DIGITE A SENHA NOVA (MÍNIMO 6 CARACTERES, 1 LETRA MAIÚSCULA E 1 SÍMBOLO)</Form.Label>
          <InputGroup>
            <Form.Control type={showPasswordNew ? 'text' : 'password'} name="clinic_new_password" value={values.clinic_new_password} onChange={handleChange} />
            <InputGroup.Text onClick={toggleShowPasswordNew}>{showPasswordNew ? <CsLineIcons icon="eye-off" /> : <CsLineIcons icon="eye" />}</InputGroup.Text>
          </InputGroup>
          {errors.clinic_new_password && touched.clinic_new_password && <div className="error">{errors.clinic_new_password}</div>}
        </div>

        {/* Confirmar Nova Senha */}
        <div className="mb-3 mt-2 top-label">
          <Form.Label>CONFIRME A SENHA NOVA</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPasswordNewConfirm ? 'text' : 'password'}
              name="clinic_new_password_confirmation"
              value={values.clinic_new_password_confirmation}
              onChange={handleChange}
            />
            <InputGroup.Text onClick={toggleShowPasswordNewConfirm}>
              {showPasswordNewConfirm ? <CsLineIcons icon="eye-off" /> : <CsLineIcons icon="eye" />}
            </InputGroup.Text>
          </InputGroup>
          {errors.clinic_new_password_confirmation && touched.clinic_new_password_confirmation && <div className="error">{errors.clinic_new_password_confirmation}</div>}
        </div>

        <div className="text-center mb-3">
          <AsyncButton isSaving={isSaving} type="submit" size="lg" variant="primary">
            Alterar senha de acesso
          </AsyncButton>
        </div>
      </form>
    </>
  );
};

export default Password;
