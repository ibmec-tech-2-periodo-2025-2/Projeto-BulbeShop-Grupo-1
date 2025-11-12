const menos = document.querySelectorAll("#menos");
const mais = document.querySelectorAll("#mais");
const campos = document.querySelectorAll("#campo");

menos.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    let valor = parseInt(campos[index].innerText);
    if (valor > 1) {
      valor--;
      campos[index].innerText = valor;
    }
  });
});

mais.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    let valor = parseInt(campos[index].innerText);
    valor++;
    campos[index].innerText = valor;
  });
});

const produtos = document.querySelectorAll(".produto");
const totalEl = document.getElementById("total");
const subtotalEl = document.getElementById("subtotal");

function atualizarTotal() {
  let total = 0;
  document.querySelectorAll(".produto").forEach(prod => {
    const preco = parseFloat(prod.querySelector(".valor").textContent);
    const qtd = parseInt(prod.querySelector(".campo").textContent);
    total += preco * qtd;
  });
  totalEl.textContent = `R$ ${total.toFixed(2)}`;
  subtotalEl.textContent = `R$ ${total.toFixed(2)}`;
}

// Controles de quantidade
document.querySelectorAll(".menos").forEach(btn => {
  btn.addEventListener("click", () => {
    const campo = btn.parentElement.querySelector(".campo");
    let valor = parseInt(campo.textContent);
    if (valor > 1) {
      campo.textContent = valor - 1;
      atualizarTotal();
    }
  });
});

document.querySelectorAll(".mais").forEach(btn => {
  btn.addEventListener("click", () => {
    const campo = btn.parentElement.querySelector(".campo");
    campo.textContent = parseInt(campo.textContent) + 1;
    atualizarTotal();
  });
});

// Botão remover produto
document.querySelectorAll(".remover").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".produto").remove();
    localStorage.clear();
    atualizarTotal();
  });
});

// Atualiza o total ao carregar
atualizarTotal();


const imgProduto = document.getElementById("img");
const nomeProduto = document.getElementById("nome");
const valorTotal = document.getElementById("valorTotal");
const valorFinal = document.getElementById("valorFinal");


const compra = JSON.parse(localStorage.getItem('compra'));

imgProduto.src = compra.imgProduto;
nomeProduto.textContent = compra.nomeProduto;
valorTotal.textContent = compra.valorTotal;
valorFinal.textContent = compra.valorFinal;

