import { Injectable } from '@angular/core';
import { ITaskList } from '../../features/tasks/tasks.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private readonly storageKey = 'taskList';

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

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'tasklist.json';
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
}
