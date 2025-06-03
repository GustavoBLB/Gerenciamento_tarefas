
const divForm = document.querySelector(".tarefa_form")
const botaoTarefa = document.querySelector(".tarefa_botao")
const textareaTarefa = document.querySelector(".tarefa_form_textarea")
const listaTarefas = document.querySelector(".lista_tarefas")
const modal = document.querySelector(".modal")
const modalTitulo = document.querySelector(".modal_conteudo_titulo")

let tarefaExcluir = null;
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

function aparecerCadastro(){

    const verificar = divForm.classList

    divForm.classList.toggle('hidden')
    verificar.contains('hidden') ? botaoTarefa.textContent = 'Adicionar Tarefa' : botaoTarefa.textContent= 'Cancelar'

}

function atualizarTarefas(){

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

}

function criarCardTarefa(tarefa) {
  const div = document.createElement('div');
  div.classList.add('lista_tarefas_item');
  div.dataset.id = tarefa.id_tarefa;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('lista_tarefas_item_checkbox');
  div.appendChild(checkbox);

  const h1 = document.createElement('h1');
  h1.classList.add('lista_tarefas_item_texto');
  h1.textContent = tarefa.nome;
  div.appendChild(h1);

  const botoesDiv = document.createElement('div');
  botoesDiv.classList.add('lista_tarefas_item_botoes');

  const btnConcluir = document.createElement('button');
  btnConcluir.classList.add('lista_tarefas_item_botao', 'concluir');
  const imgCheck = document.createElement('img');
  imgCheck.classList.add('lista_tarefas_item_imagem');
  imgCheck.src = '/src/marca-de-verificacao.png';
  btnConcluir.appendChild(imgCheck);
  botoesDiv.appendChild(btnConcluir);

  const btnExcluir = document.createElement('button');
  btnExcluir.classList.add('lista_tarefas_item_botao', 'excluir');
  const imgTrash = document.createElement('img');
  imgTrash.classList.add('lista_tarefas_item_imagem');
  imgTrash.src = '/src/trash.png';
  btnExcluir.appendChild(imgTrash);

  btnExcluir.addEventListener('click', () => abrirModalExclusao(tarefa));

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
        id_tarefa: crypto.randomUUID()
    }
    // console.log(tarefa.id_tarefa)
    tarefas.push(tarefa)
    atualizarTarefas()
    const tarefaNova = criarCardTarefa(tarefa) 
    // console.log(tarefaNova)
    listaTarefas.append(tarefaNova)
    textareaTarefa.value = "";
    aparecerCadastro()

}

function atualizarTela(){

    tarefas.forEach((tarefa) => {
        const cardTarefa = criarCardTarefa(tarefa);
        listaTarefas.append(cardTarefa)
    });

}

function abrirModalExclusao(tarefa){

    modalTitulo.innerHTML = `Você deseja excluir a tarefa ${tarefa.nome} ?`
    modal.classList.toggle('hidden')
    tarefaExcluir = tarefa;
    
    console.log(tarefa)
    console.log(tarefaExcluir)
}

function fecharModalExclusao(){
    modal.classList.toggle('hidden')
}

function excluirTarefa(){

    if(!tarefaExcluir)
        return;

    const indice = tarefas.findIndex(tarefa => tarefa.id_tarefa === tarefaExcluir.id_tarefa);
    alert(`Tarefa excluída com sucesso`);
    tarefas.splice(indice , 1)
    atualizarTarefas()

    const divExcluir = document.querySelector(`[data-id="${tarefaExcluir.id_tarefa}"]`);
    divExcluir.remove();
    console.log('teste')
    modal.classList.toggle('hidden')

}

atualizarTela()