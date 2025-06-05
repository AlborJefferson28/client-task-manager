import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from "../../shared/components/table/table.component";
import { TASK_COLUMS } from './task.constants';
import { TaskStore } from './tasks.store';
import { ITaskList } from './tasks.interface';
import { ConfirmationService } from 'primeng/api';
import { PrimengModule } from '../../shared/primeng/primeng/primeng.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalTasksComponent } from '../../shared/components/modal-tasks/modal-tasks.component';
import { LocalstorageService } from '../../core/services/localstorage.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    TableComponent,
    PrimengModule,
  ],
    providers: [DialogService],
  templateUrl: './tasks.component.html',
  styles: ``
})
export class TasksComponent implements OnInit, OnDestroy {
  private confirmationService = inject(ConfirmationService);
  private ref: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  private localStorageService = inject(LocalstorageService);

  taskStore$ = inject(TaskStore);

  public columns = TASK_COLUMS;

  constructor() { }

  ngOnInit(): void {
    const filters = this.localStorageService.getFilterParams();

    if (filters?.isLoading) {
      this.filterTasks({
        uuid: '',
        name: filters.name,
        description: '',
        priority: filters.priority,
        status: filters.status
      });
    }
  }

  ngOnDestroy(): void {
    this.ref?.destroy;
  }

  public openModalTask(
    mode: 'create' | 'edit',
    task: { mode: 'create' | 'edit' | 'delete', data: ITaskList }
  ): void {
    this.ref = this.dialogService.open(ModalTasksComponent, {
      header: `${ mode === 'create' ? 'Crear' : 'Editar' } tarea`,
      width: '400px',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      baseZIndex: 10000,
      data: {
        mode: task.mode,
        task: task.data
      }
    });

    this.ref.onClose
      .subscribe(
        (result: { mode: string, data: ITaskList }) => {
          if (result?.data && result.mode === 'create') {
            this.taskStore$.newTask(result.data);
          }
          if (result?.data && result.mode === 'edit') {
            this.taskStore$.editTask(result.data);
          }
        });
  }

  removeTask(task: ITaskList): void {
    this.confirmationService.confirm({
      message: 'Por favor confirmar esta acción',
      header: 'Eliminar elemento',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.taskStore$.deleteTask(task.uuid);
      }
    });
  }

  filterTasks(task: ITaskList): void {
    this.taskStore$.filterTasks(task);
  }

}
