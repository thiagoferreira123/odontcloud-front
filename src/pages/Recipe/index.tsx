import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import ModalEditRecipe from './Modals/ModalEditRecipe';
import ModalAddRecipe from './Modals/ModalAddRecipe';
import { useRecipeStore } from './hooks/RecipeStore';
import Recipes from './RecipeList/Recipes';
import { AxiosError } from 'axios';
import { useEditReciptStore } from './hooks/EditRecipeStore';
import { useModalAddRecipeStore } from './Modals/ModalAddRecipe/hooks/ModalAddRecipeStore';
import ModalSendPDF from './Modals/ModalSendPDF';
import { useModalSendPDFStore } from './hooks/ModalSendPDFStore';
import ModalQuestion, { ModalQuestionRef } from '../../components/modals/ModalQuestion';
import api from '../../services/useAxios';
import { notify, updateNotify } from '../../components/toast/NotificationIcon';
import { RecipeHistoryRecipe } from '../../types/ReceitaCulinaria';
import { downloadPDF } from '../../helpers/PdfHelpers';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../components/AsyncButton';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';

export default function Recipe() {
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const toastId = useRef<React.ReactText>();
  const modalQuestion = useRef<ModalQuestionRef>();

  const { id } = useParams<{ id: string }>();
  const prescription = useRecipeStore((state) => state.prescription);

  const { getPrescription, removePrescriptionRecipe, addRecipe } = useRecipeStore();
  const { handleSelectRecipe } = useEditReciptStore();
  const { setShowModalAddRecipe } = useModalAddRecipeStore();
  const { setShowModalSendPdfEmail } = useModalSendPDFStore();
  const { setPatientId } = usePatientMenuStore();

  const onSubmit = async (hideSuccessMessage?: boolean) => {
    setIsSaving(true);

    try {
      await api.patch('/receita-culinaria-historico/' + id, {
        ...prescription,
        receitas: prescription.receitas.map((recipe) => {
          return {
            ...recipe,
            id: undefined,
            id_prescricao: undefined,
            alimentos: recipe.alimentos.map((food) => ({
              ...food,
              id: undefined,
              id_receita: undefined,
              food: undefined,
              measure: undefined,
              measureOption: undefined,
            })),
            preparos: recipe.preparos.map((step) => ({ ...step, id: typeof step.id == 'string' ? undefined : step.id })),
            categorias: undefined,
          };
        }),
      });

      setIsSaving(false);
      !hideSuccessMessage && notify('Prescrição de receitas culinárias salva com sucesso', 'Sucesso', 'check', 'success');
      window.localStorage.setItem('prescription', '');
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Ocorreu um erro ao tentar salvar a prescrição de receitas culinárias', 'Erro', 'close', 'danger');
    }
  };

  const removeRecipeHandler = async (recipe: RecipeHistoryRecipe) => {
    try {
      await removePrescriptionRecipe(recipe);
    } catch (error) {
      console.error(error);
      notify('Ocorreu um erro ao tentar remover a receita da lista de seleção', 'Erro', 'close', 'danger');
    }
  };

  const handleDownloadPdf = async () => {
    if (!modalQuestion.current) return console.error('modalQuestion.current is undefined');

    setIsGeneratingPdf(true);
    await onSubmit(true);

    const showNutrients = await modalQuestion.current.showQuestion();

    toastId.current = notify('Gerando pdf da prescrição de receita culinária, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.post(
        '/prescricao-receita-culinaria-pdf/' + id,
        {
          showNutrients,
        },
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );
      downloadPDF(data, 'prescricao-receita-culinaria-' + id);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);

      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const getPrescription_ = async () => {
    if (!id) return Promise.resolve(null);

    try {
      const response = await getPrescription(+id);

      response.id_paciente && setPatientId(response.id_paciente);

      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      return null;
    }
  };

  useEffect(() => {
    if (!prescription.id) return;

    window.localStorage.setItem('prescription', JSON.stringify(prescription));
  }, [prescription, prescription?.receitas?.length]);

  const result = useQuery({ queryKey: ['recipe-prescription', id], queryFn: getPrescription_, enabled: !!id });

  return (
    <>
      <PatientMenuRow />

      <Row>
        <Col lg="7">
          <Recipes />
        </Col>

        <Col lg="5">
          <Card>
            <Card.Body className="mb-n3 border-last-none text-center">
              <label className="text-center">Lista de receitas selecionadas para o paciente</label>
              <label className="mb-5 text-muted">O paciente pode visualizar as receitas através do app mobile ou PDF's</label>
              <div className="d-flex mb-4 justify-content-end">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-add">Cadastre uma receita que não existe no DietSystem e compartilhe com a comunidade.</Tooltip>}
                >
                  <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-auto" onClick={() => setShowModalAddRecipe(true)}>
                    <CsLineIcons icon="plus" />
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-print">Faça o download do PDF das receitas culinárias selecionadas.</Tooltip>}>
                  <span>
                    <AsyncButton
                      variant="outline-secondary"
                      size="sm"
                      className="btn-icon btn-icon-only ms-1"
                      loadingText=" "
                      isSaving={isGeneratingPdf}
                      onClickHandler={handleDownloadPdf}
                    >
                      <CsLineIcons icon="print" />
                    </AsyncButton>
                  </span>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-send">Envie para o e-mail do paciente, o PDF das receitas culinárias selecionadas.</Tooltip>}
                >
                  <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => setShowModalSendPdfEmail(true)}>
                    <CsLineIcons icon="send" />
                  </Button>
                </OverlayTrigger>
              </div>

              <div className="scroll-out">
                <div className="override-native overflow-auto sh-50 pe-3">
                  {result.isLoading ? (
                    <div className="h-50 d-flex justify-content-center align-items-center">
                      <StaticLoading />
                    </div>
                  ) : result.isError ? (
                    <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar receitas selecionadas</div>
                  ) : !prescription.id || !prescription.receitas.length ? (
                    <div className="h-50 d-flex justify-content-center align-items-center">
                      <Empty message="Nenhuma receita selecionada" />
                    </div>
                  ) : (
                    prescription.receitas.map((recipe) => (
                      <div className="border-bottom border-separator-light mb-2 pb-2" key={recipe.id}>
                        <Row className="g-0 sh-6">
                          <Col xs="auto">
                            <img
                              src={recipe.imagem ? recipe.imagem : '/img/product/large/product-2.webp'}
                              className="card-img rounded-xl sh-6 sw-6"
                              alt="thumb"
                            />
                          </Col>
                          <Col>
                            <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                              <div className="d-flex flex-column">
                                <div>{recipe.nome}</div>
                              </div>
                              <div className="d-flex">
                                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-edit">Editar a receita selecionada</Tooltip>}>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="btn-icon btn-icon-only ms-1"
                                    onClick={() => handleSelectRecipe(recipe)}
                                  >
                                    <CsLineIcons icon="edit" />
                                  </Button>
                                </OverlayTrigger>

                                <OverlayTrigger
                                  placement="bottom"
                                  overlay={<Tooltip id="tooltip-delete">Deletar receita da lista de seleção para o paciente</Tooltip>}
                                >
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="btn-icon btn-icon-only ms-1"
                                    onClick={() => removeRecipeHandler(recipe)}
                                  >
                                    <CsLineIcons icon="bin" />
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <AsyncButton size="lg" isSaving={isSaving} onClickHandler={() => onSubmit()}>
                Salvar receitas selecionadas
              </AsyncButton>
            </Card.Body>
          </Card>

          <ModalEditRecipe />
          <ModalSendPDF />
          <ModalAddRecipe onAddRecipe={addRecipe} />
          <ModalQuestion ref={modalQuestion} title="Exibir nutrientes?" message="Deseja exibir informações nutricionais?" confirmText="SIm" cancelText="Não" />
        </Col>
      </Row>
    </>
  );
}
