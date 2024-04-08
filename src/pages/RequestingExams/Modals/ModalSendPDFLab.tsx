import React, { useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import ModalAddLab from './ModalAddLab';
import { useModalSendPDFLabStore } from '../hooks/ModalSendPDFLabStore';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLabPartnersStore } from '../hooks/LabPartnersStore';
import { Laboratory } from '../../../types/LabPartners';
import { sanitizeString } from '../../../helpers/InputHelpers';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import api from '../../../services/useAxios';
import { useRequestingExamStore } from '../hooks/RequestingExamStore';
import StaticLoading from '../../../components/loading/StaticLoading';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';

const ModalSendPDFLab = () => {
  const showModal = useModalSendPDFLabStore((state) => state.showModal);
  const { id } = useParams<{ id: string }>();

  const toastId = useRef<React.ReactText>();
  const queryClient = useQueryClient();

  const [textObservation, setTextObservation] = useState('');
  const [selectedPartners, setSelectedPartners] = useState<Laboratory[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const selectedExams = useRequestingExamStore((state) => state.selectedExams);
  const patient = useRequestingExamStore((state) => state.patient);

  const { setShowModalSendPDFLab } = useModalSendPDFLabStore();
  const { getPartners } = useLabPartnersStore();
  const { handleOpenModal, handleSelectPartner, removePartner } = useLabPartnersStore();

  const handleChangeTextObservation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextObservation(sanitizeString(event.target.value));
  };

  const onSubmit = async () => {
    toastId.current = notify('Enviando pdf da solicitação de exame, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsSaving(true);

    try {
      await api.patch('/exames-de-sangue-historico/' + id, {
        patient,
        examsSelected: selectedExams.map((exam) => ({
          exam: exam.exam,
          examsBloodSelectedValueObtained: exam.examsBloodSelectedValueObtained,
          id: undefined,
        })),
      });

      const payload = {
        partners: selectedPartners.map((partner) => partner.email),
        textObservation,
      };

      await api.post('/solicitacoes-de-exame-email/partners/' + id, payload);

      updateNotify(toastId.current, 'E-mail enviado com sucesso!', 'Sucesso', 'check', 'success');

      setSelectedPartners([]);
      setShowModalSendPDFLab(false);
      setIsSaving(false);
      setTextObservation('');
    } catch (error) {
      setIsSaving(false);
      updateNotify(toastId.current, 'Erro ao enviar e-mails!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleAddOrRemovePartner = (partner: Laboratory) => {
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

      throw new Error('Erro ao carregar laboratórios parceiros');
    } catch (error) {
      console.error(error);
    }
  };

  const result = useQuery({ queryKey: ['requesting-exams-lab-partners'], queryFn: getLabPartners_, enabled: !!showModal });

  return (
    <Modal className="modal-close-out" size="lg" show={showModal} onHide={() => setShowModalSendPDFLab(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Enviar solicitação para um laboratório parceiro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {result.isLoading ? (
          <div className="sh-30 d-flex justify-content-center align-items-center">
            <StaticLoading />
          </div>
        ) : result.isError ? (
          <div className="sh-30 d-flex justify-content-center align-items-center">Erro ao carregar laboratórios parceiros</div>
        ) : !result.data?.length ? (
          <div className="sh-30 d-flex justify-content-center align-items-center">Nenhum laboratório parceiro cadastrado</div>
        ) : (
          result.data.map((laboratory) => (
            <div className="border-bottom border-separator-light mb-2 pb-2" key={laboratory.id}>
              <Row className="g-0 sh-6">
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{laboratory.nome}</div>
                      <div className="text-small text-muted">{laboratory.email}</div>
                    </div>
                    <div className="d-flex">
                      <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectPartner(laboratory)}>
                        <CsLineIcons icon="edit" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => removePartner(laboratory, queryClient)}
                      >
                        <CsLineIcons icon="bin" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className={`btn-icon ms-1 ${selectedPartners.includes(laboratory) ? 'active' : null}`}
                        onClick={() => handleAddOrRemovePartner(laboratory)}
                      >
                        <span>{selectedPartners.includes(laboratory) ? 'Remover' : 'Selecionar'}</span>
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
            <CsLineIcons icon="plus" /> <span>Cadastrar laboratório</span>
          </Button>
        </div>
        <div className="top-label">
          <Form.Control as="textarea" rows={3} name="emailTextObservation" value={textObservation} onChange={handleChangeTextObservation} />
          <Form.Label>Insira uma observação</Form.Label>
        </div>
        <div className="text-center">
          <AsyncButton
            isSaving={isSaving}
            onClickHandler={onSubmit}
            disabled={!selectedPartners.length}
            variant="primary"
            size="lg"
            className="mt-2 hover-scale-down"
            type="submit"
          >
            Enviar PDF da solicitação
          </AsyncButton>{' '}
        </div>
      </Modal.Body>

      <ModalAddLab />
    </Modal>
  );
};

export default ModalSendPDFLab;
