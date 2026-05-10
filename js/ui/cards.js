// =========================
// CARDS DE PRODUTOS
// =========================

// =========================
// EXIBIR CARDS
// =========================

function exibirCards(container, produtos) {

    container.innerHTML = '';

    if (produtos.length === 0) {

        exibirMensagemProdutos(
            container,
            'Nenhum produto encontrado.'
        );

        return;
    }

    const favoritos = getFavoritos();

    const cardsHTML = produtos.map(produto => {

        const isFavorito = favoritos.includes(produto.id);

        const classeFavorito = isFavorito
            ? 'ativo'
            : '';

        const estrelas = gerarEstrelas(produto.rating);

        const totalAvaliacoes =
            gerarQuantidadeAvaliacoes();

        return `
            <div class="col-12 col-md-6 col-lg-4 produto-col">

                <article class="produto-card">

                    <div class="produto-image-wrapper">

                        <img 
                            src="${escaparHTML(produto.thumbnail)}" 
                            alt="${escaparHTML(produto.title)}" 
                            class="produto-image"
                        >

                    </div>

                    <div class="produto-card-body">

                        <h5 class="produto-title">
                            ${escaparHTML(produto.title)}
                        </h5>

                        <p class="produto-category">
                            ${escaparHTML(
                                formatarCategoria(produto.category)
                            )}
                        </p>

                        <p class="produto-price">
                            ${formatarPreco(produto.price)}
                        </p>

                        <div class="produto-rating">

                            <span class="stars">
                                ${estrelas}
                            </span>

                            <span class="rating-count">
                                (${totalAvaliacoes} avaliações)
                            </span>

                        </div>

                        <div class="produto-actions">

                            <button 
                                class="btn-card btn-add-cart btn-adicionar-carrinho" 
                                data-id="${produto.id}"
                            >
                                🛒 Adicionar ao Carrinho
                            </button>

                            <div class="produto-actions-row">

                                <button 
                                    class="btn-card btn-details btn-detalhes" 
                                    data-id="${produto.id}"
                                >
                                    🔍 Detalhes
                                </button>

                                <button 
                                    class="btn-card btn-favorite btn-favoritar ${classeFavorito}" 
                                    data-id="${produto.id}" 
                                    title="Favoritar"
                                >
                                    ⭐
                                </button>

                            </div>

                        </div>

                    </div>

                </article>

            </div>
        `;
    }).join('');

    container.innerHTML = cardsHTML;
}