# ChatBridge 💬

Uma aplicação de chat em tempo real construída com **NestJS** (backend) e **Next.js** (frontend), utilizando **WebSockets** para comunicação instantânea.

## 🏗️ Arquitetura

```
ChatBridge/
├── Back-end/          # API NestJS
│   └── chat_back/
└── front-end/         # App Next.js
```

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Socket.io** - WebSockets
- **bcryptjs** - Hash de senhas

### Frontend
- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Socket.io Client** - WebSockets
- **Axios** - Cliente HTTP

## 📋 Funcionalidades

- ✅ **Autenticação** (Login/Registro)
- ✅ **Chat em tempo real** via WebSockets
- ✅ **Conversas privadas** entre usuários
- ✅ **Histórico de mensagens**
- ✅ **Interface responsiva**
- ✅ **Testes unitários e e2e**

## 🛠️ Instalação

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

## 📚 Documentação Detalhada

- [Backend Services](./docs/backend-services.md)
- [Backend Controllers](./docs/backend-controllers.md)
- [Backend Entities](./docs/backend-entities.md)
- [Frontend Pages](./docs/frontend-pages.md)
- [Frontend Components](./docs/frontend-components.md)
- [API Endpoints](./docs/api-endpoints.md)
- [WebSocket Events](./docs/websocket-events.md)

## 🧪 Testes

```bash
# Backend - Testes unitários
cd Back-end/chat_back
npm run test

# Backend - Testes e2e
npm run test:e2e

# Backend - Cobertura
npm run test:cov
```

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_DATABASE=ChatBridge
JWT_SECRET=sua-chave-secreta
NODE_ENV=development
PORT=3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📖 Como Usar

1. **Registre-se** em `/register`
2. **Faça login** em `/login`
3. **Visualize conversas** na página inicial
4. **Inicie nova conversa** clicando em "Nova conversa"
5. **Chat em tempo real** - mensagens aparecem instantaneamente

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento* - [SeuGitHub](https://github.com/seuusuario)

## 🙏 Agradecimentos

- NestJS Team
- Next.js Team
- Socket.io Team
- Comunidade Open Source
