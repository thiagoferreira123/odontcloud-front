import React, { useRef, useState } from 'react';
import { Accordion, Col, Form, Modal, Row } from 'react-bootstrap';
import { useModalsStore } from '../hooks/useModalsStore';
import useClassicPlan from '../hooks/useClassicPlan';
import { toast } from 'react-toastify';
import { sanitizeString } from '../../../helpers/InputHelpers';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import api from '../../../services/useAxios';
import AsyncButton from '../../../components/AsyncButton';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { ClassicEatingPdfLayoutOption } from './ModalSelectPDF';

const ModalSendPDF = () => {
  const showModalSendPDF = useModalsStore((state) => state.showModalSendPDF);
  const planId = useClassicPlan((state) => state.planId);

  const toastId = useRef<React.ReactText>();

  const [pdfLayout, setPdfLayout] = useState<ClassicEatingPdfLayoutOption>('minimalista');
  const [showAmounts, setExibicaoAmounts] = useState(3);
  const [showReplacements, setExibicaoReplacements] = useState(2);
  const [showAssign, setShowAssign] = useState(true);

  const [parseToKilograms, setParseToKilograms] = useState(false);

  const [textObservation, setTextObservation] = useState('');

  const [buildEatingPlan, setBuildEatingPlan] = useState(true);
  const [buildShoppingList, setBuildShoppingList] = useState(false);
  const [buildOrientationList, setBuildOrientationList] = useState(false);
  const [buildCommentList, setBuildCommentList] = useState(false);
  const [buildMicronutrients, setBuildMicronutrients] = useState(false);

  const itensListaCompra = useClassicPlan((state) => state.itensListaCompra);
  const orientations = useClassicPlan((state) => state.orientations);
  const meals = useClassicPlan((state) => state.meals);

  const [isSaving, setIsSaving] = useState(false);

  const { setShowModalSendPDF } = useModalsStore();

  const handleChangeTextObservation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextObservation(sanitizeString(event.target.value));
  };

  const onSubmit = async () => {
    toastId.current = notify("Gerando pdf's do plano alimentar, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsSaving(true);

    try {
      const eatingPlanOptions = {
        showReplacements: showReplacements === 2,
        showMeasures: showAmounts === 1 || showAmounts === 3,
        showGrams: showAmounts === 2 || showAmounts === 3,
        showAssign,
        pdfLayout,
      };

      const shoppingListOptions = {
        parseToKilograms,
      };

      const payload = {
        buildEatingPlan,
        buildShoppingList,
        buildOrientationList,
        buildCommentList,
        buildMicronutrients,

        eatingPlanOptions,
        shoppingListOptions,

        textObservation,
      };

      await api.post('/plano-alimentar-classico-email/' + planId, payload);

      updateNotify(toastId.current, 'E-mails enviados com sucesso!', 'Sucesso', 'check', 'success');

      setShowModalSendPDF(false);
      setIsSaving(false);
      setTextObservation('');
    } catch (error) {
      setIsSaving(false);
      updateNotify(toastId.current, 'Erro ao enviar e-mails!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <Modal show={showModalSendPDF} onHide={() => setShowModalSendPDF(false)} backdrop="static" size="lg" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Enviar PDF's para o e-mail do paciente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="eatingPlan">
            <Accordion.Header as="div">
              <Form.Check
                type="checkbox"
                id="basicCheckbox"
                className="me-2"
                value={1}
                onChange={() => setBuildEatingPlan(!buildEatingPlan)}
                checked={buildEatingPlan}
                disabled={!meals.length}
              />{' '}
              Plano Alimentar
            </Accordion.Header>
            <Accordion.Body>
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
                  <label className="mb-3 font-bold">Exibição das quantidades</label>
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
                  <label className="mb-3 font-bold">Exibição das substituições</label>
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

                <Col md={4}>
                  <label className="mb-3 font-bold">Assinatura</label>
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
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="shoppingList">
            <Accordion.Header as="div">
              <Form.Check
                type="checkbox"
                id="basicCheckbox"
                className="me-2"
                value={1}
                onChange={() => setBuildShoppingList(!buildShoppingList)}
                checked={buildShoppingList}
                disabled={!itensListaCompra.filter((item) => typeof item.id == 'number').length}
              />{' '}
              Lista de compras
              {!itensListaCompra.filter((item) => typeof item.id == 'number').length
                ? ' - ⚠️ Esse material não foi elaborado, e por tanto, não possui PDF.'
                : ''}
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <Form.Check
                  type="checkbox"
                  label="Transformar em KG"
                  id="stackedRadio1"
                  name="stackedRadio1"
                  value={1}
                  onChange={() => setParseToKilograms(!parseToKilograms)}
                  checked={parseToKilograms}
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="orientations">
            <Accordion.Header as="div">
              <Form.Check
                type="checkbox"
                id="show_assinatura"
                className="me-2"
                value={1}
                onChange={() => setBuildOrientationList(!buildOrientationList)}
                checked={buildOrientationList}
                disabled={!orientations.length}
              />{' '}
              Orientações gerais
              {!orientations.length ? ' - ⚠️ Esse material não foi elaborado, e por tanto, não possui PDF.' : ''}
            </Accordion.Header>
          </Accordion.Item>

          <Accordion.Item eventKey="comments">
            <Accordion.Header as="div">
              <Form.Check
                type="checkbox"
                id="basicCheckbox"
                className="me-2"
                value={1}
                onChange={() => setBuildCommentList(!buildCommentList)}
                checked={buildCommentList}
                disabled={!meals.filter((meal) => meal.obs).length}
              />{' '}
              Comentários das refeições
              {!meals.filter((meal) => meal.obs).length ? ' - ⚠️ Esse material não foi elaborado, e por tanto, não possui PDF.' : ''}
            </Accordion.Header>
          </Accordion.Item>

          <Accordion.Item eventKey="micronutrients">
            <Accordion.Header as="div">
              <Form.Check
                type="checkbox"
                id="basicCheckbox"
                className="me-2"
                value={1}
                onChange={() => setBuildMicronutrients(!buildMicronutrients)}
                checked={buildMicronutrients}
                disabled={!meals.filter((meal) => meal.alimentos.length).length}
              />{' '}
              Relatório de micronutrientes
              {!meals.filter((meal) => meal.alimentos.length).length ? ' - ⚠️ Esse material não foi elaborado, e por tanto, não possui PDF.' : ''}
            </Accordion.Header>
          </Accordion.Item>
        </Accordion>
        <label>Observações</label>
        <Form.Control as="textarea" rows={3} name="emailTextObservation" value={textObservation} onChange={handleChangeTextObservation} />
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton loadingText="Enviando..." className="btn-icon btn-icon-start" isSaving={isSaving} onClickHandler={onSubmit}>
          <CsLineIcons icon="send" /> <span>Enviar</span>
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSendPDF;
