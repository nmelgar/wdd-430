import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:5000/api/todos';

  constructor(private readonly http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  createTodo(payload: { title: string; description: string }): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, payload);
  }

  updateTodo(id: string, payload: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, payload);
  }

  deleteTodo(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
