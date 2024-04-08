type Medicao = {
  title: string;
  nome: string;
};

export const classificationMeasurements: Medicao[] = [
  { title: 'Altura (m)', nome: 'altura' },
  { title: 'Peso atual (kg)', nome: 'peso' },
  { title: 'IMC Atual (kg/m²)', nome: 'imcAtual' },
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