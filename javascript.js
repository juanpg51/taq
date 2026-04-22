const products = [
    { id: 1, cat: 'tacos', name: 'Pastor al Carbón', price: 18, img: 'https://images.unsplash.com/photo-1593240554443-34661849f12d?w=400' },
    { id: 2, cat: 'tacos', name: 'Suadero Especial', price: 20, img: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400' },
    { id: 3, cat: 'tacos', name: 'Campechano de Lujo', price: 22, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' },
    { id: 4, cat: 'tacos', name: 'Tripa Bien Dorada', price: 25, img: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=400' },
    { id: 5, cat: 'tacos', name: 'Bistec con Queso', price: 24, img: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400' },
    { id: 6, cat: 'bebidas', name: 'Agua Jamaica (1L)', price: 40, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
    { id: 7, cat: 'bebidas', name: 'Coca-Cola Fría', price: 28, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' }
];

let cart = {};

// Inicializar Menú
function renderMenu() {
    products.forEach(p => {
        const html = `
            <div class="product-card">
                <img src="${p.img}" class="product-img">
                <div class="flex-1">
                    <h3 class="text-sm font-bold text-white">${p.name}</h3>
                    <p class="text-[#FF4D00] text-xs font-semibold">$${p.price}.00</p>
                </div>
                <div class="qty-control">
                    <button onclick="changeQty(${p.id}, -1)" class="btn-qty text-gray-500">-</button>
                    <span id="qty-${p.id}" class="text-xs font-bold w-4 text-center">0</span>
                    <button onclick="changeQty(${p.id}, 1)" class="btn-qty text-[#FF4D00]">+</button>
                </div>
            </div>
        `;
        document.getElementById('menu-' + p.cat).innerHTML += html;
    });
}

function changeQty(id, delta) {
    const current = cart[id] || 0;
    const nuevo = Math.max(0, current + delta);
    if (nuevo === 0) delete cart[id]; else cart[id] = nuevo;
    
    document.getElementById('qty-' + id).innerText = nuevo;
    updateBadge();
}

function updateBadge() {
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const b = document.getElementById('badge');
    b.innerText = totalItems;
    b.classList.toggle('hidden', totalItems === 0);
}

function showPage(id, title) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    document.getElementById('nav-' + id).classList.add('active');
    document.getElementById('page-title').innerText = title;
    if(id === 'carrito') updateSummary();
    window.scrollTo(0,0);
}

function updateSummary() {
    const container = document.getElementById('cart-summary');
    let html = '';
    let total = 0;

    Object.entries(cart).forEach(([id, qty]) => {
        const p = products.find(prod => prod.id == id);
        total += p.price * qty;
        html += `
            <div class="flex justify-between items-center opacity-70">
                <span>${qty}x ${p.name}</span>
                <span>$${p.price * qty}.00</span>
            </div>
        `;
    });

    container.innerHTML = html || '<p class="text-center text-gray-500 py-4 italic">No hay productos seleccionados</p>';
    document.getElementById('final-total').innerText = `$${total}.00`;
}

function sendOrder() {
    const name = document.getElementById('user-name').value;
    const address = document.getElementById('user-address').value;
    const ref = document.getElementById('user-ref').value;
    
    if(!name || !address) return alert("Por favor, ingresa tu nombre y domicilio.");
    if(Object.keys(cart).length === 0) return alert("El carrito está vacío.");

    let msg = `*NUEVO PEDIDO A DOMICILIO* 🌮🛵%0A%0A`;
    msg += `*Cliente:* ${name}%0A`;
    msg += `*Dirección:* ${address}%0A`;
    if(ref) msg += `*Ref:* ${ref}%0A`;
    msg += `--------------------------%0A`;
    
    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
        const p = products.find(prod => prod.id == id);
        msg += `• ${qty}x ${p.name} ($${p.price * qty})%0A`;
        total += p.price * qty;
    });

    msg += `--------------------------%0A`;
    msg += `*TOTAL: $${total}.00*`;

    // Reemplaza con tu número de WhatsApp
    window.open(`https://wa.me/524613408813?text=${msg}`, '_blank');
}

document.addEventListener('DOMContentLoaded', renderMenu);