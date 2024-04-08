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
import { useCaloricExpenditureStore } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { CaloricExpenditure } from '../../../../../types/CaloricExpenditure';

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

  const id_paciente = usePatientMenuStore((state) => state.patientId);

  const selectedExpenditure = useConfigModalStore((state) => state.selectedExpenditure);

  const validationSchema = Yup.object().shape({
    dataCriacao: Yup.date().required('A data de registro é obrigatória'),
    nome: Yup.string().required('O nome da predição é obrigatório'),
  });

  const initialValues = { dataCriacao: new Date(), nome: '' };

  const { clearSelectedExpenditure } = useConfigModalStore();
  const { updateExpediture, addExpediture } = useCaloricExpenditureStore();

  const onSubmit = async ({ dataCriacao, nome }: FormikValues) => {
    props.setIsLoading(true);

    try {
      const payload: Partial<CaloricExpenditure> = {
        id_paciente,
        nome,
        dataCriacao,
      };

      if (selectedExpenditure) {
        const result = await updateExpediture({ ...selectedExpenditure, ...payload }, queryClient);

        if (result === false) throw new Error('Erro ao atualizar predição de gasto calórico');

        notify('Predição de gasto calórico atualizada com sucesso', 'Sucesso', 'prize');
      } else {
        const result = await addExpediture({ ...payload }, queryClient);

        if (result === false) throw new Error('id is required');

        history('/app/gasto-calorico/' + result.id);
        notify('Predição de gasto calórico inserida com sucesso', 'Sucesso', 'prize');
      }

      props.setIsLoading(false);
      props.handleCloseModal();
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
      notify('Erro ao salvar predição de gasto calórico', 'Erro', 'error-hexagon');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, resetForm, handleChange, setValues, setFieldValue, values, touched, errors } = formik;

  const reset = useCallback(() => {
    resetForm();
    clearSelectedExpenditure();
  }, [clearSelectedExpenditure, resetForm]);

  const notify = (message: string, title: string, icon: string, status?: string) =>
    toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  useEffect(() => {
    if (!selectedExpenditure) return;

    setValues({ dataCriacao: new Date(selectedExpenditure.dataCriacao), nome: selectedExpenditure.nome });
  }, [selectedExpenditure, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>Esse é o nome que será exibido no app do paciente</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />
        <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Nome da predição de gasto calórico" />
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
