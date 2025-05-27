import { NgModule } from '@angular/core';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';



@NgModule({
  declarations: [],
  imports: [],
  exports: [
    ButtonModule,
    ConfirmDialogModule,
    FileUploadModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TableModule,
    ToolbarModule,
    SelectModule,
  ]
})
export class PrimengModule { }
