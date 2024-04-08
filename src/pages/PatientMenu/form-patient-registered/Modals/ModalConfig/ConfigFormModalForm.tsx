import React, { useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { useQueryClient } from '@tanstack/react-query';
import { useFormStore } from '../../../../FormPatientRegistered/hooks/FormStore';
import { FormPayload } from '../../../../../types/FormBuilder';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import { useConfigFormModalStore } from '../../hooks/ConfigFormModalStore';

const ConfigFormModalForm = (props: { setIsLoading: (isLoading: boolean) => void; hideModal: () => void }, ref: React.Ref<unknown> | undefined) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const history = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const selectedForm = useConfigFormModalStore((state) => state.selectedForm);

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Digite um nome valido.'),
  });

  const initialValues = { nome: '' };

  const { createForm, editForm } = useFormStore();

  const onSubmit = async ({ nome }: { nome: string }) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('Patient Id is required');

      const payload: FormPayload = {
        nome,
        data: new Date().toISOString(),
        form: selectedForm ? selectedForm.form : '',
        status: 'ABERTO',
        tipo: 'PACIENTE',
        paciente_id: +id,
      };

      const response = selectedForm?.id
        ? await editForm({ ...selectedForm, ...payload, resposta: undefined, form: undefined }, queryClient)
        : await createForm(payload, queryClient);

      if (!response) throw new Error('Erro ao criar formulário');

      !selectedForm?.id && history(`/app/formulario-pre-consulta-paciente-cadastrado/${response.id}/${id}?editing=true`);

      props.setIsLoading(false);
      props.hideModal();
      resetForm();
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, setValues, values, touched, errors } = formik;

  useEffect(() => {
    setValues({ nome: selectedForm?.nome || '' });
  }, [selectedForm]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>Esse é o nome que será exibido no app do paciente</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />
        <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Nome do formulário" />
        {errors.nome && touched.nome && <div className="error">{errors.nome}</div>}
      </div>
    </Form>
  );
};

export default React.forwardRef(ConfigFormModalForm);
