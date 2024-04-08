import { Button, Card, CardBody, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import HtmlHead from '../../components/html-head/HtmlHead';
import * as Icon from 'react-bootstrap-icons';
import { useMetabolicTrakingLooseStore } from './hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import { notify } from '../../components/toast/NotificationIcon';
import AsyncButton from '../../components/AsyncButton';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { appRoot } from '../../routes';
import { Patient } from '../../types/Patient';
import { MetabolicTracking } from '../MetabolicTrakingLooseResponse/hooks/types';
import { useModalAddPatientStore } from '../Dashboard/patients/hooks/ModalAddPatientStore';
import ModalAddPatient from '../Dashboard/patients/modals/ModalAddPatient';
import { useSelectTrackingForPatientModalStore } from './hooks/SelectTrackingForPatientModalStore';
import SelectTrackingForPatientModal from './modals/SelectForPatientModal';
import SendTrackingToWhatsAppModal from './modals/SendFormToWhatsAppModal';
import { useSendTrackingToWhatsAppModalStore } from './hooks/SendTrackingToWhatsAppModalStore';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { useConfirmDeleteTrackingModalStore } from './hooks/ConfirmDeleteTrackingModalStore';
import ConfirmDeleteMetabolicTrakingModal from './modals/ConfirmDeleteFormModal';

export default function MetabolicTrakingLoose() {
  const queryClient = useQueryClient();
  const title = 'Rastreamento metabolico pré-consulta';
  const [isCreating, setIsCreating] = useState(false);

  const { getMetabolicTrakingLooses, createMetabolicTrakingLoose } = useMetabolicTrakingLooseStore();
  const { handleSelectPatient } = useModalAddPatientStore();
  const { handleSelectTracking } = useSelectTrackingForPatientModalStore();
  const { handleShowSendTrackingToWppModal } =  useSendTrackingToWhatsAppModalStore();
  const { handleDeleteMetabolicTracking } = useConfirmDeleteTrackingModalStore();

  const getMetabolicTrakingLooses_ = async () => {
    try {
      const response = await getMetabolicTrakingLooses();

      if (!response) throw new Error('Erro ao buscar rastreamentos metabólicos');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['metabolic-tracking-loose'], queryFn: getMetabolicTrakingLooses_ });
  const answeredTrackings = result.data?.filter((tracking) => tracking.name_patient) ?? [];

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  if (result.isError) return <div className="vh-100 w-100 d-flex align-items-center pb-5">Ocorreu um erro ao buscar rastreamentos metabólicos avulsos</div>;

  const createMetabolicTrakingLoose_ = async () => {
    setIsCreating(true);
    try {
      const response = await createMetabolicTrakingLoose(queryClient);

      if (!response) throw new Error('Erro ao criar rastreamento metabólico avulso');

      setIsCreating(false);

      return response;
    } catch (error) {
      setIsCreating(false);
      console.error(error);
      throw error;
    }
  };

  const handleCopyToClipboard = () => {
    const actualTracking = result.data?.find((tracking) => !tracking.tracking_full?.length && tracking.key?.length);

    if (!actualTracking?.key) return console.error('Chave de rastreamento não encontrada');

    const el = document.createElement('textarea');
    el.value = `${location.origin}/rastreamento-metabolico/${actualTracking.key}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    notify('Link copiado para a área de transferência', 'Sucesso', 'check', 'success');
  };
  
  const handleSendFormToWhatsApp = () => {
    const actualTracking = result.data?.find((tracking) => !tracking.tracking_full?.length && tracking.key?.length);

    if (!actualTracking?.key) return console.error('Chave de rastreamento não encontrada');

    handleShowSendTrackingToWppModal(actualTracking.key);
  }

  const handleAddPatient = (tracking: MetabolicTracking) => {
    const payload: Patient = {
      name: tracking.name_patient ?? '',
      photoLink: '',
      email: tracking.email ?? '',
      gender: 1,
      pregnant: 0,
      dateOfBirth: '',
      reasonForConsultation: '',
      consultationLocation: 0,
      consultationCompletedOrPending: 'Finalizada',
      patientActiveOrInactive: 0,
      passwordMobileAndWeb: 0,
      cpf: '',
      ddiCountry: '',
      ddiCountryNumber: '',
      phone: tracking.wpp ?? '',
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      houseNumber: '',
      observation: '',
      appPlansOnOrOff: 1,
      appAnthropometryOnOrOff: 1,
      appGoalsOnOrOff: 1,
      appRecipesOnOrOff: 1,
      appSuplementationOnOrOff: 1,
      appDialyOnOrOff: 1,
      inactivateAppDate: '',
      deviceToken: '',
      age: 0,
      dateOfFirstConsultation: new Date(),
      dateOfLastConsultation: new Date(),
    };

    handleSelectPatient(payload);
  };

  return (
    <>
      <HtmlHead title={title} />
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
      </div>

      <Card className="mt-5">
        <CardBody>
          {answeredTrackings.map((tracking) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={tracking.id}>
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div className="mb-2 d-flex align-items-center">
                        <Icon.People className="me-2" />
                        <span className="text-medium"> Respondido por: {tracking.name_patient}</span>
                      </div>
                      <div className="mb-2 d-flex align-items-center">
                        <Icon.Envelope className="me-2" />
                        <span className="text-medium"> Email: {tracking.email || '---'}</span>
                      </div>
                      <div className="mb-2 d-flex align-items-center">
                        <Icon.Phone className="me-2" />
                        <span> WhatsApp: {tracking.wpp || '---'}</span>
                      </div>
                      <div>
                        <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-end" onClick={() => handleAddPatient(tracking)}>
                          <span>Cadastrar como paciente</span>
                        </Button>{' '}
                      </div>
                    </div>

                    <div className="d-flex">
                      <Link to={`${appRoot}/rastreamento-metabolico/${tracking.id}`} className="btn btn-sm btn-outline-secondary ms-1">
                        Visualizar
                      </Link>
                      <Button variant="outline-secondary" size="sm" className="ms-1" onClick={() => handleSelectTracking(tracking)}>
                        Vincular a um paciente cadastrado
                      </Button>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-delete">Deletar formulário</Tooltip>}>
                        <Button onClick={() => handleDeleteMetabolicTracking(tracking)} variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1">
                          <CsLineIcons icon="bin" />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </div>
                </Col>
              </div>
            ))
          }

          <div className="mt-5 text-center">
            {!result.data?.find((tracking) => !tracking.tracking_full?.length && tracking.key?.length) ? (
              <>
                <h5>Você ainda não possui um rastreamento metabólico pré-consulta, gostaria de criar um?</h5>{' '}
                <AsyncButton loadingText='Aguarde, criando rastreamento metabólico... ' isSaving={isCreating} size="lg" onClickHandler={createMetabolicTrakingLoose_}>
                  Clique aqui
                </AsyncButton>
              </>
            ) : (
              <>
              <Button size="lg" className='me-2' variant="outline-secondary" onClick={handleCopyToClipboard}>
                Copiar link <Icon.Link/>
              </Button>
              <Button size="lg" variant="outline-secondary" onClick={() => handleSendFormToWhatsApp()}>
                Enviar por WhatsApp <Icon.Whatsapp/>
              </Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      <ModalAddPatient />
      <SendTrackingToWhatsAppModal />
      <SelectTrackingForPatientModal />
      <ConfirmDeleteMetabolicTrakingModal />
    </>
  );
}
