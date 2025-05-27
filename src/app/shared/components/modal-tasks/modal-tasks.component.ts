import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { PrimengModule } from '../../primeng/primeng/primeng.module';
import { TASK_PRIORITY, TASK_STATUS } from '../../../features/tasks/task.constants';
import { ToolUUID } from '../../tools/uuid-generator.tool';

@Component({
  selector: 'app-modal-tasks',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimengModule,
  ],
  templateUrl: './modal-tasks.component.html',
  styles: ``
})
export class ModalTasksComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dynamicDialogRef = inject(DynamicDialogRef);
  private tooluuidGenerator = inject(ToolUUID);
  
  mode: 'create' | 'edit' | 'delete' = 'create';
  
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public form!: FormGroup;
  public taskPriorities = TASK_PRIORITY;
  public taskStatus = TASK_STATUS;

  constructor() { 
    this.buildForm();
  }

  ngOnInit(): void {
    const data = this.dynamicDialogConfig.data;
    if (data) {
      this.mode = data.mode || 'create';
      if (this.mode === 'edit') {
        this.form.patchValue(data.task);
      }
    }
  }


  closeModal(): void {
    this.dynamicDialogRef.close();
  }

  saveForm(): void {
    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        status: this.mode === 'create' ? 'pending' : this.form.value.status,
        uuid: this.mode === 'create' ? this.tooluuidGenerator.generateUUID() : this.form.value.uuid,
      };
      this.dynamicDialogRef.close({
        data: formData
      });
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      priority: [''],
      status: [''],
      uuid: [''],
    })
  }

}
