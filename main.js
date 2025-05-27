
const divForm = document.querySelector(".tarefa_form")
const botaoTarefa = document.querySelector(".tarefa_botao")
const textareaTarefa = document.querySelector(".tarefa_form_textarea")
const listaTarefas = document.querySelector(".lista_tarefas")

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []

function aparecerCadastro(){

    const verificar = divForm.classList

    divForm.classList.toggle('hidden')
    verificar.contains('hidden') ? botaoTarefa.textContent = 'Adicionar Tarefa' : botaoTarefa.textContent= 'Cancelar'

}

function atualizarTarefas(){

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

}

function atualizarTela(){

    listaTarefas.innerHTML = "";

    tarefas.forEach(tarefa => {
        const cardTarefa = `<div class="lista_tarefas_item" data-id="${tarefa.id_tarefa}">

                <input class="lista_tarefas_item_checkbox" type="checkbox">

                <h1 class="lista_tarefas_item_texto">${tarefa.nome}</h1>
                
                <div class="lista_tarefas_item_botoes">
                    <button class="lista_tarefas_item_botao concluir">
                        <img class="lista_tarefas_item_imagem" src="/src/marca-de-verificacao.png">
                    </button>
                    <button onclick="excluirTarefa('${tarefa.id_tarefa}')" class="lista_tarefas_item_botao excluir">
                        <img class="lista_tarefas_item_imagem" src="/src/trash.png">
                    </button>
                </div>

            </div>`;

        listaTarefas.innerHTML += cardTarefa;
    });

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
    console.log(tarefa.id_tarefa)
    tarefas.push(tarefa)
    atualizarTarefas()
    atualizarTela(tarefa)
    textareaTarefa.value = "";
    aparecerCadastro()

}

function excluirTarefa(tarefaExcluida){

    const indice = tarefas.findIndex(tarefa => tarefa.id_tarefa === tarefaExcluida);
    alert(`Tarefa excluída com sucesso`);
    tarefas.splice(indice , 1)
    atualizarTarefas()
    atualizarTela()

}

atualizarTela()
