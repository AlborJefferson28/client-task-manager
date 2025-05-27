import { Component, inject, OnInit } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng/primeng.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalTasksComponent } from '../modal-tasks/modal-tasks.component';
import { ITaskList } from '../../../features/tasks/tasks.interface';
import { TaskStore } from '../../../features/tasks/tasks.store';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-toolbar-crud',
  standalone: true,
  imports: [
    PrimengModule,
  ],
  providers: [DialogService],
  templateUrl: './toolbar-crud.component.html',
  styles: ``
})
export class ToolbarCrudComponent implements OnInit {
  private dialogService = inject(DialogService);
  private localStorageService = inject(LocalstorageService);
  private confirmationService = inject(ConfirmationService);

  ref: DynamicDialogRef | undefined;

  taskStore$ = inject(TaskStore);

  constructor() {

  }

  ngOnInit(): void { }

  exportData() {
    this.localStorageService.exportTaskList();
    this.confirmationService.confirm({
      header: 'Datos exportados correctamente',
      message: '¿Deseas limpiar tu tablero actual?',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.localStorageService.clearStorage();
        this.taskStore$.getData();
      },
      reject: () => {

      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.importData(file);
    }
  }

  importData(data: File) {
    this.localStorageService.importTaskList(data)
      .then((result: ITaskList[]) => {
        this.taskStore$.getData();
      })
      .catch((error: string) => {
        console.error('Error importing data:', error);
      });
  }

  public openModal(
    action: 'create' | 'edit' | 'delete' | 'view',
    data?: ITaskList
  ): void {
    this.ref = this.dialogService.open(ModalTasksComponent, {
      header: 'Crear Tarea',
      width: '550px',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: {
        mode: action,
        task: data
      }
    });

    this.ref.onClose
      .subscribe(
        (result: { data: ITaskList }) => {
          if (result.data) {
            this.taskStore$.newTask(result.data);
          }
        });
  }

}
