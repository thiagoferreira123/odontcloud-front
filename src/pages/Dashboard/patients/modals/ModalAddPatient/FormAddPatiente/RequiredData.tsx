import { FormikErrors, FormikTouched } from 'formik';
import React, { useEffect, useState } from 'react';
import { useServiceLocationStore } from '../../../../../../hooks/professional/ServiceLocationStore';
import { Option } from '../../../../../../types/inputs';
import { ReasonForConsultation } from '../../../../../../types/Patient';
import api from '../../../../../../services/useAxios';
import { useQuery } from '@tanstack/react-query';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';
import { Form } from 'react-bootstrap';
import { FormikValues } from '.';
import StaticLoading from '../../../../../../components/loading/StaticLoading';
import Select, { SingleValue } from 'react-select';
import { PatternFormat } from 'react-number-format';
import { useModalAddPatientStore } from '../../../hooks/ModalAddPatientStore';

interface RequiredDataProps {
  formik: {
    handleChange: {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
      (e: React.ChangeEvent<any>): void;
      // eslint-disable-next-line no-unused-vars
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    // eslint-disable-next-line no-unused-vars
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    // eslint-disable-next-line no-unused-vars
    setValues: (values: React.SetStateAction<FormikValues>, shouldValidate?: boolean) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    values: FormikValues;
    errors: FormikErrors<FormikValues>;
    touched: FormikTouched<FormikValues>;
  };
}

export const genders = [
  { value: '0', label: 'Feminino' },
  { value: '1', label: 'Masculino' },
]

export default function RequiredData(props: RequiredDataProps) {
  const { handleChange, values, touched, errors, setFieldValue } = props.formik;

  const { getServiceLocations } = useServiceLocationStore();

  const [selectSex, setSelectSex] = useState<Option>();
  const [selectedLocal, setSelectedLocal] = useState<Option>();
  const [selectedReasonForConsultation, setSelectedReasonForConsultation] = useState<Option>();

  const selectedPatient = useModalAddPatientStore((state) => state.selectedPatient);

  const selectOnChangeLocal = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setFieldValue('consultationLocation', selectedOption.value);
      setSelectedLocal(selectedOption);
    }
  };
  const selectOnChangeReasonForConsultation = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setFieldValue('reasonForConsultation', selectedOption.value);
      setSelectedReasonForConsultation(selectedOption);
    }
  };

  const selectOnChangeSex = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setFieldValue('gender', selectedOption.value);
      setSelectSex(selectedOption);
    }
  };

  const getServiceLocations_ = async () => {
    try {
      const response = await getServiceLocations();

      if (response === false) throw new Error('Error on get service locations');

      return response;
    } catch (error) {
      console.error('Error on get service locations', error);
      throw error;
    }
  };

  const getReasonForConsultation_ = async () => {
    try {
      const { data } = await api.get<ReasonForConsultation[]>('/tipos-de-tratamento');

      return data ?? false;
    } catch (error) {
      console.error('Error on get service locations', error);
      throw error;
    }
  };

  const resultLocals = useQuery({ queryKey: ['locals'], queryFn: getServiceLocations_ });
  const resultReasons = useQuery({ queryKey: ['reasons-for-consultation'], queryFn: getReasonForConsultation_ });


  useEffect(() => {
    if(resultLocals.data && resultLocals.data.length && selectedPatient?.consultationLocation) {
      const local = resultLocals.data.find((local) => local.id === selectedPatient?.consultationLocation);
      local && setSelectedLocal({ label: local.nome, value: local.id.toString() });
    }

    if(resultReasons.data && resultReasons.data.length && selectedPatient?.reasonForConsultation) {
      const reason = resultReasons.data.find((reason) => reason.descricao === selectedPatient?.reasonForConsultation);
      reason && setSelectedReasonForConsultation({ label: reason.descricao, value: reason.descricao });
    }

    if(genders && genders.length && selectedPatient?.gender != null) {
      const gender = genders.find((gender) => gender.value == String(selectedPatient?.gender));
      gender && setSelectSex(gender);
    }

  }, [resultLocals.data, resultReasons.data, selectedPatient?.consultationLocation, selectedPatient?.gender, selectedPatient?.reasonForConsultation]);

  return (
    <>
      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Nome completo" />
        {errors.name && touched.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="email" />
        <Form.Control type="text" name="email" value={values.email} onChange={handleChange} placeholder="Email" />
        {errors.email && touched.email && <div className="error">{errors.email}</div>}
      </div>

      {resultLocals.isLoading ? (
        <StaticLoading />
      ) : (
        <div className="mb-3 filled">
          <CsLineIcons icon="pin" />
          <Select
            classNamePrefix="react-select"
            name="consultationLocation"
            options={resultLocals.data?.map((local) => ({ value: local.id.toString(), label: local.nome } as Option))}
            value={selectedLocal}
            onChange={selectOnChangeLocal}
            placeholder="Local de atendimento"
          />
          {errors.consultationLocation && touched.consultationLocation && <div className="error">{errors.consultationLocation}</div>}
        </div>
      )}

      {resultReasons.isLoading ? (
        <StaticLoading />
      ) : (
        <div className="mb-3 filled">
          <CsLineIcons icon="health" />
          <Select
            classNamePrefix="react-select"
            name="reasonForConsultation"
            options={resultReasons.data?.map((local) => ({ value: local.descricao, label: local.descricao } as Option))}
            value={selectedReasonForConsultation}
            onChange={selectOnChangeReasonForConsultation}
            placeholder="Motivo da consulta"
          />
          {errors.reasonForConsultation && touched.reasonForConsultation && <div className="error">{errors.reasonForConsultation}</div>}
        </div>
      )}

      <div className="mb-3 filled">
        <CsLineIcons icon="gender" />
        <Select
          classNamePrefix="react-select"
          name="gender"
          options={genders}
          value={selectSex}
          onChange={selectOnChangeSex}
          placeholder="Sexo"
        />
        {errors.gender && touched.gender && <div className="error">{errors.gender}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="calendar" />
        <PatternFormat
          className="form-control"
          name="dateOfBirth"
          format="##/##/####"
          mask="_"
          placeholder="DD/MM/YYYY"
          allowemptyformatting="true"
          value={values.dateOfBirth}
          onChange={handleChange}
        />
        {errors.dateOfBirth && touched.dateOfBirth && <div className="error">{errors.dateOfBirth}</div>}
      </div>
    </>
  );
}
