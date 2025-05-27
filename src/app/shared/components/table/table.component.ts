import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrimengModule } from '../../primeng/primeng/primeng.module';
import { ITableColumns } from './table.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    PrimengModule,
  ],
  templateUrl: './table.component.html',
  styles: ``
})
export class TableComponent implements OnInit {
  @Input({ required: true }) dataTable: any[] = [];
  @Input({ required: true }) columns: ITableColumns[] = [];

  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  constructor() {

  }

  ngOnInit(): void {

  }

  editProduct(data: any) {
    this.editItem.emit(data);
  }

  deleteProduct(data: any) {
    this.deleteItem.emit(data);
  }

}
