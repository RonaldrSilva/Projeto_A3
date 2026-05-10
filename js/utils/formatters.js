// =========================
// FORMATADORES
// =========================

const nomesCategorias = {
    laptops: 'Notebooks',
    smartphones: 'Smartphones',
    tablets: 'Tablets',
    'mobile-accessories': 'Acessórios Mobile'
};

// =========================
// FORMATAR PREÇO
// =========================

function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// =========================
// FORMATAR CATEGORIA
// =========================

function formatarCategoria(categoria) {
    return nomesCategorias[categoria] || categoria;
}