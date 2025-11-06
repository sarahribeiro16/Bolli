// URL do Google Apps Script (Webhook)
// Substitua pela URL gerada na sua implantação do Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcmGjQ9XYGb2hv_cn6gbwufEhk3mx3tGFXkZoy4ccQSsAn5GVCWYNEJzzUAVQbMpKT-A/exec';

// Configuração Padrão (Fallback)
const defaultConfig = {
  background_color: "#790C21",
  secondary_color: "#8F152D",
  text_color: "#FFFBE3",
  button_color: "#FFFBE3",
  button_text_color: "#790C21",
  font_family: "Della Respira, serif",
  font_size: 16,
  // === EDITADO AQUI ===
  // Troque "seu-logo.png" pelo nome exato do arquivo que você enviou
  logo_url: "meu-logo.png",
  store_name: "Confeitaria Bolli",
  store_tagline: "Doces especiais para momentos especiais",
// ... restante do código ...
  product_1_name: "Lata de cookies",
// ... restante do código ...
  whatsapp_number: "5541995404238" // Seu número de WhatsApp
};

// Dados dos produtos para o carrinho
// ... restante do código ...
let cart = {};
// ... restante do código ...
function applyConfig(config) {
// ... restante do código ...
  const logoUrl = config.logo_url || defaultConfig.logo_url;
  const logoImage = document.getElementById('logoImage');
// ... restante do código ...
    logoPlaceholder.style.display = 'flex';
  }

  // Atualizar produtos
// ... restante do código ...
  products[5].name = config.product_6_name || defaultConfig.product_6_name;
}

// Funções do Carrinho
// ... restante do código ...
function changeQuantity(productId, change) {
// ... restante do código ...
  updateCart();
}

function updateCart() {
// ... restante do código ...
  cartTotal.style.display = 'flex';
}

// Funções Auxiliares
// ... restante do código ...
function showToast(message, duration = 3000) {
// ... restante do código ...
  }, duration);
}

function generateOrderId() {
// ... restante do código ...
  return `BOLLI${timestamp}`;
}

function generateOrderItemsText() {
// ... restante do código ...
  return itemsText.slice(0, -2); // Remove última vírgula
}

function calculateTotal() {
// ... restante do código ...
  return total;
}

// Funções do Modal de Checkout
// ... restante do código ...
function generateAvailableDates() {
// ... restante do código ...
    dateContainer.appendChild(dateDiv);
  });
}

function selectDate(date, element) {
// ... restante do código ...
  selectedDate = date;
}

function toggleDeliveryAddress() {
// ... restante do código ...
    document.getElementById('address').required = false;
  }
}

function updateOrderSummary() {
// ... restante do código ...
  summaryContainer.innerHTML = summaryHTML;
}

function openCheckout() {
// ... restante do código ...
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
// ... restante do código ...
  toggleDeliveryAddress();
}

function generateWhatsAppMessage(orderData) {
// ... restante do código ...
  return encodeURIComponent(fullMessage);
}

// Event Listeners
// ... restante do código ...
document.getElementById('orderButton').addEventListener('click', function() {
// ... restante do código ...
  openCheckout();
});

document.getElementById('checkoutForm').addEventListener('submit', async function(e) {
// ... restante do código ...
    console.error('Erro ao processar pedido:', error);
    showToast(`❌ Erro: ${error.message || 'Falha ao enviar'}`);
  } finally {
// ... restante do código ...
    submitBtn.disabled = false;
  }
});

// Inicialização
// ... restante do código ...
document.addEventListener('DOMContentLoaded', () => {
  // Nós aplicamos a configuração padrão, já que não temos o Element SDK
  applyConfig(defaultConfig);
});
