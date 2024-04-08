export interface ListGroup {
  id: number;
  name: string;
  title: string;
  nutrient?: string;
  color: string;
}

export const listGroups:ListGroup[] = [
  { id: 1, name: 'carnes_peixes_aves', title: 'Carnes, peixes e aves', nutrient: 'Proteínas', color: '#FF6347' },
  { id: 2, name: 'graos_tuberculos', title: 'Grãos, raízes e tubérculos', nutrient: 'Carboidratos', color: '#FFD700' },
  { id: 3, name: 'leguminosas', title: 'Leguminosas', nutrient: 'Carboidratos', color: '#FFA500' },
  { id: 4, name: 'oleos_gorduras', title: 'Óleos e gorduras', nutrient: 'Lipídeos', color: '#8B4513' },
  { id: 5, name: 'frutas', title: 'Frutas e seus derivados', nutrient: 'Carboidratos', color: '#FF4500' },
  { id: 6, name: 'frutas_alto_teor_gordura', title: 'Frutas gordurosas', nutrient: 'Lipídeos', color: '#A52A2A' },
  { id: 7, name: 'leites_derivados', title: 'Queijos, leites e derivados', nutrient: 'Proteínas/Lipídeos', color: '#FFB6C1' },
  { id: 8, name: 'vegetais_a', title: 'Vegetais folhosos', nutrient: 'Carboidratos', color: '#ADFF2F' },
  { id: 9, name: 'vegetais_b', title: 'Hortaliças', nutrient: 'Carboidratos', color: '#32CD32' },
  { id: 10, name: 'nozes_sementes', title: 'Oleaginosas, sementes e farinhas', nutrient: 'Lipídeos', color: '#DEB887' },
  { id: 11, name: 'paes_cereais_derivados', title: 'Cereais, pães e outros', nutrient: 'Carboidratos', color: '#F5DEB3' },
  { id: 12, name: 'doces_acucares', title: 'Doces e açúcares', nutrient: 'Carboidratos', color: '#FFFACD' },
  { id: 13, name: 'altas_calorias', title: 'Alimentos fonte de gorduras', nutrient: 'Lipídeos', color: '#D2B48C' },
  { id: 14, name: 'baixas_calorias', title: 'Alimentos baixos em calorias', nutrient: 'calorias', color: '#E0FFFF' },
  { id: 15, name: 'suplementos_proteicos', title: 'Suplementos protéicos', nutrient: 'Proteínas', color: '#FA8072' },
  { id: 16, name: 'ibge', title: 'IBGE', color: '#DDA0DD' },
  { id: 17, name: 'taco', title: 'Taco', color: '#BA55D3' },
  { id: 18, name: 'tucunduva', title: 'Tucunaré', color: '#9370DB' },
  { id: 19, name: 'usda', title: 'USDA', color: '#6A5ACD' },
  { id: 20, name: 'suplementos', title: 'Suplementos', color: '#48D1CC' },
  { id: 21, name: 'alimento_customizado', title: 'Alimento customizado', color: '#B0C4DE' },
  { id: 22, name: 'receitas2', title: 'Receitas 2', color: '#ADD8E6' },
];


export const initialState = {
  selectedGroup: null,
  listGroups
};