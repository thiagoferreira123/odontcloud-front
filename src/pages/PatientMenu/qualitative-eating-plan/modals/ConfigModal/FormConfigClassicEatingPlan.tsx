import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useNavigate } from 'react-router-dom';
import { formatDateToYYYYMMDD } from '/src/services/useDateHelpers';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBr from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBr);

import 'react-toastify/dist/ReactToastify.css';
import usePatientMenuStore from '/src/pages/PatientMenu/hooks/patientMenuStore';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import useQualitativeEatingPlans from '../../hooks/eating-plan';
import { useQueryClient } from '@tanstack/react-query';
import { QualitativeEatingPlan } from '../../hooks/eating-plan/types';

const brWeekDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

interface FormValues {
  name: string;

  periodizationStart: Date | null;
  periodizationEnd: Date | null;
}

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
  const selectedQualitativeEatingPlan = useConfigModalStore((state) => state.selectedQualitativeEatingPlan);

  const [allSelected, setAllSelected] = useState(true);
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>(brWeekDays);

  const { updatePlan, addPlan } = useQualitativeEatingPlans();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Digite um nome valido.'),
    periodizationStart: Yup.date().nullable().max(Yup.ref('periodizationEnd'), 'Data de início deve ser anterior à data de fim.'),
    periodizationEnd: Yup.date().nullable().min(Yup.ref('periodizationStart'), 'Data de fim deve ser posterior à data de início.'),
  });

  const initialValues: FormValues = { name: '', periodizationEnd: null, periodizationStart: null };

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      const payload: Partial<QualitativeEatingPlan> = {
        ...{
          periodizationEnd: values.periodizationEnd ? formatDateToYYYYMMDD(values.periodizationEnd as Date) : null,
          periodizationStart: values.periodizationStart ? formatDateToYYYYMMDD(values.periodizationStart as Date) : null,
          patient_id: patientId,
          creationDate: new Date().toISOString(),
          sunday: selectedWeekDays.includes(brWeekDays[weekDays.indexOf("sunday")]) ? 1 : 0,
          monday: selectedWeekDays.includes(brWeekDays[weekDays.indexOf("monday")]) ? 1 : 0,
          tuesday: selectedWeekDays.includes(brWeekDays[weekDays.indexOf("tuesday")]) ? 1 : 0,
          wednesday: selectedWeekDays.includes(brWeekDays[weekDays.indexOf("wednesday")]) ? 1 : 0,
          thursday: selectedWeekDays.includes(brWeekDays[weekDays.indexOf("thursday")]) ? 1 : 0,
          friday: selectedWeekDays.includes(brWeekDays[weekDays.indexOf("friday")]) ? 1 : 0,
          saturday: selectedWeekDays.includes(brWeekDays[weekDays.indexOf("saturday")]) ? 1 : 0,
        },
        ...values,
      };

      if (selectedQualitativeEatingPlan) {
        await updatePlan({ ...selectedQualitativeEatingPlan, ...payload }, queryClient);
      } else {
        const id = await addPlan(payload, queryClient);
        history('/app/plano-alimentar-qualitativo/' + id);
      }

      props.setIsLoading(false);
      props.handleCloseModal();
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
    }
  };

  const selectAllDays = () => {
    setAllSelected(!allSelected);

    setSelectedWeekDays(!allSelected ? [...brWeekDays] : []);
  };

  const handleCheckbox = (val: string[]) => {
    if (weekDays.length === val.length) setAllSelected(true);
    else setAllSelected(false);
    setSelectedWeekDays(val);
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, setFieldValue, setValues, values, touched, errors } = formik;

  const reset = useCallback(() => {
    setSelectedWeekDays([...brWeekDays]);
    setAllSelected(true);
    resetForm();
    setValues({
      name: '',
      periodizationEnd: null,
      periodizationStart: null,
    });
  }, [resetForm, setValues]);

  useEffect(() => {
    if (!selectedQualitativeEatingPlan) return reset();

    setValues({
      name: selectedQualitativeEatingPlan.name,
      periodizationEnd: selectedQualitativeEatingPlan.periodizationEnd ? new Date(selectedQualitativeEatingPlan.periodizationEnd) : null,
      periodizationStart: selectedQualitativeEatingPlan.periodizationStart ? new Date(selectedQualitativeEatingPlan.periodizationStart) : null,
    });

    const selectedWeekDays = weekDays.filter((day) => (selectedQualitativeEatingPlan[day]));

    setAllSelected(selectedWeekDays.length === weekDays.length);

    setSelectedWeekDays(selectedWeekDays.map((day) => (brWeekDays[weekDays.indexOf(day)])));
    // updatePlanConfigurations(payload);
  }, [reset, selectedQualitativeEatingPlan, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>Esse é o nome que será exibido no app do paciente</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />
        <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Nome do plano alimentar" />
        {errors.name && touched.name && <div className="error">{errors.name}</div>}
      </div>

      <label>O plano alimentar deve ser realizado nos dias:</label>
      <div className="mt-2">
        <ToggleButton id="tbg-check-8" type="checkbox" variant="outline-primary mb-3" checked={allSelected} value={1} onChange={selectAllDays}>
          Todos os dias
        </ToggleButton>
      </div>
      <div className="d-flex">
        <ToggleButtonGroup type="checkbox" value={selectedWeekDays} className="mb-3" onChange={handleCheckbox}>
          {brWeekDays.map((day: string, index: number) => (
            <ToggleButton key={index} id={`tbg-check-${index + 1}`} value={brWeekDays[index]} variant="outline-primary">
              {day}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      <label>Periodização início (opcional)</label>
      <div className="mt-2 mb-3">
        <div className="filled">
          <CsLineIcons icon="calendar" />
          <DatePicker
            className="form-control"
            placeholderText="Data"
            selected={values.periodizationStart}
            onChange={(periodizationStart: Date) => {
              setFieldValue('periodizationStart', periodizationStart);
            }}
            locale="pt-BR"
            dateFormat="dd/MM/yyyy"
          />
          {errors.periodizationStart && touched.periodizationStart && <div className="error">{String(errors.periodizationStart)}</div>}
        </div>
      </div>
      <label>Periodização final</label>
      <div className="mt-2">
        <div className="filled">
          <CsLineIcons icon="calendar" />
          <DatePicker
            className="form-control"
            placeholderText="Data"
            selected={values.periodizationEnd}
            onChange={(periodizationEnd: Date) => {
              setFieldValue('periodizationEnd', periodizationEnd);
            }}
            locale="pt-BR"
            dateFormat="dd/MM/yyyy"
          />
          {errors.periodizationEnd && touched.periodizationEnd && <div className="error">{String(errors.periodizationEnd)}</div>}
        </div>
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigClassicEatingPlan);
