import { Component, inject } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng/primeng.module';
import { UploadEvent } from 'primeng/fileupload';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { ITaskList } from '../../../features/tasks/tasks.interface';
import { TaskStore } from '../../../features/tasks/tasks.store';

@Component({
  selector: 'app-modal-upload',
  standalone: true,
  imports: [
    PrimengModule,
  ],
  templateUrl: './modal-upload.component.html',
  styles: ``
})
export class ModalUploadComponent {
  private localStorageService = inject(LocalstorageService);

  taskStore$ = inject(TaskStore);

  uploadedFiles: any[] = [];

  onFileSelected(event: any): void {
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

}
