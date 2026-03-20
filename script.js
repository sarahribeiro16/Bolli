document.addEventListener('DOMContentLoaded', () => {
            
    // ===== DADOS DOS PRODUTOS =====
    const products = [
        // --- CATEGORIA COOKIES ---
        {
            id: 'ferrero',
            name: 'Ferrero',
            price: 17.00,
            description: 'Gotas de chocolate ao leite, recheio de nutella com pedaços de avelã torradas.',
            image: 'ferrero.jpg', 
            special: false,
            category: 'cookies',
            inStock: true
        },
        {
            id: 'kinder',
            name: 'Kinder',
            price: 17.00,
            description: 'Gotas de chocolate ao branco e ao leite, recheio de Kinder Bueno White.',
            image: 'kinder.jpg', 
            special: false,
            category: 'cookies',
            inStock: true
        },
        {
            id: 'black',
            name: 'Black',
            price: 17.00,
            description: 'Massa com cacau black, gotas de chocolate branco e recheio de brigadeiro de Ninho.',
            image: 'black.jpg',
            special: false,
            category: 'cookies',
            inStock: true
        },
        {
            id: 'pistache',
            name: 'Pistache',
            price: 17.00,
            description: 'Gotas de chocolate branco, recheio com pedaços de pistache.',
            image: 'pistache.jpg',
            special: false,
            category: 'cookies',
            inStock: true
        },

        // --- CATEGORIA PÁSCOA (Substituindo Natal) ---
        {
            id: 'Cenourinha de suspiro',
            name: 'Cenourinha de suspiro',
            price: 10.00,
            description: 'Cenourinha de suspiro com recheio de chocolate.',
            image: 'cenourinha',
            special: false,
            category: 'pascoa',
            inStock: true
        },
        { id: 'cookies',
            name: 'Mini cookies',
            price: 45.00,
            description: 'Pote de acrílico com 5 mini cookies recheados no formato de macarrons. Sabores: pistache, kinder, caramelo, ninho e ferrero.',
            image: 'pote cookies.jpg',
            special: true,
            category: 'pascoa',
            inStock: false
            
        },
        { id: 'Biscoito',
            name: 'Pote de biscoito amanteigado',
            price: 55.00,
            description: 'Pote com 170g e biscoito amanteigado de Páscoa com chocolate',
            image: 'pote amanteigado.jpg',
            special: false,
            category: 'pascoa',
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

    const WHATSAPP_NUMBER = '5541995404238'; 

    let cart = [];

    // ===== SELETORES DO DOM =====
    const productGrid = document.getElementById('product-grid');
    const pascoaProductGrid = document.getElementById('pascoa-product-grid'); // Ajustado para o novo ID
    const suspirosProductGrid = document.getElementById('suspiros-product-grid');
    // ... (restante dos seletores iguais)
    const cartModal = document.getElementById('cart-modal');
    const cartContent = document.getElementById('cart-content');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutContent = document.getElementById('checkout-content');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const cancelCheckoutBtn = document.getElementById('cancel-checkout-btn');
    const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
    const deliveryRadio = document.getElementById('delivery-delivery');
    const pickupRadio = document.getElementById('delivery-pickup');
    const deliveryAddressGroup = document.getElementById('delivery-address-group');
    const deliveryAddressInput = document.getElementById('address');
    const deliveryMessage = document.getElementById('delivery-message');
    const pickupMessage = document.getElementById('pickup-message');
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    // ===== FUNÇÕES PRINCIPAIS =====
    
    function createProductCard(product) {
        const isSpecial = product.special;
        const inStock = product.inStock;
        
        // Cores ajustadas para o roxo da Bolli
        let textColor = 'text-bolli-special-bg'; 
        let priceColor = 'text-bolli-purple-light'; 

        if (product.category === 'pascoa') {
            textColor = 'text-bolli-purple-dark';
            priceColor = 'text-bolli-purple-dark';
        }
        
        let controlBlock = '';
        if (inStock) {
            controlBlock = `
                <div class="flex justify-center items-center w-full mb-3 space-x-4 h-9"> 
                    <span class="text-2xl font-bold ${priceColor}">
                        ${formatCurrency(product.price)}
                    </span>
                    <div class="flex items-center space-x-3 bg-bolli-control-bg rounded-lg p-2">
                        <button class="decrease-qty-btn text-bolli-control-icon font-bold text-lg w-6 h-6 flex items-center justify-center rounded hover:bg-gray-300" data-id="${product.id}">
                            &minus;
                        </button>
                        <span id="quantity-${product.id}" class="font-bold text-lg text-bolli-control-icon w-6 text-center">0</span>
                        <button class="increase-qty-btn text-bolli-control-icon font-bold text-lg w-6 h-6 flex items-center justify-center rounded hover:bg-gray-300" data-id="${product.id}">
                            &plus;
                        </button>
                    </div>
                </div>
                <button class="add-qty-to-cart-btn bg-bolli-control-bg text-bolli-control-icon rounded-lg py-2 px-4 w-full font-bold text-sm hover:bg-gray-300 transition-colors h-9" data-id="${product.id}">
                    Adicionar ao Carrinho
                </button>
            `;
        } else {
            controlBlock = `
                <div class="flex justify-center items-center w-full mb-3 space-x-4 h-9">
                    <span class="text-2xl font-bold text-gray-400 line-through">${formatCurrency(product.price)}</span>
                    <div class="text-center text-red-600 font-bold bg-gray-200 px-4 py-2 rounded-lg text-sm">Esgotado</div>
                </div>
                <div class="h-9"></div>
            `;
        }
        
        return `
            <div class="w-full max-w-xs">
                <div class="p-5 text-center">
                    <h3 class="text-3xl font-sans ${textColor} mb-4">${product.name}</h3>
                    <div class="relative w-full mb-4">
                        <img src="${product.image}" alt="${product.name}" class="w-full aspect-square object-cover rounded-lg ${!inStock ? 'opacity-60 grayscale' : ''}">
                        ${isSpecial ? `<div class="absolute top-2 left-2 bg-bolli-special-bg text-white text-xs font-sans px-3 py-1 rounded-full z-10 shadow-lg">Destaque de Páscoa</div>` : ''}
                    </div>
                    <p class="text-sm text-bolli-desc mb-5 h-16">${product.description}</p>
                    ${controlBlock}
                </div>
            </div>
        `;
    }

    // --- RENDERIZAÇÃO ---
    function renderProductsByCategory(category, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        products.filter(p => p.category === category).forEach(product => {
            gridElement.innerHTML += createProductCard(product);
        });
    }

    // Inicialização dos grids
    renderProductsByCategory('cookies', productGrid);
    renderProductsByCategory('pascoa', pascoaProductGrid); // Novo Grid de Páscoa
    renderProductsByCategory('suspiros', suspirosProductGrid);

    // ... (As demais funções de carrinho, WhatsApp e Modais permanecem EXATAMENTE iguais ao seu código original)
    // Certifique-se de manter o restante do seu script original abaixo daqui para as funcionalidades de clique e checkout funcionarem!

    // Funções utilitárias (mantenha as que já existem no seu código)
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Event Listeners de clique nos grids (Adicionando o de Páscoa na lista)
    const allGrids = [productGrid, pascoaProductGrid, suspirosProductGrid];
    allGrids.forEach(grid => {
        if(grid) grid.addEventListener('click', handleProductGridClick);
    });

    // Reutilize todas as suas funções handleProductGridClick, renderCart, updateQuantity, etc.
    // (Omiti o restante para o código não ficar gigante, mas você deve manter as funções originais do seu script.js)

    // FUNÇÕES DE CARRINHO (IGUAIS AO ORIGINAL)
    function handleProductGridClick(event) {
        const increaseBtn = event.target.closest('.increase-qty-btn');
        const decreaseBtn = event.target.closest('.decrease-qty-btn');
        const addBtn = event.target.closest('.add-qty-to-cart-btn');

        if (increaseBtn) {
            const id = increaseBtn.dataset.id;
            const qtySpan = document.getElementById(`quantity-${id}`);
            if (qtySpan) qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
        }

        if (decreaseBtn) {
            const id = decreaseBtn.dataset.id;
            const qtySpan = document.getElementById(`quantity-${id}`);
            if (qtySpan && parseInt(qtySpan.textContent) > 0) qtySpan.textContent = parseInt(qtySpan.textContent) - 1;
        }

        if (addBtn) {
            const id = addBtn.dataset.id;
            const qtySpan = document.getElementById(`quantity-${id}`);
            if (qtySpan) {
                const quantity = parseInt(qtySpan.textContent);
                if (quantity > 0) {
                    addToCartWithQuantity(id, quantity);
                    qtySpan.textContent = '0';
                }
            }
        }
    }

    function addToCartWithQuantity(productId, quantity) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) existingItem.quantity += quantity;
        else cart.push({ ...product, quantity: quantity });
        renderCart();
        openCartModal();
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = cart.length === 0 ? '<p class="text-center mt-10">Carrinho vazio.</p>' : '';
        cart.forEach(item => {
            cartItemsContainer.innerHTML += `
                <div class="flex items-center justify-between border-b pb-4">
                    <div class="flex items-center gap-4">
                        <img src="${item.image}" class="w-16 h-16 rounded object-cover">
                        <div>
                            <p class="font-bold">${item.name}</p>
                            <p class="text-sm">${item.quantity}x ${formatCurrency(item.price)}</p>
                        </div>
                    </div>
                </div>`;
        });
        updateCartTotal();
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalEl) cartTotalEl.textContent = formatCurrency(total);
        if (cartCountBadge) {
            cartCountBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountBadge.classList.toggle('hidden', cart.length === 0);
        }
    }

    function openCartModal() { cartModal?.classList.remove('hidden'); cartContent?.classList.remove('translate-x-full'); }
    function closeCartModal() { cartContent?.classList.add('translate-x-full'); setTimeout(() => cartModal?.classList.add('hidden'), 300); }
    
    if(openCartBtn) openCartBtn.addEventListener('click', openCartModal);
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCartModal);

});
