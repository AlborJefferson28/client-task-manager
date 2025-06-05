import { Component, inject, OnDestroy } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng/primeng.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalUploadComponent } from '../modal-upload/modal-upload.component';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { ITaskList } from '../../../features/tasks/tasks.interface';
import { TaskStore } from '../../../features/tasks/tasks.store';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-menubar',
    standalone: true,
    imports: [
        PrimengModule,
    ],
    providers: [DialogService],
    templateUrl: './menubar.component.html',
    styles: ``
})
export class MenubarComponent implements OnDestroy {
    private localStorageService = inject(LocalstorageService);
    private confirmationService = inject(ConfirmationService);

    taskStore$ = inject(TaskStore);

    private ref: DynamicDialogRef | undefined;

    public items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
        },
        {
            label: 'Projects',
            icon: 'pi pi-search',
            badge: '3',
            items: [
                {
                    label: 'Core',
                    icon: 'pi pi-bolt',
                    shortcut: '⌘+S',
                },
                {
                    label: 'Blocks',
                    icon: 'pi pi-server',
                    shortcut: '⌘+B',
                },
                {
                    separator: true,
                },
                {
                    label: 'UI Kit',
                    icon: 'pi pi-pencil',
                    shortcut: '⌘+U',
                },
            ],
        },
        {
            separator: true
        },
        {
            label: 'Sync',
            icon: 'pi pi-sync',
            items: [
                {
                    label: 'Import',
                    icon: 'pi pi-cloud-download',
                    shortcut: '⌘+U',
                    command: () => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json';
                        input.style.display = 'none';

                        // Escucha el cambio cuando el usuario seleccione un archivo
                        input.onchange = (event: Event) => {
                            const file = (event.target as HTMLInputElement).files?.[0];
                            if (file) {
                                this.localStorageService.importTaskList(file)
                                    .then((result: ITaskList[]) => {
                                        this.taskStore$.getData();
                                    })
                                    .catch((error: string) => {
                                        console.error('Error importing data:', error);
                                    });
                            }
                        }

                        // Simula el click para abrir el explorador de archivos
                        input.click();
                    }
                },
                {
                    label: 'Export',
                    icon: 'pi pi-cloud-upload',
                    shortcut: '⌘+E',
                    command: () => {
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
                }
            ]
        }
    ];

    ngOnDestroy(): void {
        this.ref?.close();
    }


}
