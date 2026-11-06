# PORTFÓLIO KAUAN — SITE COMPLETO

## Abrir o site (mais simples)
1. Extraia **toda** a pasta do ZIP.
2. Abra `index.html` no Chrome, Edge ou Firefox.
3. O site funciona sem instalar nada. Busca, filtros, animações, tema claro/escuro e botões de contato funcionam diretamente.

Os vídeos do YouTube precisam de internet para serem reproduzidos. As quatro capas SVG são arquivos locais e funcionam offline.

## Como usar também o Java
Java não funciona dentro do navegador: o `PortfolioServer.java` é um **servidor local** opcional.
Você precisa do **JDK 17 ou superior** instalado. Não são necessários Maven, frameworks ou bibliotecas externas.

**Windows:** duplo clique em `iniciar_windows.bat` e abra http://localhost:8080

**macOS/Linux:** abra o Terminal nesta pasta e execute `sh iniciar_mac_linux.sh`. Depois abra http://localhost:8080

**Manual:** na pasta do site, execute `java java/PortfolioServer.java`.

A API Java publica os projetos em `http://localhost:8080/api/projects` (dados editáveis em `assets/data/projects.json`), com `http://localhost:8080/api/health` para verificar o servidor.

> Para colocar o site no ar em uma hospedagem de HTML estático, publique `index.html` junto à pasta `assets/`. O Java é OPCIONAL. Para usar o backend Java publicamente, é necessária hospedagem com suporte a Java.

## Estrutura
- `index.html` — página e apresentação pessoal
- `assets/css/styles.css` — layout responsivo, tema claro/escuro, animações
- `assets/js/app.js` — busca, filtros, player de vídeos, cópia de links, controle de tema e outras interações
- `assets/data/projects.json` — dados e URLs dos quatro vídeos
- `assets/img/*.svg` — quatro capas locais e um ícone do site
- `java/PortfolioServer.java` — servidor HTTP Java e API JSON
- `iniciar_windows.bat` e `iniciar_mac_linux.sh` — inicializadores opcionais

## Ajustar título do quarto vídeo
Como o título exato não pôde ser confirmado, o projeto 04 está como “Vídeo 04 — edição para YouTube”. Para corrigir, edite o campo `title` no quarto item em `assets/data/projects.json` **e** no bloco `fallback-projects` ao fim de `index.html` (necessário para abrir offline). Você pode também alterar `status` para `confirmado` nas duas versões. Quando houver internet, o site tenta preencher automaticamente o título via serviço de metadados externo; se ele não responder, a legenda provisória permanece.

## Contatos
Instagram: https://www.instagram.com/kauan.alv3es/
WhatsApp: https://wa.me/5522996003777

## Observações
- Capas do portfólio são **ilustrações originais** incluídas no pacote, não miniaturas capturadas dos vídeos no YouTube.
- O player carrega vídeo do YouTube (requer conexão) somente quando clicado.
- Fontes do sistema: sem dependência externa.
- Não há coleta de dados, envio de formulário, cookies de analytics ou rastreadores do próprio site.
