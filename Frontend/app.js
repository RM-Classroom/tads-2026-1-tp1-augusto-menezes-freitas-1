const baseUrl = 'http://localhost:5072/api';
let clientesMemoria = [];
let veiculosMemoria = [];
let fabricantesMemoria = [];
let categoriasMemoria = [];
let alugueisMemoria = [];

function mostrarTela(id) {
    const telas = document.querySelectorAll('.tela');
    for (let i = 0; i < telas.length; i++) {
        telas[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}

function abrirModal(id) {
    document.getElementById(id).style.display = 'block';
}

function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

async function carregarRelatorios() {
    const resFaturamento = await fetch(`${baseUrl}/Relatorios/faturamento-total-clientes`);
    const dadosFaturamento = await resFaturamento.json();
    const listaFat = document.getElementById('listaFaturamento');
    listaFat.innerHTML = '';
    
    for (let i = 0; i < dadosFaturamento.length; i++) {
        const item = dadosFaturamento[i];
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${item.cliente} <span>R$ ${item.totalGasto}</span>`;
        listaFat.appendChild(li);
    }

    const resEstoque = await fetch(`${baseUrl}/Relatorios/estoque-fabricantes`);
    const dadosEstoque = await resEstoque.json();
    const listaEst = document.getElementById('listaEstoque');
    listaEst.innerHTML = '';

    for (let i = 0; i < dadosEstoque.length; i++) {
        const item = dadosEstoque[i];
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = `${item.fabricante} - ${item.carro}`;
        listaEst.appendChild(li);
    }
}

async function carregarClientes() {
    const res = await fetch(`${baseUrl}/Clientes`);
    clientesMemoria = await res.json();
    renderizarClientes(clientesMemoria);
}

function renderizarClientes(dados) {
    const tbody = document.getElementById('tabela-clientes-body');
    tbody.innerHTML = '';
    for (let i = 0; i < dados.length; i++) {
        const c = dados[i];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.nome}</td>
            <td>${c.cpf}</td>
            <td>${c.email}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarCliente(${c.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirCliente(${c.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

document.getElementById('filtroClientes').addEventListener('submit', function(e) {
    e.preventDefault();
    const tNome = document.getElementById('filtroNomeCliente').value.toLowerCase();
    const tCpf = document.getElementById('filtroCpfCliente').value;
    
    const filtrados = [];
    for (let i = 0; i < clientesMemoria.length; i++) {
        const c = clientesMemoria[i];
        const matchNome = c.nome.toLowerCase().includes(tNome);
        const matchCpf = c.cpf.includes(tCpf);
        if (matchNome && matchCpf) {
            filtrados.push(c);
        }
    }
    renderizarClientes(filtrados);
});

function abrirModalCliente() {
    document.getElementById('formCliente').reset();
    document.getElementById('clienteId').value = '';
    abrirModal('modalCliente');
}

async function editarCliente(id) {
    const res = await fetch(`${baseUrl}/Clientes/${id}`);
    const c = await res.json();
    document.getElementById('clienteId').value = c.id;
    document.getElementById('clienteNome').value = c.nome;
    document.getElementById('clienteCpf').value = c.cpf;
    document.getElementById('clienteEmail').value = c.email;
    abrirModal('modalCliente');
}

async function excluirCliente(id) {
    await fetch(`${baseUrl}/Clientes/${id}`, { method: 'DELETE' });
    carregarClientes();
}

document.getElementById('formCliente').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('clienteId').value;
    const payload = {
        id: id ? parseInt(id) : 0,
        nome: document.getElementById('clienteNome').value,
        cpf: document.getElementById('clienteCpf').value,
        email: document.getElementById('clienteEmail').value
    };

    const metodo = id ? 'PUT' : 'POST';
    const urlFinal = id ? `${baseUrl}/Clientes/${id}` : `${baseUrl}/Clientes`;

    await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    fecharModal('modalCliente');
    carregarClientes();
});

async function carregarVeiculos() {
    const res = await fetch(`${baseUrl}/Veiculos`);
    veiculosMemoria = await res.json();
    renderizarVeiculos(veiculosMemoria);
}

function renderizarVeiculos(dados) {
    const tbody = document.getElementById('tabela-veiculos-body');
    tbody.innerHTML = '';
    for (let i = 0; i < dados.length; i++) {
        const v = dados[i];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${v.id}</td>
            <td>${v.modelo}</td>
            <td>${v.anoFabricacao}</td>
            <td>${v.quilometragem}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarVeiculo(${v.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirVeiculo(${v.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

document.getElementById('filtroVeiculos').addEventListener('submit', function(e) {
    e.preventDefault();
    const tModelo = document.getElementById('filtroModeloVeiculo').value.toLowerCase();
    const tAno = document.getElementById('filtroAnoVeiculo').value;
    
    const filtrados = [];
    for (let i = 0; i < veiculosMemoria.length; i++) {
        const v = veiculosMemoria[i];
        const matchMod = v.modelo.toLowerCase().includes(tModelo);
        const matchAno = tAno ? v.anoFabricacao.toString() === tAno : true;
        if (matchMod && matchAno) {
            filtrados.push(v);
        }
    }
    renderizarVeiculos(filtrados);
});

function abrirModalVeiculo() {
    document.getElementById('formVeiculo').reset();
    document.getElementById('veiculoId').value = '';
    abrirModal('modalVeiculo');
}

async function editarVeiculo(id) {
    const res = await fetch(`${baseUrl}/Veiculos/${id}`);
    const v = await res.json();
    document.getElementById('veiculoId').value = v.id;
    document.getElementById('veiculoModelo').value = v.modelo;
    document.getElementById('veiculoAno').value = v.anoFabricacao;
    document.getElementById('veiculoKm').value = v.quilometragem;
    document.getElementById('veiculoFabId').value = v.fabricanteId;
    document.getElementById('veiculoCatId').value = v.categoriaId;
    abrirModal('modalVeiculo');
}

async function excluirVeiculo(id) {
    await fetch(`${baseUrl}/Veiculos/${id}`, { method: 'DELETE' });
    carregarVeiculos();
}

document.getElementById('formVeiculo').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('veiculoId').value;
    const payload = {
        id: id ? parseInt(id) : 0,
        modelo: document.getElementById('veiculoModelo').value,
        anoFabricacao: parseInt(document.getElementById('veiculoAno').value),
        quilometragem: parseFloat(document.getElementById('veiculoKm').value),
        fabricanteId: parseInt(document.getElementById('veiculoFabId').value),
        categoriaId: parseInt(document.getElementById('veiculoCatId').value)
    };

    const metodo = id ? 'PUT' : 'POST';
    const urlFinal = id ? `${baseUrl}/Veiculos/${id}` : `${baseUrl}/Veiculos`;

    try {
        const resposta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            fecharModal('modalVeiculo');
            carregarVeiculos();
        } else {
            const erro = await resposta.text();
            alert(`Falha ao salvar Veículo!\n\nDetalhe do erro: ${erro}`);
        }
    } catch (erroDeRede) {
        alert("Erro de conexão com a API.");
    }
});

async function carregarFabricantes() {
    const res = await fetch(`${baseUrl}/Fabricantes`);
    fabricantesMemoria = await res.json();
    renderizarFabricantes(fabricantesMemoria);
}

function renderizarFabricantes(dados) {
    const tbody = document.getElementById('tabela-fabricantes-body');
    tbody.innerHTML = '';
    for (let i = 0; i < dados.length; i++) {
        const f = dados[i];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${f.id}</td>
            <td>${f.nome}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarFabricante(${f.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirFabricante(${f.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

document.getElementById('filtroFabricantes').addEventListener('submit', function(e) {
    e.preventDefault();
    const tNome = document.getElementById('filtroNomeFabricante').value.toLowerCase();
    const tId = document.getElementById('filtroIdFabricante').value;
    
    const filtrados = [];
    for (let i = 0; i < fabricantesMemoria.length; i++) {
        const f = fabricantesMemoria[i];
        const matchNome = f.nome.toLowerCase().includes(tNome);
        const matchId = tId ? f.id.toString() === tId : true;
        if (matchNome && matchId) {
            filtrados.push(f);
        }
    }
    renderizarFabricantes(filtrados);
});

function abrirModalFabricante() {
    document.getElementById('formFabricante').reset();
    document.getElementById('fabricanteId').value = '';
    abrirModal('modalFabricante');
}

async function editarFabricante(id) {
    const res = await fetch(`${baseUrl}/Fabricantes/${id}`);
    const f = await res.json();
    document.getElementById('fabricanteId').value = f.id;
    document.getElementById('fabricanteNome').value = f.nome;
    abrirModal('modalFabricante');
}

async function excluirFabricante(id) {
    await fetch(`${baseUrl}/Fabricantes/${id}`, { method: 'DELETE' });
    carregarFabricantes();
}

document.getElementById('formFabricante').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('fabricanteId').value;
    const payload = {
        id: id ? parseInt(id) : 0,
        nome: document.getElementById('fabricanteNome').value
    };

    const metodo = id ? 'PUT' : 'POST';
    const urlFinal = id ? `${baseUrl}/Fabricantes/${id}` : `${baseUrl}/Fabricantes`;

    await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    fecharModal('modalFabricante');
    carregarFabricantes();
});

async function carregarCategorias() {
    const res = await fetch(`${baseUrl}/Categorias`);
    categoriasMemoria = await res.json();
    renderizarCategorias(categoriasMemoria);
}

function renderizarCategorias(dados) {
    const tbody = document.getElementById('tabela-categorias-body');
    tbody.innerHTML = '';
    for (let i = 0; i < dados.length; i++) {
        const c = dados[i];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.nome}</td>
            <td>${c.valorDiariaBase}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarCategoria(${c.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirCategoria(${c.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

document.getElementById('filtroCategorias').addEventListener('submit', function(e) {
    e.preventDefault();
    const tNome = document.getElementById('filtroNomeCategoria').value.toLowerCase();
    const tValor = document.getElementById('filtroValorCategoria').value;
    
    const filtrados = [];
    for (let i = 0; i < categoriasMemoria.length; i++) {
        const c = categoriasMemoria[i];
        const matchNome = c.nome.toLowerCase().includes(tNome);
        const matchValor = tValor ? c.valorDiariaBase.toString() === tValor : true;
        if (matchNome && matchValor) {
            filtrados.push(c);
        }
    }
    renderizarCategorias(filtrados);
});

function abrirModalCategoria() {
    document.getElementById('formCategoria').reset();
    document.getElementById('categoriaId').value = '';
    abrirModal('modalCategoria');
}

async function editarCategoria(id) {
    const res = await fetch(`${baseUrl}/Categorias/${id}`);
    const c = await res.json();
    document.getElementById('categoriaId').value = c.id;
    document.getElementById('categoriaNome').value = c.nome;
    document.getElementById('categoriaValor').value = c.valorDiariaBase;
    abrirModal('modalCategoria');
}

async function excluirCategoria(id) {
    await fetch(`${baseUrl}/Categorias/${id}`, { method: 'DELETE' });
    carregarCategorias();
}

document.getElementById('formCategoria').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('categoriaId').value;
    const payload = {
        id: id ? parseInt(id) : 0,
        nome: document.getElementById('categoriaNome').value,
        valorDiariaBase: parseFloat(document.getElementById('categoriaValor').value)
    };

    const metodo = id ? 'PUT' : 'POST';
    const urlFinal = id ? `${baseUrl}/Categorias/${id}` : `${baseUrl}/Categorias`;

    await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    fecharModal('modalCategoria');
    carregarCategorias();
});

async function carregarAlugueis() {
    const res = await fetch(`${baseUrl}/Alugueis`);
    alugueisMemoria = await res.json();
    renderizarAlugueis(alugueisMemoria);
}

function renderizarAlugueis(dados) {
    const tbody = document.getElementById('tabela-alugueis-body');
    tbody.innerHTML = '';
    for (let i = 0; i < dados.length; i++) {
        const a = dados[i];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${a.id}</td>
            <td>${a.clienteId}</td>
            <td>${a.veiculoId}</td>
            <td>${a.dataInicio.substring(0, 10)}</td>
            <td>${a.dataDevolucao.substring(0, 10)}</td>
            <td>${a.valorTotal}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarAluguel(${a.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirAluguel(${a.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

document.getElementById('filtroAlugueis').addEventListener('submit', function(e) {
    e.preventDefault();
    const tCli = document.getElementById('filtroClienteIdAluguel').value;
    const tVei = document.getElementById('filtroVeiculoIdAluguel').value;
    
    const filtrados = [];
    for (let i = 0; i < alugueisMemoria.length; i++) {
        const a = alugueisMemoria[i];
        const matchCli = tCli ? a.clienteId.toString() === tCli : true;
        const matchVei = tVei ? a.veiculoId.toString() === tVei : true;
        if (matchCli && matchVei) {
            filtrados.push(a);
        }
    }
    renderizarAlugueis(filtrados);
});

function abrirModalAluguel() {
    document.getElementById('formAluguel').reset();
    document.getElementById('aluguelId').value = '';
    abrirModal('modalAluguel');
}

async function editarAluguel(id) {
    const res = await fetch(`${baseUrl}/Alugueis/${id}`);
    const a = await res.json();
    document.getElementById('aluguelId').value = a.id;
    document.getElementById('aluguelClienteId').value = a.clienteId;
    document.getElementById('aluguelVeiculoId').value = a.veiculoId;
    document.getElementById('aluguelDataInicio').value = a.dataInicio.substring(0, 16);
    document.getElementById('aluguelDataFim').value = a.dataDevolucao.substring(0, 16);
    document.getElementById('aluguelKmInicial').value = a.quilometragemInicial;
    document.getElementById('aluguelKmFinal').value = a.quilometragemFinal;
    document.getElementById('aluguelValorDiaria').value = a.valorDiaria;
    document.getElementById('aluguelValorTotal').value = a.valorTotal;
    abrirModal('modalAluguel');
}

async function excluirAluguel(id) {
    await fetch(`${baseUrl}/Alugueis/${id}`, { method: 'DELETE' });
    carregarAlugueis();
}

document.getElementById('formAluguel').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('aluguelId').value;
    const payload = {
        id: id ? parseInt(id) : 0,
        clienteId: parseInt(document.getElementById('aluguelClienteId').value),
        veiculoId: parseInt(document.getElementById('aluguelVeiculoId').value),
        dataInicio: document.getElementById('aluguelDataInicio').value,
        dataDevolucao: document.getElementById('aluguelDataFim').value,
        quilometragemInicial: parseFloat(document.getElementById('aluguelKmInicial').value),
        quilometragemFinal: parseFloat(document.getElementById('aluguelKmFinal').value),
        valorDiaria: parseFloat(document.getElementById('aluguelValorDiaria').value),
        valorTotal: parseFloat(document.getElementById('aluguelValorTotal').value)
    };

    const metodo = id ? 'PUT' : 'POST';
    const urlFinal = id ? `${baseUrl}/Alugueis/${id}` : `${baseUrl}/Alugueis`;

    try {
        const resposta = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            fecharModal('modalAluguel');
            carregarAlugueis();
        } else {
            const erro = await resposta.text();
            alert(`Falha ao salvar Aluguel!\n\nDetalhe do erro: ${erro}`);
        }
    } catch (erroDeRede) {
        alert("Erro de conexão com a API.");
    }
});

document.addEventListener('DOMContentLoaded', carregarRelatorios);