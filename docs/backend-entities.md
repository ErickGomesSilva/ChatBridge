# Backend Entities 

Documentação das entidades (modelos de dados) do backend ChatBridge.

## User Entity

**Localização**: `src/users/user.entity.ts`
**Tabela**: `user`

### Campos

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | `string` | Identificador único | Primary Key, UUID |
| `email` | `string` | Email do usuário | Unique, Not Null |
| `password` | `string` | Senha hasheada | Not Null |
| `createdAt` | `Date` | Data de criação | Auto-generated |
| `updatedAt` | `Date` | Data de atualização | Auto-generated |

### Relacionamentos

- **One-to-Many** com `Conversation` (como user1)
- **One-to-Many** com `Conversation` (como user2)
- **One-to-Many** com `Message` (como sender)

### Exemplo de Dados

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "usuario@exemplo.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMye...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Conversation Entity

**Localização**: `src/conversations/conversation.entity.ts`
**Tabela**: `conversation`

### Campos

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | `string` | Identificador único | Primary Key, UUID |
| `user1` | `User` | Primeiro usuário | Foreign Key, Not Null |
| `user2` | `User` | Segundo usuário | Foreign Key, Not Null |
| `messages` | `Message[]` | Mensagens da conversa | One-to-Many |
| `createdAt` | `Date` | Data de criação | Auto-generated |
| `updatedAt` | `Date` | Data de atualização | Auto-generated |
| `lastMessageText` | `string` | Texto da última mensagem | Nullable |

### Relacionamentos

- **Many-to-One** com `User` (user1)
- **Many-to-One** com `User` (user2)
- **One-to-Many** com `Message`

### Exemplo de Dados

```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "user1": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario1@exemplo.com"
  },
  "user2": {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "email": "usuario2@exemplo.com"
  },
  "messages": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "lastMessageText": "Olá, como você está?"
}
```

---

## Message Entity

**Localização**: `src/messages/message.entity.ts`
**Tabela**: `message`

### Campos

| Campo | Tipo | Descrição | Constraints |
|-------|------|-----------|-------------|
| `id` | `string` | Identificador único | Primary Key, UUID |
| `conversation` | `Conversation` | Conversa da mensagem | Foreign Key, Not Null |
| `sender` | `User` | Usuário que enviou | Foreign Key, Not Null, Eager |
| `text` | `string` | Conteúdo da mensagem | Not Null |
| `createdAt` | `Date` | Data de criação | Auto-generated |

### Relacionamentos

- **Many-to-One** com `Conversation`
- **Many-to-One** com `User` (sender)

### Exemplo de Dados

```json
{
  "id": "789e0123-e89b-12d3-a456-426614174003",
  "conversation": {
    "id": "456e7890-e89b-12d3-a456-426614174001"
  },
  "sender": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario1@exemplo.com"
  },
  "text": "Olá, como você está?",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Estrutura do Banco de Dados

### Diagrama de Relacionamentos

```
User (1) ←→ (N) Conversation (N) ←→ (1) User
   ↓
   (N)
   ↓
Message (N) ←→ (1) Conversation
```

### Tabelas SQL

#### Tabela `user`
```sql
CREATE TABLE "user" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "email" character varying NOT NULL,
    "password" character varying NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_user" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_user_email" UNIQUE ("email")
);
```

#### Tabela `conversation`
```sql
CREATE TABLE "conversation" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user1Id" uuid NOT NULL,
    "user2Id" uuid NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "lastMessageText" character varying,
    CONSTRAINT "PK_conversation" PRIMARY KEY ("id"),
    CONSTRAINT "FK_conversation_user1" FOREIGN KEY ("user1Id") REFERENCES "user"("id"),
    CONSTRAINT "FK_conversation_user2" FOREIGN KEY ("user2Id") REFERENCES "user"("id")
);
```

#### Tabela `message`
```sql
CREATE TABLE "message" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "conversationId" uuid NOT NULL,
    "senderId" uuid NOT NULL,
    "text" character varying NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_message" PRIMARY KEY ("id"),
    CONSTRAINT "FK_message_conversation" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE,
    CONSTRAINT "FK_message_sender" FOREIGN KEY ("senderId") REFERENCES "user"("id")
);
```

---

## Índices e Otimizações

### Índices Recomendados

```sql
-- Índice para busca por email
CREATE INDEX "IDX_user_email" ON "user" ("email");

-- Índice para busca de conversas por usuário
CREATE INDEX "IDX_conversation_user1" ON "conversation" ("user1Id");
CREATE INDEX "IDX_conversation_user2" ON "conversation" ("user2Id");

-- Índice para busca de mensagens por conversa
CREATE INDEX "IDX_message_conversation" ON "message" ("conversationId");
CREATE INDEX "IDX_message_createdAt" ON "message" ("createdAt");
```

---

## Operações CRUD

### User
- **Create**: `UsersService.createUser()`
- **Read**: `UsersService.findByEmail()`, `UsersService.findAll()`
- **Update**: Não implementado
- **Delete**: Não implementado

### Conversation
- **Create**: `ConversationsService.createConversation()`
- **Read**: `ConversationsService.findAllByUser()`
- **Update**: Não implementado
- **Delete**: Não implementado

### Message
- **Create**: `MessagesService.createMessage()`
- **Read**: `MessagesService.getMessagesByConversation()`
- **Update**: Não implementado
- **Delete**: Não implementado

---

## Validações e Constraints

### User
- Email deve ser único
- Email deve ter formato válido
- Senha deve ter pelo menos 6 caracteres
- Senha é hasheada antes de salvar

### Conversation
- user1 e user2 devem ser diferentes
- Não pode haver conversa duplicada entre os mesmos usuários

### Message
- Texto não pode ser vazio
- Sender deve existir
- Conversation deve existir
- Mensagens são deletadas em cascata quando conversa é deletada

---

## Estatísticas e Métricas

### Queries Úteis

```sql
-- Total de usuários
SELECT COUNT(*) FROM "user";

-- Total de conversas
SELECT COUNT(*) FROM "conversation";

-- Total de mensagens
SELECT COUNT(*) FROM "message";

-- Mensagens por usuário
SELECT u.email, COUNT(m.id) as message_count
FROM "user" u
LEFT JOIN "message" m ON u.id = m."senderId"
GROUP BY u.id, u.email;

-- Conversas mais ativas
SELECT c.id, COUNT(m.id) as message_count
FROM "conversation" c
LEFT JOIN "message" m ON c.id = m."conversationId"
GROUP BY c.id
ORDER BY message_count DESC;
```
