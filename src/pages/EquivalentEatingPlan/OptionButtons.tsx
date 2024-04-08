import React, { useRef, useState } from 'react';
import { Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import ModalReplacementLists from './modals/ModalReplacementLists';
import { listGroups } from './hooks/equivalentPlanListStore/initialState';
import { useModalsStore } from './hooks/modalsStore';
import ModalShoppingList from './modals/ModalShoppingList';
import ModalOrientation from './modals/ModalObservation';
import ModalFavoritePlan from './modals/ModalFavoritePlan';
import { useMicronutrientStore } from './hooks/micronutrientStore';
import ModalSelectPDF from './modals/ModalSelectPDF';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import AsyncButton from '/src/components/AsyncButton';
import api from '/src/services/useAxios';
import { downloadPDF } from '/src/helpers/PdfHelpers';
import { useEquivalentEatingPlanStore } from './hooks/equivalentEatingPlanStore';
import { useEquivalentEatingPlanListStore } from './hooks/equivalentPlanListStore';
import ModalSendPDF from './modals/ModalSendPDF';

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const OptionButtons = () => {
  const showModalShoppingList = useModalsStore((state) => state.showModalShoppingList);
  const showModalOrientation = useModalsStore((state) => state.showModalOrientation);
  const showModalFavoritePlan = useModalsStore((state) => state.showModalFavoritePlan);
  const showModalReplacementLists = useModalsStore((state) => state.showModalReplacementLists);

  const planId = useEquivalentEatingPlanStore((state) => state.planId);

  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const showMicronutrientsCard = useMicronutrientStore((state) => state.showMicronutrientsCard);
  const { setShowMicronutrientsCard } = useMicronutrientStore();

  const { setSelectedGroup } = useEquivalentEatingPlanListStore();
  const { setShowModalShoppingList, setShowModalOrientation, setShowModalFavoritePlan, setShowModalReplacementLists, setShowModalSelectPDF, setShowModalSendPDF } = useModalsStore();

  const handleShowModalReplacementLists = () => {
    setSelectedGroup(listGroups[0]);
    setShowModalReplacementLists(true);
  };

  const handleCloseModalReplacementLists = () => {
    setSelectedGroup(null);
    setShowModalReplacementLists(false);
  };

  const handleDownloadMicronutrientsPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf da macro e micronutrientes, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.get(
        '/plano-alimentar-equivalente-pdf/' + planId + '/micronutrientes', {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );

      downloadPDF(data, 'micronutrientes-' + planId);

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
    <>
      <Col xl={12} className="mb-1 align-items-end text-end">
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-cart">Elabore uma lista de subsituição para o paciente, ou selecione modelos prontos.</Tooltip>}
        >
          <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={handleShowModalReplacementLists}>
            <CsLineIcons icon="menu-dashed" />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-cart">
              Crie uma lista de compras com os alimentos principais do plano alimentar para 7, 15 ou 30 dias. É possível editar o nome dos alimentos e também
              suas quantidades.
            </Tooltip>
          }
        >
          <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={() => setShowModalShoppingList(true)}>
            <CsLineIcons icon="cart" />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-print">
              Realize o download do PDF do plano alimentar no seu computador. É possível personalizar a exibição das medidas caseiras e o layout do arquivo.
            </Tooltip>
          }
        >
          <Button onClick={() => setShowModalSelectPDF(true)} variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
            <CsLineIcons icon="print" />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-print">Realize o download do PDF do plano alimentar que contém os macro e micronutrientes no seu computador.</Tooltip>}
        >
          <span>
            <AsyncButton isSaving={isGeneratingPdf} loadingText=' ' onClickHandler={handleDownloadMicronutrientsPdf} className="btn-sm btn-icon btn-icon-only mb-1 ms-1" type="button">
              <CsLineIcons icon="print" />
            </AsyncButton>
          </span>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-message">Escreva ou escolha orientações relacionadas ao seu plano alimentar.</Tooltip>}>
          <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={() => setShowModalOrientation(true)}>
            <CsLineIcons icon="message" />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-help">Envie os arquivos em formato PDF do plano alimentar diretamente para o endereço de e-mail do seu paciente.</Tooltip>
          }
        >
          <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={() => setShowModalSendPDF(true)}>
            <CsLineIcons icon="send" />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-star">Guarde este plano alimentar como um modelo para ser utilizado com todos os seus pacientes.</Tooltip>}
        >
          <Button onClick={() => setShowModalFavoritePlan(true)} variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
            <CsLineIcons icon="star" />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-help">Análise completa do plano alimentar.</Tooltip>}>
          <Button
            variant="primary"
            size="sm"
            className="btn-icon btn-icon-only mb-1 ms-1"
            type="button"
            onClick={() => setShowMicronutrientsCard(!showMicronutrientsCard)}
          >
            <CsLineIcons icon="chart-up" />
          </Button>
        </OverlayTrigger>
      </Col>

      <ModalReplacementLists show={showModalReplacementLists} onClose={handleCloseModalReplacementLists} />
      <ModalShoppingList show={showModalShoppingList} onClose={() => setShowModalShoppingList(false)} />
      <ModalOrientation show={showModalOrientation} onClose={() => setShowModalOrientation(false)} />
      <ModalFavoritePlan show={showModalFavoritePlan} onClose={() => setShowModalFavoritePlan(false)} />
      <ModalSelectPDF />
      <ModalSendPDF />
    </>
  );
};

export default OptionButtons;
