const produtos = [
  { id: 1, nome: "Lâmpada Super Bulbo LED", preco: "R$ 99,99", pagina: "pages/produtos.html", img: "./assets/img/produtos/lampada4.png" },
  { id: 2, nome: "Cadeira 4 Pernas Forro Branco", preco: "R$ 35,80", pagina: "pages/produtos.html", img: "./assets/img/produtos/cadeira.png" },
  { id: 3, nome: "Abajur Base de Cobre", preco: "R$ 15,75", pagina: "pages/produtos.html", img: "./assets/img/produtos/abajur.png" }
];

const input = document.querySelector(".conteiner-pesquisa input");
const dropdown = document.querySelector(".dropdown-pesquisa");

input.addEventListener("input", () => {
    const texto = input.value.toLowerCase().trim();

    if (texto === "") {
        dropdown.style.display = "none";
        return;
    }

    let resultados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(texto)
    );

    if (resultados.length === 0) {
        dropdown.innerHTML = `<p class="dropdown-vazio">Nenhum produto encontrado...</p>`;
        dropdown.style.display = "block";
        return;
    }

    dropdown.innerHTML = "";

    resultados.forEach(produto => {
        const item = document.createElement("div");
        item.classList.add("dropdown-item");

        item.innerHTML = `
            <img src="${produto.img}">
            <p>${produto.nome}</p>
        `;

        item.onclick = () => window.location.href = produto.pagina;

        dropdown.appendChild(item);
    });

    dropdown.style.display = "flex";
});

// Fechar dropdown ao clicar fora
document.addEventListener("click", (e) => {
    if (!document.querySelector(".conteiner-pesquisa").contains(e.target)) {
        dropdown.style.display = "none";
    }
});