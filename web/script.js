const titulo = document.querySelector('header h1');
const uri = 'http://localhost:3000/';
var alocacoes = [];
var automoveis = [];
var clientes = [];
var concessionarias = [];
var vendas = [];

// Elementos dos modais
const modal1 = document.getElementById('modal1');
const modal2 = document.getElementById('modal2');
const modal1Titulo = document.getElementById('modal1-titulo');
const modal1Conteudo = document.getElementById('modal1-conteudo');
const modal2Titulo = document.getElementById('modal2-titulo');
const modal2Cliente = document.getElementById('modal2-cliente');
const modal2Concessionaria = document.getElementById('modal2-concessionaria');
const confirmarVendaBtn = document.getElementById('confirmar-venda');

// Variáveis para controle
let areaSelecionada = null;
let automovelSelecionado = null;
let clienteSelecionado = null;
let concessionariaSelecionada = null;
let alocacaoSelecionada = null;

async function carregarTitulo() {
    const response = await fetch(uri);
    const data = await response.json();
    titulo.textContent = data.titulo;
}

async function carregarAlocacoes() {
    const response = await fetch(uri + 'alocacoes');
    alocacoes = await response.json();
    console.log('Alocações:', alocacoes);
}

async function carregarVendas() {
    const response = await fetch(uri + 'vendas');
    vendas = await response.json();
    console.log('Vendas:', vendas);
}

async function carregarAutomoveis() {
    const response = await fetch(uri + 'automoveis');
    automoveis = await response.json();
}

async function carregarClientes() {
    const response = await fetch(uri + 'clientes');
    clientes = await response.json();
}

async function carregarConcessionarias() {
    const response = await fetch(uri + 'concessionarias');
    concessionarias = await response.json();
}

async function montarAreas() {
    const main = document.querySelector('main');
    for (let i = 1; i <= 11; i++) {
        const area = document.createElement('div');
        area.className = 'area';
        area.id = `area-${i}`;
        
        // Verificar se a área está alocada e se foi vendida
        const areaAlocada = alocacoes.find(a => a.area === i);
        let areaVendida = false;
        if (areaAlocada) {
            const vendaExistente = vendas.find(v => v.alocacao === areaAlocada.id);
            areaVendida = !!vendaExistente;
        }
        
        // Texto da área: número + "Vendido" se for o caso
        area.innerHTML = `<p>${i}${areaVendida ? '<br><span class="vendido-texto">Vendido</span>' : ''}</p>`;
        
        if (areaAlocada) {
            // Área AZUL (alocada) - Pode vender ou mostrar info se já vendida
            area.addEventListener('click', () => abrirModalArea(i));
            area.style.cursor = 'pointer';
        } else {
            // Área BRANCA (vazia) - Não faz nada
            area.style.cursor = 'not-allowed';
        }
        
        main.appendChild(area);
    }
}

async function inicializar() {
    await carregarTitulo();
    await carregarAlocacoes();
    await carregarVendas();
    await montarAreas();
    await carregarAutomoveis();
    await carregarClientes();
    await carregarConcessionarias();
    await pintarAreas();
    configurarEventosModais();
}

async function pintarAreas(){
    document.querySelectorAll('.area').forEach(area => {
        area.classList.remove('alocado');
    });
    
    for(const alocacao of alocacoes){
        const area = document.querySelector(`#area-${alocacao.area}`);
        if (area) {
            area.classList.add('alocado');
        }
    }
}

function configurarEventosModais() {
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', fecharModais);
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal1 || event.target === modal2) {
            fecharModais();
        }
    });

    confirmarVendaBtn.addEventListener('click', confirmarVenda);
}

function abrirModalArea(areaId) {
    areaSelecionada = areaId;
    
    // Buscar a alocação desta área
    alocacaoSelecionada = alocacoes.find(a => a.area === areaId);
    
    if (alocacaoSelecionada) {
        // Verificar se já foi vendida
        const vendaExistente = vendas.find(v => v.alocacao === alocacaoSelecionada.id);
        
        if (vendaExistente) {
            // JÁ VENDIDA - Mostrar informações
            modal1Titulo.textContent = `Área ${areaId}`;
            
            const automovelArea = automoveis.find(a => a.id === alocacaoSelecionada.automovel);
            const concessionariaArea = concessionarias.find(c => c.id === alocacaoSelecionada.concessionaria);
            const clienteVenda = clientes.find(c => c.id === vendaExistente.cliente);
            
            modal1Conteudo.innerHTML = `
                <div class="info-venda">
                    <h3>Carro Vendido</h3>
                    <div class="carro-item vendido">
                        <p><strong>Modelo:</strong> ${automovelArea ? automovelArea.modelo : 'N/A'} | <strong>Preço:</strong> R$ ${automovelArea ? automovelArea.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'N/A'} <span class="status-vendido">Vendido</span></p>
                    </div>
                    <div class="detalhes-venda">
                        <p><strong>Concessionária:</strong> ${concessionariaArea ? concessionariaArea.concessionaria : 'N/A'}</p>
                        <p><strong>Cliente:</strong> ${clienteVenda ? clienteVenda.nome : 'N/A'}</p>
                        <p><strong>Data:</strong> ${new Date(vendaExistente.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
            `;
        } else {
            // NÃO VENDIDA - Mostrar lista de carros para vender
            modal1Titulo.textContent = `Área ${areaId}`;
            
            modal1Conteudo.innerHTML = '';
            
            automoveis.forEach(automovel => {
                const item = document.createElement('div');
                item.className = 'carro-item';
                item.innerHTML = `
                    <div class="carro-info">
                        <p><strong>Modelo:</strong> ${automovel.modelo} | <strong>Preço:</strong> R$ ${automovel.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <button class="vender-btn" data-automovel-id="${automovel.id}">Vender</button>
                `;
                modal1Conteudo.appendChild(item);
            });

            document.querySelectorAll('.vender-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const automovelId = e.target.getAttribute('data-automovel-id');
                    automovelSelecionado = automoveis.find(a => a.id == automovelId);
                    abrirModalConfirmacao();
                });
            });
        }
    }

    modal1.style.display = 'block';
}

function abrirModalConfirmacao() {
    if (automovelSelecionado) {
        modal2Titulo.textContent = automovelSelecionado.modelo;
        
        clienteSelecionado = null;
        concessionariaSelecionada = null;
        
        modal2Cliente.innerHTML = `
            <h6>Cliente</h6>
            <select id="select-cliente" class="form-select">
                <option value="">Selecione um cliente</option>
                ${clientes.map(cliente => 
                    `<option value="${cliente.id}">${cliente.nome}</option>`
                ).join('')}
            </select>
        `;
        
        modal2Concessionaria.innerHTML = `
            <h6>Concessionária</h6>
            <select id="select-concessionaria" class="form-select">
                <option value="">Selecione uma concessionária</option>
                ${concessionarias.map(conc => 
                    `<option value="${conc.id}">${conc.concessionaria}</option>`
                ).join('')}
            </select>
        `;
        
        document.getElementById('select-cliente').addEventListener('change', (e) => {
            const clienteId = e.target.value;
            clienteSelecionado = clientes.find(c => c.id == clienteId);
        });
        
        document.getElementById('select-concessionaria').addEventListener('change', (e) => {
            const concessionariaId = e.target.value;
            concessionariaSelecionada = concessionarias.find(c => c.id == concessionariaId);
        });

        modal1.style.display = 'none';
        modal2.style.display = 'block';
    }
}

function fecharModais() {
    modal1.style.display = 'none';
    modal2.style.display = 'none';
    areaSelecionada = null;
    automovelSelecionado = null;
    clienteSelecionado = null;
    concessionariaSelecionada = null;
    alocacaoSelecionada = null;
}

async function confirmarVenda() {
    if (areaSelecionada && automovelSelecionado && clienteSelecionado && concessionariaSelecionada) {
        try {
            // Primeiro criar a alocação
            const alocacaoData = {
                area: areaSelecionada,
                quantidade: 1,
                automovel: automovelSelecionado.id,
                concessionaria: concessionariaSelecionada.id
            };

            const alocacaoResponse = await fetch(uri + 'alocacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alocacaoData)
            });

            if (alocacaoResponse.ok) {
                const novaAlocacao = await alocacaoResponse.json();

                // Agora criar a venda
                const vendaData = {
                    cliente: clienteSelecionado.id,
                    alocacao: novaAlocacao.id
                };

                const vendaResponse = await fetch(uri + 'vendas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(vendaData)
                });

                if (vendaResponse.ok) {
                    alert('Venda confirmada com sucesso!');
                    // Recarregar as alocações para atualizar a interface
                    await carregarAlocacoes();
                    await carregarVendas();
                    await pintarAreas();
                    // Recriar as áreas para atualizar o texto "Vendido"
                    document.querySelector('main').innerHTML = '';
                    await montarAreas();
                } else {
                    alert('Erro ao criar venda');
                }
            } else {
                alert('Erro ao criar alocação');
            }
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao confirmar venda');
        }
        
        fecharModais();
    } else {
        alert('Por favor, selecione cliente e concessionária');
    }
}

inicializar();