# Architecture & Decisions | BiblioSync

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

Este documento descreve as escolhas técnicas e a estrutura de software do projeto **BiblioSync**, focando em manutenibilidade e escalabilidade.

---

## Metodologia: Feature-Sliced Design (FSD)

O projeto segue a arquitetura **FSD**, que organiza o código em camadas de responsabilidade técnica e de domínio. Isso evita o acoplamento excessivo e facilita a localização de arquivos.

### Estrutura de Camadas
| Camada | Responsabilidade |
| :--- | :--- |
| **App** | Configurações globais, providers e roteamento. |
| **Pages** | Composição de telas a partir de widgets e features. |
| **Widgets** | Componentes complexos e autônomos (ex: Header, BookGrid). |
| **Features** | Ações interativas do usuário (ex: SearchBar, AddToLibrary). |
| **Entities** | Lógica de domínio, modelos de dados e APIs (ex: Book, User). |
| **Shared** | Componentes de UI genéricos (Shadcn), hooks e utilitários. |

---

## State Management Strategy

Foi dividido o estado da aplicação em dois ecossistemas distintos para maximizar a performance:

### 1. Server State (TanStack Query)
Gerencia toda a comunicação com a **Google Books API**.
* **Cache Strategy:** Implementado `staleTime: 5m` para evitar requisições repetitivas.
* **Pagination:** Uso de `useInfiniteQuery` para um scroll infinito fluido.
* **Data Mapping:** Foi criado um *Mapper* que limpa os dados da API (como remover tags HTML das descrições e tratar thumbnails ausentes) antes de chegarem à UI.


### 2. Client State (Zustand)
Gerencia estados que precisam de persistência local e acesso global rápido.
* **Library Store:** Armazena os livros salvos e status de leitura.
* **Theme Store:** Persistência do tema Dark/Light via `localStorage`.
* **Favorites:** Lógica isolada para marcação de livros preferidos.

---

## Desenvolvimento IA-Augmented

Este projeto utilizou o **Gemini (Google AI)** como um parceiro estratégico de desenvolvimento. A colaboração focou em:
* **Refining Architecture:** Discussão de padrões de Clean Code e FSD.
* **Performance Tuning:** Otimização de chaves de cache e listeners de scroll.

---

## UI/UX & Refinamentos

A interface foi construída com **Shadcn/UI** e **Framer Motion**, focando em:
* **Skeleton States:** Garantia de que o layout não "pule" durante o carregamento.
* **Responsive Design:** Grid adaptável de 1 a 4 colunas dependendo do dispositivo.
* **Dark Mode:** Implementação completa e suave (smooth transition).

---

## Qualidade de Código

A validação do projeto é feita através de:
* **Testes de Unidade (Vitest):** Focados nos Mappers e Stores (Zustand).
* **Testes de Integração:** Validação do fluxo de Login e validações de esquema (Zod).
* **Tipagem Estrita:** TypeScript 100% para evitar erros em runtime.

---

## Referências Visuais
* [Finnger Login](https://dribbble.com/shots/24282453-Finnger-Login-Page-Illustration)
* [Library Dashboard](https://dribbble.com/shots/19289689-Library-app)
* [Libby Details](https://dribbble.com/shots/6540596-Overdrive-Libby-Shelf-Book-Details)