const inputCep = document.getElementById("cep");
const dados = JSON.parse(localStorage.getItem('dadosEntrega'));

if (inputCep && dados) {
    inputCep.textContent = dados.cep;
}

class Checkout {
    constructor() {
        this.cupomAplicado = false;
        this.codigoCupomAtual = '';
        this.descontoAtual = 0;
        this.freteAtual = 0;
        this.subtotal = 0;
        this.tempoRestante = 900;
        this.timerInterval = null;
        this.carrinho = [];
        this.init();
    }

    init() {
        console.log('🎯 Iniciando sistema de checkout...');
        this.carregarCarrinho(); // CORREÇÃO: Carregar carrinho primeiro
        this.setupOpcoesEnvio();
        this.setupMetodosPagamento();
        this.setupCupom();
        this.setupFinalizarCompra();
        this.setupModalPix();
        this.setupSeletorCep();
        this.selecionarPrimeiraOpcaoEnvio();
        this.atualizarResumo();
    }

   // CORREÇÃO: Carregar produtos do carrinho COM CÁLCULO CORRETO
        // CORREÇÃO DEFINITIVA: Carregar produtos do carrinho COM CÁLCULO CORRETO
carregarCarrinho() {
    this.carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log('🛒 Carrinho carregado:', this.carrinho);
    
    // CORREÇÃO: Zerar o subtotal antes de calcular
    this.subtotal = 0;
    
    // CORREÇÃO: Calcular subtotal CORRETAMENTE somando todos os produtos
    this.carrinho.forEach(produto => {
        const precoProduto = Number(produto.preco) || 0;
        const quantidade = Number(produto.quantidade) || 1;
        const subtotalProduto = precoProduto * quantidade;
        
        console.log(`💰 Produto: ${produto.nome} | Preço: R$ ${precoProduto} | Qtd: ${quantidade} | Subtotal: R$ ${subtotalProduto}`);
        
        this.subtotal += subtotalProduto;
    });
    
    console.log('💰 Subtotal TOTAL calculado:', this.subtotal);
    
    // CORREÇÃO: Forçar atualização do resumo
    this.atualizarResumo();
    
    // Mostrar produtos no checkout
    this.mostrarProdutosNoCheckout();
}

    // CORREÇÃO: Mostrar produtos no checkout
    mostrarProdutosNoCheckout() {
        const produtoSection = document.querySelector('.produto-section');
        
        if (!produtoSection) {
            console.error('❌ Seção de produtos não encontrada');
            return;
        }

        // Limpar seção de produtos
        produtoSection.innerHTML = '';

        if (this.carrinho.length === 0) {
            produtoSection.innerHTML = `
                <div class="carrinho-vazio-checkout">
                    <p>Nenhum produto no carrinho</p>
                    <button onclick="window.location.href = '../index.html'">Continuar Comprando</button>
                </div>
            `;
            return;
        }

        // Mostrar todos os produtos do carrinho
        this.carrinho.forEach((produto, index) => {
            const precoTotal = produto.preco * produto.quantidade;
            
            // CORREÇÃO: Ajustar caminho da imagem para o checkout
            let imagemCorrigida = produto.imagem;
            if (imagemCorrigida && imagemCorrigida.startsWith('./')) {
                imagemCorrigida = '..' + imagemCorrigida.substring(1);
            }
            
            const produtoElement = document.createElement('div');
            produtoElement.className = 'produto-completo';
            produtoElement.innerHTML = `
                <div class="produto-imagem">
                    <img src="${imagemCorrigida}" alt="${produto.nome}" class="foto-produto" 
                         onerror="this.src='../assets/img/produtos/sem-imagem.jpg'">
                </div>
                <div class="produto-info">
                    <div class="produto-header">
                        <h1>${produto.nome}</h1>
                        <p class="produto-descricao">Quantidade: ${produto.quantidade}</p>
                        <div class="produto-preco-marca">
                            <span class="preco-atual">R$ ${precoTotal.toFixed(2)}</span>
                            <span class="marca-produto">(R$ ${produto.preco.toFixed(2)} cada)</span>
                        </div>
                    </div>
                </div>
            `;
            
            produtoSection.appendChild(produtoElement);
            
            // Adicionar divisor entre produtos (exceto para o último)
            if (index < this.carrinho.length - 1) {
                const divisor = document.createElement('div');
                divisor.className = 'divisor';
                produtoSection.appendChild(divisor);
            }
        });
    }

    // ATUALIZAR RESUMO DO PEDIDO (CORRIGIDO)
    atualizarResumo() {
        const valorSubtotal = document.querySelector('.valor-subtotal');
        const valorFrete = document.querySelector('.valor-frete');
        const valorTotal = document.querySelector('.valor-total');
        const descontoLinha = document.querySelector('.desconto-linha');

        if (valorSubtotal) {
            valorSubtotal.textContent = `R$ ${this.subtotal.toFixed(2)}`;
        }

        if (valorFrete) {
            valorFrete.textContent = `R$ ${this.freteAtual.toFixed(2)}`;
        }

        let total = this.subtotal + this.freteAtual;
        
        if (this.cupomAplicado) {
            const desconto = total * this.descontoAtual;
            total -= desconto;
            
            if (descontoLinha) {
                descontoLinha.style.display = 'flex';
                const valorDesconto = descontoLinha.querySelector('.valor-desconto');
                if (valorDesconto) {
                    valorDesconto.textContent = `-R$ ${desconto.toFixed(2)}`;
                }
            }
        } else {
            if (descontoLinha) {
                descontoLinha.style.display = 'none';
            }
        }

        if (valorTotal) {
            valorTotal.textContent = `R$ ${total.toFixed(2)}`;
            this.animarAtualizacaoTotal();
        }
    }

    animarAtualizacaoTotal() {
        const totalElement = document.querySelector('.valor-total');
        if (totalElement) {
            totalElement.style.transform = 'scale(1.1)';
            totalElement.style.color = '#08068D';
            setTimeout(() => {
                totalElement.style.transform = 'scale(1)';
                totalElement.style.color = '#08068D';
            }, 300);
        }
    }

    // OPÇÕES DE ENVIO (mantido igual)
    setupOpcoesEnvio() {
        const opcoesEnvio = document.querySelectorAll('.envio-opcao');
        
        opcoesEnvio.forEach(opcao => {
            opcao.addEventListener('click', (e) => {
                e.preventDefault();
                const tipoEnvio = opcao.dataset.envio;
                console.log(`🚚 Opção de envio clicada: ${tipoEnvio}`);
                
                this.selecionarOpcaoEnvio(opcao, tipoEnvio);
            });

            opcao.addEventListener('mouseenter', () => {
                if (!opcao.classList.contains('ativo')) {
                    opcao.style.transform = 'translateY(-2px)';
                    opcao.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }
            });

            opcao.addEventListener('mouseleave', () => {
                if (!opcao.classList.contains('ativo')) {
                    opcao.style.transform = 'translateY(0)';
                    opcao.style.boxShadow = 'none';
                }
            });
        });
    }

    selecionarOpcaoEnvio(opcaoSelecionada, tipoEnvio) {
        const todasOpcoes = document.querySelectorAll('.envio-opcao');
        
        todasOpcoes.forEach(opcao => {
            opcao.classList.remove('ativo');
            opcao.style.background = '#fff';
            opcao.style.borderColor = '#e0e0e0';
            const radioCircle = opcao.querySelector('.radio-circle');
            if (radioCircle) {
                radioCircle.style.background = '#fff';
                radioCircle.style.borderColor = '#ddd';
            }
        });
        
        opcaoSelecionada.classList.add('ativo');
        opcaoSelecionada.style.background = '#f8f9ff';
        opcaoSelecionada.style.borderColor = '#08068D';
        
        const radioCircle = opcaoSelecionada.querySelector('.radio-circle');
        if (radioCircle) {
            radioCircle.style.background = '#08068D';
            radioCircle.style.borderColor = '#08068D';
        }
        
        this.freteAtual = tipoEnvio === 'expresso' ? 15.90 : 0.00;
        this.atualizarResumo();
        
        const nomeEnvio = tipoEnvio === 'expresso' ? 'Expressa' : 'Padrão';
        this.mostrarNotificacao(`Entrega ${nomeEnvio} selecionada`);
    }

    selecionarPrimeiraOpcaoEnvio() {
        setTimeout(() => {
            const primeiraOpcao = document.querySelector('.envio-opcao[data-envio="padrao"]');
            if (primeiraOpcao && !document.querySelector('.envio-opcao.ativo')) {
                this.selecionarOpcaoEnvio(primeiraOpcao, 'padrao');
            }
        }, 500);
    }

    // MÉTODOS DE PAGAMENTO (mantido igual)
    setupMetodosPagamento() {
        const metodos = document.querySelectorAll('.metodo');
        
        metodos.forEach(metodo => {
            metodo.addEventListener('click', (e) => {
                e.preventDefault();
                const tipoPagamento = metodo.dataset.metodo;
                console.log(`💳 Método de pagamento clicado: ${tipoPagamento}`);
                
                this.selecionarMetodoPagamento(metodo, tipoPagamento);
            });

            metodo.addEventListener('mouseenter', () => {
                if (!metodo.classList.contains('ativo')) {
                    metodo.style.transform = 'translateY(-2px)';
                    metodo.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }
            });

            metodo.addEventListener('mouseleave', () => {
                if (!metodo.classList.contains('ativo')) {
                    metodo.style.transform = 'translateY(0)';
                    metodo.style.boxShadow = 'none';
                }
            });
        });
    }

    selecionarMetodoPagamento(metodoSelecionado, tipoPagamento) {
        const todosMetodos = document.querySelectorAll('.metodo');
        
        todosMetodos.forEach(metodo => {
            metodo.classList.remove('ativo');
            metodo.style.background = '#fff';
            metodo.style.color = '#536679';
            
            const img = metodo.querySelector('img');
            if (img) {
                if (metodo.dataset.metodo === 'cartao') {
                    img.style.filter = 'brightness(0) saturate(100%) invert(33%) sepia(15%) saturate(1000%) hue-rotate(170deg) brightness(90%) contrast(85%)';
                } else if (metodo.dataset.metodo === 'pix') {
                    img.style.filter = 'brightness(0) saturate(100%) invert(33%) sepia(15%) saturate(1000%) hue-rotate(170deg) brightness(90%) contrast(85%)';
                } else if (metodo.dataset.metodo === 'boleto') {
                    img.style.filter = 'brightness(0) saturate(100%) invert(33%) sepia(15%) saturate(1000%) hue-rotate(170deg) brightness(90%) contrast(85%)';
                }
            }
        });
        
        metodoSelecionado.classList.add('ativo');
        metodoSelecionado.style.background = '#08068D';
        metodoSelecionado.style.color = '#fff';
        
        const img = metodoSelecionado.querySelector('img');
        if (img) {
            img.style.filter = 'brightness(0) invert(1)';
        }
        
        metodoSelecionado.style.transform = 'scale(0.95)';
        setTimeout(() => {
            metodoSelecionado.style.transform = 'scale(1)';
        }, 150);
        
        this.processarMetodoPagamento(tipoPagamento);
    }

    processarMetodoPagamento(tipoPagamento) {
        switch(tipoPagamento) {
            case 'pix':
                this.mostrarNotificacao('PIX selecionado - Clique novamente para ver QR Code');
                break;
            case 'cartao':
                this.mostrarNotificacao('Cartão selecionado - Formulário será aberto');
                break;
            case 'boleto':
                this.mostrarNotificacao('Boleto selecionado - Será gerado em breve');
                break;
        }
    }

    // CUPOM (mantido igual)
    setupCupom() {
        const btnAplicarCupom = document.querySelector('.btn-aplicar-cupom');
        const inputCupom = document.querySelector('#cupom');
        
        if (btnAplicarCupom && inputCupom) {
            btnAplicarCupom.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎫 Aplicar cupom clicado');
                
                this.aplicarCupom(inputCupom.value);
            });
            
            inputCupom.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.aplicarCupom(inputCupom.value);
                }
            });

            inputCupom.placeholder = "Adicione seu cupom";
        }
    }

    aplicarCupom(codigoCupom) {
        if (!codigoCupom.trim()) {
            this.mostrarNotificacao('Digite um código de cupom', 'error');
            return;
        }

        if (this.cupomAplicado) {
            this.mostrarNotificacao('Cupom já foi aplicado anteriormente', 'info');
            return;
        }

        console.log(`🎫 Aplicando cupom: ${codigoCupom}`);
        
        const cuponsValidos = {
            'PRIMEIRA COMPRA': 0.15, // 15% de desconto
            'BULBE10': 0.1,
            'DESCONTO20': 0.2
        };

        const desconto = cuponsValidos[codigoCupom.toUpperCase()];
        
        if (desconto) {
            this.cupomAplicado = true;
            this.codigoCupomAtual = codigoCupom.toUpperCase();
            this.descontoAtual = desconto;
            this.atualizarResumo();
            this.desativarCupom();
            
            this.mostrarNotificacao(`🎉 Cupom "${codigoCupom}" aplicado! ${desconto * 100}% de desconto`, 'success');
        } else {
            this.mostrarNotificacao('Cupom inválido', 'error');
        }
    }

    desativarCupom() {
        const btnAplicarCupom = document.querySelector('.btn-aplicar-cupom');
        const inputCupom = document.querySelector('#cupom');
        
        if (btnAplicarCupom) {
            btnAplicarCupom.textContent = 'Cupom Aplicado ✓';
            btnAplicarCupom.classList.add('desativado');
            btnAplicarCupom.disabled = true;
        }
        
        if (inputCupom) {
            inputCupom.disabled = true;
            inputCupom.value = this.codigoCupomAtual;
        }
    }

    // FINALIZAR COMPRA (CORRIGIDO)
    setupFinalizarCompra() {
        const btnFinalizar = document.querySelector('.finalizar-compra-btn');
        
        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🛒 Finalizar compra clicado');
                
                this.finalizarCompra();
            });
        }
    }

    finalizarCompra() {
        const metodoAtivo = document.querySelector('.metodo.ativo');
        const envioAtivo = document.querySelector('.envio-opcao.ativo');
        
        if (!metodoAtivo) {
            this.mostrarNotificacao('Selecione um método de pagamento', 'error');
            return;
        }

        if (!envioAtivo) {
            this.mostrarNotificacao('Selecione uma opção de envio', 'error');
            return;
        }

        // CORREÇÃO: Verificar se há produtos no carrinho
        if (this.carrinho.length === 0) {
            this.mostrarNotificacao('Seu carrinho está vazio', 'error');
            return;
        }

        const metodoPagamento = metodoAtivo.dataset.metodo;
        const tipoEnvio = envioAtivo.dataset.envio;
        
        console.log('✅ Finalizando compra:', { 
            metodoPagamento, 
            tipoEnvio,
            produtos: this.carrinho,
            total: this.subtotal + this.freteAtual
        });
        
        // Salvar dados da compra no localStorage para usar na página de conclusão
        const dadosCompra = {
            metodoPagamento: metodoPagamento,
            tipoEnvio: tipoEnvio,
            produtos: this.carrinho,
            subtotal: this.subtotal,
            frete: this.freteAtual,
            total: this.subtotal + this.freteAtual,
            data: new Date().toISOString(),
            numeroPedido: `BULBE-${Date.now().toString().slice(-6)}`
        };
        localStorage.setItem('ultimaCompra', JSON.stringify(dadosCompra));
        
        this.simularProcessamento(metodoPagamento, tipoEnvio);
    }

    simularProcessamento(metodoPagamento, tipoEnvio) {
        const btnFinalizar = document.querySelector('.finalizar-compra-btn');
        const textoOriginal = btnFinalizar.textContent;
        
        btnFinalizar.textContent = '⏳ Processando...';
        btnFinalizar.disabled = true;
        btnFinalizar.style.background = '#536679';
        btnFinalizar.style.cursor = 'not-allowed';
        
        // Simular processamento do pagamento
        setTimeout(() => {
            this.mostrarNotificacao('🎊 Compra realizada com sucesso!', 'success');
            
            btnFinalizar.textContent = '✅ Redirecionando...';
            btnFinalizar.style.background = '#26D07C';
            
            // CORREÇÃO: Limpar carrinho após compra concluída
            localStorage.removeItem('carrinho');
            
            // Redirecionar para a página de compra concluída após 2 segundos
            setTimeout(() => {
                window.location.href = 'concluida.html';
            }, 2000);
            
        }, 3000);
    }

    // ... (restante do código mantido igual - setupModalPix, mostrarModalPix, etc.)

    // NOTIFICAÇÕES (mantido igual)
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
        }, 4000);
    }
}

// REMOVER CÓDIGO ANTIGO (substituir pelas novas funções)
// INICIALIZAR TUDO
document.addEventListener('DOMContentLoaded', function() {
    const checkout = new Checkout();
    console.log('✅ Sistema de checkout inicializado com sucesso!');
    
    const style = document.createElement('style');
    style.textContent = `
        .envio-opcao { cursor: pointer !important; }
        .metodo { cursor: pointer !important; }
        .btn-aplicar-cupom { cursor: pointer !important; }
        .finalizar-compra-btn { cursor: pointer !important; }
        .modal-fechar { cursor: pointer !important; }
        .btn-copiar-codigo { cursor: pointer !important; }
        .select-cep { cursor: pointer !important; }
        .btn-abrir-menu { cursor: pointer !important; }
        
        .carrinho-vazio-checkout {
            text-align: center;
            padding: 40px 20px;
            color: #666;
            background: white;
            border-radius: 12px;
            margin: 20px 0;
            border: 2px dashed #ddd;
        }
        
        .carrinho-vazio-checkout p {
            margin-bottom: 16px;
            font-size: 16px;
            color: #888;
        }
        
        .carrinho-vazio-checkout button {
            background: #08068D;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
});