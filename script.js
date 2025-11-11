/**
 * Lógica do Cardápio Online
 * Este script cuida do carrinho, do modal de checkout e do envio
 * do pedido para o Google Sheets.
 */

// -----------------------------------------------------------------------------
// VARIÁVEIS GLOBAIS E CONFIGURAÇÃO
// -----------------------------------------------------------------------------

// !!! COLE A NOVA URL AQUI !!!
// (A URL que você gerou no "Passo 1" com o novo código do Google Script)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuLkrewXcQHkYttZcYy-aQPjyK9me6j0U1BidQRISh97NEXwPpX9fuQHUMPC2z9VXNHw/exec';

// Número do WhatsApp para redirecionamento
const whatsappNumber = '5541995404238';

// Lista de produtos (deve bater com o HTML e Google Sheets)
const products = [
  { id: 1, name: "Lata de cookies", price: 70 },
  { id: 2, name: "Lata suspiro", price: 60 },
  { id: 3, name: "Pote de cookies", price: 35 },
  { id: 4, name: "Pote de suspiro", price: 35 },
  { id: 5, name: "Cartão suspiro papai noel", price: 15 },
  { id: 6, name: "Suspiro árvore de natal", price: 12 }
];

// Estado da aplicação
let cart = {};
let selectedDate = null;
let isSubmitting = false;

// -----------------------------------------------------------------------------
// EVENT LISTENERS (Onde a aplicação começa)
// -----------------------------------------------------------------------------

// Espera o DOM carregar para adicionar os listeners
document.addEventListener('DOMContentLoaded', () => {
  
  // Botões de quantidade (+/-)
  // Usamos delegação de evento para pegar todos os botões
  document.querySelector('.menu-grid').addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-btn')) {
      const productId = e.target.dataset.productId;
      const change = parseInt(e.target.dataset.change, 10);
      changeQuantity(productId, change);
    }
  });

  // Botão "Fazer Pedido" (abre o modal)
  document.getElementById('orderButton').addEventListener('click', openCheckout);

  // Botões de fechar o modal
  document.getElementById('closeModalBtn').addEventListener('click', closeCheckout);
  document.getElementById('cancelCheckoutBtn').addEventListener('click', closeCheckout);

  // Toggle do endereço de entrega
  document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
    radio.addEventListener('change', toggleDeliveryAddress);
  });

  // Envio do formulário
  document.getElementById('checkoutForm').addEventListener('submit', handleFormSubmit);
});

// -----------------------------------------------------------------------------
// LÓGICA DO CARRINHO
// -----------------------------------------------------------------------------

/**
 * Altera a quantidade de um produto no carrinho.
 * @param {string} productId - O ID do produto (ex: "1")
 * @param {number} change - A mudança na quantidade (ex: 1 ou -1)
 */
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

/**
 * Atualiza a interface do carrinho (itens e total).
 */
function updateCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const totalPriceEl = document.getElementById('totalPrice');

  if (Object.keys(cart).length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Seu carrinho está vazio</div>';
    cartTotalEl.style.display = 'none';
    return;
  }

  let cartHTML = '';
  let total = 0;

  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    if (!product) return; // Segurança

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
  totalPriceEl.textContent = `R$ ${total}`;
  cartTotalEl.style.display = 'flex';
}

/**
 * Reseta o carrinho (usado após o pedido ser enviado).
 */
function resetCart() {
  cart = {};
  products.forEach(p => {
    const qtyEl = document.getElementById(`quantity${p.id}`);
    if (qtyEl) qtyEl.textContent = '0';
  });
  updateCart();
}

// -----------------------------------------------------------------------------
// LÓGICA DO MODAL (CHECKOUT)
// -----------------------------------------------------------------------------

/**
 * Abre o modal de checkout.
 */
function openCheckout() {
  if (Object.keys(cart).length === 0) {
    showToast('Adicione produtos ao carrinho primeiro!');
    return;
  }

  updateOrderSummary();
  generateAvailableDates(); // Gera as datas
  document.getElementById('checkoutModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de checkout.
 */
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('show');
  document.body.style.overflow = 'auto';
  
  // Limpar formulário (exceto resetar o formulário que limpa os rádios)
  document.getElementById('customerName').value = '';
  document.getElementById('customerEmail').value = '';
  document.getElementById('customerPhone').value = '';
  document.getElementById('address').value = '';
  document.getElementById('addressComplement').value = '';
  
  selectedDate = null;
  document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
  
  // Resetar rádio de entrega
  document.querySelector('input[name="deliveryType"][value="pickup"]').checked = true;
  toggleDeliveryAddress();
}

/**
 * Mostra ou esconde os campos de endereço com base na seleção.
 */
function toggleDeliveryAddress() {
  const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
  const addressSection = document.getElementById('deliveryAddress');
  const addressInput = document.getElementById('address');

  if (deliveryType === 'delivery') {
    addressSection.classList.add('show');
    addressInput.required = true;
  } else {
    addressSection.classList.remove('show');
    addressInput.required = false;
  }
}

/**
 * GERA AS DATAS DE ENTREGA (19 a 23 de DEZEMBRO)
 */
function generateAvailableDates() {
  const dateContainer = document.getElementById('dateOptions');
  dateContainer.innerHTML = ''; // Limpa opções anteriores
  
  const today = new Date();
  let year = today.getFullYear();
  
  // O mês no JS é 0-indexed (11 = Dezembro)
  // Criamos uma data para o último dia de entrega
  const lastDeliveryDay = new Date(year, 11, 23); 
  
  // Se hoje for DEPOIS do dia 23 de Dezembro,
  // usamos as datas do ano que vem.
  if (today > lastDeliveryDay) {
    year = year + 1;
  }
  
  // Lista de dias específicos que o usuário quer
  const days = [19, 20, 21, 22, 23];
  
  days.forEach(day => {
    // O mês 11 é Dezembro
    const date = new Date(year, 11, day);
    
    // Formata a data (ex: Sex, 19, Dez)
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    const dayNumber = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'short' });
    
    // Cria o elemento
    const dateDiv = document.createElement('div');
    dateDiv.className = 'date-option';
    // Usamos uma closure para capturar a 'date' e o 'dateDiv' corretos no clique
    dateDiv.onclick = () => selectDate(date, dateDiv);
    
    dateDiv.innerHTML = `
      <div style="font-size: 0.8em; opacity: 0.8;">${dayName}</div>
      <div style="font-size: 1.2em; font-weight: bold;">${dayNumber}</div>
      <div style="font-size: 0.8em; opacity: 0.8;">${month}</div>
    `;
    
    dateContainer.appendChild(dateDiv);
  });
}


/**
 * Seleciona uma data (clicável).
 * @param {Date} date - O objeto Date selecionado
 * @param {HTMLElement} element - O div que foi clicado
 */
function selectDate(date, element) {
  // Remove seleção anterior
  document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
  
  // Adiciona seleção atual
  element.classList.add('selected');
  selectedDate = date;
}

/**
 * Atualiza o resumo do pedido dentro do modal.
 */
function updateOrderSummary() {
  const summaryContainer = document.getElementById('orderSummary');
  let summaryHTML = '';
  let total = 0;

  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    if (!product) return;

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

// -----------------------------------------------------------------------------
// ENVIO DO PEDIDO (GOOGLE SHEETS E WHATSAPP)
// -----------------------------------------------------------------------------

/**
 * Manipula o envio do formulário de checkout.
 * @param {Event} e - O evento de submit do formulário
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  if (isSubmitting) return; // Previne cliques duplos

  // 1. Validação Simples
  if (!selectedDate) {
    showToast('Por favor, selecione uma data para entrega/retirada!');
    return;
  }
  
  const submitBtn = document.getElementById('submitOrderBtn');
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;
  isSubmitting = true;

  // 2. Coleta de Dados do Formulário
  const formData = new FormData();
  const orderData = {
    order_id: `BOLLI-${Date.now().toString().slice(-6)}`,
    order_date: new Date().toISOString(),
    customer_name: document.getElementById('customerName').value.trim(),
    customer_email: document.getElementById('customerEmail').value.trim(),
    customer_phone: document.getElementById('customerPhone').value.trim(),
    delivery_type: document.querySelector('input[name="deliveryType"]:checked').value,
    delivery_address: document.getElementById('address').value.trim(),
    delivery_complement: document.getElementById('addressComplement').value.trim(),
    delivery_date: selectedDate.toLocaleDateString('pt-BR'), // ex: 20/12/2024
    total_amount: calculateTotal()
  };

  // 3. Adiciona dados ao FormData (para Google Sheets)
  Object.keys(orderData).forEach(key => {
    formData.append(key, orderData[key]);
  });

  // Adiciona os produtos e quantidades ao FormData
  // Garante que sua planilha tenha colunas com os nomes exatos dos produtos.
  products.forEach(product => {
    const quantity = cart[product.id] || 0;
    // Envia o nome exato do produto como chave (ex: "Lata de cookies")
    formData.append(product.name, quantity);
  });
  
  let message = '';
  let isError = false;

  // 4. Envio para Google Sheets
  try {
    console.log('Enviando dados do pedido...');
    
    // Corrigido: A variável global é GOOGLE_SCRIPT_URL, não googleScriptURL
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json(); // Espera a resposta JSON
      console.log('Resposta do servidor:', result);

      if (result.result === 'success') {
        // SUCESSO: O script GS funcionou
        console.log('Pedido salvo com sucesso!');
        message = buildWhatsAppMessage(orderData, false);
        showToast('✅ Pedido recebido! Redirecionando para o WhatsApp...');
        closeCheckout();
        resetCart();
      } else {
        // ERRO: O script GS reportou um erro (ex: planilha não encontrada)
        throw new Error(result.message || 'O servidor reportou um erro.');
      }
    } else {
      // ERRO: Erro de rede ou o script não foi encontrado (404, 500)
      throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    // ERRO: Captura todos os erros (CORS, rede, JSON inválido)
    console.error('Erro ao salvar pedido:', error);
    isError = true;
    // Se falhar, pelo menos envia o pedido para o WhatsApp
    message = buildWhatsAppMessage(orderData, true);
    showToast('❌ Erro ao processar. Redirecionando para o WhatsApp para completar.');
  
  } finally {
    // 5. Redirecionamento para WhatsApp
    // Isso acontece tanto em caso de sucesso quanto de erro
    submitBtn.textContent = 'Confirmar Pedido';
    submitBtn.disabled = false;
    isSubmitting = false;

    // Só redireciona se a mensagem foi construída (ou seja, se passou da validação)
    if (message) {
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank'); // Abre em nova aba
    }
  }
}

/**
 * Calcula o total do carrinho.
 * @returns {number} - O valor total.
 */
function calculateTotal() {
  let total = 0;
  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    total += product.price * cart[productId];
  });
  return total;
}

/**
 * Constrói a mensagem formatada para o WhatsApp.
 * @param {object} data - Os dados do pedido.
 * @param {boolean} isError - Se a mensagem deve incluir um aviso de erro.
 * @returns {string} - A mensagem formatada.
 */
function buildWhatsAppMessage(data, isError = false) {
  let itemsText = '';
  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    if (product && cart[productId] > 0) {
      itemsText += `\n- ${product.name} (Qtd: ${cart[productId]})`;
    }
  });

  let deliveryText = '';
  if (data.delivery_type === 'delivery') {
    deliveryText = `*Entrega em:* ${data.delivery_address}`;
    if (data.delivery_complement) {
      deliveryText += `, ${data.delivery_complement}`;
    }
    deliveryText += '\n*(Aguardando cálculo da taxa de entrega)*';
  } else {
    deliveryText = '*Retirada na loja*';
  }

  // As linhas 'errorText' e 'if(isError)' foram removidas
  // Adiciona aviso de erro se necessário
  let errorText = '';
  if (isError) {
      errorText = "*(Ocorreu um erro ao salvar na planilha, mas segue o pedido para confirmação manual)*\n\n";
  }
  
  return `
${errorText}Olá! Gostaria de confirmar meu pedido:

*Pedido:* ${data.order_id}
*Cliente:* ${data.customer_name}
*Contato (Celular):* ${data.customer_phone}
*Contato (E-mail):* ${data.customer_email}

*Itens:*
${itemsText}

*Total dos Produtos:* R$ ${data.total_amount}
*Pagamento (50%):* R$ ${Math.ceil(data.total_amount * 0.5)}

*Entrega/Retirada:* ${data.delivery_date}
*Tipo:* ${deliveryText}

Obrigado(a)!
`.trim().replace(/\n\n+/g, '\n\n'); // Limpa linhas extras
}


// -----------------------------------------------------------------------------
// UTILITÁRIOS
// -----------------------------------------------------------------------------

/**
 * Mostra uma notificação toast na tela.
 * @param {string} message - A mensagem a ser exibida.
 * @param {number} duration - Quanto tempo a mensagem fica visível (ms).
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
