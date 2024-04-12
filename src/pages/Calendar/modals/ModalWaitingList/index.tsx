import classNames from 'classnames';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { useCalendarStore } from '../../hooks';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import Select from '../../../../components/Select';
import { useFormik } from 'formik';
import { SingleValue } from 'react-select';
import { appointmentOptions } from '../../../../types/Events';
import * as yup from 'yup';
import { Option } from '../../../../types/inputs';
import PacientSelect from '../ModalAddEdit/PacientSelect';
import useWaitingListStore from '../../hooks/WaitingListStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppException } from '../../../../helpers/ErrorHelpers';
import { notify } from '../../../../components/toast/NotificationIcon';
import { WaitingList } from '../../hooks/WaitingListStore/types';
import { useModalWaitingListStore } from '../../hooks/modals/ModalWaitingListStore';
import { useModalAddEditStore } from '../../hooks/modals/ModalAddEditStore';
import usePatientStore from '../../../Dashboard/patients/hooks/PatientStore';
import { ScheduleType } from '../../hooks/ScheduleStore/types';
import InsuranciesSelect from './InsuranciesSelect';
import Empty from '../../../../components/Empty';

export interface ModalWaitingListFormValues {
  calendar_waiting_list_patient_name: Option | null;
  calendar_waiting_list_email: string;
  calendar_waiting_list_contact: string;
  calendar_waiting_list_health_insurance: string;
  calendar_waiting_list_appointment_type: SingleValue<{ value: ScheduleType; label: string }>;
  calendar_waiting_list_observation: string;
}

const initialValues: ModalWaitingListFormValues = {
  calendar_waiting_list_patient_name: null,
  calendar_waiting_list_health_insurance: '',
  calendar_waiting_list_appointment_type: null,
  calendar_waiting_list_contact: '',
  calendar_waiting_list_email: '',
  calendar_waiting_list_observation: '',
};

const validationSchema = yup.object({
  calendar_waiting_list_patient_name: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable()
    .required('Selecione um paciente'),
  calendar_waiting_list_health_insurance: yup.string().notRequired(),
  calendar_waiting_list_appointment_type: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable()
    .required('Selecione um tipo de consulta'),
  calendar_waiting_list_contact: yup.string().notRequired(),
  calendar_waiting_list_email: yup.string().notRequired(),
  calendar_waiting_list_observation: yup.string().nullable().notRequired(),
});

const ModalWaitingList = () => {
  const queryClient = useQueryClient();
  const showModal = useModalWaitingListStore((state) => state.showModal);
  const { selectedLocal, setEvent } = useCalendarStore((state) => state);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { getWaitingList, removeWaitingList, addWaitingList } = useWaitingListStore();
  const { getPatients } = usePatientStore();
  const { hideModal } = useModalWaitingListStore();
  const { openModalAddEdit } = useModalAddEditStore();

  const onSubmit = async (values: ModalWaitingListFormValues) => {
    try {
      setIsSaving(true);
      const { calendar_waiting_list_patient_name, calendar_waiting_list_health_insurance, calendar_waiting_list_appointment_type, ...rest } = values;
      const payload = {
        ...rest,
        calendar_waiting_list_patient_name: calendar_waiting_list_patient_name?.label,
        calendar_waiting_list_appointment_type: calendar_waiting_list_appointment_type?.value,
        calendar_waiting_list_health_insurance,
        calendar_waiting_list_professional_id: selectedLocal?.profissional,
        calendar_waiting_list_location_id: selectedLocal?.id,
        calendar_waiting_list_secretary_id: 0,
        calendar_waiting_list_contact: values.calendar_waiting_list_contact ? values.calendar_waiting_list_contact : undefined,
        dataEntradaLista: new Date().toISOString(),
      };

      const response = await addWaitingList(payload, queryClient);

      if (response === false) throw new Error('Could not add waiting list');

      resetForm();
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const getWaitingList_ = async () => {
    try {
      const result = await getWaitingList();

      if (result === false) throw new Error('Could not get histories');

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const getPatients_ = async () => {
    try {
      const result = await getPatients();

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const { values, errors, touched, resetForm, handleChange, setFieldValue, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const result = useQuery({ queryKey: ['waiting-list'], queryFn: getWaitingList_ });
  const patientsResult = useQuery({ queryKey: ['patients'], queryFn: getPatients_ });

  const handleSelectChange = (value: any, field: string) => {
    setFieldValue(field, value);
  };

  const handlePatientChange = (option: Option | null) => {
    if (!option) {
      return handleSelectChange(option, 'calendar_waiting_list_patient_name');
    }

    const found = patientsResult.data?.find((patient) => patient.patient_id && patient.patient_id === option.value);

    if (found) {
      setFieldValue('calendar_waiting_list_email', found.patient_email || '');
      setFieldValue('calendar_waiting_list_contact', found.patient_phone || '');
    }
    handleSelectChange(option, 'calendar_waiting_list_patient_name');
  };

  const handleAddEvent = (waiting: WaitingList) => {
    const calendar_type_found = appointmentOptions.find((appointment) => appointment.value === waiting.calendar_waiting_list_appointment_type);

    setEvent({
      calendar_name: { label: waiting.calendar_waiting_list_patient_name, value: '0' },
      calendar_email: waiting.calendar_waiting_list_email,
      calendar_phone: waiting.calendar_waiting_list_contact,
      calendar_medical_insurance: waiting.calendar_waiting_list_health_insurance,
      calendar_observation: waiting.calendar_waiting_list_observation,
      calendar_type: calendar_type_found
        ? ({ label: calendar_type_found.label, value: calendar_type_found.value } as unknown as SingleValue<{ value: ScheduleType; label: string }>)
        : null,
    });
    hideModal();
    openModalAddEdit();
  };

  const handleDeleteWaitingList = async (item: WaitingList) => {
    try {
      setIsDeleting(true);
      const response = await removeWaitingList(item, queryClient);

      if (!response) throw new Error('Could not delete waiting list');

      setIsDeleting(false);
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!showModal) {
      resetForm();
    }
  }, [showModal, resetForm]);

  const isWaitingListLoading = isDeleting || result.isLoading;

  if (!showModal) return null;

  return (
    <Modal className="modal-close-out" size="xl" show={showModal} onHide={hideModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Lista de espera</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6} className="border-end">
            <Form onSubmit={handleSubmit}>
              <div className="mb-3 top-label">
                <PacientSelect value={values.calendar_waiting_list_patient_name} onChange={(opt) => handlePatientChange(opt as Option)} />
                {errors.calendar_waiting_list_patient_name && touched.calendar_waiting_list_patient_name && (
                  <div className="error">{errors.calendar_waiting_list_patient_name.toString()}</div>
                )}
              </div>
              <div className="mb-3 top-label">
                <Form.Control
                  name="calendar_waiting_list_email"
                  id="calendar_waiting_list_email"
                  value={values.calendar_waiting_list_email}
                  onChange={handleChange}
                  type="text"
                />
                <Form.Label>EMAIL</Form.Label>
                {errors.calendar_waiting_list_email && touched.calendar_waiting_list_email && <div className="error">{errors.calendar_waiting_list_email}</div>}
              </div>
              <div className="mb-3 top-label">
                <Form.Control
                  name="calendar_waiting_list_contact"
                  id="calendar_waiting_list_contact"
                  value={values.calendar_waiting_list_contact}
                  onChange={handleChange}
                  type="text"
                />
                <Form.Label>TELEFONE</Form.Label>
                {errors.calendar_waiting_list_contact && touched.calendar_waiting_list_contact && (
                  <div className="error">{errors.calendar_waiting_list_contact}</div>
                )}
              </div>
              <div className="mb-3 top-label">
                <InsuranciesSelect formik={{ setFieldValue, values, errors, touched }} />
                {errors.calendar_waiting_list_health_insurance && touched.calendar_waiting_list_health_insurance && (
                  <div className="error">{errors.calendar_waiting_list_health_insurance}</div>
                )}
              </div>
              <div className="mb-3 top-label position-relative">
                <Select
                  id="calendar_waiting_list_appointment_type"
                  name="calendar_waiting_list_appointment_type"
                  value={values.calendar_waiting_list_appointment_type}
                  onChange={(value) => handleSelectChange(value, 'calendar_waiting_list_appointment_type')}
                  options={appointmentOptions}
                />
                <span>TIPO DE AGENDAMENTO</span>
                {errors.calendar_waiting_list_appointment_type && touched.calendar_waiting_list_appointment_type && (
                  <div className="error">{errors.calendar_waiting_list_appointment_type}</div>
                )}
              </div>
              <div className="mb-3 top-label">
                <Form.Control
                  name="calendar_waiting_list_observation"
                  id="calendar_waiting_list_observation"
                  value={values.calendar_waiting_list_observation}
                  onChange={handleChange}
                  as="textarea"
                  rows={3}
                />
                <Form.Label>ANOTAÇÕES</Form.Label>
              </div>
              <div className="text-center">
                <Button disabled={isSaving} className="btn-icon btn-icon-start" type="submit">
                  {isSaving ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <>
                      <CsLineIcons icon="plus" /> <span>Cadastrar na lista</span>
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Col>

          <Col md={6}>
            <div className="scroll-out position-relative">
              <div
                className={`${classNames('mb-5', {
                  'overlay-spinner': isWaitingListLoading,
                })}`}
              >
                <div className="override-native overflow-auto sh-50 pe-3">
                  {!result.data?.length ? (
                    <div className='sh-40 w-100 d-flex justify-content-center align-items-center'>
                      <Empty message='Nenhum agendamento na lista de espera.' />
                    </div>
                  ) : (
                    <Table striped>
                      <thead>
                        <tr>
                          <th scope="col">Ordem e nome do agendamento</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.data?.map((waiting, index) => (
                          <tr key={waiting.calendar_waiting_list_id}>
                            <th className="d-flex align-items-center">
                              <div className="bg-gradient-light sh-4 sw-4 rounded-xl d-flex justify-content-center align-items-center">
                                <label className="text-white">{index + 1}</label>
                              </div>
                              <span className="ms-2">{waiting.calendar_waiting_list_patient_name}</span>
                            </th>
                            <td>
                              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-delete">Remova essa agendamento da lista de espera.</Tooltip>}>
                                <Button
                                  onClick={() => handleDeleteWaitingList(waiting)}
                                  variant="outline-primary"
                                  className="btn-icon btn-icon-only me-2"
                                  size="sm"
                                >
                                  <CsLineIcons icon="bin" />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add">Adicionar esse agendamento na agenda.</Tooltip>}>
                                <Button onClick={() => handleAddEvent(waiting)} variant="outline-primary" className="btn-icon btn-icon-only" size="sm">
                                  <CsLineIcons icon="plus" />
                                </Button>
                              </OverlayTrigger>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ModalWaitingList;
