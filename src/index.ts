import { Todo, ITodo } from './models.js';

class TodoList {
    private todos: Todo[] = [];
    private todoInput: HTMLInputElement;
    private todoDescription: HTMLTextAreaElement;
    private priorityInput: HTMLSelectElement;
    private filterPriority: HTMLSelectElement;
    private filterStatus: HTMLSelectElement;
    private todoList: HTMLDivElement;
    private addButton: HTMLButtonElement;
    private clearCompletedButton: HTMLButtonElement;
    private editingId: number | null = null;

    constructor() {
        this.todoInput = document.getElementById('todoInput') as HTMLInputElement;
        this.todoDescription = document.getElementById('todoDescription') as HTMLTextAreaElement;
        this.priorityInput = document.getElementById('priorityInput') as HTMLSelectElement;
        this.filterPriority = document.getElementById('filterPriority') as HTMLSelectElement;
        this.filterStatus = document.getElementById('filterStatus') as HTMLSelectElement;
        this.todoList = document.getElementById('todoList') as HTMLDivElement;
        this.addButton = document.getElementById('addTodo') as HTMLButtonElement;
        this.clearCompletedButton = document.getElementById('clearCompleted') as HTMLButtonElement;
        
        this.loadTodos();
        this.attachEventListeners();
    }

    private loadTodos(): void {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            const todoData: ITodo[] = JSON.parse(savedTodos, (key, value) => {
                if (key === 'createdAt' || key === 'updatedAt') {
                    return new Date(value);
                }
                return value;
            });
            this.todos = todoData.map(todo => {
                const newTodo = new Todo(todo.id, todo.text, todo.description, todo.completed, todo.priority);
                newTodo.createdAt = todo.createdAt;
                newTodo.updatedAt = todo.updatedAt;
                return newTodo;
            });
            this.renderTodos();
        }
    }

    private saveTodos(): void {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    private attachEventListeners(): void {
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.addTodo();
            }
        });
        this.clearCompletedButton.addEventListener('click', () => this.clearCompleted());
        this.filterPriority.addEventListener('change', () => this.renderTodos());
        this.filterStatus.addEventListener('change', () => this.renderTodos());
    }

    private addTodo(): void {
        const text = this.todoInput.value.trim();
        const description = this.todoDescription.value.trim();
        if (text) {
            const priority = this.priorityInput.value as 'low' | 'medium' | 'high';
            const newTodo = new Todo(
                Date.now(),
                text,
                description,
                false,
                priority
            );
            this.todos.push(newTodo);
            this.saveTodos();
            this.renderTodos();
            this.todoInput.value = '';
            this.todoDescription.value = '';
        }
    }

    private updateTodo(id: number, text: string, description: string, priority: 'low' | 'medium' | 'high'): void {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            todo.description = description;
            todo.priority = priority;
            todo.updatedAt = new Date();
            this.saveTodos();
            this.renderTodos();
        }
    }

    private toggleTodo(id: number): void {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date();
            this.saveTodos();
            this.renderTodos();
        }
    }

    private deleteTodo(id: number): void {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    private clearCompleted(): void {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.renderTodos();
    }

    private formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }

    private filterTodos(): Todo[] {
        return this.todos.filter(todo => {
            const priorityMatch = this.filterPriority.value === 'all' || todo.priority === this.filterPriority.value;
            const statusMatch = this.filterStatus.value === 'all' || 
                (this.filterStatus.value === 'completed' && todo.completed) ||
                (this.filterStatus.value === 'active' && !todo.completed);
            return priorityMatch && statusMatch;
        });
    }

    private renderTodos(): void {
        this.todoList.innerHTML = '';
        const filteredTodos = this.filterTodos();
        
        filteredTodos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = `group flex items-start p-4 mb-3 border-l-4 ${
                todo.priority === 'low' ? 'border-l-green-500' :
                todo.priority === 'medium' ? 'border-l-yellow-500' :
                'border-l-red-500'
            } bg-white rounded-md shadow hover:shadow-md transition-shadow`;
            
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'pt-1';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.className = 'w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500';
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            
            checkboxContainer.appendChild(checkbox);
            todoElement.appendChild(checkboxContainer);

            const todoContent = document.createElement('div');
            todoContent.className = 'flex-1 flex flex-col gap-2 px-4';

            if (this.editingId === todo.id) {
                const editForm = document.createElement('div');
                editForm.className = 'flex-1 flex flex-col gap-3';

                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = todo.text;
                editInput.className = 'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
                editInput.placeholder = 'Task name';

                const editDescription = document.createElement('textarea');
                editDescription.value = todo.description;
                editDescription.className = 'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none';
                editDescription.placeholder = 'Description (optional)';
                editDescription.rows = 2;

                const controlsContainer = document.createElement('div');
                controlsContainer.className = 'flex gap-3';

                const editPriority = document.createElement('select');
                editPriority.className = 'px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
                ['low', 'medium', 'high'].forEach(priority => {
                    const option = document.createElement('option');
                    option.value = priority;
                    option.text = priority.charAt(0).toUpperCase() + priority.slice(1);
                    option.selected = todo.priority === priority;
                    editPriority.appendChild(option);
                });

                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.className = 'px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500';
                saveButton.addEventListener('click', () => {
                    this.updateTodo(todo.id, editInput.value, editDescription.value, editPriority.value as 'low' | 'medium' | 'high');
                    this.editingId = null;
                });

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.className = 'px-4 py-2 bg-gray-500 text-white font-medium rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500';
                cancelButton.addEventListener('click', () => {
                    this.editingId = null;
                    this.renderTodos();
                });

                editForm.appendChild(editInput);
                editForm.appendChild(editPriority);
                editForm.appendChild(saveButton);
                editForm.appendChild(cancelButton);
                todoContent.appendChild(editForm);
            } else {
                const textContainer = document.createElement('div');
                textContainer.className = 'flex-1';

                const textSpan = document.createElement('span');
                textSpan.className = `block text-xl font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`;
                textSpan.textContent = todo.text;

                if (todo.description) {
                    const descriptionSpan = document.createElement('p');
                    descriptionSpan.className = `mt-2 text-base ${todo.completed ? 'text-slate-400' : 'text-slate-600'}`;
                    descriptionSpan.textContent = todo.description;
                    textContainer.appendChild(textSpan);
                    textContainer.appendChild(descriptionSpan);
                } else {
                    textContainer.appendChild(textSpan);
                }

                const todoMeta = document.createElement('div');
                todoMeta.className = 'text-sm text-slate-400 mt-2';
                todoMeta.textContent = `Created: ${this.formatDate(todo.createdAt)} | Updated: ${this.formatDate(todo.updatedAt)}`;
                todoContent.appendChild(textContainer);
            }

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'flex gap-3';

            if (this.editingId !== todo.id) {
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'px-6 py-2 bg-yellow-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500';
                editButton.addEventListener('click', () => {
                    this.editingId = todo.id;
                    this.renderTodos();
                });
                actionsDiv.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'px-6 py-2 bg-red-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500';
                deleteButton.addEventListener('click', () => this.deleteTodo(todo.id));
                actionsDiv.appendChild(deleteButton);
            }

            todoElement.appendChild(checkbox);
            todoElement.appendChild(todoContent);
            todoElement.appendChild(actionsDiv);
            this.todoList.appendChild(todoElement);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TodoList();
});