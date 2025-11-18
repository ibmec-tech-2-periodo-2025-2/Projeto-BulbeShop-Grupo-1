// Sistema Completo do Carrinho + Fluxo Negativo
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Adicionar produto ao carrinho da HOME
function adicionarAoCarrinhoHome(produto) {
    const produtoExistente = carrinho.find(item => item.id === produto.id);
    
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    mostrarNotificacao('Produto adicionado ao carrinho!');
}

// Atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const contadores = document.querySelectorAll('.contador-carrinho');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    contadores.forEach(contador => {
        if (contador) {
            contador.textContent = totalItens;
            contador.style.display = totalItens > 0 ? 'flex' : 'none';
        }
    });
}

// Notificação
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao-carrinho';
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: #12B76A;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notificacao.remove();
        }, 300);
    }, 3000);
}

// FLUXO NEGATIVO - Sistema de Problemas
function abrirFluxoNegativo() {
    const modal = document.createElement('div');
    modal.className = 'modal-fluxo-negativo';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div class="modal-conteudo-fluxo" style="
            background: white;
            padding: 24px;
            border-radius: 16px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        ">
            <div class="modal-header-fluxo" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            ">
                <h3 style="color: #08068D; font-size: 20px; font-weight: 700;">Precisa de Ajuda?</h3>
                <button onclick="fecharModalFluxo()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                ">×</button>
            </div>
            
            <div class="opcoes-ajuda-fluxo">
                <div class="opcao-fluxo" onclick="selecionarOpcaoFluxo('devolucao')" style="
                    padding: 16px;
                    border: 2px solid #f0f0f0;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                ">
                    <h4 style="color: #08068D; font-size: 16px; margin-bottom: 4px;">📦 Devolução/Troca</h4>
                    <p style="font-size: 13px; color: #666;">Solicitar devolução ou troca de produto</p>
                </div>
                
                <div class="opcao-fluxo" onclick="selecionarOpcaoFluxo('problema')" style="
                    padding: 16px;
                    border: 2px solid #f0f0f0;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                ">
                    <h4 style="color: #08068D; font-size: 16px; margin-bottom: 4px;">🔧 Problema com Produto</h4>
                    <p style="font-size: 13px; color: #666;">Produto com defeito ou não funciona</p>
                </div>
                
                <div class="opcao-fluxo" onclick="selecionarOpcaoFluxo('atraso')" style="
                    padding: 16px;
                    border: 2px solid #f0f0f0;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                ">
                    <h4 style="color: #08068D; font-size: 16px; margin-bottom: 4px;">⏰ Atraso na Entrega</h4>
                    <p style="font-size: 13px; color: #666;">Pedido com entrega atrasada</p>
                </div>
                
                <div class="opcao-fluxo" onclick="selecionarOpcaoFluxo('outro')" style="
                    padding: 16px;
                    border: 2px solid #f0f0f0;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                ">
                    <h4 style="color: #08068D; font-size: 16px; margin-bottom: 4px;">❓ Outro Problema</h4>
                    <p style="font-size: 13px; color: #666;">Outro tipo de problema ou dúvida</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Efeitos hover
    const opcoes = modal.querySelectorAll('.opcao-fluxo');
    opcoes.forEach(opcao => {
        opcao.addEventListener('mouseenter', function() {
            this.style.borderColor = '#08068D';
            this.style.backgroundColor = '#f8f9ff';
            this.style.transform = 'translateY(-2px)';
        });
        opcao.addEventListener('mouseleave', function() {
            this.style.borderColor = '#f0f0f0';
            this.style.backgroundColor = 'white';
            this.style.transform = 'translateY(0)';
        });
    });
}

function fecharModalFluxo() {
    const modal = document.querySelector('.modal-fluxo-negativo');
    if (modal) {
        modal.remove();
    }
}

function selecionarOpcaoFluxo(tipo) {
    fecharModalFluxo();
    
    // Salvar o tipo de problema no localStorage
    localStorage.setItem('tipoProblema', tipo);
    
    // Redirecionar para página de suporte
    window.location.href = './pages/suporte.html';
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-fluxo-negativo')) {
        fecharModalFluxo();
    }
});

// Inicializar sistema
document.addEventListener('DOMContentLoaded', function() {
    atualizarContadorCarrinho();
});

// Animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);