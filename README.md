# ClimaX Frontend

Uma aplicação web progressiva (PWA) para consulta de clima em tempo real, desenvolvida com foco em **experiência do usuário**, design moderno e responsividade completa.

## Tecnologias e Arquitetura

Este projeto foi construído aplicando conceitos de **Feature-Sliced Design**, organizando o código por funcionalidade em vez de tipo de arquivo, garantindo alta coesão e baixo acoplamento entre os módulos.

- **Framework:** React 19 com Vite 7
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS v4
- **Gerenciamento de Estado:** Zustand
- **Roteamento:** React Router DOM v7
- **Requisições HTTP:** Axios
- **Validação:** Zod
- **Notificações Push:** Firebase Cloud Messaging (FCM)
- **PWA:** vite-plugin-pwa (Workbox)
- **Gráficos:** Recharts

## Funcionalidades Principais

- **Busca de Cidades:** Pesquisa em tempo real com debounce e seleção de sugestões.
- **Clima Atual:** Exibição de temperatura, sensação térmica, umidade, vento e condição do céu.
- **Previsão 5 dias:** Cards deslizáveis com min/max, probabilidade de chuva e barra de temperatura comparativa.
- **Previsão 24h:** Carrossel scrollável com ícone, precipitação e barra de temperatura vertical.
- **Favoritos:** Salvar e visualizar cidades favoritas com dados de clima em tempo real (requer login).
- **Alertas Climáticos:** Criação de alertas por temperatura ou condição (chuva, tempestade) com ativação/desativação individual (requer login).
- **Notificações Push:** Solicitação de permissão ao criar um alerta, com envio automático via FCM quando o alerta é disparado.
- **Autenticação:** Registro, login e redefinição de senha com rotas protegidas por JWT.
- **PWA:** Instalável em dispositivos móveis e desktop, com cache offline para assets e ícones via Workbox.

## Estrutura do Projeto

A aplicação está organizada por features independentes dentro de `src/features`, cada uma com seus próprios serviços, tipos, store e componentes.

    src/
     ├── components/
     │   ├── layout/          # Navbar, DrawerMenu, Background, AppLayout
     │   └── ui/              # Componentes reutilizáveis (GradientButton, Modal, Toast, etc.)
     ├── features/
     │   ├── alerts/          # Criação e gerenciamento de alertas climáticos
     │   ├── auth/            # Login, registro, redefinição de senha e store JWT
     │   ├── favorites/       # Cidades favoritas do usuário
     │   ├── notifications/   # Serviço de envio do token FCM ao backend
     │   └── weather/         # Busca, clima atual, previsão 5 dias e 24h
     ├── hooks/               # useDebounce, useNotifications, useToast
     ├── lib/                 # Instância do Axios e inicialização do Firebase
     ├── pages/               # Páginas fora de features (AboutPage)
     ├── router/              # Definição de rotas e PrivateRoute
     └── main.tsx             # Entry point

## Variáveis de Ambiente (.env)

Para rodar o projeto, crie um arquivo `.env` na raiz baseado nesta estrutura:

    # Backend
    VITE_API_URL=https://seu-backend.railway.app/api/v1

    # Firebase — Firebase Console → Project Settings → General → Your apps
    VITE_FIREBASE_API_KEY="sua_api_key"
    VITE_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
    VITE_FIREBASE_PROJECT_ID="seu-projeto"
    VITE_FIREBASE_STORAGE_BUCKET="seu-projeto.firebasestorage.app"
    VITE_FIREBASE_MESSAGING_SENDER_ID="000000000000"
    VITE_FIREBASE_APP_ID="1:000000000000:web:xxxxxx"

    # Firebase Cloud Messaging — Project Settings → Cloud Messaging → Web Push certificates
    VITE_FIREBASE_VAPID_KEY="sua_vapid_key"

_Atenção: Você também precisará preencher o arquivo `public/firebase-messaging-sw.js` com as mesmas credenciais do Firebase. Service workers não têm acesso às variáveis de ambiente do Vite._

## Como rodar localmente

### 1. Clone o repositório

    git clone https://github.com/Leorodrigs/climax-frontend.git
    cd climax-frontend

### 2. Instale as dependências

    npm install

### 3. Configure o Ambiente

Preencha o arquivo `.env` com suas credenciais e atualize o `public/firebase-messaging-sw.js` conforme instruído acima.

### 4. Gere os ícones PWA

    npm install sharp --save-dev
    node scripts/generate-icons.mjs

O script utiliza `public/logo.png` como fonte e gera automaticamente os ícones em `public/icons/`.

### 5. Inicie a aplicação

    # Modo desenvolvimento
    npm run dev

A aplicação estará rodando em `http://localhost:5173`.

## Build para Produção

    npm run build

O output estará na pasta `dist/`, pronta para ser servida por qualquer servidor estático ou plataforma como Vercel, Netlify ou Railway.

## Configuração PWA

O PWA é configurado via `vite-plugin-pwa` com as seguintes estratégias de cache:

- **Assets estáticos:** Precache no install (JS, CSS, HTML, imagens)
- **Ícones OpenWeatherMap:** `CacheFirst` com expiração de 7 dias
- **API do backend:** `NetworkFirst` com timeout de 10s e fallback de 5 minutos
- **Google Fonts:** `CacheFirst` com expiração de 1 ano

O botão de instalação é exibido automaticamente pelo browser ao acessar o site em HTTPS.
