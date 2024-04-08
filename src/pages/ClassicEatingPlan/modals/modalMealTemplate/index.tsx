import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useRef } from 'react';
import { Button, Col, Modal, Pagination, Row, Spinner } from 'react-bootstrap';
import SearchInput from './SearchInput';
import useClassicPlan from '../../hooks/useClassicPlan';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useModalsStore } from '../../hooks/useModalsStore';
import {
  ClassicPlanMealFood,
  ClassicPlanMealFoodEquivalent,
  ClassicPlanMealTemplate,
  isClassicPlanMeal,
  isClassicPlanMealTemplate,
} from '../../../../types/PlanoAlimentarClassico';
import { RecipeHistoryRecipe, RecipeHistoryRecipeMethodOfPreparation } from '../../../../types/ReceitaCulinaria';
import NotificationIcon, { notify } from '../../../../components/toast/NotificationIcon';
import api from '../../../../services/useAxios';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

interface ModalMealTemplateProps {
  onClose: () => void;
}

const ModalMealTemplate: React.FC<ModalMealTemplateProps> = (props: ModalMealTemplateProps) => {
  const [type, setType] = React.useState('personalPlans' as 'personalPlans' | 'OdontCloudPlans' | 'recipePlans');
  const [selectedPage, setSelectedPage] = React.useState(1);
  const [query, setQuery] = React.useState('' as string);
  const toastId = useRef<React.ReactText>();

  const showModalMealTemplate = useModalsStore((state) => state.showModalMealTemplate);
  const replacementMealId = useModalsStore((state) => state.replacementMealId);
  const baseMealId = useModalsStore((state) => state.baseMealId);

  const meals = useClassicPlan((state) => state.meals);
  const planId = useClassicPlan((state) => state.planId);
  const { addMeal, updateReplacementMeal } = useClassicPlan();

  const actualPage = useMemo(() => {
    const actualIndex = (selectedPage - 1) * 5;
    return [actualIndex, actualIndex + 5];
  }, [selectedPage]);

  const pages = useMemo(() => {
    const pagesArray = [];
    let page = selectedPage;

    if (page === 1) {
      page = 2;
    }

    for (let i = page - 1; i < page - 1 + 4; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }, [selectedPage]);

  const getMealTemplates = async (): Promise<(ClassicPlanMealTemplate | RecipeHistoryRecipe)[]> => {
    let url = 'plano-alimentar-classico-refeicao-modelo';

    switch (type) {
      case 'personalPlans':
        url = '/plano-alimentar-classico-refeicao-modelo';
        break;
      case 'OdontCloudPlans':
        url = '/plano-alimentar-classico-refeicao-modelo/shared';
        break;
      case 'recipePlans':
        url = '/receita-culinaria-diet-system/shared';
        break;
      default:
        break;
    }

    try {
      const response = await api.get<(ClassicPlanMealTemplate | RecipeHistoryRecipe)[]>(url);

      return response.data;
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError && error.response?.status != 404) notify(error.response?.data.message, 'Erro', 'close', 'danger');

      return [];
    }
  };

  const handleSetType = (type: 'personalPlans' | 'OdontCloudPlans' | 'recipePlans') => {
    setSelectedPage(1);
    setType(type);
  };

  const handleSelectTemplate = async (template: ClassicPlanMealTemplate | RecipeHistoryRecipe) => {
    toastId.current = notify('Clonando refeição, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const isRecipe = !isClassicPlanMealTemplate(template);

      if (!template || (isRecipe && !parseRecipe) || (isRecipe && !parseTemplate)) {
        console.error('Invalid input or missing parse functions');
        return;
      }

      const payload = isRecipe ? parseRecipe(template) : parseTemplate(template);

      props.onClose();

      if (replacementMealId && baseMealId) {
        const response = await api.patch('/plano-alimentar-classico-refeicao-substituta/' + replacementMealId, payload);

        updateReplacementMeal(response.data);
      } else {
        const response = await api.post('/plano-alimentar-classico-refeicao', {
          ...payload,
          idPlanoAlimentar: planId,
          ordens: [
            {
              posicao: meals.length,
            },
          ],
        });

        addMeal(response.data);
      }

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Refeição selecionada com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });
    } catch (error) {
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao selecionar refeição!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  const parseRecipe = (recipe: RecipeHistoryRecipe) => {
    const alimentos = recipe.alimentos.map((food, index) => {

      if(!food.id_alimento) return console.error('Invalid food id');

      const new_food: ClassicPlanMealFood = {
        id_alimento: food.id_alimento,
        tabela: food.tabela,
        medida_caseira: food.medida_caseira,
        gramas: food.gramas,
        nome: food.nome,
        quantidade_medida: food.quantidade,
        alimentoequivalentes: [],
        apelido_medida_caseira: food.medida_caseira,
        ordens: [{ posicao: index + 1 }]
      };

      return new_food;
    });

    const payload = {
      nome: recipe.nome,
      horario: '00:00',
      obs: formatRecipePreparationObject(recipe.preparos),
      html: null,
      carboidratos: 0,
      lipideos: 0,
      proteinas: 0,
      kcal: 0,
      id_profissional: 46,
      linkImagem: recipe.imagem || null,
      tipoTexto: 'NÃO',
      textoDaRefeicao: null,
      calculavel: 1,
      alimentos,
      substituicoes: [],
    };

    return payload;
  };

  const parseTemplate = (template: ClassicPlanMealTemplate) => {
    const alimentos = template.alimentos.map((food) => {
      const alimentoequivalentes = food.alimentoequivalentes.map((equivalent) => {
        const new_equivalent: ClassicPlanMealFoodEquivalent = {
          nomeAlimento: equivalent.nomeAlimento,
          tabelaEquivalente: equivalent.tabelaEquivalente,
          medidaCaseiraEquivalente: equivalent.medidaCaseiraEquivalente,
          gramasUnidade: equivalent.gramasUnidade,
          quantidade: equivalent.quantidade,
          gramasNutriente: equivalent.gramasNutriente,
          nutrienteEquivalente: '',
        };

        return new_equivalent;
      });

      const ordens = [{ posicao: food.ordens.posicao }];

      const new_food: ClassicPlanMealFood = {
        id_alimento: food.id_alimento,
        tabela: food.tabela,
        medida_caseira: food.medida_caseira,
        gramas: food.gramas,
        nome: food.nome,
        quantidade_medida: food.quantidade_medida,
        apelido_medida_caseira: '',
        alimentoequivalentes,
        ordens,
      };

      return new_food;
    });

    const substituicoes = template.substituicoes.map((replacement) => {
      const alimentos = replacement.alimentos.map((food) => {
        const equivalentes = food.alimentoequivalentes.map((equivalent) => {
          const new_equivalent = {
            nomeAlimento: equivalent.nomeAlimento,
            tabelaEquivalente: equivalent.tabelaEquivalente,
            medidaCaseiraEquivalente: equivalent.medidaCaseiraEquivalente,
            gramasUnidade: equivalent.gramasUnidade,
            quantidade: equivalent.quantidade,
            gramasNutriente: equivalent.gramasNutriente,
          };

          return new_equivalent;
        });

        const new_food = {
          id_alimento: food.id_alimento,
          tabela: food.tabela,
          medida_caseira: food.medida_caseira,
          gramas: food.gramas,
          nome: food.nome,
          quantidade_medida: food.quantidade_medida,
          alimentoequivalentes: equivalentes,
        };

        return new_food;
      });

      const new_replacement = {
        nome: replacement.nome,
        horario: replacement.horario || '',
        obs: replacement.obs || '',
        carboidratos: Number(replacement.carboidratos),
        lipideos: Number(replacement.lipideos),
        proteinas: Number(replacement.proteinas),
        kcal: Number(replacement.kcal),
        link_imagem: replacement.link_imagem || '',
        tipo_texto: replacement.tipo_texto || '',
        texto_da_refeicao: replacement.texto_da_refeicao || '',
        alimentos,
      };

      return new_replacement;
    });

    const payload = {
      nome: template.nome,
      horario: template.horario || '00:00',
      obs: template.obs || null,
      html: template.html || null,
      carboidratos: Number(template.carboidratos),
      lipideos: Number(template.lipideos),
      proteinas: Number(template.proteinas),
      kcal: Number(template.kcal),
      linkImagem: template.linkImagem || null,
      tipoTexto: template.tipoTexto || 'NÃO',
      textoDaRefeicao: template.textoDaRefeicao || null,
      calculavel: 1,
      alimentos,
      substituicoes,
    };

    return payload;
  };

  const formatRecipePreparationObject = (preparationJson: RecipeHistoryRecipeMethodOfPreparation[]) => {
    const preparationSteps = preparationJson.map((step) => {
      return `${step.passo_numero}. ${step.passo_descricao}`;
    });

    return preparationSteps.join('\n');
  };

  const response = useQuery({ queryKey: ['meal-templates', type], queryFn: getMealTemplates, enabled: showModalMealTemplate });

  const filteredTemplates = response.data
    ? response.data.filter((template: ClassicPlanMealTemplate | RecipeHistoryRecipe) => String(template.nome).toLowerCase().includes(query.toLowerCase()))
    : [];

  const slicedTemplates = filteredTemplates ? filteredTemplates.slice(actualPage[0], actualPage[1]) : [];

  return (
    <Modal show={showModalMealTemplate} onHide={props.onClose} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Escolha um modelo de refeição</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex justify-content-center mb-3 mt-2">
          <Button variant={type === 'personalPlans' ? 'primary' : 'outline-primary'} className="mb-1 ms-2" onClick={() => handleSetType('personalPlans')}>
            Meus modelos
          </Button>{' '}
          <Button variant={type === 'OdontCloudPlans' ? 'primary' : 'outline-primary'} className="mb-1 ms-2" onClick={() => handleSetType('OdontCloudPlans')}>
            Modelos do OdontCloud
          </Button>{' '}
          <Button variant={type === 'recipePlans' ? 'primary' : 'outline-primary'} className="mb-1 ms-2" onClick={() => handleSetType('recipePlans')}>
            Receitas culinárias
          </Button>{' '}
        </div>

        <Row className="d-flex align-items-end mt-3 mb-3">
          <div className="me-3">
            <div className="w-100 w-md-auto search-input-container border border-separator">
              <SearchInput query={query} setQuery={setQuery} placeholder={`Digite o nome da ${type === 'recipePlans' ? 'receita' : 'refeição'}`} />
            </div>
          </div>
        </Row>

        {response.isLoading ? (
          <div className="w-100 d-flex justify-content-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : response.isError ? (
          <div className="w-100 d-flex justify-content-center p-5">Erro ao carregar os modelos de refeição.</div>
        ) : filteredTemplates && filteredTemplates.length ? (
          slicedTemplates.map((template) => (
            <div className="border-bottom border-separator-light  mb-2 pb-2" key={template.id}>
              <Row className="g-0 sh-6 pointer" onClick={() => handleSelectTemplate(template)}>
                <Col xs="auto">
                  {isClassicPlanMealTemplate(template) ? (
                    <img src={template.linkImagem ?? '/img/banner/vertical-1.webp'} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
                  ) : (
                    <img
                      src={template.imagem?.length ? template.imagem : '/img/banner/vertical-1.webp'}
                      className="card-img rounded-xl sh-6 sw-6"
                      alt="thumb"
                    />
                  )}
                </Col>
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{template.nome}</div>
                    </div>
                    <div className="d-flex">
                      {isClassicPlanMeal(template) ? (
                        <div className="d-flex flex-row ms-3">
                          <div className="d-flex flex-column align-items-center ms-5">
                            <div className="text-muted text-small">CHO</div>
                            <div className="text-alternate">{template.carboidratos}</div>
                          </div>
                          <div className="d-flex flex-column align-items-center ms-5">
                            <div className="text-muted text-small">PTN</div>
                            <div className="text-alternate">{template.proteinas}</div>
                          </div>
                          <div className="d-flex flex-column align-items-center ms-5">
                            <div className="text-muted text-small">LIP</div>
                            <div className="text-alternate">{template.lipideos}</div>
                          </div>
                          <div className="d-flex flex-column align-items-center ms-5">
                            <div className="text-muted text-small">KCAL</div>
                            <div className="text-alternate">{template.kcal}</div>
                          </div>
                        </div>
                      ) : (
                        false
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <div className="w-100 d-flex justify-content-center p-5">Nenhum modelo de refeição encontrado.</div>
        )}

        {/* Footer */}
        <div className="d-flex justify-content-center mt-4 mb-0">
          <nav>
            <Pagination className="bordered">
              <Pagination.Prev onClick={() => setSelectedPage(selectedPage - 1)} disabled={selectedPage === 1}>
                <CsLineIcons icon="chevron-left" />
              </Pagination.Prev>
              {pages.map((page) => (
                <Pagination.Item key={page} onClick={() => setSelectedPage(page)} active={selectedPage === page} disabled={page > filteredTemplates.length / 5}>
                  {page}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= filteredTemplates.length / 5}>
                <CsLineIcons icon="chevron-right" />
              </Pagination.Next>
            </Pagination>
          </nav>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMealTemplate;
