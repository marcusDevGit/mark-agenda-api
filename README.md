# Mark Agenda API

A Mark Agenda API é uma plataforma completa para gerenciamento de agendamentos, times e assinaturas. Ela oferece recursos robustos para criar, gerenciar e integrar agendamentos, colaborar em equipes e gerenciar assinaturas de planos.

## Tecnologias Utilizadas

-   **Node.js**: Plataforma para execução de código JavaScript no servidor.
-   **Express**: Framework web para criação de APIs REST.
-   **Prisma**: ORM para interação com o banco de dados PostgreSQL.
-   **PostgreSQL**: Banco de dados relacional utilizado para armazenar as informações.
-   **JWT (JSON Web Token)**: Para autenticação e autorização.
-   **Bcrypt**: Para hashing de senhas.
-   **Nodemailer**: Para envio de emails (ex.: recuperação de senha).
-   **Dotenv**: Para gerenciamento de variáveis de ambiente.
-   **Testes**: Jest para testes unitários e de integração

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

-   **Times**

    -   Criação de Times.
    -   Gerenciamento de Membros.
    -   Convites.

-   **Planos e Assinaturas**
    -   Criação de Planos.
    -   Assinatura de planos por usuários.
    -   Cancelamento de assinaturas.
    -   Listagem de planos disponíveis.

## Estrutura do Projeto

mark-agenda-api/
├── prisma/ # Arquivos de configuração do Prisma
│   ├── migrations/ # Migrações do banco de dados
│   └── schema.prisma # Definição do banco de dados
├── src/
│   ├── controllers/ # Controladores das rotas
│   ├── events/ # Sistema de eventos
│   ├── generated/ # Arquivos gerados pelo Prisma
│   ├── middlewares/ # Middlewares (ex.: autenticação)
│   ├── queue/ # Sistema de filas para processamento assíncrono
│   │   └── jobs/ # Definição de jobs
│   ├── routes/ # Definição das rotas
│   ├── services/ # Lógica de negócios
│   ├── utils/ # Utilitários (ex.: envio de email)
│   └── app.js # Configuração principal do Express
├── tests/ # Testes automatizados
│   ├── __mocks__/ # Mocks para testes
│   └── setup.js # Configuração dos testes
├── .env # Variáveis de ambiente
├── .env.test # Variáveis de ambiente para testes
├── index.js # Ponto de entrada da aplicação
├── jest.config.js # Configuração do Jest
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

    - POST /api/routes/user/register: Registrar um novo usuário.
    - POST /api/routes/user/login: Login de usuário.
    - GET /api/routes/user/profile: Obter perfil do usuário autenticado.
    - POST /api/routes/user/forgot-password: Recuperação de senha.
    - POST /api/routes/user/reset-password: Redefinição de senha.

-   _Agendamentos_

    - POST /api/routes/appointments: Criar agendamento.
    - GET /api/routes/appointments/user/:userId: Listar agendamentos de um usuário.
    - DELETE /api/routes/appointments/:id: Excluir agendamento.

-   _Planos e Assinaturas_

    - GET /api/routes/plans: Listar todos os planos disponíveis.
    - GET /api/routes/plans/:id: Obter detalhes de um plano específico.
    - POST /api/routes/plans/:id/subscribe: Assinar um plano (requer autenticação).
    - POST /api/routes/plans/subscriptions/:id/cancel: Cancelar uma assinatura (requer autenticação).

## Testes

Para executar os testes, utilize o comando:

```bash
npm test
```

Para executar um arquivo de teste específico:

```bash
npm test <nome-do-arquivo>
```

Exemplo:

```bash
npm test plans.test.js
```

## Como Contribuir

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Para dúvidas ou sugestões, entre em contato através de [contato@markagenda.com](mailto:contato@markagenda.com).
