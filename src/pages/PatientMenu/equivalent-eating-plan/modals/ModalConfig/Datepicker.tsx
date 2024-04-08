import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBr from 'date-fns/locale/pt-BR';
import useEquivalentEatingPlans from '../../hooks/equivalentPlanStore';
registerLocale('pt-BR', ptBr)

const Datepicker = (props: { field: string }) => {
  const selectedDate = useEquivalentEatingPlans((state) => state.createConfigurations[props.field]);
  const { updatePlanConfigurations } = useEquivalentEatingPlans();

  return (
    <DatePicker
      className="form-control"
      placeholderText="Data"
      selected={selectedDate as Date}
      onChange={(date: Date) => updatePlanConfigurations({ [props.field]: date })}
      locale="pt-BR"
      dateFormat="dd/MM/yyyy"
    />
  );
};

export default Datepicker;
