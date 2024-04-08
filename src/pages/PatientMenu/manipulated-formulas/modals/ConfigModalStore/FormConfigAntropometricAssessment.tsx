import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useNavigate } from 'react-router-dom';

import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usePatientMenuStore from '/src/pages/PatientMenu/hooks/patientMenuStore';
import Datepicker from './Datepicker';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import { useQueryClient } from '@tanstack/react-query';
import { ManipulatedFormula, useManipulatedFormulas } from '../../hooks';

interface FormikValues {
  dataCriacao: Date;
  nome: string;
}

const FormConfigAntropometricExam = (
  // eslint-disable-next-line no-unused-vars
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
    reset,
  }));

  const history = useNavigate();
  const queryClient = useQueryClient();

  const idPaciente = usePatientMenuStore((state) => state.patientId);

  const selectedManipulatedFormula = useConfigModalStore((state) => state.selectedManipulatedFormula);

  const validationSchema = Yup.object().shape({
    dataCriacao: Yup.date().required('A data de registro é obrigatória'),
    nome: Yup.string().required('O nome da fórmula é obrigatório'),
  });

  const initialValues = { dataCriacao: new Date(), nome: '' };

  const { clearSelectedManipulatedFormula } = useConfigModalStore();
  const { updateManipulatedFormulas, addManipulatedFormulas } = useManipulatedFormulas();

  const onSubmit = async ({ dataCriacao, nome }: FormikValues) => {
    props.setIsLoading(true);

    try {
      const payload: Partial<ManipulatedFormula> = {
        idPaciente,
        nome,
        dataCriacao,
      };

      if (selectedManipulatedFormula) {
        const result = await updateManipulatedFormulas({ ...selectedManipulatedFormula, ...payload, Compostos: undefined }, queryClient);

        if (result === false) throw new Error('Erro ao atualizar fórmula manipulada');

        notify('Fórmula manipulada atualizada com sucesso', 'Sucesso', 'prize');
      } else {
        const result = await addManipulatedFormulas({ ...payload, conteudo: '' }, queryClient);

        if (result === false) throw new Error('id is required');

        history('/app/formulas-manipuladas/' + result.id);
        notify('Fórmula manipulada inserida com sucesso', 'Sucesso', 'prize');
      }

      props.setIsLoading(false);
      props.handleCloseModal();
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
      notify('Erro ao salvar fórmula manipulada', 'Erro', 'error-hexagon');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, resetForm, handleChange, setValues, setFieldValue, values, touched, errors } = formik;

  const reset = useCallback(() => {
    resetForm();
    clearSelectedManipulatedFormula();
  }, [clearSelectedManipulatedFormula, resetForm]);

  const notify = (message: string, title: string, icon: string, status?: string) =>
    toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  useEffect(() => {
    if (!selectedManipulatedFormula) return;

    setValues({ dataCriacao: new Date(selectedManipulatedFormula.dataCriacao), nome: selectedManipulatedFormula.nome });
  }, [selectedManipulatedFormula, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>Esse é o nome que será exibido no app do paciente</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />
        <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Nome da fórmula manipulada" />
        {errors.nome && touched.nome && <div className="error">{errors.nome}</div>}
      </div>
      <label>Data de cadastro</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />

        <Datepicker name="dataCriacao" value={values.dataCriacao} setFieldValue={setFieldValue} />
        {errors.dataCriacao && touched.dataCriacao && <div className="error">{errors.dataCriacao as string}</div>}
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigAntropometricExam);
