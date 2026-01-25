# Documentação

   **Plataforma de Aprendizado**   

   Educação financeira   

   -- organizando as informações do projeto
   

### **Sobre**

O Finan é uma plataforma de controle financeiro e educação financeira integrada, que combina gestão prática do dinheiro com trilhas gamificadas de aprendizado, incentivando o uso contínuo do aplicativo mesmo em períodos sem movimentações financeiras.

### Problema que resolve

Muitas pessoas não sabem exatamente para onde seu dinheiro está indo, dificultando o controle financeiro e a tomada de decisões.

### Público-alvo

- Jovens e adultos
- Pouco ou médio conhecimento financeiro
- Uso pessoal, recorrente

### Objetivo do MVP .

Explicação mais detalhada do protótipo inicial abaixo:

[MVP](https://www.notion.so/MVP-2e07639e4aff80a78a1de0bbef7bec38?pvs=21)

### O que é a Trilha de Aprendizado

A Trilha de Aprendizado Financeiro do Finan é um sistema gamificado inspirado em plataformas como Duolingo, que guia o usuário por níveis progressivos de educação financeira, integrando teoria, prática e uso real do aplicativo.

Explicação detalhada da Trilha de Aprendizado, abaixo:

[Trilha do Aprendizado](https://www.notion.so/Trilha-do-Aprendizado-2e07639e4aff80b59793e9fc17d6b462?pvs=21)

### Fluxo Principal do Usuário

1. Usuário cria conta ou faz login
2. Acessa o Painel Principal
3. Registra receitas e despesas
4. Visualiza saldo e histórico
5. Opcionalmente acessa a área de assinatura (não funcional ainda)

### Design e UX da Plataforma

### Princípios de UX

- Clareza
- Simplicidade
- Leitura rápida
- Poucos cliques

### Ferramenta

- Figma (UI/UX)
- (algum editor de imagens)

### Organização

- Wireframes
- Design System
- Telas do MVP
- Fluxos
- Protótipo navegável

### Arquitetura e Stack Tecnológica

### Front-end

- React Native
- Expo
- Organização por features

### Back-end

- (definir autenticação Firebase)
- API simples
- Autenticação

### Banco de Dados

- (decidir)
- Estrutura orientada a usuário
- Transações financeiras

### **Funcionalidades**

Principais funcionalidades do app:

Navegação App

```jsx
[ Trilha] [ Controle ] [  +  ] [ Investir ] [ Perfil ]
```

### **Trilha (home)**

- Trilha de aprendizado
- Progresso
- Próxima lição
- Feedback de evolução
- Porta de entrada do usuário

### Controle

**Vida financeira prática, o que ele aprende aplica.**

- Gastos
- Receitas
- Transferências
- Categorias
- Histórico

### Botão de ação

**Atalho universal, precisa ser r**ápido e sem fricção.

Abre um bottom sheet:

- Adicionar gasto
- Adicionar receita
- Adicionar investimento

### Investir / Análises *(fora do MVP)*

Para o MVP:

- pode estar oculto
- ou exibido como “Em breve”
- ou versão básica (carteira simples)
- No futuro:
    - carteira de investimentos
    - análises
    - gráficos
    - relatórios
    - insights inteligentes

### Perfil

**Identidade e controle do usuário,** monetização **de forma natural**

- Dados pessoais
- Plano (Free / Premium)
- Progresso geral
- Configurações
- Sobre o app

### **Estrutura de Pastas**

Foi criado uma estrutura de pastas padrão para o aplicativo para seguir os mesmos padrões de desenvolvimento.

### Esqueleto da arvore de arquivos

src/
├── app/
│   ├── routes.jsx
│   ├── App.jsx
│   └── ProtectedRoute.jsx
│
├── features/
│   ├── auth/
│   │   ├── auth.service.js
│   │   ├── auth.context.jsx
│   │   └── useAuth.js
│   │
│   ├── finance/
│   │   ├── components/
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   └── TransactionItem.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   └── Income.jsx
│   │   │
│   │   ├── finance.service.js
│   │   └── finance.utils.js
│   │
│   ├── subscription/
│   │   ├── SubscriptionPage.jsx
│   │   ├── Paywall.jsx
│   │   ├── subscription.service.js
│   │   └── useSubscription.js
│   │
│   └── profile/
│       ├── ProfilePage.jsx
│       └── profile.service.js
│
├── components/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   └── Loader.jsx
│
├── layouts/
│   ├── AuthLayout.jsx
│   ├── AppLayout.jsx
│   └── SubscriptionLayout.jsx
│
├── services/
│   ├── api.js
│   ├── firebase.js
│   └── storage.js
│
├── hooks/
│   └── useLocalStorage.js
│
├── styles/
│   ├── global.css
│   └── theme.js
│
├── utils/
│   ├── formatCurrency.js
│   ├── dates.js
│   └── validators.js
│
└── main.jsx

[Estrutura de Pastas - Detalhes](https://www.notion.so/Estrutura-de-Pastas-Detalhes-2d97639e4aff8056b637f7c0f40c71cb?pvs=21)

### **Métodos de Pagamento**

Plataformas escolhidas para cuidar do pagamento do projeto:

Sistema de Assinaturas - (Gateaway de pagamento);

Anúncios - Google Ads;

venda de Produtos - Programa de afiliado Mercado Pago, Shopee.

### **Modelo de Monetização(não será implementado ainda)**

O Finan adota um modelo de monetização híbrido, combinando assinatura, anúncios e parcerias estratégicas, priorizando sempre a experiência do usuário e a entrega de valor contínuo.

### Plano de Assinatura - Principal

### O que é

Usuário paga mensal/anualmente para desbloquear recursos avançados.

### Exemplo de planos

- **Free**
- **Premium**

### Funcionalidades Premium (exemplos)

- Relatórios avançados
- Histórico ilimitado
- Categorias personalizadas
- Exportação de dados
- Sem anúncios

### Onde entra no app

- Tela de assinatura
- Paywall ao acessar recursos premium

### Por que faz sentido

- Receita recorrente
- Alinhado com uso contínuo
- Previsível financeiramente

### Anúncios - Complementar

### O que é

Exibição de anúncios para usuários Free.

### Onde usar (com cuidado)

- Tela de lista de transações
- Dashboard (banner discreto)
- Tela de insights simples

Nunca:

- durante cadastro
- em formulários
- em momentos críticos

### Por que faz sentido

- Monetiza usuários que não pagam
- Não bloqueia acesso total
- Incentiva upgrade para Premium

### Afiliados

### O que é

Recomendação de produtos financeiros com comissão.

Exemplos:

- contas digitais
- cartões
- plataformas de investimento
- cursos financeiros

### Onde entra no app

- Área de educação financeira
- Sugestões baseadas em comportamento
- Seção “Recomendações”

### Por que faz sentido

- Receita sem custo direto
- Valor agregado ao usuário
- Escala bem

### Decisões Técnicas e Restrições

Escolhas feitas para conseguir entregar o projeto de forma mais fácil:

Uso de Expo para reduzir complexidade;

Escopo reduzido para garantir entrega;

Sem uso de libs avançadas no MVP.

### Organização do Time

Definindo os cargos dos integrantes de cada setor:

- Coordenação Técnica   |   Desenvolvedor Fullstack
    1. Tauã Felipe
- Front-end React
    1. Leonardo
    2. João
- Banco de Dados
    1. Jeferson Guimarrães
    2. Gabriel 
- Back-end
    1. Otávio
- Design e Marketing
    1. Igor Martello
