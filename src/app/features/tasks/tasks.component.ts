import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from "../../shared/components/table/table.component";
import { TASK_COLUMS } from './task.constants';
import { TaskStore } from './tasks.store';
import { ITaskList } from './tasks.interface';
import { ConfirmationService } from 'primeng/api';
import { PrimengModule } from '../../shared/primeng/primeng/primeng.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalTasksComponent } from '../../shared/components/modal-tasks/modal-tasks.component';

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

  taskStore$ = inject(TaskStore);

  public columns = TASK_COLUMS;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.ref?.destroy;
  }

  public openModalTask(task: { mode: 'create' | 'edit' | 'delete', data: ITaskList }): void {
    console.log('task', task);
    this.ref = this.dialogService.open(ModalTasksComponent, {
      header: 'Crear Tarea',
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
          console.log('result', result);
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

}
