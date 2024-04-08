import React, { useRef, useState } from 'react';
import { Attachment } from './hooks';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import api from '../../../services/useAxios';
import { downloadPDF } from '../../../helpers/PdfHelpers';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';

type Props = {
  attachment: Attachment;
};

export default function AttachmentViewButton({ attachment }: Props) {
  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.get('/material-entregavel-pdf/' + attachment.id, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, attachment.name);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return attachment.s3_link ? (
    <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Fazer download do material</Tooltip>}>
      <Link to={attachment.s3_link} download className="btn btn-sm btn-outline-secondary btn-icon btn-icon-only ms-1">
        <CsLineIcons icon="download" />
      </Link>
    </OverlayTrigger>
  ) : attachment.user_link ? (
    <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Acessar link do material</Tooltip>}>
      <Link to={attachment.user_link} target="_blank" className="btn btn-sm btn-outline-secondary btn-icon btn-icon-only ms-1">
        <CsLineIcons icon="eye" />
      </Link>
    </OverlayTrigger>
  ) : attachment.user_text ? (
    <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Fazer download</Tooltip>}>
      <span>
        <AsyncButton
          isSaving={isGeneratingPdf}
          onClickHandler={handleDownloadPdf}
          loadingText=' '
          variant="outline-secondary"
          size="sm"
          className="btn-icon btn-icon-only ms-1"
        >
          <CsLineIcons icon="file-text" />
        </AsyncButton>
      </span>
    </OverlayTrigger>
  ) : null;
}
