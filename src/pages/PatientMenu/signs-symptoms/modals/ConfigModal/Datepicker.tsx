import { ptBR } from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('pt-BR', ptBR);

interface DatepickerProps {
  name: string;
  value: Date;
  setFieldValue: (field: string, value: Date, shouldValidate?: boolean | undefined) => void;
}

const Datepicker = (props: DatepickerProps) => {
  const handleChange = (data: Date) => {
    props.setFieldValue('data', data);
  };

  return (
    <>
      <DatePicker className="form-control" placeholderText="Data" selected={props.value} onChange={handleChange} locale="pt-BR" dateFormat="dd/MM/yyyy" />
    </>
  );
};

export default Datepicker;
