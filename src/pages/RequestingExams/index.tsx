import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Col, OverlayTrigger, Popover, Row, Tooltip } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import ModalInformation from './Modals/ModalInformation';
import ModalSendPDFLab from './Modals/ModalSendPDFLab';
import ModalSendPDFPatient from './Modals/ModalSendPDFPatient';
import ModalSaveExamesSelectedTemplate from './Modals/ModalSaveExamesSelectedTemplate';
import ModalAddExamBlood from './Modals/ModalAddExamBlood';
import ExamsSelect from './ExamsSelect';
import { useRequestingExamStore } from './hooks/RequestingExamStore';
import SelectMeasurement from './SelectMeasurement';
import { RangeInput } from './RangeInput';
import { useModalInformationStore } from './hooks/ModalInformationStore';
import SelectByCategory from './SelectByCategory';
import { Link } from 'react-router-dom';
import { useModalSendPDFPatientStore } from './hooks/ModalSendPDFPatientStore';
import { useModalSendPDFLabStore } from './hooks/ModalSendPDFLabStore';
import { useModalAddExamBloodStore } from './hooks/ModalAddExamBloodStore';
import { SelectedExam } from '../../types/RequestingExam';
import { Patient } from '../../types/Patient';
import { regexNumberFloat } from '../../helpers/InputHelpers';
import { isValidNumber } from '../../helpers/MathHelpers';
import api from '../../services/useAxios';
import { notify, updateNotify } from '../../components/toast/NotificationIcon';
import { downloadPDF } from '../../helpers/PdfHelpers';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../components/AsyncButton';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';

const getValueBadge = (exam: SelectedExam, patient: Patient | null) => {
  if (!exam.examsBloodSelectedValueObtained || !Number(exam.examsBloodSelectedValueObtained) || exam.exam.examMeasurementUnit === 'N/A' || !patient)
    return null;

  if (patient.gender) {
    if (exam.examsBloodSelectedValueObtained > exam.exam.maxRangeMale) return <Badge bg="danger">Acima ideal</Badge>;
    else if (exam.examsBloodSelectedValueObtained < exam.exam.minRangeMale) return <Badge bg="danger">Abaixo ideal</Badge>;
    else return <Badge bg="success">Dentro do ideal</Badge>;
  } else {
    if (exam.examsBloodSelectedValueObtained > exam.exam.maxRangeFemale) return <Badge bg="danger">Acima ideal</Badge>;
    else if (exam.examsBloodSelectedValueObtained < exam.exam.minRangeFemale) return <Badge bg="danger">Abaixo ideal</Badge>;
    else return <Badge bg="success">Dentro do ideal</Badge>;
  }
};

const RequestingExams = () => {
  const navigate = useNavigate();

  const [showModalSaveExamesSelectedTemplate, setShowModalSaveExamesSelectedTemplate] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { id } = useParams<{ id: string }>();

  const selectedExams = useRequestingExamStore((state) => state.selectedExams);
  const patient = useRequestingExamStore((state) => state.patient);

  const { getRequestingExam, updateSelectedExam, removeSelectedExam } = useRequestingExamStore();
  const { handleSelectExam } = useModalInformationStore();
  const { setShowModalSendPDFPatient } = useModalSendPDFPatientStore();
  const { setShowModalSendPDFLab } = useModalSendPDFLabStore();
  const { handleShowModal } = useModalAddExamBloodStore();
  const { setPatientId } = usePatientMenuStore();

  const handleChangeExamValue = (exam: SelectedExam, value: string) => {
    const sanatizedValue = regexNumberFloat(value);

    if (!isValidNumber(sanatizedValue)) return;

    updateSelectedExam({ ...exam, examsBloodSelectedValueObtained: Number(sanatizedValue) });
  };

  const handleRemoveExam = (exam: SelectedExam) => {
    removeSelectedExam(exam);
  };

  const getRequestingExam_ = async () => {
    try {
      if (!id) throw new Error('Id não informado');

      const response = await getRequestingExam(id);

      if (response === false) throw new Error('Erro ao buscar solicitação de exames');

      response.patientId && setPatientId(response.patientId);

      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar solicitação de exames');
    }
  };

  const onsubmit = async () => {
    try {
      setIsSaving(true);

      await api.patch('/exames-de-sangue-historico/' + id, {
        patient,
        examsSelected: selectedExams.map((exam) => ({
          exam: exam.exam,
          examsBloodSelectedValueObtained: exam.examsBloodSelectedValueObtained,
          id: undefined,
        })),
      });

      notify('Solicitação de exames salva com sucesso', 'Sucesso', 'check', 'success');
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Erro ao salvar solicitação de exames', 'Erro', 'close', 'danger');
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    await onsubmit();

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.get('/solicitacoes-de-exame-pdf/' + id, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'solicitacao-de-exame-' + id);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleRedirectToComparative = async () => {
    await onsubmit();
    navigate(`/app/solicitacao-exames/paciente/${patient?.id ?? ''}`);
  };

  const result = useQuery({ queryKey: ['requesting-exam', id], queryFn: getRequestingExam_ });

  return (
    <Row className="d-flex justify-content-center">
      <PatientMenuRow />

      <Col lg="9">
        <Card body className="mb-2">
          <div className="mb-3 row">
            <div className="col-6">
              <label className="mb-2">Seleção dos exames únicos</label>
              <ExamsSelect />
            </div>
            <div className="col-6">
              <label className="mb-2">Seleção por modelo</label>
              <SelectByCategory />
            </div>
          </div>
        </Card>

        <div className="d-flex justify-content-end">
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-chart">Salve essa seleção de exames, para usar com outros pacientes.</Tooltip>}>
            <Button variant="primary" size="sm" className="btn-icon btn-icon-start mb-1 me-1" onClick={() => setShowModalSaveExamesSelectedTemplate(true)}>
              <CsLineIcons icon="save" />
            </Button>
          </OverlayTrigger>{' '}
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="tooltip-chart">
                Clique neste botão para adicionar um novo exame ao DietSystem, caso ele ainda não esteja cadastrado. Para encontrar um exame já existente,
                utilize a barra de busca acima, na lateral.
              </Tooltip>
            }
          >
            <Button variant="primary" size="sm" className="btn-icon btn-icon-start mb-1 me-1" onClick={handleShowModal}>
              <CsLineIcons icon="plus" />
            </Button>
          </OverlayTrigger>{' '}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-print">Download do PDF</Tooltip>}>
            <span>
              <AsyncButton
                isSaving={isGeneratingPdf}
                loadingText=" "
                variant="primary"
                size="sm"
                className="btn-icon btn-icon-start mb-1 me-1"
                onClickHandler={handleDownloadPdf}
              >
                <CsLineIcons icon="print" />
              </AsyncButton>
            </span>
          </OverlayTrigger>{' '}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-send">Enviar PDF para laboratório parceiro</Tooltip>}>
            <Button variant="primary" size="sm" className="btn-icon btn-icon-start mb-1 me-1" onClick={() => setShowModalSendPDFLab(true)}>
              <CsLineIcons icon="send" />
            </Button>
          </OverlayTrigger>{' '}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-send">Enviar PDF para o paciente</Tooltip>}>
            <Button variant="primary" size="sm" className="btn-icon btn-icon-start mb-1 me-1" onClick={() => setShowModalSendPDFPatient(true)}>
              <CsLineIcons icon="send" />
            </Button>
          </OverlayTrigger>{' '}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-chart">Visualizar comparativo</Tooltip>}>
            <span>
              <AsyncButton isSaving={isSaving} variant="primary" loadingText=' ' size="sm" className="btn-icon btn-icon-start mb-1 me-1" onClickHandler={handleRedirectToComparative}>
                <CsLineIcons icon="chart-2" />
              </AsyncButton>
            </span>
          </OverlayTrigger>{' '}
        </div>

        <Card body className="mb-2">
          <div className="mb-3 text-align-end">
            <label className="mb-1">
              <OverlayTrigger
                rootClose
                trigger="click"
                placement="bottom"
                overlay={
                  <Popover id="popover-basic-dismissible">
                    <Popover.Header className="text-center">Aviso de responsabilidade</Popover.Header>
                    <Popover.Body className="text-center">
                      Os diagnósticos e as prescrições de tratamentos são de responsabilidade exclusiva dos profissionais, utilize nossa classificação como
                      referência complementar aos seus cuidados e sintomas do paciente. DietSystem é um software e pode ter diversos valores, portanto, os
                      profissionais devem sempre verificar o relatório original para garantir.
                    </Popover.Body>
                  </Popover>
                }
              >
                <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start mb-1">
                  <CsLineIcons icon="warning-hexagon" />
                </Button>
              </OverlayTrigger>
            </label>
          </div>

          <div className="scroll-out">
            <div className="override-native overflow-auto sh-40 pe-3">
              {result.isLoading ? (
                <div className="sh-30 d-flex align-items-center justify-content-center">
                  <StaticLoading />
                </div>
              ) : result.isError ? (
                <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar exames selecionados</div>
              ) : selectedExams.length === 0 ? (
                <div className="sh-30 d-flex align-items-center justify-content-center">
                  <Empty message="Nenhum exame selecionado" />
                </div>
              ) : (
                selectedExams.map((exam) => (
                  <div className="border-bottom border-separator-light mb-2 pb-2" key={exam.id}>
                    <Row>
                      <Col xs={6}>
                        <div className="d-flex flex-column">
                          <div>{exam.exam.examName}</div>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="d-flex">
                          <div className="w-30 me-1">
                            <RangeInput value={exam.examsBloodSelectedValueObtained} onChange={(e) => handleChangeExamValue(exam, e.target.value)} />
                          </div>
                          <div className="w-30 me-1">
                            <SelectMeasurement
                              options={[
                                {
                                  label: exam.exam.examMeasurementUnit,
                                  value: exam.exam.examMeasurementUnit,
                                },
                              ]}
                            />
                          </div>
                          <div className="w-30 mt-2 p-0 text-center">{getValueBadge(exam, patient)} </div>
                          <button
                            className="btn btn-link p-0 pe-2"
                            onClick={() => handleSelectExam(exam.exam)}
                            style={{ cursor: 'pointer', outline: 'none', border: 'none', background: 'none' }}
                          >
                            <CsLineIcons icon="info-hexagon" />
                          </button>

                          <button
                            className="btn btn-link p-0"
                            onClick={() => handleRemoveExam(exam)}
                            style={{ cursor: 'pointer', outline: 'none', border: 'none', background: 'none' }}
                          >
                            <CsLineIcons icon="bin" />
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        <div className="text-center">
          <AsyncButton isSaving={isSaving} onClickHandler={onsubmit} variant="primary" size="lg" className="hover-scale-down" type="submit">
            Salvar solicitação
          </AsyncButton>{' '}
        </div>
      </Col>

      <ModalInformation />
      <ModalSendPDFLab />
      <ModalSendPDFPatient />
      <ModalSaveExamesSelectedTemplate showModal={showModalSaveExamesSelectedTemplate} setShowModal={setShowModalSaveExamesSelectedTemplate} />

      <ModalAddExamBlood />
    </Row>
  );
};

export default RequestingExams;
