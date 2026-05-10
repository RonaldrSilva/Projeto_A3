// =========================
// ELEMENTOS DOM
// =========================

const containerProdutos =
    document.getElementById('lista-produtos');

const inputBusca =
    document.getElementById('input-busca');

const btnVerFavoritos =
    document.getElementById('btn-favoritos');

const btnTema =
    document.getElementById('btn-tema');

const selectCategoria =
    document.getElementById('select-categoria');

const selectOrdenacao =
    document.getElementById('select-ordenacao');

const containerCarrinho =
    document.getElementById('itens-carrinho');

const displayTotal =
    document.getElementById('total-carrinho');

const gavetaCarrinho =
    document.getElementById('gavetaCarrinho');

// =========================
// ESTADO
// =========================

let todosOsProdutos = [];

let mostrandoApenasFavoritos = false;

// =========================
// FILTROS
// =========================

function filtrarPorBusca(
    produtos,
    textoBuscado
) {

    if (!textoBuscado) {
        return produtos;
    }

    const buscaNormalizada =
        normalizarTexto(textoBuscado);

    return produtos.filter(produto => {

        // Sinônimos de categorias
        const aliasesCategorias = {
            smartphones: [
                'celular',
                'iphone',
                'android'
            ],

            laptops: [
                'notebook',
                'pc',
                'computador',
                'macbook',
                'ultrabook',
                'chromebook',
                'gaming',
                'workstation',
                '2 em 1',
                'híbrido'
            ],

            tablets: [
                'ipad',
                'tablet',
                'leitor de ebooks'
            ],

            'mobile-accessories': [
                'fone',
                'carregador',
                'acessorio'
            ]
        };

        // Busca aliases da categoria atual
        const aliases =
            aliasesCategorias[produto.category]
            || [];

        // Junta tudo que pode ser pesquisado
        const termosDoProduto = [
            produto.title,
            produto.brand,
            produto.category,
            formatarCategoria(produto.category),
            ...aliases
        ]
            .filter(Boolean)
            .map(normalizarTexto);

        return termosDoProduto.some(
            termo =>
                termo.includes(buscaNormalizada)
        );
    });
}

// =========================
// FILTRO CATEGORIA
// =========================

function filtrarPorCategoria(
    produtos,
    categoriaSelecionada
) {

    if (categoriaSelecionada === 'todas') {
        return produtos;
    }

    return produtos.filter(
        produto =>
            produto.category === categoriaSelecionada
    );
}

// =========================
// FILTRO FAVORITOS
// =========================

function filtrarPorFavoritos(produtos) {

    if (!mostrandoApenasFavoritos) {
        return produtos;
    }

    const favoritosIds = getFavoritos();

    return produtos.filter(produto =>
        favoritosIds.includes(produto.id)
    );
}

// =========================
// ORDENAÇÃO
// =========================

function ordenarProdutos(
    produtos,
    tipoOrdenacao
) {

    const produtosOrdenados = [...produtos];

    if (tipoOrdenacao === 'menor-preco') {

        produtosOrdenados.sort(
            (a, b) => a.price - b.price
        );
    }

    if (tipoOrdenacao === 'maior-preco') {

        produtosOrdenados.sort(
            (a, b) => b.price - a.price
        );
    }

    return produtosOrdenados;
}

// =========================
// ATUALIZAR TELA
// =========================

function atualizarTela() {

    const textoBuscado =
        inputBusca.value;

    const categoriaSelecionada =
        selectCategoria.value;

    const ordenacaoSelecionada =
        selectOrdenacao.value;

    let produtosParaExibir =
        [...todosOsProdutos];

    produtosParaExibir =
        filtrarPorBusca(
            produtosParaExibir,
            textoBuscado
        );

    produtosParaExibir =
        filtrarPorCategoria(
            produtosParaExibir,
            categoriaSelecionada
        );

    produtosParaExibir =
        filtrarPorFavoritos(
            produtosParaExibir
        );

    produtosParaExibir =
        ordenarProdutos(
            produtosParaExibir,
            ordenacaoSelecionada
        );

    exibirCards(
        containerProdutos,
        produtosParaExibir
    );
}

// =========================
// BOTÃO FAVORITOS
// =========================

function atualizarBotaoFavoritos() {

    btnVerFavoritos.classList.toggle(
        'ativo',
        mostrandoApenasFavoritos
    );

    btnVerFavoritos.textContent =
        mostrandoApenasFavoritos
            ? '📦 Ver Todos'
            : '⭐ Favoritos';
}

// =========================
// INICIALIZAÇÃO
// =========================

async function iniciarLoja() {

    aplicarTema(
        getTemaSalvo()
    );

    exibirSkeletons(
        containerProdutos
    );

    todosOsProdutos =
        await carregarProdutos();

    atualizarTela();

    atualizarGavetaCarrinho(
        containerCarrinho,
        displayTotal,
        todosOsProdutos
    );
}

// =========================
// EVENTOS FILTROS
// =========================

inputBusca.addEventListener(
    'input',
    atualizarTela
);

selectCategoria.addEventListener(
    'change',
    atualizarTela
);

selectOrdenacao.addEventListener(
    'change',
    atualizarTela
);

// =========================
// EVENTO TEMA
// =========================

btnTema.addEventListener(
    'click',
    alternarTema
);

// =========================
// EVENTOS MODAL
// =========================

document
    .getElementById('btn-imagem-anterior')
    .addEventListener(
        'click',
        mostrarImagemAnterior
    );

document
    .getElementById('btn-proxima-imagem')
    .addEventListener(
        'click',
        mostrarProximaImagem
    );

// =========================
// EVENTOS PRODUTOS
// =========================

containerProdutos.addEventListener(
    'click',
    (evento) => {

        const botaoFavoritar =
            evento.target.closest(
                '.btn-favoritar'
            );

        if (botaoFavoritar) {

            const idProduto =
                Number(
                    botaoFavoritar.dataset.id
                );

            const foiFavoritado =
                toggleFavorito(idProduto);

            atualizarTela();

            mostrarToast(
                'Favoritos',
                foiFavoritado
                    ? 'Produto adicionado aos favoritos.'
                    : 'Produto removido dos favoritos.'
            );

            return;
        }

        const botaoDetalhes =
            evento.target.closest(
                '.btn-detalhes'
            );

        if (botaoDetalhes) {

            const idProduto =
                Number(
                    botaoDetalhes.dataset.id
                );

            abrirModalDetalhes(
                idProduto,
                todosOsProdutos
            );

            return;
        }

        const botaoCarrinho =
            evento.target.closest(
                '.btn-adicionar-carrinho'
            );

        if (botaoCarrinho) {

            const idProduto =
                Number(
                    botaoCarrinho.dataset.id
                );

            adicionarAoCarrinho(
                idProduto
            );

            atualizarGavetaCarrinho(
                containerCarrinho,
                displayTotal,
                todosOsProdutos
            );

            const produto =
                todosOsProdutos.find(
                    item => item.id === idProduto
                );

            mostrarToast(
                'Carrinho',
                `${produto?.title || 'Produto'} adicionado ao carrinho.`
            );

            const textoOriginal =
                botaoCarrinho.textContent;

            botaoCarrinho.textContent =
                '✅ Adicionado!';

            botaoCarrinho.classList.add(
                'adicionado'
            );

            setTimeout(() => {

                botaoCarrinho.textContent =
                    textoOriginal;

                botaoCarrinho.classList.remove(
                    'adicionado'
                );

            }, 1000);
        }
    }
);

// =========================
// EVENTOS CARRINHO
// =========================

gavetaCarrinho.addEventListener(
    'click',
    (evento) => {

        const botaoRemover =
            evento.target.closest(
                '.btn-remover-carrinho'
            );

        const botaoAumentar =
            evento.target.closest(
                '.btn-aumentar'
            );

        const botaoDiminuir =
            evento.target.closest(
                '.btn-diminuir'
            );

        const botaoClicado =
            botaoRemover
            || botaoAumentar
            || botaoDiminuir;

        if (!botaoClicado) {
            return;
        }

        const idProduto =
            Number(
                botaoClicado.dataset.id
            );

        if (botaoRemover) {

            removerDoCarrinho(
                idProduto
            );
        }

        if (botaoAumentar) {

            alterarQuantidade(
                idProduto,
                1
            );
        }

        if (botaoDiminuir) {

            alterarQuantidade(
                idProduto,
                -1
            );
        }

        atualizarGavetaCarrinho(
            containerCarrinho,
            displayTotal,
            todosOsProdutos
        );
    }
);

// =========================
// FAVORITOS
// =========================

btnVerFavoritos.addEventListener(
    'click',
    () => {

        mostrandoApenasFavoritos =
            !mostrandoApenasFavoritos;

        atualizarBotaoFavoritos();

        atualizarTela();
    }
);

// =========================
// START
// =========================

document.addEventListener(
    'DOMContentLoaded',
    iniciarLoja
);