# Mark Agenda API

Mark Agenda API é uma aplicação backend desenvolvida em Node.js com Express, Prisma e PostgreSQL. O objetivo do projeto é fornecer uma API para gerenciamento de agendamentos, usuários e serviços, permitindo funcionalidades como registro de usuários, autenticação, agendamento de serviços e recuperação de senha.

## Tecnologias Utilizadas

-   **Node.js**: Plataforma para execução de código JavaScript no servidor.
-   **Express**: Framework web para criação de APIs REST.
-   **Prisma**: ORM para interação com o banco de dados PostgreSQL.
-   **PostgreSQL**: Banco de dados relacional utilizado para armazenar as informações.
-   **JWT (JSON Web Token)**: Para autenticação e autorização.
-   **Bcrypt**: Para hashing de senhas.
-   **Nodemailer**: Para envio de emails (ex.: recuperação de senha).
-   **Dotenv**: Para gerenciamento de variáveis de ambiente.

## Funcionalidades

-   **Gerenciamento de Usuários**:

    -   Registro de novos usuários.
    -   Login com geração de token JWT.
    -   Recuperação de senha via email.
    -   Redefinição de senha.
    -   Obtenção de perfil do usuário autenticado.

-   **Gerenciamento de Agendamentos**:

    -   Criação de agendamentos.
    -   Listagem de agendamentos por usuário.
    -   Exclusão de agendamentos.

-   **Gerenciamento de Serviços**:
    -   Cadastro de serviços.
    -   Listagem de serviços disponíveis.

## Estrutura do Projeto

mark-agenda-api/
├── prisma/ # Arquivos de configuração do Prisma
│ └── schema.prisma # Definição do banco de dados
├── src/
│ ├── controllers/ # Controladores das rotas
│ ├── middlewares/ # Middlewares (ex.: autenticação)
│ ├── routes/ # Definição das rotas
│ ├── services/ # Lógica de negócios
│ ├── utils/ # Utilitários (ex.: envio de email)
│ └── app.js # Configuração principal do Express
├── .env # Variáveis de ambiente
├── package.json # Dependências e scripts do projeto
└── README.md # Documentação do projeto

## Instalação e Configuração

1. **Clone o repositório**:

    ```bash
    git clone https://github.com/seu-usuario/mark-agenda-api.git
    cd mark-agenda-api

    ```

2. **Instale as dependências**:
    ```bash
     npm install
    ```
3. **Configure as variáveis de ambiente:**:

-   Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

    ```env
     DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
     JWT_SECRET="sua_chave_secreta"
    ```

4. **Configuração do banco de dados:**

-   Certifique-se de ter o PostgreSQL instalado e em execução.
-   Execute as migrações do Prisma para criar o banco de dados:

    ```bash
    npx prisma migrate dev --name init
    ```

5. **Inicie o servidor**:
    ```bash
    npm run dev
    ```
6. **Endpoints**:

-   _Usuarios_

POST /api/routes/user/register: Registrar um novo usuário.
POST /api/routes/user/login: Login de usuário.
GET /api/routes/user/profile: Obter perfil do usuário autenticado.
POST /api/routes/user/forgot-password: Recuperação de senha.
POST /api/routes/user/reset-password: Redefinição de senha.

-   _Agendamentos_

POST /api/routes/appointments: Criar agendamento.
GET /api/routes/appointments/user/:userId: Listar agendamentos de um usuário.
DELETE /api/routes/appointments/:id: Excluir agendamento.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes. ```
