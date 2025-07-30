# Loca Mais

API para gerenciar um serviço de locação de imóveis, desenvolvida com foco em escalabilidade, manutenibilidade e boas práticas de arquitetura.

## Descrição

Este projeto é uma API REST desenvolvida em Node.js usando o framework Fastify, seguindo os princípios da Clean Architecture e Domain-Driven Design (DDD). O objetivo é oferecer um sistema robusto para gerenciar o processo de locação de imóveis, incluindo cadastro, listagem e, futuramente, todas as operações CRUD. O banco de dados utilizado é o PostgreSQL, executado via Docker, e está prevista a integração com um serviço externo de pagamento.

## Funcionalidades

- Cadastro de imóveis para locação (Create)
- Listagem de imóveis disponíveis (List)
- (Em desenvolvimento) Atualização e remoção de imóveis (Update & Delete)
- Integração futura com serviço de pagamento

## Tecnologias Utilizadas

- Node.js
- Fastify
- PostgreSQL (via Docker)
- Clean Architecture
- Domain-Driven Design (DDD)
- Docker

## Estrutura do Projeto

O projeto adota Clean Architecture e DDD, separando responsabilidades em camadas como:

- `domain`: regras de negócio
- `application`: casos de uso
- `infrastructure`: integrações externas (banco, serviços)
- `interfaces`: rotas e controladores (Fastify)

## Como Executar Localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/EwertonHecsley/node-loca-mais.git
   cd node-loca-mais
   ```

2. **Suba o banco de dados com Docker**
   ```bash
   docker-compose up -d
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente**
   - Crie um arquivo `.env` baseado no `.env.example` (se existir)
   - Exemplo de variáveis:
      ```
      DATABASE_URL=postgres://user:password@localhost:5432/loca_mais
      ```

5. **Execute as migrations** (se houver)
   ```bash
   npm run migrate
   ```

6. **Inicie a aplicação**
   ```bash
   npm run dev
   ```

## Endpoints Principais

- `POST /properties` – Cadastrar novo imóvel
- `GET /properties` – Listar imóveis cadastrados

## Próximos Passos

- Implementar endpoints de atualização e remoção de imóveis
- Adicionar autenticação e autorização
- Integrar com serviço de pagamentos externo
- Testes automatizados

## Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests!

## Licença

Este projeto está sob a licença MIT.

---

> Feito com 💻 por [Ewerton Hecsley](https://github.com/EwertonHecsley)
