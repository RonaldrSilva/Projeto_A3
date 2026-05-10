// =========================
// TOAST / NOTIFICAÇÕES
// =========================

// =========================
// MOSTRAR TOAST
// =========================

function mostrarToast(titulo, mensagem) {

    const toastElemento = document.getElementById('toast-notificacao');
    const toastTitulo = document.getElementById('toast-titulo');
    const toastMensagem = document.getElementById('toast-mensagem');

    toastTitulo.textContent = titulo;
    toastMensagem.textContent = mensagem;

    const toast = bootstrap.Toast.getOrCreateInstance(
        toastElemento,
        {
            delay: 1800
        }
    );

    toast.show();
}