import { Component, effect, inject, signal } from '@angular/core';
import { ApplicationData, AvailableSubjectResponse } from '../../enrollment-application.state';
import { applyApplicationDataValidation, } from '../../validators/application-data-form.validation';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { TableModule } from "primeng/table";
import { Select } from "primeng/select";
import { LabelDirective } from "@utils/directives/label.directive";
import { CustomIcons } from '@utils/icons/custom-icons';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';
import { EnrollmentsService } from '../../services/enrollments.service';
import { AuthService } from '@modules/auth/auth.service';
import { CareerInterface, SchoolPeriodInterface } from '@modules/core/shared/interfaces';
import { SchoolPeriodService } from '@modules/core/shared/services/school-period.service';
import { CareerService } from '@modules/core/shared/services/career.service';
import { Tooltip } from "primeng/tooltip";
import { TeacherDistributionService } from '../../services/teacher-distribution.service';
import { StudentsService } from '../../services/students.srvices';
import { forkJoin } from 'rxjs';

const FORM_STATE_KEY = "application"

@Component({
    selector: 'app-application-form',
    imports: [TableModule, Select, LabelDirective, FormField, Tooltip],
    templateUrl: './application-form.html',
})
export class ApplicationForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly store = inject(EnrollmentAplicationStore);
    private readonly authService = inject(AuthService)
    protected readonly catalogueService = inject(CatalogueService);
    protected readonly careerService = inject(CareerService);
    private readonly enrollmentService = inject(EnrollmentsService);
    private readonly studentService = inject(StudentsService);
    private readonly teacherDistributionService = inject(TeacherDistributionService)

    protected readonly CustomIcons = CustomIcons;

    protected teacherDistributions = signal<any[]>([]);
    protected enrollmentsDetails = signal<any[]>([]);

    protected academicPeriods = signal<CatalogueInterface[]>([]);
    protected schoolPeriods = signal<SchoolPeriodInterface[]>([]);
    protected workdays = signal<CatalogueInterface[]>([]);
    protected parallels = signal<CatalogueInterface[]>([]);
    protected careers = signal<CareerInterface[]>([]);

    protected items = signal<AvailableSubjectResponse[]>([]);
    protected selectedItems = signal<any[] | null>(null);

    protected form$ = signal<ApplicationData>(this.store.application());
    protected formData = this.buildForm();

    constructor() {
        effect(() => {
            this.store.updateSection(FORM_STATE_KEY, this.form$());
        });

        effect(() => {
            this.form$.update(form => ({
                ...form,
                enrollmentDetails: this.selectedItems()?.length ? this.selectedItems() : null
            }));

        });
        //Reseteo en cascada si cambia algo arriba
        effect(() => {
            const academicPeriod = this.formData.academicPeriod().value();
            if (!academicPeriod) return;
            // this.formData.workday().reset(null);
            // this.formData.parallel().reset(null);
            // this.selectedItems.set([])
        });

        effect(() => {
            const teacherDistributions = this.teacherDistributions();
            const enrollmentsDetails = this.enrollmentsDetails();

            if (!teacherDistributions.length || !enrollmentsDetails.length) {
                return;
            }

            const lastEnrollment = enrollmentsDetails.at(0)!;//seria -1 por pruebas esta en 0
            console.log('lastEnrollment', lastEnrollment);
            console.log('lastEnrollment.subject', lastEnrollment?.subject);
            console.log('lastEnrollment.subject.academicPeriod', lastEnrollment?.subject?.academicPeriod);
            console.log('teacherDistributions', teacherDistributions);


            const academicPeriod = teacherDistributions.find(
                item =>
                    Number(item.subject.academicPeriod.code) ===
                    Number(lastEnrollment.subject.academicPeriod.code) + 1
            ).subject.academicPeriod;

            if(!academicPeriod)return;

            this.academicPeriods.set([academicPeriod]);
            this.formData.academicPeriod().reset(academicPeriod);
        });
        effect(() => {
            const teacherDistributions = this.teacherDistributions();
            const academicPeriod = this.formData.academicPeriod().value();

            if (!academicPeriod) {
                this.workdays.set([]);
                return;
            }

            const workdays = [
                ...new Map(
                    teacherDistributions
                        .filter(
                            item => item.subject.academicPeriod.id === academicPeriod.id,
                        )
                        .map(item => [item.workday.id, item.workday]),
                ).values(),
            ];

            this.workdays.set(workdays);

            // this.formData.workday().reset(null);
            // this.formData.parallel().reset(null);
        });
        effect(() => {
            const teacherDistributions = this.teacherDistributions();
            const academicPeriod = this.formData.academicPeriod().value();
            const workday = this.formData.workday().value();

            if (!academicPeriod || !workday) {
                this.parallels.set([]);
                return;
            }

            const parallels = [
                ...new Map(
                    teacherDistributions
                        .filter(
                            item =>
                                item.subject.academicPeriod.id === academicPeriod.id &&
                                item.workday.id === workday.id,
                        )
                        .map(item => [item.parallel.id, item.parallel]),
                ).values(),
            ];

            this.parallels.set(parallels);

            // this.formData.parallel().reset(null);
        });
        effect(() => {
            const teacherDistributions = this.teacherDistributions();
            const academicPeriod = this.formData.academicPeriod().value();
            const workday = this.formData.workday().value();
            const parallel = this.formData.parallel().value();

            if (!academicPeriod || !workday || !parallel) {
                this.items.set([]);
                return;
            }

            const subjects = [
                ...new Map(
                    teacherDistributions
                        .filter(
                            item =>
                                item.subject.academicPeriod.id === academicPeriod.id &&
                                item.workday.id === workday.id &&
                                item.parallel.id === parallel.id,
                        )
                        .map(item => [item.subject.id, item.subject]),
                ).values(),
            ];

            this.items.set(subjects);
        });
    }

    private buildForm(): FieldTree<ApplicationData> {
        return form(this.form$, (schema) => applyApplicationDataValidation(schema));
    }

    ngOnInit(): void {
        console.log('ngOnInit')
        this.formRegistryService.register(
            'Solicitud de Matricula',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.formData.student().reset(this.store.student);
        this.formData.schoolPeriod().reset(this.store.schoolPeriod);

        const data = this.store.application();

        this.selectedItems.set(data.enrollmentDetails?.length ? [...data.enrollmentDetails] : null);
        this.loadAllCatalogues();
        this.findInitialData();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    onSelectionChange(selected: any[]) {
        this.selectedItems.set(selected);
    }

    private findInitialData() {
        const studentId = this.formData.student().value()?.id;
        const schoolPeriodId = this.formData.schoolPeriod().value()?.id;

        if (!studentId || !schoolPeriodId) {
            return;
        }

        forkJoin({
            enrollments: this.studentService.enrollmentDetail(studentId),
            distributions: this.teacherDistributionService.getTecherDistribution(schoolPeriodId),
        }).subscribe({
            next: ({ enrollments, distributions }) => {
                console.log('enrollments:', enrollments)
                console.log('distribution:', distributions)
                this.enrollmentsDetails.set(enrollments.data);
                this.teacherDistributions.set(distributions.data);
            },
        });

    }
    private loadAllCatalogues() {
        this.academicPeriods.set(this.catalogueService.findByType(CatalogueTypeEnum.academicPeriod));
        this.workdays.set(this.catalogueService.findByType(CatalogueTypeEnum.enrollmentsWorkday));
        this.parallels.set(this.catalogueService.findByType(CatalogueTypeEnum.parallel));
        this.schoolPeriods.set([this.authService.schoolPeriodOpen]);

        this.careerService.loadCareers().subscribe({
            next: (response) => {
                this.careers.set(response);
            }
        });
    }

}
