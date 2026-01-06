# Restaurante Costela no Bafo

Este é o projeto de front-end para a aplicação web do Restaurante Costela no Bafo. Desenvolvido com React e Vite, o sistema oferece uma interface moderna e responsiva para visualização de cardápio, realização de pedidos e pagamento via PIX.

## ✨ Funcionalidades

- Cardápio digital interativo
- Carrinho de compras funcional
- Checkout com geração de QR Code PIX
- Autenticação de usuários
- Área administrativa para gerenciamento de pedidos (funcionalidade de back-end associada)

## 🚀 Tecnologias Utilizadas

- **Front-end:**
  - [React](https://react.dev/) (com [Vite](https://vitejs.dev/))
  - [Tailwind CSS](https://tailwindcss.com/) para estilização
  - [Framer Motion](https://www.framer.com/motion/) para animações
  - [Lucide React](https://lucide.dev/) para ícones
  - [React Router](https://reactrouter.com/) para roteamento

- **Back-end & Banco de Dados:**
  - [Supabase](https://supabase.com/) como plataforma de Back-end as a Service (BaaS)

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/en) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## ⚙️ Como Começar

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/restaurante-costela-no-bafo.git
    cd restaurante-costela-no-bafo
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Crie um arquivo `.env` na raiz do projeto, copiando o exemplo de `.env.example` (se existir) ou criando um novo.
    - Adicione as seguintes variáveis:
      ```env
      VITE_SUPABASE_URL="SUA_URL_DO_SUPABASE"
      VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_DO_SUPABASE"
      ```
    > As chaves podem ser encontradas no painel do seu projeto no Supabase, em **Project Settings > API**.

4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run lint`: Executa o linter para análise de código.
- `npm run preview`: Inicia um servidor local para visualizar o build de produção.

## 🗃️ Banco de Dados

Os scripts SQL para a configuração inicial do banco de dados e das políticas de segurança (RLS) no Supabase estão localizados no diretório `/database`. Eles devem ser executados no **SQL Editor** do seu projeto Supabase para garantir que as tabelas e permissões estejam configuradas corretamente.
