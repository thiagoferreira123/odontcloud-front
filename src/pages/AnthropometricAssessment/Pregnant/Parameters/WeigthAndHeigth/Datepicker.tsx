import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParametersStore } from '../hooks';
import { parseDateToIso } from '../../../../../helpers/DateHelper';
import { ptBR } from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR)

const Datepicker = () => {
  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);
  const lastMenstruationDate = useParametersStore((state) => state.lastMenstruationDate);

  const { setLastMenstruationDate, updateData } = useParametersStore();

  const [value, setValue] = useState(lastMenstruationDate);

  const handleUpdateData = (date: Date) => {
    setValue(date);
    setLastMenstruationDate(date);
    updateData(apiAssessmentDataUrl, {
      dataUltMenstruacao: parseDateToIso(date),
    });
  }

  return (
    <DatePicker
      className="form-control"
      placeholderText="Data"
      selected={value}
      onChange={(date: Date) => handleUpdateData(date)}
      locale="pt-BR"
      dateFormat="dd/MM/yyyy"
    />
  );
};

export default Datepicker;
