const containerProdutos = document.getElementById('lista-produtos');
const inputBusca = document.getElementById('input-busca');
const btnVerFavoritos = document.getElementById('btn-favoritos');
const btnTema = document.getElementById('btn-tema');
const selectCategoria = document.getElementById('select-categoria');
const selectOrdenacao = document.getElementById('select-ordenacao');

const containerCarrinho = document.getElementById('itens-carrinho');
const displayTotal = document.getElementById('total-carrinho');
const contadorCarrinho = document.getElementById('contador-carrinho');
const gavetaCarrinho = document.getElementById('gavetaCarrinho');

const modalImagem = document.getElementById('modalImagem');
const btnImagemAnterior = document.getElementById('btn-imagem-anterior');
const btnProximaImagem = document.getElementById('btn-proxima-imagem');
const contadorImagens = document.getElementById('contador-imagens');

const toastElemento = document.getElementById('toast-notificacao');
const toastTitulo = document.getElementById('toast-titulo');
const toastMensagem = document.getElementById('toast-mensagem');

const nomesCategorias = {
    laptops: 'Notebooks',
    smartphones: 'Smartphones',
    tablets: 'Tablets',
    'mobile-accessories': 'Acessórios Mobile'
};

let todosOsProdutos = [];
let mostrandoApenasFavoritos = false;

let imagensModal = [];
let indiceImagemAtual = 0;

/* =========================
   FUNÇÕES UTILITÁRIAS
========================= */

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

function normalizarTexto(valor = '') {
    return String(valor)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function formatarCategoria(categoria) {
    return nomesCategorias[categoria] || categoria;
}

function exibirMensagemProdutos(mensagem, classe = 'empty-products') {
    containerProdutos.innerHTML = `
        <div class="col-12">
            <p class="${classe}">${mensagem}</p>
        </div>
    `;
}

function mostrarToast(titulo, mensagem) {
    toastTitulo.textContent = titulo;
    toastMensagem.textContent = mensagem;

    const toast = bootstrap.Toast.getOrCreateInstance(toastElemento, {
        delay: 1800
    });

    toast.show();
}

/* =========================
   SKELETON LOADING
========================= */

function exibirSkeletons(quantidade = 6) {
    const skeletonsHTML = Array.from({ length: quantidade }, () => `
        <div class="col-12 col-md-6 col-lg-4 produto-col">
            <article class="produto-card skeleton-card">
                <div class="skeleton skeleton-image"></div>

                <div class="produto-card-body">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-category"></div>
                    <div class="skeleton skeleton-price"></div>

                    <div class="produto-actions">
                        <div class="skeleton skeleton-button"></div>

                        <div class="produto-actions-row">
                            <div class="skeleton skeleton-button skeleton-button-small"></div>
                            <div class="skeleton skeleton-favorite"></div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    `).join('');

    containerProdutos.innerHTML = skeletonsHTML;
}

/* =========================
   PRODUTOS
========================= */

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

        const estrelas = gerarEstrelas(produto.rating);
        const totalAvaliacoes = gerarQuantidadeAvaliacoes();

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
                                    ${escaparHTML(formatarCategoria(produto.category))}
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

    containerProdutos.innerHTML = cardsHTML;
}

function gerarEstrelas(avaliacao) {
    const nota = Math.round(avaliacao);

    let estrelas = '';

    for (let i = 1; i <= 5; i++) {
        estrelas += i <= nota ? '★' : '☆';
    }

    return estrelas;
}

function gerarQuantidadeAvaliacoes() {
    return Math.floor(Math.random() * 500) + 20;
}

/* =========================
   CARRINHO
========================= */

function atualizarContadorCarrinho() {
    const carrinho = getCarrinho();

    const quantidadeTotal = carrinho.reduce((total, item) => {
        return total + item.quantidade;
    }, 0);

    contadorCarrinho.textContent = quantidadeTotal;
    contadorCarrinho.classList.toggle('d-none', quantidadeTotal === 0);
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
        atualizarContadorCarrinho();
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
    atualizarContadorCarrinho();
}

/* =========================
   MODAL / CARROSSEL
========================= */

function atualizarImagemModal() {
    if (imagensModal.length === 0) {
        return;
    }

    modalImagem.src = imagensModal[indiceImagemAtual];
    contadorImagens.textContent = `${indiceImagemAtual + 1} / ${imagensModal.length}`;

    const possuiMaisDeUmaImagem = imagensModal.length > 1;

    btnImagemAnterior.classList.toggle('d-none', !possuiMaisDeUmaImagem);
    btnProximaImagem.classList.toggle('d-none', !possuiMaisDeUmaImagem);
    contadorImagens.classList.toggle('d-none', !possuiMaisDeUmaImagem);
}

function mostrarImagemAnterior() {
    indiceImagemAtual = indiceImagemAtual === 0
        ? imagensModal.length - 1
        : indiceImagemAtual - 1;

    atualizarImagemModal();
}

function mostrarProximaImagem() {
    indiceImagemAtual = indiceImagemAtual === imagensModal.length - 1
        ? 0
        : indiceImagemAtual + 1;

    atualizarImagemModal();
}

function abrirModalDetalhes(id) {
    const produto = todosOsProdutos.find(produto => produto.id === id);

    if (!produto) {
        return;
    }

    imagensModal = Array.isArray(produto.images) && produto.images.length > 0
        ? produto.images
        : [produto.thumbnail];

    indiceImagemAtual = 0;

    document.getElementById('modalTitulo').textContent = produto.title;
    document.getElementById('modalDescricao').textContent = produto.description;
    document.getElementById('modalMarca').textContent = produto.brand || 'Marca não informada';
    document.getElementById('modalAvaliacao').textContent = `⭐ ${produto.rating}`;

    modalImagem.alt = produto.title;

    atualizarImagemModal();

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalProduto'));
    modal.show();
}

/* =========================
   FILTROS E BUSCA
========================= */

function filtrarPorBusca(produtos, textoBuscado) {
    if (!textoBuscado) {
        return produtos;
    }

    const buscaNormalizada = normalizarTexto(textoBuscado);

    return produtos.filter(produto => {
        const termosDoProduto = [
            produto.title,
            produto.brand,
            produto.category,
            formatarCategoria(produto.category)
        ]
            .filter(Boolean)
            .map(normalizarTexto);

        return termosDoProduto.some(termo => termo.includes(buscaNormalizada));
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
    const textoBuscado = inputBusca.value;
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

/* =========================
   TEMA
========================= */

function aplicarTema(tema) {
    const temaEscuroAtivo = tema === 'escuro';

    document.body.classList.toggle('dark-mode', temaEscuroAtivo);
    btnTema.textContent = temaEscuroAtivo ? '☀️' : '🌙';
    btnTema.title = temaEscuroAtivo ? 'Ativar modo claro' : 'Ativar modo escuro';
}

function alternarTema() {
    const temaAtual = document.body.classList.contains('dark-mode') ? 'escuro' : 'claro';
    const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';

    salvarTema(novoTema);
    aplicarTema(novoTema);
}

/* =========================
   INICIALIZAÇÃO
========================= */

async function iniciarLoja() {
    aplicarTema(getTemaSalvo());
    exibirSkeletons();

    todosOsProdutos = await carregarProdutos();

    atualizarTela();
    atualizarGavetaCarrinho();
}

/* =========================
   EVENTOS
========================= */

inputBusca.addEventListener('input', atualizarTela);
selectCategoria.addEventListener('change', atualizarTela);
selectOrdenacao.addEventListener('change', atualizarTela);
btnTema.addEventListener('click', alternarTema);

btnImagemAnterior.addEventListener('click', mostrarImagemAnterior);
btnProximaImagem.addEventListener('click', mostrarProximaImagem);

containerProdutos.addEventListener('click', (evento) => {
    const botaoFavoritar = evento.target.closest('.btn-favoritar');

    if (botaoFavoritar) {
        const idProduto = Number(botaoFavoritar.dataset.id);
        const foiFavoritado = toggleFavorito(idProduto);

        atualizarTela();

        mostrarToast(
            'Favoritos',
            foiFavoritado
                ? 'Produto adicionado aos favoritos.'
                : 'Produto removido dos favoritos.'
        );

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

        const produto = todosOsProdutos.find(item => item.id === idProduto);

        mostrarToast(
            'Carrinho',
            `${produto?.title || 'Produto'} adicionado ao carrinho.`
        );

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