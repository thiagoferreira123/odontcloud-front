import React from 'react';
import { Col, Button, Tooltip, OverlayTrigger, Dropdown, ButtonGroup, Form } from 'react-bootstrap';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import useFilterDisplayStore from './hooks/useFilterDisplayStore';
import { useMicronutrientStore } from './hooks/micronutrientStore';
import { useEditCustomFoodModalStore } from '/src/pages/MyMaterials/my-foods/hooks/EditCustomFoodModalStore';
import { Food } from '/src/types/foods';

const options = [
  { label: 'TUCUNDUVA', value: 'tucunduva'},
  { label: 'USDA', value: 'usda'},
  { label: 'IBGE', value: 'ibge'},
  { label: 'TACO', value: 'taco'},
  { label: 'Suplementos', value: 'suplementos'},
  { label: 'Alimento customizado', value: 'alimento_customizado'},
]

const OptionButtons = () => {
  const selectedTables = useFilterDisplayStore((state) => state.selectedTables);
  const showNutrients = useFilterDisplayStore((state) => state.showNutrients);

  const showMicronutrientsCard = useMicronutrientStore((state) => state.showMicronutrientsCard);
  const { setShowMicronutrientsCard } = useMicronutrientStore();
  const { setSelectedTables, setShowNutrients } = useFilterDisplayStore();
  const { handleSelectFood } = useEditCustomFoodModalStore();

  const handleTableSelectionChange = (tableId: string) => {
    tableId = tableId.toLowerCase();

    const newSelectedTables = selectedTables.includes(tableId) ? selectedTables.filter((id) => id !== tableId) : [...selectedTables, tableId];

    setTimeout(() => {
      setSelectedTables(newSelectedTables);
    }, 0);
  };

  const handleChangeShowNutrients = () => {
    setTimeout(() => {
      setShowNutrients(!showNutrients);
    }, 0);
  };

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
    <Col xl={12} className="mb-1 align-items-end text-end">
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-filter">Selecione as tabelas de composições que você deseja utilizar para construir as refeições</Tooltip>}
      >
        <Dropdown as={ButtonGroup} autoClose={true}>
          <Dropdown.Toggle variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1">
            <CsLineIcons icon="filter" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <Form.Check
                type="switch"
                id="show-nutrientes"
                label="Exibir nutrientes"
                checked={showNutrients}
                onChange={handleChangeShowNutrients}
              />
            </Dropdown.Item>
            {options.map((option) => (
              <Dropdown.Item key={option.value}>
                <Form.Check
                  type="switch"
                  id={`show-${option.value}`}
                  label={option.label}
                  checked={selectedTables.includes(option.value)}
                  onChange={() => handleTableSelectionChange(option.value)}
                />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">Cadastre no OdontCloud um alimento personalizado</Tooltip>}>
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={handleCreateFood}>
          <CsLineIcons icon="cupcake" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-help">Análise do plano alimentar</Tooltip>}>
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={() => setShowMicronutrientsCard(!showMicronutrientsCard)}>
          <CsLineIcons icon="chart-4" />
        </Button>
      </OverlayTrigger>
    </Col>
  );
};

export default OptionButtons;
