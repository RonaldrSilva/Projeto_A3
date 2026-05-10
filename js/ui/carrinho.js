// =========================
// CARRINHO
// =========================

// =========================
// ATUALIZAR BADGE
// =========================

function atualizarContadorCarrinho() {

    const contadorCarrinho =
        document.getElementById('contador-carrinho');

    const carrinho = getCarrinho();

    const quantidadeTotal = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    contadorCarrinho.textContent = quantidadeTotal;

    contadorCarrinho.classList.toggle(
        'd-none',
        quantidadeTotal === 0
    );
}

// =========================
// ATUALIZAR GAVETA
// =========================

function atualizarGavetaCarrinho(
    containerCarrinho,
    displayTotal,
    todosOsProdutos
) {

    const carrinho = getCarrinho();

    containerCarrinho.innerHTML = '';

    let valorTotal = 0;

    if (carrinho.length === 0) {

        containerCarrinho.innerHTML = `
            <p class="empty-cart">
                Seu carrinho está vazio.
            </p>
        `;

        displayTotal.textContent =
            formatarPreco(0);

        atualizarContadorCarrinho();

        return;
    }

    const itensHTML = carrinho.map(itemCart => {

        const produtoInfo = todosOsProdutos.find(
            produto => produto.id === itemCart.id
        );

        if (!produtoInfo) {
            return '';
        }

        const subtotal =
            produtoInfo.price * itemCart.quantidade;

        valorTotal += subtotal;

        return `
            <div class="cart-item">

                <img 
                    src="${escaparHTML(produtoInfo.thumbnail)}" 
                    alt="${escaparHTML(produtoInfo.title)}" 
                    class="cart-product-image"
                >

                <div class="cart-product-content">

                    <h6 class="cart-product-title">
                        ${escaparHTML(produtoInfo.title)}
                    </h6>

                    <small class="cart-product-price">
                        ${formatarPreco(produtoInfo.price)}
                    </small>

                    <div class="quantity-controls">

                        <button 
                            class="btn-quantity btn-diminuir" 
                            data-id="${itemCart.id}"
                        >
                            -
                        </button>

                        <span class="quantity-number">
                            ${itemCart.quantidade}
                        </span>

                        <button 
                            class="btn-quantity btn-aumentar" 
                            data-id="${itemCart.id}"
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="cart-item-right">

                    <button 
                        class="btn-remove-cart btn-remover-carrinho" 
                        data-id="${itemCart.id}"
                        title="Remover do carrinho"
                    >
                        🗑️
                    </button>

                    <div class="cart-subtotal">
                        ${formatarPreco(subtotal)}
                    </div>

                </div>

            </div>
        `;
    }).join('');

    containerCarrinho.innerHTML = itensHTML;

    displayTotal.textContent =
        formatarPreco(valorTotal);

    atualizarContadorCarrinho();
}