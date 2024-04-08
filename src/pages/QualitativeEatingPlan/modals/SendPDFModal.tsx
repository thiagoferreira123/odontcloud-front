import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useRef, useState } from 'react';
import { Accordion, Col, Form, Modal, Row } from 'react-bootstrap';
import AsyncButton from '/src/components/AsyncButton';
import NotificationIcon, { notify } from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import api from '/src/services/useAxios';
import { sanitizeString } from '/src/helpers/InputHelpers';
import { useSendPDFModalStore } from '../hooks/modals/SendPDFModalStore';
import { useParams } from 'react-router-dom';
import { useQualitativeEatingPlanStore } from '../hooks/QualitativeEatingPlanStore';

const SendPDFModal = () => {
  const showModal = useSendPDFModalStore((state) => state.showModal);

  const toastId = useRef<React.ReactText>();
  const { id } = useParams();

  const [textObservation, setTextObservation] = useState('');
  const [showAssign, setShowAssign] = useState(true);

  const [buildEatingPlan, setBuildEatingPlan] = useState(true);
  const [buildShoppingList, setBuildShoppingList] = useState(false);
  const [buildOrientationList, setBuildOrientationList] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const shoppingList = useQualitativeEatingPlanStore((state) => state.shoppingList);
  const orientation = useQualitativeEatingPlanStore((state) => state.orientation);

  const { closeModal } = useSendPDFModalStore();

  const handleChangeTextObservation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextObservation(sanitizeString(event.target.value));
  }

  const onSubmit = async () => {
    toastId.current = notify("Gerando pdf do plano alimentar, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsSaving(true);

    try {
      const payload = {
        buildEatingPlan,
        buildShoppingList,
        buildOrientationList,

        showAssign,

        textObservation,
      };

      await api.post('/plano-alimentar-qualitativo-email/' + id, payload);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'E-mail enviado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      closeModal();
      setIsSaving(false);
      setTextObservation('');
    } catch (error) {
      setIsSaving(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao enviar e-mails!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" size="lg" className="modal-close-out">
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
              />{' '}
              Plano Alimentar
            </Accordion.Header>
            <Accordion.Body>
              <Row>
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
                disabled={!shoppingList}
              />{' '}
              Lista de compras
              {!shoppingList
                ? ' - ⚠️ Esse material não foi elaborado, e por tanto, não possui PDF.'
                : ''}
            </Accordion.Header>
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
                disabled={!orientation}
              />{' '}
              Orientações gerais
              {!orientation ? ' - ⚠️ Esse material não foi elaborado, e por tanto, não possui PDF.' : ''}
            </Accordion.Header>
          </Accordion.Item>
        </Accordion>
        <label>Observações</label>
        <Form.Control as="textarea" rows={3} name="emailTextObservation" value={textObservation} onChange={handleChangeTextObservation} />
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton loadingText='Enviando...' className="btn-icon btn-icon-start" isSaving={isSaving} onClickHandler={onSubmit}>
          <CsLineIcons icon="send" /> <span>Enviar</span>
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default SendPDFModal;
