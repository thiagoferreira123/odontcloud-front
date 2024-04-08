import React from 'react';
import { Patient } from '../../../types/Patient';
import { ButtonGroup, Col, Dropdown, Form, OverlayTrigger, Popover, Row, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useDeleteConfirmStore } from './hooks/DeleteConfirm';
import usePatients from '../../../hooks/usePatients';
import { useModalAddPatientStore } from './hooks/ModalAddPatientStore';
import { useQueryClient } from '@tanstack/react-query';
import { notify } from '../../../components/toast/NotificationIcon';
import { calculateDaysDiffByDateISO, calculateYearsDiffByDateISO } from '../../../helpers/DateHelper';
import { genders } from './modals/ModalAddPatient/FormAddPatiente/RequiredData';
import { getAvatarByGender } from '../../PatientMenu/hooks/patientMenuStore';
import { ListChildComponentProps } from 'react-window';
import { usePanelPatientModalStore } from './hooks/PanelPatientModalStore';

export default React.memo(function PatientRow({ data, index, style }: ListChildComponentProps<(Patient & { id: number })[]>) {
  const patient = data[index];

  const queryClient = useQueryClient();

  const { handleSelectPatient } = useModalAddPatientStore();
  const { handleDeletePatient } = useDeleteConfirmStore();
  const { updatePatient } = usePatients();
  const { handleSelectPatientForPanelPatientModal } = usePanelPatientModalStore();

  const handleToggleActivePatient = async (patient: Patient & { id: number }) => {
    try {
      const payload: Patient = {
        ...patient,
        patientActiveOrInactive: Number(patient.patientActiveOrInactive) ? 0 : 1,
        inactivateAppDate: Number(patient.patientActiveOrInactive) ? new Date().toISOString() : null,
      };

      const response = await updatePatient(payload as Patient & { id: number }, queryClient, true);

      if (!response) throw new Error('Erro ao inativar paciente');

      notify('Sucesso', `Paciente ${!Number(patient.patientActiveOrInactive) ? 'ativado' : 'inativado'} com sucesso`, 'check', 'success');
    } catch (error) {
      console.error(error);
      notify('Erro', 'Ocorreu um erro ao inativar o paciente', 'close', 'danger');
    }
  };

  const handleToggleConsultationPendingPatient = async (patient: Patient & { id: number }) => {
    try {
      const payload = {
        ...patient,
        consultationCompletedOrPending: patient.consultationCompletedOrPending === 'Pendente' ? 'Finalizada' : ('Pendente' as 'Finalizada' | 'Pendente'),
      };

      const response = await updatePatient(payload, queryClient, true);

      if (!response) throw new Error('Erro ao sinalizar pendência ao paciente');

      notify(
        `Pendência ${patient.consultationCompletedOrPending === 'Finalizada' ? 'sinalizada' : 'removida'} ao paciente com sucesso`,
        'Sucesso',
        'flag',
        'success'
      );
    } catch (error) {
      console.error(error);
      notify('Ocorreu um erro ao sinalizar pendência ao paciente', 'Erro', 'close', 'danger');
    }
  };

  return (
    <div className="border-bottom border-separator-light mb-2 pb-2" key={patient.id} style={style}>
      <Row className="g-0 sh-6 row">
        <Col xs="auto">
          <img src={patient.photoLink ? patient.photoLink : getAvatarByGender(patient.gender)} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
        </Col>
        <Col>
          <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
            <div className="d-flex flex-column text-alternate">
              <div>{patient.name}</div>
              <Row>
                <Col className="d-flex align-items-center">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-top">
                        Paciente {patient.consultationCompletedOrPending !== 'Pendente' ? 'não' : null}possui pedências 😎 (clique para alterar)
                      </Tooltip>
                    }
                  >
                    <span onClick={() => handleToggleConsultationPendingPatient(patient)} role="button" tabIndex={0}>
                      <Icon.Flag className={`text-${patient.consultationCompletedOrPending === 'Pendente' ? 'warning' : 'primary'}`} size={16} />
                    </span>
                  </OverlayTrigger>

                  <OverlayTrigger
                    rootClose
                    trigger={['hover', 'focus']}
                    placement="right"
                    overlay={
                      <Popover id="popover-basic-top" className="custom-popover">
                        <Popover.Body>
                          Paciente de gênero <strong>{genders[patient.gender].label}</strong>, com{' '}
                          <strong>{calculateYearsDiffByDateISO(patient.dateOfBirth)}</strong> anos de idade, foi registrado(a) no DietSystem em{' '}
                          <strong>{new Date(patient.dateOfFirstConsultation).toLocaleDateString()}</strong>.<br />
                          <br />A última interação registrada com o sistema ocorreu em{' '}
                          <strong>{new Date(patient.dateOfLastConsultation).toLocaleDateString()}</strong>.<br />
                          <br />O tratamento adotado foi: <strong>{patient.reasonForConsultation}</strong>, realizado no local:{' '}
                          <strong>{patient.localAtendimento?.nome ?? ''}</strong>.<br />
                          <br />
                          Observa-se um período de <strong>{calculateDaysDiffByDateISO(patient.dateOfLastConsultation)}</strong> dias sem interações com o(a)
                          paciente.
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <span>
                      <Icon.InfoCircle className="ms-2" />
                    </span>
                  </OverlayTrigger>

                  <div>
                    {patient.passwordMobileAndWeb && (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="button-tooltip-2">
                            Envie o acesso ao painel do paciente por WhatsApp. Através do painel, o mesmo consegue ter acesso a todos os PDF's.{' '}
                          </Tooltip>
                        }
                      >
                        <span className="pointer ms-2" onClick={() => handleSelectPatientForPanelPatientModal(patient)}>
                          <Icon.Whatsapp className='text-alternate' size={14}/>
                        </span>
                      </OverlayTrigger>
                    )}
                  </div>

                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-top-switch"> Paciente {patient.patientActiveOrInactive ? 'ativo 😎' : 'inativo 😴'} (clique para alterar)</Tooltip>
                    }
                  >
                    <Form.Check
                      type="switch"
                      id="customSwitch"
                      defaultChecked={patient.patientActiveOrInactive ? true : false}
                      onChange={() => handleToggleActivePatient(patient)}
                      className="ms-2 pointer"
                    />
                  </OverlayTrigger>
                </Col>
              </Row>
            </div>
            <div className="d-flex">
              <Link to={`/app/menu-paciente/${patient.id}`} className="btn btn-sm btn-outline-secondary ms-1">
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
