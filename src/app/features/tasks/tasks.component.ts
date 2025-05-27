import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableComponent } from "../../shared/components/table/table.component";
import { ToolbarCrudComponent } from "../../shared/components/toolbar-crud/toolbar-crud.component";
import { TASK_COLUMS } from './task.constants';
import { TaskStore } from './tasks.store';
import { ITaskList } from './tasks.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimengModule } from '../../shared/primeng/primeng/primeng.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalTasksComponent } from '../../shared/components/modal-tasks/modal-tasks.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    TableComponent,
    ToolbarCrudComponent,
    PrimengModule,
  ],
    providers: [DialogService],
  templateUrl: './tasks.component.html',
  styles: ``
})
export class TasksComponent implements OnInit, OnDestroy {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
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

  editTask(task: ITaskList): void {
    this.ref = this.dialogService.open(ModalTasksComponent, {
      header: 'Editar Tarea',
      width: '550px',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: {
        mode: 'edit',
        task: task
      }
    });

    this.ref.onClose
      .subscribe(
        (result: { data: ITaskList }) => {
          if (result.data) {
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
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro eliminado',
          life: 3000
        });
      }
    });
  }

}
