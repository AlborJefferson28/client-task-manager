import { Component, effect, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng/primeng.module';
import { ITableColumns } from './table.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalFilterComponent } from '../modal-filter/modal-filter.component';
import { ITaskList } from '../../../features/tasks/tasks.interface';
import { LocalstorageService } from '../../../core/services/localstorage.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    PrimengModule,
],
  templateUrl: './table.component.html',
  styles: ``
})
export class TableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) dataTable: any[] = [];
  @Input({ required: true }) columns: ITableColumns[] = [];

  @Output() newItem = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() filterTasks = new EventEmitter<any>();

  private ref: DynamicDialogRef | undefined;
  private dialogService = inject(DialogService);
  private localStageService = inject(LocalstorageService);

  public severity: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast" | null | undefined;

  constructor() {
    effect(() => {
      const mode = this.localStageService.filterMode();
      this.severity = mode ? 'info' : 'primary';
    });
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.ref?.destroy;
  }


  public openModalFilter(): void {
    this.ref = this.dialogService.open(ModalFilterComponent, {
      header: 'Filtrar por:',
      width: '450px',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    })

    this.ref.onClose.subscribe(
      (result: {data: ITaskList}) => {
        if (result?.data) {
          this.filterTasks.emit(result.data);
        }
      });
  }

  onNewItem(
    action: 'create' | 'edit' | 'delete',
    data?: any
  ): void {
    this.newItem.emit({ 
      mode: action,
      data: data,
    });
  }

  onEditItem(
    action: 'create' | 'edit' | 'delete',
    data: any
  ) {
    this.editItem.emit({
      mode: action,
      data: data,
    });
  }

  deleteProduct(data: any) {
    this.deleteItem.emit(data);
  }

}
