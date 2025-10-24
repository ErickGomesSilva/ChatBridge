# Frontend Components

Documentação dos componentes do frontend ChatBridge.

## LogoutButton

**Localização**: `src/components/LogoutButton.tsx`

### Funcionalidades

#### `LogoutButton()`
- **Descrição**: Componente de botão para fazer logout do usuário
- **Tipo**: Functional Component
- **Props**: Nenhuma

#### Funções

##### `handleLogout()`
- **Descrição**: Processa logout do usuário
- **Processo**:
  1. Remove token do localStorage
  2. Redireciona para página de login
  3. Atualiza estado de autenticação

### Interface

- **Botão**: "Logout" com estilo vermelho
- **Posicionamento**: Canto superior direito
- **Estilo**: `bg-red-600 hover:bg-red-700`

### Uso

```tsx
<LogoutButton />
```

---

## AuthContext

**Localização**: `src/context/AuthContext.tsx`

### Funcionalidades

#### `AuthProvider`
- **Descrição**: Provider do contexto de autenticação
- **Estado**:
  - `user`: Dados do usuário logado
  - `token`: Token JWT
  - `loading`: Estado de carregamento

#### Funções

##### `login(token: string)`
- **Descrição**: Autentica usuário com token
- **Processo**:
  1. Salva token no localStorage
  2. Decodifica JWT para obter dados do usuário
  3. Atualiza estado global
  4. Redireciona para página principal

##### `logout()`
- **Descrição**: Desautentica usuário
- **Processo**:
  1. Remove token do localStorage
  2. Limpa estado do usuário
  3. Redireciona para login

### Hook

#### `useAuth()`
- **Descrição**: Hook para acessar contexto de autenticação
- **Retorno**: `{ user, token, login, logout, loading }`

### Uso

```tsx
const { user, login, logout } = useAuth();
```

---

## API Client

**Localização**: `src/app/lib/api.ts`

### Funcionalidades

#### `axios.create()`
- **Descrição**: Cliente HTTP configurado
- **Base URL**: `${process.env.NEXT_PUBLIC_API_URL}/api`
- **Headers**: Content-Type: application/json

#### Interceptors

##### Request Interceptor
- **Descrição**: Adiciona token JWT automaticamente
- **Processo**:
  1. Verifica se há token no localStorage
  2. Adiciona header Authorization: Bearer {token}
  3. Aplica em todas as requisições

### Uso

```tsx
import axios from './lib/api';

// Requisição GET
const response = await axios.get('/conversations/123');

// Requisição POST
const response = await axios.post('/auth/login', { email, password });
```

---

## Socket Client

**Localização**: `src/app/lib/socket.ts`

### Funcionalidades

#### `io()`
- **Descrição**: Cliente WebSocket configurado
- **URL**: `http://localhost:3000`
- **CORS**: Configurado para desenvolvimento

### Eventos

#### `joinConversation(conversationId)`
- **Descrição**: Entra na sala de uma conversa
- **Payload**: ID da conversa

#### `newMessage`
- **Descrição**: Escuta por novas mensagens
- **Payload**: Objeto Message completo

### Uso

```tsx
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
socket.emit('joinConversation', conversationId);
socket.on('newMessage', (message) => {
  // Processar nova mensagem
});
```

---

## Estilos Globais

**Localização**: `src/app/globals.css`

### Funcionalidades

#### Tailwind CSS
- **Framework**: Tailwind CSS v4
- **Configuração**: PostCSS configurado
- **Classes**: Utilitárias para estilização

#### Classes Customizadas

##### Layout
- `min-h-screen`: Altura mínima da tela
- `flex items-center justify-center`: Centralização
- `p-6`: Padding de 1.5rem
- `mb-4`: Margin bottom de 1rem

##### Cores
- `bg-gray-100`: Fundo cinza claro
- `text-gray-800`: Texto cinza escuro
- `bg-blue-600`: Fundo azul
- `text-white`: Texto branco

##### Formulários
- `border rounded`: Borda arredondada
- `px-3 py-2`: Padding interno
- `w-full`: Largura total
- `hover:bg-blue-700`: Hover azul escuro

##### Estados
- `loading`: Estado de carregamento
- `error`: Estado de erro
- `success`: Estado de sucesso

### Uso

```tsx
<div className="flex min-h-screen items-center justify-center bg-gray-100">
  <div className="w-full max-w-sm bg-white p-6 rounded shadow">
    <h2 className="text-2xl font-bold mb-4">Título</h2>
  </div>
</div>
```

---

## Layout Principal

**Localização**: `src/app/layout.tsx`

### Funcionalidades

#### `RootLayout`
- **Descrição**: Layout raiz da aplicação
- **Metadados**: Título e descrição
- **Providers**: AuthProvider envolvendo toda a app

#### Estrutura

```tsx
<html>
  <body>
    <AuthProvider>
      {children}
    </AuthProvider>
  </body>
</html>
```

---

## Hooks Customizados

### useAuth
- **Descrição**: Hook para autenticação
- **Retorno**: Estado e funções de auth
- **Uso**: Em qualquer componente

### useRouter
- **Descrição**: Hook do Next.js para navegação
- **Funções**: `push()`, `back()`, `forward()`
- **Uso**: Navegação programática

### useState
- **Descrição**: Hook para estado local
- **Uso**: Gerenciar estado de componentes

### useEffect
- **Descrição**: Hook para efeitos colaterais
- **Uso**: Carregar dados, conectar WebSocket

---

## Padrões de Design

### Componentes
- **Functional Components**: Todos os componentes são funcionais
- **Hooks**: Uso extensivo de hooks do React
- **Props**: Props tipadas com TypeScript
- **Estado**: useState para estado local, Context para global

### Estilização
- **Tailwind**: Classes utilitárias
- **Responsivo**: Mobile-first approach
- **Consistência**: Paleta de cores padronizada
- **Acessibilidade**: Contraste adequado

### Navegação
- **Next.js Router**: Navegação client-side
- **Proteção de Rotas**: Verificação de autenticação
- **Redirecionamento**: Automático baseado em estado

### Estado
- **Local**: useState para estado de componente
- **Global**: Context para autenticação
- **Persistência**: localStorage para token
- **Sincronização**: WebSocket para tempo real

---

## Testes de Componentes

### Estrutura
- **Jest**: Framework de testes
- **React Testing Library**: Testes de componentes
- **Mock**: APIs e WebSocket mockados

### Cobertura
- **Renderização**: Componentes renderizam corretamente
- **Interações**: Cliques e formulários funcionam
- **Estado**: Estado é atualizado corretamente
- **Navegação**: Redirecionamentos funcionam

---

## Dependências

### Principais
- **Next.js 16**: Framework React
- **React 19**: Biblioteca de UI
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Axios**: Cliente HTTP
- **Socket.io**: WebSocket client

### Desenvolvimento
- **ESLint**: Linting
- **Prettier**: Formatação
- **Jest**: Testes
- **React Testing Library**: Testes de componentes
