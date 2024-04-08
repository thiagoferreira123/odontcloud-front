import React, { useRef, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { downloadPDF } from '../../../../../helpers/PdfHelpers';
import api from '../../../../../services/useAxios';
import NotificationIcon, { notify } from '../../../../../components/toast/NotificationIcon';
import { SendingMaterial } from '../../../../../types/SendingMaterial';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../../../components/AsyncButton';

interface MaterialProps {
  material: SendingMaterial;
}

export default function Material(props: MaterialProps) {
  const [showAmounts, setQuantidadesValue] = useState<number>(3);
  const [showReplacements, setSubstituicoesValue] = useState<number>(2);

  const [buildShoppingList, setShowShoppingList] = useState<boolean>(false);
  const [buildOrientation, setBuildOrientation] = useState<boolean>(false);
  const [buildComments, setBuildComments] = useState<boolean>(false);
  const [buildMicronutrientsResume, setBuildMicronutrientsResume] = useState<boolean>(false);

  const [showAssign, setShowAssign] = useState<boolean>(false);
  const [parseToKilograms, setParseToKilograms] = useState<boolean>(false);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const handleQuantidadesChange = (value: number) => {
    setQuantidadesValue(value);
  };

  const handleSubstituicoesChange = (value: number) => {
    setSubstituicoesValue(value);
  };

  const onClickDownloadPDF = async () => {
    toastId.current = notify("Gerando pdf's do plano alimentar, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsDownloading(true);

    try {
      const payload = {
        showReplacements: showReplacements === 2,
        showMeasures: showAmounts === 1 || showAmounts === 3,
        showGrams: showAmounts === 2 || showAmounts === 3,
        showAssign,
      };

      const { data } = await api.post('/plano-alimentar-classico-pdf/' + props.material.id, payload, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'plano-alimentar-classico-' + props.material.id);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Pdf do plano alimentar gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      if(buildShoppingList) {
        toastId.current = notify('Gerando pdf das orientações, por favor aguarde...', 'Sucesso', 'check', 'success', true);

        const { data } = await api.post('/plano-alimentar-classico-pdf/' + props.material.id + '/lista-de-compras', {
          parseToKilograms,
        }, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        });
        downloadPDF(data, 'lista-de-compras-' + props.material.id);

        toast.update(toastId.current, {
          render: <NotificationIcon message={'Pdf das orientações gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
          autoClose: 5000,
        });
      }

      if(buildComments) {
        toastId.current = notify('Gerando pdf da lista de comentários, por favor aguarde...', 'Sucesso', 'check', 'success', true);

        const { data } = await api.post('/plano-alimentar-classico-pdf/' + props.material.id + '/comentarios', payload, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        });
        downloadPDF(data, 'comentarios-' + props.material.id);

        toast.update(toastId.current, {
          render: <NotificationIcon message={'Pdf da lista de comentários gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
          autoClose: 5000,
        });
      }

      if(buildOrientation) {
        toastId.current = notify('Gerando pdf das orientações gerais, por favor aguarde...', 'Sucesso', 'check', 'success', true);

        const { data } = await api.get(
          '/plano-alimentar-classico-pdf/' + props.material.id + '/orientacao',
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
          render: <NotificationIcon message={'Pdf das orientações gerais gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
          autoClose: 5000,
        });
      }

      if(buildMicronutrientsResume) {
        toastId.current = notify('Gerando pdf de micronutrientes, por favor aguarde...', 'Sucesso', 'check', 'success', true);

        const { data } = await api.get(
          '/plano-alimentar-classico-pdf/' + props.material.id + '/micronutrientes',
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/pdf',
            },
          }
        );
        downloadPDF(data, 'micronutrientes-' + props.material.id);

        toast.update(toastId.current, {
          render: <NotificationIcon message={'Pdf de micronutrientes gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
          autoClose: 5000,
        });
      }

      setIsDownloading(false);

    } catch (error) {
      setIsDownloading(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={"Erro ao gerar pdf's!"} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  }

  const onClickSendEmail = async () => {
    toastId.current = notify("Gerando pdf's do plano alimentar, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsSending(true);

    try {
      const eatingPlanOptions = {
        showReplacements: showReplacements === 2,
        showMeasures: showAmounts === 1 || showAmounts === 3,
        showGrams: showAmounts === 2 || showAmounts === 3,
        showAssign,
      };

      const shoppingListOptions = {
        parseToKilograms,
      };

      const payload = {
        buildEatingPlan: true,
        buildShoppingList,
        buildOrientationList: buildOrientation,
        buildCommentList: buildComments,
        buildMicronutrients: buildMicronutrientsResume,

        eatingPlanOptions,
        shoppingListOptions,

        textObservation: '',
      };

      await api.post('/plano-alimentar-classico-email/' + props.material.id, payload);

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
      <Row>
        <Col md={4} className="mt-3">
          <label className="mb-3 font-bold">Exibição das quantidades</label>
          <div>
            <Form.Check
              type="radio"
              value={1}
              label="Apenas medidas caseiras"
              id={`show_quantidades_classic_meal_plan_${props.material.id}`}
              name={`show_quantidades_classic_meal_plan_${props.material.id}`}
              checked={showAmounts === 1}
              onChange={() => handleQuantidadesChange(1)}
            />
            <Form.Check
              type="radio"
              value={2}
              label="Apenas gramas"
              id={`show_quantidades_classic_meal_plan_${props.material.id}_2`}
              name={`show_quantidades_classic_meal_plan_${props.material.id}`}
              checked={showAmounts === 2}
              onChange={() => handleQuantidadesChange(2)}
            />
            <Form.Check
              type="radio"
              value={3}
              label="Medidas caseiras e gramas"
              id={`show_quantidades_classic_meal_plan_${props.material.id}_3`}
              name={`show_quantidades_classic_meal_plan_${props.material.id}`}
              checked={showAmounts === 3}
              onChange={() => handleQuantidadesChange(3)}
            />
            <Form.Check
              type="radio"
              value={4}
              label="Somente os alimentos"
              id={`show_quantidades_classic_meal_plan_${props.material.id}_4`}
              name={`show_quantidades_classic_meal_plan_${props.material.id}`}
              checked={showAmounts === 4}
              onChange={() => handleQuantidadesChange(4)}
            />
          </div>
        </Col>

        <Col md={4}>
          <label className="mb-3 font-bold">Exibição das substituições</label>
          <div>
            <Form.Check
              type="radio"
              value={1}
              label="Somente o alimento principal"
              id={`show_substituicoes_${props.material.id}`}
              name={`show_substituicoes_${props.material.id}`}
              checked={showReplacements === 1}
              onChange={() => handleSubstituicoesChange(1)}
            />
            <Form.Check
              type="radio"
              value={2}
              label="Alimento principal e substitutos"
              id={`show_substituicoes_${props.material.id}_1`}
              name={`show_substituicoes_${props.material.id}`}
              checked={showReplacements === 2}
              onChange={() => handleSubstituicoesChange(2)}
            />
          </div>
        </Col>

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
          <div>
            <Form.Check
              type="checkbox"
              value={1}
              label="Comentarios"
              id={`show_assinatura_${props.material.id}_1`}
              name={`show_assinatura_${props.material.id}`}
              checked={buildComments}
              onChange={(e) => setBuildComments(e.target.checked)}
            />
          </div>
          <div>
            <Form.Check
              type="checkbox"
              value={1}
              label="Resumo de nutrientes"
              id={`show_assinatura_${props.material.id}_2`}
              name={`show_assinatura_${props.material.id}`}
              checked={buildMicronutrientsResume}
              onChange={(e) => setBuildMicronutrientsResume(e.target.checked)}
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
          <div>
            <Form.Check
              type="checkbox"
              value={1}
              label="Peso em Kilogramas"
              id={`show_assinatura_${props.material.id}_2`}
              name={`show_assinatura_${props.material.id}`}
              checked={parseToKilograms}
              onChange={(e) => setParseToKilograms(e.target.checked)}
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
