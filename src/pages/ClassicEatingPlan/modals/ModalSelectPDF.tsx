import React, { useRef, useState } from 'react';
import { Col, Form, Modal, Row, } from 'react-bootstrap';
import { useModalsStore } from '../hooks/useModalsStore';
import useClassicPlan from '../hooks/useClassicPlan';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import AsyncButton from '../../../components/AsyncButton';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import api from '../../../services/useAxios';
import { downloadPDF } from '../../../helpers/PdfHelpers';

export type ClassicEatingPdfLayoutOption = 'minimalista' | 'tabela' | 'tabela_colorida';

const ModalSelectPDF = () => {
  const showModalSelectPDF = useModalsStore((state) => state.showModalSelectPDF);
  const planId = useClassicPlan((state) => state.planId);

  const toastId = useRef<React.ReactText>();

  const [pdfLayout, setPdfLayout] = useState<ClassicEatingPdfLayoutOption>('minimalista');
  const [showAmounts, setExibicaoAmounts] = useState(3);
  const [showReplacements, setExibicaoReplacements] = useState(2);
  const [showAssign, setShowAssign] = useState(true);
  const [buildCommentList, setBuildCommentList] = useState(false);
  const [buildOrientation, setBuildOrientation] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const { setShowModalSelectPDF } = useModalsStore();

  const onSubmit = async () => {
    toastId.current = notify('Gerando pdf do plano alimentar, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsSaving(true);

    try {
      const payload = {
        pdfLayout,
        showReplacements: showReplacements === 2,
        showMeasures: showAmounts === 1 || showAmounts === 3,
        showGrams: showAmounts === 2 || showAmounts === 3,
        showAssign,
      };

      const { data } = await api.post('/plano-alimentar-classico-pdf/' + planId, payload, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'plano-alimentar-classico-' + planId);

      updateNotify(toastId.current,'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      if(buildCommentList) {
        toastId.current = notify('Gerando pdf da lista de comentários, por favor aguarde...', 'Sucesso', 'check', 'success', true);

        const { data } = await api.post('/plano-alimentar-classico-pdf/' + planId + '/comentarios', payload, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        });
        downloadPDF(data, 'comentarios-' + planId);

        updateNotify(toastId.current,'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');
      }

      if(buildOrientation) {
        toastId.current = notify('Gerando pdf das orientações gerais, por favor aguarde...', 'Sucesso', 'check', 'success', true);

        const { data } = await api.get(
          '/plano-alimentar-classico-pdf/' + planId + '/orientacao',
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/pdf',
            },
          }
        );
        downloadPDF(data, 'orientacao-' + planId);

        updateNotify(toastId.current,'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');
      }

      setShowModalSelectPDF(false);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      updateNotify(toastId.current,'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <Modal show={showModalSelectPDF} onHide={() => setShowModalSelectPDF(false)} backdrop="static" size="lg" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Download do PDF</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={4}>
              <label className="mb-3 font-bold">Modelo de apresentação do PDF</label>
              <div>
                <Form.Check
                  type="radio"
                  value={'minimalista'}
                  onChange={() => setPdfLayout('minimalista')}
                  checked={pdfLayout === 'minimalista'}
                  label="Minimalista"
                  id="pdfLayout"
                  name="pdfLayout"
                />
                <Form.Check
                  type="radio"
                  value={'tabela'}
                  onChange={() => setPdfLayout('tabela')}
                  checked={pdfLayout === 'tabela'}
                  label="Tabela"
                  id="pdfLayout_tabela"
                  name="pdfLayout"
                />
                <div>
                  <Form.Check
                    type="radio"
                    value={'tabela_colorida'}
                    onChange={() => setPdfLayout('tabela_colorida')}
                    checked={pdfLayout === 'tabela_colorida'}
                    label="Tabela colorida"
                    id="colorSchema"
                    name="colorSchema"
                  />
                </div>
              </div>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <label className="mb-3 mt-4 font-bold">Exibição das quantidades</label>
            <div>
              <Form.Check
                type="radio"
                value={1}
                onChange={() => setExibicaoAmounts(1)}
                checked={showAmounts === 1}
                label="Apenas medidas caseiras"
                id="show_quantidades"
                name="show_quantidades"
              />
              <Form.Check
                type="radio"
                value={2}
                onChange={() => setExibicaoAmounts(2)}
                checked={showAmounts === 2}
                label="Apenas gramas"
                id="show_quantidades_2"
                name="show_quantidades"
              />
              <Form.Check
                type="radio"
                value={3}
                onChange={() => setExibicaoAmounts(3)}
                checked={showAmounts === 3}
                label="Medidas caseiras e gramas"
                id="show_quantidades_3"
                name="show_quantidades"
              />
              <Form.Check
                type="radio"
                value={4}
                onChange={() => setExibicaoAmounts(4)}
                checked={showAmounts === 4}
                label="Somente os alimentos"
                id="show_quantidades_4"
                name="show_quantidades"
              />
            </div>
          </Col>

          <Col md={4}>
            <label className="mb-3 mt-4 font-bold">Exibição das substituições</label>
            <div>
              <Form.Check
                type="radio"
                value={1}
                onChange={() => setExibicaoReplacements(1)}
                checked={showReplacements === 1}
                label="Somente o alimento principal"
                id="show_substituicoes"
                name="show_substituicoes"
              />
              <Form.Check
                type="radio"
                value={2}
                onChange={() => setExibicaoReplacements(2)}
                checked={showReplacements === 2}
                label="Alimento principal e substitutos"
                id="show_substituicoes_1"
                name="show_substituicoes"
              />
            </div>
          </Col>

          <Col md={2}>
            <label className="mb-3 mt-4 font-bold">Assinatura</label>
            <div>
              <Form.Check
                type="checkbox"
                value={1}
                onChange={() => setShowAssign(!showAssign)}
                label="Incluir"
                id="show_assinatura"
                name="show_assinatura"
                checked={showAssign}
              />
            </div>
          </Col>

          <Col md={2}>
            <label className="mb-3 mt-4  font-bold">Incluir</label>
            <div>
              <Form.Check
                type="checkbox"
                value={1}
                onChange={() => setBuildCommentList(!buildCommentList)}
                label="Lista de comentários"
                id="show_assinatura"
                name="show_assinatura"
                checked={buildCommentList}
              />
              <Form.Check
                type="checkbox"
                value={1}
                onChange={() => setBuildOrientation(!buildOrientation)}
                label="Orientações gerais"
                id="show_assinatura"
                name="show_assinatura"
                checked={buildOrientation}
              />
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton className="btn-icon btn-icon-start btn-icon w-100" type="submit" isSaving={isSaving} onClickHandler={onSubmit}>
          <CsLineIcons icon="cloud-download" /> <span>Fazer download do PDF</span>
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSelectPDF;
