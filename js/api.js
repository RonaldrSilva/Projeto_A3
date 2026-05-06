async function carregarProdutos() {
    const categoriasTech = [
        'laptops',
        'smartphones',
        'tablets',
        'mobile-accessories'
    ];

    try {
        const requisicoes = categoriasTech.map(async (categoria) => {
            const resposta = await fetch(`https://dummyjson.com/products/category/${categoria}`);

            if (!resposta.ok) {
                throw new Error(`Erro ao carregar categoria: ${categoria}`);
            }

            const dados = await resposta.json();
            return dados.products || [];
        });

        const listasDeProdutos = await Promise.all(requisicoes);

        return listasDeProdutos.flat();

    } catch (erro) {
        console.error('Erro ao buscar os produtos da API:', erro);
        return [];
    }
}