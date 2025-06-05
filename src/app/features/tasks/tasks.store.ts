import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { ITaskList } from './tasks.interface';
import { inject } from '@angular/core';
import { LocalstorageService } from '../../core/services/localstorage.service';
import { MessageService } from 'primeng/api';

type TaskState = {
  taskList: ITaskList[];
  taskListFiltered: ITaskList[];
  isLoadig: boolean;
}

const initialState: TaskState = {
  taskList: [],
  taskListFiltered: [],
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
        this.getFilterTasks();
      },

      editTask(updatedTask: ITaskList): void {
        patchState(store, {
          taskList: store.taskList().map((task) =>
            task.uuid === updatedTask.uuid ? { ...task, ...updatedTask } : task
          ),
        });
        localStorage.setItem('taskList', store.taskList());
        this.getFilterTasks();
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
        this.getFilterTasks();
      },

      getFilterTasks(): void {
        const filterParams = localStorage.getFilterParams();
      
        if (!filterParams) return;
      
        const filtered = store.taskList().filter(task => {
          return Object.entries(filterParams).every(([key, value]) => {
            // Ignorar campos vacíos o nulos
            if (value === null || value === undefined || value === '') return true;
      
            const taskValue = String(task[key as keyof ITaskList] ?? '').toLowerCase();
      
            // Si el filtro es un array (Multiselect), verificar que el valor del task esté incluido
            if (Array.isArray(value)) {
              return value.some((v: string) => taskValue.includes(v.toLowerCase()));
            }
      
            const filterValue = String(value).toLowerCase();
            return taskValue.includes(filterValue);
          });
        });
      
        patchState(store, {
          taskListFiltered: filtered
        });
      },

      filterTasks(params: Partial<Record<keyof ITaskList, string | string[]>>): void {
        const filtered = store.taskList().filter(task => {
          return Object.entries(params).every(([key, value]) => {
            const taskValue = String(task[key as keyof ITaskList] ?? '').toLowerCase();
      
            // Si el filtro está vacío, se ignora
            if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
              return true;
            }
      
            // Si es un array, buscamos si el valor de la tarea está incluido en el filtro
            if (Array.isArray(value)) {
              return value.map(v => v.toLowerCase()).includes(taskValue);
            }
      
            // Si es un string simple, comparamos con includes
            return taskValue.includes(String(value).toLowerCase());
          });
        });
      
        // Guardamos filtros solo si alguno fue aplicado
        localStorage.filterParams({
          name: typeof params.name === 'string' ? params.name : '',
          priority: Array.isArray(params.priority) ? params.priority : (params.priority ? [params.priority] : []),
          status: Array.isArray(params.status) ? params.status : (params.status ? [params.status] : []),
          isLoading: true,
        });
      
        if (filtered.length === 0) {
          messageService.add({
            key: 'toast',
            severity: 'info',
            summary: 'Sin resultados',
            detail: 'No se encontraron elementos que coincidan con el filtro aplicado.',
            life: 3000
          });
        }
      
        patchState(store, {
          taskListFiltered: filtered
        });
      },      


      resetFilterTasks(): void {
        patchState(store, {
          taskListFiltered: [],
        });
      }

    })),
  withHooks({
    onInit: (state) => {
      state.getData();
    }
  })
)