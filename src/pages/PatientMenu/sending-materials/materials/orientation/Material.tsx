import AsyncButton from '/src/components/AsyncButton';
import NotificationIcon, { notify } from '/src/components/toast/NotificationIcon';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { convertIsoToBrDate } from '/src/helpers/DateHelper';
import { downloadPDF } from '/src/helpers/PdfHelpers';
import React, { useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '/src/services/useAxios';
import { SendingMaterial } from '/src/types/SendingMaterial';

interface MaterialProps {
  material: SendingMaterial;
}

export default function Material(props: MaterialProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const onClickDownloadPDF = async () => {
    toastId.current = notify("Gerando pdf, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsDownloading(true);

    try {
      const { data } = await api.post('/orientacao-nutricional-pdf/' + props.material.id, {}, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'orientacao-nutricional-' + props.material.id);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Pdf gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      setIsDownloading(false);

    } catch (error) {
      setIsDownloading(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={"Erro ao gerar pdf!"} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  }

  const onClickSendEmail = async () => {
    toastId.current = notify("Gerando pdf, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsSending(true);

    try {
      const payload = {
        textObservation: '',
      };

      await api.post('/orientacao-nutricional-email/' + props.material.id, payload);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'E-mail enviado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao enviar e-mails!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  }

  return (
    <>
      <CsLineIcons icon="file-text" />
      <strong> {props.material.nome} - {convertIsoToBrDate(props.material.data)}</strong>

      <Col className="mt-3 text-end">
        <AsyncButton loadingText='Carregando...' variant='outline-secondary' isSaving={isDownloading} className="btn-icon btn-icon-end mb-1 me-1" onClickHandler={onClickDownloadPDF}>
          <span>Download</span> <CsLineIcons icon="download" />
        </AsyncButton>

        <AsyncButton loadingText='Enviando...' variant='outline-secondary' isSaving={isSending} className="btn-icon btn-icon-end mb-1" onClickHandler={onClickSendEmail}>
          <span>Enviar por e-mail</span> <CsLineIcons icon="send" />
        </AsyncButton>
      </Col>
      <div className="border-bottom border-separator-light mb-2 pb-2"></div>
    </>
  );
}
