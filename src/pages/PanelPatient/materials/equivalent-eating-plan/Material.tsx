import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { EquivalentEatingPlanMaterials, SendingMaterial } from '../../../../types/SendingMaterial';
import { notify, updateNotify } from '../../../../components/toast/NotificationIcon';
import api from '../../../../services/useAxios';
import { downloadPDF } from '../../../../helpers/PdfHelpers';
import { convertIsoToExtensiveBrDate } from '../../../../helpers/DateHelper';
import AsyncButton from '../../../../components/AsyncButton';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

interface MaterialProps {
  material: SendingMaterial<EquivalentEatingPlanMaterials>;
}

export default function Material(props: MaterialProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDownloadingOrientation, setIsDownloadingOrientation] = useState<boolean>(false);
  const [isDownloadingShoppingList, setIsDownloadingShoppingList] = useState<boolean>(false);
  const [isDownloadingComments, setIsDownloadingComments] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const onClickDownloadPDF = async () => {
    toastId.current = notify("Gerando pdf's do plano alimentar, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsDownloading(true);

    try {
      const payload = {
        showReplacements: true,
        showMeasures: true,
        showGrams: true,
        showAssign: true,
      };

      const { data } = await api.post('/plano-alimentar-equivalente-pdf/' + props.material.id, payload, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'plano-alimentar-equivalente-' + props.material.id);

      updateNotify(toastId.current, 'Pdf do plano alimentar gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const onClickDownloadOrientationPDF = async () => {
    toastId.current = notify('Gerando pdf das orientações, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsDownloadingOrientation(true);

    try {
      const { data } = await api.get('/plano-alimentar-equivalente-pdf/' + props.material.id + '/orientacao', {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });
      downloadPDF(data, 'orientacao-' + props.material.id);

      updateNotify(toastId.current, 'Pdf das orientações gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsDownloadingOrientation(false);
    } catch (error) {
      setIsDownloadingOrientation(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const onClickDownloadShoppingListPDF = async () => {
    toastId.current = notify('Gerando pdf da lista de compras, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsDownloadingShoppingList(true);

    try {
      const { data } = await api.post(
        '/plano-alimentar-equivalente-pdf/' + props.material.id + '/lista-de-compras',
        {
          parseToKilograms: true,
          showAssign: true,
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

      updateNotify(toastId.current, 'Pdf da lista de compras gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsDownloadingShoppingList(false);
    } catch (error) {
      setIsDownloadingShoppingList(false);
      updateNotify(toastId.current, "Erro ao gerar pdf's!", 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const onClickDownloadCommentsPDF = async () => {
    toastId.current = notify('Gerando pdf dos comentários, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsDownloadingComments(true);

    try {
      const payload = {
        showReplacements: true,
        showMeasures: true,
        showGrams: true,
        showAssign: true,
      };

      const { data } = await api.post('/plano-alimentar-equivalente-pdf/' + props.material.id + '/comentarios', payload, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });
      downloadPDF(data, 'comentarios-' + props.material.id);

      updateNotify(toastId.current, 'Pdf dos comentários gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsDownloadingComments(false);
    } catch (error) {
      setIsDownloadingComments(false);
      updateNotify(toastId.current, "Erro ao gerar pdf's!", 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <div className="d-flex flex-column">
      <Button variant="link" className="p-0 heading text-start mt-2">
        Plano alimentar - {props.material.nome}
      </Button>
      <div className="text-alternate mb-2">Disponibilizado em: {convertIsoToExtensiveBrDate(props.material.data)}</div>

      <div className="mt-1 gap-2">
        <AsyncButton
          loadingText="Carregando..."
          variant="primary"
          isSaving={isDownloading}
          className="btn-icon btn-icon-start mb-1 hover-scale-up me-1 ms-1"
          onClickHandler={onClickDownloadPDF}
        >
          <span>Plano alimentar</span> <CsLineIcons icon="download" />
        </AsyncButton>

        {props.material.options?.orientacao === 'S' ? (
          <AsyncButton
            loadingText="Carregando..."
            isSaving={isDownloadingOrientation}
            variant="primary"
            className="btn-icon btn-icon-start mb-1 hover-scale-up ms-1"
            onClickHandler={onClickDownloadOrientationPDF}
          >
            <CsLineIcons icon="download" /> <span>Orientações</span>
          </AsyncButton>
        ) : null}

        {props.material.options?.lista_compras === 'S' ? (
          <AsyncButton
            loadingText="Carregando..."
            isSaving={isDownloadingShoppingList}
            variant="primary"
            className="btn-icon btn-icon-start mb-1 hover-scale-up ms-1"
            onClickHandler={onClickDownloadShoppingListPDF}
          >
            <CsLineIcons icon="download" /> <span>Lista de compras</span>
          </AsyncButton>
        ) : null}

        {props.material.options?.comentario === 'S' ? (
          <AsyncButton
            loadingText="Carregando..."
            isSaving={isDownloadingComments}
            variant="primary"
            className="btn-icon btn-icon-start mb-1 hover-scale-up ms-1"
            onClickHandler={onClickDownloadCommentsPDF}
          >
            <CsLineIcons icon="download" /> <span>Comentários</span>
          </AsyncButton>
        ) : null}
      </div>
    </div>
  );
}
