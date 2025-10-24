# Configuração para EC2

## 1. Instalar PostgreSQL na EC2

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar o serviço
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Configurar PostgreSQL

```bash
# Acessar como usuário postgres
sudo -u postgres psql

# Criar usuário e banco
CREATE USER postgres WITH PASSWORD 'admin';
CREATE DATABASE "ChatBridge" OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE "ChatBridge" TO postgres;
\q
```

## 3. Configurar conexões

```bash
# Editar postgresql.conf
sudo nano /etc/postgresql/*/main/postgresql.conf

# Descomentar e alterar:
listen_addresses = '*'

# Editar pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Adicionar linha:
host    all             all             0.0.0.0/0               md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

## 4. Configurar Security Group da EC2

- Porta 22 (SSH)
- Porta 3000 (Backend)
- Porta 5432 (PostgreSQL) - apenas para desenvolvimento
- Porta 80/443 (se usar nginx)

## 5. Variáveis de Ambiente

Criar arquivo `.env` na EC2:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_DATABASE=ChatBridge
JWT_SECRET=sua-chave-secreta-forte
NODE_ENV=production
PORT=3000
```

## 6. Para Produção (Recomendado)

Use Amazon RDS em vez de PostgreSQL local:

```env
DB_HOST=seu-cluster-rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha_forte
DB_DATABASE=ChatBridge
JWT_SECRET=sua-chave-secreta-forte
NODE_ENV=production
PORT=3000
```

