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

    localStorage.setItem('dadosEntrega', JSON.stringify(dados));

    console.log('Dados salvos:', dados);


})