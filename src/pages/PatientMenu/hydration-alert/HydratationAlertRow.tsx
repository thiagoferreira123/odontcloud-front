import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { HydratationAlertValues } from '.';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { SingleValue } from 'react-select';
import { Option } from '../../../types/inputs';
import { PatternFormat } from 'react-number-format';
import useHydrationAlertStore from './hooks/HydrationAlertDetailsStore';
import { useAuth } from '../../Auth/Login/hook';
import { useParams } from 'react-router-dom';

type HydratationAlertRowProps = {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<string>) => void;
    };
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) =>
      | Promise<void>
      | Promise<
          FormikErrors<{
            timeZone: null;
            alerts: {
              message: string;
              time: string;
              quantity_ml: number;
            }[];
          }>
        >;
    values: {
      timeZone: SingleValue<Option> | null;
      alerts: {
        message: string;
        time: string;
        quantity_ml: number;
      }[];
    };
    touched: FormikTouched<{
      timeZone: SingleValue<Option> | null;
      alerts: {
        message: string;
        time: string;
        quantity_ml: number;
      }[];
    }>;
    errors: FormikErrors<{
      timeZone: SingleValue<Option> | null;
      alerts: {
        message: string;
        time: string;
        quantity_ml: number;
      }[];
    }>;
  };
  index: number;
  alert: HydratationAlertValues;
};

export default function HydratationAlertRow({ formik, index, alert }: HydratationAlertRowProps) {
  const { id } = useParams<{ id: string }>();
  const user = useAuth((state) => state.user);
  const { removeHydrationAlert } = useHydrationAlertStore();
  const { handleChange, setFieldValue, touched, errors, values } = formik;

  const handleRemoveAlert = () => {
    console.log(user?.token, alert.id, id);

    user?.token && alert.id && id && removeHydrationAlert([alert.id], user.token);

    setFieldValue(
      'alerts',
      values.alerts.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="d-flex align-items-center">
      <Col md={7} className="mb-3 top-label me-2">
        <Form.Control type="text" name={`alerts[${index}].message`} value={alert.message} onChange={handleChange} readOnly={alert.id ? true : undefined} />
        <Form.Label>MENSAGEM DO ALERTA</Form.Label>
        {errors.alerts &&
          errors.alerts[index] &&
          typeof errors.alerts[index] &&
          (errors.alerts[index] as FormikErrors<{ message: string; time: string; quantity_ml: number }>).message &&
          touched.alerts &&
          touched.alerts[index] &&
          touched.alerts[index].message && (
            <div className="error">{(errors.alerts[index] as FormikErrors<{ message: string; time: string; quantity_ml: number }>).message}</div>
          )}
      </Col>

      <Col md={2} className="mb-3 top-label me-2">
        <PatternFormat
          className="form-control"
          format="##:##"
          mask="_"
          placeholder="HH:MM"
          name={`alerts[${index}].time`}
          value={alert.time}
          onChange={handleChange}
          readOnly={alert.id ? true : undefined}
        />
        <Form.Label>HORÁRIO</Form.Label>
        {errors.alerts &&
          errors.alerts[index] &&
          (errors.alerts[index] as FormikErrors<{ message: string; time: string; quantity_ml: number }>).time &&
          touched.alerts &&
          touched.alerts[index] &&
          touched.alerts[index].time && (
            <div className="error" style={{ top: '-60px' }}>
              {(errors.alerts[index] as FormikErrors<{ message: string; time: string; quantity_ml: number }>).time}
            </div>
          )}
      </Col>

      <Col md={2} className="mb-3 top-label me-2 position-relative">
        <Form.Control
          type="text"
          name={`alerts[${index}].quantity_ml`}
          value={Number(alert.quantity_ml) ? Number(alert.quantity_ml) : ''}
          onChange={(event) =>
            setFieldValue(
              `alerts[${index}].quantity_ml`,
              Number(event.target.value) ? Number(event.target.value) : Number(alert.quantity_ml) ? Number(alert.quantity_ml) : ''
            )
          }
          readOnly={alert.id ? true : undefined}
        />
        <Form.Label>QUANTIDADE EM ML</Form.Label>
        {errors.alerts &&
          errors.alerts[index] &&
          (errors.alerts[index] as FormikErrors<{ message: string; time: string; quantity_ml: number }>).quantity_ml &&
          touched.alerts &&
          touched.alerts[index] &&
          touched.alerts[index].quantity_ml && (
            <div className="error" style={{ top: '-86px' }}>
              {(errors.alerts[index] as FormikErrors<{ message: string; time: string; quantity_ml: number }>).quantity_ml}
            </div>
          )}
      </Col>

      <Col md={1} className="mb-3 top-label">
        <Button variant="outline-primary" className="btn-icon btn-icon-only mb-1" onClick={handleRemoveAlert}>
          <CsLineIcons icon="bin" />
        </Button>{' '}
      </Col>
    </div>
  );
}
