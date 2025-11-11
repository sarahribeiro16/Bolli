// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURAÇÕES GLOBAIS ---

  // URL para onde os dados do formulário serão enviados (Google Apps Script)
  // Substitua pela sua URL de implantação do App da Web
  const googleScriptURL =
    "https://script.google.com/macros/s/AKfycbzAi3V_HfBrb4mB7gatK1xzUSv82KJbbqOBuLmmrbielT1QDh9M7efRDLomlPTaa1diCw/exec";

  // Número de WhatsApp para onde o pedido será enviado (formato internacional)
  const whatsappNumber = "5541995404238";

  // Definição dos produtos disponíveis (deve corresponder ao HTML e à planilha)
  const products = [
    { id: 1, name: "Lata de cookies", price: 70 },
    { id: 2, name: "Lata suspiro", price: 60 },
    { id: 3, name: "Pote de cookies", price: 35 },
    { id: 4, name: "Pote de suspiro", price: 35 },
    { id: 5, name: "Cartão suspiro papai noel", price: 15 },
    { id: 6, name: "Suspiro árvore de natal", price: 12 },
  ];

  // Objeto para armazenar os itens do carrinho
  let cart = {};
  // Variável para armazenar a data de entrega selecionada
  let selectedDate = null;
  // Variável para armazenar a mensagem de erro (para diagnóstico)
  let lastErrorMessage = null;

  // --- SELETORES DE ELEMENTOS ---
  // Seleciona os principais elementos da página para evitar repetição
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalContainer = document.getElementById("cartTotal");
  const totalPriceElement = document.getElementById("totalPrice");
  const orderButton = document.getElementById("orderButton");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const deliveryAddressContainer = document.getElementById("deliveryAddress");
  const dateOptionsContainer = document.getElementById("dateOptions");
  const orderSummaryContainer = document.getElementById("orderSummary");
  const toastElement = document.getElementById("toast");
  const submitButton = document.getElementById("submitOrderBtn");
  const closeButton = document.getElementById("closeModalBtn");
  const cancelButton = document.getElementById("cancelCheckoutBtn");
  const quantityButtons = document.querySelectorAll(".quantity-btn");
  const radioOptions = document.querySelectorAll(
    'input[name="deliveryType"]'
  );

  // --- FUNÇÕES PRINCIPAIS ---

  /**
   * Altera a quantidade de um produto no carrinho.
   * @param {number} productId - O ID do produto.
   * @param {number} change - A variação na quantidade (+1 ou -1).
   */
  function changeQuantity(productId, change) {
    const currentQuantity = cart[productId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);

    if (newQuantity === 0) {
      delete cart[productId]; // Remove o item se a quantidade for 0
    } else {
      cart[productId] = newQuantity; // Atualiza a quantidade
    }

    // Atualiza o display de quantidade na página
    document.getElementById(`quantity${productId}`).textContent = newQuantity;
    // Atualiza a visualização do carrinho
    updateCartDisplay();
  }

  /**
   * Atualiza a interface do carrinho (itens e total).
   */
  function updateCartDisplay() {
    // Verifica se o carrinho está vazio
    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML =
        '<div class="cart-empty">O seu carrinho está vazio</div>';
      cartTotalContainer.style.display = "none"; // Esconde o total
      return;
    }

    let cartHTML = "";
    let total = 0;

    // Itera sobre os produtos no carrinho
    for (const productId in cart) {
      const product = products.find((p) => p.id == productId);
      if (product) {
        const quantity = cart[productId];
        const itemTotal = product.price * quantity;
        total += itemTotal;

        // Cria o HTML para cada item do carrinho
        cartHTML += `
          <div class="cart-item">
            <span class="cart-item-name">${product.name}</span>
            <div class="cart-item-details">
              <span class="cart-item-quantity">${quantity}x</span>
              <span class="cart-item-price">R$ ${itemTotal}</span>
            </div>
          </div>
        `;
      }
    }

    // Atualiza o container de itens e o valor total
    cartItemsContainer.innerHTML = cartHTML;
    totalPriceElement.textContent = `R$ ${total}`;
    cartTotalContainer.style.display = "flex"; // Mostra o total
  }

  /**
   * Mostra ou esconde os campos de endereço baseado na seleção de entrega.
   */
  function toggleDeliveryAddress() {
    const deliveryType = checkoutForm.querySelector(
      'input[name="deliveryType"]:checked'
    ).value;
    const addressInput = document.getElementById("address");

    if (deliveryType === "delivery") {
      deliveryAddressContainer.classList.add("show");
      addressInput.required = true; // Endereço é obrigatório para entrega
    } else {
      deliveryAddressContainer.classList.remove("show");
      addressInput.required = false; // Endereço não é obrigatório para retirada
    }
  }

  /**
   * Gera e exibe as datas de entrega/retirada disponíveis (19 a 23 de Dezembro).
   */
  function generateAvailableDates() {
    dateOptionsContainer.innerHTML = ""; // Limpa datas anteriores
    const dates = [];
    const today = new Date();
    let currentYear = today.getFullYear();

    // Se a data de hoje já passou do dia 23 de Dezembro, mostra as datas do próximo ano
    if (today.getMonth() === 11 && today.getDate() > 23) {
      currentYear++;
    }

    // Dias de entrega: 19, 20, 21, 22, 23 de Dezembro
    const availableDays = [19, 20, 21, 22, 23];

    availableDays.forEach((day) => {
      // Cria o objeto Date (Mês 11 = Dezembro, pois meses são 0-11)
      const date = new Date(currentYear, 11, day);
      dates.push(date);
    });

    // Cria os elementos HTML para cada data disponível
    dates.forEach((date) => {
      const dateDiv = document.createElement("div");
      dateDiv.className = "date-option";
      dateDiv.onclick = () => selectDate(date, dateDiv);

      const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });
      const dayNumber = date.getDate();
      const month = date.toLocaleDateString("pt-BR", { month: "short" });

      dateDiv.innerHTML = `
        <div style="font-size: 0.8em; opacity: 0.8;">${dayName}</div>
        <div style="font-size: 1.2em; font-weight: bold;">${dayNumber}</div>
        <div style="font-size: 0.8em; opacity: 0.8;">${month}</div>
      `;

      dateOptionsContainer.appendChild(dateDiv);
    });
  }

  /**
   * Armazena a data selecionada e atualiza a interface.
   * @param {Date} date - A data selecionada.
   * @param {HTMLElement} element - O elemento da data que foi clicado.
   */
  function selectDate(date, element) {
    // Remove a seleção de outras datas
    document
      .querySelectorAll(".date-option")
      .forEach((el) => el.classList.remove("selected"));
    // Adiciona a classe 'selected' ao elemento clicado
    element.classList.add("selected");
    selectedDate = date; // Armazena a data
  }

  /**
   * Atualiza o resumo do pedido no modal de checkout.
   */
  function updateOrderSummary() {
    let summaryHTML = "";
    let total = 0;

    // Calcula o total e cria o HTML para cada item
    for (const productId in cart) {
      const product = products.find((p) => p.id == productId);
      if (product) {
        const quantity = cart[productId];
        const itemTotal = product.price * quantity;
        total += itemTotal;

        summaryHTML += `
          <div class="summary-item">
            <span>${product.name} (${quantity}x)</span>
            <span>R$ ${itemTotal}</span>
          </div>
        `;
      }
    }

    // Calcula o pagamento antecipado (50%)
    const advancePayment = Math.ceil(total * 0.5);

    // Adiciona o HTML do total e do pagamento antecipado
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

    orderSummaryContainer.innerHTML = summaryHTML;
  }

  /**
   * Abre o modal de checkout, prepara o formulário e gera as datas.
   */
  function openCheckout() {
    if (Object.keys(cart).length === 0) {
      showToast("Adicione produtos ao carrinho primeiro!");
      return;
    }
    updateOrderSummary();
    generateAvailableDates();
    checkoutModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Trava o scroll da página
  }

  /**
   * Fecha o modal de checkout e limpa o formulário.
   */
  function closeCheckout() {
    checkoutModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Libera o scroll da página

    // Limpa o formulário
    checkoutForm.reset();
    selectedDate = null;
    document
      .querySelectorAll(".date-option")
      .forEach((el) => el.classList.remove("selected"));
    toggleDeliveryAddress(); // Garante que os campos de endereço fiquem ocultos
  }

  /**
   * Exibe uma mensagem temporária (toast) na tela.
   * @param {string} message - A mensagem a ser exibida.
   * @param {number} [duration=3000] - O tempo em milissegundos que a mensagem ficará visível.
   */
  function showToast(message, duration = 3000) {
    toastElement.textContent = message;
    toastElement.classList.add("show");
    setTimeout(() => {
      toastElement.classList.remove("show");
    }, duration);
  }

  /**
   * Gera um ID de pedido único baseado no timestamp.
   * @returns {string} O ID do pedido (ex: BOLLI123456).
   */
  function generateOrderId() {
    const timestamp = new Date().getTime().toString().slice(-6);
    return `BOLLI${timestamp}`;
  }

  /**
   * Coleta os dados do formulário e do carrinho.
   * @returns {FormData} Um objeto FormData pronto para ser enviado.
   */
  function getOrderData() {
    const formData = new FormData(checkoutForm);
    const deliveryType = formData.get("deliveryType");
    const total = calculateTotal();
    const advancePayment = Math.ceil(total * 0.5);

    // Cria um novo FormData para enviar
    const dataForSheet = new FormData();

    // Adiciona dados do formulário
    dataForSheet.append(
      "customer_name",
      formData.get("customerName").trim()
    );
    dataForSheet.append(
      "customer_email",
      formData.get("customerEmail").trim()
    );
    dataForSheet.append(
      "customer_phone",
      formData.get("customerPhone").trim()
    );

    // Adiciona dados do pedido
    dataForSheet.append("order_id", generateOrderId());
    dataForSheet.append("order_date", new Date().toISOString());
    dataForSheet.append(
      "delivery_type",
      deliveryType === "pickup" ? "Retirada na loja" : "Entrega"
    );
    dataForSheet.append(
      "delivery_address",
      deliveryType === "delivery" ? formData.get("address").trim() : ""
    );
    dataForSheet.append(
      "delivery_complement",
      deliveryType === "delivery"
        ? formData.get("addressComplement").trim()
        : ""
    );
    dataForSheet.append(
      "delivery_date",
      selectedDate.toLocaleDateString("pt-BR")
    );
    dataForSheet.append("total_amount", total);
    dataForSheet.append("advance_payment", advancePayment);

    // Adiciona os produtos e suas quantidades ao FormData
    products.forEach((product) => {
      const quantity = cart[product.id] || 0;
      dataForSheet.append(product.name, quantity); // Ex: "Lata de cookies": 2
    });

    return dataForSheet;
  }

  /**
   * Calcula o valor total do carrinho.
   * @returns {number} O valor total.
   */
  function calculateTotal() {
    let total = 0;
    for (const productId in cart) {
      const product = products.find((p) => p.id == productId);
      if (product) {
        total += product.price * cart[productId];
      }
    }
    return total;
  }

  /**
   * Limpa o carrinho e reseta a interface.
   */
  function resetCart() {
    cart = {};
    products.forEach((product) => {
      const el = document.getElementById(`quantity${product.id}`);
      if (el) el.textContent = "0";
    });
    updateCartDisplay();
  }

  /**
   * Constrói a mensagem de texto para o WhatsApp.
   * @param {FormData} formData - Os dados do pedido.
   * @param {string | null} [errorMessage=null] - Mensagem de erro (para diagnóstico).
   * @returns {string} A mensagem formatada.
   */
  function buildWhatsAppMessage(formData, errorMessage = null) {
    let itemsText = "";
    for (const productId in cart) {
      const product = products.find((p) => p.id == productId);
      if (product) {
        itemsText += `\n- ${product.name} (${cart[productId]}x)`;
      }
    }

    let deliveryText = "";
    if (formData.get("delivery_type") === "Entrega") {
      deliveryText = `*Entrega:*
${formData.get("delivery_address")}
${formData.get("delivery_complement") || ""}
(Taxa de entrega a confirmar)`;
    } else {
      deliveryText = "*Retirada na loja*";
    }

    // Adiciona a mensagem de diagnóstico de erro (se houver)
    const errorText = errorMessage
      ? `⚠️ *ALERTA DE DIAGNÓSTICO* ⚠️
(Houve um erro ao salvar. Por favor, envie esta mensagem assim mesmo.)
*Erro Técnico:* ${errorMessage}
---------------------\n\n`
      : "";

    return `${errorText}Olá! Gostaria de confirmar meu pedido:

*Pedido:* ${formData.get("order_id")}
*Data:* ${formData.get("delivery_date")}
*Nome:* ${formData.get("customer_name")}
*Celular:* ${formData.get("customer_phone")}
*E-mail:* ${formData.get("customer_email")}

*Itens:*${itemsText}

*Total:* R$ ${formData.get("total_amount")}
*Pagamento Antecipado (50%):* R$ ${formData.get("advance_payment")}

*Entrega/Retirada:*
${deliveryText}
`;
  }

  /**
   * Redireciona o usuário para o WhatsApp com a mensagem do pedido.
   * @param {string} message - A mensagem a ser enviada.
   */
  function redirectToWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    // CORREÇÃO: Usa window.location.href para funcionar em celulares
    // que bloqueiam window.open
    window.location.href = whatsappURL;
  }

  /**
   * Lida com a submissão do formulário de checkout.
   * @param {Event} e - O evento de submissão.
   */
  async function handleFormSubmit(e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    lastErrorMessage = null; // Limpa o erro anterior

    // Validação de data
    if (!selectedDate) {
      showToast("Por favor, selecione uma data para entrega/retirada!");
      return;
    }

    // Coleta os dados
    const orderDataForSheet = getOrderData();

    // Feedback visual (botão de carregamento)
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Processando...";
    submitButton.disabled = true;

    try {
      // Envia os dados para o Google Script
      // CORREÇÃO: Adicionado mode: "no-cors" para evitar erro de CORS
      const response = await fetch(googleScriptURL, {
        method: "POST",
        mode: "no-cors",
        body: orderDataForSheet,
      });

      // NOTA: Em modo "no-cors", a resposta é 'opaca'.
      // Não podemos verificar 'response.ok', então assumimos sucesso
      // se a promessa 'fetch' for resolvida.
      
      console.log("Pedido enviado para a planilha (no-cors).");
      showToast("✅ Pedido recebido! Redirecionando...", 4000);

    } catch (error) {
      // Erro
      console.error("Erro ao enviar pedido:", error);
      lastErrorMessage = `❌ Erro: ${error.message || "Falha no envio"}`;
      showToast(lastErrorMessage, 6000); // Mostra o erro exato
      
    } finally {
      // Este bloco SEMPRE será executado, com ou sem erro.
      
      // Constrói a mensagem do WhatsApp (incluindo o erro, se houver)
      const message = buildWhatsAppMessage(orderDataForSheet, lastErrorMessage);
      
      // Redireciona para o WhatsApp
      redirectToWhatsApp(message);
      
      // Restaura o botão (haverá um redirecionamento, mas é uma boa prática)
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      
      // Limpa o formulário e o carrinho
      closeCheckout();
      resetCart();
    }
  }

  // --- REGISTRO DE EVENTOS ---

  // Botão principal "Fazer Pedido"
  orderButton.addEventListener("click", openCheckout);
  // Botão "Fechar" (X) no modal
  closeButton.addEventListener("click", closeCheckout);
  // Botão "Voltar ao cardápio"
  cancelButton.addEventListener("click", closeCheckout);

  // Botões de tipo de entrega (rádio)
  radioOptions.forEach((input) => {
    input.addEventListener("change", toggleDeliveryAddress);
  });

  // Botões de quantidade
  quantityButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.productId;
      const change = parseInt(e.target.dataset.change, 10);
      changeQuantity(productId, change);
    });
  });

  // Submissão do formulário de checkout
  checkoutForm.addEventListener("submit", handleFormSubmit);

  // --- INICIALIZAÇÃO ---

  // Garante que o estado inicial do endereço esteja correto
  toggleDeliveryAddress();
  // Atualiza o carrinho (para o caso de estar vazio)
  updateCartDisplay();
});
