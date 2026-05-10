// =========================
// MODAL / CARROSSEL
// =========================

let imagensModal = [];
let indiceImagemAtual = 0;

// =========================
// ATUALIZAR IMAGEM
// =========================

function atualizarImagemModal() {

    const modalImagem =
        document.getElementById('modalImagem');

    const contadorImagens =
        document.getElementById('contador-imagens');

    const btnImagemAnterior =
        document.getElementById('btn-imagem-anterior');

    const btnProximaImagem =
        document.getElementById('btn-proxima-imagem');

    if (imagensModal.length === 0) {
        return;
    }

    modalImagem.src =
        imagensModal[indiceImagemAtual];

    contadorImagens.textContent =
        `${indiceImagemAtual + 1} / ${imagensModal.length}`;

    const possuiMaisDeUmaImagem =
        imagensModal.length > 1;

    btnImagemAnterior.classList.toggle(
        'd-none',
        !possuiMaisDeUmaImagem
    );

    btnProximaImagem.classList.toggle(
        'd-none',
        !possuiMaisDeUmaImagem
    );

    contadorImagens.classList.toggle(
        'd-none',
        !possuiMaisDeUmaImagem
    );
}

// =========================
// IMAGEM ANTERIOR
// =========================

function mostrarImagemAnterior() {

    indiceImagemAtual =
        indiceImagemAtual === 0
            ? imagensModal.length - 1
            : indiceImagemAtual - 1;

    atualizarImagemModal();
}

// =========================
// PRÓXIMA IMAGEM
// =========================

function mostrarProximaImagem() {

    indiceImagemAtual =
        indiceImagemAtual === imagensModal.length - 1
            ? 0
            : indiceImagemAtual + 1;

    atualizarImagemModal();
}

// =========================
// ABRIR MODAL
// =========================

function abrirModalDetalhes(
    idProduto,
    todosOsProdutos
) {

    const produto = todosOsProdutos.find(
        produto => produto.id === idProduto
    );

    if (!produto) {
        return;
    }

    imagensModal =
        Array.isArray(produto.images)
        && produto.images.length > 0
            ? produto.images
            : [produto.thumbnail];

    indiceImagemAtual = 0;

    document.getElementById('modalTitulo')
        .textContent = produto.title;

    document.getElementById('modalDescricao')
        .textContent = produto.description;

    document.getElementById('modalMarca')
        .textContent =
            produto.brand || 'Marca não informada';

    document.getElementById('modalAvaliacao')
        .textContent = `⭐ ${produto.rating}`;

    document.getElementById('modalImagem')
        .alt = produto.title;

    atualizarImagemModal();

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById('modalProduto')
        );

    modal.show();
}