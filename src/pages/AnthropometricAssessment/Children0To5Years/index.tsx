import React, { useRef, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Parameters from './Parameters';
import { useParametersStore } from './Parameters/hooks';
import Weight0a5anosFem from './charts/Weight0a5anosFem';
import Weight0a5anosMas from './charts/Weight0a5anosMas';
import ChartBMI0a2Fem from './charts/ChartBMI0a2Fem';
import ChartBMI0a2Mas from './charts/ChartBMI0a2Mas';
import ChartBMI2a5Fem from './charts/ChartBMI2a5Fem';
import ChartBMI2a5Mas from './charts/ChartBMI2a5Mas';
import Results from './Results';
import { useModalSendPDFStore } from './hooks/ModalSendPDFStore';
import ModalSendPDF from './Modals/ModalSendPDF';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import { downloadPDF } from '../../../helpers/PdfHelpers';
import api from '../../../services/useAxios';
import StaticLoading from '../../../components/loading/StaticLoading';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';
import Height0a2anosMas from './charts/Height0a2anosMas';
import Height0a2anosFem from './charts/Height0a2anosFem';
import Height2a5anosMas from './charts/Height2a5anosMas';
import Height2a5anosFem from './charts/Height2a5anosFem';
import usePatientMenuStore from '../../PatientMenu/hooks/patientMenuStore';
import PatientMenuRow from '../../../components/PatientMenuRow';

const AnthropometricAssessment0a5years = () => {
  const { id } = useParams<{ id: string }>();

  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const patientId = useParametersStore((state) => state.patientId);
  const patientAge = useParametersStore((state) => state.patientAge);
  const patientIsMale = useParametersStore((state) => state.patientIsMale);

  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const { getAssessmentData, updateData } = useParametersStore();
  const { setShowModalSendPdfEmail } = useModalSendPDFStore();
  const { setPatientId } = usePatientMenuStore();

  const getAssessmentData_ = async () => {
    try {
      if (!id) throw new Error('Id not found');

      const response = await getAssessmentData(+id);

      if (response === false) throw new Error('Erro ao buscar materiais');

      response.paciente_id && setPatientId(response.paciente_id);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    const charts = Array.from(document.querySelectorAll('canvas')).map(chart => chart.toDataURL('image/png'));
    const chartTitles = Array.from(document.querySelectorAll('.chart-title')).map(chart => chart.textContent);

    try {
      const { data } = await api.post(
        '/antropometria-pdf/' + id,
        {
          charts: charts.map((chart, index) => ({ chart, title: chartTitles[index] })),
          faixa_etaria: 'crianca0a5',
        },
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );

      downloadPDF(data, 'antropometria-' + id);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
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

  const result = useQuery({ queryKey: ['assessment', id], queryFn: getAssessmentData_ });

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
        <Col lg="4">
          <Parameters />
        </Col>

        <Col lg="8">
          <Card body className="mb-5">
            <div className="mt-3 mb-3 text-end">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-filter">Realize o comparativo entre as antropometrias do paciente, e análise a evolução.</Tooltip>}
              >
                <Link
                  to={`/app/avaliacao-antropometrica-comparativo/paciente-0-a-5-anos/${patientId}`}
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

          <div className="d-flex justify-content-center mt-3">
            <AsyncButton isSaving={isSaving} className="btn-icon btn-icon-start btn-icon" variant="primary" onClickHandler={handleSubmit}>
              Salvar
            </AsyncButton>
          </div>
        </Col>

        <Col lg="12" className="mt-3">
          <h4 className='chart-title'>Comprimento por idade - OMS</h4>
          <Card body className="mb-5">
            <div className="sh-60">
              {patientIsMale ? patientAge <= 24 ? <Height0a2anosMas /> : <Height2a5anosMas /> : patientAge <= 24 ? <Height0a2anosFem /> : <Height2a5anosFem />}
            </div>
          </Card>
        </Col>

        <Col lg="12">
          <h4 className='chart-title'>Peso por idade - OMS</h4>
          <Card body className="mb-5">
            <div className="sh-60">{patientIsMale ? <Weight0a5anosFem /> : <Weight0a5anosMas />}</div>
          </Card>
        </Col>

        <Col lg="12">
          <h4 className='chart-title'>IMC por idade - OMS</h4>
          <Card body className="mb-5">
            <div className="sh-60">
              {patientIsMale ? patientAge <= 24 ? <ChartBMI0a2Mas /> : <ChartBMI2a5Mas /> : patientAge <= 24 ? <ChartBMI0a2Fem /> : <ChartBMI2a5Fem />}
            </div>
          </Card>
        </Col>
      </Row>

      <ModalSendPDF />
    </>
  );
};

export default AnthropometricAssessment0a5years;
