# 💈 Marquei API

Backend do sistema de agendamento online desenvolvido para o case técnico Full Stack.

O objetivo do projeto é substituir o fluxo manual de agendamentos realizado por planilhas e telefonemas, oferecendo uma plataforma moderna para gestão de serviços, profissionais e clientes.

---

# 🚀 Tecnologias Utilizadas

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt

---

# 🏗️ Arquitetura

O projeto foi estruturado utilizando arquitetura modular com separação por domínio de negócio.

```txt
src/
 ├── common/
 ├── infra/
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── professionals/
 │    ├── services/
 │    ├── availability/
 │    ├── appointments/
 │    └── dashboard/
```

---

# 📦 Pré-requisitos

Antes de iniciar o projeto, é necessário possuir instalado:

- Node.js 20+
- PostgreSQL
- npm

---

# ⚙️ Instalação

## 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

---

## 2. Acesse a pasta do projeto

```bash
cd marquei-api
```

---

## 3. Instale as dependências

```bash
npm install
```

---

# 🛢️ Configuração do Banco de Dados

## 1. Crie um banco PostgreSQL

Exemplo:

```sql
CREATE DATABASE marquei;
```

---

## 2. Crie o arquivo `.env`

Na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marquei?schema=public"

JWT_SECRET="supersecret"
```

---

# 🧬 Prisma ORM

## Gerar o Prisma Client

```bash
npx prisma generate
```

---

## Rodar as migrations

```bash
npx prisma migrate dev
```

---

# ▶️ Executando a aplicação

## Ambiente de desenvolvimento

```bash
npm run start:dev
```

---

# 🌐 API

A aplicação ficará disponível em:

```txt
http://localhost:3000
```

---

# 🔐 Autenticação

A API utiliza autenticação JWT Bearer Token.

## Fluxo de autenticação

1. Criar usuário
2. Fazer login
3. Receber token JWT
4. Enviar token no header das requisições protegidas

Exemplo:

```http
Authorization: Bearer TOKEN
```

---

# 👥 Perfis de Usuário

O sistema possui três perfis:

| Perfil       | Responsabilidade                                       |
| ------------ | ------------------------------------------------------ |
| GESTOR       | Administração de serviços, profissionais e indicadores |
| PROFISSIONAL | Visualização e gestão da própria agenda                |
| CLIENTE      | Agendamento, cancelamento e consulta de horários       |

---

# ✅ Funcionalidades Implementadas

---

## 🔐 Autenticação e Autorização

### Implementado

- Login com JWT
- Hash de senha com bcrypt
- Estratégia JWT (`JwtStrategy`)
- Guard de autenticação (`JwtAuthGuard`)
- Controle de permissões por perfil (`RolesGuard`)
- Decorator customizado `@Roles`
- Perfis:
  - GESTOR
  - PROFISSIONAL
  - CLIENTE

---

## 👥 Usuários

### Implementado

- Cadastro de usuários
- Busca de usuários
- Estrutura modular:
  - Controller
  - Service
  - Repository
  - Module

---

## 💇 Serviços

### Implementado

- CRUD completo de serviços
- Campos:
  - nome
  - duração
  - preço
- Proteção de rotas para gestores

---

## 👨‍🔧 Profissionais

### Implementado

- CRUD de profissionais
- Associação com usuário
- Associação com serviços executados
- Estrutura modular completa

---

## 📅 Disponibilidade / Jornada

### Implementado

- Cadastro de disponibilidade semanal
- Dias da semana
- Horários de início e fim
- Busca de disponibilidade por profissional

---

## 📆 Agendamentos

### Implementado

- Criação de agendamentos
- Cancelamento de agendamentos
- Conclusão de atendimentos
- Consulta de horários disponíveis
- Cálculo inteligente de slots
- Verificação de conflitos de horário
- Impedimento de overlap de horários
- Validação de data futura

### Regras implementadas

- Considera:
  - jornada do profissional
  - duração do serviço
  - horários ocupados
- Evita double-booking em fluxo normal de uso

---

## 📊 Dashboard

### Implementado

- Estrutura de dashboard para gestores
- Indicadores:
  - faturamento estimado
  - serviços mais procurados

---

## 🧠 Arquitetura

### Implementado

- NestJS modular
- Repository Pattern
- Prisma ORM
- DTOs
- Guards
- Separação por contexto de domínio

---

# 🚧 Funcionalidades Pendentes

---

## 🔔 Notificações Automáticas

### Não implementado

- Confirmação de agendamento
- Lembrete 24h antes
- Notificações de cancelamento/remarcação
- Processamento assíncrono
- Retry de notificações

---

## 🔁 Remarcação

### Não implementado

- Remarcação de agendamentos
- Regra de antecedência mínima

---

## 📥 Importação em Massa

### Não implementado

- Importação CSV/Excel
- Processamento assíncrono
- Controle de status da importação
- Relatório de falhas por linha

---

## 📈 Dashboard Avançado

### Não implementado

- Taxa de ocupação por profissional
- Taxa de no-show
- Indicadores temporais avançados

---

## 🧪 Testes

### Não implementado

- Testes unitários
- Testes E2E
- Testes de concorrência

---

# 📌 Observações Técnicas

- O projeto foi desenvolvido utilizando arquitetura modular orientada a domínio.
- A camada de acesso ao banco foi abstraída utilizando Repository Pattern.
- O cálculo de disponibilidade considera duração do serviço, jornada do profissional e conflitos existentes.
- O sistema possui controle de autorização baseado em roles.

---

# 👨‍💻 Autor

Leonardo Rendano
