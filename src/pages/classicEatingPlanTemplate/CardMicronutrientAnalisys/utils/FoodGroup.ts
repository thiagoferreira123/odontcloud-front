import { buildArrayMedidas } from "/src/helpers/FoodHelper";
import { ClassicPlanMealFood } from "/src/types/PlanoAlimentarClassico";
import { Food } from "/src/types/foods";

export interface GroupData {
  id: number;
  title: string;
  grams: number;
  color: string;
  percentage: number;
  total: number;
}

export function getFoodGroups(foods: ClassicPlanMealFood[], dataFoods: Food[]): GroupData[] {

  let colors = [
    '#e3aa71', '#d75841', '#a61e49', '#450c3d', '#913362',
    '#de5d70', '#eb9494', '#f2c6b8', '#65aacf', '#335f9e',
    '#171559', '#150a2b', '#2b7873', '#2b9e62', '#67d95f',
  ]

  const foodGroups = foods.reduce((groups: GroupData[], food) => {

    const dataFood = dataFoods.find((dataFood) => dataFood.id === food.id_alimento && dataFood.tabela === food.tabela);

    if(!dataFood) return groups;
    if(!dataFood.grupoAlimento) dataFood.grupoAlimento = {
      id: 0,
      descricao: 'Outros',
    };

    const total = foods.filter((f) => {
      const dataF = dataFoods.find((dataF) => dataF.id === f.id_alimento && dataF.tabela === f.tabela);

      if(!dataF) return false;

      return dataF.grupo_id === dataFood.grupo_id;
    }).length;

    const percentage = (total / foods.length) * 100;

    const randomIndex = Math.floor(Math.random() * colors.length);

    const measures = buildArrayMedidas(dataFood);
    const measure = measures.find((m) => m.nome === food.medida_caseira) ?? measures[0];

    const grams = Number(food.quantidade_medida) * measure.gramas;

    if (!groups.find((group) => group.id === Number(dataFood.grupo_id))){
      groups.push({
        id: Number(dataFood.grupo_id),
        title: dataFood.grupoAlimento.descricao,
        grams: grams,
        total,
        percentage,
        color: colors[randomIndex],
      });
    } else {
      const index = groups.findIndex((group) => group.id === Number(dataFood.grupo_id));

      groups[index].grams += grams;
      groups[index].total = total;
    }

    colors = colors.filter((color) => color !== colors[randomIndex]);

    return groups;
  }, []);

  return foodGroups;
}

export function addOpacityToHexColor(hex: string, opacity: number): string {
  // Verifica se o formato hexadecimal é válido
  if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    throw new Error('Formato de cor hexadecimal inválido');
  }

  // Extrai os componentes vermelho, verde e azul do hexadecimal
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  // Converte a opacidade de 0-100 para 0-1
  const alpha = (opacity / 100).toFixed(2);

  // Retorna a cor no formato RGBA
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}