import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import * as cartService from "./services/cartService.js";
import createItem from "./services/itemService.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configurações Iniciais
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// 3. ROTAS DA API (Sempre use /cart antes para organizar)
app.get("/cart", (req, res) => {
  const cart = cartService.loadCart();
  res.json(cart);
});

app.post("/cart", (req, res) => {
  let { name, price, quantity } = req.body;
  price = Number(price);
  quantity = Number(quantity);

  if (!name || name.trim().length < 2 || isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "Dados inválidos para o produto." });
  }

  const item = createItem(name, price, quantity);
  cartService.addItem(item); 
  res.status(201).json(cartService.loadCart());
});

app.post("/cart/add", (req, res) => {
  const { id } = req.body;
  cartService.addOne(id);
  res.json({ message: "Unidade adicionada", cart: cartService.loadCart() });
});

app.post("/cart/remove", (req, res) => {
  const { id } = req.body;
  cartService.removeItem(id); 
  res.json({ message: "Unidade removida", cart: cartService.loadCart() });
});

app.delete("/cart/:id", (req, res) => {
  cartService.deleteItem(req.params.id); 
  res.json({ message: "Item removido", cart: cartService.loadCart() });
});

app.get("/cart/total", (req, res) => {
  const total = cartService.calculateTotal(); 
  res.json({ total });
});

app.post("/cart/checkout", (req, res) => {
  const cart = cartService.loadCart();
  const total = cartService.calculateTotal();
  if (cart.length === 0) return res.status(400).json({ error: "Carrinho vazio" });
  
  cartService.clearCart();
  res.json({ message: "Sucesso!", recibo: { items: cart, total: total } });
});

// 4. Porta Dinâmica para o Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API ByteShop rodando na porta ${PORT}`);
});