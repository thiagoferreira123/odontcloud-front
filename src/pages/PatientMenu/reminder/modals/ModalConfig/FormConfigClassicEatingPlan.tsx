import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import useClassicPlans from '../../hooks/useClassicPlans';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usePatientMenuStore from '../../../hooks/patientMenuStore';
import { ClassicPlan, WeekDays, createConfigurations } from '../../../../../types/PlanoAlimentarClassico';
import { formatDateToYYYYMMDD } from '../../../../../services/useDateHelpers';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../../../../services/useAxios';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import { notify } from '../../../../../components/toast/NotificationIcon';

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
  const queryClient = useQueryClient();

  const patientId = usePatientMenuStore((state) => state.patientId);
  const selectedWeekDays = useClassicPlans((state) => state.weekDays);
  const selectedPlan = useClassicPlans((state) => state.selectedPlan);

  const [allSelected, setAllSelected] = React.useState(true);

  const { setWeekDays, updatePlanConfigurations, updatePlan, addPlan } = useClassicPlans();

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Digite um nome valido.'),
    dataInicio: Yup.date().max(Yup.ref('dataFim'), 'Data de início deve ser anterior à data de fim.'),
    dataFim: Yup.date().min(Yup.ref('dataInicio'), 'Data de fim deve ser posterior à data de início.'),
  });

  const initialValues = { nome: '' };

  const onSubmit = async (values: { nome: string }) => {
    props.setIsLoading(true);

    try {
      const parsedWeekDays: WeekDays = {
        id: selectedPlan && selectedPlan.dias?.length ? selectedPlan.dias[0].id : undefined,
        dom: selectedWeekDays.includes('dom') ? 1 : 0,
        seg: selectedWeekDays.includes('seg') ? 1 : 0,
        ter: selectedWeekDays.includes('ter') ? 1 : 0,
        qua: selectedWeekDays.includes('qua') ? 1 : 0,
        qui: selectedWeekDays.includes('qui') ? 1 : 0,
        sex: selectedWeekDays.includes('sex') ? 1 : 0,
        sab: selectedWeekDays.includes('sab') ? 1 : 0,
      };

      const payload: Partial<ClassicPlan> = {
        periodizacaoFim: null,
        periodizacaoInicio: null,
        idPaciente: Number(patientId),
        data: new Date().toISOString(),
        dataa: formatDateToYYYYMMDD(new Date()),
        tipoPlano: 0,
        visivel: 1,
        recordatorio: 1,
        dias: [parsedWeekDays],
        ...values,
      };

      if (selectedPlan) {
        await updatePlan({...payload, id: selectedPlan.id}, queryClient);
        notify('Recordatório atualizado com sucesso', 'Sucesso', 'prize');
      } else {
        const response = await api.post('/plano_alimentar', payload);
        addPlan(response.data, queryClient);
        history('/app/recordatorio/' + response.data.id);
        notify('Recordatório inserido com sucesso', 'Sucesso', 'prize');
      }

      props.setIsLoading(false);
      props.handleCloseModal();
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
      notify('Erro ao salvar plano alimentar', 'Erro', 'error-hexagon', 'danger');
    }
  };

  const selectAllDays = () => {
    setAllSelected(!allSelected);

    setWeekDays(!allSelected ? [...weekDays] : []);
  };

  const handleCheckbox = (val: string[]) => {
    if (weekDays.length === val.length) setAllSelected(true);
    else setAllSelected(false);
    setWeekDays(val);
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, setValues, values, touched, errors } = formik;

  const reset = useCallback(() => {
    setWeekDays([...weekDays]);
    setAllSelected(true);
    resetForm();
    updatePlanConfigurations({
      nome: '',
    });
  }, [resetForm, setWeekDays, updatePlanConfigurations]);

  useEffect(() => {
    if (!selectedPlan) return;

    setValues({ nome: selectedPlan.nome });

    const payload: Partial<createConfigurations> = {
      nome: selectedPlan.nome,
    };

    const selectedWeekDays = weekDays
      .map((day) => (selectedPlan.dias && selectedPlan.dias[0] && selectedPlan.dias[0][day] ? day : null))
      .filter((day) => day !== null) as string[];

    setAllSelected(selectedWeekDays.length === weekDays.length);

    setWeekDays(selectedWeekDays);
    updatePlanConfigurations(payload);
  }, [setValues, reset, selectedPlan, setWeekDays, updatePlanConfigurations]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>Esse é o nome que será exibido no app do paciente</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />
        <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Nome do plano alimentar" />
        {errors.nome && touched.nome && <div className="error">{errors.nome}</div>}
      </div>
      <label>O plano alimentar deve ser realizado nos dias:</label>
      <div className="mt-2">
        <ToggleButton id="tbg-check-8" type="checkbox" variant="outline-primary mb-3" checked={allSelected} value={1} onChange={selectAllDays}>
          Todos os dias
        </ToggleButton>
      </div>
      <div className="d-flex">
        <ToggleButtonGroup type="checkbox" value={selectedWeekDays} className="mb-3" onChange={handleCheckbox}>
          {weekDays.map((day: string, index: number) => (
            <ToggleButton key={index} id={`tbg-check-${index + 1}`} value={weekDays[index]} variant="outline-primary">
              {day}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigClassicEatingPlan);
