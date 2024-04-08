import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { ProfessionalWebsiteFormValues } from '.';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';

type ServiceRowProps = {
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
  service: ProfessionalWebsiteService;
};

export interface ProfessionalWebsiteService {
  id?: string;
  serviceName: string;
  serviceDescription: string;
}

export default function ServiceRow({ formik, index, service }: ServiceRowProps) {
  const { handleChange, setFieldValue, touched, values, errors } = formik;

  const handleRemoveService = () => {
    setFieldValue(
      'services',
      values.services.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="mb-3">
      <div className="mb-2 top-label">
        <Form.Control type="text" name={`services[${index}].serviceName`} value={service.serviceName} onChange={handleChange} />
        <Form.Label>NOME</Form.Label>
        {errors.services &&
          errors.services[index] &&
          typeof errors.services[index] &&
          (errors.services[index] as FormikErrors<{ serviceName: string; time: string; quantity_ml: number }>).serviceName &&
          touched.services &&
          touched.services[index] &&
          touched.services[index].serviceName && (
            <div className="error">{(errors.services[index] as FormikErrors<{ serviceName: string; time: string; quantity_ml: number }>).serviceName}</div>
          )}
      </div>
      <div className="mb-2 top-label">
        <Form.Control as="textarea" rows={3} name={`services[${index}].serviceDescription`} value={service.serviceDescription} onChange={handleChange} />
        <Form.Label>DESCRIÇÃO</Form.Label>
        {errors.services &&
          errors.services[index] &&
          typeof errors.services[index] &&
          (errors.services[index] as FormikErrors<{ serviceDescription: string; time: string; quantity_ml: number }>).serviceDescription &&
          touched.services &&
          touched.services[index] &&
          touched.services[index].serviceDescription && (
            <div className="error">
              {(errors.services[index] as FormikErrors<{ serviceDescription: string; time: string; quantity_ml: number }>).serviceDescription}
            </div>
          )}

        {index ? (
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Remover um serviço prestado</Tooltip>}>
            <button onClick={handleRemoveService} className="btn btn-sm btn-icon btn-icon-only btn-primary m-1 position-absolute bottom-0 end-0" type="button">
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
