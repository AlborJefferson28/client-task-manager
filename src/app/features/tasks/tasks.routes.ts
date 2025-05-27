import { Routes } from "@angular/router";

export const tasksRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./tasks.component').then(c => c.TasksComponent),
    },
    {
        path: 'to-do',
        loadComponent() {
            return import('./tasks.component').then(
                (c) => c.TasksComponent
            );
        },
    }
]