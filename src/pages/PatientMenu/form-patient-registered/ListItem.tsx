import { Badge, Button, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { AnswerTypes, useConfirmDeleteAnswerModalStore } from '../../FormLoose/Hooks/modals/ConfirmDeleteAnswerModal';
import { useFormPreviewModalStore } from '../../FormLoose/Hooks/modals/FormPreviewModalStore';
import { Link } from 'react-router-dom';
import { AnsweredForm } from '../../../types/FormBuilder';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import FormPreviewModal from '../../FormLoose/Modals/FormPreviewModal';
import { appRoot } from '../../../routes';
import { useConfigFormModalStore } from './hooks/ConfigFormModalStore';

type Props = {
  answer: AnsweredForm;
};

const ListItem = ({ answer }: Props) => {
  const { id } = useParams();

  const badgeText = answer.resposta === null ? 'Aguardando respostas' : 'Respondido';

  const { handleDeleteAnsweredForm } = useConfirmDeleteAnswerModalStore();
  const { handlePreviewAnsweredForm } = useFormPreviewModalStore();
  const { handleSelectForm } = useConfigFormModalStore();

  return (
    <Col md={12} className="border-bottom border-separator-light py-3">
      <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 align-items-center justify-content-between">
        <div className="d-flex flex-column">
          <div>{answer.nome}</div>
        </div>

        <div className="d-flex">
          <div className="mt-2 me-3">
            <Badge bg={answer.resposta === null ? 'warning' : 'success'}>{badgeText}</Badge>{' '}
          </div>

          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Visualizar respostas do formulário</Tooltip>}>
            <Button
              disabled={answer.resposta === null}
              variant="outline-primary"
              size="sm"
              className="btn-icon btn-icon-only mb-1 me-1"
              onClick={() => handlePreviewAnsweredForm(answer)}
            >
              <CsLineIcons icon="eye" />
            </Button>
          </OverlayTrigger>{' '}

          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
            <Button
              onClick={() => handleDeleteAnsweredForm(answer, AnswerTypes.CADASTRADO)}
              variant="outline-primary"
              size="sm"
              className="btn-icon btn-icon-only mb-1 me-1"
            >
              <CsLineIcons icon="bin" />
            </Button>
          </OverlayTrigger>{' '}

          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
            <Button
              onClick={() => handleSelectForm(answer)}
              variant="outline-primary"
              size="sm"
              className="btn-icon btn-icon-only mb-1 me-1"
            >
              <CsLineIcons icon="gear" />
            </Button>
          </OverlayTrigger>{' '}

          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Editar</Tooltip>}>
            <Link
              to={`${appRoot}/formulario-pre-consulta-paciente-cadastrado/${answer.id}/${id}?editing=true`}
              className="btn btn-sm btn-outline-primary btn-icon btn-icon-only mb-1 me-1"
            >
              <CsLineIcons icon="edit" />
            </Link>
          </OverlayTrigger>{' '}
        </div>
      </div>

      <FormPreviewModal />
    </Col>
  );
};

export default ListItem;
