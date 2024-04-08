type Medicao = {
  title: string;
  nome: string;
};

export const fieldsBoneWeight = [
  'perc_massa_magra',
  'peso_magro',
  'peso_osseo',
  'peso_residual',
];

export const fieldsFatWeigth = [
  'massa_livre_de_gordura_kg',
  'massa_livre_de_gordura_percentual',
];

export const classificationMeasurements: Medicao[] = [
  { title: 'Altura (m)', nome: 'altura' },
  { title: 'Peso total (kg)', nome: 'peso' },
  { title: 'Índice de massa corporal (kg/m²)', nome: 'imc' },
  { title: 'Classificação do IMC', nome: 'imc_classificacao' },
  { title: 'Massa gorda (%)', nome: 'perc_massa_gorda' },
  { title: 'Massa gorda (kg)', nome: 'peso_gordo' },

  { title: 'Classificação % de gordura', nome: 'massa_gorda_kg_classificacao' },

  { title: 'Peso muscular (%)', nome: 'perc_massa_magra' },
  { title: 'Peso muscular (kg)', nome: 'peso_magro' },
  { title: 'Classificação % de massa muscular', nome: 'massa_muscular_percentual_classificacao' },

  { title: 'Peso ósseo (kg)', nome: 'peso_osseo' },
  { title: 'Peso residual (kg)', nome: 'peso_residual' },

  { title: 'Massa livre de gordura (kg)', nome: 'massa_livre_de_gordura_kg' },
  { title: 'Massa livre de gordura (%)', nome: 'massa_livre_de_gordura_percentual' },

  { title: 'Somatória de dobras cutâneas (mm)', nome: 'soma_dobras' },
  { title: 'Densidade corporal (kg/L)', nome: 'densidade' },

  { title: 'Risco cardiovascular por circunferencia de cintura', nome: 'riscocardio' },
];

export const girthMeasurements: Medicao[] = [
  { title: "Pescoço (cm)", nome: 'pescoco' },
  { title: "Peitoral (cm)", nome: 'peitoral' },
  { title: "Ombro (cm)", nome: 'ombro' },
  { title: "Cintura (cm)", nome: 'cintura' },
  { title: "Abdomen (cm)", nome: 'abdomen' },
  { title: "Quadril (cm)", nome: 'quadril' },
  { title: "Biceps Esquerdo Relaxado (cm)", nome: 'braco_relaxado_esquerdo' },
  { title: "Biceps Esquerdo Contraído (cm)", nome: 'braco_contraido_esquerdo' },
  { title: "Antebraço Esquerdo (cm)", nome: 'antebraco_esquerdo' },
  { title: "Punho Esquerdo (cm)", nome: 'punho_esquerdo' },

  { title: "Biceps Direito Relaxado (cm)", nome: 'braco_relaxado_direito' },
  { title: "Biceps Direito Contraído (cm)", nome: 'braco_contraido_direito' },
  { title: "Antebraço Direito (cm)", nome: 'antebraco_direito' },
  { title: "Punho Direito (cm)", nome: 'punho_direito' },

  { title: "Coxa Proximal Esquerda (cm)", nome: 'coxa_proximal_esquerda' },
  { title: "Coxa Proximal Direita (cm)", nome: 'coxa_proximal_direita' },
  { title: "Coxa Medial Esquerda (cm)", nome: 'coxa_medial_esquerda' },
  { title: "Coxa Medial Direita (cm)", nome: 'coxa_medial_direita' },
  { title: "Coxa Distal Esquerda (cm)", nome: 'coxa_distal_esquerda' },
  { title: "Coxa Distal Direita (cm)", nome: 'coxa_distal_direita' },
  { title: "Panturrilha Direita (cm)", nome: 'panturrilha_direita' },
  { title: "Panturrilha Esquerda (cm)", nome: 'panturrilha_esquerda' },
];

export const skinFoldMeasurements: Medicao[] = [
  { title: 'Bicipital (mm)', nome: 'biceps' },
  { title: 'Tricipital (mm)', nome: 'triceps' },
  { title: 'Axilar média (mm)', nome: 'axilar_media' },
  { title: 'Suprailíaca (mm)', nome: 'suprailiaca' },
  { title: 'Abdominal (mm)', nome: 'abdominal' },
  { title: 'Subescapular (mm)', nome: 'subescapular' },
  { title: 'Torácica (mm)', nome: 'torax' },
  { title: 'Coxa (mm)', nome: 'coxa' },
  { title: 'Panturrilha (mm)', nome: 'panturrilha_media' },
];