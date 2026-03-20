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

        // --- CATEGORIA PÁSCOA (Seus 3 produtos) ---
        {
            id: 'cenourinha-suspiro',
            name: 'Cenourinha de suspiro',
            price: 10.00,
            description: 'Cenourinha de suspiro com recheio de chocolate.',
            image: 'cenourinha.jpg', 
            special: false,
            category: 'pascoa',
            inStock: true
        },
        { 
            id: 'mini-cookies-pascoa',
            name: 'Mini cookies',
            price: 45.00,
            description: 'Pote de acrílico com 5 mini cookies recheados no formato de macarrons. Sabores: pistache, kinder, caramelo, ninho e ferrero.',
            image: 'pote cookies.jpg',
            special: true,
            category: 'pascoa',
            inStock: false // Marcado como esgotado conforme seu pedido
        },
        { 
            id: 'biscoito-amanteigado-pote',
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

    // Seletores
    const productGrid = document.getElementById('product-grid');
    const pascoaProductGrid = document.getElementById('pascoa-product-grid');
    const suspirosProductGrid = document.getElementById('suspiros-product-grid');
    const cartModal = document.getElementById('cart-modal');
    const cartContent = document.getElementById('cart-content');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutContent = document.getElementById('checkout-content');
    const checkoutForm = document.getElementById('checkout-form');
    const deliveryRadio = document.getElementById('delivery-delivery');
    const pickupRadio = document.getElementById('delivery-pickup');
    const deliveryAddressGroup = document.getElementById('delivery-address-group');
    const successModal = document.getElementById('success-modal');

    function createProductCard(product) {
        const inStock = product.inStock;
        const priceColor = product.category === 'pascoa' ? 'text-bolli-easter-main' : 'text-bolli-purple-light';
        const textColor = product.category === 'pascoa' ? 'text-bolli-easter-main' : 'text-bolli-special-bg';
        
        let controlBlock = '';
        if (inStock) {
            controlBlock = `
                <div class="flex justify-center items-center w-full mb-3 space-x-4 h-9"> 
                    <span class="text-2xl font-bold ${priceColor}">${formatCurrency(product.price)}</span>
                    <div class="flex items-center space-x-3 bg-bolli-control-bg rounded-lg p-2">
                        <button class="decrease-qty-btn text-bolli-control-icon font-bold text-lg w-6" data-id="${product.id}">&minus;</button>
                        <span id="quantity-${product.id}" class="font-bold text-lg text-bolli-control-icon w-6 text-center">0</span>
                        <button class="increase-qty-btn text-bolli-control-icon font-bold text-lg w-6" data-id="${product.id}">&plus;</button>
                    </div>
                </div>
                <button class="add-qty-to-cart-btn bg-bolli-control-bg text-bolli-control-icon rounded-lg py-2 px-4 w-full font-bold text-sm hover:bg-gray-300 h-9" data-id="${product.id}">
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
                    <h3 class="text-2xl font-sans ${textColor} mb-4">${product.name}</h3>
                    <div class="relative w-full mb-4">
                        <img src="${product.image}" alt="${product.name}" class="w-full aspect-square object-cover rounded-lg ${!inStock ? 'opacity-60 grayscale' : ''}">
                        ${product.special ? `<div class="absolute top-2 left-2 bg-bolli-special-bg text-white text-xs px-3 py-1 rounded-full z-10 shadow-lg">Especial da Semana</div>` : ''}
                    </div>
                    <p class="text-sm text-bolli-desc mb-5 h-16">${product.description}</p>
                    ${controlBlock}
                </div>
            </div>
        `;
    }

    function renderProductsByCategory(category, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        products.filter(p => p.category === category).forEach(product => {
            gridElement.innerHTML += createProductCard(product);
        });
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
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-bolli-text-light mt-10">Carrinho vazio.</p>';
            document.getElementById('checkout-btn').disabled = true;
        } else {
            cart.forEach(item => {
                cartItemsContainer.innerHTML += `
                    <div class="flex items-center space-x-4 border-b pb-4">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
                        <div class="flex-1">
                            <h4 class="font-bold text-bolli-text-dark text-sm">${item.name}</h4>
                            <p class="text-xs text-bolli-purple-light">${formatCurrency(item.price)}</p>
                            <div class="flex items-center space-x-2 mt-1">
                                <button class="quantity-btn bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center" data-id="${item.id}" data-action="decrease">&minus;</button>
                                <span class="text-xs font-medium w-4 text-center">${item.quantity}</span>
                                <button class="quantity-btn bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center" data-id="${item.id}" data-action="increase">&plus;</button>
                            </div>
                        </div>
                        <button class="remove-item-btn text-red-500" data-id="${item.id}">X</button>
                    </div>
                `;
            });
            document.getElementById('checkout-btn').disabled = false;
        }
        updateCartTotal();
        updateCartCountBadge();
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalEl) cartTotalEl.textContent = formatCurrency(total);
    }

    function updateCartCountBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
            totalItems > 0 ? cartCountBadge.classList.remove('hidden') : cartCountBadge.classList.add('hidden');
        }
    }

    function formatCurrency(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

    function openCartModal() { cartModal.classList.remove('hidden'); setTimeout(() => cartContent.classList.remove('translate-x-full'), 10); }
    function closeCartModal() { cartContent.classList.add('translate-x-full'); setTimeout(() => cartModal.classList.add('hidden'), 300); }
    function openCheckoutModal() { closeCartModal(); checkoutModal.classList.remove('hidden'); setTimeout(() => checkoutContent.classList.remove('scale-95', 'opacity-0'), 10); }
    function closeCheckoutModal() { checkoutContent.classList.add('scale-95', 'opacity-0'); setTimeout(() => checkoutModal.classList.add('hidden'), 300); }
    function openSuccessModal() { successModal.classList.remove('hidden'); setTimeout(() => successModal.querySelector('div').classList.remove('scale-95', 'opacity-0'), 10); }
    function closeSuccessModal() { successModal.querySelector('div').classList.add('scale-95', 'opacity-0'); setTimeout(() => successModal.classList.add('hidden'), 300); }

    function toggleDeliveryOptions() {
        if (deliveryRadio.checked) {
            deliveryAddressGroup.classList.remove('hidden');
            document.getElementById('address').required = true;
        } else {
            deliveryAddressGroup.classList.add('hidden');
            document.getElementById('address').required = false;
        }
    }

    // Event Listeners
    document.getElementById('open-cart-btn').addEventListener('click', openCartModal);
    document.getElementById('close-cart-btn').addEventListener('click', closeCartModal);
    document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
    document.getElementById('close-checkout-btn').addEventListener('click', closeCheckoutModal);
    document.getElementById('cancel-checkout-btn').addEventListener('click', closeCheckoutModal);
    document.getElementById('close-success-btn').addEventListener('click', closeSuccessModal);
    deliveryRadio.addEventListener('change', toggleDeliveryOptions);
    pickupRadio.addEventListener('change', toggleDeliveryOptions);

    document.getElementById('send-whatsapp-btn').addEventListener('click', () => {
        if (!checkoutForm.reportValidity()) return;
        const formData = new FormData(checkoutForm);
        let msg = `*Pedido de Páscoa - Bolli Doces*\n\n`;
        cart.forEach(item => msg += `*${item.quantity}x* ${item.name} - ${formatCurrency(item.price * item.quantity)}\n`);
        msg += `\n*TOTAL: ${cartTotalEl.textContent}*\n\n*Cliente:* ${formData.get('name')}\n*Método:* ${formData.get('deliveryMethod')}`;
        if (formData.get('deliveryMethod') === 'Entrega') msg += `\n*Endereço:* ${formData.get('address')}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        cart = []; renderCart(); closeCheckoutModal(); openSuccessModal();
    });

    [productGrid, pascoaProductGrid, suspirosProductGrid].forEach(grid => {
        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const id = btn.dataset.id;
            const span = document.getElementById(`quantity-${id}`);
            if (btn.classList.contains('increase-qty-btn')) span.textContent = parseInt(span.textContent) + 1;
            if (btn.classList.contains('decrease-qty-btn') && parseInt(span.textContent) > 0) span.textContent = parseInt(span.textContent) - 1;
            if (btn.classList.contains('add-qty-to-cart-btn') && parseInt(span.textContent) > 0) {
                addToCartWithQuantity(id, parseInt(span.textContent));
                span.textContent = '0';
            }
        });
    });

    cartItemsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.dataset.id;
        const item = cart.find(i => i.id === id);
        if (btn.classList.contains('quantity-btn')) {
            if (btn.dataset.action === 'increase') item.quantity++;
            else item.quantity--;
            if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
        } else if (btn.classList.contains('remove-item-btn')) {
            cart = cart.filter(i => i.id !== id);
        }
        renderCart();
    });

    document.querySelectorAll('.smooth-scroll').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });

    renderProductsByCategory('cookies', productGrid);
    renderProductsByCategory('pascoa', pascoaProductGrid);
    renderProductsByCategory('suspiros', suspirosProductGrid);
});
