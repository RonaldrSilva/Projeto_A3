function getFavoritos() {
    const favoritosSalvos = localStorage.getItem('meusFavoritos');
    
    if (favoritosSalvos) {
        return JSON.parse(favoritosSalvos);
    }
    
    return []; 
}

function toggleFavorito(produtoId) {
    let favoritos = getFavoritos();
    
    const index = favoritos.indexOf(produtoId);
    
    if (index === -1) {
        favoritos.push(produtoId);
    } else {
        favoritos.splice(index, 1);
    }
    
    localStorage.setItem('meusFavoritos', JSON.stringify(favoritos));
}

function getCarrinho() {
    const carrinhoSalvo = localStorage.getItem('meuCarrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
}

function adicionarAoCarrinho(produtoId) {
    let carrinho = getCarrinho();
    
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id: produtoId, quantidade: 1 });
    }
    
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
}

function removerDoCarrinho(produtoId) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
}
function alterarQuantidade(produtoId, delta) {
    let carrinho = getCarrinho();
    const item = carrinho.find(item => item.id === produtoId);
    
    if (item) {
        item.quantidade += delta;
        
        if (item.quantidade <= 0) {
            return removerDoCarrinho(produtoId);
        }
    }
    
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
}