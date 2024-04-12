import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Badge, Button, Card, Col, Nav, Row, Tab, Table } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import HtmlHead from '../../components/html-head/HtmlHead';
import Filters from './Filters';
import { useFiltersStore } from './hooks/FiltersStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import Empty from '../../components/Empty';
import StaticLoading from '../../components/loading/StaticLoading';
import ModalAddPatient from '../Dashboard/patients/modals/ModalAddPatient';
import DeleteConfirm from '../Dashboard/patients/modals/DeleteConfirm';
import { useModalAddPatientStore } from '../Dashboard/patients/hooks/ModalAddPatientStore';
import { useDeleteConfirmStore } from '../Dashboard/patients/hooks/DeleteConfirm';
import { useAuth } from '../Auth/Login/hook';
import api from '../../services/useAxios';
import { useState } from 'react';
import ModalPremium from '../Dashboard/ModalPremium';
import { downloadExcel } from '../../helpers/PdfHelpers';
import AsyncButton from '../../components/AsyncButton';
import usePatientStore from '../Dashboard/patients/hooks/PatientStore';

export default function PatientControl() {
  const title = 'Controle de pacientes';

  const query = useFiltersStore((state) => state.query);
  const status = useFiltersStore((state) => state.status);
  const selectedMonth = useFiltersStore((state) => state.selectedMonth);
  const selectedYear = useFiltersStore((state) => state.selectedYear);

  const [showModalPremium, setShowModalPremium] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const user = useAuth((state) => state.user);

  const { getPatients } = usePatientStore();
  const { handleSelectPatient, handleOpenModal } = useModalAddPatientStore();
  const { handleDeletePatient } = useDeleteConfirmStore();

  const getPatients_ = async () => {
    try {
      if (!selectedMonth || !selectedYear) throw new AppException('Selecione um mês e um ano para filtrar os pacientes');

      const patients = await getPatients();

      // if (patients === false) throw new Error('Erro ao buscar os pacientes');

      return patients;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
    }
  };

  const handleClickOpenModalAddPatient = async () => {
    // if (!user?.subscriptionStatus?.status || user.subscriptionStatus.status !== 'approved') {
    //   // return setShowModalPremium(true);
    //   const { data } = await api.get('/paciente/search/');

    //   if (data.statusCode === 900) return setShowModalPremium(true);
    // }

    handleOpenModal();
  };

  const handleDownloadPatients = async () => {
    try {
      if (!selectedMonth || !selectedYear) throw new AppException('Selecione um mês e um ano para visualizar as transações');

      setIsDownloading(true);

      const { data } = await api.get(`/clinic-patient/download?year=${selectedYear.value}&month=${selectedMonth.value}`, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      downloadExcel(data, `pacientes-${selectedYear.value}-${selectedMonth.value}`);

      setIsDownloading(false);
    } catch (error) {
      console.error(error);
      error instanceof AppException ? notify(error.message, 'Erro', 'close', 'danger') : notify('Erro ao baixar o arquivo', 'Erro', 'close', 'danger');
      setIsDownloading(false);
    }
  };

  const result = useQuery({
    queryKey: ['my-patients'],
    queryFn: getPatients_,
    enabled: !!selectedMonth && !!selectedYear,
  });

  const filteredByMonthAndYear =
    result.data?.filter((patient) => {
      if (!selectedMonth || !selectedYear) throw new AppException('Selecione um mês e um ano para filtrar os pacientes');

      return (
        (selectedMonth?.value === '0' || new Date(patient.patient_register_date).getMonth() + 1 === +selectedMonth?.value) &&
        (selectedYear?.value === '0' || new Date(patient.patient_register_date).getFullYear() === +selectedYear?.value)
      );
    }) ?? [];

  const filteredPatients = filteredByMonthAndYear
    .filter((patient) => {
      if (!selectedMonth || !selectedYear) throw new AppException('Selecione um mês e um ano para filtrar os pacientes');

      return (
        (!query || patient.patient_full_name.toLowerCase().includes(query.toLowerCase()))
        // (!status || (status === 1 && patient.patientActiveOrInactive === 1) || (status === 2 && patient.patientActiveOrInactive === 0))
      );
    })
    .sort((a, b) => new Date(a.patient_register_date).getTime() - new Date(b.patient_register_date).getTime());

  return (
    <>
      <HtmlHead title={title} />
      {/* Title Start */}
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
      </div>
      {/* Title End */}
      <Row>
        <Card>
          <Card.Body>
            <Filters />
            <div className="text-end">
              <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Download do PDF com o registro dos pacientes</Tooltip>}>
                <AsyncButton isSaving={isDownloading} onClickHandler={handleDownloadPatients} loadingText=" " variant="outline-primary" size="sm">
                  <Icon.Printer />
                </AsyncButton>
              </OverlayTrigger>
            </div>
            <div className="scroll-out">
              <div className="override-native overflow-auto sh-50 pe-3">
                <section className="scroll-section" id="stripedRows">
                  {result.isLoading ? (
                    <div className="sh-50 d-flex align-items-center justify-content-center">
                        <StaticLoading />
                      </div>
                  ) : result.isError ? (
                    <div className="sh-50 d-flex align-items-center justify-content-center">
                      <h5 className="mb-3">Erro ao buscar pacientes</h5>
                    </div>
                  ) : !filteredPatients.length ? (
                    <div className="sh-50 d-flex align-items-center justify-content-center">
                        <Empty message="Nenhum paciente encontrado" classNames="mt-0 py-5" />
                      </div>
                  ) : (
                    <Table striped>
                      <thead>
                        <tr>
                          <th scope="col">Nome do paciente</th>
                          {/* <th scope="col">Motivo da consulta</th> */}
                          <th scope="col">Data do cadastro</th>
                          <th scope="col">Email</th>
                          <th scope="col">Celular</th>
                          {/* <th scope="col">Situação</th> */}
                          <th scope="col">Opções</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((patient) => (
                          <tr key={patient.patient_id}>
                            <th>{patient.patient_full_name}</th>
                            {/* <td>{patient.reasonForConsultation}</td> */}
                            <td>{new Date(patient.patient_register_date).toLocaleDateString()}</td>
                            <td>{patient.patient_email}</td>
                            <td>{patient.patient_phone}</td>
                            {/* <td>
                              <Badge pill bg={patient.patientActiveOrInactive ? 'secondary' : 'danger'}>
                                {patient.patientActiveOrInactive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </td> */}
                            <td>
                              <Button variant="outline-primary me-2" size="sm" onClick={() => handleDeletePatient(patient)}>
                                <Icon.Trash />
                              </Button>
                              <Button variant="outline-primary" size="sm" onClick={() => handleSelectPatient(patient)}>
                                <Icon.Pen />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </section>
              </div>
            </div>
            <div className="mt-3 text-center">
              <Button variant="primary" className="mb-1 hover-scale-up me-2" onClick={handleClickOpenModalAddPatient}>
                Cadastrar uma paciente
              </Button>{' '}
            </div>
          </Card.Body>
        </Card>

        <Row className="g-2">
          <Col xl="6">
            <Card className="hover-border-primary">
              <Card.Body className="py-4">
                <Row className="g-0 align-items-center">
                  <Col xs="auto">
                    <div className="bg-gradient-light sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                      <Icon.PeopleFill className="text-white" />
                    </div>
                  </Col>
                  <Col>
                    <div className="heading mb-0 sh-8 d-flex align-items-center lh-1-25 ps-3">Pacientes cadastrados no softwre esse mês</div>
                  </Col>
                  <Col xs="auto" className="ps-3">
                    <div className="display-5 text-primary">{filteredByMonthAndYear.length}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xl="6">
            <Card className="active">
              <Card.Body className="py-4">
                <Row className="g-0 align-items-center">
                  <Col xs="auto">
                    <div className="bg-gradient-light sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center ">
                      <Icon.PeopleFill className="text-white" />
                    </div>
                  </Col>
                  <Col>
                    <div className="heading mb-0 sh-8 d-flex align-items-center lh-1-25 ps-3">Total de pacientes cadastrados no Software</div>
                  </Col>
                  <Col xs="auto" className="ps-3">
                    <div className="display-5 text-primary">{result.data?.length ?? 0}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Row>

      <ModalAddPatient />
      <DeleteConfirm />
      <ModalPremium showModal={showModalPremium} setShowModal={setShowModalPremium} />
    </>
  );
}
