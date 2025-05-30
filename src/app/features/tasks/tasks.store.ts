import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { ITaskList } from './tasks.interface';
import { inject } from '@angular/core';
import { LocalstorageService } from '../../core/services/localstorage.service';
import { MessageService } from 'primeng/api';

type TaskState = {
  taskList: ITaskList[];
  isLoadig: boolean;
}

const initialState: TaskState = {
  taskList: [],
  isLoadig: false,
}

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      localStorage = inject(LocalstorageService),
      messageService = inject(MessageService),
    ) => ({
      getData(): ITaskList[] {
        const data = localStorage.getItem<ITaskList[]>('taskList');
        patchState(store, {
          taskList: data ? data : [],
          isLoadig: false,
        });
        return store.taskList();
      },

      newTask(newTask: ITaskList): void {
        patchState(store, {
          taskList: [newTask, ...store.taskList()],
          isLoadig: false,
        })
        localStorage.setItem('taskList', store.taskList());
      },

      editTask(updatedTask: ITaskList): void {
        patchState(store, {
          taskList: store.taskList().map((task) =>
            task.uuid === updatedTask.uuid ? { ...task, ...updatedTask } : task
          ),
        });
        localStorage.setItem('taskList', store.taskList());
      },

      deleteTask(uuid: string): void {
        patchState(store, {
          taskList: store.taskList().filter((task) => String(task.uuid) != uuid),
        });
        localStorage.setItem('taskList', store.taskList());
        messageService.add({
          key: 'toast',
          severity: 'success',
          summary: 'Éxito',
          detail: 'Registro eliminado',
          life: 3000
        });
      },
    })),
  withHooks({
    onInit: (state) => {
      state.getData();
    }
  })
)