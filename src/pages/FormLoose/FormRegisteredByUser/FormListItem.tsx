import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { notify } from '../../../components/toast/NotificationIcon';
import { Link } from 'react-router-dom';
import { useSendFormToWhatsAppModalStore } from '../Hooks/modals/SendFormToWhatsAppModalStore';
import { useConfirmDeleteFormModalStore } from '../Hooks/modals/ConfirmDeleteFormModalStore';
import { Form } from '../../../types/FormBuilder';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useConfigFormModalStore } from '../Hooks/modals/ConfigFormModalStore';

type Props = {
  form: Form;
};

const FormListItem = ({ form }: Props) => {
  const { handleSendFormToWhatsApp } = useSendFormToWhatsAppModalStore();
  const { handleDeleteForm } = useConfirmDeleteFormModalStore();
  const { handleSelectForm } = useConfigFormModalStore();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/formulario-pre-consulta-preencher/${form.key}`);
    notify('Copiado para a área de transferência', '', 'duplicate', 'primary');
  };

  return (
    <Row className="g-0 sh-6">
      <Col>
        <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center border-bottom border-separator-light justify-content-between">
          <div className="d-flex flex-column">
            <h5>{form.nome}</h5>
          </div>
          <div className="d-flex">
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-send-whatsapp">Enviar link para resposta por WhatsApp</Tooltip>}>
              <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-end ms-1" onClick={() => handleSendFormToWhatsApp(form.key as string)}>
                <span>Enviar por WhatsApp</span> <CsLineIcons icon="send" />
              </Button>
            </OverlayTrigger>{' '}
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-copy-link">Copiar link</Tooltip>}>
              <Button onClick={handleCopyLink} variant="outline-primary" size="sm" className="btn-icon btn-icon-end ms-1">
                <span>Copiar link</span> <CsLineIcons icon="link" />
              </Button>
            </OverlayTrigger>{' '}
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-delete">Deletar formulário</Tooltip>}>
              <Button onClick={() => handleDeleteForm(form)} variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1">
                <CsLineIcons icon="bin" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Editar o nome do formulário</Tooltip>}>
              <Button onClick={() => handleSelectForm(form)} variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1">
                <CsLineIcons icon="gear" />
              </Button>
            </OverlayTrigger>{' '}
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-edit">Editar</Tooltip>}>
              <Link to={`/app/ferramentas/editar-formulario/${form.id}`} className="btn btn-sm btn-outline-primary btn-icon btn-icon-only ms-1">
                <CsLineIcons icon="edit" />
              </Link>
            </OverlayTrigger>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default FormListItem;
