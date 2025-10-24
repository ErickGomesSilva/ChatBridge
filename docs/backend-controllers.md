# Backend Controllers

Documentação dos controllers (endpoints) do backend ChatBridge.

## AuthController

**Localização**: `src/auth/auth.controller.ts`
**Rota Base**: `/api/auth`

### Endpoints

#### `POST /api/auth/register`
- **Descrição**: Registra um novo usuário
- **Body**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }
  ```
- **Resposta (201)**:
  ```json
  {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```
- **Erros**: 400 (dados inválidos), 500 (erro interno)

#### `POST /api/auth/login`
- **Descrição**: Autentica usuário e retorna JWT
- **Body**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }
  ```
- **Resposta (200)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Erros**: 401 (credenciais inválidas), 500 (erro interno)

---

## UsersController

**Localização**: `src/users/users.controller.ts`
**Rota Base**: `/api/users`

### Endpoints

#### `GET /api/users`
- **Descrição**: Lista todos os usuários
- **Autenticação**: Requerida
- **Resposta (200)**:
  ```json
  [
    {
      "id": "uuid",
      "email": "usuario@exemplo.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

---

## MessagesController

**Localização**: `src/messages/messages.controller.ts`
**Rota Base**: `/api/messages`

### Endpoints

#### `POST /api/messages/:conversationId`
- **Descrição**: Envia mensagem para uma conversa
- **Autenticação**: Requerida
- **Parâmetros**:
  - `conversationId`: ID da conversa (UUID)
- **Body**:
  ```json
  {
    "senderId": "uuid",
    "text": "Olá, como você está?"
  }
  ```
- **Resposta (201)**:
  ```json
  {
    "id": "uuid",
    "text": "Olá, como você está?",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "sender": {
      "id": "uuid",
      "email": "usuario@exemplo.com"
    },
    "conversation": {
      "id": "uuid"
    }
  }
  ```
- **WebSocket**: Emite `newMessage` para a sala da conversa

#### `GET /api/messages/:conversationId`
- **Descrição**: Busca mensagens de uma conversa
- **Autenticação**: Requerida
- **Parâmetros**:
  - `conversationId`: ID da conversa (UUID)
- **Resposta (200)**:
  ```json
  [
    {
      "id": "uuid",
      "text": "Olá, como você está?",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "sender": {
        "id": "uuid",
        "email": "usuario@exemplo.com"
      }
    }
  ]
  ```

---

## ConversationsController

**Localização**: `src/conversations/conversations.controller.ts`
**Rota Base**: `/api/conversations`

### Endpoints

#### `POST /api/conversations`
- **Descrição**: Cria nova conversa entre dois usuários
- **Autenticação**: Requerida
- **Body**:
  ```json
  {
    "user1Id": "uuid",
    "user2Id": "uuid"
  }
  ```
- **Resposta (201)**:
  ```json
  {
    "id": "uuid",
    "user1": {
      "id": "uuid",
      "email": "usuario1@exemplo.com"
    },
    "user2": {
      "id": "uuid",
      "email": "usuario2@exemplo.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

#### `GET /api/conversations/:userId`
- **Descrição**: Busca conversas de um usuário
- **Autenticação**: Requerida
- **Parâmetros**:
  - `userId`: ID do usuário (UUID)
- **Resposta (200)**:
  ```json
  [
    {
      "id": "uuid",
      "user1": {
        "id": "uuid",
        "email": "usuario1@exemplo.com"
      },
      "user2": {
        "id": "uuid",
        "email": "usuario2@exemplo.com"
      },
      "messages": [
        {
          "id": "uuid",
          "text": "Última mensagem",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

---

## AppController

**Localização**: `src/app.controller.ts`
**Rota Base**: `/api`

### Endpoints

#### `GET /api`
- **Descrição**: Health check da API
- **Resposta (200)**:
  ```json
  "Hello World!"
  ```

---

## WebSocket Events

**Gateway**: `MessagesGateway`
**URL**: `ws://localhost:3000`

### Eventos do Cliente → Servidor

#### `joinConversation`
- **Descrição**: Cliente entra na sala de uma conversa
- **Payload**: `conversationId` (string)
- **Uso**: Conectar-se para receber mensagens em tempo real

### Eventos do Servidor → Cliente

#### `newMessage`
- **Descrição**: Nova mensagem na conversa
- **Payload**: Objeto Message completo
- **Uso**: Notificar todos os clientes na sala sobre nova mensagem

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 401 | Não autorizado |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

---

## Autenticação

### Header de Autorização
```
Authorization: Bearer <jwt_token>
```

### JWT Payload
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

---

## DTOs (Data Transfer Objects)

### RegisterUserDto
```typescript
{
  email: string;
  password: string;
}
```

### LoginDto
```typescript
{
  email: string;
  password: string;
}
```

### CreateConversationDto
```typescript
{
  user1Id: string;
  user2Id: string;
}
```

---

## Exemplos de Uso

### Registro de Usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Enviar Mensagem
```bash
curl -X POST http://localhost:3000/api/messages/conversation-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"senderId":"user-id","text":"Olá!"}'
```
