const addCarrinho = document.getElementById("addCarrinho");

addCarrinho.addEventListener('click', ()=>{
    const compra = {
        nomeProduto: document.getElementById("titulo").textContent,
        imgProduto: document.getElementById("img").src,
        valorTotal: document.getElementById("valorTotal").textContent,
        valorFinal: document.getElementById("valorFinal").textContent
    }

    const compraJSON = JSON.stringify(compra);

    localStorage.setItem('compra', compraJSON);
})
