import { Form } from 'react-bootstrap';
import { FormEventModel } from '../../hooks';
import { FormikErrors, FormikTouched } from 'formik';
import { useEffect, useState } from 'react';
import { Option } from '../../../../types/inputs';
import Select from 'react-select';
import { useAuth } from '../../../Auth/Login/hook';
import useProfessionalStore from '../../../MySettings/hooks/ProfessionalStore';
import { AppException } from '../../../../helpers/ErrorHelpers';
import { notify } from '../../../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../../components/loading/StaticLoading';

type ProfessionalSelectProps = {
  formik: {
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: FormEventModel;
    errors: FormikErrors<FormEventModel>;
    touched: FormikTouched<FormEventModel>;
  };
};

const ProfessionalSelect = ({ formik }: ProfessionalSelectProps) => {
  const [value, setValue] = useState<Option>();

  const user = useAuth((state) => state.user);

  const { setFieldValue, values, touched, errors } = formik;
  const { getProfessionals } = useProfessionalStore();

  const getProfessionals_ = async () => {
    try {
      if (!user) throw new AppException('Usuário não encontrado');

      const response = await getProfessionals(user.clinic_id);

      if (response === false) throw new Error('Erro ao buscar profissionais');

      return response;
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const handleChange = (option: Option) => {
    setFieldValue('calendar_professional_id', option?.value ?? '');
  };

  const result = useQuery({ queryKey: ['professionals'], queryFn: getProfessionals_, enabled: !!user?.clinic_id });

  const options =
    result.data?.map((professional) => ({
      label: professional.professional_full_name,
      value: professional.professional_id ?? '',
    })) ?? [];

  useEffect(() => {
    setValue(options.find((option) => option.value === values.calendar_professional_id));
  }, [values.calendar_professional_id]);

  if (result.isLoading) return <StaticLoading />;

  return (
    <div className="mb-3 top-label">
      <Select
        options={options}
        value={value}
        onChange={(e) => handleChange(e as Option)}
        isClearable
        id="calendar_professional_id"
        name="calendar_professional_id"
        classNamePrefix="react-select"
        placeholder="Selecione o profissional"
      />
      <Form.Label>PROFISSIONAL</Form.Label>
      {errors.calendar_professional_id && touched.calendar_professional_id && <div className="error">{errors.calendar_professional_id}</div>}
    </div>
  );
};

export default ProfessionalSelect;
