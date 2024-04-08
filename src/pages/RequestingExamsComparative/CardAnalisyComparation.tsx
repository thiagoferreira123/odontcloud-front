import React, { useRef, useState } from 'react';
import { Col, Card, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useExamComparativeStore } from './hooks/ExamComparativeStore';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import SelectExam from './SelectExam';
import { SingleValue } from 'react-select';
import { ExamAnalyse } from '.';
import { toast } from 'react-toastify';
import { RequestingExam } from '../../types/RequestingExam';
import { parseFloatNumber } from '../../helpers/MathHelpers';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { Option } from '../../types/inputs';
import { notify, updateNotify } from '../../components/toast/NotificationIcon';
import api from '../../services/useAxios';
import { downloadPDF } from '../../helpers/PdfHelpers';
import StaticLoading from '../../components/loading/StaticLoading';
import AsyncButton from '../../components/AsyncButton';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';

interface CardAnalisyComparationProps {
  selectedExams: Array<RequestingExam | null>;
  setSelectedExams: React.Dispatch<React.SetStateAction<Array<RequestingExam | null>>>;

  exams: ExamAnalyse[];
}

const renderValor = (valorAtual: string | null, valorAnterior: number | null) => {
  if (valorAtual === null) return '-';
  if (valorAnterior === null) return valorAtual.toString();
  if (isNaN(valorAnterior)) return valorAtual.toString();

  const diferenca = Number(valorAtual) - valorAnterior;
  const icon = diferenca >= 0 ? 'trend-up' : 'trend-down';
  const sinal = diferenca >= 0 ? '+' : '';

  return diferenca ? (
    <>
      {`${valorAtual} (${sinal}${parseFloatNumber(diferenca)})`} <CsLineIcons icon={icon} size={15} className="me-2" />
    </>
  ) : (
    valorAtual
  );
};

const CardAnalisyComparation = (props: CardAnalisyComparationProps) => {
  const { id } = useParams<{ id: string }>();

  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [selectedExamOptions, setSelectedExamOptions] = useState<Option[]>([]);

  const { getExams } = useExamComparativeStore();
  const { setPatientId } = usePatientMenuStore();

  const getExams_ = async () => {
    try {
      if (!id) throw new Error('Id não informado');

      const exams = await getExams(+id);

      if (exams === false) throw new Error('Erro ao buscar avaliações antropométricas');
      setPatientId(+id);

      return exams;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      return [];
    }
  };

  const handleSelectExam = (option: SingleValue<Option>, index: number) => {
    selectedExamOptions[index] = option as Option;
    setSelectedExamOptions([...selectedExamOptions]);

    const assessment = result.data?.find((assessment) => assessment.id == (option as Option).value);
    props.selectedExams[index] = assessment ?? null;
    props.setSelectedExams([...props.selectedExams]);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    const charts = Array.from(document.querySelectorAll('canvas')).map(element => ({name: element.dataset.name, chart: element.toDataURL('image/png')}));

    try {
      const { data } = await api.post(
        '/solicitacoes-de-exame-pdf/paciente/' + id,
        {
          exams: props.selectedExams.map((exam) => exam?.id),
          charts,
        },
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );

      downloadPDF(data, 'compoarativo-solicitacoes-de-exame-' + id);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const result = useQuery({ queryKey: ['requesting-exams-comparative', id], queryFn: getExams_, enabled: !!id });

  if (result.isLoading)
    return (
      <div className="h-50 d-flex justify-content-center align-items-center">
        <StaticLoading />
      </div>
    );

  const options = result.data?.map((exam) => ({ label: new Date(exam.requestDate).toLocaleDateString(), value: exam.id })) ?? [];

  return (
    <Col lg="12" className="mt-5">
      <Card body>
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
          {/* <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">Enviar antropometria por e-mail</Tooltip>}>
            <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start mb-1 me-1" onClick={() => handleShowModal(props.exams)}>
              <CsLineIcons icon="send" />
            </Button>
          </OverlayTrigger> */}
        </div>
        <Table hover>
          <thead>
            <tr>
              <th scope="col" className="col-3"></th>
              <th scope="col" className="w-10">
                <SelectExam options={options} value={selectedExamOptions[0]} setValue={(option) => handleSelectExam(option, 0)} />
              </th>
              <th scope="col" className="w-10">
                <SelectExam options={options} value={selectedExamOptions[1]} setValue={(option) => handleSelectExam(option, 1)} />
              </th>
              <th scope="col" className="w-10">
                <SelectExam options={options} value={selectedExamOptions[2]} setValue={(option) => handleSelectExam(option, 2)} />
              </th>
              <th scope="col" className="w-10">
                <SelectExam options={options} value={selectedExamOptions[3]} setValue={(option) => handleSelectExam(option, 3)} />
              </th>
              <th scope="col" className="w-10">
                <SelectExam options={options} value={selectedExamOptions[4]} setValue={(option) => handleSelectExam(option, 4)} />
              </th>
            </tr>
          </thead>
          <tbody>
            {props.exams.reduce((acc: ExamAnalyse[], e) => {
              if(!acc.find((item) => item.name === e.name)) {
                acc.push(e);
              }
              return acc;
            }, []).map((exam) => (
              <tr key={exam.name}>
                <th scope="row">{exam.name}</th>
                {exam.value.map((value, index) => (
                  <td key={`${exam.name}@@${index}`}>{value ? renderValor(value.toString(), exam.value[index - 1]) : null}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Col>
  );
};

export default CardAnalisyComparation;
