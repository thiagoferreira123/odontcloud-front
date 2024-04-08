import React, { useCallback, useState } from 'react';
import { Card, Col, Form, Row, Dropdown, ButtonGroup, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import useClassicPlan from '../hooks/useClassicPlan';
import Food from './Food';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import useFilterDisplayStore from '../hooks/useFilterDisplayStore';
import { useModalsStore } from '../hooks/useModalsStore';
import { NumericFormat } from 'react-number-format';
import { notify } from '../../../components/toast/NotificationIcon';
import { htmlToPlainText } from '../../../helpers/InputHelpers';
import { ClassicPlanReplacementMeal, ClassicPlanReplacementMealFood } from '../../../types/PlanoAlimentarClassico';
import api from '../../../services/useAxios';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

interface CardMealProps {
  meal: ClassicPlanReplacementMeal;
  mealId: number;
  // eslint-disable-next-line no-unused-vars
  handleOpenModalPhotoMeal: (meal: ClassicPlanReplacementMeal, mealId: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleOpenModalObservation: (meal: ClassicPlanReplacementMeal, mealId?: number) => void;
}

const CardMeal = (props: CardMealProps) => {
  const showNutrients = useFilterDisplayStore((state) => state.showNutrients);

  const [pendentChanges, setPendentChanges] = useState(false);
  const [showButtonRemoveImage, setShowButtonRemoveImage] = useState(false);
  const [sortableEnabled, setSortableEnabled] = useState(false);

  const { updateReplacementMeal, addReplacementMealFood } = useClassicPlan();
  const { setShowModalMealTemplate, setReplacementMealId, setBaseMealId, setSelectedReplacementMeal, setShowModalDeleteMeal } = useModalsStore();

  const handleNome = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      id: props.meal.id,
      id_refeicao: props.mealId,
      nome: e.target.value,
    };

    updateReplacementMeal({ ...payload });

    setPendentChanges(true);
  };

  const handleUpdadeMeal = async () => {
    if (!pendentChanges) return;

    setPendentChanges(false);

    const payload = {
      horario: props.meal.horario,
      nome: props.meal.nome,
      texto_da_refeicao: props.meal.texto_da_refeicao,
    };

    try {
      await api.patch('/plano-alimentar-classico-refeicao-substituta/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleToogleTextMode = async () => {
    const payload = {
      id: props.meal.id,
      id_refeicao: props.mealId,
      tipo_texto: props.meal.tipo_texto === 'SIM' ? 'NAO' : 'SIM',
    };

    updateReplacementMeal({ ...payload });

    try {
      await api.patch('/plano-alimentar-classico-refeicao-substituta/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleConvertMealToText = async () => {
    const payload = {
      id: props.meal.id,
      id_refeicao: props.meal.id_refeicao,
      texto_da_refeicao: buildTextMeal(),
      tipo_texto: 'SIM',
    };

    updateReplacementMeal({ ...payload });

    try {
      await api.patch('/plano-alimentar-classico-refeicao-substituta/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleFillWithMealTemplate = async () => {
    if (!props.meal.id) return;

    setReplacementMealId(props.meal.id);
    setBaseMealId(props.mealId);
    setShowModalMealTemplate(true);
  };

  const buildTextMeal = () => {
    let textoFormatado = '';

    props.meal.alimentos.forEach((alimento) => {
      textoFormatado += `${alimento.nome} - ${alimento.quantidade_medida} ${alimento.medida_caseira} (${alimento.gramas}g)\n`;
    });

    return textoFormatado.trim(); // Removendo o último salto de linha
  };

  const handleAddFood = async () => {
    if (!props.meal.id_refeicao) return;

    const payload: ClassicPlanReplacementMealFood = {
      id: btoa(Math.random().toString()).substring(0, 12),
      id_refeicao: Number(props.meal.id),
      gramas: 0,
      quantidade_medida: 1,
      ordens: [{ posicao: props.meal.alimentos.length + 1 }],
      tabela: '',
      id_alimento: 0,
      medida_caseira: '',
      nome: '',
      apelido_medida_caseira: '',
      alimentoequivalentes: [],
    };

    addReplacementMealFood(payload, props.meal.id_refeicao);
  };

  const handleRemoveMeal = async () => {
    setShowModalDeleteMeal(true);
    setBaseMealId(props.mealId);
    setSelectedReplacementMeal(props.meal);
  };

  const handleRemoveMealImage = async () => {
    const payload = {
      id: props.meal.id,
      id_refeicao: props.mealId,
      link_imagem: null,
    };

    updateReplacementMeal({ ...payload });

    try {
      await api.patch('/plano-alimentar-classico-refeicao-substituta/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleOpenModalPhotoMeal = () => {
    if (!props.meal.id_refeicao) return;

    props.handleOpenModalPhotoMeal(props.meal, props.meal.id_refeicao);
  };

  const handleChangeMealText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      id: props.meal.id,
      id_refeicao: props.mealId,
      texto_da_refeicao: e.target.value,
    };

    updateReplacementMeal({ ...payload });

    setPendentChanges(true);
  };

  const handleRemoveObservation = async () => {
    const payload = {
      id: props.meal.id,
      id_refeicao: props.mealId,
      obs: '',
    };

    updateReplacementMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-classico-refeicao-substituta/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const setFoods = useCallback(
    (foods: ClassicPlanReplacementMealFood[]) => {
      updateReplacementMeal({ alimentos: foods, id: props.meal.id, id_refeicao: props.mealId });
    },
    [props.meal.id, props.mealId, updateReplacementMeal]
  );

  return (
    <Card className="mb-2 p-2 w-100 ms-2">
      <Row className="g-0 sh-6">
        {/* Image */}
        <Col
          xs="auto"
          className="h-100 position-relative"
          onMouseOver={() => setShowButtonRemoveImage(true)}
          onMouseOut={() => setShowButtonRemoveImage(false)}
        >
          <CsLineIcons icon="sort" className="opacity-0" />

          <img
            src={props.meal.link_imagem ?? ''}
            alt="product-2"
            className={`card-img card-img-horizontal sw-7 sh-6 ${!props.meal.link_imagem ? 'd-none' : ''}`}
            style={{ transform: 'translateX(-75%)', marginRight: '-2.5rem' }}
          />

          <Button
            onClick={handleRemoveMealImage}
            className={`position-absolute bottom-0 end-0 btn btn-sm btn-icon btn-icon-only btn-secondary ms-1 ${!showButtonRemoveImage ? 'd-none' : false}`}
            type="button"
          >
            <CsLineIcons icon="bin" />
          </Button>
        </Col>
        <Col>
          <Card.Body className="d-flex flex-row pt-0 pb-0 h-100 align-items-center justify-content-between">
            {/* Horário/Nome */}
            <div className="d-flex flex-row align-items-center w-40">
              <div className="d-flex flex-column justify-content-center ms-1 w-60 filled">
                <CsLineIcons icon="form" />
                <Form.Control placeholder="Digite o nome da refeição" type="text" value={props.meal.nome} onChange={handleNome} onBlur={handleUpdadeMeal} />
              </div>
            </div>

            {/* Actions */}
            <div>
              <Dropdown as={ButtonGroup} autoClose={true}>
                <Dropdown.Toggle variant="primary" className="ms-1" size="sm" id="dropdown-autoclose-true"></Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => props.handleOpenModalObservation(props.meal, props.mealId)}>
                    <CsLineIcons icon="message" /> Inserir uma observação na refeição
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleOpenModalPhotoMeal}>
                    <CsLineIcons icon="image" /> Inserir uma imagem na refeição
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleToogleTextMode}>
                    <CsLineIcons icon="text" /> {props.meal.tipo_texto === 'SIM' ? 'Retornar refeição para modo clássico' : 'Alterar refeição para modo texto'}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleConvertMealToText}>
                    <CsLineIcons icon="file-text" /> Converter alimentos para texto
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleFillWithMealTemplate}>
                    <CsLineIcons icon="refresh-horizontal" /> Preencher com um modelo de refeição
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleRemoveMeal}>
                    <CsLineIcons icon="bin" /> Deletar refeição{' '}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Body>
        </Col>
      </Row>

      <div className={props.meal.tipo_texto === 'SIM' ? 'd-none' : ''}>
        <div className={props.meal.tipo_texto === 'SIM' ? 'd-none' : ''}>
          <div>
            <div className="d-flex mt-1">
              <Col xs="auto" className="position-relative pe-4 opacity-0">
                <CsLineIcons icon="sort" className="drag-meal-food-icon pointer position-absolute top-50 start-0 translate-middle-y" />
              </Col>

              <div className="filled w-70"></div>

              <div className="filled w-70"></div>

              <div className="filled px-4 me-2"></div>

              <div>
                <div className={`filled me-1 w-100 d-flex ${!showNutrients ? 'opacity-0' : ''}`}>
                  <div className="d-flex flex-fill">
                    <div className="row g-2 ps-4 pe-2">
                      <div className="col sh-2">
                        <Form.Control type="text" className="p-2 hidden-input" />
                      </div>
                      <div className="col text-center sh-2">
                        <Form.Control type="text" className="p-2 hidden-input" />
                        <div className="text-medium">CHO</div>
                      </div>
                      <div className="col text-center sh-2">
                        <Form.Control type="text" className="p-2 hidden-input" />
                        <div className="text-medium">PTN</div>
                      </div>
                      <div className="col text-center sh-2">
                        <Form.Control type="text" className="p-2 hidden-input" />
                        <div className="text-medium">LIP</div>
                      </div>
                      <div className="col text-center sh-2">
                        <Form.Control type="text" className="p-2 hidden-input" />
                        <div className="text-medium">KCAL</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center px-5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ReactSortable
            list={props.meal.alimentos as ItemInterface[]}
            setList={(foodsSorted) => setFoods(foodsSorted as ClassicPlanReplacementMealFood[])}
            handle=".drag-replacement-meal-food-icon"
            onChange={() => setSortableEnabled(true)}
            animation={300}
          >
            {props.meal.alimentos.map((food, index) => (
              <Food key={food.id} food={food} mealId={Number(props.meal.id_refeicao)} index={index} sortableEnabled={sortableEnabled} />
            ))}
          </ReactSortable>

          <div>
            <div className="d-flex mt-1">
              <Col xs="auto" className="position-relative pe-4 opacity-0">
                <CsLineIcons icon="sort" className="drag-meal-food-icon pointer position-absolute top-50 start-0 translate-middle-y" />
              </Col>

              <div className="filled w-70"></div>

              <div className="filled w-70"></div>

              <div className="filled me-1 opacity-0">
                <CsLineIcons icon="content" />
                < NumericFormat className="form-control ms-1" placeholder="Qtd" fixedDecimalScale={false} decimalScale={1} />
              </div>

              <div>
                <div className={`filled me-1 w-100 d-flex ${!showNutrients ? 'opacity-0' : ''}`}>
                  <div className="d-flex flex-fill">
                    <div className={`row g-2 mx-1 ${!showNutrients ? 'opacity-0' : ''}`}>
                      <div className="col">
                        <Form.Control type="text" className="p-2 opacity-0" />
                      </div>
                      <div className="col">
                        <Form.Control type="text" className="p-2" disabled value={props.meal.carboidratos ?? ''} readOnly={true} />
                      </div>
                      <div className="col">
                        <Form.Control type="text" className="p-2" disabled value={props.meal.proteinas ?? ''} readOnly={true} />
                      </div>
                      <div className="col">
                        <Form.Control type="text" className="p-2" disabled value={props.meal.lipideos ?? ''} readOnly={true} />
                      </div>
                      <div className="col">
                        <Form.Control type="text" className="p-2" disabled value={props.meal.kcal ?? ''} readOnly={true} />
                      </div>
                    </div>
                    <div className="d-flex align-items-center opacity-0">
                      <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
                        <CsLineIcons icon="bin" />
                      </Button>

                      <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
                        <CsLineIcons icon="bin" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add">Adicionar alimento na refeição</Tooltip>}>
              <Button variant="primary" size="sm" className="btn-icon btn-icon-only" type="button" onClick={handleAddFood}>
                <CsLineIcons icon="plus" />
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </div>

      <Form.Control
        as="textarea"
        rows={4}
        value={props.meal.texto_da_refeicao ?? ''}
        className={`mt-2 ${props.meal.tipo_texto === 'SIM' ? '' : 'd-none'}`}
        onChange={handleChangeMealText}
        onBlur={handleUpdadeMeal}
      />

      <div className="position-relativa">
        <div className={`alert alert-light mt-4 text-break ${!props.meal.obs ? 'd-none' : ''}`}>
          <div style={{ whiteSpace: 'pre-line' }}>{`${htmlToPlainText(props.meal.obs)}`}</div>
          <Button className="position-absolute bottom-0 end-0 btn btn-sm btn-icon btn-icon-only btn-primary ms-1" onClick={handleRemoveObservation}>
            <CsLineIcons icon="bin" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CardMeal;
