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
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const [buildShoppingList, setShowShoppingList] = useState<boolean>(false);
  const [buildOrientation, setBuildOrientation] = useState<boolean>(false);

  const [showAssign, setShowAssign] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const onClickDownloadPDF = async () => {
    toastId.current = notify('Gerando pdf do plano alimentar qualitativo, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsDownloading(true);

    try {
      const { data } = await api.post(
        '/plano-alimentar-qualitativo-pdf/' + props.material.id,
        {
          showAssign,
        },
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );

      downloadPDF(data, 'plano-alimentar-qualitativo-' + props.material.id);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Pdf do plano alimentar qualitativo gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      if (buildShoppingList) {
        toastId.current = notify('Gerando pdf da lista de compras, por favor aguarde...', 'Sucesso', 'check', 'success', true);

        const { data } = await api.post(
          '/plano-alimentar-qualitativo-pdf/' + props.material.id + '/lista-de-compras',
          {
            showAssign,
          },
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/pdf',
            },
          }
        );
        downloadPDF(data, 'lista-de-compras-' + props.material.id);

        toast.update(toastId.current, {
          render: <NotificationIcon message={'Pdf da lista de compras gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
          autoClose: 5000,
        });
      }

      if (buildOrientation) {
        toastId.current = notify('Gerando pdf da orientação geral, por favor aguarde...', 'Sucesso', 'check', 'success', true);

        const { data } = await api.post(
          '/plano-alimentar-qualitativo-pdf/' + props.material.id + '/orientacao',
          {
            showAssign,
          },
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/pdf',
            },
          }
        );
        downloadPDF(data, 'orientacao-' + props.material.id);

        toast.update(toastId.current, {
          render: <NotificationIcon message={'Pdf da orientação geral gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
          autoClose: 5000,
        });
      }

      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao gerar pdf!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  const onClickSendEmail = async () => {
    toastId.current = notify('Gerando pdf do plano alimentar qualitativo, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsSending(true);

    try {
      const payload = {
        buildEatingPlan: true,
        buildShoppingList,
        buildOrientationList: buildOrientation,

        showAssign,

        textObservation: '',
      };

      await api.post('/plano-alimentar-qualitativo-email/' + props.material.id, payload);

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
  };

  return (
    <>
      <CsLineIcons icon="file-text" />
      <strong> {props.material.nome}</strong>
      <Row>
        <Col md={4} className="mt-3"></Col>

        <Col md={4}></Col>

        <Col md={3}>
          <label className="mb-3 font-bold">Incluir</label>
          <div>
            <Form.Check
              type="checkbox"
              value={1}
              label="Lista de compras"
              id={`show_assinatura_${props.material.id}`}
              name={`show_assinatura_${props.material.id}`}
              checked={buildShoppingList}
              onChange={(e) => setShowShoppingList(e.target.checked)}
            />
          </div>
          <div>
            <Form.Check
              type="checkbox"
              value={1}
              label="Orientações"
              id={`show_assinatura_${props.material.id}_1`}
              name={`show_assinatura_${props.material.id}`}
              checked={buildOrientation}
              onChange={(e) => setBuildOrientation(e.target.checked)}
            />
          </div>

          <hr />

          <div>
            <Form.Check
              type="checkbox"
              value={1}
              label="Incluir Assinatura"
              id={`show_assinatura_${props.material.id}_2`}
              name={`show_assinatura_${props.material.id}`}
              checked={showAssign}
              onChange={(e) => setShowAssign(e.target.checked)}
            />
          </div>
        </Col>
      </Row>

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
