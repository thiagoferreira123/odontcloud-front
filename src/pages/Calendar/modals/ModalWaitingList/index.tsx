import classNames from 'classnames';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { useCalendarStore } from '../../hooks';
import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import Select from '../../../../components/Select';
import { useFormik } from 'formik';
import { SingleValue } from 'react-select';
import { EventType, appointmentOptions } from '../../../../types/Events';
import * as yup from 'yup';
import { Option } from '../../../../types/inputs';
import PacientSelect from '../ModalAddEdit/PacientSelect';
import InsuranciesSelect from './InsuranciesSelect';
import useWaitingListStore from '../../hooks/WaitingListStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppException } from '../../../../helpers/ErrorHelpers';
import { notify } from '../../../../components/toast/NotificationIcon';
import { WaitingList } from '../../hooks/WaitingListStore/types';
import { HealthInsurance } from '../../hooks/HealthInsuranceStore/types';
import { useModalWaitingListStore } from '../../hooks/modals/ModalWaitingListStore';
import { useModalAddEditStore } from '../../hooks/modals/ModalAddEditStore';
import usePatientStore from '../../../Dashboard/patients/hooks/PatientStore';

type FormModel = {
  calendar_waiting_list_name: Option | null;
  calendar_waiting_list_email: string;
  calendar_waiting_list_phone: string;
  calendar_waiting_list_health_insurance_id: SingleValue<HealthInsurance>;
  calendar_waiting_list_schedule_type: SingleValue<{ value: EventType; label: string }>;
  calendar_waiting_list_annotation: string;
  ddiPais: string;
};

const initialValues: FormModel = {
  calendar_waiting_list_name: null,
  calendar_waiting_list_health_insurance_id: null,
  calendar_waiting_list_schedule_type: null,
  calendar_waiting_list_phone: '',
  calendar_waiting_list_email: '',
  calendar_waiting_list_annotation: '',
  ddiPais: '',
};

const validationSchema = yup.object({
  calendar_waiting_list_name: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable()
    .required('Escolha um paciente'),
  calendar_waiting_list_health_insurance_id: yup
    .object()
    .shape({
      id: yup.string(),
    })
    .nullable(),
  calendar_waiting_list_schedule_type: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable()
    .required('Escolha um tipo de consulta'),
  calendar_waiting_list_phone: yup.string().notRequired(),
  calendar_waiting_list_email: yup.string().notRequired(),
  calendar_waiting_list_annotation: yup.string().nullable().notRequired(),
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

  const onSubmit = async (values: FormModel) => {
    try {
      setIsSaving(true);
      const { calendar_waiting_list_name, calendar_waiting_list_health_insurance_id, calendar_waiting_list_schedule_type, ...rest } = values;
      const payload = {
        ...rest,
        calendar_waiting_list_name: calendar_waiting_list_name?.label,
        calendar_waiting_list_schedule_type: calendar_waiting_list_schedule_type?.value,
        calendar_waiting_list_health_insurance_id: calendar_waiting_list_health_insurance_id?.calendar_health_insurance_id,
        calendar_waiting_list_professional_id: selectedLocal?.profissional,
        calendar_waiting_list_location_id: selectedLocal?.id,
        calendar_waiting_list_secretary_id: 0,
        calendar_waiting_list_phone: values.calendar_waiting_list_phone ? values.calendar_waiting_list_phone : undefined,
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
      return handleSelectChange(option, 'calendar_waiting_list_name');
    }

    const found = patientsResult.data?.find((patient) => patient.id && patient.id === +option.value);

    if (found) {
      setFieldValue('calendar_waiting_list_email', found.email || '');
      setFieldValue('calendar_waiting_list_phone', found.phone || '');
    }
    handleSelectChange(option, 'calendar_waiting_list_name');
  };

  const handleAddEvent = (waiting: WaitingList) => {
    setEvent({
      calendar_name: { label: waiting.calendar_waiting_list_name, value: '0' },
      calendar_email: waiting.calendar_waiting_list_email,
      calendar_phone: waiting.calendar_waiting_list_phone,
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

  const filteredWaitingList = useMemo(() => {
    const naoFiltra = true;
    if (!selectedLocal || naoFiltra) return result.data ?? [];
    return result.data?.filter((waiting) => waiting.calendar_waiting_list_location_id === selectedLocal?.id) ?? [];
  }, [result.data, selectedLocal]);

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
                <PacientSelect value={values.calendar_waiting_list_name} onChange={(opt) => handlePatientChange(opt as Option)} />
                {errors.calendar_waiting_list_name && touched.calendar_waiting_list_name && (
                  <div className="error">{errors.calendar_waiting_list_name.toString()}</div>
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
                  name="calendar_waiting_list_phone"
                  id="calendar_waiting_list_phone"
                  value={values.calendar_waiting_list_phone}
                  onChange={handleChange}
                  type="text"
                />
                <Form.Label>TELEFONE</Form.Label>
                {errors.calendar_waiting_list_phone && touched.calendar_waiting_list_phone && <div className="error">{errors.calendar_waiting_list_phone}</div>}
              </div>
              <div className="mb-3 top-label">
                <InsuranciesSelect
                  value={values.calendar_waiting_list_health_insurance_id}
                  onChange={(value) => handleSelectChange(value, 'calendar_waiting_list_health_insurance_id')}
                />
                {errors.calendar_waiting_list_health_insurance_id && touched.calendar_waiting_list_health_insurance_id && (
                  <div className="error">{errors.calendar_waiting_list_health_insurance_id}</div>
                )}
              </div>
              <div className="mb-3 top-label position-relative">
                <Select
                  id="calendar_waiting_list_schedule_type"
                  name="calendar_waiting_list_schedule_type"
                  value={values.calendar_waiting_list_schedule_type}
                  onChange={(value) => handleSelectChange(value, 'calendar_waiting_list_schedule_type')}
                  options={appointmentOptions}
                />
                <span>TIPO DE AGENDAMENTO</span>
                {errors.calendar_waiting_list_schedule_type && touched.calendar_waiting_list_schedule_type && (
                  <div className="error">{errors.calendar_waiting_list_schedule_type}</div>
                )}
              </div>
              <div className="mb-3 top-label">
                <Form.Control
                  name="calendar_waiting_list_annotation"
                  id="calendar_waiting_list_annotation"
                  value={values.calendar_waiting_list_annotation}
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
                  <Table striped>
                    <thead>
                      <tr>
                        <th scope="col">Ordem e nome do agendamento</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWaitingList.map((waiting, index) => (
                        <tr key={waiting.calendar_waiting_list_id}>
                          <th className="d-flex align-items-center">
                            <div className="bg-gradient-light sh-4 sw-4 rounded-xl d-flex justify-content-center align-items-center">
                              <label className="text-white">{index + 1}</label>
                            </div>
                            <span className="ms-2">{waiting.calendar_waiting_list_name}</span>
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
