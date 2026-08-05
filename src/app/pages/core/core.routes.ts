import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';

export default [
    {
        path: MY_ROUTES.corePages.student.base,
        title: 'Estudiantes',
        loadChildren: () => import('@modules/core/student/student.routes')
    },
] as Routes;
