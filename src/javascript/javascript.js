document.addEventListener('DOMContentLoaded', function() {
    
    //inicializando as principais variáveis
    const toDoForm = document.querySelector('.to-do-form');
    const toDoTasks = document.getElementById('to_do_tasks');
    const inProgressTasks = document.getElementById('in_progress_tasks');
    const doneTasks = document.getElementById('done_tasks');
    let taskId = 0;

    //função para criar e adicionar uma nova task
    function addTask(description, status, priority, deadline) { //recebendo os parâmetros da task
        let formattedDeadline = 'Não definido';
        //formatando a data
        if (deadline) {
            const dateParts = deadline.split('-');
            formattedDeadline = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }

        //criando uma div com a class task
        const task = document.createElement('div');
        task.classList.add('task');
        //atribuindo um id único e seus parâmetros
        task.setAttribute('data-id', taskId);
        task.setAttribute('data-status', status);
        task.setAttribute('data-priority', priority);
        task.setAttribute('data-deadline', deadline);
        task.setAttribute('draggable', 'true');
        ///adiciono a task e os botões no card
        task.innerHTML = `
            <div class="task-description">${description}</div>
            <div class="task-priority">Prioridade: ${priority}</div>
            <div class="task-deadline">Prazo: ${formattedDeadline}</div>
            <div class="task-actions">
                <a>
                    <i class="fa-regular fa-pen-to-square action-button edit-button"></i>
                </a>
                <a>
                    <i class="fa-regular fa-trash-can action-button delete-button"></i>
                </a>
            </div>
        `;
        task.querySelector('.edit-button').addEventListener('click', function() {
            openEditModal(task);
        });
        task.querySelector('.delete-button').addEventListener('click', deleteTask);
        document.getElementById(`${status}_tasks`).appendChild(task);
        taskId++;
    }

    //função do modal de edição da task
    function openEditModal(task) {
        const modal = document.getElementById('editTaskModal');
        const form = document.getElementById('editTaskForm');
        const descriptionInput = form.querySelector('#editDescription');
        const prioritySelect = form.querySelector('#editPriority');
        const deadlineInput = form.querySelector('#editDeadline');

        //preenche o formulário com as informações da tarefa
        descriptionInput.value = task.querySelector('.task-description').textContent;
        prioritySelect.value = task.getAttribute('data-priority');
        deadlineInput.value = task.getAttribute('data-deadline');

        //exibe o modal
        modal.style.display = "block";

        //selecionando o botão de fechar especificamente dentro do modal
        //fecha o modal quando o usuário clica no botão de fechar
        modal.querySelector('.close').onclick = function() {
            modal.style.display = "none";
        }

        //atualiza a tarefa quando o formulário é submetido
        form.onsubmit = function(e) {
            //tiro o padrão da página p não recarregar
            e.preventDefault();
            task.querySelector('.task-description').textContent = descriptionInput.value;
            task.setAttribute('data-priority', prioritySelect.value);
            task.querySelector('.task-priority').textContent = `Prioridade: ${prioritySelect.value}`;
            task.setAttribute('data-deadline', deadlineInput.value);
            let formattedDeadline = 'Não definido';
            //formatando a data
            if (deadlineInput.value) {
                const dateParts = deadlineInput.value.split('-');
                formattedDeadline = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
            task.querySelector('.task-deadline').textContent = `Prazo: ${formattedDeadline}`;
            modal.style.display = "none";
        }
    }

    //função para excluir uma tarefa
    function deleteTask() {
        if (confirm('Você tem certeza que deseja excluir esta tarefa?')) {
            this.closest('.task').remove();
        }
    }    

    //função para adicionar uma nova tarefa ao submeter o formulário
    toDoForm.addEventListener('submit', function(e) {
        //tiro o padrão da página p não recarregar
        e.preventDefault();
        const description = this.querySelector('input[name="description"]').value;
        const priority = this.querySelector('select[name="priority"]').value;
        const deadline = this.querySelector('input[name="deadline"]').value;
        //verificando se a descrição e prioridade estão preenchidas
        if (description && priority) {
            //chamando a função de adicionar
            addTask(description, 'to_do', priority, deadline);
            //resentando os campos do formulário
            this.reset();
        }
        //fechando o modal após a adição da tarefa
        document.getElementById('submitTaskModal').style.display = "none";
    });

    //abrindo o modal de criar a task
    document.querySelector('.header .form-button').addEventListener('click', function() {
        const modal = document.getElementById('submitTaskModal');
        modal.style.display = "block";
    });

    //fechando o modal quando clica no botão de fechar
    document.querySelector('.close').onclick = function() {
        document.getElementById('submitTaskModal').style.display = "none";
    }

    //implementando do drag and drop
    const dropzones = document.querySelectorAll('[dropzone="move"]');
    //a lista de quem pode ser destino p poder 'soltar' a task
    dropzones.forEach(dropzone => {
        //'arrastando'
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        //'soltando'
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            const taskId = e.dataTransfer.getData('text/plain');
            const task = document.querySelector(`.task[data-id="${taskId}"]`);
            const currentStatus = task.getAttribute('data-status');
            const newStatus = this.id.replace('_tasks', '');

            //verificando se a movimentação é válida de acordo com a sequência 
            if ((currentStatus === 'to_do' && newStatus === 'in_progress') ||
                (currentStatus === 'in_progress' && newStatus === 'done') ||
                (currentStatus === 'done' && newStatus === 'in_progress') ||
                (currentStatus === 'in_progress' && newStatus === 'to_do')) {
                task.setAttribute('data-status', newStatus);
                this.appendChild(task);

                //colocando um sublinhado nas descrições da task
                task.querySelector('.task-description').style.textDecoration = 'underline';

                //colocando um risco quando a task estiver 'done'
                if (newStatus === 'done') {
                    task.querySelector('.task-description').style.textDecoration = 'line-through';
                }
            }
        });
    });

    //eventos de arrastar/drag
    document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('task')) {
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
        }
    });
});


