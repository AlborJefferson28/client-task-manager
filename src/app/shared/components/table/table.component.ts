import { Component, EventEmitter, Input, model, OnInit, Output } from '@angular/core';
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

  @Output() newItem = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();

  members = [
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
];

  constructor() {

  }

  ngOnInit(): void {

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
