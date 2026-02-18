import {
  Component, Output, EventEmitter,
  inject, signal, ChangeDetectionStrategy
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-form.component.html',
    styleUrl: './task-form.component.scss'
  })
export class TaskFormComponent {

  @Output() taskCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  // Signal for local UI state (submit button loading)
  submitting = signal(false);

  // Reactive Form with validators
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  isFieldInvalid(field: string): boolean {
    const control = this.taskForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.submitting.set(true);  // ← Signal update triggers UI change

    const { title, description } = this.taskForm.value;

    this.taskService.createTask({
      title: title!,
      description: description || undefined
    }).subscribe({
      next: () => {
        this.taskForm.reset();
        this.submitting.set(false);
        this.taskCreated.emit();
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }
}