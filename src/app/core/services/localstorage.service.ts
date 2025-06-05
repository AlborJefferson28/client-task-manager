import { Injectable, signal } from '@angular/core';
import { ITaskList } from '../../features/tasks/tasks.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private readonly storageKey = 'taskList';

  public filterMode = signal(false);

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  /**
   * Limpiar el localStorage.
   */
  clearStorage(): void {
    localStorage.removeItem(this.storageKey);
  }


  /**
  * Guarda la data del localStorage (clave `taskList`) como un archivo JSON.
  */
  exportTaskList(): void {
    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      console.warn('No hay tareas que exportar.');
      return;
    }

    const now = new Date();

    // Obtener partes de la fecha y hora con ceros a la izquierda si es necesario
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
    const year = String(now.getFullYear()).slice(-2); // Últimos dos dígitos
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const fileName = `tasklist${day}${month}${year}${hours}${minutes}.json`;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Carga un archivo .json con tareas y lo guarda en el localStorage.
   * Retorna un Promise que se resuelve con los datos importados.
   */
  importTaskList(file: File): Promise<ITaskList[]> {
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith('.json')) {
        reject('El archivo debe tener extensión .json');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const result = reader.result as string;
          const parsed: ITaskList[] = JSON.parse(result);

          // Validación opcional: verificar estructura
          if (!Array.isArray(parsed)) {
            throw new Error('El archivo no contiene un arreglo válido de tareas.');
          }

          // Guardar en localStorage
          localStorage.setItem(this.storageKey, JSON.stringify(parsed));

          resolve(parsed);
        } catch (error) {
          reject('Error al leer el archivo JSON: ' + (error as Error).message);
        }
      };

      reader.onerror = () => {
        reject('No se pudo leer el archivo.');
      };

      reader.readAsText(file);
    });
  }

  /**
   * Guarda los parámetros de filtrado del taskList store en localStorage.
   * @param params Objeto con los filtros de name, priority y status.
   */
  filterParams(params: { name: string; priority: string[]; status: string[], isLoading?: boolean }): void {
    try {
      localStorage.setItem('tasklist-filters', JSON.stringify(params));
      this.filterMode.set(params.isLoading ?? true);
    } catch (error) {
      console.error('Error al guardar los filtros en localStorage:', error);
    }
  }

  /**
   * Obtiene los parámetros de filtrado del taskList store desde localStorage.
   * @returns Objeto con los filtros o null si no existen.
   */
  getFilterParams(): {
     name: string; 
     priority: ITaskList['priority']; status: ITaskList['status'];
      isLoading: boolean 
    } | null {
    try {
      const filters = localStorage.getItem('tasklist-filters');
      return filters ? JSON.parse(filters) : null;
    } catch (error) {
      console.error('Error al leer los filtros del localStorage:', error);
      return null;
    }
  }

  /**
 * Elimina los parámetros de filtrado del localStorage y actualiza el estado del filtro.
 */
clearFilterParams(): void {
  try {
    localStorage.removeItem('tasklist-filters');
    this.filterMode.set(false);
  } catch (error) {
    console.error('Error al limpiar los filtros en localStorage:', error);
  }
}

}
