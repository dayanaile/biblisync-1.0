# BiblioSync | Guia de Execução

Este guia contém as instruções necessárias para configurar, executar e testar o projeto localmente.

---

## Stack Tecnológica

O projeto foi construído utilizando as ferramentas mais modernas do ecossistema React:

* **Core:** React 18 + TypeScript (Strict Mode)
* **Routing:** TanStack Router (Type-safe routing)
* **Data Fetching:** TanStack Query v5 (Cache & Sync)
* **State:** Zustand (Global store com persistência)
* **Forms:** React Hook Form + Zod (Validação de esquemas)
* **UI/UX:** TailwindCSS + DaisyUI + Framer Motion
* **Testing:** Vitest + React Testing Library

---

## Como Executar

Siga os passos abaixo para rodar o projeto em sua máquina:

### 1. Instalação de Dependências
Certifique-se de estar utilizando o Node.js (v18+ recomendado).
```bash
npm install
```

### 2. Executar em Desenvolvimento

```bash
npm run dev
```
O projeto estará disponível em http://localhost:5173.

## Suíte de Testes (Vitest)

O projeto utiliza Vitest como runner de testes por sua velocidade e integração nativa com o Vite.
    * Executar todos os testes: ```npm test```
    * Modo Watch: ```npm run test:watch```
    * Interface Visual: ```npm run test:ui``` (abre uma dashboard no navegador)

## Stack Tecnológica Completa
**Framework:** 	React 18 + Vite
**Linguagem:**	TypeScript (Strict Mode)
**Roteamento:**	TanStack Router (File-based routing)
**Data Fetching:**	TanStack Query v5
**Estado Global:**	Zustand
**Estilização:**	TailwindCSS + DaisyUI
**Formulários:**	React Hook Form + Zod
**Testes:**	Vitest + React Testing Library

## Scripts Úteis
Script	->  Função
```npm run build```	->  Gera o bundle otimizado para produção na pasta /dist.
```npm run preview```	->  Executa localmente o build de produção para validação.
```npm run lint```	->  Analisa o código em busca de erros de padrão e estilo.

### Observações de Roteamento

Este projeto utiliza o TanStack Router. As rotas são definidas em src/routes/.
Ao adicionar um novo arquivo de rota, o roteador gera automaticamente os tipos no arquivo routeTree.gen.ts. Certifique-se de manter o npm run dev ligado para que essa sincronização ocorra em tempo real.