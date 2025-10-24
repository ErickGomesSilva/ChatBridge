# API Endpoints

Documentação completa dos endpoints da API ChatBridge.

## Autenticação

### POST /api/auth/register
**Descrição**: Registra um novo usuário no sistema

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta (201)**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "usuario@exemplo.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Erros**:
- `400`: Dados inválidos
- `409`: Email já existe
- `500`: Erro interno do servidor

---

### POST /api/auth/login
**Descrição**: Autentica usuário e retorna JWT token

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erros**:
- `401`: Credenciais inválidas
- `400`: Dados inválidos
- `500`: Erro interno do servidor

---

## Usuários

### GET /api/users
**Descrição**: Lista todos os usuários cadastrados

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Resposta (200)**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario1@exemplo.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "email": "usuario2@exemplo.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Erros**:
- `401`: Não autorizado
- `500`: Erro interno do servidor

---

## Conversas

### POST /api/conversations
**Descrição**: Cria nova conversa entre dois usuários

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body**:
```json
{
  "user1Id": "123e4567-e89b-12d3-a456-426614174000",
  "user2Id": "456e7890-e89b-12d3-a456-426614174001"
}
```

**Resposta (201)**:
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "user1": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario1@exemplo.com"
  },
  "user2": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "email": "usuario2@exemplo.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Erros**:
- `400`: Dados inválidos
- `401`: Não autorizado
- `500`: Erro interno do servidor

---

### GET /api/conversations/:userId
**Descrição**: Busca conversas de um usuário específico

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parâmetros**:
- `userId`: ID do usuário (UUID)

**Resposta (200)**:
```json
[
  {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "user1": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "usuario1@exemplo.com"
    },
    "user2": {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "email": "usuario2@exemplo.com"
    },
    "messages": [
      {
        "id": "abc12345-e89b-12d3-a456-426614174003",
        "text": "Olá, como você está?",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Erros**:
- `401`: Não autorizado
- `404`: Usuário não encontrado
- `500`: Erro interno do servidor

---

## Mensagens

### POST /api/messages/:conversationId
**Descrição**: Envia mensagem para uma conversa

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parâmetros**:
- `conversationId`: ID da conversa (UUID)

**Body**:
```json
{
  "senderId": "123e4567-e89b-12d3-a456-426614174000",
  "text": "Olá, como você está?"
}
```

**Resposta (201)**:
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174003",
  "text": "Olá, como você está?",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "sender": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario1@exemplo.com"
  },
  "conversation": {
    "id": "789e0123-e89b-12d3-a456-426614174002"
  }
}
```

**WebSocket**: Emite evento `newMessage` para a sala da conversa

**Erros**:
- `400`: Dados inválidos
- `401`: Não autorizado
- `404`: Conversa não encontrada
- `500`: Erro interno do servidor

---

### GET /api/messages/:conversationId
**Descrição**: Busca mensagens de uma conversa

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Parâmetros**:
- `conversationId`: ID da conversa (UUID)

**Resposta (200)**:
```json
[
  {
    "id": "abc12345-e89b-12d3-a456-426614174003",
    "text": "Olá, como você está?",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "sender": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "usuario1@exemplo.com"
    }
  },
  {
    "id": "def67890-e89b-12d3-a456-426614174004",
    "text": "Estou bem, obrigado!",
    "createdAt": "2024-01-01T00:01:00.000Z",
    "sender": {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "email": "usuario2@exemplo.com"
    }
  }
]
```

**Erros**:
- `401`: Não autorizado
- `404`: Conversa não encontrada
- `500`: Erro interno do servidor

---

## App

### GET /api
**Descrição**: Health check da API

**Resposta (200)**:
```json
"Hello World!"
```

---

## WebSocket Events

**URL**: `ws://localhost:3000`

### Cliente → Servidor

#### joinConversation
**Descrição**: Cliente entra na sala de uma conversa

**Payload**:
```json
"conversation-id-uuid"
```

**Uso**:
```javascript
socket.emit('joinConversation', conversationId);
```

---

### Servidor → Cliente

#### newMessage
**Descrição**: Nova mensagem na conversa

**Payload**:
```json
{
  "id": "abc12345-e89b-12d3-a456-426614174003",
  "text": "Nova mensagem",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "sender": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario1@exemplo.com"
  },
  "conversation": {
    "id": "789e0123-e89b-12d3-a456-426614174002"
  }
}
```

**Uso**:
```javascript
socket.on('newMessage', (message) => {
  console.log('Nova mensagem:', message);
});
```

---

## Códigos de Status HTTP

| Código | Descrição | Uso |
|--------|-----------|-----|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Token inválido ou ausente |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email já existe) |
| 500 | Internal Server Error | Erro interno do servidor |

---

## Autenticação

### JWT Token
**Formato**: `Bearer <token>`

**Header**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Payload**:
```json
{
  "sub": "user-id-uuid",
  "email": "usuario@exemplo.com",
  "iat": 1640995200,
  "exp": 1641081600
}
```

**Expiração**: 1 dia

---

## Validações

### Email
- Formato válido de email
- Único no sistema
- Obrigatório

### Senha
- Mínimo 6 caracteres
- Obrigatória

### UUID
- Formato UUID v4
- Válido e existente

### Texto da Mensagem
- Não vazio
- Máximo 1000 caracteres

---

## Exemplos de Uso

### Registro e Login
```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 2. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Criar Conversa e Enviar Mensagem
```bash
# 3. Criar conversa
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"user1Id":"user1-id","user2Id":"user2-id"}'

# 4. Enviar mensagem
curl -X POST http://localhost:3000/api/messages/conversation-id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"senderId":"user-id","text":"Olá!"}'
```

### WebSocket
```javascript
// Conectar e escutar mensagens
const socket = io('http://localhost:3000');

socket.emit('joinConversation', 'conversation-id');

socket.on('newMessage', (message) => {
  console.log('Nova mensagem:', message.text);
});
```
