const containerProdutos = document.getElementById('lista-produtos');
const inputBusca = document.getElementById('input-busca');
const btnVerFavoritos = document.getElementById('btn-favoritos');
const selectCategoria = document.getElementById('select-categoria');
const selectOrdenacao = document.getElementById('select-ordenacao');

const containerCarrinho = document.getElementById('itens-carrinho');
const displayTotal = document.getElementById('total-carrinho');
const gavetaCarrinho = document.getElementById('gavetaCarrinho');

let todosOsProdutos = [];
let mostrandoApenasFavoritos = false;

function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function escaparHTML(valor) {
    return String(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function exibirMensagemProdutos(mensagem, classe = 'empty-products') {
    containerProdutos.innerHTML = `
        <div class="col-12">
            <p class="${classe}">${mensagem}</p>
        </div>
    `;
}

function exibirCards(produtos) {
    containerProdutos.innerHTML = '';

    if (produtos.length === 0) {
        exibirMensagemProdutos('Nenhum produto encontrado.');
        return;
    }

    const favoritos = getFavoritos();

    const cardsHTML = produtos.map(produto => {
        const isFavorito = favoritos.includes(produto.id);

        const classeFavorito = isFavorito ? 'ativo' : '';

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
                            ${escaparHTML(produto.category)}
                        </p>

                        <p class="produto-price">
                            ${formatarPreco(produto.price)}
                        </p>

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

    containerProdutos.innerHTML = cardsHTML;
}

function atualizarGavetaCarrinho() {
    const carrinho = getCarrinho();

    containerCarrinho.innerHTML = '';

    let valorTotal = 0;

    if (carrinho.length === 0) {
        containerCarrinho.innerHTML = `
            <p class="empty-cart">Seu carrinho está vazio.</p>
        `;

        displayTotal.textContent = formatarPreco(0);
        return;
    }

    const itensHTML = carrinho.map(itemCart => {
        const produtoInfo = todosOsProdutos.find(produto => produto.id === itemCart.id);

        if (!produtoInfo) {
            return '';
        }

        const subtotal = produtoInfo.price * itemCart.quantidade;
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
    displayTotal.textContent = formatarPreco(valorTotal);
}

function abrirModalDetalhes(id) {
    const produto = todosOsProdutos.find(produto => produto.id === id);

    if (!produto) {
        return;
    }

    document.getElementById('modalTitulo').textContent = produto.title;
    document.getElementById('modalImagem').src = produto.thumbnail;
    document.getElementById('modalImagem').alt = produto.title;
    document.getElementById('modalDescricao').textContent = produto.description;
    document.getElementById('modalMarca').textContent = produto.brand || 'Marca não informada';
    document.getElementById('modalAvaliacao').textContent = `⭐ ${produto.rating}`;

    const modal = new bootstrap.Modal(document.getElementById('modalProduto'));
    modal.show();
}

function filtrarPorBusca(produtos, textoBuscado) {
    if (!textoBuscado) {
        return produtos;
    }

    return produtos.filter(produto => {
        const titulo = produto.title.toLowerCase();
        return titulo.includes(textoBuscado);
    });
}

function filtrarPorCategoria(produtos, categoriaSelecionada) {
    if (categoriaSelecionada === 'todas') {
        return produtos;
    }

    return produtos.filter(produto => produto.category === categoriaSelecionada);
}

function filtrarPorFavoritos(produtos) {
    if (!mostrandoApenasFavoritos) {
        return produtos;
    }

    const favoritosIds = getFavoritos();

    return produtos.filter(produto => favoritosIds.includes(produto.id));
}

function ordenarProdutos(produtos, tipoOrdenacao) {
    const produtosOrdenados = [...produtos];

    if (tipoOrdenacao === 'menor-preco') {
        produtosOrdenados.sort((a, b) => a.price - b.price);
    }

    if (tipoOrdenacao === 'maior-preco') {
        produtosOrdenados.sort((a, b) => b.price - a.price);
    }

    return produtosOrdenados;
}

function atualizarTela() {
    const textoBuscado = inputBusca.value.toLowerCase().trim();
    const categoriaSelecionada = selectCategoria.value;
    const ordenacaoSelecionada = selectOrdenacao.value;

    let produtosParaExibir = [...todosOsProdutos];

    produtosParaExibir = filtrarPorBusca(produtosParaExibir, textoBuscado);
    produtosParaExibir = filtrarPorCategoria(produtosParaExibir, categoriaSelecionada);
    produtosParaExibir = filtrarPorFavoritos(produtosParaExibir);
    produtosParaExibir = ordenarProdutos(produtosParaExibir, ordenacaoSelecionada);

    exibirCards(produtosParaExibir);
}

function atualizarBotaoFavoritos() {
    btnVerFavoritos.classList.toggle('ativo', mostrandoApenasFavoritos);

    if (mostrandoApenasFavoritos) {
        btnVerFavoritos.textContent = '📦 Ver Todos';
    } else {
        btnVerFavoritos.textContent = '⭐ Favoritos';
    }
}

async function iniciarLoja() {
    exibirMensagemProdutos('Carregando produtos...', 'loading-products');

    todosOsProdutos = await carregarProdutos();

    atualizarTela();
    atualizarGavetaCarrinho();
}

inputBusca.addEventListener('input', atualizarTela);
selectCategoria.addEventListener('change', atualizarTela);
selectOrdenacao.addEventListener('change', atualizarTela);

containerProdutos.addEventListener('click', (evento) => {
    const botaoFavoritar = evento.target.closest('.btn-favoritar');

    if (botaoFavoritar) {
        const idProduto = Number(botaoFavoritar.dataset.id);

        toggleFavorito(idProduto);
        atualizarTela();

        return;
    }

    const botaoDetalhes = evento.target.closest('.btn-detalhes');

    if (botaoDetalhes) {
        const idProduto = Number(botaoDetalhes.dataset.id);

        abrirModalDetalhes(idProduto);

        return;
    }

    const botaoCarrinho = evento.target.closest('.btn-adicionar-carrinho');

    if (botaoCarrinho) {
        const idProduto = Number(botaoCarrinho.dataset.id);

        adicionarAoCarrinho(idProduto);
        atualizarGavetaCarrinho();

        const textoOriginal = botaoCarrinho.textContent;

        botaoCarrinho.textContent = '✅ Adicionado!';
        botaoCarrinho.classList.add('adicionado');

        setTimeout(() => {
            botaoCarrinho.textContent = textoOriginal;
            botaoCarrinho.classList.remove('adicionado');
        }, 1000);
    }
});

gavetaCarrinho.addEventListener('click', (evento) => {
    const botaoRemover = evento.target.closest('.btn-remover-carrinho');
    const botaoAumentar = evento.target.closest('.btn-aumentar');
    const botaoDiminuir = evento.target.closest('.btn-diminuir');

    const botaoClicado = botaoRemover || botaoAumentar || botaoDiminuir;

    if (!botaoClicado) {
        return;
    }

    const idProduto = Number(botaoClicado.dataset.id);

    if (botaoRemover) {
        removerDoCarrinho(idProduto);
    }

    if (botaoAumentar) {
        alterarQuantidade(idProduto, 1);
    }

    if (botaoDiminuir) {
        alterarQuantidade(idProduto, -1);
    }

    atualizarGavetaCarrinho();
});

btnVerFavoritos.addEventListener('click', () => {
    mostrandoApenasFavoritos = !mostrandoApenasFavoritos;

    atualizarBotaoFavoritos();
    atualizarTela();
});

document.addEventListener('DOMContentLoaded', iniciarLoja);