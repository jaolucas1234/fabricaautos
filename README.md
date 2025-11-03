# Fábrica de Automóveis

Sistema de gerenciamento de vendas de automóveis para concessionárias.

## Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3  
- JavaScript (ES6+)
- Fetch API

### Backend
- API REST local
- MySQL
- Prisma ORM

## Como Executar

### Pré-requisitos
- Servidor API local na porta 3000
- Navegador web moderno

### Instruções de Execução

1. **Iniciar a API:**
```npm start ``` ou ```node server.js```

1. **Executar o Frontend:**

Método 1: Abrir index.html diretamente no navegador

Método 2: Usar servidor local:

```python -m http.server 8000```
ou
```npx http-server```
Acessar a Aplicação:

Abrir: ```http://localhost:8000```

## Funcionalidades
Visualização de 11 áreas de estacionamento

Áreas azuis: carros alocados para venda

Áreas brancas: áreas vazias

Modal com lista completa de carros por área

Sistema de vendas com seleção de cliente e concessionária

Identificação de carros vendidos com status "Vendido"

Interface responsiva com modais sobrepostos