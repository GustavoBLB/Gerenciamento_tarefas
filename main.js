
const divForm = document.querySelector(".tarefa_form")
const botaoTarefa = document.querySelector(".tarefa_botao")
const textareaTarefa = document.querySelector(".tarefa_form_textarea")

const listaTarefasEmAndamento = document.querySelector(".em_andamento")
const listaTarefasConcluida = document.querySelector(".concluidas")

const modalBootstrap = new bootstrap.Modal(document.getElementById('modalAviso'));
const modalConfirmandoBootstrap = new bootstrap.Modal(document.getElementById('modalConfirmar'));
const modalEditandoBootstrap = new bootstrap.Modal(document.getElementById('modalEditarTarefa'));

let tarefaAlterar = null;
let funcaoAlterar = null;
let tarefaSendoArrastada = null;
let filtroAtual = null;
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

function atualizarTarefas(){

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

}

function aparecerCadastro(){

    const verificar = divForm.classList

    divForm.classList.toggle('hidden')
    verificar.contains('hidden') ? botaoTarefa.textContent = 'Adicionar Tarefa' : botaoTarefa.textContent= 'Cancelar'

}

function criarCardTarefa(tarefa) {

    const div = document.createElement('div');
    div.classList.add('lista_tarefas_item');
    div.dataset.id = tarefa.id_tarefa;


     if (tarefa.status_tarefa === 2) {
        div.classList.add('concluida');
    }

    const h1 = document.createElement('h1');
    h1.classList.add('lista_tarefas_item_texto');
    h1.textContent = tarefa.nome;
    div.appendChild(h1);

    const botoesDiv = document.createElement('div');
    botoesDiv.classList.add('lista_tarefas_item_botoes');

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('lista_tarefas_item_botao', 'excluir');
    const imgEditar = document.createElement('img');
    imgEditar.classList.add('lista_tarefas_item_imagem');
    imgEditar.src = '/src/TAREFA_EDITAR.svg';
    btnEditar.appendChild(imgEditar);
    botoesDiv.appendChild(btnEditar);

    btnEditar.addEventListener('click', () => abrirModalRecadastro(tarefa));

    if(tarefa.status_tarefa !== 2){
        const btnConcluir = document.createElement('button');
        btnConcluir.classList.add('lista_tarefas_item_botao', 'concluir');
        const imgCheck = document.createElement('img');
        imgCheck.classList.add('lista_tarefas_item_imagem');
        imgCheck.src = '/src/teste-check2.svg';
        btnConcluir.addEventListener('click', () => abrirModalAviso(tarefa , 'concluir'));
        btnConcluir.appendChild(imgCheck);
        botoesDiv.appendChild(btnConcluir);
    }

    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('lista_tarefas_item_botao', 'excluir');
    const imgTrash = document.createElement('img');
    imgTrash.classList.add('lista_tarefas_item_imagem');
    imgTrash.src = '/src/teste_lixo.svg';
    btnExcluir.appendChild(imgTrash);

    btnExcluir.addEventListener('click', () => abrirModalAviso(tarefa , 'excluir'));

    botoesDiv.appendChild(btnExcluir);

    div.appendChild(botoesDiv);

    div.setAttribute('draggable', true);
    div.addEventListener('dragstart', (e) => iniciarDrag(e, tarefa.id_tarefa));
    div.addEventListener('dragover', permitirDrop);
    div.addEventListener('drop', (e) => soltarTarefa(e, div));


    return div;
}

function iniciarDrag(evento, idTarefa) {
    tarefaSendoArrastada = idTarefa;
    event.dataTransfer.effectAllowed = "move"
}

function permitirDrop(evento) {
    evento.preventDefault();
}

function soltarTarefa(evento, elementoAlvo) {
    evento.preventDefault();

    const idAlvo = elementoAlvo.dataset.id;

    if (tarefaSendoArrastada === idAlvo) 
        return;

    const indexArrastada = tarefas.findIndex(t => t.id_tarefa === tarefaSendoArrastada);
    const indexAlvo = tarefas.findIndex(t => t.id_tarefa === idAlvo);

    const tarefaArrastada = tarefas[indexArrastada];
    const tarefaAlvo = tarefas[indexAlvo];

    if (tarefaArrastada.status_tarefa !== tarefaAlvo.status_tarefa) {
        return;
    }

    const tarefaMovida = tarefas.splice(indexArrastada, 1)[0];
    tarefas.splice(indexAlvo, 0, tarefaMovida);

    atualizarTarefas();
    if (filtroAtual === 'andamento') 
        filtroTarefasAndamento();
    else if (filtroAtual === 'concluida') 
        filtroTarefasConcluidas();
    else
        filtroTarefasTodas()

}




function cadastrarTarefa(){
    
    const nomeTarefa = textareaTarefa.value

    if(nomeTarefa == null || nomeTarefa == ""){
        alert("O nome da tarefa deve estar preenchido!");
        return;
    }
    const tarefa = {
        nome: nomeTarefa,
        id_tarefa: crypto.randomUUID(),
        status_tarefa: 1
    }
    // console.log(tarefa)
    tarefas.push(tarefa)
    atualizarTarefas()
    const tarefaNova = criarCardTarefa(tarefa) 
    tarefaNova.classList.add('fade-in')
    listaTarefasEmAndamento.append(tarefaNova)
    textareaTarefa.value = "";
    aparecerCadastro()
    filtroTarefasTodas()

}

function excluirTarefa(){

    if(!tarefaAlterar)
        return;

    const indice = tarefas.findIndex(tarefa => tarefa.id_tarefa === tarefaAlterar.id_tarefa);
    tarefas.splice(indice , 1)
    atualizarTarefas()

    const divExcluir = document.querySelector(`[data-id="${tarefaAlterar.id_tarefa}"]`);
    divExcluir.classList.add('fade-out')
    divExcluir.addEventListener('animationend', () => {
        divExcluir.remove();
    });
    modalBootstrap.hide();
    abrirModalConfirmacao(tarefaAlterar.nome , 'excluir')
}

function concluirTarefa(){

    if (!tarefaAlterar)
        return;
    alterarTarefaConcluir(tarefaAlterar.id_tarefa);
    atualizarTarefas();


    modalBootstrap.hide();

    abrirModalConfirmacao(tarefaAlterar.nome, 'concluir');
    filtroTarefasTodas()

}

function alterarTarefaConcluir(id_alterar){
    const indice = tarefas.findIndex(tarefa => tarefa.id_tarefa === id_alterar);
    tarefas[indice].status_tarefa = 2;  
    const divConcluir = document.querySelector(`[data-id="${id_alterar}"]`);
    divConcluir.classList.add('fade-out');
    divConcluir.addEventListener('animationend', () => {
        divConcluir.remove();

        const novoCard = criarCardTarefa(tarefas[indice]);
        novoCard.classList.add('fade-in');
        novoCard.classList.add('concluida');
        listaTarefasConcluida.append(novoCard);
    });
}

function alterarTarefaEmAndamento(id_alterar){
    const indice = tarefas.findIndex(tarefa => tarefa.id_tarefa === id_alterar);
    tarefas[indice].status_tarefa = 1;  
    const divConcluir = document.querySelector(`[data-id="${id_alterar}"]`);
    divConcluir.classList.add('fade-out');
    divConcluir.addEventListener('animationend', () => {
        divConcluir.remove();

        const novoCard = criarCardTarefa(tarefas[indice]);
        novoCard.classList.add('fade-in');
        // novoCard.classList.add('concluida');
        listaTarefasEmAndamento.append(novoCard);
    });
}

function alterarTarefa(){

    funcaoAlterar === 'excluir' ? excluirTarefa() : concluirTarefa()

}

function abrirModalRecadastro(){
    modalEditandoBootstrap.show()
}

function abrirModalAviso(tarefa , origem){

    if(origem === 'excluir'){
        document.getElementById('modalTituloAviso').innerHTML  = `Você deseja <strong>excluir</strong> a tarefa '${tarefa.nome}'?`;
        tarefaAlterar = tarefa;
        funcaoAlterar = 'excluir'
        modalBootstrap.show();
    }

    if(origem === 'concluir'){
        document.getElementById('modalTituloAviso').innerHTML  = `Você deseja <strong>concluir</strong> a tarefa '${tarefa.nome}'?`;
        tarefaAlterar = tarefa;
        funcaoAlterar = 'concluir'
        modalBootstrap.show();
    }

}

function abrirModalConfirmacao( nomeTarefa , origem){
    if(origem === 'excluir'){
        document.getElementById('modalTituloConfirmar').textContent = `Tarefa '${nomeTarefa}' excluída com sucesso!`;
        modalConfirmandoBootstrap.show();
    }
    if(origem === 'concluir'){
        document.getElementById('modalTituloConfirmar').textContent = `Tarefa '${nomeTarefa}' concluída com sucesso!`;
        modalConfirmandoBootstrap.show();
    }
    if(origem === 'edicao'){
        document.getElementById('modalTituloConfirmar').textContent = `Tarefa '${nomeTarefa}' editada com sucesso!`;
        modalConfirmandoBootstrap.show();
    }

    tarefaAlterar = null
    funcaoAlterar = null
}

function fecharModal(verificacao){
    verificacao === 1 ? modalBootstrap.hide() : modalConfirmandoBootstrap.hide()
}

function fecharModalEdicao(){
    modalEditandoBootstrap.hide();
    tarefaAlterar = null;
}

function salvarEdicaoTarefa() {
    if (!tarefaAlterar) return;

    const novoNome = document.getElementById('descricaoTarefa').value;
    const novoStatus = document.getElementById('status_tarefa').value;

    const indice = tarefas.findIndex(tarefa => tarefa.id_tarefa === tarefaAlterar.id_tarefa);

    const statusAntes = tarefas[indice].status_tarefa;
    const nomeAntes = tarefas[indice].nome 

    const statusDepois = (novoStatus === 'em-andamento') ? 1 : 2;

    tarefas[indice].nome = novoNome;
    tarefas[indice].status_tarefa = statusDepois;

    let editou = 0

    try{
        if(statusAntes !== statusDepois && statusDepois === 2){
            alterarTarefaConcluir(tarefaAlterar.id_tarefa)
            editou = 1
        }
        else if(statusAntes !== statusDepois && statusDepois === 1){
            alterarTarefaEmAndamento(tarefaAlterar.id_tarefa)
            editou = 1
        }
        else if(statusAntes === statusDepois && nomeAntes !== novoNome){
            const card = document.querySelector(`[data-id="${tarefaAlterar.id_tarefa}"]`);
            const h1 = card.querySelector('.lista_tarefas_item_texto');
            h1.textContent = novoNome;
            editou = 1
        }
    }
    finally{
        editou === 1 ? abrirModalConfirmacao( nomeAntes , 'edicao' ) : null
    }
    atualizarTarefas()
    modalEditandoBootstrap.hide();
    tarefaAlterar = null;
    filtroTarefasTodas()
}



function abrirModalRecadastro(tarefa) {
    document.getElementById('descricaoTarefa').value = tarefa.nome;

    const selectStatus = document.getElementById('status_tarefa');
    if (tarefa.status_tarefa === 1) {
        selectStatus.value = 'em-andamento';
    } else if (tarefa.status_tarefa === 2) {
        selectStatus.value = 'concluida';
    }

    // Guarda a tarefa que está sendo editada
    tarefaAlterar = tarefa;

    modalEditandoBootstrap.show();
}


function carregarTarefasAndamento(){
     tarefas.forEach((tarefa) => {
        if(tarefa.status_tarefa === 1){
            const cardTarefa = criarCardTarefa(tarefa);
            listaTarefasEmAndamento.append(cardTarefa)
        }
    });
}


// funcções filtros 

function limparListas() {
    listaTarefasEmAndamento.innerHTML = '';
    listaTarefasConcluida.innerHTML = '';
}

function filtroTarefasTodas() {
    limparListas();
    atualizarHrs('todas')
    filtroAtual = 'todas'
    tarefas.forEach((tarefa) => {
        const cardTarefa = criarCardTarefa(tarefa);
        cardTarefa.classList.add('fade-in');

        if(tarefa.status_tarefa === 1){
            listaTarefasEmAndamento.append(cardTarefa);
        } else if(tarefa.status_tarefa === 2){
            listaTarefasConcluida.append(cardTarefa);
        }
    });
    atualizarContador('todas')
}

function filtroTarefasConcluidas() {
    limparListas();
    filtroAtual = 'concluida'
    atualizarHrs('concluidas')
    tarefas.forEach((tarefa) => {
        if(tarefa.status_tarefa === 2){
            const cardTarefa = criarCardTarefa(tarefa);
            cardTarefa.classList.add('fade-in');
            listaTarefasConcluida.append(cardTarefa);
        }
    });
    atualizarContador('concluida')
}

function filtroTarefasAndamento() {
    limparListas();
    filtroAtual = 'andamento'
    atualizarHrs('andamento')
    tarefas.forEach((tarefa) => {
        if(tarefa.status_tarefa === 1){
            const cardTarefa = criarCardTarefa(tarefa);
            cardTarefa.classList.add('fade-in');
            listaTarefasEmAndamento.append(cardTarefa);
        }
    });
    atualizarContador('andamento')
}

function atualizarHrs(filtro) {
    const hrAndamento = document.getElementById('hrAndamento');
    const hrConcluida = document.getElementById('hrConcluida');

    if (filtro === 'todas') {
        mostrar(hrAndamento);
        mostrar(hrConcluida);
    } else if (filtro === 'andamento') {
        mostrar(hrAndamento);
        esconder(hrConcluida);
    } else if (filtro === 'concluidas') {
        mostrar(hrConcluida);
        esconder(hrAndamento);
    }
}


function mostrar(elemento) {
    elemento.classList.remove('d-none');
    elemento.classList.add('d-flex');
}

function esconder(elemento) {
    elemento.classList.remove('d-flex');
    elemento.classList.add('d-none');
}

function atualizarContador(filtro) {
    const contador = document.getElementById('contadorTarefas');

    if (filtro === 'todas') {
        const total = tarefas.length;
        contador.textContent = `Tarefas: ${total}`;
    } else if (filtro === 'andamento') {
        const andamento = tarefas.filter(tarefa => tarefa.status_tarefa === 1).length;
        contador.textContent = `Tarefas em andamento: ${andamento}`;
    } else if (filtro === 'concluida') {
        const concluidas = tarefas.filter(tarefa => tarefa.status_tarefa === 2).length;
        contador.textContent = `Tarefas concluídas: ${concluidas}`;
    }
}


filtroTarefasTodas()