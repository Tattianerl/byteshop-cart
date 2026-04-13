const API = `${window.location.origin}/cart`;

// 🔹 MENSAGEM TOAST REINICIÁVEL
function showMessage(text, type = "success") {
    const msg = document.getElementById("message");
    msg.innerText = text;
    msg.style.display = "block";
    
    msg.classList.remove("error");
    if (type === "error") msg.classList.add("error");

    // Reinicia animação
    msg.style.animation = 'none';
    msg.offsetHeight; 
    msg.style.animation = 'fadeInOut 3s ease-in-out';

    setTimeout(() => { msg.style.display = "none"; }, 3000);
}

function setLoading(isLoading) {
    const btn = document.querySelector(".btn-primary");
    btn.disabled = isLoading;
    btn.innerText = isLoading ? "Adicionando..." : "Adicionar ao Carrinho";
}

async function addItem() {
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const quantity = parseInt(quantityInput.value);

    if (name.length < 2) return showMessage("Nome muito curto", "error");
    if (isNaN(price) || price <= 0) return showMessage("Preço inválido", "error");

    try {
        setLoading(true);
        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, quantity })
        });
        if (!response.ok) throw new Error("Erro ao adicionar");
        
        showMessage("Item adicionado!");
        clearForm();
        loadCart();
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        setLoading(false);
    }
}

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = 1;
}

async function loadCart() {
    try {
        const res = await fetch(API);
        const cart = await res.json();
        renderCart(cart);
        updateTotal();
    } catch {
        console.error("Erro ao carregar");
    }
}

function renderCart(cart) {
    const container = document.getElementById("cart-list");
    document.getElementById("btn-checkout").disabled = cart.length === 0;

    if (!cart.length) {
        container.innerHTML = `<p class="empty-msg">O carrinho está vazio...</p>`;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="item-card">
            <div class="item-info">
                <strong>${item.name}</strong>
                <small>${formatCurrency(item.price)} x ${item.quantity}</small>
                <small>Sub: ${formatCurrency(item.price * item.quantity)}</small>
            </div>
            <div class="item-actions">
                <button class="btn-sm btn-minus" onclick="removeItem('${item.id}')">-1</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="btn-sm btn-plus" onclick="addOneItem('${item.id}')">+1</button>
                <button class="btn-sm btn-delete" onclick="deleteItem('${item.id}')">🗑️</button>
            </div>
        </div>
    `).join("");
}

async function addOneItem(id) {
    await fetch(`${API}/add`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ id }) 
    });
    loadCart();
}

async function removeItem(id) {
    await fetch(`${API}/remove`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ id }) 
    });
    loadCart();
}

async function deleteItem(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    showMessage("Item removido");
    loadCart();
}

async function updateTotal() {
    const res = await fetch(`${API}/total`);
    const data = await res.json();
    const totalEl = document.getElementById("total-amount");
    totalEl.innerText = formatCurrency(data.total);
}

async function checkout() {
    // 🔹 NOVA TRAVA DE SEGURANÇA
    const totalText = document.getElementById("total-amount").innerText;
    
    if (totalText.includes("0,00")) {
        showMessage("Adicione itens ao carrinho antes de finalizar!", "error");
        return;
    }

    if (!confirm("Confirmar fechamento do pedido?")) return;

    try {
        const response = await fetch(`${API}/checkout`, { method: "POST" });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Erro ao processar checkout");

        // Montando o Recibo Visual
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

        document.getElementById("receipt-modal").style.display = "flex";
        loadCart(); // Limpa a tela principal e desativa o botão via renderCart
    } catch (error) {
        showMessage(error.message, "error");
    }
}

function closeReceipt() { document.getElementById("receipt-modal").style.display = "none"; }

window.onload = loadCart;