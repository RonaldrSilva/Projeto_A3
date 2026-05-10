// =========================
// RATINGS / AVALIAÇÕES
// =========================

// =========================
// GERAR ESTRELAS
// =========================

function gerarEstrelas(avaliacao) {
    const nota = Math.round(avaliacao);

    let estrelas = '';

    for (let i = 1; i <= 5; i++) {
        estrelas += i <= nota ? '★' : '☆';
    }

    return estrelas;
}

// =========================
// GERAR QUANTIDADE FAKE
// DE AVALIAÇÕES
// =========================

function gerarQuantidadeAvaliacoes() {
    return Math.floor(Math.random() * 500) + 20;
}