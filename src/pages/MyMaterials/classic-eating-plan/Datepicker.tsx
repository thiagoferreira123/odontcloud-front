import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useClassicPlans from './hooks/useClassicPlans';
import ptBr from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBr)

const Datepicker = (props: { field: string }) => {
  const selectedDate = useClassicPlans((state) => state.createConfigurations[props.field]);
  const { updatePlanConfigurations } = useClassicPlans();

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
