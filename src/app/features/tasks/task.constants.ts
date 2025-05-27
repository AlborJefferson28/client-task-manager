import { signal } from "@angular/core"
import { ITableColumns } from "../../shared/components/table/table.interface"

export const TASK_COLUMS = signal<ITableColumns[]>([
  {
    field: 'name',
    header: 'Nombre'
  },
  {
    field: 'description',
    header: 'Descripción'
  },
  {
    field: 'priority',
    header: 'Prioridad'
  },
  {
    field: 'status',
    header: 'Estado'
  }
])

export const TASK_PRIORITY = [
  { label: 'Baja', value: 'low', icon: 'pi-bolt', color: 'green' },
  { label: 'Media', value: 'medium', icon: 'pi-bolt', color: 'orange' },
  { label: 'Alta', value: 'high', icon: 'pi-bolt', color: 'red' },
]

export const TASK_STATUS = [
  { label: 'Pendiente', value: 'pending', icon: 'pi-pause-circle' },
  { label: 'En Progreso', value: 'in-progress', icon: 'pi-chevron-circle-right' },
  { label: 'Completada', value: 'completed', icon: 'pi-check-circle' }
]