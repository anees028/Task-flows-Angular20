import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // needed for standard pipes
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms'; // needed for input binding

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.scss',
  
})
export class TaskDashboardComponent {
  // Inject the service (New generic injection style)
  taskService = inject(TaskService);

  addTask(title: string) {
    if (!title) return;
    this.taskService.addTask(title);
  }

  toggle(id: number) {
    this.taskService.toggleTask(id);
  }

  delete(id: number) {
    this.taskService.deleteTask(id);
  }
}
