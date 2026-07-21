import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Todo, TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgIf, NgFor, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  todos: Todo[] = [];
  loading = false;
  errorMessage = '';

  form = {
    title: '',
    description: '',
  };

  editingTodoId: string | null = null;

  constructor(private readonly todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load todos. Make sure the API is running.';
        this.loading = false;
      },
    });
  }

  submitTodo(): void {
    if (!this.form.title.trim()) {
      return;
    }

    if (this.editingTodoId) {
      this.todoService
        .updateTodo(this.editingTodoId, {
          title: this.form.title,
          description: this.form.description,
        })
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadTodos();
          },
          error: () => {
            this.errorMessage = 'Could not update todo.';
          },
        });
      return;
    }

    this.todoService
      .createTodo({
        title: this.form.title,
        description: this.form.description,
      })
      .subscribe({
        next: () => {
          this.resetForm();
          this.loadTodos();
        },
        error: () => {
          this.errorMessage = 'Could not create todo.';
        },
      });
  }

  editTodo(todo: Todo): void {
    this.editingTodoId = todo._id;
    this.form.title = todo.title;
    this.form.description = todo.description;
  }

  toggleCompleted(todo: Todo): void {
    this.todoService
      .updateTodo(todo._id, { completed: !todo.completed })
      .subscribe({
        next: () => this.loadTodos(),
        error: () => {
          this.errorMessage = 'Could not update todo status.';
        },
      });
  }

  deleteTodo(todoId: string): void {
    this.todoService.deleteTodo(todoId).subscribe({
      next: () => this.loadTodos(),
      error: () => {
        this.errorMessage = 'Could not delete todo.';
      },
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.form.title = '';
    this.form.description = '';
    this.editingTodoId = null;
  }
}
