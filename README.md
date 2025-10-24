# ChatBridge

Uma aplicação de chat em tempo real construída com **NestJS** (backend) e **Next.js** (frontend), utilizando **WebSockets** para comunicação instantânea.
Aplicação feita para desafio para um processo seletivo, para fins de estudo

## Arquitetura

```
ChatBridge/
├── Back-end/                         # API em NestJS
│   └── chat_back/
│       ├── src/
│       │   ├── auth/                 # Módulo de autenticação (JWT, guards, login)
│       │   ├── conversations/        # Controle de conversas (chat rooms, histórico)
│       │   ├── dto/                  # Objetos de transferência de dados e validações
│       │   ├── messages/             # Envio e recebimento de mensagens
│       │   ├── test/                 # Testes automatizados com Jest
│       │   ├── users/                # Cadastro, login e gerenciamento de usuários
│       │   ├── app.controller.spec.ts
│       │   ├── app.controller.ts
│       │   ├── app.module.ts
│       │   ├── app.service.ts
│       │   └── main.ts               # Ponto de entrada da aplicação NestJS
│       ├── package.json
│       ├── tsconfig.json
│       └── nest-cli.json
│
├── front-end/                        # Aplicação Web (Next.js)
│   ├── public/                       # Arquivos estáticos
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   │
│   ├── src/
│   │   ├── app/                      # Estrutura de rotas e páginas do Next.js (App Router)
│   │   │   ├── chat/[id]/            # Página de chat dinâmico (ex: /chat/123)
│   │   │   ├── lib/                  # Funções utilitárias específicas do app
│   │   │   ├── login/                # Página de login
│   │   │   ├── new/                  # Criação de novas conversas ou usuários
│   │   │   ├── register/             # Página de registro de usuário
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx            # Layout global da aplicação
│   │   │   └── page.tsx              # Página inicial
│   │   │
│   │   ├── components/               # Componentes reutilizáveis (botões, inputs, etc.)
│   │   └── context/                  # Contextos React (autenticação, sessão, etc.)
│   │
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                             # Documentação e especificações
│   └── ... (diagramas, instruções, APIs, etc.)
│
├── README.md                         # Documentação principal do projeto
└── .gitignore                        # Regras de exclusão do Git

```

## Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Socket.io** - WebSockets
- **bcryptjs** - Hash de senhas

### Frontend
- **Next.js 18** - Framework React
- **TypeScript** - linguagem
- **Tailwind CSS** - Estilização
- **Socket.io Client** - WebSockets
- **Axios** - Cliente HTTP

## Funcionalidades

- **Autenticação** (Login/Registro)
- **Chat em tempo real** via WebSockets
- **Conversas privadas** entre usuários
- **Histórico de mensagens**
- **Interface responsiva**
- **Testes unitários e e2e**

## Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Backend
```bash
cd Back-end/chat_back
npm install
npm run start:dev
```

### Frontend
```bash
cd front-end
npm install
npm run dev
```

## Documentação Detalhada

- [Backend Services](./docs/backend-services.md)
- [Backend Controllers](./docs/backend-controllers.md)
- [Backend Entities](./docs/backend-entities.md)
- [Frontend Pages](./docs/frontend-pages.md)
- [Frontend Components](./docs/frontend-components.md)
- [API Endpoints](./docs/api-endpoints.md)
- [WebSocket Events](./docs/websocket-events.md)

## Testes

```bash
# Backend - Testes unitários
cd Back-end/chat_back
npm run test

# Backend - Testes e2e
npm run test:e2e

# Backend - Cobertura
npm run test:cov
```

## Configuração

### Variáveis de Ambiente

#### Backend (.env)
```env
DB_HOST=$
DB_PORT=$
DB_USERNAME=$
DB_PASSWORD=$
DB_DATABASE=$
JWT_SECRET=sua-chave-secreta
NODE_ENV=development
PORT=$
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=$
```

## Como Usar

1. **Registre-se** em `/register`
2. **Faça login** em `/login`
3. **Visualize conversas** na página inicial
4. **Inicie nova conversa** clicando em "Nova conversa"
5. **Chat em tempo real** - mensagens aparecem instantaneamente

## Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request


## Autores

- Erick Gomes da Silva - *Desenvolvimento* - [Meu Git](https://github.com/ErickGomesSilva/)

## Agradecimentos

- NestJS Team
- Next.js Team
- Socket.io Team
- Comunidade Open Source
