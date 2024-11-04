let itemsList = document.getElementById('lista')
let adicionarButton = document.getElementById("adicionarButton")

// Função para carregar todas as tarefas usando a API
async function loadTodoItems() {
  try {
    let response = await fetch('http://localhost:3000/api/todos');
    let todos = await response.json();

    console.log("Todas as tarefas carregadas:", todos);

    todos.forEach(item => {
      adicionarItem(item);
    });
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
  }
}

// Função para adicionar uma nova tarefa
async function createTodoItem() {
  let descricao = document.getElementById('novoItem').value;

  if (!descricao) {
    alert("Por favor, insira uma descrição para a tarefa.");
    return;
  }

  try {
    let response = await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: descricao,
        owner: 'Lucas'
      })
    });

    let newTodo = await response.json();
    console.log("Nova tarefa criada:", newTodo);

    adicionarItem(newTodo); // Adiciona o novo item à lista visual
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
  }
}

// Função para marcar como completo e atualizar a tarefa no servidor
async function marcarComoCompletado(item, completo) {
  try {
    let response = await fetch(`http://localhost:3000/api/todos/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: completo })
    });

    let updatedTodo = await response.json();
    console.log("Tarefa atualizada:", updatedTodo);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
  }
}

// Função para adicionar o item visualmente
function adicionarItem(novoItem) {
  let itemElement = document.createElement('li');

  let itemText = document.createElement('p');
  itemText.innerText = novoItem.name;

  if (novoItem.done) {
    itemText.style.textDecoration = 'line-through';
  }

  let completarCheckbox = document.createElement('input');
  completarCheckbox.setAttribute('type', 'checkbox');
  completarCheckbox.checked = novoItem.done;

  completarCheckbox.addEventListener('change', () => {
    itemText.style.textDecoration = completarCheckbox.checked ? 'line-through' : 'none';
    marcarComoCompletado(novoItem, completarCheckbox.checked);
  });

  itemText.appendChild(completarCheckbox);
  itemElement.appendChild(itemText);
  itemsList.appendChild(itemElement);
}

// Função para excluir uma tarefa pelo ID
async function deleteTodoItem(id) {
  try {
    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'DELETE'
    });
    console.log(`Tarefa ${id} excluída com sucesso`);
    loadTodoItems(); // Recarrega a lista para atualizar
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
  }
}

// Carrega as tarefas ao iniciar
loadTodoItems();
