import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { useMyReplacementListStore } from './hooks/MyReplacementListStore';
import { EquivalentEatingPlanCustomList } from '/src/types/PlanoAlimentarEquivalente';

export default function CreateButtons() {
  const { handleSelectList } = useMyReplacementListStore();

  const handleCreateFood = () => {
    const newList: EquivalentEatingPlanCustomList = {
      nome_lista: '',
      sel_grupo_0: null,
      sel_grupo_1: null,
      sel_grupo_2: null,
      sel_grupo_3: null,
      sel_grupo_4: null,
      sel_grupo_5: null,
      sel_grupo_6: null,
      sel_grupo_7: null,
      sel_grupo_8: null,
      sel_grupo_9: null,
      sel_grupo_10: null,
      sel_grupo_11: null,
      sel_grupo_12: null,
      sel_grupo_13: null,
      sel_grupo_14: null,
      grupo_0: null,
      grupo_1: null,
      grupo_2: null,
      grupo_3: null,
      grupo_4: null,
      grupo_5: null,
      grupo_6: null,
      grupo_7: null,
      grupo_8: null,
      grupo_9: null,
      grupo_10: null,
      grupo_11: null,
      grupo_12: null,
      grupo_13: null,
      grupo_14: null,
      kcal: '',
      proteinas: '',
      carboidratos: '',
      gorduras: '',
      desvio_kcal: '',
      desvio_proteinas: '',
      desvio_carboidratos: '',
      desvio_gorduras: ''
    };

    handleSelectList(newList);
  };

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => handleCreateFood()}>
        <CsLineIcons icon="check" /> <span>Criar uma lista de substituição</span>
      </Button>
    </Col>
  );
}
