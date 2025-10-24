# Backend Services 

Documentação dos serviços do backend ChatBridge.

## AuthService

**Localização**: `src/auth/auth.service.ts`

### Funções

#### `register(registerDto: RegisterUserDto)`
- **Descrição**: Registra um novo usuário no sistema
- **Parâmetros**: 
  - `registerDto`: Objeto com email e senha
- **Processo**:
  1. Hash da senha usando bcrypt (salt rounds: 10)
  2. Criação do usuário via UsersService
  3. Retorna o usuário criado (sem senha)
- **Retorno**: `Promise<User>`
- **Erros**: Lança exceção se houver erro no hash ou criação

#### `login(loginDto: LoginDto)`
- **Descrição**: Autentica um usuário e retorna JWT token
- **Parâmetros**:
  - `loginDto`: Objeto com email e senha
- **Processo**:
  1. Busca usuário por email
  2. Verifica se usuário existe
  3. Compara senha com hash armazenado
  4. Gera JWT token com payload (sub: userId, email)
  5. Retorna access_token
- **Retorno**: `Promise<{ access_token: string }>`
- **Erros**: `UnauthorizedException` se credenciais inválidas

---

## UsersService

**Localização**: `src/users/users.service.ts`

### Funções

#### `createUser(data: Partial<User>)`
- **Descrição**: Cria um novo usuário no banco de dados
- **Parâmetros**:
  - `data`: Dados parciais do usuário (email, password, etc.)
- **Processo**:
  1. Cria entidade User com dados fornecidos
  2. Salva no banco via TypeORM
- **Retorno**: `Promise<User>`
- **Erros**: Lança exceção se houver erro de validação ou banco

#### `findByEmail(email: string)`
- **Descrição**: Busca usuário pelo email
- **Parâmetros**:
  - `email`: Email do usuário
- **Retorno**: `Promise<User | null>`
- **Uso**: Usado no processo de login

#### `findAll()`
- **Descrição**: Retorna todos os usuários cadastrados
- **Retorno**: `Promise<User[]>`
- **Uso**: Listagem de usuários (admin)

---

## MessagesService

**Localização**: `src/messages/messages.service.ts`

### Funções

#### `createMessage(text: string, sender: User, conversation: Conversation)`
- **Descrição**: Cria uma nova mensagem e notifica via WebSocket
- **Parâmetros**:
  - `text`: Conteúdo da mensagem
  - `sender`: Usuário que enviou
  - `conversation`: Conversa de destino
- **Processo**:
  1. Cria entidade Message
  2. Salva no banco
  3. Busca mensagem completa com relações
  4. Emite evento via WebSocket para a sala da conversa
- **Retorno**: `Promise<Message>`
- **WebSocket**: Emite `newMessage` para `conversation-{id}`

#### `getMessagesByConversation(conversationId: string)`
- **Descrição**: Busca todas as mensagens de uma conversa
- **Parâmetros**:
  - `conversationId`: ID da conversa
- **Processo**:
  1. Busca mensagens filtradas por conversa
  2. Inclui relação com sender
  3. Ordena por data de criação (ASC)
- **Retorno**: `Promise<Message[]>`
- **Uso**: Carregamento do histórico de mensagens

---

## ConversationsService

**Localização**: `src/conversations/conversations.service.ts`

### Funções

#### `createConversation(user1: User, user2: User)`
- **Descrição**: Cria uma nova conversa entre dois usuários
- **Parâmetros**:
  - `user1`: Primeiro usuário
  - `user2`: Segundo usuário
- **Processo**:
  1. Cria entidade Conversation
  2. Associa os dois usuários
  3. Salva no banco
- **Retorno**: `Promise<Conversation>`
- **Uso**: Início de nova conversa

#### `findAllByUser(userId: string)`
- **Descrição**: Busca todas as conversas de um usuário
- **Parâmetros**:
  - `userId`: ID do usuário
- **Processo**:
  1. Busca conversas onde usuário é user1 OU user2
  2. Inclui relações com user1, user2 e messages
  3. Ordena por data de atualização (DESC)
- **Retorno**: `Promise<Conversation[]>`
- **Uso**: Lista de conversas do usuário

---

## MessagesGateway (WebSocket)

**Localização**: `src/messages/message.gateway.ts`

### Funções

#### `handleJoinConversation(conversationId: string, client: Socket)`
- **Descrição**: Adiciona cliente à sala de uma conversa
- **Parâmetros**:
  - `conversationId`: ID da conversa
  - `client`: Socket do cliente
- **Processo**:
  1. Cliente entra na sala `conversation-{id}`
  2. Log da conexão
- **Evento**: `joinConversation`
- **Uso**: Cliente se conecta para receber mensagens

#### `emitNewMessage(message: Message)`
- **Descrição**: Envia nova mensagem para todos na sala da conversa
- **Parâmetros**:
  - `message`: Mensagem completa com relações
- **Processo**:
  1. Emite evento `newMessage` para sala `conversation-{id}`
  2. Todos os clientes conectados recebem a mensagem
- **Evento**: `newMessage`
- **Uso**: Notificação em tempo real de novas mensagens

---

## AppService

**Localização**: `src/app.service.ts`

### Funções

#### `getHello()`
- **Descrição**: Endpoint de teste/health check
- **Retorno**: `string` - "Hello World!"
- **Uso**: Verificar se API está funcionando

---

## Fluxo de Dados

### Registro de Usuário
```
Frontend → AuthController → AuthService → UsersService → Database
```

### Login
```
Frontend → AuthController → AuthService → UsersService → JWT → Frontend
```

### Envio de Mensagem
```
Frontend → MessagesController → MessagesService → Database → WebSocket → Frontend
```

### Recebimento de Mensagem
```
WebSocket → MessagesGateway → Frontend (todos os clientes na sala)
```

## Segurança

- **Senhas**: Hash com bcrypt (10 rounds)
- **JWT**: Tokens com expiração de 1 dia
- **CORS**: Configurado para desenvolvimento
- **Validação**: DTOs para validação de entrada
- **Autenticação**: Bearer token em todas as requisições protegidas
