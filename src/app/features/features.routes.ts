import { Routes } from "@angular/router";

export const FeaturesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
    },
    {
        path: 'tasks',
        loadComponent() {
            return import('./tasks/tasks.component').then(
                (c) => c.TasksComponent
            );
        }
    }
]