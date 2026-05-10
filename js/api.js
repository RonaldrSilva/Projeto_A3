async function carregarProdutos() {
    const categoriasTech = [
        'laptops',
        'smartphones',
        'tablets',
        'mobile-accessories'
    ];

    const requisicoes = categoriasTech.map(async (categoria) => {
        const resposta = await fetch(`https://dummyjson.com/products/category/${categoria}`);

        if (!resposta.ok) {
            throw new Error(`Erro ao carregar categoria: ${categoria}`);
        }

        const dados = await resposta.json();
        return dados.products || [];
    });

    try {
        const resultados = await Promise.allSettled(requisicoes);

        const produtosCarregados = resultados
            .filter(resultado => resultado.status === 'fulfilled')
            .flatMap(resultado => resultado.value);

        const houveFalha = resultados.some(resultado => resultado.status === 'rejected');

        if (houveFalha) {
            console.warn('Algumas categorias não puderam ser carregadas.');
        }

        return produtosCarregados;

    } catch (erro) {
        console.error('Erro ao buscar os produtos da API:', erro);
        return [];
    }
}