async function carregarProdutos() {
    try {
        const categoriasTech = ['laptops', 'smartphones', 'tablets', 'mobile-accessories'];
        
        let produtosCombinados = [];

        for (const categoria of categoriasTech) {
            
            const resposta = await fetch(`https://dummyjson.com/products/category/${categoria}`);
            const dados = await resposta.json();
            
            produtosCombinados = [...produtosCombinados, ...dados.products];
        }
        
        return produtosCombinados; 
        
    } catch (erro) {
        console.error("Erro ao buscar os produtos da API:", erro);
        return [];
    }
}