import React from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import { useListCalendarStore } from './hooks/ListCalendarStore';
import { convertIsoToBrDate, convertTimeToSimple, formatDateMonthToHumanReadable } from '../../../helpers/DateHelper';
import { useModalAddPatientStore } from '../patients/hooks/ModalAddPatientStore';
import { Patient } from '../../../types/Patient';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Schedule } from '../../Calendar/hooks/ScheduleStore/types';

const ListCalendar = () => {
  const { getCalendarList } = useListCalendarStore();
  const { handleSelectPatient } = useModalAddPatientStore();

  const getCalendarList_ = async () => {
    try {
      const response = await getCalendarList();
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const AppointmentSkeleton = () => {
    return (
      <Row className="g-0 mb-3">
        <Col xs="auto">
          <Skeleton height={20} width={20} />
        </Col>
        <Col>
          <div style={{ marginLeft: '15px' }}>
            <Skeleton height={20} width={`80%`} />
          </div>
        </Col>
        <Col xs="auto">
          <Skeleton height={20} width={100} />
        </Col>
      </Row>
    );
  };

  const handleCreatePatient = (appointment: Schedule) => {
    const patient: Patient = {
      patient_full_name: appointment.calendar_name,
      patient_email: appointment.calendar_email,
      patient_sex: 1,
      patient_last_interaction: new Date().toISOString(),
      patient_phone: appointment.calendar_phone,
      patient_birth_date: '',
      patient_cpf: '',
      patient_marital_status: '',
      patient_extra_contact_relationship: '',
      patient_register_date: ''
    };

    handleSelectPatient(patient);
  };

  const result = useQuery({ queryKey: ['calendar-list'], queryFn: getCalendarList_ });

  return (
    <Card>
      <Card.Body className="mb-n2">
        <Row className="g-0 mb-3">
          <Col xs="auto">
            <div className="d-inline-block d-flex">
              <div className="bg-gradient-light sw-6 sh-6 rounded-xl">
                <div className="text-white d-flex justify-content-center align-items-center h-100">
                  <Icon.Calendar2Heart size={20} />
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <div className="d-flex flex-column pt-0 pb-0 ps-3 pe-4 h-100 justify-content-center">
              <div className="d-flex flex-column">
                <div className="text-alternate mt-n1 lh-1-25">Agendamentos do dia</div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="scroll-out">
          <div className="override-native overflow-auto sh-25 pe-3">
            {result.isLoading ? (
              <>
                <AppointmentSkeleton />
                <AppointmentSkeleton />
                <AppointmentSkeleton />
              </>
            ) : !result.data?.length ? (
              <div className="sh-20 d-flex justify-content-center align-items-center">
                <div className="h-100 p-4 text-center align-items-center d-flex flex-column justify-content-center">
                  <div className="d-flex flex-column justify-content-center align-items-center sh-5 sw-5 rounded-xl bg-gradient-primary mb-2">
                    <Icon.Calendar2Heart />
                  </div>
                  <p className="mb-0 lh-1">Não há agendamento para hoje</p>
                </div>
              </div>
            ) : (
              result.data.map((appointment, index) => (
                <Row className="g-0 mb-3" key={index}>
                  <Col xs="auto">
                    <div className="sw-3 d-inline-block d-flex justify-content-start align-items-center h-100">
                      <div className="sh-3">
                        <Icon.Calendar2Heart className="text-muted align-top" />
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex flex-column pt-0 pb-0 ps-3 pe-4 h-100 justify-content-center">
                      <div className="d-flex flex-column">
                        <div className="text-alternate mt-n1 lh-1-25">{appointment.calendar_name}</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="d-inline-block d-flex justify-content-end align-items-center h-100">
                      <div className="text-muted ms-2 mt-n1 lh-1-25">
                        {convertIsoToBrDate(appointment.calendar_date)} ás {convertTimeToSimple(appointment.calendar_start_time)}
                      </div>
                      {!appointment.calendar_patient_id ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip-top">Este paciente ainda não está na sua lista, clique para adicinar.</Tooltip>}
                        >
                          <div>
                            {' '}
                            {/* Adicione esta div para envolver o botão */}
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="btn-icon btn-icon-only mb-1 ms-1"
                              onClick={() => handleCreatePatient(appointment)}
                            >
                              <Icon.Plus />
                            </Button>{' '}
                          </div>
                        </OverlayTrigger>
                      ) : null}
                    </div>
                  </Col>
                </Row>
              ))
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ListCalendar;
