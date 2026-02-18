import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush, // ← Only re-renders on signal/input changes
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);

  ngOnInit(): void {
    this.taskService.loadTasks(); // ← Load tasks on component init
  }

  toggleDone(task: Task): void {
    this.taskService.updateTask(task.id, { isDone: !task.isDone }).subscribe();
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe();
  }

  onTaskCreated(): void {
    // Tasks are updated via signal in the service — no reload needed
  }
}
