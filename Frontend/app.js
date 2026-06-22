const baseUrl = 'http://localhost:5072/api';
let clientesMemoria = [];
let veiculosMemoria = [];

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

    await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    fecharModal('modalVeiculo');
    carregarVeiculos();
});

document.addEventListener('DOMContentLoaded', carregarRelatorios);