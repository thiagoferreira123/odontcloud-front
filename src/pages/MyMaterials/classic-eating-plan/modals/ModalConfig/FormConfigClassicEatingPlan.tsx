import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useNavigate } from "react-router-dom";
import { ClassicPlan, createConfigurations } from '/src/types/PlanoAlimentarClassico';
import useClassicPlans from '../../hooks/useClassicPlans';
import { formatDateToYYYYMMDD } from '/src/services/useDateHelpers';
import api from '/src/services/useAxios';

import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const weekDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

const FormConfigClassicEatingPlan = (
  // eslint-disable-next-line no-unused-vars
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
    reset,
  }));

  const history = useNavigate();

  const selectedPlan = useClassicPlans((state) => state.selectedPlan);
  const selectedTemplate = useClassicPlans((state) => state.selectedTemplate);

  const { setWeekDays, updatePlanConfigurations, updatePlan, addPlan, setSelectedTemplate } = useClassicPlans();

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Digite um nome valido.'),
    dataInicio: Yup.date().max(Yup.ref('dataFim'), 'Data de início deve ser anterior à data de fim.'),
    dataFim: Yup.date().min(Yup.ref('dataInicio'), 'Data de fim deve ser posterior à data de início.'),
  });

  const initialValues = { nome: '' };

  const onSubmit = async (values: { nome: string }) => {
    props.setIsLoading(true);

    try {
      const payload: Partial<ClassicPlan> = {
        ...{
          nome: '',
          periodizacaoFim: null,
          periodizacaoInicio: null,
          idPaciente: null,
          data: new Date().toISOString(),
          dataa: formatDateToYYYYMMDD(new Date()),
          tipoPlano: 1,
          visivel: 1,
          recordatorio: 0,
        },
        ...values,
      };

      if (selectedPlan) {
        const response = await api.patch('/plano_alimentar/' + selectedPlan.id, payload);
        updatePlan(response.data);
      } else {

        let url = '';

        if (selectedTemplate) url = '/plano_alimentar/clone/' + selectedTemplate.id
        else url = '/plano_alimentar'

        const response = await api.post(url, payload);
        addPlan(response.data);
        history("/app/modelo-plano-alimentar-classico/" + response.data.id);
      }

      props.setIsLoading(false);
      notify('Plano alimentar inserido com sucesso', 'Sucesso', 'prize');
      props.handleCloseModal();
      setSelectedTemplate(undefined);
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
      notify('Erro ao salvar plano alimentar', 'Erro', 'error-hexagon');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, setValues, values, touched, errors } = formik;

  const reset = useCallback(() => {
    setWeekDays([...weekDays]);
    resetForm();
    updatePlanConfigurations({
      nome: '',
    });
  }, [resetForm, setWeekDays, updatePlanConfigurations]);

  const notify = (message: string, title: string, icon: string, status?: string) =>
    toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  useEffect(() => {
    if (!selectedPlan && !selectedTemplate) return reset();
    else if (!selectedPlan) return;

    setValues({nome: selectedPlan.nome});

    const payload: Partial<createConfigurations> = {
      nome: selectedPlan.nome,
    };

    const selectedWeekDays = weekDays
      .map((day) => (selectedPlan.dias && selectedPlan.dias[0] && selectedPlan.dias[0][day] ? day : null))
      .filter((day) => day !== null) as string[];

    setWeekDays(selectedWeekDays);
    updatePlanConfigurations(payload);
  }, [setValues, reset, selectedPlan, setWeekDays, updatePlanConfigurations, selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate && !selectedPlan) return reset();
    if (!selectedTemplate) return;

    setValues({nome: selectedTemplate.nome});

    const payload: Partial<createConfigurations> = {
      nome: selectedTemplate.nome,
    };

    const selectedWeekDays = weekDays
      .map((day) => (selectedTemplate.dias && selectedTemplate.dias[0] && selectedTemplate.dias[0][day] ? day : null))
      .filter((day) => day !== null) as string[];

    setWeekDays(selectedWeekDays);
    updatePlanConfigurations(payload);
  }, [reset, selectedPlan, selectedTemplate, setValues, setWeekDays, updatePlanConfigurations])

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>Digite um nome para o plano alimentar</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />
        <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Nome do plano alimentar" />
        {errors.nome && touched.nome && <div className="error">{errors.nome}</div>}
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigClassicEatingPlan);
