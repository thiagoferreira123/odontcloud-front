import React, { useRef, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import ModalAddFormulated from './modals/ModalAddFormulated';
import { useManipuledFormulaStore } from './hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import { useParams } from 'react-router-dom';
import Templates from './Templates';
import { Editor } from '@tinymce/tinymce-react';
import AsyncButton from '../../components/AsyncButton';
import NotificationIcon, { notify } from '../../components/toast/NotificationIcon';
import { downloadPDF } from '../../helpers/PdfHelpers';
import api from '../../services/useAxios';
import { toast } from 'react-toastify';
import { useModalSendPDFStore } from './hooks/modals/ModalSendPDFStore';
import ModalSendPDF from './modals/ModalSendPDF';
import ModalSendPDFLab from './modals/ModalSendPDFLab';
import { useModalSendPDFPharmacyStore } from './hooks/modals/ModalSendPDFPharmacyStore';
import { useModalAddFormulatedStore } from './hooks/modals/ModalAddFormulatedStore';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';

const Manipulatedfórmulas = () => {
  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();

  const { getManipuledFormula, persistManipuledFormula, changeContent } = useManipuledFormulaStore();
  const { setShowModalSendPDFPharmacy } = useModalSendPDFPharmacyStore();
  const { setShowModalSendPdfEmail } = useModalSendPDFStore();
  const { showModalAddFormulated } = useModalAddFormulatedStore();
  const { setPatientId } = usePatientMenuStore();

  const getManipuledFormula_ = async () => {
    try {
      if (!id) throw new Error('No id provided for the assessment');

      const result = await getManipuledFormula(+id);

      if (result === false) throw new Error('Erro ao buscar fórmula manipulada');

      result.idPaciente && setPatientId(result.idPaciente);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onSubmit = async () => {
    try {
      setIsSaving(true);

      if (!id) throw new Error('No id provided for the assessment');

      const result = await persistManipuledFormula(id, queryClient);

      if (result === false) throw new Error('Erro ao salvar fórmula manipulada');

      notify('Fórmula manipulada salva com sucesso', 'Sucesso', 'check', 'success');

      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Erro ao salvar fórmula manipulada', 'Erro', 'close', 'danger');
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    await onSubmit();

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.get('/formula-manipulada-prescricao-pdf/' + id, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'formula-manipulada-' + id);

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

  const result = useQuery({ queryKey: ['manipulated-formula', id], queryFn: getManipuledFormula_ });

  if (result.isLoading) {
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );
  } else if (result.isError) {
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <div className="text-center w-100">
          <h2 className="mb-3">Erro ao buscar fórmula manipulada</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <PatientMenuRow />

      <Row>
        <Col xs={6}>
          <Templates />
        </Col>
        <Col xs={6}>
          <Card>
            <Card.Body className="editor-container text-center">
              <label className="text-center">Fórmulas selecionadas para o paciente</label>
              <label className="mb-1 text-muted">
                As fórmulas não estão acessíveis no aplicativo móvel; portanto, devem ser enviadas por e-mail ou entregues impressas durante a consulta.
              </label>
              <div className="d-flex justify-content-end mb-2 text-end">
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-4">Cadastrar uma nova fórmula que não existe no OdontCloud</Tooltip>}>
                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={showModalAddFormulated}>
                    <CsLineIcons icon="plus" />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-4">Gerar PDF da prescrição.</Tooltip>}>
                  <span>
                    <AsyncButton
                      isSaving={isGeneratingPdf}
                      loadingText=" "
                      variant="outline-primary"
                      size="sm"
                      className="btn-icon btn-icon-only ms-1"
                      onClickHandler={handleDownloadPdf}
                    >
                      <CsLineIcons icon="print" />
                    </AsyncButton>
                  </span>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-4">Enviar para uma farmácia parceira</Tooltip>}>
                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => setShowModalSendPDFPharmacy(true)}>
                    <CsLineIcons icon="send" />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-4">Enviar para o e-mail do paciente</Tooltip>}>
                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => setShowModalSendPdfEmail(true)}>
                    <CsLineIcons icon="send" />
                  </Button>
                </OverlayTrigger>
              </div>

              <Editor
                apiKey="bef3ulc00yrfvjjiawm3xjxj41r1k2kl33t9zlo8ek3s1rpg"
                init={{
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                  table: {
                    title: 'Table',
                    items: 'inserttable | cell row column | advtablesort | tableprops deletetable',
                  },
                  language: 'pt_BR',
                }}
                value={result.data?.conteudo || ''}
                onEditorChange={(content) => changeContent(content, id ?? '', queryClient)}
              />

              <div className="text-center mt-3">
                <AsyncButton isSaving={isSaving} size="lg" onClickHandler={onSubmit}>
                  Salvar prescrição
                </AsyncButton>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ModalAddFormulated />

      <ModalSendPDF />
      <ModalSendPDFLab />
    </>
  );
};

export default Manipulatedfórmulas;
