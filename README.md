# Crivo 3D — Website MVP

Website institucional imersivo criado para a **Crivo 3D**, empresa de impressão 3D de Jacareí/SP.

## Conceito

**IDEIA → CRIVO → CAMADA → FORMA**

A experiência usa a própria lógica da impressão 3D como linguagem: camadas, volume, material, uma peça tridimensional inspirada no símbolo da marca e uma entrada que aguarda o primeiro frame estabilizado do WebGL antes de revelar a página.

## Stack

- React + TypeScript
- Vite
- Three.js (hero 3D procedural, sem GLB externo)
- CSS nativo para layout, motion e responsividade

## Rodar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Conteúdo fácil de atualizar

Os textos comerciais estão centralizados em:

`src/data/site.ts`

Após o discovery com o cliente, atualize ali serviços, processo, copy e contato sem precisar refazer a estrutura visual.

## Assets

- `public/assets/crivo-logo.png` — logo fornecida no material do projeto.
- `public/assets/printer-crivo.webp` — recorte otimizado da fotografia fornecida.
- `public/assets/og-crivo.png` — social preview criado para o MVP.

## Experiência de entrada

A intro aparece apenas uma vez por sessão (`sessionStorage`) e possui três estados lógicos:

- `waiting`
- `opening`
- `hidden`

O hero 3D pré-compila a cena e comunica prontidão somente após múltiplos frames. Há timeout de segurança e suporte a `prefers-reduced-motion`.

## Observação de conteúdo

Este é um MVP visual baseado apenas nas informações fornecidas antes do contato com a empresa. Não inclui preços, materiais específicos, prazos, catálogo formal, telefone, e-mail ou promessas técnicas não confirmadas.
