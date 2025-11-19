// Sistema do Carrinho - SIMPLES E FUNCIONAL
console.log('🛒 Carrinho-completo.js carregado!');

// Inicializar carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// CORREÇÃO: Verificar se CSS já foi adicionado para evitar duplicação
if (!document.querySelector('#carrinho-completo-styles')) {
    const style = document.createElement('style');
    style.id = 'carrinho-completo-styles';
    style.textContent = `
        .contador-carrinho {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #FF9E1B;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 10px;
            display: none;
            justify-content: center;
            align-items: center;
            font-weight: bold;
        }
        
        .notificacao-carrinho {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #12B76A;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// FUNÇÃO PRINCIPAL - Adicionar ao carrinho (VERSÃO CORRIGIDA PARA IMAGENS)
window.adicionarAoCarrinho = function(produto) {
    console.log('🎯 ADICIONANDO PRODUTO:', produto);
    
    // Recarregar carrinho do localStorage
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verificar se produto é válido
    if (!produto || !produto.id) {
        console.error('❌ Produto inválido:', produto);
        return false;
    }
    
    // CORREÇÃO ESPECÍFICA PARA IMAGENS - Converter caminhos relativos
    let imagemCorrigida = produto.imagem || produto.imagen || '';
    
    // CORREÇÃO DEFINITIVA: Ajustar todos os cenários de caminho de imagem
    if (imagemCorrigida) {
        // Se começar com ./, manter como está
        if (imagemCorrigida.startsWith('./')) {
            // Já está correto
        }
        // Se começar com ../, converter para ./
        else if (imagemCorrigida.startsWith('../')) {
            imagemCorrigida = '.' + imagemCorrigida;
        }
        // Se não tiver prefixo, adicionar ./
        else if (!imagemCorrigida.startsWith('http') && !imagemCorrigida.startsWith('/')) {
            imagemCorrigida = './' + imagemCorrigida;
        }
        
        console.log('🖼️ Caminho da imagem corrigido:', imagemCorrigida);
    } else {
        // Imagem padrão se não houver
        imagemCorrigida = './assets/img/produtos/sem-imagem.jpg';
    }
    
    const produtoFormatado = {
        id: produto.id,
        nome: produto.nome || produto.none || 'Produto sem nome',
        preco: Number(produto.preco) || 0,
        imagem: imagemCorrigida, // USAR A IMAGEM CORRIGIDA
        quantidade: 1
    };
    
    // Buscar produto existente
    const produtoExistente = carrinho.find(item => item.id === produtoFormatado.id);
    
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
        console.log('📈 Quantidade aumentada para:', produtoExistente.quantidade);
    } else {
        // Adicionar novo produto
        carrinho.push(produtoFormatado);
        console.log('🆕 Novo produto adicionado:', produtoFormatado.nome);
    }
    
    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    console.log('💾 Carrinho salvo:', carrinho);
    
    // Atualizar contador
    atualizarContadorCarrinho();
    
    // Mostrar notificação
    mostrarNotificacao('✅ ' + produtoFormatado.nome + ' adicionado ao carrinho!');
    
    return true;
};

// Atualizar contador
function atualizarContadorCarrinho() {
    // CORREÇÃO: Recarregar carrinho para garantir dados atualizados
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
    
    console.log('🔢 Total de itens no carrinho:', totalItens);
    
    const contadores = document.querySelectorAll('.contador-carrinho');
    contadores.forEach(contador => {
        if (contador) {
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    });
    
    // CORREÇÃO: Atualizar também no sessionStorage para sincronização entre páginas
    sessionStorage.setItem('ultimaAtualizacaoCarrinho', Date.now());
    
    return totalItens;
}

// Notificação simples
function mostrarNotificacao(mensagem) {
    // Remover notificação existente
    const notificacaoExistente = document.querySelector('.notificacao-carrinho');
    if (notificacaoExistente) {
        notificacaoExistente.remove();
    }
    
    // Criar nova notificação
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao-carrinho';
    notificacao.textContent = mensagem;
    
    document.body.appendChild(notificacao);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.remove();
        }
    }, 3000);
}

// CORREÇÃO: Função para obter carrinho atualizado
window.obterCarrinho = function() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
};

// CORREÇÃO: Função para limpar carrinho
window.limparCarrinho = function() {
    carrinho = [];
    localStorage.setItem('carrinho', JSON.stringify([]));
    atualizarContadorCarrinho();
    console.log('🗑️ Carrinho limpo!');
};

// CORREÇÃO: Função para remover item específico
window.removerDoCarrinho = function(idProduto) {
    carrinho = carrinho.filter(item => item.id !== idProduto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    console.log('❌ Produto removido:', idProduto);
};

// Funções do Menu
window.abrirMenu = function() {
    const menuLateral = document.getElementById('menu-lateral');
    const overlay = document.querySelector('.overlay');
    if (menuLateral && overlay) {
        menuLateral.classList.add('ativo');
        overlay.classList.add('ativo');
        document.body.style.overflow = 'hidden'; // CORREÇÃO: Previne scroll
    }
};

window.fecharMenu = function() {
    const menuLateral = document.getElementById('menu-lateral');
    const overlay = document.querySelector('.overlay');
    if (menuLateral && overlay) {
        menuLateral.classList.remove('ativo');
        overlay.classList.remove('ativo');
        document.body.style.overflow = ''; // CORREÇÃO: Restaura scroll
    }
};

// Fluxo Negativo
window.abrirFluxoNegativo = function() {
    alert('Sistema de ajuda - Em desenvolvimento');
};

// CORREÇÃO: Sincronizar entre abas/Janelas
window.addEventListener('storage', function(e) {
    if (e.key === 'carrinho') {
        console.log('🔄 Carrinho atualizado em outra aba, sincronizando...');
        carrinho = JSON.parse(e.newValue) || [];
        atualizarContadorCarrinho();
    }
});

// CORREÇÃO: Verificar atualizações periódicas
setInterval(() => {
    const ultimaAtualizacao = sessionStorage.getItem('ultimaAtualizacaoCarrinho');
    if (ultimaAtualizacao) {
        atualizarContadorCarrinho();
    }
}, 1000);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página carregada - Inicializando carrinho');
    
    // CORREÇÃO: Garantir que o carrinho está atualizado
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    atualizarContadorCarrinho();
    
    // Debug: Verificar se função está disponível
    console.log('✅ adicionarAoCarrinho disponível:', typeof window.adicionarAoCarrinho);
    console.log('📦 Itens no carrinho:', carrinho.length);
    console.log('🔍 Detalhes do carrinho:', carrinho);
});

// CORREÇÃO: Exportar funções para uso global
window.atualizarContadorCarrinho = atualizarContadorCarrinho;
window.mostrarNotificacao = mostrarNotificacao;