import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useRef, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SelectAssessment from './SelectAssessment';
import { useAnthropometricAssessmentComparativeStore } from './hooks/AnthropometricAssessmentComparativeStore';
import { classificationMeasurements, fieldsBoneWeight, fieldsFatWeigth, girthMeasurements, skinFoldMeasurements } from './constants';
import AssessmentsChart from './AssessmentsChart';
import ModalSendPDF from './Modals/ModalSendPDF';
import { useModalSendPDFStore } from './hooks/ModalSendPDFStore';
import { parseFloatNumber } from '../../../helpers/MathHelpers';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { Option } from '../../../types/inputs';
import { AdultAntropometricData, AntropometricAssessmentHistory } from '../../../types/AntropometricAssessment';
import NotificationIcon, { notify } from '../../../components/toast/NotificationIcon';
import api from '../../../services/useAxios';
import { downloadPDF } from '../../../helpers/PdfHelpers';
import StaticLoading from '../../../components/loading/StaticLoading';
import AsyncButton from '../../../components/AsyncButton';
import PatientMenuRow from '../../../components/PatientMenuRow';
import usePatientMenuStore from '../../PatientMenu/hooks/patientMenuStore';

const renderValor = (valorAtual: string | null, valorAnterior: number | null) => {
  if (valorAtual === null) return '-';
  if (valorAnterior === null) return valorAtual.toString();
  if (isNaN(valorAnterior)) return valorAtual.toString();

  const diferenca = Number(valorAtual) - valorAnterior;
  const icon = diferenca >= 0 ? 'trend-up' : 'trend-down';
  const sinal = diferenca >= 0 ? '+' : '';

  // Substitua por componentes reais para ícones
  return diferenca ? (
    <>
      {`${valorAtual} (${sinal}${parseFloatNumber(diferenca)})`} <CsLineIcons icon={icon} size={15} className="me-2" />
    </>
  ) : (
    valorAtual
  );
};

const AnthropometricAssessment0a5years = () => {
  const { id } = useParams<{ id: string }>();

  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [selectedAssessmentOptions, setSelectedAssessmentOptions] = useState<Option[]>([]);
  const [selectedAssessments, setSelectedAssessments] = useState<Array<AntropometricAssessmentHistory<AdultAntropometricData> | null>>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const { getAssessments } = useAnthropometricAssessmentComparativeStore();
  const { handleShowModal } = useModalSendPDFStore();
  const { setPatientId } = usePatientMenuStore();

  const getAssessments_ = async () => {
    try {
      if (!id) throw new Error('Id não informado');

      setPatientId(+id);

      const assessments = await getAssessments(+id);

      if (assessments === false) throw new Error('Erro ao buscar avaliações antropométricas');

      return assessments;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      return [];
    }
  };

  const handleSelectAssessment = (option: SingleValue<Option>, index: number) => {
    selectedAssessmentOptions[index] = option as Option;
    setSelectedAssessmentOptions([...selectedAssessmentOptions]);

    const assessment = result.data?.find((assessment) => assessment.dados_geral_id == Number((option as Option).value));
    selectedAssessments[index] = assessment ?? null;
    setSelectedAssessments([...selectedAssessments]);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    const chart64 = document.querySelector('canvas')?.toDataURL('image/png');

    try {
      const { data } = await api.post(
        '/antropometria-pdf/paciente/' + id,
        {
          chart64,
          faixa_etaria: 'adulto',
          selectedAssessments: selectedAssessments.map((assessment) => assessment?.dados_geral_id),
        },
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );

      downloadPDF(data, 'compoarativo-antropometrias-' + id);

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

  const result = useQuery({ queryKey: ['antropometric-ssessment', id], queryFn: getAssessments_, enabled: !!id });

  if (result.isLoading)
    return (
      <div className="h-50 d-flex justify-content-center align-items-center">
        <StaticLoading />
      </div>
    );

  const options =
    result.data?.map((assessment) => ({ label: new Date(assessment.data_registro * 1000).toLocaleDateString(), value: assessment.dados_geral_id })) ?? [];

  return (
    <>
      <PatientMenuRow />

      <Row>
        <Col lg="12">
          <Card body className="mb-5 mt-5">
            <div className="mt-3 mb-3 text-end">
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
                <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start mb-1 me-1" onClick={() => handleShowModal(selectedAssessments)}>
                  <CsLineIcons icon="send" />
                </Button>
              </OverlayTrigger>
            </div>
            <Table striped>
              <thead>
                <tr>
                  <th scope="col" className="col-4">
                    Parâmetros
                  </th>
                  <th scope="col" className="w-10">
                    <SelectAssessment options={options} value={selectedAssessmentOptions[0]} setValue={(option) => handleSelectAssessment(option, 0)} />
                  </th>
                  <th scope="col" className="w-10">
                    <SelectAssessment options={options} value={selectedAssessmentOptions[1]} setValue={(option) => handleSelectAssessment(option, 1)} />
                  </th>
                  <th scope="col" className="w-10">
                    <SelectAssessment options={options} value={selectedAssessmentOptions[2]} setValue={(option) => handleSelectAssessment(option, 2)} />
                  </th>
                  <th scope="col" className="w-10">
                    <SelectAssessment options={options} value={selectedAssessmentOptions[3]} setValue={(option) => handleSelectAssessment(option, 3)} />
                  </th>
                  <th scope="col" className="w-10">
                    <SelectAssessment options={options} value={selectedAssessmentOptions[4]} setValue={(option) => handleSelectAssessment(option, 4)} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {classificationMeasurements.map((measurement) => {
                  if (
                    fieldsBoneWeight.includes(measurement.nome) &&
                    !(Number(selectedAssessments[0]?.data?.diametro_estilo_ulnar) && Number(selectedAssessments[0]?.data?.diametro_bicondio_femural))
                  ) {
                    return null;
                  } else if (
                    fieldsFatWeigth.includes(measurement.nome) &&
                    Number(selectedAssessments[0]?.data?.diametro_estilo_ulnar) &&
                    Number(selectedAssessments[0]?.data?.diametro_bicondio_femural)
                  ) {
                    return null;
                  }

                  return (
                    <tr key={measurement.nome}>
                      <th>{measurement.title}</th>
                      {selectedAssessments.map((assessment, index) => (
                        <td key={index} className="w-10">
                          {assessment?.data && (assessment.data[measurement.nome] as string)
                            ? index === 0 || !selectedAssessments[index - 1]?.data
                              ? (assessment.data[measurement.nome] as string) || '-'
                              : renderValor(assessment.data[measurement.nome] as string, Number(selectedAssessments[index - 1]?.data?.[measurement.nome] ?? 0))
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col lg="12">
          <Card body className="mb-5 mt-5 sh-80">
            <AssessmentsChart assessments={selectedAssessments} />
          </Card>
        </Col>

        <Col lg="12">
          <Card body className="mb-5 mt-5">
            <Table striped>
              <thead>
                <tr>
                  <th scope="col" className="col-4">
                    Circunferências
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {girthMeasurements.map((measurement) => {
                  if (
                    !Number(
                      selectedAssessments.reduce((acc, assessment) => {
                        if (!assessment?.data || !assessment.data[measurement.nome]) return acc;

                        return (assessment.data[measurement.nome] as number) + acc;
                      }, 0)
                    )
                  )
                    return null;

                  return (
                    <tr key={measurement.nome}>
                      <th>{measurement.title}</th>
                      {selectedAssessments.map((assessment, index) => (
                        <td key={index} className="w-10">
                          {assessment?.data && (assessment.data[measurement.nome] as string)
                            ? index === 0 || !selectedAssessments[index - 1]?.data
                              ? (assessment.data[measurement.nome] as string) || '-'
                              : renderValor(assessment.data[measurement.nome] as string, Number(selectedAssessments[index - 1]?.data?.[measurement.nome] ?? 0))
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col lg="12">
          <Card body className="mb-5 mt-5">
            <Table striped>
              <thead>
                <tr>
                  <th scope="col" className="col-4">
                    Dobras cutâneas
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {skinFoldMeasurements.map((measurement) => {
                  if (
                    selectedAssessments.reduce((acc, assessment) => {
                      if (!assessment?.data || !Number(assessment.data[measurement.nome])) return acc;

                      return false;
                    }, true)
                  )
                    return null;

                  return (
                    <tr key={measurement.nome}>
                      <th>{measurement.title}</th>
                      {selectedAssessments.map((assessment, index) => (
                        <td key={index} className="w-10">
                          {assessment?.data && (assessment.data[measurement.nome] as string)
                            ? index === 0 || !selectedAssessments[index - 1]?.data
                              ? (assessment.data[measurement.nome] as string) || '-'
                              : renderValor(assessment.data[measurement.nome] as string, Number(selectedAssessments[index - 1]?.data?.[measurement.nome] ?? 0))
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      <ModalSendPDF />
    </>
  );
};

export default AnthropometricAssessment0a5years;
