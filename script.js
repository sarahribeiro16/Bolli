document.addEventListener('DOMContentLoaded', () => {

    // TODO (Sarah): revisar ingredientes, alergênicos e nível de doçura de cada
    // produto abaixo — são valores de exemplo pra eu poder montar a interface.
    // Não publique o site sem confirmar essas informações, principalmente os
    // alergênicos (é dado sensível pra quem tem restrição alimentar).

    // ===== DADOS DOS PRODUTOS =====
    const products = [
        // --- CATEGORIA: COOKIES RECHEADOS ---
        {
            id: 'ferrero',
            name: 'Ferrero',
            price: 17.00,
            description: 'Gotas de chocolate ao leite, recheio de nutella com pedaços de avelã torradas.',
            ingredients: 'Farinha de trigo, manteiga, açúcar, ovos, gotas de chocolate ao leite, creme de avelã e avelãs torradas.',
            sweetness: 4,
            allergens: ['Glúten', 'Leite', 'Ovo', 'Nozes'],
            image: 'ferrero.jpg',
            special: false,
            category: 'cookies-recheados',
            inStock: true
        },
        {
            id: 'kinder',
            name: 'Kinder',
            price: 17.00,
            description: 'Gotas de chocolate ao branco e ao leite, recheio de Kinder Bueno White.',
            ingredients: 'Farinha de trigo, manteiga, açúcar, ovos, gotas de chocolate branco e ao leite, recheio cremoso de Kinder Bueno White.',
            sweetness: 5,
            allergens: ['Glúten', 'Leite', 'Ovo', 'Soja'],
            image: 'kinder.jpg',
            special: false,
            category: 'cookies-recheados',
            inStock: true
        },
        {
            id: 'black',
            name: 'Black',
            price: 17.00,
            description: 'Massa com cacau black, gotas de chocolate branco e recheio de brigadeiro de Ninho.',
            ingredients: 'Farinha de trigo, manteiga, açúcar, ovos, cacau em pó, gotas de chocolate branco, brigadeiro de leite Ninho.',
            sweetness: 4,
            allergens: ['Glúten', 'Leite', 'Ovo'],
            image: 'black.jpg',
            special: false,
            category: 'cookies-recheados',
            inStock: true
        },
        {
            id: 'pistache',
            name: 'Pistache',
            price: 17.00,
            description: 'Gotas de chocolate branco, recheio com pedaços de pistache.',
            ingredients: 'Farinha de trigo, manteiga, açúcar, ovos, gotas de chocolate branco, pedaços de pistache.',
            sweetness: 3,
            allergens: ['Glúten', 'Leite', 'Ovo', 'Nozes'],
            image: 'pistache.jpg',
            special: false,
            category: 'cookies-recheados',
            inStock: true
        },

        // --- CATEGORIA: COOKIES TRADICIONAIS ---
        // TODO (Sarah): confirmar nomes dos arquivos de imagem (assumi
        // 'triplo-chocolate.jpg' e 'belga-chips.jpg') e revisar descrição/ingredientes/alergênicos.
        {
            id: 'triplo-chocolate',
            name: 'Triplo Chocolate',
            price: 17.00,
            description: 'Massa amanteigada com três tipos de chocolate: ao leite, meio amargo e branco.',
            ingredients: 'Farinha de trigo, manteiga, açúcar, ovos, gotas de chocolate ao leite, meio amargo e branco.',
            sweetness: 4,
            allergens: ['Glúten', 'Leite', 'Ovo'],
            image: 'triplo-chocolate.jpg',
            special: false,
            category: 'cookies-tradicionais',
            inStock: true
        },
        {
            id: 'belga-chips',
            name: 'Belga Chips',
            price: 17.00,
            description: 'Massa amanteigada tradicional com gotas de chocolate belga.',
            ingredients: 'Farinha de trigo, manteiga, açúcar, ovos, gotas de chocolate belga.',
            sweetness: 4,
            allergens: ['Glúten', 'Leite', 'Ovo'],
            image: 'belga-chips.jpg',
            special: false,
            category: 'cookies-tradicionais',
            inStock: true
        },

        // --- CATEGORIA: SUSPIROS ---
        {
            id: 'suspiro-tradicional',
            name: 'Suspiro',
            price: 10.00,
            description: 'Suspiro tradicional 40g.',
            ingredients: 'Claras de ovo e açúcar.',
            sweetness: 5,
            allergens: ['Ovo'],
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
            ingredients: 'Claras de ovo e adoçante.',
            sweetness: 3,
            allergens: ['Ovo'],
            image: 'suspiro-zero.png',
            special: false,
            category: 'suspiros',
            inStock: false
        }

        // ===== PRODUTOS DE PÁSCOA (removidos temporariamente — descomente pra reativar) =====
        // {
        //     id: 'cenourinha-suspiro',
        //     name: 'Cenourinha de suspiro',
        //     price: 10.00,
        //     description: 'Cenourinha de suspiro com recheio de chocolate.',
        //     image: 'cenourinha.jpg',
        //     special: false,
        //     category: 'pascoa',
        //     inStock: false
        // },
        // {
        //     id: 'mini-cookies-pascoa',
        //     name: 'Mini cookies',
        //     price: 45.00,
        //     description: 'Pote de acrílico com 5 mini cookies recheados, nos sabores tradicionais da Bolli.',
        //     image: 'pote cookies.jpg',
        //     special: true,
        //     category: 'pascoa',
        //     inStock: false
        // },
        // {
        //     id: 'biscoito-amanteigado-pote',
        //     name: 'Biscoito amanteigado',
        //     price: 55.00,
        //     description: 'Pote pet com 170g e biscoito amanteigado de Páscoa com chocolate',
        //     image: 'pote amanteigado.jpg',
        //     special: false,
        //     category: 'pascoa',
        //     inStock: false
        // }
    ];

    const WHATSAPP_NUMBER = '5541995404238';
    const PICKUP_ADDRESS = 'Rua Irmã Schreiner Maran, 503 - Santa Cândida, Curitiba/PR';

    // Cidades onde a Bolli entrega. TODO (Sarah): ajustar se quiser incluir/remover cidades.
    const ALLOWED_DELIVERY_CITIES = ['Curitiba', 'Colombo', 'Pinhais', 'Almirante Tamandaré'];

    // Faixas de frete por distância (raio a partir do endereço da loja).
    // TODO (Sarah): são valores de exemplo — ajuste os preços de cada faixa (em R$) e o raio
    // máximo de entrega (o último item da lista) conforme sua realidade.
    const FREIGHT_TIERS = [
        { maxKm: 3, price: 5 },
        { maxKm: 6, price: 8 },
        { maxKm: 10, price: 12 },
        { maxKm: 18, price: 18 }
    ];

    let cart = [];
    let openCardId = null; // controla o accordion: só um card expandido por vez
    let shopCoords = null; // cache das coordenadas da loja (geocodificada uma vez só)
    let deliveryAllowed = false; // se o CEP informado está dentro da área/raio atendido
    let currentFreight = 0; // valor do frete calculado pro CEP atual

    // Seletores
    const productGridTradicionais = document.getElementById('product-grid-tradicionais');
    const productGridRecheados = document.getElementById('product-grid-recheados');
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
    const pickupGroup = document.getElementById('pickup-group');
    const cepInput = document.getElementById('cep');
    const addressInput = document.getElementById('address');
    const pickupWhenInput = document.getElementById('pickup-when');
    const cepFeedbackEl = document.getElementById('cep-feedback');
    const freightInfoEl = document.getElementById('freight-info');
    const checkoutTotalLine = document.getElementById('checkout-total-line');
    const successModal = document.getElementById('success-modal');

    // ===== HELPERS DE RENDERIZAÇÃO =====
    function renderSweetnessDots(level) {
        let dots = '';
        for (let i = 1; i <= 5; i++) {
            dots += `<span class="inline-block w-2.5 h-2.5 rounded-full mr-1 ${i <= level ? 'bg-bolli-purple-light' : 'bg-bolli-control-bg'}"></span>`;
        }
        return dots;
    }

    function renderAllergens(list) {
        if (!list || list.length === 0) {
            return '<span class="text-xs text-bolli-text-light">Nenhum alergênico informado</span>';
        }
        return list.map(a => `<span class="inline-block text-xs bg-bolli-control-bg text-bolli-control-icon px-2 py-1 rounded-full mr-1 mb-1">${a}</span>`).join('');
    }

    function createProductCard(product) {
        const inStock = product.inStock;
        const priceColor = 'text-bolli-purple-light';
        const textColor = 'text-bolli-special-bg';

        const quickAddBtn = inStock ? `
            <button class="quick-add-btn absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 bg-white text-bolli-purple-dark rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shadow-md hover:bg-bolli-purple-light hover:text-white transition-colors" data-id="${product.id}" aria-label="Adicionar 1 ${product.name} ao carrinho" title="Adicionar ao carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
        ` : '';

        const expandedControls = inStock ? `
            <div class="flex items-stretch space-x-4 mt-4">
                <div class="flex items-center justify-center space-x-3 bg-bolli-control-bg rounded-lg h-11 px-2">
                    <button class="decrease-qty-btn text-bolli-control-icon font-bold text-lg w-6" data-id="${product.id}">&minus;</button>
                    <span id="quantity-${product.id}" class="font-bold text-lg text-bolli-control-icon w-6 text-center">0</span>
                    <button class="increase-qty-btn text-bolli-control-icon font-bold text-lg w-6" data-id="${product.id}">&plus;</button>
                </div>
                <button class="add-qty-to-cart-btn flex items-center justify-center bg-bolli-purple-light text-white rounded-lg h-11 px-4 font-bold text-sm hover:bg-bolli-purple-dark transition-colors" data-id="${product.id}">
                    Adicionar ao Carrinho
                </button>
            </div>
        ` : `<p class="inline-block text-red-600 font-bold bg-gray-100 py-2 px-4 rounded-lg mt-4">Esgotado</p>`;

        // Cabeçalho (sempre visível, ocupa 1 célula da grade)
        const headerHtml = `
            <div class="product-card w-full sm:max-w-xs mx-auto sm:p-5" data-id="${product.id}">
                <div class="card-header flex sm:flex-col items-center sm:items-stretch gap-4 sm:gap-0 px-1 sm:px-0 py-3 sm:py-0 cursor-pointer" data-id="${product.id}" role="button" tabindex="0">
                    <div class="relative w-20 h-20 sm:w-full sm:aspect-square flex-shrink-0 overflow-hidden rounded-lg sm:mb-4">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover ${!inStock ? 'opacity-60 grayscale' : ''}">
                        ${product.special ? `<div class="absolute top-1 left-1 sm:top-2 sm:left-2 bg-bolli-special-bg text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full z-10 shadow">Especial</div>` : ''}
                        ${quickAddBtn}
                    </div>
                    <div class="flex-1 sm:text-center min-w-0">
                        <h3 class="text-base sm:text-2xl font-sans ${textColor} truncate sm:whitespace-normal">${product.name}</h3>
                        <div class="flex items-center gap-2 sm:justify-center mt-1 flex-wrap">
                            <span class="font-bold ${inStock ? priceColor : 'text-gray-400 line-through'}">${formatCurrency(product.price)}</span>
                            ${!inStock ? '<span class="text-[10px] sm:text-xs font-bold text-red-600 bg-gray-200 px-2 py-0.5 rounded-full">Esgotado</span>' : ''}
                        </div>
                    </div>
                    <svg class="chevron-icon sm:hidden w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            </div>
        `;

        // Detalhes (escondido por padrão). É um irmão do header direto na grade,
        // com "col-span-full" — por isso, ao abrir, ele ocupa a largura toda da
        // grade (todas as colunas) em vez de ficar preso na coluna do card.
        const detailsHtml = `
            <div class="card-details col-span-full w-full hidden mt-3 bg-white shadow-md p-4 sm:p-6 text-left" data-id="${product.id}">
                <div class="sm:flex sm:gap-6">
                    <img src="${product.image}" alt="${product.name}" class="w-full sm:w-2/5 aspect-square object-cover flex-shrink-0 mb-4 sm:mb-0 ${!inStock ? 'opacity-60 grayscale' : ''}">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-2xl font-sans ${textColor} mb-1">${product.name}</h3>
                        <p class="text-sm text-bolli-desc italic mb-3">${product.description}</p>
                        <span class="font-bold ${inStock ? priceColor : 'text-gray-400 line-through'} text-lg block mb-3">${formatCurrency(product.price)}</span>
                        ${product.ingredients ? `<p class="text-xs text-bolli-text-light mb-3"><span class="font-bold text-bolli-text-dark">Ingredientes:</span> ${product.ingredients}</p>` : ''}
                        <div class="mb-3">
                            <span class="text-xs font-bold text-bolli-text-dark block mb-1">Nível de doçura</span>
                            <div class="flex items-center">${renderSweetnessDots(product.sweetness || 0)}</div>
                        </div>
                        <div class="mb-1">
                            <span class="text-xs font-bold text-bolli-text-dark block mb-1">Alergênicos</span>
                            <div class="flex flex-wrap">${renderAllergens(product.allergens)}</div>
                        </div>
                        ${expandedControls}
                    </div>
                </div>
            </div>
        `;

        return headerHtml + detailsHtml;
    }

    function renderProductsByCategory(category, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        const items = products.filter(p => p.category === category);
        if (items.length === 0) {
            gridElement.innerHTML = '<p class="col-span-full text-center text-bolli-text-light py-8">Novidades chegando em breve!</p>';
            return;
        }
        items.forEach(product => {
            gridElement.innerHTML += createProductCard(product);
        });
    }

    // ===== ACCORDION DOS CARDS =====
    function closeCard(id) {
        const header = document.querySelector(`.product-card[data-id="${id}"]`);
        const details = document.querySelector(`.card-details[data-id="${id}"]`);
        if (header) header.classList.remove('is-open');
        if (details) details.classList.add('hidden');
    }

    function openCard(id) {
        if (openCardId && openCardId !== id) closeCard(openCardId);
        const header = document.querySelector(`.product-card[data-id="${id}"]`);
        const details = document.querySelector(`.card-details[data-id="${id}"]`);
        if (header) header.classList.add('is-open');
        if (details) details.classList.remove('hidden');
        openCardId = id;
    }

    function toggleCard(id) {
        if (openCardId === id) {
            closeCard(id);
            openCardId = null;
        } else {
            openCard(id);
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

    function formatCurrency(v) { return 'R$' + Math.round(v).toLocaleString('pt-BR'); }

    // ===== FRETE POR CEP (ViaCEP + distância via OpenStreetMap/Nominatim) =====
    function haversineDistanceKm(lat1, lon1, lat2, lon2) {
        const toRad = (deg) => (deg * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    async function geocodeAddress(query) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`;
            const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
            const data = await res.json();
            if (!data || data.length === 0) return null;
            return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
        } catch (err) {
            return null;
        }
    }

    async function getShopCoords() {
        if (shopCoords) return shopCoords;
        shopCoords = await geocodeAddress(PICKUP_ADDRESS);
        return shopCoords;
    }

    function freightForDistance(km) {
        for (const tier of FREIGHT_TIERS) {
            if (km <= tier.maxKm) return tier.price;
        }
        return null; // fora do raio máximo de entrega
    }

    function updateCheckoutTotal() {
        if (!checkoutTotalLine) return;
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const method = document.querySelector('input[name="deliveryMethod"]:checked')?.value;
        let total = subtotal;
        let line = `Subtotal: ${formatCurrency(subtotal)}`;
        if (method === 'Entrega') {
            total += currentFreight;
            line += ` + Frete: ${currentFreight > 0 ? formatCurrency(currentFreight) : 'a combinar'}`;
        }
        line += ` = Total: ${formatCurrency(total)}`;
        checkoutTotalLine.textContent = line;
    }

    async function handleCepBlur() {
        if (!cepInput) return;
        const cep = cepInput.value.replace(/\D/g, '');
        deliveryAllowed = false;
        currentFreight = 0;
        if (freightInfoEl) freightInfoEl.textContent = '';
        updateCheckoutTotal();

        if (cep.length !== 8) {
            if (cepFeedbackEl) {
                cepFeedbackEl.textContent = 'Digite um CEP válido (8 dígitos).';
                cepFeedbackEl.className = 'text-xs text-red-600 mt-1';
            }
            return;
        }

        if (cepFeedbackEl) {
            cepFeedbackEl.textContent = 'Verificando CEP...';
            cepFeedbackEl.className = 'text-xs text-bolli-text-light mt-1';
        }

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            if (data.erro) {
                if (cepFeedbackEl) {
                    cepFeedbackEl.textContent = 'CEP não encontrado.';
                    cepFeedbackEl.className = 'text-xs text-red-600 mt-1';
                }
                return;
            }

            if (!ALLOWED_DELIVERY_CITIES.includes(data.localidade)) {
                if (cepFeedbackEl) {
                    cepFeedbackEl.textContent = 'Entrega não disponível nesse endereço';
                    cepFeedbackEl.className = 'text-xs font-bold text-red-600 mt-1';
                }
                return;
            }

            if (cepFeedbackEl) {
                cepFeedbackEl.textContent = `Endereço encontrado: ${data.logradouro || ''} - ${data.bairro || ''}, ${data.localidade}/${data.uf}. Calculando frete...`;
                cepFeedbackEl.className = 'text-xs text-bolli-text-light mt-1';
            }

            const [shop, customer] = await Promise.all([
                getShopCoords(),
                geocodeAddress(`${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade}, ${data.uf}, Brazil`)
            ]);

            if (!shop || !customer) {
                // Não travamos o pedido por causa de um serviço externo instável —
                // liberamos com o frete "a combinar" pra confirmar no WhatsApp.
                deliveryAllowed = true;
                currentFreight = 0;
                if (cepFeedbackEl) {
                    cepFeedbackEl.textContent = `Endereço dentro da área atendida (${data.localidade}/${data.uf}).`;
                    cepFeedbackEl.className = 'text-xs text-green-700 mt-1';
                }
                if (freightInfoEl) {
                    freightInfoEl.textContent = 'Não consegui calcular o frete automaticamente — vamos confirmar o valor pelo WhatsApp.';
                    freightInfoEl.className = 'text-xs text-bolli-text-light mt-1';
                }
                updateCheckoutTotal();
                return;
            }

            const distanceKm = haversineDistanceKm(shop.lat, shop.lon, customer.lat, customer.lon);
            const price = freightForDistance(distanceKm);

            if (price === null) {
                if (cepFeedbackEl) {
                    cepFeedbackEl.textContent = 'Entrega não disponível nesse endereço';
                    cepFeedbackEl.className = 'text-xs font-bold text-red-600 mt-1';
                }
                if (freightInfoEl) freightInfoEl.textContent = '';
                return;
            }

            deliveryAllowed = true;
            currentFreight = price;
            if (cepFeedbackEl) {
                cepFeedbackEl.textContent = `Endereço dentro da área atendida (${data.localidade}/${data.uf}).`;
                cepFeedbackEl.className = 'text-xs text-green-700 mt-1';
            }
            if (freightInfoEl) {
                freightInfoEl.textContent = `Frete: ${formatCurrency(price)} (aprox. ${distanceKm.toFixed(1)} km da loja)`;
                freightInfoEl.className = 'text-xs font-bold text-bolli-purple-light mt-1';
            }
            updateCheckoutTotal();
        } catch (err) {
            if (cepFeedbackEl) {
                cepFeedbackEl.textContent = 'Não foi possível verificar o CEP agora. Tente novamente.';
                cepFeedbackEl.className = 'text-xs text-red-600 mt-1';
            }
        }
    }

    function resetCheckoutState() {
        deliveryAllowed = false;
        currentFreight = 0;
        if (cepFeedbackEl) cepFeedbackEl.textContent = '';
        if (freightInfoEl) freightInfoEl.textContent = '';
        updateCheckoutTotal();
    }

    function openCartModal() { cartModal.classList.remove('hidden'); setTimeout(() => cartContent.classList.remove('translate-x-full'), 10); }
    function closeCartModal() { cartContent.classList.add('translate-x-full'); setTimeout(() => cartModal.classList.add('hidden'), 300); }
    function openCheckoutModal() {
        closeCartModal();
        resetCheckoutState();
        updateCheckoutTotal();
        checkoutModal.classList.remove('hidden');
        setTimeout(() => checkoutContent.classList.remove('scale-95', 'opacity-0'), 10);
    }
    function closeCheckoutModal() { checkoutContent.classList.add('scale-95', 'opacity-0'); setTimeout(() => checkoutModal.classList.add('hidden'), 300); }
    function openSuccessModal() { successModal.classList.remove('hidden'); setTimeout(() => successModal.querySelector('div').classList.remove('scale-95', 'opacity-0'), 10); }
    function closeSuccessModal() { successModal.querySelector('div').classList.add('scale-95', 'opacity-0'); setTimeout(() => successModal.classList.add('hidden'), 300); }

    function toggleDeliveryOptions() {
        if (deliveryRadio.checked) {
            deliveryAddressGroup.classList.remove('hidden');
            pickupGroup.classList.add('hidden');
            addressInput.required = true;
            cepInput.required = true;
            pickupWhenInput.required = false;
        } else {
            deliveryAddressGroup.classList.add('hidden');
            pickupGroup.classList.remove('hidden');
            addressInput.required = false;
            cepInput.required = false;
            pickupWhenInput.required = true;
        }
        updateCheckoutTotal();
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
    cepInput.addEventListener('blur', handleCepBlur);
    cepInput.addEventListener('input', () => {
        // Formatação simples do CEP (00000-000) enquanto digita
        let v = cepInput.value.replace(/\D/g, '').slice(0, 8);
        if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
        cepInput.value = v;
    });

    document.getElementById('send-whatsapp-btn').addEventListener('click', () => {
        if (!checkoutForm.reportValidity()) return;
        const formData = new FormData(checkoutForm);
        const method = formData.get('deliveryMethod');

        if (method === 'Entrega' && !deliveryAllowed) {
            alert('Preencha um CEP válido dentro da nossa área de entrega antes de continuar.');
            cepInput.focus();
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        let msg = `*Novo Pedido - Bolli Doces*\n\n`;
        cart.forEach(item => msg += `*${item.quantity}x* ${item.name} - ${formatCurrency(item.price * item.quantity)}\n`);
        msg += `\n*Subtotal: ${formatCurrency(subtotal)}*`;

        if (method === 'Entrega') {
            total += currentFreight;
            msg += `\n*Frete: ${currentFreight > 0 ? formatCurrency(currentFreight) : 'a combinar'}*`;
        }
        msg += `\n*TOTAL: ${formatCurrency(total)}*`;

        msg += `\n\n*Cliente:* ${formData.get('name')}`;
        msg += `\n*Forma de pagamento:* ${formData.get('paymentMethod')}`;
        msg += `\n*Método:* ${method}`;

        if (method === 'Entrega') {
            msg += `\n*CEP:* ${formData.get('cep')}`;
            msg += `\n*Endereço:* ${formData.get('address')}`;
        } else {
            msg += `\n*Retirada em:* ${PICKUP_ADDRESS}`;
            msg += `\n*Dia/horário preferido:* ${formData.get('pickupWhen')}`;
        }

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        cart = []; renderCart(); closeCheckoutModal(); openSuccessModal();
    });

    [productGridTradicionais, productGridRecheados, suspirosProductGrid].forEach(grid => {
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            // 1) Botão de adição rápida (aparece no hover/clique sobre a imagem)
            const quickAddBtn = e.target.closest('.quick-add-btn');
            if (quickAddBtn) {
                addToCartWithQuantity(quickAddBtn.dataset.id, 1);
                return;
            }

            // 2) Controles dentro do card expandido (quantidade / adicionar ao carrinho)
            const btn = e.target.closest('button');
            if (btn) {
                const id = btn.dataset.id;
                const span = document.getElementById(`quantity-${id}`);
                if (btn.classList.contains('increase-qty-btn') && span) {
                    span.textContent = parseInt(span.textContent) + 1;
                    return;
                }
                if (btn.classList.contains('decrease-qty-btn') && span && parseInt(span.textContent) > 0) {
                    span.textContent = parseInt(span.textContent) - 1;
                    return;
                }
                if (btn.classList.contains('add-qty-to-cart-btn') && span && parseInt(span.textContent) > 0) {
                    addToCartWithQuantity(id, parseInt(span.textContent));
                    span.textContent = '0';
                    return;
                }
            }

            // 3) Clique no cabeçalho do card = abre/fecha os detalhes (accordion)
            const header = e.target.closest('.card-header');
            if (header) {
                toggleCard(header.dataset.id);
            }
        });

        // Acessibilidade: permite abrir/fechar o card com teclado (Enter / Espaço)
        grid.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const header = e.target.closest('.card-header');
            if (!header) return;
            e.preventDefault();
            toggleCard(header.dataset.id);
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

    renderProductsByCategory('cookies-tradicionais', productGridTradicionais);
    renderProductsByCategory('cookies-recheados', productGridRecheados);
    renderProductsByCategory('suspiros', suspirosProductGrid);
});
