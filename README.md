# Pet Manager MT

## talesiagobatista036065

Projeto profissional para avaliação técnica — Registro público de Pets e seus tutores (SPA React +
TypeScript).

## Sumário

- [Decisão sobre tela inicial](#decis%C3%A3o-sobre-tela-inicial)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Requisitos](#requisitos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Sistema de Idiomas (i18n)](#sistema-de-idiomas-i18n)
- [Health (Liveness / Readiness)](#health-liveness--readiness)
- [Docker](#docker)
- [Facade e Testes unitários](#facade-e-testes-unit%C3%A1rios)
- [Como rodar checks e testes localmente](#como-rodar-checks-e-testes-localmente)

## Decisão sobre tela inicial

O enunciado sugere que a tela inicial seja a listagem de pets. No entanto, como a API exige
autenticação para fornecer os dados, optei por iniciar o fluxo pela tela de login. Isso evita:

- Exibir uma tela de pets vazia ou com erro de autenticação, o que prejudicaria a experiência do
  usuário.
- "Chumbar" credenciais no código, o que é uma má prática de segurança.
- Um fluxo confuso, onde o usuário teria que entender que precisa logar antes de ver qualquer dado.

Assim, o usuário é direcionado primeiro ao login e, após autenticação, é redirecionado para a tela
de pets. Essa abordagem segue boas práticas de UX e segurança, e pode ser facilmente adaptada para
proteger outras rotas no futuro.

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie em modo desenvolvimento:

```bash
npm run dev
```

3. Acesse http://localhost:3000 no navegador.

## Requisitos

- Node.js 18+
- NPM 9+
- API pública usada: https://pet-manager-api.geia.vip

## Estrutura do projeto

- `src/services/`: Consumo centralizado da API (auth, pets, tutores).
- `src/pages/`: Telas principais (Login, Pets, Tutors, Details).
- `src/routes/`: Rotas com lazy loading.
- `src/components/`: Componentes reutilizáveis (ex.: `LanguageSelector.tsx`).

## Sistema de Idiomas (i18n)

- **Visão geral:** suporte a Português e Inglês com seletor no canto superior direito
  (`src/components/LanguageSelector.tsx`).
- **Implementação:** utiliza `i18next` + `react-i18next` em `src/i18n/index.ts`. Traduções em
  `src/i18n/pt.json` e `src/i18n/en.json`.
- **Uso em componentes:** use o hook `useTranslation()` e `t('chave')` para renderizar textos
  traduzidos.
- **Como adicionar um idioma:** adicionar o JSON em `src/i18n/`, registrá-lo em `src/i18n/index.ts`
  e expandir `LanguageSelector.tsx`.
- **Persistência:** atualmente a preferência é mantida em memória; para persistir entre reloads, use
  `i18next-browser-languagedetector` ou salve em `localStorage`.

## Health (Liveness / Readiness)

- **Visão geral:** endpoints para health checks usados em deploys e orquestração.
- **Endpoints:**
  - `GET /health/liveness` — retorna `{ status: 'alive' }`.
  - `GET /health/readiness` — checa se `dist/index.html` existe e retorna `{ status: 'ready' }` ou
    `503` se não pronto.
- **Implementação:** `server/index.js` (servidor Express que também serve a SPA).

## Docker

- **Visão geral:** Dockerfile multi-stage que gera o build e cria imagem de produção com servidor
  Node.
- **Fluxo:** build (instala dependências e `npm run build`) → prod (copia `dist` e `server/`,
  instala dependências de produção).
- **Run:** o container expõe `3000` e inicia com `node server/index.js`.
- **Comandos úteis:**

```bash
npm run docker:build      # build da imagem
npm run container:start   # roda o container local (map: 3000:3000)
```

- **Variáveis:** `PORT` (padrão `3000`) controla a porta de escuta.

## Facade e Testes unitários

- **Padrão Facade:** gerenciamento de estado com `BehaviorSubject` do RxJS.
  - `src/state/StateFacade.ts` — implementação genérica (`getState`, `setState`, `update`,
    `observe`, `reset`).
  - `src/state/PetFacade.ts` e `src/state/TutorFacade.ts` — facades de domínio que encapsulam
    chamadas aos serviços e mantêm snapshots reativos (`pets$()`, `tutors$()`, `selectedPet$()`,
    `selectedTutor$()`).
- **Benefícios:** centraliza lógica, facilita testes e mantém UI reativa e previsível.

- **Testes:**
  - Ferramenta: `vitest`.
  - Scripts: `npm test` e `npm run test:coverage`.
  - Exemplos: `src/state/PetFacade.test.ts`, `src/state/TutorFacade.test.ts` — usam `vi.spyOn` para
    mockar serviços e validar atualizações de snapshot/observables.

## Como rodar checks e testes localmente

1. Desenvolvimento:

```bash
npm run dev
```

2. Produção local (build + server):

```bash
npm run build
npm run start:server
```

3. Docker:

```bash
npm run docker:build
npm run container:start
```

4. Testes:

```bash
npm test
npm run test:coverage
```

## Melhorias Futuras

- **Persistência da preferência de idioma:** Atualmente a troca de idioma é mantida em memória.
  Melhorias possíveis:
  - Salvar a preferência em `localStorage` e inicializar `i18n` lendo esse valor (ex.:
    `const lng = localStorage.getItem('lang') || 'pt'`).
  - Ou adicionar `i18next-browser-languagedetector` para detectar idioma do navegador e persistir
    automaticamente.
  - Exemplo rápido (conceito):

  ```ts
  // no src/i18n/index.ts (inicialização)
  const saved = localStorage.getItem('lang');
  i18n.init({ lng: saved || 'pt', ... });
  // no LanguageSelector: after changeLanguage -> localStorage.setItem('lang', 'en')
  ```

- **Menu fixo / Layout persistente:** Para melhorar navegação, centralizar o menu/header em um
  layout persistente:
  - Criar `src/components/Header.tsx` (ou usar o existente) com links principais (Pets, Tutores,
    Novo, Perfil) e `LanguageSelector` embutido.
  - Usar uma estrutura de layout (ex.: `AppLayout`) que envolve rotas protegidas para manter o menu
    fixo entre mudanças de rota, melhorando usabilidade e consistência.

- **Outras melhorias sugeridas:**
  - Progressive Web App (PWA) / service worker para offline e cache de assets.
  - Carregamento dinâmico de traduções (i18n lazy load) para reduzir bundle inicial.
  - Implementar testes E2E (Cypress / Playwright) cobrindo fluxos principais (login, CRUD
    pets/tutores).
  - Pipeline CI/CD com lint, build, testes e badge no README.
  - Melhorias de acessibilidade (a11y), usando `axe` e revisões de contraste/keyboard navigation.
  - Monitoramento e logging (Sentry, Prometheus) e métricas de performance.
  - Melhorias de segurança para uploads (validação de tipo/tamanho) e proteção de endpoints.
