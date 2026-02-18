import { Injectable, signal, computed } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // 1. Define a Writable Signal (We can change this)
  // This holds our list of tasks.
  private taskListSignal = signal<Task[]>([
    { id: 1, title: 'Learn Angular 20', completed: false },
    { id: 2, title: 'Build TaskFlow', completed: false }
  ]);

  // 2. Define a Computed Signal (Read-only, updates automatically!)
  // Whenever taskListSignal changes, this updates instantly.
  readonly allTasks = this.taskListSignal.asReadonly();
  
  readonly completedCount = computed(() => 
    this.taskListSignal().filter(t => t.completed).length
  );

  // 3. Methods to modify the signal
  addTask(title: string) {
    const newTask: Task = { 
      id: Date.now(), 
      title, 
      completed: false 
    };
    // .update() is the new way to change a signal based on its previous value
    this.taskListSignal.update(tasks => [...tasks, newTask]);
  }
  

  deleteTask(id: number) {
    this.taskListSignal.update(tasks => tasks.filter(t => t.id !== id));
  }

  toggleTask(id: number) {
    this.taskListSignal.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }
}