const CHAVE_FAVORITOS = 'meusFavoritos';
const CHAVE_CARRINHO = 'meuCarrinho';

function lerLocalStorage(chave, valorPadrao) {
    try {
        const dadosSalvos = localStorage.getItem(chave);

        if (!dadosSalvos) {
            return valorPadrao;
        }

        return JSON.parse(dadosSalvos);

    } catch (erro) {
        console.error(`Erro ao ler ${chave} do localStorage:`, erro);
        localStorage.removeItem(chave);
        return valorPadrao;
    }
}

function salvarLocalStorage(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function getFavoritos() {
    return lerLocalStorage(CHAVE_FAVORITOS, []);
}

function toggleFavorito(produtoId) {
    const favoritos = getFavoritos();

    const produtoJaEstaFavoritado = favoritos.includes(produtoId);

    if (produtoJaEstaFavoritado) {
        const favoritosAtualizados = favoritos.filter(id => id !== produtoId);
        salvarLocalStorage(CHAVE_FAVORITOS, favoritosAtualizados);
        return;
    }

    favoritos.push(produtoId);
    salvarLocalStorage(CHAVE_FAVORITOS, favoritos);
}

function getCarrinho() {
    return lerLocalStorage(CHAVE_CARRINHO, []);
}

function adicionarAoCarrinho(produtoId) {
    const carrinho = getCarrinho();

    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produtoId,
            quantidade: 1
        });
    }

    salvarLocalStorage(CHAVE_CARRINHO, carrinho);
}

function removerDoCarrinho(produtoId) {
    const carrinho = getCarrinho();

    const carrinhoAtualizado = carrinho.filter(item => item.id !== produtoId);

    salvarLocalStorage(CHAVE_CARRINHO, carrinhoAtualizado);
}

function alterarQuantidade(produtoId, delta) {
    const carrinho = getCarrinho();

    const item = carrinho.find(item => item.id === produtoId);

    if (!item) {
        return;
    }

    item.quantidade += delta;

    if (item.quantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }

    salvarLocalStorage(CHAVE_CARRINHO, carrinho);
}