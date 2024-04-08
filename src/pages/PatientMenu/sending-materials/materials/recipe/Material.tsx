import AsyncButton from '/src/components/AsyncButton';
import NotificationIcon, { notify } from '/src/components/toast/NotificationIcon';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { downloadPDF } from '/src/helpers/PdfHelpers';
import React, { useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '/src/services/useAxios';
import { SendingMaterial } from '/src/types/SendingMaterial';

interface MaterialProps {
  material: SendingMaterial;
}

export default function Material(props: MaterialProps) {
  const [showNutrients, setShowNutrients] = useState<boolean>(false);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const onClickDownloadPDF = async () => {
    toastId.current = notify("Gerando pdf da prescrição de receitas culinárias, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsDownloading(true);

    try {
      const payload = {
        showNutrients,
      };

      const { data } = await api.post('/prescricao-receita-culinaria-pdf/' + props.material.id, payload, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'prescricao-receita-culinaria-' + props.material.id);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Pdf da prescrição de receitas culinárias gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
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
    toastId.current = notify("Gerando pdf da prescrição de receitas culinárias, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsSending(true);

    try {
      const payload = {
        showNutrients,

        textObservation: '',
      };

      await api.post('/prescricao-receita-culinaria-email/' + props.material.id, payload);

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
      <strong> {props.material.nome}</strong>
      <Row className='mt-2'>
        <Col md={3}>
          <div>
            <Form.Check
              type="checkbox"
              value={1}
              label="Exibir nutrientes"
              id={`show_assinatura_${props.material.id}_2`}
              name={`show_assinatura_${props.material.id}`}
              checked={showNutrients}
              onChange={(e) => setShowNutrients(e.target.checked)}
            />
          </div>
        </Col>
      </Row>

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
