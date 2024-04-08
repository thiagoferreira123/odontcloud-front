import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { SendingMaterial } from '../../../../types/SendingMaterial';
import { notify, updateNotify } from '../../../../components/toast/NotificationIcon';
import api from '../../../../services/useAxios';
import { downloadPDF } from '../../../../helpers/PdfHelpers';
import AsyncButton from '../../../../components/AsyncButton';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { convertIsoToExtensiveBrDate } from '../../../../helpers/DateHelper';
import { Link } from 'react-router-dom';

interface MaterialProps {
  material: SendingMaterial<unknown>;
}
export default function Material(props: MaterialProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const onClickDownloadPDF = async () => {
    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsDownloading(true);

    try {
      const { data } = await api.get('/material-entregavel-pdf/' + props.material.id, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'material-compartilhado-' + props.material.nome);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <div className="d-flex flex-column">
      <Button variant="link" className="p-0 heading text-start mt-2">
        Materiais compartilhados - {props.material.nome}
      </Button>
      <div className="text-alternate mb-2">Disponibilizado em: {convertIsoToExtensiveBrDate(props.material.data)}</div>

      <div className="mt-1 gap-2">
        {props.material.tabela.includes('https') && !props.material.tabela.includes('anexo-material-profissionais') ? (
          <Link to={props.material.tabela} download target='_blank' className="btn btn-primary btn-icon btn-icon-start mb-1 hover-scale-up me-1">
            <span>Acessar</span> <CsLineIcons icon="eye" />
          </Link>
        ) : props.material.tabela.includes('https') ? (
          <Link to={props.material.tabela} download className="btn btn-primary btn-icon btn-icon-start mb-1 hover-scale-up me-1">
            <span>Download</span> <CsLineIcons icon="download" />
          </Link>
        ) : (
          <AsyncButton
            loadingText="Carregando..."
            variant="primary"
            isSaving={isDownloading}
            className="btn-icon btn-icon-start mb-1 hover-scale-up me-1"
            onClickHandler={onClickDownloadPDF}
          >
            <span>Download</span> <CsLineIcons icon="download" />
          </AsyncButton>
        )}
      </div>
    </div>
  );
}
