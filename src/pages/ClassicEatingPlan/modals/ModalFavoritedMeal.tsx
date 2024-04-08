import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import useClassicPlan from '../hooks/useClassicPlan';
import { isClassicPlanMeal } from '/src/types/PlanoAlimentarClassico';
import api from '/src/services/useAxios';
import AsyncButton from '/src/components/AsyncButton';
import { notify } from '../../../components/toast/NotificationIcon';

interface ModalFavoritedFoodProps {
  show: boolean;
  onClose: () => void;
}

const ModalFavoritedFood: React.FC<ModalFavoritedFoodProps> = ({ show, onClose }) => {
  const selectedMeal = useClassicPlan((state) => state.selectedMeal);
  const [isSaving, setIsSaving] = React.useState(false);

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Insira um nome válido'),
  });

  const initialValues = { nome: '' };
  const onSubmit = async (values: { nome: string }) => {

    setIsSaving(true)

    try {
      const payload = parseToMealTemplate(values.nome);

      await api.post('/plano-alimentar-classico-refeicao-modelo', payload)

      onClose();
      setIsSaving(false)

      notify('Refeição salva com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao salvar refeição', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false)
    }
  };

  const parseToMealTemplate = (nome: string) => {
    if (!selectedMeal) throw new Error('selectedMeal is not defined');
    if (!isClassicPlanMeal(selectedMeal)) throw new Error('selectedMeal is not defined');

    const payload = {...selectedMeal, nome};
    payload.substituicoes = [];
    payload.alimentos = [];

    payload.substituicoes = selectedMeal.substituicoes.map((replacement) => {
      const refeicaoSubstitutaAlimentos = replacement.alimentos.map((food) => {
        const refeicaoModeloSubstitutaAlimentoEquivalentes = food.alimentoequivalentes.map((equivalent) => {
          const newEquivalent = {...equivalent, id: undefined, idRefeicaoAlimento: undefined};

          return newEquivalent;
        });

        return {...food, refeicaoModeloSubstitutaAlimentoEquivalentes, id: undefined, id_refeicao: undefined};
      });

      return {...replacement, refeicaoSubstitutaAlimentos, id: undefined, id_refeicao: undefined};
    });

    payload.alimentos = selectedMeal.alimentos.map((food) => {
      const alimentoequivalentes = food.alimentoequivalentes.map((equivalent) => {
        return {...equivalent, id: undefined, idRefeicaoAlimento: undefined};
      });

      return {...food, alimentoequivalentes, id: undefined, id_refeicao: undefined};
    });

    const carboidratos = Number(selectedMeal.carboidratos);
    const lipideos = Number(selectedMeal.lipideos);
    const proteinas = Number(selectedMeal.proteinas);
    const kcal = Number(selectedMeal.kcal);

    return {...payload, carboidratos, lipideos, proteinas, kcal};
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, values, touched, errors } = formik;


  return (
    <Modal show={show} onHide={onClose} backdrop="static" className="modal-close-out">
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Salve essa refeição para usar depois</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3 filled mt-2">
            <CsLineIcons icon="cupcake" />
            <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Digite um nome para essa refeição" />
            {errors.nome && touched.nome && <div className="error">{errors.nome}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton
            isSaving={isSaving}
            onClickHandler={handleSubmit}
            type="submit"
            className="mb-1 btn btn-primary"
          >Salvar refeição</AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalFavoritedFood;
