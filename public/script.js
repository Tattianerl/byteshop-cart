const API = `${window.location.origin}/cart`;
// 🔹 FEEDBACK
function showMessage(text, type = "success") {
  const msg = document.getElementById("message");

  msg.style.display = "block";
  msg.innerText = text;
  msg.style.color = type === "error" ? "red" : "green";

  setTimeout(() => {
    msg.style.display = "none";
  }, 2000);
}

// 🔹 LOADING
function setLoading(isLoading) {
  const btn = document.querySelector(".btn-primary");
  btn.disabled = isLoading;
  btn.innerText = isLoading ? "Adicionando..." : "Adicionar ao Carrinho";
}

// 🔹 ADICIONAR ITEM
async function addItem() {
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const quantityInput = document.getElementById("quantity");

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const quantity = parseInt(quantityInput.value);

  // 🔹 VALIDAÇÃO DE NOME
  if (name.length < 2) {
    showMessage("Insira um nome válido para o produto", "error");
    nameInput.focus();
    return;
  }

  // 🔹 VALIDAÇÃO DE PREÇO
  if (isNaN(price) || price <= 0) {
    showMessage("O preço deve ser maior que R$ 0,00", "error");
    priceInput.focus();
    return;
  }

  // 🔹 VALIDAÇÃO DE QUANTIDADE
  if (isNaN(quantity) || quantity <= 0) {
    showMessage("A quantidade deve ser pelo menos 1", "error");
    quantityInput.focus();
    return;
  }

  try {
    setLoading(true);
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error); // Pega a mensagem de erro que vem do Back-end
    }

    showMessage("Item adicionado com sucesso!");
    clearForm();
    loadCart();
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
// 🔹 LIMPAR FORM
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = 1;
}

// 🔹 CARREGAR CARRINHO
async function loadCart() {
  try {
    const res = await fetch(API);
    const cart = await res.json();

    renderCart(cart);
    updateTotal();
  } catch {
    showMessage("Erro ao carregar carrinho", "error");
  }
}

// 🔹 RENDERIZAR
function renderCart(cart) {
  const container = document.getElementById("cart-list");

  if (!cart.length) {
    container.innerHTML = `<p class="empty-msg">O carrinho está vazio...</p>`;
    return;
  }

   container.innerHTML = cart.map(item => {
    const subtotal = item.price * item.quantity;

    return `
      <div class="item-card">
        <div class="item-info">
          <b>${item.name}</b>
          <span>${formatCurrency(item.price)} x ${item.quantity}</span>
           <small>Subtotal: ${formatCurrency(subtotal)}</small>
        </div>

        <div class="item-actions">
          <button class="btn-sm btn-minus" onclick="removeItem('${item.id}')" title="Remover 1 unidade">-1</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="btn-sm btn-plus" onclick="addOneItem('${item.id}')">+1</button>
          <button class="btn-sm btn-delete" onclick="deleteItem('${item.id}')" title="Excluir item">🗑️</button>
        </div>
      </div>
    `;
  }).join("");
  // Desativa o botão de checkout se não houver itens
document.getElementById("btn-checkout").disabled = cart.length === 0;
}

async function addOneItem(id) {
  try {
    const response = await fetch(`${API}/add`, { // Verifique se o caminho é /cart/add
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      loadCart(); // Recarrega a lista na tela
    }
  } catch (error) {
    console.error("Erro ao adicionar unidade:", error);
  }
}

// 🔹 REMOVER 1
async function removeItem(id) {
  try {
    await fetch(`${API}/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    loadCart();
  } catch {
    showMessage("Erro ao remover item", "error");
  }
}

// 🔹 DELETAR
async function deleteItem(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    showMessage("Item removido");
    loadCart();
  } catch {
    showMessage("Erro ao deletar", "error");
  }
}

// 🔹 TOTAL
async function updateTotal() {
  try {
    const res = await fetch(`${API}/total`);
    const data = await res.json();
    const totalEl = document.getElementById("total-amount");
    
    totalEl.innerText = formatCurrency(data.total);
    
    // Pequeno efeito visual de atualização
    totalEl.style.transform = "scale(1.1)";
    setTimeout(() => totalEl.style.transform = "scale(1)", 200);
  } catch {
    showMessage("Erro ao calcular total", "error");
  }
}

async function checkout() {
  if (!confirm("Confirmar fechamento do pedido?")) return;

  try {
    const response = await fetch(`${API}/checkout`, { method: "POST" });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error);

    // 🔹 Montando o Recibo Visual
    const details = document.getElementById("receipt-details");
    let itemsHTML = data.recibo.items.map(item => `
        <div class="receipt-line">
            <span>${item.quantity}x ${item.name}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join("");

    details.innerHTML = `
        <div class="receipt-body">
            ${itemsHTML}
            <div class="receipt-total">
                TOTAL: ${formatCurrency(data.recibo.total)}
            </div>
            <p><small>ID do Pedido: #${Math.floor(Math.random() * 10000)}</small></p>
        </div>
    `;

    // Mostra o modal
    document.getElementById("receipt-modal").style.display = "flex";

    loadCart(); // Limpa a tela principal
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// Função para fechar o modal
function closeReceipt() {
    document.getElementById("receipt-modal").style.display = "none";
}

// 🔹 INIT
window.onload = loadCart;