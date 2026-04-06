## objtivo

<!-- Criar um carinho de compras baseado no carrinho de compras da shopee, aonde armazene itens e calcule sub-itens automaticamente.  

Dominio da aplicação: Carrinhos de compras

As Entidades representadas:
carrinho
itens

-->
# 🛒 DevStore - Carrinho de Compras API

Uma aplicação Full Stack robusta para gerenciamento de carrinho de compras, focada em persistência de dados, validações de segurança e experiência do usuário (UX).

## 🚀 Funcionalidades

- **Gerenciamento de Itens**: Adicionar, remover uma unidade, aumentar quantidade ou excluir itens completamente.
- **Persistência de Dados**: Utiliza um sistema de arquivos JSON (`cart.json`) para manter os dados mesmo após reiniciar o servidor.
- **Validações Rigorosas**: Proteção contra nomes vazios, preços negativos e quantidades inválidas (tanto no Front quanto no Back-end).
- **Cálculo em Tempo Real**: Atualização automática do total do pedido.
- **Checkout com Recibo**: Sistema de finalização de compra com limpeza de carrinho e exibição de recibo detalhado em um modal.

## 🛠️ Tecnologias Utilizadas

- **Front-end**: HTML5, CSS3, JavaScript Moderno (Async/Await).
- **Back-end**: Node.js, Express.js.
- **Armazenamento**: JSON File System (`fs`).
- **Bibliotecas**: `cors`, `uuid` (para IDs únicos), `nodemon`.

## 📦 Como Instalar e Rodar

1. **Clone o repositório**:
   ```bash
   git clone [https://github.com/seu-usuario/shoppe-cart-api.git](https://github.com/seu-usuario/shoppe-cart-api.git)
   cd shoppe-cart-api
## 📂 Estrutura do Projeto
- `src/`: Código fonte do servidor e lógica de negócio.
- `public/`: Arquivos estáticos (HTML, CSS, JS) da interface.
- `services/`: Camada de serviço que isola a lógica do carrinho.

## 🛠️ Como executar
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:

```Bash
npm start
```
3. Acesse no navegador:
```Bash
http://localhost:3000
```
# 🛣️ Endpoints da API
GET /cart: Lista todos os itens.

POST /cart: Adiciona um novo item.

POST /cart/remove: Remove uma unidade de um item pelo ID.

Post /cart/add: Adicionar uma unidade (+).

DELETE /cart/:id: Remove o item completamente do carrinho.

GET /cart/total: Retorna a soma total dos valores.

POST/cart/checkout: Finaliza a compra e gera recibo