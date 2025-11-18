// Sistema do Carrinho - Página do Carrinho (FUNCIONANDO 100%)
// CORREÇÃO: Removida declaração duplicada da variável 'style'

document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 Carregando carrinho...');
    carregarCarrinho();
    atualizarDataAtual();
});

// Carregar produtos do carrinho - VERSÃO CORRIGIDA IMAGENS
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const container = document.querySelector('.conteiner-produto');
    
    console.log('🛒 Produtos no carrinho:', carrinho);
    
    // SEMPRE limpar o container primeiro
    if (container) {
        container.innerHTML = '';
    } else {
        console.error('❌ Container de produtos não encontrado!');
        return;
    }
    
    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="carrinho-vazio">
                <p>Seu carrinho está vazio</p>
                <button onclick="window.location.href = '../index.html'">Continuar Comprando</button>
            </div>
        `;
        atualizarTotais();
        return;
    }
    
    carrinho.forEach((produto, index) => {
        const precoOriginal = produto.preco * 1.2;
        const precoTotal = produto.preco * produto.quantidade;
        const precoOriginalTotal = precoOriginal * produto.quantidade;
        
        // CORREÇÃO DEFINITIVA PARA IMAGENS NO CARRINHO
        let imagemCorrigida = produto.imagem;
        
        // Converter caminhos para funcionar na página do carrinho
        if (imagemCorrigida) {
            // Se estiver na página carrinho.html e a imagem começar com ./, ajustar
            if (window.location.pathname.includes('carrinho.html') && imagemCorrigida.startsWith('./')) {
                imagemCorrigida = '..' + imagemCorrigida.substring(1);
            }
            // Se começar com ../, manter (já está correto para carrinho.html)
            else if (imagemCorrigida.startsWith('../')) {
                // Já está correto para carrinho.html
            }
        } else {
            imagemCorrigida = '../assets/img/produtos/sem-imagem.jpg';
        }
        
        console.log('🖼️ Exibindo produto:', produto.nome, 'Imagem:', imagemCorrigida);
        
        const produtoElement = document.createElement('div');
        produtoElement.className = 'produto';
        produtoElement.innerHTML = `
            <div class="linha-produto"></div>
            <img src="${imagemCorrigida}" alt="${produto.nome}" 
                 onerror="this.src='../assets/img/produtos/sem-imagem.jpg'; console.log('❌ Erro ao carregar imagem: ${imagemCorrigida}')">
            <div class="info-produto">
                <p class="nome">${produto.nome}</p>
                <p class="preco-antigo-prod">De R$ ${precoOriginalTotal.toFixed(2)}</p>
                <div class="controle">
                    <div class="quantidade">
                        <button class="menos" onclick="alterarQuantidade(${index}, -1)">-</button>
                        <div class="campo">${produto.quantidade}</div>
                        <button class="mais" onclick="alterarQuantidade(${index}, 1)">+</button>
                    </div>
                    <p class="preco">R$ <span class="valor">${precoTotal.toFixed(2)}</span></p>
                </div>
            </div>
            <button class="remover" onclick="removerProduto(${index})">🗑</button>
        `;
        container.appendChild(produtoElement);
    });
    
    atualizarTotais();
}

// Alterar quantidade
function alterarQuantidade(index, mudanca) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho[index]) {
        carrinho[index].quantidade += mudanca;
        
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
        
        // CORREÇÃO: Atualizar contador global após alteração
        if (typeof atualizarContadorGlobal === 'function') {
            atualizarContadorGlobal();
        }
    }
}

// Remover produto
function removerProduto(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    
    // CORREÇÃO: Atualizar contador global após remoção
    if (typeof atualizarContadorGlobal === 'function') {
        atualizarContadorGlobal();
    }
}

// Atualizar totais
function atualizarTotais() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    let subtotal = 0;
    let totalOriginal = 0;
    
    carrinho.forEach(produto => {
        const precoOriginal = produto.preco * 1.2;
        subtotal += produto.preco * produto.quantidade;
        totalOriginal += precoOriginal * produto.quantidade;
    });
    
    const totalDesconto = totalOriginal - subtotal;
    
    // CORREÇÃO: Verificar se elementos existem antes de atualizar
    const elementos = {
        'subtotal': `R$ ${subtotal.toFixed(2)}`,
        'total': `R$ ${subtotal.toFixed(2)}`,
        'valor-novo': subtotal.toFixed(2),
        'preco-antigo-total': `R$ ${totalOriginal.toFixed(2)}`,
        'total-desconto': `R$ ${totalDesconto.toFixed(2)}`
    };
    
    Object.keys(elementos).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = elementos[id];
        }
    });
    
    // Atualizar contador
    atualizarContadorGlobal();
}

// Atualizar contador global
function atualizarContadorGlobal() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
    
    const contadores = document.querySelectorAll('.contador-carrinho');
    contadores.forEach(contador => {
        if (contador) {
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    });
    
    // CORREÇÃO: Atualizar também no localStorage para outras páginas
    localStorage.setItem('totalItensCarrinho', totalItens);
    
    return totalItens;
}

// Atualizar data
function atualizarDataAtual() {
    const data = new Date();
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mesAtual = meses[data.getMonth()];
    const anoAtual = data.getFullYear().toString().slice(-2);
    
    const elementoData = document.getElementById('data-atual');
    if (elementoData) {
        elementoData.textContent = `${mesAtual}/${anoAtual}`;
    }
}

// Finalizar compra
document.addEventListener('DOMContentLoaded', function() {
    const botaoFinalizar = document.getElementById('finalizar');
    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', function() {
            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            window.location.href = './lead.html';
        });
    }
});

// CORREÇÃO: CSS - Verificar se já existe antes de adicionar
if (!document.querySelector('#carrinho-styles')) {
    const style = document.createElement('style');
    style.id = 'carrinho-styles';
    style.textContent = `
        .carrinho-vazio {
            text-align: center;
            padding: 40px 20px;
            color: #666;
            background: white;
            border-radius: 12px;
            margin: 20px 0;
            border: 2px dashed #ddd;
        }
        
        .carrinho-vazio p {
            margin-bottom: 16px;
            font-size: 16px;
            color: #888;
        }
        
        .carrinho-vazio button {
            background: #08068D;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
        }
        
        .carrinho-vazio button:hover {
            background: #06056a;
        }
        
        .produto img {
            width: 60px !important;
            height: 60px !important;
            object-fit: contain;
            border-radius: 8px;
            border: 1px solid #f0f0f0;
        }
    `;
    document.head.appendChild(style);
}

// CORREÇÃO: Exportar funções para uso global
window.alterarQuantidade = alterarQuantidade;
window.removerProduto = removerProduto;
window.carregarCarrinho = carregarCarrinho;
window.atualizarContadorGlobal = atualizarContadorGlobal;