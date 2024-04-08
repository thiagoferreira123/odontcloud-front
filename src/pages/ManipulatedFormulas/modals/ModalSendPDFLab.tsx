import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import ModalAddPharmacy from './ModalAddPharmacy';
import { useParams } from 'react-router-dom';
import { sanitizeString } from '/src/helpers/InputHelpers';
import NotificationIcon, { notify } from '/src/components/toast/NotificationIcon';
import api from '/src/services/useAxios';
import { toast } from 'react-toastify';
import AsyncButton from '/src/components/AsyncButton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '/src/components/loading/StaticLoading';
import { useModalSendPDFPharmacyStore } from '../hooks/modals/ModalSendPDFPharmacyStore';
import { PharmacyPartner, usePharmacyPartnersStore } from '../hooks/PharmacyPartnersStore';
import Empty from '../../../components/Empty';
import { AxiosError } from 'axios';

const ModalSendPDFLab = () => {
  const showModal = useModalSendPDFPharmacyStore((state) => state.showModal);
  const { id } = useParams<{ id: string }>();

  const toastId = useRef<React.ReactText>();
  const queryClient = useQueryClient();

  const [textObservation, setTextObservation] = useState('');
  const [selectedPartners, setSelectedPartners] = useState<PharmacyPartner[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const { setShowModalSendPDFPharmacy } = useModalSendPDFPharmacyStore();
  const { getPartners } = usePharmacyPartnersStore();
  const { handleOpenModal, handleSelectPartner, removePartner } = usePharmacyPartnersStore();

  const handleChangeTextObservation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextObservation(sanitizeString(event.target.value));
  };

  const onSubmit = async () => {
    toastId.current = notify('Enviando pdf da prescrição de fórmulas manipuladas, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsSaving(true);

    try {
      const payload = {
        partners: selectedPartners.map((partner) => partner.email),
        textObservation,
      };

      await api.post('/formula-manipulada-prescricao-email/partners/' + id, payload);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'E-mail enviado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      setSelectedPartners([]);
      setShowModalSendPDFPharmacy(false);
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

  const handleAddOrRemovePartner = (partner: PharmacyPartner) => {
    const index = selectedPartners.findIndex((selectedPartner) => selectedPartner.id === partner.id);

    if (index === -1) {
      setSelectedPartners([...selectedPartners, partner]);
    } else {
      const newSelectedPartners = selectedPartners.filter((selectedPartner) => selectedPartner.id !== partner.id);
      setSelectedPartners(newSelectedPartners);
    }
  };

  const getLabPartners_ = async () => {
    try {
      const result = await getPartners();

      if (result !== false) return result;

      throw new Error('Erro ao carregar farmácias parceiras');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;

      return [];
    }
  };

  const result = useQuery({ queryKey: ['pharmacy-partners'], queryFn: getLabPartners_, enabled: !!showModal });

  return (
    <Modal className="modal-close-out" size="lg" show={showModal} onHide={() => setShowModalSendPDFPharmacy(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Enviar solicitação para uma farmácia parceira</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {result.isLoading ? (
          <div className="sh-30 d-flex justify-content-center align-items-center">
            <StaticLoading />
          </div>
        ) : result.isError ? (
          <div className="sh-30 d-flex justify-content-center align-items-center">Erro ao carregar farmácias parceiras</div>
        ) : !result.data?.length ? (
          <div className="sh-30 d-flex justify-content-center align-items-center">
            <Empty message="Nenhuma farmácia parceira cadastrado" />
          </div>
        ) : (
          result.data.map((pharmacy) => (
            <div className="border-bottom border-separator-light mb-2 pb-2" key={pharmacy.id}>
              <Row className="g-0 sh-6">
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{pharmacy.name}</div>
                      <div className="text-small text-muted">{pharmacy.email}</div>
                    </div>
                    <div className="d-flex">
                      <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectPartner(pharmacy)}>
                        <CsLineIcons icon="edit" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => removePartner(pharmacy, queryClient)}
                      >
                        <CsLineIcons icon="bin" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className={`btn-icon ms-1 ${selectedPartners.includes(pharmacy) ? 'active' : null}`}
                        onClick={() => handleAddOrRemovePartner(pharmacy)}
                      >
                        <span>{selectedPartners.includes(pharmacy) ? 'Remover' : 'Selecionar'}</span>
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))
        )}

        <div className="d-flex justify-content-center">
          <Button variant="outline-primary" className="btn-icon btn-icon-start mb-5" onClick={handleOpenModal}>
            <CsLineIcons icon="plus" /> <span>Cadastrar farmácia</span>
          </Button>
        </div>
        <div className="top-label">
          <Form.Control as="textarea" rows={3} name="emailTextObservation" value={textObservation} onChange={handleChangeTextObservation} />
          <Form.Label>Insira uma observação</Form.Label>
        </div>
        <div className="text-center">
          <AsyncButton isSaving={isSaving} onClickHandler={onSubmit} variant="primary" size="lg" className="mt-2 hover-scale-down" type="submit">
            Enviar PDF da solicitação
          </AsyncButton>{' '}
        </div>
      </Modal.Body>

      <ModalAddPharmacy />
    </Modal>
  );
};

export default ModalSendPDFLab;
