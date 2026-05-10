// =========================
// TEMA / DARK MODE
// =========================

// =========================
// APLICAR TEMA
// =========================

function aplicarTema(tema) {

    const btnTema =
        document.getElementById('btn-tema');

    const temaEscuroAtivo =
        tema === 'escuro';

    document.body.classList.toggle(
        'dark-mode',
        temaEscuroAtivo
    );

    btnTema.textContent =
        temaEscuroAtivo
            ? '☀️'
            : '🌙';

    btnTema.title =
        temaEscuroAtivo
            ? 'Ativar modo claro'
            : 'Ativar modo escuro';
}

// =========================
// ALTERNAR TEMA
// =========================

function alternarTema() {

    const temaAtual =
        document.body.classList.contains('dark-mode')
            ? 'escuro'
            : 'claro';

    const novoTema =
        temaAtual === 'escuro'
            ? 'claro'
            : 'escuro';

    salvarTema(novoTema);

    aplicarTema(novoTema);
}