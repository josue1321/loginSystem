# Sistema de Login

Este é um sistema de login simples desenvolvido como parte de um projeto de aprendizado. O sistema permite que usuários se registrem, façam login e logout de suas contas. O backend é construído em Node.js, utilizando Express para gerenciamento de rotas, Handlebars para renderização das visualizações, e MongoDB como banco de dados.

## Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/)

## Instalação

Siga os passos abaixo para configurar e executar o projeto localmente:

1. Clone este repositório:

    ```bash
    git clone https://github.com/josue1321/loginSystem.git
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd loginSystem
    ```

3. Instale as dependências do projeto:

    ```bash
    npm install
    ```

4. Configure as variáveis de ambiente:

    - Renomeie o arquivo `.env.example` para `.env`.
    - Preencha as variáveis de ambiente no arquivo `.env` de acordo com suas necessidades (como a string de conexão ao banco de dados).

5. Inicie o servidor:

    ```bash
    npm start
    ```

6. Acesse o sistema de login no navegador:

    ```
    http://localhost:3000
    ```

## Uso

O sistema permite que você:

- **Registrar**: Crie uma nova conta de usuário.
- **Login**: Acesse o sistema usando suas credenciais.
- **Logout**: Saia da sessão atual.
- **Delete**: Delete sua conta.

## Estrutura do Projeto

Aqui está uma visão geral dos principais arquivos e diretórios do projeto:

- `server.js`: Arquivo principal que configura e inicia o servidor Express.
- `routes/`: Contém as rotas do sistema (login, logout, registro).
- `models/`: Contém os modelos de dados (por exemplo, o modelo de login).
- `views/`: Contém as visualizações do Handlebars (HTML dinâmico).