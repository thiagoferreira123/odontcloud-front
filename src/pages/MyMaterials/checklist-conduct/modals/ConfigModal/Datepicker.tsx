import { ptBR } from 'date-fns/locale/pt-BR';
import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('pt-BR', ptBR);

interface DatepickerProps {
  name: string;
  value: Date;
  setFieldValue: (field: string, value: Date, shouldValidate?: boolean | undefined) => void;
}

const Datepicker = (props: DatepickerProps) => {
  const handleChange = (creation_data: Date) => {
    props.setFieldValue('creation_data', creation_data);
  };

  return (
    <>
      <DatePicker className="form-control" placeholderText="Data" selected={props.value} onChange={handleChange} locale="pt-BR" dateFormat="dd/MM/yyyy" />
    </>
  );
};

export default Datepicker;
