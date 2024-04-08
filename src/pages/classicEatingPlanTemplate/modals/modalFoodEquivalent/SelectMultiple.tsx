import Select from 'react-select';
import useClassicPlan from '../../hooks/useClassicPlan';

const nutrients = [
  { label: 'Carboidrato', value: 'carboidrato' },
  { label: 'Energia', value: 'energia' },
  { label: 'Lipídeos', value: 'lipideos' },
  { label: 'Proteína', value: 'proteina' },
  { label: 'Ácidos Graxos Monoinsaturados', value: 'acidos_graxos_monoinsaturados' },
  { label: 'Ácidos Graxos poliinsaturados', value: 'acidos_graxos_poliinsaturados' },
  { label: 'Ácidos Graxos Saturados', value: 'acidos_graxos_saturados' },
  { label: 'Cálcio', value: 'calcio' },
  { label: 'Cobre', value: 'cobre' },
  { label: 'Colesterol', value: 'colesterol' },
  { label: 'Ferro', value: 'ferro' },
  { label: 'Fibra Alimentar', value: 'fibra_alimentar' },
  { label: 'Fibras Insolúveis', value: 'fibras_insoluveis' },
  { label: 'Fibras Solúveis', value: 'fibras_soluveis' },
  { label: 'Fósforo', value: 'fosforo' },
  { label: 'Iodo', value: 'iodo' },
  { label: 'Manganês', value: 'manganes' },
  { label: 'Magnésio', value: 'magnesio' },
  { label: 'Potássio', value: 'potassio' },
  { label: 'Riboflavina', value: 'riboflavina' },
  { label: 'Selênio', value: 'selenio' },
  { label: 'Sódio', value: 'sodio' },
  { label: 'Vitamina B1 Tiamina', value: 'tiamina_vitamina_b1' },
  { label: 'Vitamina B2 Riboflavina', value: 'riboflavina_vitamina_b2' },
  { label: 'Vitamina B3 Niacina', value: 'niacina_vitamina_b3' },
  { label: 'Vitamina B6 Piridoxina', value: 'piridoxina_vitamina_b6' },
  { label: 'Vitamina B12 Cobalamina', value: 'cobalamina_vitamina_b12' },
  { label: 'Vitamina C', value: 'vitamina_c' },
  { label: 'Vitamina D Calciferol', value: 'vitamina_d_calciferol' },
  { label: 'Vitamina E Total de Alpha Tocopherol', value: 'vitamina_e_total_de_alpha_tocopherol' },
  { label: 'Zinco', value: 'zinco' },
];

const SelectMultiple = () => {
  const selectedNutrients = useClassicPlan((state) => state.selectedNutrients);
  const { setSelectedNutrients } = useClassicPlan();

  return (
    <Select classNamePrefix="react-select" isMulti options={nutrients} value={selectedNutrients} onChange={setSelectedNutrients} placeholder="Digite o label do nutriente" />
  );
};

export default SelectMultiple;
