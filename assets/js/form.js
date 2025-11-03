const enviar = document.getElementsByClassName("btn-finalizar")[0];

enviar.addEventListener("click", () =>{
    const dados = {
        nome: document.getElementById("nome").value,
        endereco: document.getElementById("endereco").value,
        cep: document.getElementById("cep").value,
        cpf: document.getElementById("cpf").value,
        celular: document.getElementById("celular").value,
        email: document.getElementById("email").value
    };

    const dadosJSON = JSON.stringify(dados);

    localStorage.setItem('dadosEntrega', dadosJSON);

})