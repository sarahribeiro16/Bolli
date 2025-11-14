// O 'DOMContentLoaded' garante que o script só rode após o HTML estar completo
document.addEventListener('DOMContentLoaded', () => {
            
    // ===== DADOS DOS PRODUTOS =====
    //
    //  NOVO CONTROLE DE ESTOQUE:
    //  Para "desligar" um produto, mude 'inStock: true' para 'inStock: false'
    //
    const products = [
        // --- CATEGORIA COOKIES ---
        {
            id: 'ferrero',
            name: 'Ferrero',
            price: 17.00,
            description: 'Gotas de chocolate ao leite, recheio de nutella com pedaços de avelã torradas.',
            image: 'ferrero.png', 
            special: false,
            category: 'cookies',
            inStock: true // <-- CONTROLE DE ESTOQUE
        },
        {
            id: 'kinder',
            name: 'Kinder',
            price: 17.00,
            description: 'Gotas de chocolate ao leite, recheio de nutella com pedaços de avelã torradas.',
            image: 'kinder.png', 
            special: false,
            category: 'cookies',
            inStock: true
        },
        {
            id: 'black',
            name: 'Black',
            price: 17.00,
            description: 'Gotas de chocolate ao leite, recheio de nutella com pedaços de avelã torradas.',
            image: 'black.png',
            special: false,
            category: 'cookies',
            inStock: true // <-- EXEMPLO DE PRODUTO ESGOTADO
        },
        {
            id: 'pistache',
            name: 'Pistache',
            price: 17.00,
            description: 'Gotas de chocolate ao leite, recheio de nutella com pedaços de avelã torradas.',
            image: 'pistache.png',
            special: false,
            category: 'cookies',
            inStock: true
        },
        {
            id: 'caramelo',
            name: 'Caramelo',
            price: 17.00,
            description: 'Gotas de chocolate ao leite, recheio de nutella com pedaços de avelã torradas.',
            image: 'caramelo.png',
            special: true, // <-- TAG 'Especial da Semana' VAI APARECER
            category: 'cookies',
            inStock: true
        },

        // --- CATEGORIA NATAL ---
        {
            id: 'natal-lata-cookies',
            name: 'Lata de Cookies',
            price: 70.00,
            description: 'Lata com 8 mini cookies dos nossos sabores tradicionais.',
            image: 'lata-cookies.png',
            special: false,
            category: 'natal',
            inStock: true
        },
        {
            id: 'natal-lata-suspiro',
            name: 'Lata de Suspiro',
            price: 50.00,
            description: 'Lata com suspiros modelados sabor panetone.',
            image: 'lata-suspiro.png',
            special: false,
            category: 'natal',
            inStock: true
        },
        {
            id: 'natal-pote-cookies',
            name: 'Pote de Cookies',
            price: 35.00,
            description: 'Pote de cookie bites tradicionais.',
            image: 'pote-cookies.png',
            special: false,
            category: 'natal',
            inStock: true
        },
        {
            id: 'natal-cartao-suspiro',
            name: 'Cartão de Suspiro',
            price: 12.00,
            description: 'Cartão de natal com suspiro modelado em formato de árvore sabor panetone.',
            image: 'cartao-suspiro.png',
            special: false,
            category: 'natal',
            inStock: true
        },
        {
            id: 'natal-cartao-cookie',
            name: 'Cartão de Cookie',
            price: 20.00,
            description: 'Cartão de Natal com cookie recheado - consulte sabores.',
            image: 'cartao-cookie.png',
            special: false,
            category: 'natal',
            inStock: true
        },

        // --- CATEGORIA SUSPIROS ---
        {
            id: 'suspiro-tradicional',
            name: 'Suspiro',
            price: 10.00,
            description: 'Suspiro tradicional 40g.',
            image: 'suspiro.png',
            special: false,
            category: 'suspiros',
            inStock: true
        },
        {
            id: 'suspiro-zero',
            name: 'Suspiro Zero',
            price: 10.00,
            description: 'Suspiro zero açúcar 25g.',
            image: 'suspiro-zero.png', 
            special: false,
            category: 'suspiros',
            inStock: false
        }
    ];

    // ===== CONFIGURE AQUI =====
    // Número do seu WhatsApp (com código do país, sem + ou 00)
    const WHATSAPP_NUMBER = '5541995404238'; // Mude aqui para seu número

    // ===== ESTADO DO CARRINHO =====
    let cart = [];

    // ===== SELETORES DO DOM =====
    const productGrid = document.getElementById('product-grid');
    const natalProductGrid = document.getElementById('natal-product-grid');
    const suspirosProductGrid = document.getElementById('suspiros-product-grid');
    
    // Elementos do Carrinho
    const cartModal = document.getElementById('cart-modal');
    const cartContent = document.getElementById('cart-content');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Elementos do Checkout
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutContent = document.getElementById('checkout-content');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const cancelCheckoutBtn = document.getElementById('cancel-checkout-btn');
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    
    // Elementos do Formulário de Entrega
    const deliveryRadio = document.getElementById('delivery-delivery');
    const pickupRadio = document.getElementById('delivery-pickup');
    const deliveryAddressGroup = document.getElementById('delivery-address-group');
    const deliveryAddressInput = document.getElementById('address');
    const deliveryMessage = document.getElementById('delivery-message');
    const pickupMessage = document.getElementById('pickup-message');
    
    // Elementos do Modal de Sucesso
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    // ===== FUNÇÕES PRINCIPAIS =====
    
    /**
     * Cria o HTML para um card de produto (reutilizável)
     */
    function createProductCard(product) {
        const isSpecial = product.special;
        const inStock = product.inStock;
        
        // Define cores
        let bgColor = ''; // Fundo transparente por padrão
        let textColor = 'text-bolli-special-bg'; // Cor padrão do título
        let descColor = 'text-bolli-desc';     // Cor padrão da descrição
        let priceColor = 'text-bolli-purple-light'; // Cor padrão do preço

        // --- LÓGICA DE NATAL (MUDANÇA AQUI) ---
        if (product.category === 'natal') {
            bgColor = 'bg-bolli-bg'; // <-- FUNDO BRANCO/BEGE DO SITE
            textColor = 'text-bolli-christmas-red'; // <-- TEXTO VERMELHO
            descColor = 'text-bolli-desc';        // <-- Descrição cinza normal
            priceColor = 'text-bolli-christmas-red'; // <-- PREÇO VERMELHO
        }
        
        // --- LÓGICA DE CONTROLE (Estoque/Esgotado) ---
        let controlBlock = '';
        if (inStock) {
            // Produto em estoque: mostra botões
            controlBlock = `
                <span class="text-2xl font-bold ${priceColor}">
                    ${formatCurrency(product.price)}
                </span>
                
                <div class="flex items-center space-x-3 bg-bolli-control-bg rounded-lg p-2">
                    <button 
                        class="decrease-qty-btn text-bolli-control-icon font-bold text-lg w-6 h-6 flex items-center justify-center rounded hover:bg-gray-300" 
                        data-id="${product.id}"
                        aria-label="Diminuir quantidade de ${product.name}"
                    >
                        &minus;
                    </button>
                    <span 
                        id="quantity-${product.id}" 
                        class="font-bold text-lg text-bolli-control-icon w-6 text-center"
                    >
                        0
                    </span>
                    <button 
                        class="increase-qty-btn text-bolli-control-icon font-bold text-lg w-6 h-6 flex items-center justify-center rounded hover:bg-gray-300" 
                        data-id="${product.id}"
                        aria-label="Aumentar quantidade de ${product.name}"
                    >
                        &plus;
                    </button>
                </div>
                
                <button 
                    class="add-qty-to-cart-btn bg-bolli-control-bg text-bolli-control-icon rounded-lg p-3 hover:bg-gray-300 transition-colors"
                    data-id="${product.id}"
                    aria-label="Adicionar ${product.name} ao carrinho"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </button>
            `;
        } else {
            // Produto esgotado: mostra aviso
            // (Verifica se a cor do preço era 'text-white' e aplica 'text-gray-300', senão usa 'text-gray-400')
            const priceLineThrough = (priceColor === 'text-white' || priceColor === 'text-bolli-christmas-red') ? 'text-gray-400' : 'text-gray-400';
            
            controlBlock = `
                <span class="text-2xl font-bold ${priceLineThrough} line-through">
                    ${formatCurrency(product.price)}
                </span>
                <div class="col-span-2 text-center text-red-600 font-bold bg-gray-200 px-4 py-2 rounded-lg text-sm">
                    Esgotado
                </div>
            `;
        }
        
        // --- HTML FINAL DO CARD ---
        // (Adicionado 'rounded-lg' e 'overflow-hidden' ao card de Natal para a moldura)
        const cardClasses = product.category === 'natal' ? `${bgColor} rounded-lg overflow-hidden shadow-lg` : bgColor;
        
        return `
            <div class="w-full max-w-xs ${cardClasses}">
                <div class="p-5 text-center">
                    
                    <h3 class="text-3xl font-sans ${textColor} mb-4">${product.name}</h3>
                    
                    <!-- IMAGEM (com container relativo) -->
                    <div class="relative w-full mb-4">
                        <img 
                            src="${product.image}" 
                            alt="${product.name}" 
                            class="w-full aspect-square object-cover rounded-lg ${!inStock ? 'opacity-60 grayscale' : ''}"
                        >
                        
                        <!-- TAG ESPECIAL (MOVIDA PARA CIMA DA IMAGEM) -->
                        ${isSpecial ? `
                        <div class="absolute top-2 left-2 bg-bolli-special-bg text-white text-xs font-sans px-3 py-1 rounded-full z-10 shadow-lg">
                            Especial da Semana
                        </div>` : ''}
                    </div>

                    <p class="text-sm ${descColor} mb-5 h-16">${product.description}</p>
                    
                    <div class="flex justify-around items-center">
                        <!-- Bloco de Controle (com ou sem estoque) -->
                        ${controlBlock}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza os produtos filtrados em um grid específico
     */
    function renderProductsByCategory(category, gridElement) {
        if (!gridElement) {
            console.error(`Elemento do grid para a categoria '${category}' não foi encontrado.`);
            return;
        }
        
        gridElement.innerHTML = ''; // Limpa o grid
        
        // Filtra produtos pela categoria
        products.filter(p => p.category === category).forEach(product => {
            gridElement.innerHTML += createProductCard(product);
        });
    }


    /**
     * Adiciona uma quantidade específica de um item ao carrinho
     */
    function addToCartWithQuantity(productId, quantity) {
        const product = products.find(p => p.id === productId);
        // Não adiciona se o produto não for encontrado, a quantidade for 0, ou se estiver sem estoque
        if (!product || quantity <= 0 || !product.inStock) return;

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity; // Soma a quantidade
        } else {
            cart.push({ ...product, quantity: quantity }); // Adiciona novo com a quantidade
        }

        renderCart();
        openCartModal();
    }

    /**
     * Renderiza os itens no modal do carrinho
     */
    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = ''; // Limpa os itens

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p id="cart-empty-msg" class="text-center text-bolli-text-light mt-10">Seu carrinho está vazio.</p>';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            cart.forEach(item => {
                const cartItem = `
                    <div class="flex items-center space-x-4 border-b pb-4">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover">
                        <div class="flex-1">
                            <h4 class="font-bold text-bolli-text-dark">${item.name}</h4>
                            <p class="text-sm text-bolli-purple-light font-medium">${formatCurrency(item.price)}</p>
                            
                            <!-- Controles de Quantidade -->
                            <div class="flex items-center space-x-2 mt-2">
                                <button class="quantity-btn bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-lg hover:bg-gray-300" data-id="${item.id}" data-action="decrease">
                                    &minus;
                                </button>
                                <span class="font-medium w-6 text-center">${item.quantity}</span>
                                <button class="quantity-btn bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-lg hover:bg-gray-300" data-id="${item.id}" data-action="increase">
                                    &plus;
                                </button>
                            </div>
                        </div>
                        <button class="remove-item-btn text-red-500 hover:text-red-700" data-id="${item.id}" aria-label="Remover ${item.name}">
                            <!-- Ícone Lixeira -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItem;
            });
            if (checkoutBtn) checkoutBtn.disabled = false;
        }
        
        updateCartTotal();
        updateCartCountBadge();
    }

    /**
     * Atualiza o subtotal do carrinho
     */
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalEl) cartTotalEl.textContent = formatCurrency(total);
    }

    /**
     * Atualiza o badge de contagem no ícone do carrinho
     */
    function updateCartCountBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCountBadge) {
            if (totalItems > 0) {
                cartCountBadge.textContent = totalItems;
                cartCountBadge.classList.remove('hidden');
            } else {
                cartCountBadge.classList.add('hidden');
            }
        }
    }

    /**
     * Altera a quantidade de um item no carrinho
     */
    function updateQuantity(productId, action) {
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease') {
            item.quantity--;
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return; // Sai da função pois renderCart() já foi chamado
            }
        }
        renderCart();
    }

    /**
     * Remove um item do carrinho
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    /**
     * Limpa o array do carrinho, atualiza a UI, e reseta os contadores dos cards
     */
    function clearCartAndResetQuantities() {
        // Limpa o array
        cart = [];
        
        // Atualiza a UI do carrinho (mostra "carrinho vazio")
        renderCart(); 
        
        // Reseta os contadores de todos os produtos (cookies e natal)
        products.forEach(product => {
            // Só reseta o contador se o produto tiver um (se estiver em estoque)
            const qtySpan = document.getElementById(`quantity-${product.id}`);
            if (qtySpan) {
                qtySpan.textContent = '0';
            }
        });
    }
    
    /**
     * Lida com cliques no grid de produtos (delegação de evento)
     */
    function handleProductGridClick(event) {
        // A lógica de clique só funciona se os botões existirem (ou seja, se inStock for true)
        const increaseBtn = event.target.closest('.increase-qty-btn');
        const decreaseBtn = event.target.closest('.decrease-qty-btn');
        const addBtn = event.target.closest('.add-qty-to-cart-btn');

        // Aumenta a quantidade no card
        if (increaseBtn) {
            const id = increaseBtn.dataset.id;
            const qtySpan = document.getElementById(`quantity-${id}`);
            if (qtySpan) {
                let currentQty = parseInt(qtySpan.textContent);
                qtySpan.textContent = currentQty + 1;
            }
        }

        // Diminui a quantidade no card
        if (decreaseBtn) {
            const id = decreaseBtn.dataset.id;
            const qtySpan = document.getElementById(`quantity-${id}`);
            if (qtySpan) {
                let currentQty = parseInt(qtySpan.textContent);
                if (currentQty > 0) {
                    qtySpan.textContent = currentQty - 1;
                }
            }
        }

        // Adiciona a quantidade selecionada ao carrinho
        if (addBtn) {
            const id = addBtn.dataset.id;
            const qtySpan = document.getElementById(`quantity-${id}`);
            if (qtySpan) {
                const quantity = parseInt(qtySpan.textContent);
                if (quantity > 0) {
                    addToCartWithQuantity(id, quantity);
                    qtySpan.textContent = '0'; // Reseta o contador no card
                }
            }
        }
    }

    /**
     * Lida com cliques nos itens do carrinho (delegação de evento)
     */
    function handleCartItemsClick(event) {
        if (!cartItemsContainer) return;
        const quantityBtn = event.target.closest('.quantity-btn');
        const removeBtn = event.target.closest('.remove-item-btn');

        if (quantityBtn) {
            const id = quantityBtn.dataset.id;
            const action = quantityBtn.dataset.action;
            updateQuantity(id, action);
        }

        if (removeBtn) {
            const id = removeBtn.dataset.id;
            removeFromCart(id);
        }
    }
    
    /**
     * Lida com o clique de Envio para o WhatsApp
     */
    function handleWhatsAppClick() {
        // 1. Valida o formulário
        if (!checkoutForm || !checkoutForm.reportValidity()) {
            return; // Interrompe se o formulário for inválido
        }
        
        // 2. Pega os dados do formulário
        const formData = new FormData(checkoutForm);
        const customerData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            deliveryMethod: formData.get('deliveryMethod'),
            address: formData.get('address') || 'N/A', // Pega o endereço ou 'N/A'
        };
        
        // 3. Gera a mensagem
        const message = generateWhatsAppMessage(customerData);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        
        // 4. Abre o WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // 5. Limpa o carrinho, reseta o form, e mostra sucesso
        clearCartAndResetQuantities();
        checkoutForm.reset();
        toggleDeliveryOptions(); // Reseta os campos de entrega/retirada
        closeCheckoutModal();
        openSuccessModal();
    }

    /**
     * Gera a mensagem formatada para o WhatsApp
     */
    function generateWhatsAppMessage(customer) {
        let message = `*Olá, Bolli! Gostaria de fazer um pedido:*\n\n`;
        
        message += '*--- MEU PEDIDO ---*\n';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            message += `*${item.quantity}x* ${item.name} - ${formatCurrency(itemTotal)}\n`;
            total += itemTotal;
        });
        
        message += `\n*SUBTOTAL: ${formatCurrency(total)}*\n`;
        // Você pode adicionar taxa de entrega aqui se desejar
        message += `*TOTAL: ${formatCurrency(total)}*\n\n`;
        
        message += '*--- MEUS DADOS ---*\n';
        message += `*Nome:* ${customer.name}\n`;
        message += `*WhatsApp:* ${customer.phone}\n\n`;
        
        message += '*--- TIPO DE ENTREGA ---*\n';
        if (customer.deliveryMethod === 'Retirada') {
            message += `*Método:* Retirada\n`;
            message += `_(Combinar dia e horário via WhatsApp)_\n`;
        } else {
            message += `*Método:* Entrega\n`;
            message += `*Endereço:* ${customer.address}\n`;
            message += `_(Valor da entrega a ser calculado)_\n`;
        }
        
        message += '\nAguardo a confirmação do pedido!';
        
        return message;
    }

    /**
     * Controla a exibição dos campos de Entrega/Retirada
     */
    function toggleDeliveryOptions() {
        if (!deliveryRadio || !pickupRadio) return; // Se os elementos não existirem, não faz nada
        
        if (deliveryRadio.checked) {
            deliveryAddressGroup.classList.remove('hidden');
            deliveryMessage.classList.remove('hidden');
            pickupMessage.classList.add('hidden');
            deliveryAddressInput.required = true;
        } else if (pickupRadio.checked) {
            deliveryAddressGroup.classList.add('hidden');
            deliveryMessage.classList.add('hidden');
            pickupMessage.classList.remove('hidden');
            deliveryAddressInput.required = false;
        } else {
            // Estado inicial (nada selecionado)
            deliveryAddressGroup.classList.add('hidden');
            deliveryMessage.classList.add('hidden');
            pickupMessage.classList.add('hidden');
            deliveryAddressInput.required = false;
        }
    }


    // ===== FUNÇÕES DE CONTROLE DOS MODAIS =====
    
    function openCartModal() {
        if (!cartModal || !cartContent) return;
        cartModal.classList.remove('hidden');
        setTimeout(() => cartContent.classList.remove('translate-x-full'), 10);
    }
    
    function closeCartModal() {
        if (!cartModal || !cartContent) return;
        cartContent.classList.add('translate-x-full');
        setTimeout(() => cartModal.classList.add('hidden'), 300);
    }
    
    function openCheckoutModal() {
        if (cart.length === 0 || !checkoutModal || !checkoutContent) return;
        closeCartModal();
        checkoutModal.classList.remove('hidden');
        setTimeout(() => checkoutContent.classList.remove('scale-95', 'opacity-0'), 10);
    }
    
    function closeCheckoutModal() {
        if (!checkoutModal || !checkoutContent) return;
        checkoutContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => checkoutModal.classList.add('hidden'), 300);
    }
    
    function openSuccessModal() {
        if (!successModal) return;
        successModal.classList.remove('hidden');
        const content = successModal.querySelector('div');
        if (content) setTimeout(() => content.classList.remove('scale-95', 'opacity-0'), 10);
    }
    
    function closeSuccessModal() {
        if (!successModal) return;
        const content = successModal.querySelector('div');
        if (content) content.classList.add('scale-95', 'opacity-0');
        setTimeout(() => successModal.classList.add('hidden'), 300);
    }

    // ===== FUNÇÕES UTILITÁRIAS =====
    
    /**
     * Formata um número para o padrão BRL (R$ 0,00)
     */
    function formatCurrency(value) {
        if (typeof value !== 'number') {
            value = 0;
        }
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // ===== ADIÇÃO DE EVENT LISTENERS =====
    
    // Renderização inicial
    renderProductsByCategory('cookies', productGrid);
    renderProductsByCategory('natal', natalProductGrid);
    renderProductsByCategory('suspiros', suspirosProductGrid);
    renderCart(); // Para mostrar "carrinho vazio" inicialmente

    // Abrir Carrinho
    if(openCartBtn) openCartBtn.addEventListener('click', openCartModal);
    
    // Fechar Carrinho
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCartModal);
    if(cartModal) cartModal.addEventListener('click', (event) => {
        if (event.target === cartModal) closeCartModal();
    });
    
    // Abrir Checkout
    if(checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);
    
    // Fechar Checkout
    if(closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    if(cancelCheckoutBtn) cancelCheckoutBtn.addEventListener('click', closeCheckoutModal);
    if(checkoutModal) checkoutModal.addEventListener('click', (event) => {
        if (event.target === checkoutModal) closeCheckoutModal();
    });

    // Fechar Sucesso
    if(closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccessModal);

    // Ações de clique nos grids de produto (escutando em todos os grids)
    const allGrids = [productGrid, natalProductGrid, suspirosProductGrid];
    allGrids.forEach(grid => {
        if(grid) grid.addEventListener('click', handleProductGridClick);
    });
    
    // Ações de clique nos itens do carrinho
    if(cartItemsContainer) cartItemsContainer.addEventListener('click', handleCartItemsClick);
    
    // Envio do Pedido (clique no botão, não submit)
    if(sendWhatsappBtn) sendWhatsappBtn.addEventListener('click', handleWhatsAppClick);

    // Lógica dos botões de Entrega/Retirada
    if(deliveryRadio) deliveryRadio.addEventListener('change', toggleDeliveryOptions);
    if(pickupRadio) pickupRadio.addEventListener('change', toggleDeliveryOptions);

});
