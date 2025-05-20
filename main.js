
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
        const cardTarefa = `<div class="lista_tarefas_item">

                <input class="lista_tarefas_item_checkbox" type="checkbox">

                <h1 class="lista_tarefas_item_texto">${tarefa.nome}</h1>
                
                <div class="lista_tarefas_item_botoes">
                    <button class="lista_tarefas_item_botao adicionar">
                        <img class="lista_tarefas_item_imagem" src="/src/marca-de-verificacao.png">
                    </button>
                    <button onclick="excluirTarefa()" class="lista_tarefas_item_botao excluir">
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
        nome: nomeTarefa
    }
    tarefas.push(tarefa)
    atualizarTarefas()
    atualizarTela(tarefa)
    textareaTarefa.value = "";
    aparecerCadastro()

}

atualizarTela()
