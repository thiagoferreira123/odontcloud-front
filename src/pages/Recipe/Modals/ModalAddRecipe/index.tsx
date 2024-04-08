import React, { useEffect } from 'react';
import { Form, Modal, Nav, Tab } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-dropzone-uploader/dist/styles.css';
import { useModalAddRecipeStore } from './hooks/ModalAddRecipeStore';
import Information from './panes/information';
import { MultiValue } from 'react-select';
import Ingredients from './panes/Ingredients';
import StepsOfPreparation from './panes/StepsOfPreparation';
import Portioning from './panes/portioning';
import { Alimento, CategoriaRecipe, Recipe } from '../../../../types/ReceitaCulinaria';
import api from '../../../../services/useAxios';
import AsyncButton from '../../../../components/AsyncButton';
import NotificationIcon, { notify } from '../../../../components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import { useRecipeFormikStore } from './hooks/RecipeFormikStore';
import { parseFloatNumber } from '../../../../helpers/MathHelpers';
import {
  calculatePortionCalciumByWeigth,
  calculatePortionCaloriesByWeigth,
  calculatePortionCarbohydrateByWeigth,
  calculatePortionCholesterolByWeigth,
  calculatePortionFiberByWeigth,
  calculatePortionLipidByWeigth,
  calculatePortionProteinByWeigth,
  calculatePortionSaturatedFattyAcidsByWeigth,
  calculatePortionSodiumByWeigth,
} from './panes/Ingredients/utils/MathHelper';
import { Option } from '../../../../types/inputs';

export interface FormValues {
  recipeName: string;
  description: string;
  categories: MultiValue<Option>;
  preparationTime: string;
  recipePortionName: string;
  recipePortionWeight: string;
  recipePortionQuantity: string;
  recipeWeight: string;
  shareRecipe: 'SIM' | 'NAO';
  file: string;
}

interface ModalAddRecipeProps {
  // eslint-disable-next-line no-unused-vars
  onAddRecipe?: (recipe: Recipe) => void;
}

const ModalAddRecipe = (props: ModalAddRecipeProps) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const showModal = useModalAddRecipeStore((state) => state.showModal);
  const recipe = useRecipeFormikStore((state) => state.recipe);

  const preparations = useModalAddRecipeStore((state) => state.preparations);
  const foods = useModalAddRecipeStore((state) => state.foods);

  const validationSchema = Yup.object().shape({
    recipeName: Yup.string().required('Insira um nome válido'),
    description: Yup.string().required('Insira uma descrição válida'),
    categories: Yup.array().min(1, 'Selecione pelo menos uma categoria').required('Selecione uma categoria'),
    preparationTime: Yup.string().required('Insira o tempo de preparo'),
    recipePortionName: Yup.string().required('Insira uma porção válida'),
    recipePortionWeight: Yup.string().required('Insira um peso válido'),
    recipePortionQuantity: Yup.number().min(1, 'Insira uma quantidade válida'),
    recipeWeight: Yup.string().required('Insira um peso válido'),
    file: Yup.string(),
  });

  const initialValues: FormValues = {
    recipeName: '',
    description: '',
    categories: [],
    preparationTime: '',
    recipePortionName: '',
    recipePortionWeight: '',
    recipePortionQuantity: '',
    recipeWeight: '',
    shareRecipe: 'SIM',
    file: '',
  };

  const { setShowModalAddRecipe } = useModalAddRecipeStore();

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);

    if (!foods.filter((f) => f.id_alimento).length) {
      notify('Insira pelo menos um ingrediente', 'Erro', 'close', 'danger');
      setIsSaving(false);
      return;
    }

    if (recipe) {
      for (const category of recipe.categorias) {
        if (!values.categories.find((c) => c.value === category.id_categoria.toString())) {
          try {
            await api.delete(`/receita-culinaria-diet-system-categoria/${category.id}`);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }

    try {
      const payload: Recipe = {
        id: recipe ? recipe.id : undefined,
        nome: values.recipeName,
        descricao: values.description,
        tempo_preparo: values.preparationTime,
        peso_receita: Number(values.recipeWeight),
        porcao_receita: values.recipePortionName,
        quantidade_porcao: Number(values.recipePortionQuantity),
        data_cadastro: recipe?.data_cadastro ? recipe?.data_cadastro : new Date().toISOString(),
        imagem: values.file.length > 0 ? values.file : undefined,
        compartilhada: values.shareRecipe,
        alimentos: foods.map((food) => {
          const payload: Alimento = {
            id: typeof food.id === 'number' ? food.id : undefined,
            id_alimento: Number(food.id_alimento),
            tabela: food.tabela,
            medida_caseira: food.medida_caseira,
            gramas: food.gramas,
            nome: food.nome,
            quantidade: food.quantidade,
            nome_apelido: food.nome_apelido,
            medida_caseira_apelido: food.medida_caseira_apelido,
          };

          return payload;
        }),
        preparos: preparations.map((preparation) => ({ ...preparation, id: typeof preparation.id === 'number' ? preparation.id : undefined })),
        categorias: values.categories.map((category) => {
          const existingCategory = recipe?.categorias.find((cat) => cat.id_categoria === Number(category.value));

          const payload: CategoriaRecipe = {
            id: existingCategory ? existingCategory.id : undefined,
            id_categoria: +category.value,
          };

          return payload;
        }),

        carboidratos_por_porcao: calculatePortionCarbohydrateByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        carboidratos_por_cem_gramas: calculatePortionCarbohydrateByWeigth(values.recipeWeight, foods, 100).toFixed(1),

        proteinas_por_porcao: calculatePortionProteinByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        proteinas_por_cem_gramas: calculatePortionProteinByWeigth(values.recipeWeight, foods, 100).toFixed(1),

        lipideos_por_porcao: calculatePortionLipidByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        lipideos_por_cem_gramas: calculatePortionLipidByWeigth(values.recipeWeight, foods, 100).toFixed(1),

        calorias_por_porcao: calculatePortionCaloriesByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        calorias_por_cem_gramas: calculatePortionCaloriesByWeigth(values.recipeWeight, foods, 100).toFixed(1),

        fibras_por_porcao: calculatePortionFiberByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        fibras_por_cem_gramas: calculatePortionFiberByWeigth(values.recipeWeight, foods, 100).toFixed(1),

        calcio_por_porcao: calculatePortionCalciumByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        calcio_por_cem_gramas: calculatePortionCalciumByWeigth(values.recipeWeight, foods, 100).toFixed(1),

        sodio_por_porcao: calculatePortionSodiumByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        sodio_por_cem_gramas: calculatePortionSodiumByWeigth(values.recipeWeight, foods, 100).toFixed(1),

        acidos_graxos_saturados_por_porcao: calculatePortionSaturatedFattyAcidsByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        acidos_graxos_saturados_por_cem_gramas: calculatePortionSaturatedFattyAcidsByWeigth(values.recipeWeight, foods, 100).toFixed(1),

        colesterol_por_porcao: calculatePortionCholesterolByWeigth(values.recipeWeight, foods, values.recipePortionWeight).toFixed(1),
        colesterol_por_cem_gramas: calculatePortionCholesterolByWeigth(values.recipeWeight, foods, 100).toFixed(1),
      };

      if (recipe && recipe.id) {
        const { data } = await api.put<Recipe>('/receita-culinaria-diet-system/' + recipe.id, payload);
        props.onAddRecipe && props.onAddRecipe(data);
        setIsSaving(false);
        notify('Receita atualizada com sucesso', 'Sucesso', 'check', 'success');
      } else {
        const { data } = await api.post<Recipe>('/receita-culinaria-diet-system', payload);
        props.onAddRecipe && props.onAddRecipe(data);
        setIsSaving(false);
        notify('Receita cadastrada com sucesso', 'Sucesso', 'check', 'success');
      }

      setShowModalAddRecipe(false);
      resetForm();
    } catch (error) {
      const action = recipe && recipe.id ? 'atualizar' : 'cadastrar';

      notify(`Ocorreu um erro ao tentar ${action} a receita`, 'Erro', 'close', 'danger');
      setIsSaving(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, setValues, resetForm, values, touched, errors } = formik;

  useEffect(() => {
    if (!recipe || !showModal) {
      resetForm();
      return;
    }

    setValues({
      recipeName: recipe.nome,
      description: recipe.descricao ?? '',
      categories: [],
      preparationTime: recipe.tempo_preparo,
      recipePortionName: recipe.porcao_receita,
      recipePortionWeight: parseFloatNumber(recipe.quantidade_porcao / recipe.peso_receita).toString(),
      recipePortionQuantity: recipe.quantidade_porcao.toString(),
      recipeWeight: recipe.peso_receita.toString(),
      shareRecipe: recipe.compartilhada,
      file: recipe.imagem ?? '',
    });

    setFieldValue(
      'categories',
      recipe.categorias.map((category) => ({ label: category.categoriaName?.nome ?? '', value: category.id_categoria.toString() }))
    );
  }, [recipe, resetForm, setFieldValue, setValues, showModal]);

  return (
    <Modal className="modal-close-out" size="xl" backdrop="static" show={showModal} onHide={() => setShowModalAddRecipe(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastrar receita culinária</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            if (!values.file && values.shareRecipe === 'SIM') {
              notify('Insira uma imagem para compartilhar a receita', 'Erro', 'close', 'danger');
              return e.preventDefault();
            }
            handleSubmit(e);
          }}
          className="tooltip-end-top"
        >
          <Tab.Container defaultActiveKey="Information">
            <Nav variant="tabs" className="nav-tabs-title nav-tabs-line-title mb-4" activeKey="Information">
              <Nav.Item>
                <Nav.Link eventKey="Information">Informações</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Foods">Ingredientes</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="StepsOfPreparation">Modo de preparo</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Portioning">Porcionamento</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="Information">
                <Information setFieldValue={setFieldValue} handleChange={handleChange} errors={errors} touched={touched} values={values} />
              </Tab.Pane>

              <Tab.Pane eventKey="Foods">
                <Ingredients />
              </Tab.Pane>

              <Tab.Pane eventKey="StepsOfPreparation">
                <StepsOfPreparation />
              </Tab.Pane>

              <Tab.Pane eventKey="Portioning">
                <Portioning setFieldValue={setFieldValue} handleChange={handleChange} errors={errors} touched={touched} values={values} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>

          <div className="text-center">
            <AsyncButton
              isSaving={isSaving}
              className="btn-icon btn-icon-start mb-1 hover-scale-down"
              variant="primary"
              type="submit"
              loadingText={`${recipe && recipe.id ? 'Atualizando' : 'Cadastrando'} receita...`}
            >
              {recipe && recipe.id ? 'Atualizar' : 'Cadastrar'} receita
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddRecipe;
