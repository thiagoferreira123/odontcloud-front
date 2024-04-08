import React from 'react';
import { Patient } from '../../../types/Patient';
import { ButtonGroup, Col, Dropdown, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useDeleteConfirmStore } from './hooks/DeleteConfirm';
import { useModalAddPatientStore } from './hooks/ModalAddPatientStore';
import { calculateDaysDiffByDateISO, calculateYearsDiffByDateISO } from '../../../helpers/DateHelper';
import { patient_sex } from './modals/ModalAddPatient/FormAddPatiente/RequiredData';
import { getAvatarByGender } from '../../PatientMenu/hooks/patientMenuStore';
import { ListChildComponentProps } from 'react-window';

export default React.memo(function PatientRow({ data, index, style }: ListChildComponentProps<(Patient & { patient_id: string })[]>) {
  const patient = data[index];

  const { handleSelectPatient } = useModalAddPatientStore();
  const { handleDeletePatient } = useDeleteConfirmStore();

  return (
    <div className="border-bottom border-separator-light mb-2 pb-2" key={patient.patient_id} style={style}>
      <Row className="g-0 sh-6 row">
        <Col xs="auto">
          <img src={patient.patient_photo ? patient.patient_photo : getAvatarByGender(patient.patient_sex)} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
        </Col>
        <Col>
          <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
            <div className="d-flex flex-column text-alternate">
              <div>{patient.patient_full_name}</div>
              <Row>
                <Col className="d-flex align-items-center">
                  <OverlayTrigger
                    rootClose
                    trigger={['hover', 'focus']}
                    placement="right"
                    overlay={
                      <Popover id="popover-basic-top" className="custom-popover">
                        <Popover.Body>
                          Paciente de gênero <strong>{patient_sex[patient.patient_sex]?.label ?? patient_sex[0]}</strong>, com{' '}
                          <strong>{calculateYearsDiffByDateISO(patient.patient_birth_date)}</strong> anos de idade, foi registrado(a) no OdontCloud em{' '}
                          <strong>{new Date(patient.patient_last_interaction).toLocaleDateString()}</strong>.<br />
                          <br />A última interação registrada com o sistema ocorreu em{' '}
                          <strong>{new Date(patient.patient_last_interaction).toLocaleDateString()}</strong>.<br />
                          {/* <br />O tratamento adotado foi: <strong>{patient.reasonForConsultation}</strong>, realizado no local:{' '}
                          <strong>{patient.localAtendimento?.nome ?? ''}</strong>.<br /> */}
                          <br />
                          Observa-se um período de <strong>{calculateDaysDiffByDateISO(patient.patient_last_interaction)}</strong> dias sem interações com o(a)
                          paciente.
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span>
                      <Icon.InfoCircle className="ms-2" />
                    </span>
                  </OverlayTrigger>
                </Col>
              </Row>
            </div>
            <div className="d-flex">
              <Link to={`/app/menu-paciente/${patient.patient_id}`} className="btn btn-sm btn-outline-secondary ms-1">
                Iniciar atendimento
              </Link>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle className="ms-1 me-2" variant="outline-secondary" size="sm" id="dropdown-autoclose-true"></Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#" onClick={() => handleSelectPatient(patient)}>
                    Editar
                  </Dropdown.Item>
                  <Dropdown.Item href="#" onClick={() => handleDeletePatient(patient)}>
                    Remover
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>{' '}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});
