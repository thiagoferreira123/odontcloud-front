import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { ProfessionalWebsiteFormValues } from '.';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';

type SpecialityRowProps = {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<string>) => void;
    };
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<ProfessionalWebsiteFormValues>>;
    values: ProfessionalWebsiteFormValues;
    touched: FormikTouched<ProfessionalWebsiteFormValues>;
    errors: FormikErrors<ProfessionalWebsiteFormValues>;
  };
  index: number;
  speciality: ProfessionalWebsiteSpeciality;
};

export interface ProfessionalWebsiteSpeciality {
  id?: string;
  specialityName: string;
  specialityDescription: string;
}

export default function SpecialityRow({ formik, index, speciality }: SpecialityRowProps) {
  const { handleChange, setFieldValue, touched, values, errors } = formik;

  const handleRemoveSpeciality = () => {
    setFieldValue(
      'specialities',
      values.specialities.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="mb-3">
      <div className="mb-2 top-label">
        <Form.Control type="text" name={`specialities[${index}].specialityName`} value={speciality.specialityName} onChange={handleChange} />
        <Form.Label>NOME</Form.Label>
        {errors.specialities &&
          errors.specialities[index] &&
          typeof errors.specialities[index] &&
          (errors.specialities[index] as FormikErrors<{ specialityName: string; time: string; quantity_ml: number }>).specialityName &&
          touched.specialities &&
          touched.specialities[index] &&
          touched.specialities[index].specialityName && (
            <div className="error">{(errors.specialities[index] as FormikErrors<{ specialityName: string; time: string; quantity_ml: number }>).specialityName}</div>
          )}
      </div>
      <div className="mb-2 top-label">
        <Form.Control as="textarea" rows={3} name={`specialities[${index}].specialityDescription`} value={speciality.specialityDescription} onChange={handleChange} />
        <Form.Label>DESCRIÇÃO</Form.Label>
        {errors.specialities &&
          errors.specialities[index] &&
          typeof errors.specialities[index] &&
          (errors.specialities[index] as FormikErrors<{ specialityDescription: string; time: string; quantity_ml: number }>).specialityDescription &&
          touched.specialities &&
          touched.specialities[index] &&
          touched.specialities[index].specialityDescription && (
            <div className="error">
              {(errors.specialities[index] as FormikErrors<{ specialityDescription: string; time: string; quantity_ml: number }>).specialityDescription}
            </div>
          )}

        {index ? (
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Remover um serviço prestado</Tooltip>}>
            <button onClick={handleRemoveSpeciality} className="btn btn-sm btn-icon btn-icon-only btn-primary m-1 position-absolute bottom-0 end-0" type="button">
              <CsLineIcons icon="bin" />
            </button>
          </OverlayTrigger>
        ) : (
          false
        )}
      </div>
    </div>
  );
}
