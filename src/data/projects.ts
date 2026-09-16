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
    id: 'c01-collectible',
    number: '01',
    category: 'BONECO / COLECIONÁVEL',
    title: 'C-01 — personagem de bancada',
    shortTitle: 'C-01',
    description: 'Um personagem original criado como demonstração de volume, encaixes, silhueta e acabamento para peças colecionáveis.',
    application: 'Colecionáveis, mascotes e miniaturas autorais',
    materialHint: 'Conceito procedural Crivo',
    visual: 'robot',
    sourceName: 'Modelo procedural original do site',
    license: 'Uso próprio / demonstração',
  },
  {
    id: 'wizard-prop',
    number: '02',
    category: 'FANTASY / PROP',
    title: 'Chapéu de mago',
    shortTitle: 'Wizard',
    description: 'Peças temáticas funcionam muito bem para mostrar como um objeto simples ganha presença quando proporção e acabamento são tratados com intenção.',
    application: 'Decoração, RPG, cosplay e presentes',
    materialHint: 'Referência low-poly web-ready',
    visual: 'wizard',
    modelUrl: 'https://polyfork.dev/cdn/wizard-hat-84bb49.glb',
    sourceUrl: 'https://polyfork.dev/asset/wizard-hat-84bb49',
    sourceName: 'Wizard Hat — Polyfork',
    license: 'Commercial use allowed · no attribution required',
  },
  {
    id: 'adventure-sword',
    number: '03',
    category: 'GAMES / PROP',
    title: 'Espada de aventureiro',
    shortTitle: 'Sword',
    description: 'Um prop de jogo mostra bem espessura, escala, empunhadura e a leitura de uma peça quando ela sai da tela e vira objeto físico.',
    application: 'Props, cosplay, cenografia e exposição',
    materialHint: 'Referência low-poly web-ready',
    visual: 'sword',
    modelUrl: 'https://polyfork.dev/cdn/sword-11907e.glb',
    sourceUrl: 'https://polyfork.dev/asset/sword-11907e',
    sourceName: 'Sword — Polyfork',
    license: 'Commercial use allowed · no attribution required',
  },
  {
    id: 'display-helmet',
    number: '04',
    category: 'COSPLAY / EXPOSIÇÃO',
    title: 'Capacete de exposição',
    shortTitle: 'Helmet',
    description: 'Formas curvas e volumes ocos ajudam a demonstrar como a impressão 3D pode atender peças decorativas, wearables e protótipos de encaixe.',
    application: 'Cosplay, decoração e prototipagem',
    materialHint: 'Referência low-poly web-ready',
    visual: 'helmet',
    modelUrl: 'https://polyfork.dev/cdn/steel-helmet-f5aa7d.glb',
    sourceUrl: 'https://polyfork.dev/asset/steel-helmet-f5aa7d',
    sourceName: 'Steel Helmet — Polyfork',
    license: 'Commercial use allowed · no attribution required',
  },
  {
    id: 'headphone-shell',
    number: '05',
    category: 'TECH / ACESSÓRIO',
    title: 'Shell para headphone',
    shortTitle: 'Audio',
    description: 'Geometrias de produto ajudam a visualizar carcaças, acessórios, suportes e peças customizadas que precisam existir com precisão.',
    application: 'Acessórios, carcaças e protótipos',
    materialHint: 'Referência low-poly web-ready',
    visual: 'headphones',
    modelUrl: 'https://polyfork.dev/cdn/headphones-d3e940.glb',
    sourceUrl: 'https://polyfork.dev/asset/headphones-d3e940',
    sourceName: 'Headphones — Polyfork',
    license: 'Commercial use allowed · no attribution required',
  },
  {
    id: 'modular-planter',
    number: '06',
    category: 'DESIGN / OBJETO',
    title: 'Vaso modular',
    shortTitle: 'Planter',
    description: 'Objetos de uso cotidiano mostram o lado funcional da impressão 3D: formato, proporção e personalização trabalhando juntos.',
    application: 'Casa, organização e design personalizado',
    materialHint: 'Referência low-poly web-ready',
    visual: 'planter',
    modelUrl: 'https://polyfork.dev/cdn/planter-f0dab0.glb',
    sourceUrl: 'https://polyfork.dev/asset/planter-f0dab0',
    sourceName: 'Planter — Polyfork',
    license: 'Commercial use allowed · no attribution required',
  },
]
