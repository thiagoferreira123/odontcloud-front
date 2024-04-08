import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { Food } from '/src/types/foods';
import { useEditCustomFoodModalStore } from './hooks/EditCustomFoodModalStore';

export default function CreateButtons() {
  const { handleSelectFood } = useEditCustomFoodModalStore();

  const handleCreateFood = () => {
    const newFood: Food = {
      id: 0,
      grupo_id: 0,
      descricaoDoAlimento: '',
      medidaCaseira1: '',
      gramas1: '',
      medidaCaseira2: '',
      gramas2: '',
      medidaCaseira3: '',
      gramas3: '',
      medidaCaseira4: '',
      gramas4: '',
      medidaCaseira5: '',
      gramas5: '',
      tabela: 'ALIMENTO_CUSTOMIZADO',
      id_alimento_base: 0,
      key: '',
      energia: 0,
      proteina: 0,
      lipideos: 0,
      colesterol: 0,
      carboidrato: 0,
      cinzas: 0,
      calcio: 0,
      magnesio: 0,
      manganes: 0,
      fosforo: 0,
      ferro: 0,
      sodio: 0,
      potassio: 0,
      cobre: 0,
      zinco: 0,
      retinol: 0,
      tiamina_vitamina_b1: 0,
      riboflavina_vitamina_b2: 0,
      piridoxina_vitamina_b6: 0,
      niacina_vitamina_b3: 0,
      vitamina_c: 0,
      acidos_graxos_saturados: 0,
      acidos_graxos_monoinsaturados: 0,
      acidos_graxos_poliinsaturados: 0,
      fibraAlimentar: 0,
      selenio: 0,
      vitaminaAEquivalenteDeAtividadeDeRetinol: 0,
      tiaminaVitaminaB1: 0,
      riboflavinaVitaminaB2: 0,
      niacinaVitaminaB3: 0,
      equivalenteDeNiacinaVitaminaB3: 0,
      piridoxinaVitaminaB6: 0,
      cobalaminaVitaminaB12: 0,
      vitaminaDCalciferol: 0,
      vitaminaETotalDeAlphaTocopherol: 0,
      vitaminaC: 0,
      acidosGraxosSaturados: 0,
      acidosGraxosMonoinsaturados: 0,
      acidosGraxosPoliinsaturados: 0,
      acidosGraxosTransTotal: 0,
    };

    handleSelectFood(newFood);
  };

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => handleCreateFood()}>
        <CsLineIcons icon="check" /> <span>Criar um alimento</span>
      </Button>
    </Col>
  );
}
