import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { useEditCustomEquivalentFoodModalStore } from './hooks/EditCustomEquivalentFoodModalStore';
import { PersonalEquivalentFood } from '/src/types/Food';

export default function CreateButtons() {
  const { handleSelectFood } = useEditCustomEquivalentFoodModalStore();

  const handleCreateFood = () => {
    const newFood: PersonalEquivalentFood = {
      id: 0,
      id_alimento: 0,
      descricao_dos_alimentos: '',
      unidade: '',
      medida: '',
      gramas: '',
      grupo_alimento: '',
      tipo_alimento: '1',
      alimento: {
        descricao_dos_alimentos: '',
        id_legenda: 6,
        unidade: '',
        medidas_caseiras: '',
        gramas: '',
        energia: '',
        proteina: '',
        lipideos: '',
        carboidrato: ''
      }
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
