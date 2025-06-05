import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'features',
        pathMatch: 'full',
    },
    {
        path: 'features',
        loadComponent() {
            return import('./shared/components/layout/layout.component').then(
                (c) => c.LayoutComponent
            );
        },
        loadChildren() {
            return import('./features/features.routes').then(
                (c) => c.FeaturesRoutes
            );
        }
    },
];
