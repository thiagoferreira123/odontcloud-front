type Medicao = {
  title: string;
  nome: string;
};

export const fieldsBoneWeight = [
  'percMassaMagra',
  'pesoMagro',
  'pesoOsseo',
  'pesoResidual',
];

export const fieldsFatWeigth = [
  'massaLivreDeGorduraKg',
  'massaLivreDGorduraPercentual',
];

export const classificationMeasurements: Medicao[] = [
  { title: 'Altura (m)', nome: 'altura' },
  { title: 'Peso total (kg)', nome: 'peso' },
  { title: 'Índice de massa corporal (kg/m²)', nome: 'imc' },
  { title: 'Classificação do IMC', nome: 'imcClassificacao' },
  { title: 'Massa gorda (%)', nome: 'percentualGordura' },
  { title: 'Massa gorda (kg)', nome: 'pesoGordo' },

  { title: 'Classificação % de gordura', nome: 'massaGordaPercentualClassificacao' },

  { title: 'Peso muscular (%)', nome: 'percMassaMagra' },
  { title: 'Peso muscular (kg)', nome: 'pesoMagro' },
  { title: 'Classificação % de massa muscular', nome: 'massaMuscularPercentualClassificacao' },

  { title: 'Peso ósseo (kg)', nome: 'pesoOsseo' },
  { title: 'Peso residual (kg)', nome: 'pesoResidual' },

  { title: 'Massa livre de gordura (kg)', nome: 'massaLivreDeGorduraKg' },
  { title: 'Massa livre de gordura (%)', nome: 'massaLivreDeGorduraPercentual' },

  { title: 'Somatória de dobras cutâneas (mm)', nome: 'somaDobras' },
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
  { title: "Biceps Esquerdo Relaxado (cm)", nome: 'bracoRelaxadoEsquerdo' },
  { title: "Biceps Esquerdo Contraído (cm)", nome: 'bracoContraidoEsquerdo' },
  { title: "Antebraço Esquerdo (cm)", nome: 'antebracoEsquerdo' },
  { title: "Punho Esquerdo (cm)", nome: 'punhoEsquerdo' },

  { title: "Biceps Direito Relaxado (cm)", nome: 'bracoRelaxadoDireito' },
  { title: "Biceps Direito Contraído (cm)", nome: 'bracoContraidoDireito' },
  { title: "Antebraço Direito (cm)", nome: 'antebracoDireito' },
  { title: "Punho Direito (cm)", nome: 'punhoDireito' },

  { title: "Coxa Proximal Esquerda (cm)", nome: 'coxaProximalEsquerda' },
  { title: "Coxa Proximal Direita (cm)", nome: 'coxaProximalDireita' },
  { title: "Coxa Medial Esquerda (cm)", nome: 'coxaMedialEsquerda' },
  { title: "Coxa Medial Direita (cm)", nome: 'coxaMedialDireita' },
  { title: "Coxa Distal Esquerda (cm)", nome: 'coxaDistalEsquerda' },
  { title: "Coxa Distal Direita (cm)", nome: 'coxaDistalDireita' },
  { title: "Panturrilha Direita (cm)", nome: 'panturrilhaDireita' },
  { title: "Panturrilha Esquerda (cm)", nome: 'panturrilhaEsquerda' },
];

export const skinFoldMeasurements: Medicao[] = [
  { title: 'Bicipital (mm)', nome: 'biceps' },
  { title: 'Tricipital (mm)', nome: 'triceps' },
  { title: 'Axilar média (mm)', nome: 'axilarMedia' },
  { title: 'Suprailíaca (mm)', nome: 'suprailiaca' },
  { title: 'Abdominal (mm)', nome: 'abdominal' },
  { title: 'Subescapular (mm)', nome: 'subescapular' },
  { title: 'Torácica (mm)', nome: 'torax' },
  { title: 'Coxa (mm)', nome: 'coxa' },
  { title: 'Panturrilha (mm)', nome: 'panturrilhaMedia' },
];