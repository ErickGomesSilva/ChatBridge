# Frontend Pages

Documentação das páginas do frontend ChatBridge.

## Página Principal (Inbox)

**Localização**: `src/app/page.tsx`
**Rota**: `/`

### Funcionalidades

#### `InboxPage()`
- **Descrição**: Página principal que lista todas as conversas do usuário
- **Autenticação**: Requerida (redireciona para login se não autenticado)
- **Estado**:
  - `conversations`: Lista de conversas
  - `loading`: Estado de carregamento

#### Funções

##### `fetchConversations()`
- **Descrição**: Busca conversas do usuário logado
- **API**: `GET /api/conversations/${user.id}`
- **Processo**:
  1. Verifica se usuário está logado
  2. Faz requisição para API
  3. Atualiza estado com conversas
  4. Trata erros de carregamento

### Interface

- **Header**: Título "Suas Conversas" + Botão de Logout
- **Lista de Conversas**: Cards clicáveis com:
  - Email do outro participante
  - Última mensagem (se houver)
- **Link**: "➕ Nova conversa" para criar conversa
- **Estado Vazio**: "Nenhuma conversa encontrada"

### Dados

```typescript
interface Conversation {
  id: string;
  user1: User;
  user2: User;
  messages: Message[];
}

interface User {
  id: string;
  email: string;
}
```

---

## Página de Login

**Localização**: `src/app/login/page.tsx`
**Rota**: `/login`

### Funcionalidades

#### `LoginPage()`
- **Descrição**: Formulário de autenticação de usuário
- **Autenticação**: Não requerida
- **Estado**:
  - `email`: Email do usuário
  - `password`: Senha do usuário
  - `error`: Mensagem de erro

#### Funções

##### `handleLogin()`
- **Descrição**: Processa login do usuário
- **API**: `POST /api/auth/login`
- **Processo**:
  1. Valida campos obrigatórios
  2. Envia credenciais para API
  3. Salva token no localStorage
  4. Redireciona para página principal
  5. Trata erros de autenticação

### Interface

- **Formulário**:
  - Campo email (tipo email)
  - Campo senha (tipo password)
  - Botão "Entrar"
- **Feedback**: Mensagem de erro em vermelho
- **Link**: "Ainda não tem conta? Cadastre-se"

### Validação

- Email deve ter formato válido
- Senha não pode estar vazia
- Exibe erro se credenciais inválidas

---

## Página de Registro

**Localização**: `src/app/register/page.tsx`
**Rota**: `/register`

### Funcionalidades

#### `RegisterPage()`
- **Descrição**: Formulário de cadastro de novo usuário
- **Autenticação**: Não requerida
- **Estado**:
  - `email`: Email do usuário
  - `password`: Senha do usuário
  - `error`: Mensagem de erro

#### Funções

##### `handleRegister()`
- **Descrição**: Processa cadastro de usuário
- **API**: `POST /api/auth/register`
- **Processo**:
  1. Valida campos obrigatórios
  2. Envia dados para API
  3. Redireciona para página de login
  4. Trata erros de cadastro

### Interface

- **Formulário**:
  - Campo email (tipo email)
  - Campo senha (tipo password)
  - Botão "Cadastrar"
- **Feedback**: Mensagem de erro em vermelho

### Validação

- Email deve ter formato válido
- Senha não pode estar vazia
- Exibe erro se email já existe

---

## Página de Chat

**Localização**: `src/app/chat/[id]/page.tsx`
**Rota**: `/chat/[conversationId]`

### Funcionalidades

#### `ChatRoom()`
- **Descrição**: Interface de chat em tempo real
- **Autenticação**: Requerida
- **Parâmetros**: `conversationId` (ID da conversa)
- **Estado**:
  - `messages`: Lista de mensagens
  - `text`: Texto da mensagem sendo digitada
  - `loading`: Estado de carregamento

#### Funções

##### `fetchMessages()`
- **Descrição**: Carrega mensagens da conversa
- **API**: `GET /api/messages/${conversationId}`
- **Processo**:
  1. Faz requisição para API
  2. Atualiza estado com mensagens
  3. Trata erros de carregamento

##### `handleSend()`
- **Descrição**: Envia nova mensagem
- **API**: `POST /api/messages/${conversationId}`
- **Processo**:
  1. Valida se há texto e usuário logado
  2. Envia mensagem para API
  3. Adiciona mensagem à lista local
  4. Limpa campo de texto
  5. Trata erros de envio

##### WebSocket Connection
- **Descrição**: Conecta ao WebSocket para mensagens em tempo real
- **Processo**:
  1. Conecta ao servidor WebSocket
  2. Entra na sala da conversa
  3. Escuta por novas mensagens
  4. Adiciona mensagens recebidas à lista
  5. Desconecta ao sair da página

### Interface

- **Header**: Título "Chat"
- **Área de Mensagens**: Lista de mensagens com:
  - Mensagens do usuário (azul, à direita)
  - Mensagens de outros (cinza, à esquerda)
  - Email do remetente
  - Timestamp
- **Formulário de Envio**:
  - Campo de texto
  - Botão "Enviar"

### WebSocket Events

#### Cliente → Servidor
- `joinConversation`: Entra na sala da conversa

#### Servidor → Cliente
- `newMessage`: Recebe nova mensagem

### Dados

```typescript
interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    email: string;
  };
  conversation?: {
    id: string;
  };
}
```

---

## Página Nova Conversa

**Localização**: `src/app/new/page.tsx`
**Rota**: `/new`

### Funcionalidades

#### `NewConversationPage()`
- **Descrição**: Interface para iniciar nova conversa
- **Autenticação**: Requerida
- **Estado**:
  - `users`: Lista de usuários disponíveis
  - `loading`: Estado de carregamento

#### Funções

##### `fetchUsers()`
- **Descrição**: Busca todos os usuários para conversar
- **API**: `GET /api/users`
- **Processo**:
  1. Faz requisição para API
  2. Filtra usuário atual da lista
  3. Atualiza estado com usuários
  4. Trata erros de carregamento

##### `startConversation(userId)`
- **Descrição**: Inicia conversa com usuário selecionado
- **API**: `POST /api/conversations`
- **Processo**:
  1. Cria conversa entre usuário atual e selecionado
  2. Redireciona para página de chat
  3. Trata erros de criação

### Interface

- **Header**: Título "Nova Conversa"
- **Lista de Usuários**: Cards clicáveis com:
  - Email do usuário
  - Botão "Conversar"
- **Estado Vazio**: "Nenhum usuário encontrado"

---

## Componentes Reutilizáveis

### LogoutButton
**Localização**: `src/components/LogoutButton.tsx`

#### Funcionalidades
- **Descrição**: Botão para fazer logout
- **Função**: Remove token do localStorage e redireciona para login

### AuthContext
**Localização**: `src/context/AuthContext.tsx`

#### Funcionalidades
- **Descrição**: Context para gerenciar estado de autenticação
- **Estado**: `user`, `token`
- **Funções**: `login()`, `logout()`

---

## Configuração

### API Client
**Localização**: `src/app/lib/api.ts`

#### Funcionalidades
- **Base URL**: Configurada via variável de ambiente
- **Interceptors**: Adiciona token JWT automaticamente
- **Headers**: Content-Type e Authorization

### WebSocket Client
**Localização**: `src/app/lib/socket.ts`

#### Funcionalidades
- **Conexão**: Conecta ao servidor WebSocket
- **Eventos**: Gerencia eventos de mensagens

---

## Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações
- **Chat**: Mensagens se adaptam à largura da tela
- **Formulários**: Campos ocupam largura total em mobile
- **Navegação**: Botões com tamanho adequado para touch

---

## Fluxo de Navegação

```
/register → /login → / (inbox) → /new → /chat/[id]
     ↓         ↓        ↓         ↓        ↓
   Cadastro  Login   Conversas  Nova    Chat
```

### Proteção de Rotas
- **Públicas**: `/login`, `/register`
- **Protegidas**: `/`, `/new`, `/chat/[id]`
- **Redirecionamento**: Usuários não autenticados são redirecionados para login
