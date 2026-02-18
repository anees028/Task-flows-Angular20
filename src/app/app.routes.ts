import { Routes } from '@angular/router';

export const routes: Routes = [
  //   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //   { path: 'dashboard', component: TaskDashboardComponent },
  {path: '', redirectTo: 'tasks', pathMatch: 'full'},
  {
    path: '',
    // Lazy loading — loads only when route is accessed
    loadComponent: () =>
      import('./features/tasks/task-list/task-list.component').then(
        (m) => m.TaskListComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
