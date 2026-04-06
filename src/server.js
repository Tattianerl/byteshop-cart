import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import * as cartService from "./services/cartService.js";
import createItem from "./services/itemService.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// 🔹 GET - listar carrinho 
app.get("/cart", (req, res) => {
  const cart = cartService.loadCart();
  res.json(cart);
});

// 🔹 POST - adicionar item
app.post("/cart", (req, res) => {
  let { name, price, quantity } = req.body;

  // Garantir que são números
  price = Number(price);
  quantity = Number(quantity);

  // 🔹 VALIDAÇÕES COMBINADAS
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "O nome do produto deve ter pelo menos 2 caracteres." });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "O preço deve ser um número maior que zero." });
  }

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "A quantidade deve ser pelo menos 1." });
  }

  // Se passou por tudo, cria e salva
  const item = createItem(name, price, quantity);
  cartService.addItem(item); 

  res.status(201).json(cartService.loadCart());
});

// 🔹 POST - Adicionar uma unidade (+)
app.post("/cart/add", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID é obrigatório" });
  }

  cartService.addOne(id);
  res.json({ message: "Unidade adicionada", cart: cartService.loadCart() });
});

// 🔹 DELETE - remover item completamente
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;

  cartService.deleteItem(id); 

  res.json({ message: "Item removido", cart: cartService.loadCart() });
});

// 🔹 POST - remover uma unidade
app.post("/cart/remove", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID é obrigatório" });
  }

  cartService.removeItem(id); 
  res.json({ message: "Unidade removida", cart: cartService.loadCart() });
});

// 🔹 GET - total
app.get("/cart/total", (req, res) => {
  const total = cartService.calculateTotal(); 
  res.json({ total });
});

// 🔹 POST - Finalizar Compra
app.post("/cart/checkout", (req, res) => {
  const cart = cartService.loadCart();
  const total = cartService.calculateTotal();

  if (cart.length === 0) return res.status(400).json({ error: "Carrinho vazio" });

  // Formatando o Log no Terminal
  console.log("\n" + "=".repeat(30));
  console.log("       RECIBO DE VENDA       ");
  console.log("=".repeat(30));
  cart.forEach(item => {
    console.log(`${item.quantity.toString().padEnd(3)} | ${item.name.padEnd(15)} | R$ ${item.price.toFixed(2)}`);
  });
  console.log("-".repeat(30));
  console.log(`TOTAL: R$ ${total.toFixed(2)}`.padStart(29));
  console.log("=".repeat(30) + "\n");

  cartService.clearCart();
  res.json({ message: "Sucesso!", recibo: { items: cart, total: total } });
});



app.listen(3000, () => {
  console.log("🚀 API rodando em http://localhost:3000");
});
