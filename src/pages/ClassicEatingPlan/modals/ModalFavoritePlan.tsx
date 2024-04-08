import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useClassicPlan from '../hooks/useClassicPlan';
import useMacrosStore from '../hooks/useMacrosStore';
import { notify } from '../../../components/toast/NotificationIcon';
import api from '../../../services/useAxios';
import { formatDateToYYYYMMDD } from '../../../services/useDateHelpers';
import { ClassicPlan } from '../../../types/PlanoAlimentarClassico';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';

interface ModalFavoritePlan {
  show: boolean;
  onClose: () => void;
}

const ModalFavoritePlan: React.FC<ModalFavoritePlan> = ({ show, onClose }) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const meals = useClassicPlan((state) => state.meals);
  const vrProteinas = useMacrosStore((state) => state.vrProteinas);
  const vrCarboidratos = useMacrosStore((state) => state.vrCarboidratos);
  const vrLipideos = useMacrosStore((state) => state.vrLipideos);
  const vrCalorias = useMacrosStore((state) => state.vrCalorias);
  const vrPeso = useMacrosStore((state) => state.vrPeso);

  const initialValues = { nome: '' };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Insira um nome válido'),
  });

  const onSubmit = async (values: { nome: string }) => {
    setIsSaving(true);

    try {
      const payload = parseToMealTemplate(values.nome);

      await api.post('/plano_alimentar', payload);

      onClose();
      setIsSaving(false);

      notify('Plano alimentar salvo com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao salvar plano alimentar', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const parseToMealTemplate = (nome: string) => {
    const newMeals = meals.map((meal, index) => {
      const alimentos = meal.alimentos.map((food) => {
        const alimentoequivalentes = food.alimentoequivalentes.map((equivalent) => {
          return { ...equivalent, id: undefined, idRefeicaoAlimento: undefined };
        });

        return { ...food, alimentoequivalentes, id: undefined, id_refeicao: undefined };
      });

      const newSubstituicoes = meal.substituicoes.map((replacement) => {
        const refeicaoSubstitutaAlimentos = replacement.alimentos.map((food) => {
          const refeicaoModeloSubstitutaAlimentoEquivalentes = food.alimentoequivalentes.map((equivalent) => {
            const newEquivalent = { ...equivalent, id: undefined, idRefeicaoAlimento: undefined };

            return newEquivalent;
          });

          return { ...food, refeicaoModeloSubstitutaAlimentoEquivalentes, id: undefined, id_refeicao: undefined };
        });

        return { ...replacement, refeicaoSubstitutaAlimentos, id: undefined, id_refeicao: undefined };
      });

      const ordens = meal.ordens.map(() => {
        return { posicao: index + 1 };
      });

      return { ...meal, alimentos, substituicoes: newSubstituicoes, ordens, id: undefined, id_plano: undefined };
    });

    const date = new Date();
    const dataa = formatDateToYYYYMMDD(date);

    const payload: ClassicPlan = {
      data: date.toISOString(),
      dataa: dataa,
      observacao: '',
      idPaciente: null,
      vrProteinas: Number(vrProteinas),
      vrCarboidratos: Number(vrCarboidratos),
      vrLipideos: Number(vrLipideos),
      vrCalorias: Number(vrCalorias),
      vrPeso: Number(vrPeso),
      visivel: 0,
      recordatorio: 0,
      periodizacaoFim: dataa,
      periodizacaoInicio: dataa,
      meals: newMeals,
      dias: [],
      tipoPlano: 1,
      nome,
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
          <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
            Salvar plano alimentar
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalFavoritePlan;
