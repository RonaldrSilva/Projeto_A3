const containerProdutos = document.getElementById('lista-produtos');
const inputBusca = document.getElementById('input-busca');
const btnVerFavoritos = document.getElementById('btn-favoritos');
const selectCategoria = document.getElementById('select-categoria');
const selectOrdenacao = document.getElementById('select-ordenacao');

let todosOsProdutos = [];
let mostrandoApenasFavoritos = false;

function exibirCards(produtos) {
    containerProdutos.innerHTML = '';
    const favoritos = getFavoritos(); 

    produtos.forEach(produto => {
        const isFavorito = favoritos.includes(produto.id);
        const classeBotao = isFavorito ? 'btn-warning' : 'btn-outline-warning';
        const textoBotao = isFavorito ? '⭐' : '⭐';

        const cardHTML = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">
                    <img src="${produto.thumbnail}" class="card-img-top" alt="${produto.title}" style="height: 200px; object-fit: contain; padding: 10px;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${produto.title}</h5>
                        <p class="text-muted small mb-1">${produto.category}</p>
                        <p class="card-text fw-bold text-success fs-4 mb-3">R$ ${produto.price}</p>
                        
                        <div class="d-flex flex-column gap-2 mt-auto border-top pt-3">
                            <button class="btn btn-success w-100 fw-bold btn-adicionar-carrinho" data-id="${produto.id}">
                                🛒 Adicionar ao Carrinho
                            </button>
                            <div class="d-flex gap-2">
                                <button class="btn btn-info text-white flex-grow-1 btn-detalhes" data-id="${produto.id}">
                                    🔍 Detalhes
                                </button>
                                <button class="btn ${classeBotao} btn-favoritar" data-id="${produto.id}" title="Favoritar">
                                    ${textoBotao}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        containerProdutos.innerHTML += cardHTML;
    });
}

function atualizarGavetaCarrinho() {
    const carrinho = getCarrinho();
    const containerCarrinho = document.getElementById('itens-carrinho');
    const displayTotal = document.getElementById('total-carrinho');
    
    containerCarrinho.innerHTML = '';
    let valorTotal = 0;

    if (carrinho.length === 0) {
        containerCarrinho.innerHTML = '<p class="text-muted text-center mt-5">Seu carrinho está vazio.</p>';
        displayTotal.textContent = 'R$ 0.00';
        return;
    }

    carrinho.forEach(itemCart => {
        const produtoInfo = todosOsProdutos.find(p => p.id === itemCart.id);
        
        if (produtoInfo) {
            const subtotal = produtoInfo.price * itemCart.quantidade;
            valorTotal += subtotal;

            const itemHTML = `
                <div class="d-flex align-items-center mb-3 border-bottom pb-3">
                    <img src="${produtoInfo.thumbnail}" style="width: 50px; height: 50px; object-fit: contain;" class="me-2">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 text-truncate" style="max-width: 140px;">${produtoInfo.title}</h6>
                        <small class="text-success fw-bold">R$ ${produtoInfo.price.toFixed(2)}</small>
                        
                        <!-- Controles de Quantidade -->
                        <div class="d-flex align-items-center mt-1">
                            <button class="btn btn-sm btn-outline-secondary py-0 px-2 btn-diminuir" data-id="${itemCart.id}">-</button>
                            <span class="mx-2 fw-bold">${itemCart.quantidade}</span>
                            <button class="btn btn-sm btn-outline-secondary py-0 px-2 btn-aumentar" data-id="${itemCart.id}">+</button>
                        </div>
                    </div>
                    <div class="text-end">
                        <button class="btn btn-sm text-danger btn-remover-carrinho mb-2" data-id="${itemCart.id}">🗑️</button>
                        <div class="small fw-bold text-muted">R$ ${subtotal.toFixed(2)}</div>
                    </div>
                </div>
            `;
            containerCarrinho.innerHTML += itemHTML;
        }
    });

    displayTotal.textContent = `R$ ${valorTotal.toFixed(2)}`;
}

function abrirModalDetalhes(id) {
    const produto = todosOsProdutos.find(p => p.id === id);
    if (produto) {
        document.getElementById('modalTitulo').textContent = produto.title;
        document.getElementById('modalImagem').src = produto.thumbnail;
        document.getElementById('modalDescricao').textContent = produto.description;
        document.getElementById('modalMarca').textContent = produto.brand || 'Marca não informada';
        document.getElementById('modalAvaliacao').textContent = `⭐ ${produto.rating}`;

        const modal = new bootstrap.Modal(document.getElementById('modalProduto'));
        modal.show();
    }
}

function atualizarTela() {
    const textoBuscado = inputBusca.value.toLowerCase();
    const categoriaSelecionada = selectCategoria.value;
    const ordenacaoSelecionada = selectOrdenacao.value;
    
    let produtosParaExibir = todosOsProdutos.filter(produto => 
        produto.title.toLowerCase().includes(textoBuscado)
    );

    if (categoriaSelecionada !== 'todas') {
        produtosParaExibir = produtosParaExibir.filter(produto => produto.category === categoriaSelecionada);
    }

    if (mostrandoApenasFavoritos) {
        const favoritosIds = getFavoritos();
        produtosParaExibir = produtosParaExibir.filter(produto => favoritosIds.includes(produto.id));
    }

    if (ordenacaoSelecionada === 'menor-preco') {
        produtosParaExibir.sort((a, b) => a.price - b.price);
    } else if (ordenacaoSelecionada === 'maior-preco') {
        produtosParaExibir.sort((a, b) => b.price - a.price);
    }
    
    exibirCards(produtosParaExibir);
}

async function iniciarLoja() {
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
        toggleFavorito(Number(botaoFavoritar.dataset.id)); 
        atualizarTela(); 
        return; 
    }

    const botaoDetalhes = evento.target.closest('.btn-detalhes');
    if (botaoDetalhes) {
        abrirModalDetalhes(Number(botaoDetalhes.dataset.id));
        return;
    }

    const botaoCarrinho = evento.target.closest('.btn-adicionar-carrinho');
    if (botaoCarrinho) {
        adicionarAoCarrinho(Number(botaoCarrinho.dataset.id));
        atualizarGavetaCarrinho();
        
        const textoOriginal = botaoCarrinho.textContent;
        botaoCarrinho.textContent = '✅ Adicionado!';
        botaoCarrinho.classList.replace('btn-success', 'btn-dark');
        setTimeout(() => {
            botaoCarrinho.textContent = textoOriginal;
            botaoCarrinho.classList.replace('btn-dark', 'btn-success');
        }, 1000);
    }
});

document.getElementById('gavetaCarrinho').addEventListener('click', (evento) => {
    const id = Number(evento.target.dataset.id);
    if (!id) return;

    if (evento.target.closest('.btn-remover-carrinho')) {
        removerDoCarrinho(id);
    } else if (evento.target.closest('.btn-aumentar')) {
        alterarQuantidade(id, 1);
    } else if (evento.target.closest('.btn-diminuir')) {
        alterarQuantidade(id, -1);
    }
    
    atualizarGavetaCarrinho();
});

btnVerFavoritos.addEventListener('click', () => {
    mostrandoApenasFavoritos = !mostrandoApenasFavoritos;
    
    if (mostrandoApenasFavoritos) {
        btnVerFavoritos.classList.replace('btn-outline-warning', 'btn-warning');
        btnVerFavoritos.textContent = '📦 Ver Todos';
    } else {
        btnVerFavoritos.classList.replace('btn-warning', 'btn-outline-warning');
        btnVerFavoritos.textContent = '⭐ Favoritos';
    }
    
    atualizarTela();
});

window.onload = iniciarLoja;