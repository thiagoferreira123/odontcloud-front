import React, { useCallback, useEffect, useRef, useState } from 'react';
import AsyncButton from '/src/components/AsyncButton';
import NotificationIcon, { notify } from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import { Button, Modal, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { ShoppingListItem } from '/src/types/ShoppingList';
import useClassicPlan from '../hooks/useClassicPlan';
import api from '/src/services/useAxios';
import { BaseFood } from '/src/types/foods';
import { parseFloatNumber } from '/src/helpers/MathHelpers';
import ModalQuestion, { ModalQuestionRef } from '/src/components/modals/ModalQuestion';
import { downloadPDF } from '/src/helpers/PdfHelpers';

interface ModalShoppingListProps {
  show: boolean;
  onClose: () => void;
}

const ModalShoppingList: React.FC<ModalShoppingListProps> = ({ show, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const toastId = useRef<React.ReactText>();
  const modalQuestion = useRef<ModalQuestionRef>();

  const meals = useClassicPlan((state) => state.meals);
  const itensListaCompra = useClassicPlan((state) => state.itensListaCompra);
  const planId = useClassicPlan((state) => state.planId);
  const { updatePlan } = useClassicPlan();

  const setItensListaCompra = useCallback(
    (itens: ShoppingListItem[]) => {
      updatePlan({ itensListaCompra: itens });
    },
    [updatePlan]
  );

  const handleAddFood = () => {
    setIsSaving(false);

    const payload: ShoppingListItem = {
      id: btoa(String(Math.random())),
      nome: '',
      gramas_7: 7,
      gramas_15: 15,
      gramas_30: 30,
      id_plano: planId,
      is_user_input: 0,
      update_list: 0,
    };

    setItensListaCompra([...itensListaCompra, payload]);
  };

  const handleRemoveFood = (id: string | number) => {
    const foods = itensListaCompra.filter((food) => food.id !== id);

    if (!foods.length)
      foods.push({
        id: btoa(String(Math.random())),
        nome: '',
        gramas_7: 7,
        gramas_15: 15,
        gramas_30: 30,
        id_plano: planId,
        is_user_input: 0,
        update_list: 0,
      });

    if (typeof id === 'number') api.delete('/plano-alimentar-classico-lista-de-compras/' + id);

    setItensListaCompra(foods);
  };

  const handleUpdateFood = (payload: Partial<ShoppingListItem>, food: ShoppingListItem) => {
    if (payload.gramas_7) payload = rebuildGrams(payload);

    const updatedFood = { ...food, ...payload };

    setItensListaCompra(itensListaCompra.map((food) => (food.id === updatedFood.id ? updatedFood : food)));
  };

  const rebuildGrams = (food: Partial<ShoppingListItem>) => {
    const grams = Number(food.gramas_7) / 7;

    food.gramas_15 = Number((grams * 15).toFixed(1));
    food.gramas_30 = Number((grams * 30).toFixed(1));

    return food;
  };

  const handleSubmit = async (ignoreClose?: boolean) => {
    setIsSaving(true);

    const foods = [...itensListaCompra];

    for (const food of foods) {
      const food_index = foods.findIndex((f) => f.id_alimento == food.id_alimento);

      if (typeof food.id !== 'number') {
        const response = await api.post('/plano-alimentar-classico-lista-de-compras/', food);
        foods[food_index] = response.data.data;
        setItensListaCompra(foods);
      } else {
        await api.put('/plano-alimentar-classico-lista-de-compras/' + food.id, food);
      }
    }

    notify('Lista de compras salva com sucesso', 'Sucesso', 'check', 'success');
    setIsSaving(false);
    ignoreClose && onClose();
  };

  const generateFoodList = useCallback(async () => {
    setIsLoading(true);

    try {
      const food_ids: number[] = [];

      meals.forEach((meal) => {
        food_ids.push(
          ...meal.alimentos.map((food) => {
            return food.id_alimento;
          })
        );
      });

      const response = await api.post('/alimento/alimentos-base', { alimento_ids: food_ids });
      const baseFoods: BaseFood[] = response.data;

      const parsedFoods: ShoppingListItem[] = [];

      meals.forEach((meal) => {
        meal.alimentos.forEach((food) => {
          const food_index = parsedFoods.findIndex((f) => f.id_alimento == food.id_alimento);

          if (food_index != -1) {
            parsedFoods[food_index].gramas_7 = parseFloatNumber(Number(parsedFoods[food_index].gramas_7) + food.quantidade_medida * 7);
            parsedFoods[food_index].gramas_15 = parseFloatNumber(Number(parsedFoods[food_index].gramas_15) + food.quantidade_medida * 15);
            parsedFoods[food_index].gramas_30 = parseFloatNumber(Number(parsedFoods[food_index].gramas_30) + food.quantidade_medida * 30);
            return;
          }

          const baseFood: BaseFood | undefined = baseFoods.find((f) => f.id_alimento == food.id_alimento);

          if (!baseFood)
            return parsedFoods.push({
              id: btoa(String(Math.random())),
              id_alimento: food.id_alimento,
              nome: food.nome,
              gramas_7: parseFloatNumber(food.quantidade_medida * 7),
              gramas_15: parseFloatNumber(food.quantidade_medida * 15),
              gramas_30: parseFloatNumber(food.quantidade_medida * 30),
              id_plano: planId,
              is_user_input: 1,
              update_list: 1,
            });

          parsedFoods.push({
            id: btoa(String(Math.random())),
            nome: baseFood.nome,
            id_alimento: food.id_alimento,
            gramas_7: parseFloatNumber(food.quantidade_medida * 7),
            gramas_15: parseFloatNumber(food.quantidade_medida * 15),
            gramas_30: parseFloatNumber(food.quantidade_medida * 30),
            id_plano: planId,
            is_user_input: 1,
            update_list: 1,
          });
        });
      });

      setItensListaCompra(parsedFoods);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      notify('Erro ao gerar lista de compras', 'Erro', 'close', 'danger');
    }
  }, [meals, planId, setItensListaCompra]);

  const handleDownloadPdf = async () => {
    if (!modalQuestion.current) return console.error('modalQuestion.current is undefined');

    setIsGeneratingPdf(true);
    await handleSubmit();

    const parseToKilograms = await modalQuestion.current.showQuestion();

    toastId.current = notify('Gerando pdf da lista de compras, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.post(
        '/plano-alimentar-classico-pdf/' + planId + '/lista-de-compras',
        {
          parseToKilograms,
        },
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );
      downloadPDF(data, 'lista-de-compras-' + planId);

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

  useEffect(() => {
    if (show && !itensListaCompra.length) {
      generateFoodList();
    }
  }, [itensListaCompra.length, generateFoodList, show]);

  return (
    <Modal show={show} onHide={onClose} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Lista de compras para 7, 15 e 30 dias</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row d-flex align-items-center">
          <div className="col-5 mb-2">
            <label>Alimento</label>
          </div>

          <div className="col-2 mb-2">
            <label>7 Dias</label>
          </div>

          <div className="col-2 mb-2">
            <label>15 Dias</label>
          </div>

          <div className="col-2 mb-2">
            <label>30 Dias</label>
          </div>

          <div className="col-1 mb-2">
            <label>Remover</label>
          </div>
        </div>

        {isLoading ? (
          <div className="w-100 d-flex justify-content-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : itensListaCompra.length ? (
          itensListaCompra.map((food) => (
            <div className="row d-flex align-items-center" key={food.id}>
              <div className="col-5 mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={food.nome}
                  onChange={(e) => handleUpdateFood({ nome: e.target.value }, food)}
                  placeholder="Insira o nome do alimento"
                />
              </div>

              <div className="col-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={food.gramas_7}
                  onChange={(e) => handleUpdateFood({ gramas_7: Number(e.target.value) }, food)}
                />
              </div>

              <div className="col-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={food.gramas_15}
                  onChange={(e) => handleUpdateFood({ gramas_15: Number(e.target.value) }, food)}
                />
              </div>

              <div className="col-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={food.gramas_30}
                  onChange={(e) => handleUpdateFood({ gramas_30: Number(e.target.value) }, food)}
                />
              </div>

              <div className="col-1 mb-2">
                <Button className="btn btn-sm btn-icon btn-icon-only btn-primary ms-1" onClick={() => handleRemoveFood(food.id ?? '')}>
                  <CsLineIcons icon="bin" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          false
        )}

        <div className="col-12 text-center align-content-center mb-3">
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add">Adicionar alimento na lista de compras</Tooltip>}>
            <Button variant="primary" size="sm" className="btn-foreground hover-outline btn-icon btn-icon-start mt-2" type="button" onClick={handleAddFood}>
              <CsLineIcons icon="plus" />
              <span>Adicionar alimento não listado</span>
            </Button>
          </OverlayTrigger>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-print-shopping">Realize o download da lista de compras no seu computador.</Tooltip>}>
          <span>
            <AsyncButton
              loadingText=" "
              isSaving={isGeneratingPdf}
              onClickHandler={handleDownloadPdf}
              type="button"
              className="btn-icon btn-icon-only mb-1 ms-1"
            >
              <CsLineIcons icon="print" />
            </AsyncButton>
          </span>
        </OverlayTrigger>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar refeição
        </AsyncButton>
      </Modal.Footer>

      <ModalQuestion
        ref={modalQuestion}
        title="Transformar medidas?"
        message="Deseja transformar gramas(g) em kilogramas(kg) para melhor compreensão?"
        confirmText="SIm"
        cancelText="Não"
      />
    </Modal>
  );
};

export default ModalShoppingList;
