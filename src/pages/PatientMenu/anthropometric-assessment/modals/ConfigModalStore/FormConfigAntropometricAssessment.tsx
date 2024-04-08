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
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import { AntropometricAssessmentHistory } from '/src/types/AntropometricAssessment';
import { useAntropometricAssessmentStore } from '../../hooks/AntropometricAssessmentStore';
import Datepicker from './Datepicker';
import { getAntropometricPageLink } from '../../helpers';

const FormConfigAntropometricAssessment = (
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

  const selectedAssessment = useConfigModalStore((state) => state.selectedAssessment);

  const validationSchema = Yup.object().shape({
    data_registro: Yup.date().required('A data de registro é obrigatória'),
  });

  const initialValues = { data_registro: new Date() };

  const { clearSelectedAssessment } = useConfigModalStore();
  const { updateAssessment, addAssessment } = useAntropometricAssessmentStore();

  const onSubmit = async ({ data_registro }: { data_registro: Date }) => {
    props.setIsLoading(true);

    try {
      if (!selectedAssessment) throw new Error('selectedAssessment is not defined');

      const payload: Partial<AntropometricAssessmentHistory<unknown>> = {
        paciente_id: patientId,
        data_registro: data_registro.getTime() / 1000,
        faixa_etaria: selectedAssessment.id_bioimpedancia ? 3 : selectedAssessment.faixa_etaria,
        id_bioimpedancia: selectedAssessment.id_bioimpedancia ?
          selectedAssessment.id_bioimpedancia : selectedAssessment.faixa_etaria === 6 ?
            1 : undefined,
      };

      if (selectedAssessment.dados_geral_id) {
        const result = await updateAssessment(selectedAssessment.dados_geral_id, payload);

        if(result === false) throw new Error('Error updating assessment')

        notify('Avaliação antropométrica atualizada com sucesso', 'Sucesso', 'prize');
      } else {
        const result = await addAssessment({ ...selectedAssessment, ...payload });

        if (!result) throw new Error('Error adding assessment');

        history(getAntropometricPageLink(result));
        notify('Avaliação antropométrica inserida com sucesso', 'Sucesso', 'prize');
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
    clearSelectedAssessment();
  }, [clearSelectedAssessment, resetForm]);

  const notify = (message: string, title: string, icon: string, status?: string) =>
    toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  useEffect(() => {
    if (!selectedAssessment) return;

    setValues({ data_registro: new Date(selectedAssessment.data_registro * 1000) });
  }, [selectedAssessment, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>Data de cadastro</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />

        {/* <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Nome do avaliação antropom´étrica" /> */}

        <Datepicker name="data_registro" value={values.data_registro} setValues={setValues} />
        {errors.data_registro && touched.data_registro && <div className="error">{errors.data_registro as string}</div>}
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigAntropometricAssessment);
