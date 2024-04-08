import React, { useRef, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useParametersStore } from './Parameters/hooks/ParametersStore';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Parameters from './Parameters';
import Results from './Results';
import ModalSendPDF from './Modals/ModalSendPDF';
import { useModalSendPDFStore } from './hooks/ModalSendPDFStore';
import NotificationIcon, { notify } from '../../../components/toast/NotificationIcon';
import { downloadPDF } from '../../../helpers/PdfHelpers';
import StaticLoading from '../../../components/loading/StaticLoading';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';
import PatientMenuRow from '../../../components/PatientMenuRow';
import api from '../../../services/useAxios';
import usePatientMenuStore from '../../PatientMenu/hooks/patientMenuStore';

const AnthropometricAssessment = () => {
  const { id } = useParams<{ id: string }>();

  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const patientId = useParametersStore((state) => state.patientId);
  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const { getAssessmentData, updateData } = useParametersStore();
  const { setShowModalSendPdfEmail } = useModalSendPDFStore();
  const { setPatientId } = usePatientMenuStore();

  const getAssessmentData_ = async () => {
    if (!id) throw new Error('No id provided for the assessment');

    const response = await getAssessmentData(+id);

    response.paciente_id && setPatientId(response.paciente_id);

    return response;
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.get('/antropometria-pdf/' + id, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'antropometria-' + id);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Pdf gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao gerar pdf!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      await updateData(apiAssessmentDataUrl);
      notify('Dados salvos com sucesso!', 'Sucesso', 'check', 'success');
      setIsSaving(false);
    } catch (error) {
      notify('Erro ao salvar dados!', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const result = useQuery({ queryKey: ['anthropometricAssessment'], queryFn: getAssessmentData_ });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  return (
    <>
      <PatientMenuRow />

      <Row>
        <Col lg="5">
          <Parameters />
        </Col>

        <Col lg="7">
          <Card body className="mb-2">
            <div className="mt-3 mb-3 text-end">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-filter">Realize o comparativo entre as antropometrias do paciente, e análise a evolução.</Tooltip>}
              >
                <Link
                  to={`/app/avaliacao-antropometrica-comparativo/${patientId}`}
                  className="btn btn-outline-primary btn-sm btn-icon btn-icon-start mb-1 me-1"
                >
                  <CsLineIcons icon="chart-down" />
                </Link>
              </OverlayTrigger>

              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">Download do PDF dessa avaliação</Tooltip>}>
                <span>
                  <AsyncButton
                    isSaving={isGeneratingPdf}
                    loadingText=" "
                    variant="outline-primary"
                    size="sm"
                    className="btn-icon btn-icon-start mb-1 me-1"
                    onClickHandler={handleDownloadPdf}
                  >
                    <CsLineIcons icon="print" />
                  </AsyncButton>
                </span>
              </OverlayTrigger>

              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">Enviar antropometria por e-mail</Tooltip>}>
                <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start mb-1 me-1" onClick={() => setShowModalSendPdfEmail(true)}>
                  <CsLineIcons icon="send" />
                </Button>
              </OverlayTrigger>
            </div>

            <Results />
          </Card>

          <div className="d-flex justify-content-center">
            <AsyncButton isSaving={isSaving} className="btn-icon btn-icon-start btn-icon" variant="primary" size="lg" onClickHandler={handleSubmit}>
              Salvar avaliação
            </AsyncButton>
          </div>
        </Col>
      </Row>

      <ModalSendPDF />
    </>
  );
};

export default AnthropometricAssessment;
