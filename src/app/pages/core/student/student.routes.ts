import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {EnrollmentApplication} from "@modules/core/student/enrollment-application/enrollment-application";

export default [
    {
        path: MY_ROUTES.corePages.student.enrollment.base,
        title: 'Matrículas',
        component: EnrollmentApplication
    },
] as Routes;
