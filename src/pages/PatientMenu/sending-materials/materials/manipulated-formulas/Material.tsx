import React, { useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { SendingMaterial } from '../../../../../types/SendingMaterial';
import { notify, updateNotify } from '../../../../../components/toast/NotificationIcon';
import api from '../../../../../services/useAxios';
import { downloadPDF } from '../../../../../helpers/PdfHelpers';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../../../components/AsyncButton';

interface MaterialProps {
  material: SendingMaterial<unknown>;
}

export default function Material(props: MaterialProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const onClickDownloadPDF = async () => {
    toastId.current = notify('Gerando pdf da prescrição de fórmulas manipuladas, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsDownloading(true);

    try {
      const id = props.material.id.split('@')[0];

      const { data } = await api.get('/formula-manipulada-prescricao-pdf/' + id, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'solicitacao-de-exame-' + id);

      updateNotify(toastId.current, 'Pdf da prescrição de fórmulas manipuladas gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf da prescrição de fórmulas manipuladas!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const onClickSendEmail = async () => {
    toastId.current = notify('Gerando pdf da prescrição de fórmulas manipuladas, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsSending(true);

    try {
      const id = props.material.id.split('@')[0];

      const payload = {
        textObservation: '',
      };

      await api.post('/formula-manipulada-prescricao-email/' + id, payload);

      updateNotify(toastId.current, 'E-mail enviado com sucesso!', 'Sucesso', 'check', 'success');

      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      updateNotify(toastId.current, 'Erro ao enviar e-mails!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <>
      <CsLineIcons icon="file-text" />
      <strong> {props.material.nome}</strong>

      <Col className="mt-3 text-end">
        <AsyncButton
          loadingText="Carregando..."
          variant="outline-secondary"
          isSaving={isDownloading}
          className="btn-icon btn-icon-end mb-1 me-1"
          onClickHandler={onClickDownloadPDF}
        >
          <span>Download</span> <CsLineIcons icon="download" />
        </AsyncButton>

        <AsyncButton
          loadingText="Enviando..."
          variant="outline-secondary"
          isSaving={isSending}
          className="btn-icon btn-icon-end mb-1"
          onClickHandler={onClickSendEmail}
        >
          <span>Enviar por e-mail</span> <CsLineIcons icon="send" />
        </AsyncButton>
      </Col>
      <div className="border-bottom border-separator-light mb-2 pb-2"></div>
    </>
  );
}
