// concluida.js - Página de Compra Concluída

class PaginaConcluida {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎉 Página de compra concluída inicializada!');
        this.setupAnimacoes();
        this.setupInteracoes();
        this.gerarDadosPedido();
    }

    setupAnimacoes() {
        // Animação de entrada dos elementos
        setTimeout(() => {
            const elementos = document.querySelectorAll('.sucesso-icone, .titulo-concluida, .mensagem-confirmacao, .resumo-pedido, .botoes-acao');
            
            elementos.forEach((elemento, index) => {
                setTimeout(() => {
                    elemento.style.opacity = '0';
                    elemento.style.transform = 'translateY(20px)';
                    elemento.style.transition = 'all 0.6s ease';
                    
                    setTimeout(() => {
                        elemento.style.opacity = '1';
                        elemento.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 200);
            });
        }, 500);
    }

    setupInteracoes() {
        // Efeitos hover nos botões
        const botoes = document.querySelectorAll('.btn-voltar-home, .btn-acompanhar-pedido');
        
        botoes.forEach(botao => {
            botao.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });

            botao.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Copiar número do pedido
        this.setupCopiarNumeroPedido();
    }

    setupCopiarNumeroPedido() {
        const numeroPedido = document.querySelector('.valor');
        
        if (numeroPedido) {
            numeroPedido.style.cursor = 'pointer';
            numeroPedido.title = 'Clique para copiar';
            
            numeroPedido.addEventListener('click', () => {
                const texto = numeroPedido.textContent;
                navigator.clipboard.writeText(texto).then(() => {
                    this.mostrarNotificacao('Número do pedido copiado!', 'success');
                }).catch(err => {
                    console.error('Erro ao copiar:', err);
                });
            });
        }
    }

    gerarDadosPedido() {
        // Gerar número do pedido único
        const numeroPedido = `#BULBE-${Date.now().toString().slice(-6)}`;
        const elementoNumero = document.querySelector('.info-pedido .valor');
        
        if (elementoNumero) {
            elementoNumero.textContent = numeroPedido;
        }

        // Atualizar data atual
        const dataElemento = document.querySelectorAll('.info-pedido .valor')[1];
        if (dataElemento) {
            dataElemento.textContent = new Date().toLocaleDateString('pt-BR');
        }
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.textContent = mensagem;
        
        Object.assign(notificacao.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: tipo === 'error' ? '#f44336' : tipo === 'success' ? '#26D07C' : '#2196F3',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notificacao.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notificacao.parentNode) {
                    notificacao.parentNode.removeChild(notificacao);
                }
            }, 300);
        }, 3000);
    }
}

// Função global para acompanhar pedido
function acompanharPedido() {
    const numeroPedido = document.querySelector('.info-pedido .valor').textContent;
    alert(`Você será redirecionado para acompanhar o pedido: ${numeroPedido}`);
    // Aqui você pode redirecionar para a página de acompanhamento
}

// INICIALIZAR TUDO
document.addEventListener('DOMContentLoaded', function() {
    const paginaConcluida = new PaginaConcluida();
    console.log('✅ Página de compra concluída carregada com sucesso!');
    
    // Adicionar estilos de cursor pointer
    const style = document.createElement('style');
    style.textContent = `
        .btn-voltar-home { cursor: pointer !important; }
        .btn-acompanhar-pedido { cursor: pointer !important; }
        .btn-abrir-menu { cursor: pointer !important; }
        .info-pedido .valor:hover { opacity: 0.8; }
    `;
    document.head.appendChild(style);
});