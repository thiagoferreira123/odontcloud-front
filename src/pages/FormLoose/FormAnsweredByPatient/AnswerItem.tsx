import { Button, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { useCollectFormFilesModalStore } from '../Hooks/modals/CollectFormFilesModalStore';
import { useFormPreviewModalStore } from '../Hooks/modals/FormPreviewModalStore';
import { useCollectFilesModalStore } from '../Hooks/modals/CollectFilesModalStore';
import { AnswerTypes, useConfirmDeleteAnswerModalStore } from '../Hooks/modals/ConfirmDeleteAnswerModal';
import { AnsweredForm } from '../../../types/FormBuilder';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useModalAddPatientStore } from '../../Dashboard/patients/hooks/ModalAddPatientStore';
import { Patient } from '../../../types/Patient';

type Props = {
  answer: AnsweredForm;
};

const AnswerItem = ({ answer }: Props) => {
  const { handleDeleteAnsweredForm } = useConfirmDeleteAnswerModalStore();
  const { handlePreviewAnsweredForm } = useFormPreviewModalStore();

  const { handleSelectForm } = useCollectFormFilesModalStore();
  const { handleSelectFormToCollectFiles } = useCollectFilesModalStore();
  const { handleSelectPatient } = useModalAddPatientStore();

  const formatDateToPrint = (date: string) => {
    const parsedDate = parseISO(date);

    return format(parsedDate, 'dd/MM/yyyy');
  };

  const handleAddPatient = () => {
    const payload: Patient = {
      name: answer.nome_paciente ?? '',
      photoLink: '',
      email: answer.email_paciente ?? '',
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
      phone: answer.wpp_paciente ?? '',
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
      dateOfLastConsultation: new Date()
    }

    handleSelectPatient(payload);
  }

  return (
    <Col md={12} key={answer.id} className="py-2 border-bottom border-separator-light">
      <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
        <div>
          <h5 className="me-2">{answer.nome}</h5>
          <div className="mb-2 d-flex align-items-center">
            <CsLineIcons icon="user" className="me-2 text-muted" />
            <span> Respondido por: {answer.nome_paciente}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <CsLineIcons icon="email" className="me-2 text-muted" />
            <span> Email: {answer.email_paciente || '---'}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <CsLineIcons icon="phone" className="me-2 text-muted" />
            <span> WhatsApp: {answer.wpp_paciente || '---'}</span>
          </div>
          <div className="mb-2 d-flex align-items-center">
            <CsLineIcons icon="calendar" className="me-2 text-muted" />
            <span> Data: {formatDateToPrint(answer.data)}</span>
          </div>

          <div>
            <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-end" onClick={handleAddPatient}>
              <span>Cadastrar como paciente</span>
            </Button>{' '}
          </div>
        </div>

        <div className="d-flex">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-collect">Colete os arquivos formulário para a pasta do paciente, de um paciente já cadastrado no DietSystem.</Tooltip>
            }
          >
            <Button
              variant="outline-primary"
              size="sm"
              className="btn-icon btn-icon-end ms-1"
              onClick={() => handleSelectForm(answer)}
              disabled={!answer.arquivosAnexados?.length}
            >
              <span>Coletar arquivos</span>
            </Button>
          </OverlayTrigger>{' '}

          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-view">Visualizar prévia das respostas</Tooltip>}>
            <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-5" onClick={() => handlePreviewAnsweredForm(answer)}>
              <CsLineIcons icon="eye" />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-download">Visualizar arquivos</Tooltip>}>
            <Button
              disabled={answer.arquivosAnexados?.length === 0}
              variant="outline-primary"
              size="sm"
              className="btn-icon btn-icon-only ms-1"
              onClick={() => handleSelectFormToCollectFiles(answer)}
            >
              <CsLineIcons icon="cloud-download" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-delete">Deletar</Tooltip>}>
            <Button onClick={() => handleDeleteAnsweredForm(answer, AnswerTypes.NAO_CADASTRADO)} variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-5">
              <CsLineIcons icon="bin" />
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    </Col>
  );
};

export default AnswerItem;
