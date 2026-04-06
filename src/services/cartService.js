import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../../cart.json");

function loadCart() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveCart(cartData) {
  fs.writeFileSync(filePath, JSON.stringify(cartData, null, 2), "utf-8");
}

// 🔹 LÓGICA DE ADICIONAR (NO SERVIDOR)
function addItem(newItem) {
  const cart = loadCart();
  
  // Validação extra de segurança no servidor
  if (newItem.quantity <= 0) return; 

  const existing = cart.find(item => item.name === newItem.name);

  if (existing) {
    existing.quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }
  saveCart(cart);
}
// 🔹 ADICIONAR APENAS 1 UNIDADE (pelo ID)
function addOne(id) {
  const cart = loadCart();
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity += 1; 
    saveCart(cart);
  }
}
function removeItem(id) {
  let cart = loadCart(); 
  const item = cart.find(item => item.id === id);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter(item => item.id !== id);
  }
  saveCart(cart);
}

function deleteItem(id) {
  const cart = loadCart();
  const filteredCart = cart.filter(item => item.id !== id);
  saveCart(filteredCart);
}

function calculateTotal() {
  const cart = loadCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
// 🔹 LIMPAR TODO O CARRINHO
function clearCart() {
  saveCart([]); 
}
export { addItem, removeItem, deleteItem, calculateTotal, loadCart, addOne, clearCart};