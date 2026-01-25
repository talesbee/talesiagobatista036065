# Pet Manager MT
## talesiagobatista036065

Projeto profissional para avaliação técnica — Registro público de Pets e seus tutores (SPA React + TypeScript).

## Decisão sobre tela inicial

O enunciado sugere que a tela inicial seja a listagem de pets. No entanto, como a API exige autenticação para fornecer os dados, optei por iniciar o fluxo pela tela de login. Isso evita:
- Exibir uma tela de pets vazia ou com erro de autenticação, o que prejudicaria a experiência do usuário.
- "Chumbar" credenciais no código, o que é uma má prática de segurança.
- Um fluxo confuso, onde o usuário teria que entender que precisa logar antes de ver qualquer dado.

Assim, o usuário é direcionado primeiro ao login e, após autenticação, é redirecionado para a tela de pets. Essa abordagem segue boas práticas de UX e segurança, e pode ser facilmente adaptada para proteger outras rotas no futuro.

## Como rodar o projeto

1. Instale as dependências:
	```
	npm install
	```
2. Inicie o projeto:
	```
	npm start
	```
3. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Requisitos

- Node.js 18+
- NPM 9+
- API: https://pet-manager-api.geia.vip

## Estrutura do projeto

- `src/services/`: Consumo centralizado da API (auth, pets).
- `src/pages/`: Telas principais (Login, Pets, etc).
- `src/routes/`: Rotas com lazy loading.
- `src/components/`: Componentes reutilizáveis.
