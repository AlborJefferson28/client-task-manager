import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ToolUUID {

  /**
   * Genera un UUID v4 según el estándar
   */
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}