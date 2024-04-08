import React, { useRef, useState } from 'react';
import { Col, Button, Tooltip, OverlayTrigger, Dropdown, ButtonGroup, Form } from 'react-bootstrap';
import ModalOrientation from './modals/modalObservation';
import useFilterDisplayStore from './hooks/useFilterDisplayStore';
import ModalShoppingList from './modals/ModalShoppingList';
import ModalFavoritePlan from './modals/ModalFavoritePlan';
import { useMicronutrientStore } from './hooks/micronutrientStore';
import ModalSelectPDF from './modals/ModalSelectPDF';
import ModalSendPDF from './modals/ModalSendPDF';
import { useModalsStore } from './hooks/useModalsStore';
import useClassicPlan from './hooks/useClassicPlan';
import { notify, updateNotify } from '../../components/toast/NotificationIcon';
import { useEditCustomFoodModalStore } from '../MyMaterials/my-foods/hooks/EditCustomFoodModalStore';
import api from '../../services/useAxios';
import { downloadPDF } from '../../helpers/PdfHelpers';
import { Food } from '../../types/foods';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../components/AsyncButton';

const options = [
  { label: 'TUCUNDUVA', value: 'tucunduva'},
  { label: 'USDA', value: 'usda'},
  { label: 'IBGE', value: 'ibge'},
  { label: 'TACO', value: 'taco'},
  { label: 'Suplementos', value: 'suplementos'},
  { label: 'Alimento customizado', value: 'alimento_customizado'},
  { label: 'Receitas', value: 'receita'},
]

const OptionButtons = () => {
  const [showModalObservation, setShowModallObservation] = useState(false);
  const [showModalShoppingList, setShowModallShoppingList] = useState(false);
  const [showModalFavoritePlan, setShowModalFavoritePlan] = useState(false);

  const selectedTables = useFilterDisplayStore((state) => state.selectedTables);
  const showNutrients = useFilterDisplayStore((state) => state.showNutrients);

  const planId = useClassicPlan((state) => state.planId);

  const toastId = useRef<React.ReactText>();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const showMicronutrientsCard = useMicronutrientStore((state) => state.showMicronutrientsCard);
  const { setShowMicronutrientsCard } = useMicronutrientStore();

  const { setSelectedTables, setShowNutrients } = useFilterDisplayStore();
  const { setShowModalSendPDF, setShowModalSelectPDF } = useModalsStore();
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

  const handleDownloadMicronutrientsPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf da macro e micronutrientes, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.get(
        '/plano-alimentar-classico-pdf/' + planId + '/micronutrientes', {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );

      downloadPDF(data, 'micronutrientes-' + planId);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
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

      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-message">Escreva ou escolha orientações relacionadas ao seu plano alimentar.</Tooltip>}>
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={() => setShowModallObservation(true)}>
          <CsLineIcons icon="message" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-cart">
            Crie uma lista de compras com os alimentos principais do plano alimentar para 7, 15 ou 30 dias. É possível editar o nome dos alimentos e também suas
            quantidades.
          </Tooltip>
        }
      >
        <Button onClick={() => setShowModallShoppingList(true)} variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
          <CsLineIcons icon="cart" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-print">
            Realize o download do PDF do plano alimentar no seu computador. É possível personalizar a exibição das medidas caseiras e o layout do arquivo.
          </Tooltip>
        }
      >
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button"  onClick={() => setShowModalSelectPDF(true)}>
          <CsLineIcons icon="print" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-print">Realize o download do PDF do plano alimentar que contém os macro e micronutrientes no seu computador.</Tooltip>}
      >
        <span>
          <AsyncButton isSaving={isGeneratingPdf} loadingText=' ' onClickHandler={handleDownloadMicronutrientsPdf} className="btn-sm btn-icon btn-icon-only mb-1 ms-1" type="button">
            <CsLineIcons icon="print" />
          </AsyncButton>
        </span>
      </OverlayTrigger>

      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-print">
            Envie os PDF's do plano alimentar para o e-mail do paciente
          </Tooltip>
        }
      >
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button"  onClick={() => setShowModalSendPDF(true)}>
          <CsLineIcons icon="send" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-star">Guarde este plano alimentar como um modelo para ser utilizado com todos os seus pacientes.</Tooltip>}
      >
        <Button onClick={() => setShowModalFavoritePlan(true)} variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
          <CsLineIcons icon="star" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-help">Treinamento</Tooltip>}>
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button">
          <CsLineIcons icon="help" />
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-help">Análise do plano alimentar</Tooltip>}>
        <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={() => setShowMicronutrientsCard(!showMicronutrientsCard)}>
          <CsLineIcons icon="chart-4" />
        </Button>
      </OverlayTrigger>

      <ModalOrientation show={showModalObservation} onClose={() => setShowModallObservation(false)} />
      <ModalShoppingList show={showModalShoppingList} onClose={() => setShowModallShoppingList(false)} />
      <ModalFavoritePlan show={showModalFavoritePlan} onClose={() => setShowModalFavoritePlan(false)} />
      <ModalSelectPDF />
      <ModalSendPDF />

    </Col>
  );
};

export default OptionButtons;
