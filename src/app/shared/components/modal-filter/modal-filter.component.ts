import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng/primeng.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TASK_PRIORITY, TASK_STATUS } from '../../../features/tasks/task.constants';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { TaskStore } from '../../../features/tasks/tasks.store';

@Component({
  selector: 'app-modal-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimengModule,
  ],
  templateUrl: './modal-filter.component.html',
  styles: ``
})
export class ModalFilterComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dynamicDialogRef = inject(DynamicDialogRef);
  
  public localStorageService = inject(LocalstorageService);
  public dynamicDialogConfig = inject(DynamicDialogConfig);

  taskStore$ = inject(TaskStore);

  public form!: FormGroup;
  public taskPriorities = TASK_PRIORITY;
  public taskStatus = TASK_STATUS;

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
    const filters = this.localStorageService.getFilterParams();

    if (filters?.isLoading) {
      this.form.patchValue({
        ...filters
      })
    }
  }

  
  clearFilter(): void {
    this.form.patchValue({
      name: [''],
      priority: [],
      status: [],
    });
    this.localStorageService.clearFilterParams();
    this.taskStore$.resetFilterTasks();
    this.closeModal();
  }

  closeModal(): void {
    this.dynamicDialogRef.close();
  }
  
  saveForm(): void {
    this.dynamicDialogRef.close({
      data: this.form.value
    });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: [''],
      priority: [],
      status: [],
    });
  }
}
