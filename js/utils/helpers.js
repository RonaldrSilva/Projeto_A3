// =========================
// HELPERS / UTILITÁRIOS
// =========================

// =========================
// ESCAPAR HTML
// Evita injeção no DOM
// =========================

function escaparHTML(valor) {
    return String(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

// =========================
// NORMALIZAR TEXTO
// Remove acentos e padroniza
// =========================

function normalizarTexto(valor = '') {
    return String(valor)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

// =========================
// EXIBIR MENSAGEM
// =========================

function exibirMensagemProdutos(container, mensagem, classe = 'empty-products') {
    container.innerHTML = `
        <div class="col-12">
            <p class="${classe}">
                ${mensagem}
            </p>
        </div>
    `;
}