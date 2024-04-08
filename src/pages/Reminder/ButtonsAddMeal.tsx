import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import useClassicPlan from './hooks/useClassicPlan';
import { toast } from 'react-toastify';
import { ClassicPlanMeal, ClassicPlanMealFood } from '../../types/PlanoAlimentarClassico';
import api from '../../services/useAxios';
import { notify } from '../../components/toast/NotificationIcon';

interface ButtonsAddMealProps {
  setOpenedCollapseId: (id: number) => void;
}

const ButtonsAddMeal = (props: ButtonsAddMealProps) => {
  const { planId, meals } = useClassicPlan((state) => state);
  const { addMeal } = useClassicPlan();

  const [isCreatingMeal, setIsCreatingMeal] = React.useState(false);

  const handleAddMeal = async () => {
    setIsCreatingMeal(true);

    try {
      const payload: ClassicPlanMeal = {
        nome: '',
        horario: '00:00:00',
        idPlanoAlimentar: planId,
        obs: '',
        carboidratos: 0,
        lipideos: 0,
        proteinas: 0,
        kcal: 0,
        calculavel: 1,
        html: '',
        tipoTexto: 'NÃO',
        textoDaRefeicao: '',
        linkImagem: null,
        alimentos: [],
        substituicoes: [],
        modeloId: null,
        ordens: [{ posicao: meals.length + 1 }],
      };

      const response = await api.post('/plano-alimentar-classico-refeicao', payload);

      const newMeal: ClassicPlanMeal = response.data;
      newMeal.id && props.setOpenedCollapseId(newMeal.id);

      const emptyFood: ClassicPlanMealFood = {
        id: btoa(Math.random().toString()).substring(0, 12),
        id_refeicao: newMeal.id,
        id_alimento: 0,
        tabela: '',
        medida_caseira: '',
        gramas: 0,
        nome: '',
        quantidade_medida: 1,
        apelido_medida_caseira: '',
        alimentoequivalentes: [],
        ordens: []
      }

      newMeal.alimentos = [emptyFood];

      addMeal(newMeal);

      setIsCreatingMeal(false);
    } catch (error) {
      notify('Erro ao adicionar refeição', 'Erro', 'error', 'danger', false);
      setIsCreatingMeal(false);
      console.error(error);
    }
  };

  return (
    <>
      {!isCreatingMeal ? (
        <Button onClick={handleAddMeal}>Adicionar refeição</Button>
      ) : (
        <Button disabled>
          <Spinner animation="border" role="status" size="sm">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          Adicionando refeição...
        </Button>
      )}
    </>
  );
};

export default ButtonsAddMeal;
