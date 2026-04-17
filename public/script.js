const API = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/cart"
    : "https://byteshop-cart.onrender.com/cart";

function showMessage(text, type = "success") {
    const msg = document.getElementById("message");
    msg.innerText = text;
    msg.style.display = "block";
    msg.className = "toast-message " + (type === "error" ? "error" : "");
    setTimeout(() => { msg.style.display = "none"; }, 3000);
}

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function loadCart() {
    try {
        const res = await fetch(API);
        const cart = await res.json();
        renderCart(cart);
        
        const resTotal = await fetch(`${API}/total`);
        const dataTotal = await resTotal.json();
        document.getElementById("total-amount").innerText = formatCurrency(dataTotal.total || 0);
    } catch (e) {
        console.error("Erro ao carregar dados.");
    }
}

function renderCart(cart) {
    const container = document.getElementById("cart-list");
    const checkoutBtn = document.getElementById("btn-checkout");
    
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    if (!cart.length) {
        container.innerHTML = `<p class="empty-msg">O carrinho está vazio...</p>`;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="item-card">
            <div>
                <strong>${item.name}</strong><br>
                <small>${formatCurrency(item.price)} x ${item.quantity}</small>
            </div>
            <div>
                <button type="button" class="btn-sm" onclick="changeQty('${item.id}', 'remove')">-</button>
                <span style="margin: 0 10px">${item.quantity}</span>
                <button type="button" class="btn-sm" onclick="changeQty('${item.id}', 'add')">+</button>
                <button type="button" class="btn-sm btn-delete" onclick="deleteItem('${item.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join("");
}

async function addItem() {
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);

    if (name === "") {
        return showMessage("Preencha o nome do produto", "error");
    }
    if (isNaN(price) || price <= 0){
        return showMessage("Digite um valor válido maior que zero", "error");
    }
    if (isNaN(quantity) || quantity <= 0){
        return showMessage("Digite uma quantidade válida", "error");
    }
    try {
        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, quantity })
        });
        if (response.ok) {
            showMessage("Produto adicionado!");
            document.getElementById("name").value = "";
            document.getElementById("price").value = "";
            document.getElementById("quantity").value = "1";

            loadCart();
        }
    } catch (err) {
         showMessage("Erro no servidor", "error");
         }
}

async function changeQty(id, action) {
    await fetch(`${API}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    loadCart();
}

async function deleteItem(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadCart();
}

async function checkout(event) {
    if (event) event.preventDefault();

    if (!confirm("Deseja finalizar este pedido?")) return;

    try {
        const response = await fetch(`${API}/checkout`, { method: "POST" });
        const data = await response.json();

        const details = document.getElementById("receipt-details");
        details.innerHTML = `
            <div style="text-align: left; background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 0.9rem;">
                ${data.recibo.items.map(i => `<div style="display:flex; justify-content:space-between"><span>${i.quantity}x ${i.name}</span> <span>${formatCurrency(i.price * i.quantity)}</span></div>`).join("")}
                <hr style="border: 0; border-top: 1px dashed #ccc; margin: 10px 0;">
                <div style="display:flex; justify-content:space-between; font-weight:bold; font-size: 1.1rem;">
                    <span>TOTAL</span> <span>${formatCurrency(data.recibo.total)}</span>
                </div>
            </div>
        `;

        document.getElementById("receipt-modal").style.display = "flex";
    } catch (e) { showMessage("Erro ao finalizar compra", "error"); }
}
function printReceipt() {
    window.print();
}

function closeReceipt() {
    document.getElementById("receipt-modal").style.display = "none";
    loadCart(); 
}

window.onload = loadCart;