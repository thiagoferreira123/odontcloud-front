import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useMacrosStore from '../hooks/useMacrosStore';
import { useEquivalentEatingPlanStore } from '../hooks/equivalentEatingPlanStore';
import api from '../../../services/useAxios';
import { notify } from '../../../components/toast/NotificationIcon';
import { formatDateToYYYYMMDD } from '../../../services/useDateHelpers';
import { parseFloatNumber } from '../../../helpers/MathHelpers';
import { getPlanCalories, getPlanCarbohydrates, getPlanLipids, getPlanProteins } from '../../PatientMenu/classic-eating-plan/utils/macrosHelpers';
import { EquivalentEatingPlan } from '../../../types/PlanoAlimentarEquivalente';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';

interface ModalFavoritePlan {
  show: boolean;
  onClose: () => void;
}

const ModalFavoritePlan: React.FC<ModalFavoritePlan> = ({ show, onClose }) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const planId = useEquivalentEatingPlanStore((state) => state.planId);
  const patientId = useEquivalentEatingPlanStore((state) => state.patientId);
  const meals = useEquivalentEatingPlanStore((state) => state.meals);
  const itensShoppingList = useEquivalentEatingPlanStore((state) => state.itensShoppingList);
  const orientations = useEquivalentEatingPlanStore((state) => state.orientations);

  const vrPeso = useMacrosStore((state) => state.vrPeso);
  const vrProteinas = useMacrosStore((state) => state.vrProteinas);
  const vrCarboidratos = useMacrosStore((state) => state.vrCarboidratos);
  const vrLipideos = useMacrosStore((state) => state.vrLipideos);
  const vrCalorias = useMacrosStore((state) => state.vrCalorias);

  const initialValues = { nome: '' };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Insira um nome válido'),
  });

  const onSubmit = async (values: { nome: string }) => {

    setIsSaving(true)

    try {
      const payload = parseToMealTemplate(values.nome);

      await api.post('/plano-alimentar-equivalente-historico/createTemplate/' + planId, payload)

      onClose();
      setIsSaving(false)

      notify('Plano alimentar salvo com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao salvar plano alimentar', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false)
    }
  };

  const parseToMealTemplate = (nome: string) => {
    const newMeals = meals.map((meal) => {
      const refeicaoAlimentos = meal.alimentos.map((food) => {
        return {...food, id: undefined, id_refeicao: undefined};
      });

      const newSubstituicoes = meal.alimentosSubstitutos.map((replacement) => {
          return {...replacement, id: undefined, id_refeicao: undefined};
        });

      const newOrders = meal.ordens.map((order) => {
        return {...order, id: undefined, id_refeicao: undefined};
      });

      return {...meal, alimentos: refeicaoAlimentos, alimentosSubstitutos: newSubstituicoes, ordens: newOrders, id: undefined, idPae: undefined};
    });

    const itensListaCompra = itensShoppingList.map((item) => {
      return {...item, id: undefined, id_plano: undefined};
    });

    const newOrientations = orientations.map((orientation) => {
      return {...orientation, id: undefined, id_plano: undefined};
    });

    const date = new Date();
    const dataa = formatDateToYYYYMMDD(date);

    const payload: EquivalentEatingPlan = {
      data: date.toISOString(),
      vrCarboidratos: Number(vrCarboidratos),
      vrProteinas: Number(vrProteinas),
      vrLipideos: Number(vrLipideos),
      vrCalorias: Number(vrCalorias),
      vrPeso: Number(vrPeso),
      visivel: 0,
      periodizacaoFim: dataa,
      periodizacaoInicio: dataa,
      meals: newMeals,
      orientations: newOrientations,
      dias: [],
      itensListaCompra,
      alimentosSelecionados: [],
      favorito: true,
      nome,
      idPaciente: patientId,
      lista_id: 0
    };

    return payload;
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, values, touched, errors } = formik;


  return (
    <Modal show={show} onHide={onClose} backdrop="static" className="modal-close-out">
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Salve esse plano alimentar para usar depois</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3 filled mt-2">
            <CsLineIcons icon="cupcake" />
            <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Digite um nome para esse plano alimentar" />
            {errors.nome && touched.nome && <div className="error">{errors.nome}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton
            isSaving={isSaving}
            onClickHandler={handleSubmit}
            type="submit"
            className="mb-1 btn btn-primary"
          >Salvar plano alimentar</AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalFavoritePlan;
