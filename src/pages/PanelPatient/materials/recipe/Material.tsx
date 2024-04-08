import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { SendingMaterial } from '../../../../types/SendingMaterial';
import api from '../../../../services/useAxios';
import { notify, updateNotify } from '../../../../components/toast/NotificationIcon';
import { downloadPDF } from '../../../../helpers/PdfHelpers';
import { convertIsoToExtensiveBrDate } from '../../../../helpers/DateHelper';
import AsyncButton from '../../../../components/AsyncButton';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

interface MaterialProps {
  material: SendingMaterial<unknown>;
}

export default function Material(props: MaterialProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const onClickDownloadPDF = async () => {
    toastId.current = notify('Gerando pdf da prescrição de receitas culinárias, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsDownloading(true);

    try {
      const payload = {
        showNutrients: true,
        showAssign: true,
      };

      const { data } = await api.post('/prescricao-receita-culinaria-pdf/' + props.material.id, payload, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'prescricao-receita-culinaria-' + props.material.id);

      updateNotify(toastId.current, 'Pdf da prescrição de receitas culinárias gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf da prescrição de receitas culinárias!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <div className="d-flex flex-column">
      <Button variant="link" className="p-0 heading text-start mt-2">
      Receitas culinárias - {props.material.nome}
      </Button>
      <div className="text-alternate mb-2">Disponibilizado em: {convertIsoToExtensiveBrDate(props.material.data)}</div>

      <div className="mt-1 gap-2">
        <AsyncButton
          loadingText="Carregando..."
          variant="primary"
          isSaving={isDownloading}
          className="btn-icon btn-icon-start mb-1 hover-scale-up me-1"
          onClickHandler={onClickDownloadPDF}
        >
          <span>Download</span> <CsLineIcons icon="download" />
        </AsyncButton>
      </div>
    </div>
  );
}
