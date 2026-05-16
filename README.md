# Marquei API

API do sistema de agendamento para salões, com controle de autenticação, permissões e gerenciamento de agenda.

---

## Stack utilizada

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt

A stack foi escolhida por permitir uma arquitetura escalável e organizada. O NestJS facilita a separação por módulos, controllers, services e repositories, enquanto o Prisma simplifica a comunicação com o banco de dados e melhora a produtividade no desenvolvimento.

---

## Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/leonardo-rendano/marquei-backend.git
cd marquei-backend
```

---

## Instale as dependências

```bash
npm install
```

---

## Configure as variáveis de ambiente

Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

---

## Execute as migrations

```bash
npx prisma migrate dev
```

---

## Gere o Prisma Client

```bash
npx prisma generate
```

---

## Rode o projeto

```bash
npm run start:dev
```

A API ficará disponível em:

```txt
http://localhost:3333
```

---

## Variáveis de ambiente

### `.env.example`

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/marquei"
JWT_SECRET="sua_chave_secreta"
PORT=3333
```

---

## Credenciais de teste

As credenciais podem ser criadas manualmente ou via seed.

### Gestor

```txt
E-mail: gestor@marquei.com
Senha: 123456
```

### Profissional

```txt
E-mail: profissional@marquei.com
Senha: 123456
```

### Cliente

```txt
E-mail: cliente@marquei.com
Senha: 123456
```

---

## Decisões de arquitetura

O backend foi estruturado em módulos por domínio, como autenticação, usuários, profissionais, serviços, disponibilidade, agendamentos e dashboard. Cada módulo possui responsabilidades separadas entre controller, service e repository.

As regras de negócio ficam centralizadas na camada de service, enquanto a persistência é abstraída através do Prisma ORM. O sistema utiliza autenticação JWT e controle de permissões por perfil utilizando guards e decorators customizados.

---

## O que ficou de fora

Algumas funcionalidades ficaram fora do escopo inicial:

- edição e exclusão de registros;
- notificações automáticas;
- logs de auditoria;
- testes automatizados;
- cache;
- filas assíncronas;
- documentação Swagger;
- deploy em produção;
- observabilidade e monitoramento.

---

## O que eu faria diferente com mais tempo

Com mais tempo, eu adicionaria testes automatizados, documentação completa da API com Swagger, filas assíncronas para notificações e logs de auditoria.

Também evoluiria o sistema de permissões para uma camada mais robusta, adicionaria tratamento global de exceções mais completo e implementaria observabilidade com logs estruturados e monitoramento.