// Aguarda o DOM estar completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

  // --- VARIÁVEIS GLOBAIS ---
  let cart = {};
  let selectedDate = null;
  const googleScriptURL = 'https://script.google.com/macros/s/AKfycbwcmGjQ9XYGb2hv_cn6gbwufEhk3mx3tGFXkZoy4ccQSsAn5GVCWYNEJzzUAVQbMpKT-A/exec';
  const whatsappNumber = '5541995404238';

  // Definição dos produtos (deve corresponder ao HTML)
  const products = [
    { id: 1, name: "Lata de cookies", price: 70 },
    { id: 2, name: "Lata suspiro", price: 60 },
    { id: 3, name: "Pote de cookies", price: 35 },
    { id: 4, name: "Pote de suspiro", price: 35 },
    { id: 5, name: "Cartão suspiro papai noel", price: 15 },
    { id: 6, name: "Suspiro árvore de natal", price: 12 }
  ];

  // --- ELEMENTOS DO DOM ---
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const totalPriceElement = document.getElementById('totalPrice');
  const orderButton = document.getElementById('orderButton');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const submitOrderBtn = document.getElementById('submitOrderBtn');
  const dateOptionsContainer = document.getElementById('dateOptions');
  const deliveryAddressContainer = document.getElementById('deliveryAddress');
  const deliveryRadioButtons = document.querySelectorAll('input[name="deliveryType"]');

  // --- FUNÇÕES PRINCIPAIS ---

  /**
   * Altera a quantidade de um produto no carrinho.
   * @param {string} productId - O ID do produto.
   * @param {number} change - A mudança na quantidade (+1 ou -1).
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
   * Atualiza a exibição do carrinho de compras.
   */
  function updateCart() {
    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML = '<div class="cart-empty">Seu carrinho está vazio</div>';
      cartTotal.style.display = 'none';
      return;
    }

    let cartHTML = '';
    let total = 0;

    Object.keys(cart).forEach(productId => {
      const product = products.find(p => p.id == productId);
      if (!product) return; // Segurança caso o produto não seja encontrado

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

  /**
   * Exibe uma notificação toast.
   * @param {string} message - A mensagem a ser exibida.
   * @param {number} [duration=3000] - A duração em milissegundos.
   */
  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /**
   * Gera um ID de pedido único.
   * @returns {string} O ID do pedido.
   */
  function generateOrderId() {
    const timestamp = new Date().getTime().toString().slice(-6);
    return `BOLLI${timestamp}`;
  }

  /**
   * Calcula o valor total do carrinho.
   * @returns {number} O valor total.
   */
  function calculateTotal() {
    let total = 0;
    Object.keys(cart).forEach(productId => {
      const product = products.find(p => p.id == productId);
      if (product) {
        const quantity = cart[productId];
        total += product.price * quantity;
      }
    });
    return total;
  }

  /**
   * Gera as datas disponíveis para seleção.
   */
  function generateAvailableDates() {
    const today = new Date();
    const dates = [];
    
    // Gerar próximos 20 dias
    for (let i = 1; i <= 20; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Pular domingos (0 = domingo)
      if (date.getDay() !== 0) {
        dates.push(date);
      }

      // Limitar a 10 datas disponíveis
      if (dates.length >= 10) break;
    }

    dateOptionsContainer.innerHTML = '';
    dates.forEach((date) => {
      const dateDiv = document.createElement('div');
      dateDiv.className = 'date-option';
      
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayNumber = date.getDate();
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });

      dateDiv.innerHTML = `
        <div style="font-size: 0.8em; opacity: 0.8;">${dayName.replace('.', '')}</div>
        <div style="font-size: 1.2em; font-weight: bold;">${dayNumber}</div>
        <div style="font-size: 0.8em; opacity: 0.8;">${month.replace('.', '')}</div>
      `;

      // Adiciona o evento de clique para selecionar a data
      dateDiv.addEventListener('click', () => selectDate(date, dateDiv));
      
      dateOptionsContainer.appendChild(dateDiv);
    });
  }

  /**
   * Seleciona uma data e atualiza a UI.
   * @param {Date} date - O objeto Date selecionado.
   * @param {HTMLElement} element - O elemento HTML clicado.
   */
  function selectDate(date, element) {
    // Remove seleção anterior
    document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
    
    // Adiciona seleção atual
    element.classList.add('selected');
    selectedDate = date;
  }

  /**
   * Alterna a exibição da seção de endereço com base no tipo de entrega.
   */
  function toggleDeliveryAddress() {
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const addressInput = document.getElementById('address');

    if (deliveryType === 'delivery') {
      deliveryAddressContainer.classList.add('show');
      addressInput.required = true;
    } else {
      deliveryAddressContainer.classList.remove('show');
      addressInput.required = false;
    }
  }

  /**
   * Atualiza o resumo do pedido no modal.
   */
  function updateOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    let summaryHTML = '';
    let total = calculateTotal();

    Object.keys(cart).forEach(productId => {
      const product = products.find(p => p.id == productId);
      if (!product) return;
      
      const quantity = cart[productId];
      const itemTotal = product.price * quantity;

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

  /**
   * Abre o modal de checkout.
   */
  function openCheckout() {
    if (Object.keys(cart).length === 0) {
      showToast('Adicione produtos ao carrinho primeiro!');
      return;
    }
    updateOrderSummary();
    generateAvailableDates();
    checkoutModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Impede o scroll da página
  }

  /**
   * Fecha o modal de checkout e limpa o formulário.
   */
  function closeCheckout() {
    checkoutModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restaura o scroll

    // Limpar formulário
    checkoutForm.reset();
    selectedDate = null;
    document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
    toggleDeliveryAddress();
  }

  /**
   * Constrói a mensagem para o WhatsApp.
   * @param {object} data - Os dados do pedido.
   * @param {boolean} [isError=false] - Indica se é uma mensagem de erro.
   * @returns {string} A mensagem formatada.
   */
  function buildWhatsAppMessage(data, isError = false) {
    let message = '';
    
    if (isError) {
      message += 'Olá! Tive um problema ao finalizar meu pedido no site. 😥\n\n';
      message += 'Gostaria de verificar o que aconteceu. Meus dados são:\n\n';
    } else {
      message += 'Olá! Gostaria de finalizar meu pedido! 🎉\n\n';
      message += `*Pedido:* ${data.order_id}\n`;
    }

    message += `*Nome:* ${data.customer_name}\n`;
    message += `*Celular:* ${data.customer_phone}\n`;
    message += `*E-mail:* ${data.customer_email}\n\n`;

    message += '*Itens do Pedido:*\n';
    Object.keys(cart).forEach(productId => {
      const product = products.find(p => p.id == productId);
      if (product) {
        message += `• ${product.name} (${cart[productId]}x)\n`;
      }
    });

    message += `\n*Total:* R$ ${data.total_amount}\n`;
    message += `*Pagamento (50%):* R$ ${data.advance_payment}\n\n`;
    message += `*Tipo de Entrega:* ${data.delivery_type}\n`;
    message += `*Data:* ${data.delivery_date}\n`;

    if (data.delivery_type === 'Entrega' && data.delivery_address) {
      message += `*Endereço:* ${data.delivery_address}\n`;
      if (data.delivery_complement) {
        message += `*Complemento:* ${data.delivery_complement}\n`;
      }
    }

    if (isError) {
      message += '\nPoderiam me ajudar, por favor?';
    } else {
      message += '\nAguardo as instruções para o pagamento. Obrigado!';
    }
    
    return message;
  }

  /**
   * Limpa o carrinho e reseta a UI.
   */
  function resetCart() {
    cart = {};
    for (let i = 1; i <= products.length; i++) {
      const qtyDisplay = document.getElementById(`quantity${i}`);
      if (qtyDisplay) {
        qtyDisplay.textContent = '0';
      }
    }
    updateCart();
  }

  /**
   * Manipula o envio do formulário de checkout.
   * @param {Event} e - O evento de submit.
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📝 Processando pedido...');

    // Validação de data
    if (!selectedDate) {
      showToast('Por favor, selecione uma data para entrega/retirada!');
      return;
    }

    // Validação de endereço
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const addressValue = document.getElementById('address').value.trim();
    if (deliveryType === 'delivery' && !addressValue) {
      showToast('Por favor, preencha o endereço para entrega!');
      return;
    }

    // UI de carregamento
    const originalText = submitOrderBtn.textContent;
    submitOrderBtn.textContent = 'Salvando...';
    submitOrderBtn.disabled = true;

    // Coleta os dados do formulário
    const totalAmount = calculateTotal();
    const orderData = {
      order_id: generateOrderId(),
      order_date: new Date().toISOString(),
      customer_name: document.getElementById('customerName').value.trim(),
      customer_email: document.getElementById('customerEmail').value.trim(),
      customer_phone: document.getElementById('customerPhone').value.trim(),
      delivery_type: deliveryType === 'pickup' ? 'Retirada na loja' : 'Entrega',
      delivery_address: deliveryType === 'delivery' ? addressValue : '',
      delivery_complement: deliveryType === 'delivery' ? document.getElementById('addressComplement').value.trim() : '',
      delivery_date: selectedDate.toLocaleDateString('pt-BR'),
      total_amount: totalAmount,
      advance_payment: Math.ceil(totalAmount * 0.5),
    };

    // Prepara o FormData para o Google Sheets
    // Isso envia os dados como um formulário, que o Google Apps Script espera
    const formData = new FormData();
    
    // Adiciona os dados do cliente e do pedido
    // Os nomes aqui (ex: 'customer_name') devem corresponder
    // aos cabeçalhos da sua planilha Google Sheets.
    formData.append('order_id', orderData.order_id);
    formData.append('order_date', orderData.order_date);
    formData.append('customer_name', orderData.customer_name);
    formData.append('customer_email', orderData.customer_email);
    formData.append('customer_phone', orderData.customer_phone);
    formData.append('delivery_type', orderData.delivery_type);
    formData.append('delivery_address', orderData.delivery_address);
    formData.append('delivery_complement', orderData.delivery_complement);
    formData.append('delivery_date', orderData.delivery_date);
    formData.append('total_amount', orderData.total_amount);
    formData.append('advance_payment', orderData.advance_payment);

    // Adiciona as colunas de produtos dinamicamente
    // Garante que sua planilha tenha colunas com os nomes exatos dos produtos.
    products.forEach(product => {
      const quantity = cart[product.id] || 0;
      formData.append(product.name, quantity);
    });
    
    let message = '';
    let isError = false;

    try {
      console.log('Enviando para Google Sheets...');
      
      const response = await fetch(googleScriptURL, {
        method: 'POST',
        body: formData,
      });

      // Google Scripts geralmente redirecionam ou dão respostas 'opaque'
      // Então não verificamos estritamente 'response.ok'
      if (response) {
        console.log('Pedido salvo com sucesso!');
        message = buildWhatsAppMessage(orderData, false);
        showToast('✅ Pedido recebido! Redirecionando para o WhatsApp...');
        closeCheckout();
        resetCart();
      } else {
        throw new Error('Resposta do servidor não foi OK');
      }

    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      isError = true;
      message = buildWhatsAppMessage(orderData, true);
      showToast('❌ Erro ao enviar. Vamos te redirecionar para o WhatsApp.');
    
    } finally {
      // Reativa o botão
      submitOrderBtn.textContent = originalText;
      submitOrderBtn.disabled = false;
      
      // Redireciona para o WhatsApp em ambos os casos (sucesso ou erro)
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank'); // Abre em nova aba
    }
  }


  // --- EVENT LISTENERS ---

  // Botões de Quantidade (+/-)
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      const change = parseInt(btn.dataset.change, 10);
      changeQuantity(productId, change);
    });
  });

  // Botão "Fazer Pedido"
  orderButton.addEventListener('click', openCheckout);

  // Botões de fechar o modal
  closeModalBtn.addEventListener('click', closeCheckout);
  cancelCheckoutBtn.addEventListener('click', closeCheckout);

  // Botões de tipo de entrega (Radio)
  deliveryRadioButtons.forEach(radio => {
    radio.addEventListener('change', toggleDeliveryAddress);
  });

  // Envio do Formulário
  checkoutForm.addEventListener('submit', handleFormSubmit);

  // --- INICIALIZAÇÃO ---
  toggleDeliveryAddress(); // Garante que o endereço esteja oculto inicialmente

});
