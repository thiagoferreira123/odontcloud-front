import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Row, Tooltip, OverlayTrigger, Dropdown, ButtonGroup, Collapse } from 'react-bootstrap';
import { PatternFormat, NumericFormat } from 'react-number-format';
import Food from './Food';
import useClassicPlan from '../hooks/useClassicPlan';
import { toast } from 'react-toastify';
import CardReplacementMeal from '../replacement-meal/CardMeal';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import { removeMealNotification } from '../services/NotificationService';
import useFilterDisplayStore from '../hooks/useFilterDisplayStore';
import { useModalsStore } from '../hooks/useModalsStore';
import { GripVertical } from 'react-bootstrap-icons';
import { htmlToPlainText } from '../../../helpers/InputHelpers';
import { ClassicPlanMeal, ClassicPlanMealFood, ClassicPlanReplacementMeal } from '../../../types/PlanoAlimentarClassico';
import api from '../../../services/useAxios';
import NotificationIcon, { notify } from '../../../components/toast/NotificationIcon';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

interface CardMealProps {
  meal: ClassicPlanMeal;
  index: number;
  sortableEnabled: boolean;
  isCollapseIsOpened: boolean;
  // eslint-disable-next-line no-unused-vars
  handleOpenModalObservation: (meal: ClassicPlanMeal | ClassicPlanReplacementMeal, mealId?: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleOpenModalPhotoMeal: (meal: ClassicPlanMeal | ClassicPlanReplacementMeal, mealId?: number) => void;
}

const CardMeal = (props: CardMealProps) => {
  const totalCalories = useClassicPlan((state) => state.totalCalories);

  const showNutrients = useFilterDisplayStore((state) => state.showNutrients);

  const [pendentChanges, setPendentChanges] = useState(false);
  const [equivalentCollapseopen, setEquivalentCollapseOpen] = useState(false);
  const [contentCollapseopen, setContentCollapseOpen] = useState(false);
  const [showButtonRemoveImage, setShowButtonRemoveImage] = useState(false);
  const [sortableEnabled, setSortableEnabled] = useState(false);

  if(props.isCollapseIsOpened && !contentCollapseopen) setContentCollapseOpen(true)

  const toastId = useRef<React.ReactText>();

  const { updateMeal, addReplacementMeal, addMealFood, addMeal, rebuildTotalCalories } = useClassicPlan();
  const { setShowModalDeleteMeal, setSelectedMeal } = useModalsStore();

  const handleHorario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      horario: e.target.value,
    };

    updateMeal({ ...payload, id: props.meal.id });

    setPendentChanges(true);
  };

  const handleNome = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      nome: e.target.value,
    };

    updateMeal({ ...payload, id: props.meal.id });

    setPendentChanges(true);
  };

  const handleChangeMealText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      textoDaRefeicao: e.target.value,
    };

    updateMeal({ ...payload, id: props.meal.id });

    setPendentChanges(true);
  };

  const handleUpdadeMeal = async () => {
    if (!pendentChanges) return;
    if (!props.meal.id) throw new Error('Refeição não definida');

    setPendentChanges(false);

    const payload = {
      horario: props.meal.horario,
      nome: props.meal.nome,
      textoDaRefeicao: props.meal.textoDaRefeicao,
    };

    try {
      await api.patch('/plano-alimentar-classico-refeicao/' + props.meal.id, payload);

      await removeMealNotification([props.meal.id], false);

      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleToogleTextMode = async () => {
    const payload = {
      tipoTexto: props.meal.tipoTexto === 'SIM' ? 'NAO' : 'SIM',
    };

    updateMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-classico-refeicao/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleConvertMealToText = async () => {
    const payload = {
      textoDaRefeicao: buildTextMeal(),
      tipoTexto: 'SIM',
    };

    updateMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-classico-refeicao/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleAddReplacementMeal = async () => {
    if (!props.meal.id) return notify('Erro ao adicionar refeição substituta', 'Erro', 'close', 'danger');

    try {
      const payload: ClassicPlanReplacementMeal = {
        nome: '',
        horario: '00:00:00',
        id_refeicao: props.meal.id,
        obs: '',
        carboidratos: 0,
        lipideos: 0,
        proteinas: 0,
        kcal: 0,
        html: '',
        tipo_texto: '',
        texto_da_refeicao: '',
        link_imagem: '',
        alimentos: [],
      };

      const response = await api.post('/plano-alimentar-classico-refeicao-substituta', payload);
      payload.id = response.data;

      payload.alimentos.push({
        id: btoa(Math.random().toString()).substring(0, 12),
        id_refeicao: Number(payload.id),
        quantidade_medida: 1,
        alimentoequivalentes: [],
        tabela: '',
        id_alimento: 0,
        medida_caseira: '',
        gramas: 0,
        nome: '',
        apelido_medida_caseira: '',
        ordens: [{ posicao: 1 }],
      });

      addReplacementMeal(payload);
      notify('Refeição substituta adicionada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao adicionar refeição substituta', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const buildTextMeal = () => {
    let textoFormatado = '';

    props.meal.alimentos.forEach((alimento) => {
      textoFormatado += `${alimento.nome} - ${alimento.quantidade_medida} ${alimento.medida_caseira} (${alimento.gramas}g)\n`;
    });

    return textoFormatado.trim(); // Removendo o último salto de linha
  };

  const handleAddFood = async () => {
    if (!props.meal.id) return notify('Erro ao adicionar alimento', 'Erro', 'close', 'danger');

    const payload: ClassicPlanMealFood = {
      id: btoa(Math.random().toString()).substring(0, 12),
      id_refeicao: props.meal.id,
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

    addMealFood(payload);
  };

  const handleDuplicateMeal = async () => {
    toastId.current = notify('Clonando refeição, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const response = await api.get(`/plano-alimentar-classico-refeicao/${props.meal.id}/clone`);

      const refeicao_substituta = response.data;

      if (refeicao_substituta.id) addMeal(refeicao_substituta);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Refeição duplicada com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
      });
    } catch (error) {
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao duplicar refeição!'} title={'Erro'} icon={'close'} status={'danger'} />,
      });
      console.error(error);
    }
  };

  const handleRemoveMealImage = async () => {
    const payload = {
      linkImagem: null,
    };

    updateMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-classico-refeicao/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleRemoveObservation = async () => {
    const payload = {
      obs: '',
    };

    updateMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-classico-refeicao/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handlePersistMacros = async () => {
    api.patch(`/plano-alimentar-classico-refeicao/${props.meal.id}`, {
      carboidratos: Number(props.meal.carboidratos) * 4,
      proteinas: Number(props.meal.proteinas) * 4,
      lipideos: Number(props.meal.lipideos) * 9,
      kcal: Number(props.meal.kcal),
    });
  };

  const handleRemoveMealFromCalcularion = useCallback(async () => {
    const payload = {
      calculavel: props.meal.calculavel ? 0 : 1,
    };

    updateMeal({ ...payload, id: props.meal.id });

    rebuildTotalCalories();

    try {
      await api.patch('/plano-alimentar-classico-refeicao/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  }, [props.meal, rebuildTotalCalories, updateMeal]);

  const handleRemoveMeal = useCallback(async () => {
    setShowModalDeleteMeal(true);
    setSelectedMeal(props.meal);
  }, [props.meal, setSelectedMeal, setShowModalDeleteMeal]);

  const updateMealOrder = useCallback(async () => {
    const payload = {
      id_refeicao: props.meal.id,
      posicao: props.index,
    };

    try {
      if (props.meal.ordens.length) api.patch('/plano-alimentar-classico-refeicao-order/' + props.meal.ordens[0].id, payload);
      else {
        const response = await api.post('/plano-alimentar-classico-refeicao-order', payload);
        updateMeal({ ...props.meal, ordens: [response.data] });
      }
    } catch (error) {
      console.error(error);
    }
  }, [props.index, props.meal, updateMeal]);

  const setFoods = useCallback(
    (foods: ClassicPlanMealFood[]) => {
      updateMeal({ alimentos: foods, id: props.meal.id });
    },
    [props.meal.id, updateMeal]
  );

  const CustomAccordionToggleButton = ({ icon, onClick }: { eventKey: string; icon: string; onClick: () => void }) => {
    return (
      <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip-bin">Expandir refeição para adicionar alimentos</Tooltip>}>
        <Button
          variant="primary"
          size="sm"
          className="btn-icon btn-icon-only  ms-1"
          type="button"
          aria-controls="content-collapse-text"
          aria-expanded={contentCollapseopen}
          onClick={onClick}
        >
          <CsLineIcons icon={icon} />
        </Button>
      </OverlayTrigger>
    );
  };

  const caloriesPercentage = useMemo(() => (Number(props.meal.kcal) / totalCalories) * 100, [props.meal.kcal, totalCalories]).toFixed(1);

  useEffect(() => {
    if (!props.sortableEnabled) return;

    updateMealOrder();
  }, [props.sortableEnabled, updateMealOrder]);

  return (
    <div className="mb-3 meal-card ms-5">
      <Card className={`p-2 ${!props.meal.calculavel ? 'bg-light-danger' : false}`}>
        <Accordion>
          <Row className="g-0 sh-6">
            {/* Image */}
            <Col xs="auto" className="h-100 col-auto d-flex align-items-center position-relative">
            <span
                style={{ transform: 'translateX(-75%)', marginRight: props.meal.linkImagem? '-2.5rem' : '' }}
                onMouseOver={() => setShowButtonRemoveImage(true)}
                onFocus={() => setShowButtonRemoveImage(true)}
                onMouseOut={() => setShowButtonRemoveImage(false)}
                onBlur={() => setShowButtonRemoveImage(false)}
              >
                <img
                  src={props.meal.linkImagem ?? ''}
                  alt="product-2"
                  className={`card-img card-img-horizontal sw-7 sh-6 ${!props.meal.linkImagem ? 'd-none' : ''}`}
                />

                <Button
                  onClick={handleRemoveMealImage}
                  className={`position-absolute bottom-0 end-0 btn btn-sm btn-icon btn-icon-only btn-secondary ms-1 ${
                    !showButtonRemoveImage || !props.meal.linkImagem ? 'd-none' : false
                  }`}
                  type="button"
                >
                  <CsLineIcons icon="bin" />
                </Button>
              </span>

              <GripVertical width={24} height={24} className="drag-meal-icon all-scroll" />
            </Col>

            <Col>
              <Card.Body className="d-flex flex-row pt-0 pb-0 ps-2 h-100 align-items-center justify-content-between">
                {/* Horário/Nome */}
                <div className="d-flex flex-row align-items-center">
                  <div className="d-flex flex-column justify-content-center w-25 filled">
                    <CsLineIcons icon="clock" />
                    <PatternFormat
                      className="form-control"
                      format="##:##"
                      mask="_"
                      placeholder="HH:MM"
                      value={props.meal.horario !== '00:00:00' ? props.meal.horario : ''}
                      onChange={handleHorario}
                      onBlur={handleUpdadeMeal}
                    />
                  </div>

                  <div className="d-flex flex-column justify-content-center ms-1 w-60 filled">
                    <CsLineIcons icon="form" />
                    <Form.Control placeholder="Digite o nome da refeição" type="text" value={props.meal.nome} onChange={handleNome} onBlur={handleUpdadeMeal} />
                  </div>
                </div>

                {/* Macros */}
                {!contentCollapseopen ? (
                  <div className={`d-flex flex-row ms-3 ${!showNutrients ? 'opacity-0' : ''}`}>
                    <div className="d-flex flex-column align-items-center ms-5">
                      <div className="text-alternate">{Math.round(Number(props.meal.carboidratos))} g</div>
                      <div className="text-muted text-small">CHO</div>
                    </div>
                    <div className="d-flex flex-column align-items-center ms-5 ms-3">
                      <div className="text-alternate">{Math.round(Number(props.meal.proteinas))} g</div>
                      <div className="text-muted text-small">PTN</div>
                    </div>
                    <div className="d-flex flex-column align-items-center ms-5 ms-3">
                      <div className="text-alternate">{Math.round(Number(props.meal.lipideos))} g</div>
                      <div className="text-muted text-small">LIP</div>
                    </div>
                    <div className="d-flex flex-column align-items-center ms-5 ms-3">
                      <div className="text-alternate">
                        {props.meal.kcal} ({!isFinite(Number(caloriesPercentage)) || isNaN(Number(caloriesPercentage)) ? 0 : caloriesPercentage}%)
                      </div>
                      <div className="text-muted text-small">KCAL</div>
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div>
                  <CustomAccordionToggleButton
                    eventKey="standardCollapse"
                    icon="eye"
                    onClick={() => {
                      setEquivalentCollapseOpen(false);
                      setContentCollapseOpen(!contentCollapseopen);
                    }}
                  />

                  <Dropdown as={ButtonGroup} autoClose={true}>
                    <Dropdown.Toggle variant="primary" className="ms-1" size="sm" id="dropdown-autoclose-true"></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleAddReplacementMeal}>
                        <CsLineIcons icon="sync-horizontal" /> Inserir refeição substituta
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => props.handleOpenModalObservation(props.meal)}>
                        <CsLineIcons icon="message" /> Inserir uma observação na refeição
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => props.handleOpenModalPhotoMeal(props.meal)}>
                        <CsLineIcons icon="image" /> Inserir uma imagem na refeição
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleDuplicateMeal}>
                        <CsLineIcons icon="duplicate" /> Duplicar refeição
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleToogleTextMode}>
                        <CsLineIcons icon="text" />{' '}
                        {props.meal.tipoTexto === 'SIM' ? 'Retornar refeição para modo clássico' : 'Alterar refeição para modo texto'}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleConvertMealToText}>
                        <CsLineIcons icon="file-text" /> Converter alimentos para texto
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleRemoveMealFromCalcularion()}>
                        <CsLineIcons icon="abacus" /> {`${props.meal.calculavel ? 'Retirar refeição do cálculo' : 'Adicionar refeição ao cálculo'}`}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleRemoveMeal}>
                        <CsLineIcons icon="bin" /> Deletar refeição
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card.Body>
            </Col>
          </Row>

          <Collapse in={contentCollapseopen}>
            <div>
              <div className={props.meal.tipoTexto === 'SIM' ? 'd-none' : ''}>
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
                              <div className="text-muted text-small">CHO</div>
                            </div>
                            <div className="col text-center sh-2">
                              <Form.Control type="text" className="p-2 hidden-input" />
                              <div className="text-muted text-small">PTN</div>
                            </div>
                            <div className="col text-center sh-2">
                              <Form.Control type="text" className="p-2 hidden-input" />
                              <div className="text-muted text-small">LIP</div>
                            </div>
                            <div className="col text-center sh-2">
                              <Form.Control type="text" className="p-2 hidden-input" />
                              <div className="text-muted text-small">kcal</div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center ms-1 px-5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <ReactSortable
                  list={props.meal.alimentos as ItemInterface[]}
                  setList={(foodsSorted) => setFoods(foodsSorted as ClassicPlanMealFood[])}
                  handle=".drag-meal-food-icon"
                  filter=".draggable-disabled"
                  onChange={() => setSortableEnabled(true)}
                  animation={300}
                >
                  {props.meal.alimentos.map((food, index) => (
                    <Food key={food.id} food={food} index={index} handlePersistMacros={handlePersistMacros} sortableEnabled={sortableEnabled} />
                  ))}
                </ReactSortable>

                {/* Macros */}
                {contentCollapseopen ? (
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
                ) : null}

                <div className="mt-2">
                  <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add">Adicionar alimento na refeição</Tooltip>}>
                    <Button variant="primary" size="sm" className="btn-icon btn-icon-only" type="button" onClick={handleAddFood}>
                      <CsLineIcons icon="plus" />
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>

              <Form.Control
                as="textarea"
                rows={4}
                value={props.meal.textoDaRefeicao ?? ''}
                className={props.meal.tipoTexto === 'SIM' ? '' : 'd-none'}
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

              <Button
                onClick={() => setEquivalentCollapseOpen(!equivalentCollapseopen)}
                aria-controls="example-collapse-text"
                aria-expanded={equivalentCollapseopen}
                size="sm"
                className={`mt-2 ${props.meal.substituicoes && props.meal.substituicoes.length ? '' : 'd-none'}`}
              >
                Refeições Substitutas
              </Button>
            </div>
          </Collapse>
        </Accordion>
      </Card>

      <Collapse in={equivalentCollapseopen}>
        <div className="mt-2">
          {props.meal.substituicoes.map((replacementMeal) => (
            <div className="d-flex position-realative" key={replacementMeal.id}>
              <CsLineIcons icon="arrow-bottom-right" className="mx-2" />
              <CardReplacementMeal
                key={replacementMeal.id}
                meal={replacementMeal}
                mealId={Number(props.meal.id)}
                handleOpenModalPhotoMeal={props.handleOpenModalPhotoMeal}
                handleOpenModalObservation={props.handleOpenModalObservation}
              />
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default CardMeal;
