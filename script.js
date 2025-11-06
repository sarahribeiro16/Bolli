// Objeto de configuração que agora será a fonte principal dos dados
const defaultConfig = {
  background_color: "#790C21",
  secondary_color: "#8F152D",
  text_color: "#FFFBE3",
  button_color: "#FFFBE3",
  button_text_color: "#790C21",
  font_family: "Della Respira, serif",
  font_size: 16,
  logo_url: "", // Você pode pré-definir um link de logo aqui, ex: "https://meusite.com/logo.png"
  store_name: "Confeitaria Bolli",
  store_tagline: "Doces especiais para momentos especiais",
  product_1_name: "Lata de cookies",
  product_1_description: "8 cookies médios recheados nos sabores: panetone, biscoito de gengibre, red velvet e pistache.",
  product_1_price: "R$ 70",
  product_2_name: "Lata suspiro",
  product_2_description: "Suspiros modelados, tradicionais e recheados nos sabores panetone e biscoito de gengibre.",
  product_2_price: "R$ 60",
  product_3_name: "Pote de cookies",
  product_3_description: "Mini cookies tradicionais.",
  product_3_price: "R$ 35",
  product_4_name: "Pote de suspiro",
  product_4_description: "Suspiros natalinos modelados.",
  product_4_price: "R$ 35",
  product_5_name: "Cartão suspiro papai noel",
  product_5_price: "R$ 15",
  product_6_name: "Suspiro árvore de natal",
  product_6_price: "R$ 12",
  order_button_text: "Fazer Pedido",
  whatsapp_number: "5541995404238"
};

// Esta função agora aplica a configuração padrão diretamente no HTML
function applyConfig(config) {
  const fontFamily = config.font_family || defaultConfig.font_family;
  const fontSize = config.font_size || defaultConfig.font_size;
  const backgroundColor = config.background_color || defaultConfig.background_color;
  const secondaryColor = config.secondary_color || defaultConfig.secondary_color;
  const textColor = config.text_color || defaultConfig.text_color;
  const buttonColor = config.button_color || defaultConfig.button_color;
  const buttonTextColor = config.button_text_color || defaultConfig.button_text_color;

  document.body.style.fontFamily = `${fontFamily}, serif`;
  document.body.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${secondaryColor} 100%)`;
  document.body.style.color = textColor;

  document.querySelectorAll('.product-name').forEach(el => {
    el.style.fontSize = `${fontSize * 1.4}px`;
    el.style.color = textColor;
  });
  document.querySelectorAll('.product-price').forEach(el => {
    el.style.fontSize = `${fontSize * 1.8}px`;
    el.style.color = textColor;
  });

  const orderButton = document.getElementById('orderButton');
  orderButton.style.background = buttonColor;
  orderButton.style.color = buttonTextColor;
  orderButton.style.fontSize = `${fontSize * 1.5}px`;

  // Atualizar logo
  const logoUrl = config.logo_url || defaultConfig.logo_url;
  const logoImage = document.getElementById('logoImage');
  const logoPlaceholder = document.getElementById('logoPlaceholder');
  
  if (logoUrl && logoUrl.trim()) {
    logoImage.src = logoUrl;
    logoImage.style.display = 'block';
    logoPlaceholder.style.display = 'none';
  } else {
    logoImage.style.display = 'none';
    logoPlaceholder.style.display = 'flex';
  }

  // Atualizar produtos
  document.getElementById('product1Name').textContent = config.product_1_name || defaultConfig.product_1_name;
  document.getElementById('product1Description').textContent = config.product_1_description || defaultConfig.product_1_description;
  document.getElementById('product1Price').textContent = config.product_1_price || defaultConfig.product_1_price;
  document.getElementById('product2Name').textContent = config.product_2_name || defaultConfig.product_2_name;
  document.getElementById('product2Description').textContent = config.product_2_description || defaultConfig.product_2_description;
  document.getElementById('product2Price').textContent = config.product_2_price || defaultConfig.product_2_price;
  document.getElementById('product3Name').textContent = config.product_3_name || defaultConfig.product_3_name;
  document.getElementById('product3Description').textContent = config.product_3_description || defaultConfig.product_3_description;
  document.getElementById('product3Price').textContent = config.product_3_price || defaultConfig.product_3_price;
  document.getElementById('product4Name').textContent = config.product_4_name || defaultConfig.product_4_name;
  document.getElementById('product4Description').textContent = config.product_4_description || defaultConfig.product_4_description;
  document.getElementById('product4Price').textContent = config.product_4_price || defaultConfig.product_4_price;
  document.getElementById('product5Name').textContent = config.product_5_name || defaultConfig.product_5_name;
  document.getElementById('product5Price').textContent = config.product_5_price || defaultConfig.product_5_price;
  document.getElementById('product6Name').textContent = config.product_6_name || defaultConfig.product_6_name;
  document.getElementById('product6Price').textContent = config.product_6_price || defaultConfig.product_6_price;
  document.getElementById('orderButton').textContent = config.order_button_text || defaultConfig.order_button_text;
}

// Lógica do Carrinho (sem alterações)
let cart = {};
const products = [
  { id: 1, name: "Lata de cookies", price: 70 },
  { id: 2, name: "Lata suspiro", price: 60 },
  { id: 3, name: "Pote de cookies", price: 35 },
  { id: 4, name: "Pote de suspiro", price: 35 },
  { id: 5, name: "Cartão suspiro papai noel", price: 15 },
  { id: 6, name: "Suspiro árvore de natal", price: 12 }
];

function changeQuantity(productId, change) {
  const currentQuantity = cart[productId] || 0;
  const newQuantity = Math.max(0, currentQuantity + change);
  
  if (newQuantity === 0) {
    delete cart[productId];
  } else {
    cart[productId] = newQuantity;
  }
  
  document.getElementById(`quantity${productId}`).textContent = newQuantity;
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const totalPriceElement = document.getElementById('totalPrice');
  
  if (Object.keys(cart).length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Seu carrinho está vazio</div>';
    cartTotal.style.display = 'none';
    return;
  }
  
  let cartHTML = '';
  let total = 0;
  
  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    const quantity = cart[productId];
    const itemTotal = product.price * quantity;
    total += itemTotal;
    
    cartHTML += `
      <div class="cart-item">
        <span class="cart-item-name">${product.name}</span>
        <div class="cart-item-details">
          <span class="cart-item-quantity">${quantity}x</span>
          <span class="cart-item-price">R$ ${itemTotal}</span>
        </div>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = cartHTML;
  totalPriceElement.textContent = `R$ ${total}`;
  cartTotal.style.display = 'flex';
}

// SDKs removidos
// Funções de UI
let selectedDate = null;

function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

function generateOrderId() {
  const now = new Date();
  const timestamp = now.getTime().toString().slice(-6);
  return `BOLLI${timestamp}`;
}

function generateOrderItemsText() {
  let itemsText = '';
  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    const quantity = cart[productId];
    itemsText += `${product.name} (${quantity}x), `;
  });
  return itemsText.slice(0, -2);
}

function calculateTotal() {
  let total = 0;
  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    const quantity = cart[productId];
    total += product.price * quantity;
  });
  return total;
}

function generateWhatsAppMessage(orderData, config) {
  const items = orderData.order_items;
  const total = orderData.total_amount;
  const name = orderData.customer_name;
  const deliveryType = orderData.delivery_type;
  const deliveryDate = orderData.delivery_date;
  const address = orderData.delivery_address ? `\n*Endereço:* ${orderData.delivery_address}` : '';
  const storeName = config.store_name || defaultConfig.store_name;

  let message = `Olá, ${storeName}! 👋\n\nEu gostaria de confirmar meu pedido:\n\n*Cliente:* ${name}\n*Pedido:* ${items}\n*Valor Total:* R$ ${total}\n\n*Tipo:* ${deliveryType}\n*Data:* ${deliveryDate}${address}\n\nAguardo as instruções para o pagamento antecipado de 50% (R$ ${orderData.advance_payment}).\n\nObrigado!`;
  
  return encodeURIComponent(message);
}

function generateAvailableDates() {
  const dateContainer = document.getElementById('dateOptions');
  const today = new Date();
  const dates = [];
  
  for (let i = 1; i <= 20; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    if (date.getDay() !== 0) {
      dates.push(date);
    }
    
    if (dates.length >= 10) break;
  }
  
  dateContainer.innerHTML = '';
  dates.forEach((date, index) => {
    const dateDiv = document.createElement('div');
    dateDiv.className = 'date-option';
    dateDiv.onclick = () => selectDate(date, dateDiv);
    
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    const dayNumber = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' });
    
    dateDiv.innerHTML = `
      <div style="font-size: 0.8em; opacity: 0.8;">${dayName}</div>
      <div style="font-size: 1.2em; font-weight: bold;">${dayNumber}</div>
      <div style="font-size: 0.8em; opacity: 0.8;">${month}</div>
    `;
    
    dateContainer.appendChild(dateDiv);
  });
}

function selectDate(date, element) {
  document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
  selectedDate = date;
}

function toggleDeliveryAddress() {
  const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
  const addressSection = document.getElementById('deliveryAddress');
  
  if (deliveryType === 'delivery') {
    addressSection.classList.add('show');
    document.getElementById('address').required = true;
  } else {
    addressSection.classList.remove('show');
    document.getElementById('address').required = false;
  }
}

function updateOrderSummary() {
  const summaryContainer = document.getElementById('orderSummary');
  let summaryHTML = '';
  let total = 0;
  
  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    const quantity = cart[productId];
    const itemTotal = product.price * quantity;
    total += itemTotal;
    
    summaryHTML += `
      <div class="summary-item">
        <span>${product.name} (${quantity}x)</span>
        <span>R$ ${itemTotal}</span>
      </div>
    `;
  });
  
  const advancePayment = Math.ceil(total * 0.5);
  
  summaryHTML += `
    <div class="summary-total">
      <div class="summary-item">
        <span>Total do Pedido:</span>
        <span>R$ ${total}</span>
      </div>
      <div class="summary-item" style="color: #FFFBE3; font-size: 1.1em;">
        <span>Pagamento Antecipado (50%):</span>
        <span>R$ ${advancePayment}</span>
      </div>
    </div>
  `;
  
  summaryContainer.innerHTML = summaryHTML;
}

function openCheckout() {
  updateOrderSummary();
  generateAvailableDates();
  document.getElementById('checkoutModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('show');
  document.body.style.overflow = 'auto';
  
  document.getElementById('checkoutForm').reset();
  selectedDate = null;
  document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
  toggleDeliveryAddress();
}

// ---- Event Listeners ----

// Aplica a configuração quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    applyConfig(defaultConfig);
});

document.getElementById('orderButton').addEventListener('click', function() {
  if (Object.keys(cart).length === 0) {
    showToast('Adicione produtos ao carrinho primeiro!');
    return;
  }
  openCheckout();
});

document.getElementById('checkoutForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  console.log('📝 Processando pedido...');

  // --- NOVA LÓGICA DE ENVIO PARA GOOGLE SHEETS ---
  // Cole a URL do seu Web App do Google Apps Script aqui
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcmGjQ9XYGb2hv_cn6gbwufEhk3mx3tGFXkZoy4ccQSsAn5GVCWYNEJzzUAVQbMpKT-A/exec';

  /* if (GOOGLE_APPS_SCRIPT_URL === 'COLOQUE_AQUI_A_URL_DO_SEU_WEB_APP_DO_APPS_SCRIPT') {
      showToast('❌ Erro: A URL do Google Apps Script não foi configurada.');
      return;
  }
  */

  // Validações (iguais a antes)
  if (!selectedDate) {
    showToast('Por favor, selecione uma data para entrega/retirada!');
    return;
  }
  const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
  if (deliveryType === 'delivery' && !document.getElementById('address').value.trim()) {
    showToast('Por favor, preencha o endereço para entrega!');
    return;
  }
  
  const submitBtn = document.querySelector('.btn-primary');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Salvando pedido...';
  submitBtn.disabled = true;
  
  try {
    const customerName = document.getElementById('customerName').value.trim();
    const customerEmail = document.getElementById('customerEmail').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    
    if (!customerName || !customerEmail || !customerPhone) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos');
    }
    
    const orderData = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      delivery_type: deliveryType === 'pickup' ? 'Retirada na loja' : 'Entrega',
      delivery_address: deliveryType === 'delivery' ? document.getElementById('address').value.trim() : '',
      delivery_complement: deliveryType === 'delivery' ? document.getElementById('addressComplement').value.trim() : '',
      delivery_date: selectedDate.toLocaleDateString('pt-BR'),
      order_items: generateOrderItemsText(),
      total_amount: calculateTotal(),
      advance_payment: Math.ceil(calculateTotal() * 0.5),
      order_date: new Date().toISOString(),
      order_id: generateOrderId()
    };
    
    console.log('Dados do pedido preparados:', orderData);
    
    // Envia os dados para o Google Apps Script
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // 'no-cors' é mais simples de configurar no Apps Script
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });

    // Como estamos em modo 'no-cors', não podemos ler a resposta.
    // Apenas assumimos que foi ok se não houver erro de rede.
    console.log('Pedido enviado para o Google Apps Script.');

    // --- SUCESSO ---
    
    // 1. Gerar mensagem do WhatsApp
    const whatsappMessage = generateWhatsAppMessage(orderData, defaultConfig);
    const whatsappNumber = defaultConfig.whatsapp_number;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // 2. Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');
    
    closeCheckout();
    
    // Limpar carrinho
    cart = {};
    for (let i = 1; i <= 6; i++) {
      document.getElementById(`quantity${i}`).textContent = '0';
    }
    updateCart();
    
    showToast('✅ Pedido recebido! Finalize no WhatsApp.', 4000);

  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    showToast(`❌ Erro: ${error.message || 'Erro desconhecido'}`);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});