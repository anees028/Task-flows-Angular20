import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

@Injectable({
  providedIn: 'root'  // ← Singleton service, auto-provided app-wide
})
export class TaskService {

  private http = inject(HttpClient);  // ← Modern inject() instead of constructor DI
  private apiUrl = 'https://127.0.0.1:8000/api/tasks';

  // ─── SIGNALS: Synchronous state management ───────────────────────────────

  // Source of truth — writable signal holding all tasks
  private _tasks = signal<Task[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public read-only signals exposed to components
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // computed() — derives state automatically from signals (like a getter)
  readonly completedCount = computed(() =>
    this._tasks().filter(t => t.isDone).length
  );

  readonly pendingCount = computed(() =>
    this._tasks().filter(t => !t.isDone).length
  );

  readonly hasTasks = computed(() => this._tasks().length > 0);

  // ─── RXJS: Async HTTP operations ─────────────────────────────────────────

  // BehaviorSubject for search/filter — holds current filter value
  private filterSubject = new BehaviorSubject<string>('');
  filter$ = this.filterSubject.asObservable();

  // toSignal() — bridges Observable → Signal for template use
  readonly currentFilter = toSignal(this.filter$, { initialValue: '' });

  // ─── HTTP METHODS ─────────────────────────────────────────────────────────

  loadTasks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => {
        this._tasks.set(tasks);       // ← set() replaces entire signal value
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Failed to load tasks. Is the Symfony server running?');
        this._loading.set(false);
        return throwError(() => err);
      })
    ).subscribe();
  }

  createTask(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, dto).pipe(
      tap(newTask => {
        // update() — mutates signal based on previous value
        this._tasks.update(tasks => [newTask, ...tasks]);
      }),
      catchError(err => {
        this._error.set('Failed to create task.');
        return throwError(() => err);
      })
    );
  }

  updateTask(id: number, dto: UpdateTaskDto): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(updated => {
        this._tasks.update(tasks =>
          tasks.map(t => t.id === id ? { ...t, ...updated } : t)
        );
      }),
      catchError(err => {
        this._error.set('Failed to update task.');
        return throwError(() => err);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._tasks.update(tasks => tasks.filter(t => t.id !== id));
      }),
      catchError(err => {
        this._error.set('Failed to delete task.');
        return throwError(() => err);
      })
    );
  }

  setFilter(value: string): void {
    this.filterSubject.next(value);
  }
}
