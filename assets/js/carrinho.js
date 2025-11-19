document.addEventListener("DOMContentLoaded", () => {
  console.log("JS do carrinho carregou ✅");

  // Agora busca QUALQUER uma das 3 chaves
  let compraJSON =
    localStorage.getItem("compra") ||
    localStorage.getItem("produto") ||
    localStorage.getItem("carrinho");

  console.log("Valor bruto em localStorage:", compraJSON);

  if (!compraJSON) {
    console.log("Nenhum item encontrado em 'compra', 'produto' ou 'carrinho'.");
    return;
  }

  let compra;
  try {
    compra = JSON.parse(compraJSON);

    // 🔥 SE for array, pega o primeiro elemento
    if (Array.isArray(compra)) {
      compra = compra[0];
    }

    console.log("Objeto final de compra:", compra);

  } catch (e) {
    console.error("Erro ao fazer parse do JSON:", e);
    return;
  }


  // 2. Referências aos elementos do produto no carrinho
  const imgProduto = document.getElementById("img");
  const nomeProduto = document.getElementById("nome");
  const valorAntigoEl = document.getElementById("valorTotal"); // preço antigo do produto
  const valorFinalSpan = document.getElementById("valorFinal"); // preço final unitário

  if (imgProduto) imgProduto.src = compra.imgProduto || "";
  if (nomeProduto) nomeProduto.textContent = compra.nomeProduto || "";
  if (valorAntigoEl) valorAntigoEl.textContent = compra.valorTotal || "";
  if (valorFinalSpan) valorFinalSpan.textContent = compra.valorFinal || "";

  // 3. Controles de quantidade
  const campoQtd = document.querySelector(".campo");
  const btnMais = document.querySelector(".mais");
  const btnMenos = document.querySelector(".menos");

  // 4. Elementos dos resumos
  const subtotalResumo = document.getElementById("subtotal"); // dentro do bloco "Resumo do cálculo"
  const totalResumo = document.getElementById("total"); // dentro do bloco "Resumo do cálculo"
  const precoNovoCard = document.getElementById("valor-novo"); // dentro do card azul do topo
  const totalAntigoLinhaFinal = document.getElementById("total-antigo"); // "R$ 581,93" riscado

  // 5. Funções de ajuda para tratar preço
  function parsePreco(str) {
    if (!str) return 0;

    return parseFloat(
      String(str)
        .replace(/[R$\s]/g, "") // tira "R$" e espaços
        .replace(/\./g, "") // tira separador de milhar
        .replace(",", ".") // troca vírgula por ponto
    );
  }

  function formataPreco(num) {
    return num.toFixed(2).replace(".", ",");
  }

  // 6. Preço unitário da lâmpada (em número)
  const precoUnitario = parsePreco(compra.valorFinal);
  console.log("Preço unitário:", precoUnitario);

  // 7. Atualizar todos os totais da tela
  function atualizarTotais() {
    if (!campoQtd) return;

    let qtd = parseInt(campoQtd.textContent) || 1;
    if (qtd < 1) qtd = 1;

    const subtotal = precoUnitario * qtd;

    // Card roxo do topo
    if (precoNovoCard) {
      precoNovoCard.textContent = formataPreco(subtotal);
    }

    // Bloco "Resumo do cálculo"
    if (subtotalResumo) {
      subtotalResumo.textContent = `R$ ${formataPreco(subtotal)}`;
    }
    if (totalResumo) {
      totalResumo.textContent = `R$ ${formataPreco(subtotal)}`;
    }

    // Linha "Valor total" embaixo
    if (totalAntigoLinhaFinal && valorAntigoEl) {
      totalAntigoLinhaFinal.textContent = valorAntigoEl.textContent;
    }

    console.log("Totais atualizados. Qtd:", qtd, "Subtotal:", subtotal);
  }

  // 8. Eventos dos botões + e -
  if (btnMais && campoQtd) {
    btnMais.addEventListener("click", () => {
      let qtd = parseInt(campoQtd.textContent) || 1;
      campoQtd.textContent = qtd + 1;
      atualizarTotais();
    });
  }

  if (btnMenos && campoQtd) {
    btnMenos.addEventListener("click", () => {
      let qtd = parseInt(campoQtd.textContent) || 1;
      if (qtd > 1) {
        campoQtd.textContent = qtd - 1;
        atualizarTotais();
      }
    });
  }

  // 9. Botão da lixeira
  const btnRemover = document.querySelector(".remover");
  const cardProduto = document.querySelector(".produto");

  if (btnRemover && cardProduto) {
    btnRemover.addEventListener("click", () => {
      // apaga as duas possíveis chaves usadas na página do produto
      localStorage.removeItem("compra");
      localStorage.removeItem("produto");

      cardProduto.remove();

      if (campoQtd) campoQtd.textContent = "1";
      if (precoNovoCard) precoNovoCard.textContent = "0,00";
      if (subtotalResumo) subtotalResumo.textContent = "R$ 0,00";
      if (totalResumo) totalResumo.textContent = "R$ 0,00";
      if (totalAntigoLinhaFinal) totalAntigoLinhaFinal.textContent = "R$ 0,00";

      console.log("Carrinho limpo.");
    });
  }

  // 10. Atualiza tudo uma vez ao carregar
  atualizarTotais();
});
