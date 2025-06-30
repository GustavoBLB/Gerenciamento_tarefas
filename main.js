
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

    //   const checkbox = document.createElement('input');
    //   checkbox.type = 'checkbox';
    //   checkbox.classList.add('lista_tarefas_item_checkbox');
    //   div.appendChild(checkbox);

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

    return div;
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



function atualizarTela(){

    carregarTarefasAndamento()
    carregarTarefasConcluidas()
}

function carregarTarefasAndamento(){
     tarefas.forEach((tarefa) => {
        if(tarefa.status_tarefa === 1){
            const cardTarefa = criarCardTarefa(tarefa);
            listaTarefasEmAndamento.append(cardTarefa)
        }
    });
}

function carregarTarefasConcluidas(){
     tarefas.forEach((tarefa) => {
        if(tarefa.status_tarefa === 2){
            const cardTarefa = criarCardTarefa(tarefa);
            listaTarefasConcluida.append(cardTarefa)
        }
    });
}

atualizarTela()