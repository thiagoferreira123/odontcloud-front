import React, { useRef, useState } from 'react';
import { Button, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { useSendPDFModalStore } from './hooks/modals/SendPDFModalStore';
import { useShoppingListModalStore } from './hooks/modals/ShoppingListModalStore';
import { useOrientationModalStore } from './hooks/modals/OrientationModalStore';
import NotificationIcon, { notify } from '../../components/toast/NotificationIcon';
import api from '../../services/useAxios';
import { useParams } from 'react-router-dom';
import { downloadPDF } from '../../helpers/PdfHelpers';
import { toast } from 'react-toastify';
import AsyncButton from '../../components/AsyncButton';

const OptionButtons = () => {
  const { id } = useParams();

  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { showModalSendPDF } = useSendPDFModalStore();
  const { showShoppingListModal } = useShoppingListModalStore();
  const { showOrientationModal } = useOrientationModalStore();

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf do plano alimentar, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.post('/plano-alimentar-qualitativo-pdf/' + id, {}, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'plano-alimentar-qualitativo-' + id);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Pdf gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao gerar pdf!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  return (
    <Col xl={12} className="mb-1 align-items-end text-end">
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-message">Escreva ou escolha orientações relacionadas ao seu plano alimentar.</Tooltip>}>
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={showOrientationModal}>
          <CsLineIcons icon="message" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="tooltip-cart">Crie uma lista de compras com os alimentos principais do plano alimentar.</Tooltip>}
      >
        <Button onClick={showShoppingListModal} variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
          <CsLineIcons icon="cart" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id="tooltip-print">
            Realize o download do PDF do plano alimentar no seu computador.
          </Tooltip>
        }
      >
        <span>
          <AsyncButton
            isSaving={isGeneratingPdf}
            variant="primary"
            loadingText=' '
            size="sm"
            className="btn-icon btn-icon-only mb-1 ms-1"
            type="button"
            onClickHandler={handleDownloadPdf}
          >
            <CsLineIcons icon="print" />
          </AsyncButton>
        </span>
      </OverlayTrigger>

      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-print">Envie os PDF's do plano alimentar para o e-mail do paciente</Tooltip>}>
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={showModalSendPDF}>
          <CsLineIcons icon="send" />
        </Button>
      </OverlayTrigger>

      {/* <ModalOrientation  />
      <ModalShoppingList />
      <ModalFavoritePlan />
      <ModalSelectPDF />
      <ModalSendPDF /> */}
    </Col>
  );
};

export default OptionButtons;
