import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useNavigate } from "react-router-dom";
import { WeekDays, createConfigurations } from '/src/types/PlanoAlimentarClassico';
import { convertToDate, formatDateToYYYYMMDD } from '/src/services/useDateHelpers';
import api from '/src/services/useAxios';

import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useEquivalentEatingPlans from '../../hooks/equivalentPlanStore';
import usePatientMenuStore from '/src/pages/PatientMenu/hooks/patientMenuStore';
import Datepicker from './Datepicker';
import { EquivalentEatingPlan } from '/src/types/PlanoAlimentarEquivalente';

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

  const createConfigurations = useEquivalentEatingPlans((state) => state.createConfigurations);
  const patientId = usePatientMenuStore((state) => state.patientId);
  const selectedWeekDays = useEquivalentEatingPlans((state) => state.weekDays);
  const selectedPlan = useEquivalentEatingPlans((state) => state.selectedPlan);
  const selectedTemplate = useEquivalentEatingPlans((state) => state.selectedTemplate);

  const [allSelected, setAllSelected] = React.useState(true);

  const { setWeekDays, updatePlanConfigurations, updatePlan, addPlan, setSelectedTemplate } = useEquivalentEatingPlans();

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

      const payload: Partial<EquivalentEatingPlan> = {
        ...{
          nome: '',
          periodizacaoFim: createConfigurations.periodizacaoFim ? formatDateToYYYYMMDD(createConfigurations.periodizacaoFim as Date) : null,
          periodizacaoInicio: createConfigurations.periodizacaoInicio ? formatDateToYYYYMMDD(createConfigurations.periodizacaoInicio as Date) : null,
          idPaciente: Number(patientId),
          data: new Date().toISOString(),
          dataa: formatDateToYYYYMMDD(new Date()),
          tipoPlano: 0,
          visivel: 1,
          favorito: false,
          recordatorio: 0,
          dias: [parsedWeekDays],
        },
        ...values,
      };

      if (selectedPlan) {
        const response = await api.patch('/plano-alimentar-equivalente-historico/' + selectedPlan.id, payload);
        updatePlan(response.data);
        notify('Plano alimentar atualizado com sucesso', 'Sucesso', 'prize');
      } else {

        let url = '';

        if (selectedTemplate) url = '/plano-alimentar-equivalente-historico/clone/' + selectedTemplate.id
        else url = '/plano-alimentar-equivalente-historico'

        const response = await api.post(url, payload);
        addPlan(response.data);
        history("/app/plano-alimentar-equivalente/" + response.data.id);
        notify('Plano alimentar inserido com sucesso', 'Sucesso', 'prize');
      }

      props.setIsLoading(false);
      props.handleCloseModal();
      setSelectedTemplate(undefined);
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
      notify('Erro ao salvar plano alimentar', 'Erro', 'error-hexagon');
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
      periodizacaoFim: '',
      periodizacaoInicio: '',
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
    payload.periodizacaoFim = selectedPlan.periodizacaoFim ? convertToDate(selectedPlan.periodizacaoFim) : undefined;
    payload.periodizacaoInicio = selectedPlan.periodizacaoInicio ? convertToDate(selectedPlan.periodizacaoInicio) : undefined;

    const selectedWeekDays = weekDays
      .map((day) => (selectedPlan.dias && selectedPlan.dias[0] && selectedPlan.dias[0][day] ? day : null))
      .filter((day) => day !== null) as string[];

    setAllSelected(selectedWeekDays.length === weekDays.length);

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
    payload.periodizacaoFim = selectedTemplate.periodizacaoFim ? convertToDate(selectedTemplate.periodizacaoFim) : undefined;
    payload.periodizacaoInicio = selectedTemplate.periodizacaoInicio ? convertToDate(selectedTemplate.periodizacaoInicio) : undefined;

    const selectedWeekDays = weekDays
      .map((day) => (selectedTemplate.dias && selectedTemplate.dias[0] && selectedTemplate.dias[0][day] ? day : null))
      .filter((day) => day !== null) as string[];

    setAllSelected(selectedWeekDays.length === weekDays.length);

    setWeekDays(selectedWeekDays);
    updatePlanConfigurations(payload);
  }, [reset, selectedPlan, selectedTemplate, setValues, setWeekDays, updatePlanConfigurations])

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
      <label>Periodização início (opcional)</label>
      <div className="mt-2 mb-3">
        <div className="filled">
          <CsLineIcons icon="calendar" />
          <Datepicker field="periodizacaoInicio" />
        </div>
      </div>
      <label>Periodização final</label>
      <div className="mt-2">
        <div className="filled">
          <CsLineIcons icon="calendar" />
          <Datepicker field="periodizacaoFim" />
        </div>
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigClassicEatingPlan);
