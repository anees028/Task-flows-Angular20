import { Routes } from '@angular/router';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: TaskDashboardComponent },
];
