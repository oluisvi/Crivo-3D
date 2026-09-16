export type ProjectVisual = 'robot' | 'wizard' | 'sword' | 'helmet' | 'headphones' | 'planter'

export type ConceptProject = {
  id: string
  number: string
  category: string
  title: string
  shortTitle: string
  description: string
  application: string
  materialHint: string
  visual: ProjectVisual
  modelUrl?: string
  sourceUrl?: string
  sourceName: string
  license: string
}

export const conceptProjects: ConceptProject[] = [
  {
    id: 'supersonic',
    number: '01',
    category: 'GAMES / COLECIONÁVEL',
    title: 'Supersonic',
    shortTitle: 'Sonic',
    description: 'Uma figure de personagem para mostrar silhueta, pose e leitura de volumes em peças colecionáveis produzidas por impressão 3D.',
    application: 'Colecionáveis, miniaturas e decoração temática',
    materialHint: 'Modelo local otimizado para web',
    visual: 'robot',
    modelUrl: '/assets/models/supersonic.glb',
    sourceName: 'Arquivo 3D fornecido para o protótipo',
    license: 'Origem/licença não informadas',
  },
  {
    id: 'spiderman-urban',
    number: '02',
    category: 'HERO / DIORAMA',
    title: 'Spider-Man Urban',
    shortTitle: 'Spider-Man',
    description: 'Uma composição de personagem com presença de cena, ideal para representar figures, dioramas e peças decorativas com mais detalhe.',
    application: 'Figures, dioramas e decoração temática',
    materialHint: 'Modelo local otimizado para web',
    visual: 'wizard',
    modelUrl: '/assets/models/spiderman-urban.glb',
    sourceName: 'Arquivo 3D fornecido para o protótipo',
    license: 'Origem/licença não informadas',
  },
  {
    id: 'heavy-metal-groot',
    number: '03',
    category: 'PERSONAGEM / COLECIONÁVEL',
    title: 'Heavy Metal Groot',
    shortTitle: 'Groot',
    description: 'Uma peça de personalidade forte para demonstrar texturas, relevos e formas orgânicas em projetos de coleção e exposição.',
    application: 'Colecionáveis, presentes e peças de exposição',
    materialHint: 'Modelo local otimizado para web',
    visual: 'planter',
    modelUrl: '/assets/models/heavy-metal-groot.glb',
    sourceName: 'Arquivo 3D fornecido para o protótipo',
    license: 'Origem/licença não informadas',
  },
  {
    id: 'goku',
    number: '04',
    category: 'ANIME / FIGURE',
    title: 'Goku',
    shortTitle: 'Goku',
    description: 'Uma figure de personagem com pose e anatomia marcantes para demonstrar volumes, detalhes e presença de peças colecionáveis em impressão 3D.',
    application: 'Figures, colecionáveis e decoração temática',
    materialHint: 'Modelo local otimizado para web',
    visual: 'sword',
    modelUrl: '/assets/models/goku.glb',
    sourceName: 'Arquivo 3D fornecido para o protótipo',
    license: 'Origem/licença não informadas',
  },
  {
    id: 'charizard',
    number: '05',
    category: 'GAMES / CRIATURA',
    title: 'Charizard',
    shortTitle: 'Charizard',
    description: 'Uma figure de criatura com asas e volumes amplos, ótima para demonstrar escala, silhueta e complexidade visual em uma única peça.',
    application: 'Figures, colecionáveis e decoração temática',
    materialHint: 'Modelo local otimizado para web',
    visual: 'headphones',
    modelUrl: '/assets/models/charizard.glb',
    sourceName: 'Arquivo 3D fornecido para o protótipo',
    license: 'Origem/licença não informadas',
  },
  {
    id: 'frieza',
    number: '06',
    category: 'ANIME / FIGURE',
    title: 'Frieza',
    shortTitle: 'Frieza',
    description: 'Uma figure de personagem com anatomia e pose marcantes para representar o nível de detalhe possível em peças voltadas a fãs e colecionadores.',
    application: 'Figures, colecionáveis e exposição',
    materialHint: 'Modelo local otimizado para web',
    visual: 'helmet',
    modelUrl: '/assets/models/frieza.glb',
    sourceName: 'Arquivo 3D fornecido para o protótipo',
    license: 'Origem/licença não informadas',
  },
]
