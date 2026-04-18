# 🛒 ByteShop - Carrinho de Compras API
ByteShop é uma aplicação Full Stack robusta inspirada no fluxo de checkout da Shopee. O projeto foca em oferecer uma experiência de usuário (UX) fluida, com cálculos automáticos, persistência de dados e um sistema de recibo detalhado.

## 🎯 Objetivo do Projeto
Desenvolver um sistema de gerenciamento de compras que permita ao usuário manipular itens de forma dinâmica, garantindo a integridade dos cálculos e a persistência das informações através de uma API REST.

## 🚀 Funcionalidades
- Gerenciamento Dinâmico: Adicione produtos, aumente/diminua quantidades ou remova itens com apenas um clique.

- Persistência de Dados: Armazenamento via sistema de arquivos JSON (cart.json), garantindo que seus itens não sumam ao reiniciar o servidor.

- Segurança e Validação: Camadas de validação no Front e Back-end contra preços negativos, campos vazios e erros de tipo.
* **Interface Inteligente**
  * <small>Cálculo de subtotal e total em tempo real</small>
  * <small>Botão de checkout que gera recibo visual</small>
  * <small>Sistema de impressão de nota fiscal (simulação)</small>
  * <small>Feedback visual via mensagens toast</small>

### 🖥️ Interface & UX
- [x] **Cálculo em tempo real**: Atualização dinâmica de subtotal e total.
- [x] **Recibo Visual**: Modal interativo com detalhamento da compra.
- [x] **Impressão**: Suporte a `@media print` para simulação de nota fiscal.
- [x] **Toasts**: Notificações flutuantes para feedback de ações.

## 🛠️ Tecnologias Utilizadas
 Front-end
- HTML5 & CSS3: Layout responsivo com design moderno e gradientes premium.

- JavaScript (ES6+): Manipulação de DOM e consumo de API com `Async/Await`.

- FontAwesome: Ícones para uma interface intuitiva.

Back-end
- Node.js & Express: Estrutura robusta para rotas e middleware.

- JSON File System (fs): Manipulação de arquivos para persistência local.

- CORS & UUID: Segurança entre domínios e geração de IDs únicos e seguros.


## 📂 Estrutura do Projeto
- `src/`: Lógica principal do servidor Express
- `public/`: Interface do usuário (HTML, CSS, JS)
- `services/`: Regras de negócio e manipulação do arquivo JSON
- `server.js`: Ponto de entrada da aplicação

## 📦 Como Instalar e Rodar

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Tattianerl/byteshop-cart.git
   cd byteshop-cart

## 🛠️ Como executar
1. Instale as dependências:
   ```javascript
   npm install
   ```
2. Inicie o servidor:
   ```javascript
     npm start
     ```
3. Acesse no navegador:
   ```javascript
   Abra o seu navegador e acesse http://localhost:3000(ou a porta configurada).
   ```

# 🛣️ Endpoints da API
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/cart` | Lista todos os itens no carrinho. |
| **POST** | `/cart` | Adiciona um novo item (valida nome, preço e qtd). |
| **POST** | `/cart/add` | Incrementa +1 unidade de um item existente. |
| **POST** | `/cart/remove` | Decrementa -1 unidade de um item. |
| **DELETE** | `/cart/:id` | Remove o item completamente pelo ID. |
| **GET** | `/cart/total` | Retorna o valor total somado. |
| **POST** | `/cart/checkout` | Finaliza a venda, gera recibo e limpa o carrinho. |

## 🔗 Demonstração
O projeto está disponível para testes online no Render:
👉 [Acesse a ByteShop ao vivo aqui!](https://byteshop-cart.onrender.com/)
---
**Desenvolvido por** Tatiane RL **Estudante de Desenvolvimento Full Stack focada em soluções práticas e escaláveis.**