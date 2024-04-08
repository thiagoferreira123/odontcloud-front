import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useNavigate } from "react-router-dom";

import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usePatientMenuStore from '/src/pages/PatientMenu/hooks/patientMenuStore';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import Datepicker from './Datepicker';
import { useRequestingExamsStore } from '../../hooks/RequestingExamsStore';
import { RequestingExam } from '/src/types/RequestingExam';


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

  const patientId = usePatientMenuStore((state) => state.patientId);

  const selectedExam = useConfigModalStore(state => state.selectedExam);

  const validationSchema = Yup.object().shape({
    requestDate: Yup.date().required('A data de registro é obrigatória'),
  });

  const initialValues = { requestDate: new Date() };

  const { clearSelectedExam } = useConfigModalStore();
  const { updateExam, addExam }= useRequestingExamsStore();

  const onSubmit = async ({ requestDate }: { requestDate: Date }) => {
    props.setIsLoading(true);

    try {

      if (!selectedExam) throw new Error('selectedExam is not defined');

      const payload: Partial<RequestingExam> = {
        patientId,
        requestDate,
      };

      if (selectedExam.id) {
        updateExam(selectedExam.id, payload);
        notify('Solicitação de exame atualizada com sucesso', 'Sucesso', 'prize');
      } else {
        const id = await addExam({...selectedExam, ...payload});

        if(!id) throw new Error('id is required');

        history("/app/solicitacao-exames/" + id);
        notify('Solicitação de exame inserida com sucesso', 'Sucesso', 'prize');
      }

      props.setIsLoading(false);
      props.handleCloseModal();
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
      notify('Erro ao salvar avaliação antropométrica', 'Erro', 'error-hexagon');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, resetForm, setValues, values, touched, errors } = formik;

  const reset = useCallback(() => {
    resetForm();
    clearSelectedExam();
  }, [clearSelectedExam, resetForm]);

  const notify = (message: string, title: string, icon: string, status?: string) =>
    toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  useEffect(() => {
    if (!selectedExam) return;

    setValues({requestDate: selectedExam.requestDate});
  }, [selectedExam, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>Data de cadastro</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />

        <Datepicker name="requestDate" value={values.requestDate} setValues={setValues} />
        {errors.requestDate && touched.requestDate && <div className="error">{errors.requestDate as string}</div>}
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigAntropometricExam);
