import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBr from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBr);

interface DatepickerProps {
  name: string;
  value: Date;
  // eslint-disable-next-line no-unused-vars
  setValues: (
    // eslint-disable-next-line no-unused-vars
    values: React.SetStateAction<{
      requestDate: Date;
    }>
  ) => void;
}

const Datepicker = (props: DatepickerProps) => {
  const handleChange = (requestDate: Date) => {
    props.setValues({requestDate});
  };

  return (
    <>
      <DatePicker className="form-control" placeholderText="Data" selected={props.value} onChange={handleChange} locale="pt-BR" dateFormat="dd/MM/yyyy" />
    </>
  );
};

export default Datepicker;
