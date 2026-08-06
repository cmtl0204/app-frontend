import {Component, effect, inject, signal} from '@angular/core';
import {ApplicationData, AvailableSubjectResponse} from '../../enrollment-application.state';
import {applyApplicationDataValidation,} from '../../validators/application-data-form.validation';
import {FieldTree, form, FormField} from '@angular/forms/signals';
import {FormRegistryService} from '@utils/services/form-registry.service';
import {EnrollmentAplicationStore} from '../../enrollment-application.store';
import {TableModule} from "primeng/table";
import {Select} from "primeng/select";
import {LabelDirective} from "@utils/directives/label.directive";
import {CustomIcons} from '@utils/icons/custom-icons';
import {CatalogueInterface} from '@utils/interfaces';
import {CatalogueService} from '@utils/services';
import {CatalogueTypeEnum} from '@utils/enums';
import {EnrollmentsService} from '../../services/enrollments.service';
import {AuthService} from '@modules/auth/auth.service';
import {CareerInterface, SchoolPeriodInterface} from '@modules/core/shared/interfaces';
import {SchoolPeriodService} from '@modules/core/shared/services/school-period.service';
import {CareerService} from '@modules/core/shared/services/career.service';
import {Tooltip} from "primeng/tooltip";

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
    private readonly schoolPeriodsService = inject(SchoolPeriodService)

    protected readonly CustomIcons = CustomIcons;

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
            this.formData.workday().reset(null);
            this.formData.parallel().reset(null);
            this.selectedItems.set([])
        });

        //Buscar materias cuando los 5 filtros tengan valor
        effect(() => {
            const career = this.formData.career().value();
            const schoolPeriod = this.formData.schoolPeriod().value();
            const academicPeriod = this.formData.academicPeriod().value();
            const workday = this.formData.workday().value();
            const parallel = this.formData.parallel().value();
            console.log('student: ', this.formData.student().value())

            if (career && schoolPeriod?.id && academicPeriod?.id && workday?.id && parallel?.id) {
                this.findSubjectsForEnrollment(
                    career.id,
                    schoolPeriod.id,
                    academicPeriod.id,
                    workday.id,
                    parallel.id
                );//scool period traaer de la tabla school period
                // this.loadSubjectsForEnrollment(
                //     career.id,
                //     '68f67684-71b1-4df6-ad61-d2214dacc05e',
                //     academicPeriod.id,
                //     workday.id,
                //     parallel.id
                // );
            } else {
                this.items.set([]);
            }
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

        //cargar los datos reales desde los servicios
        const data = this.store.application();

        this.selectedItems.set(data.enrollmentDetails?.length ? [...data.enrollmentDetails] : null);

        this.loadAllCatalogues();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    onSelectionChange(selected: any[]) {
        this.selectedItems.set(selected);
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

    private findSubjectsForEnrollment(careerId: string, schoolPeriodId: string, academicPeriodId: string, workdayId: string, parallelId: string) {
        const payload = {
            careerId,
            schoolPeriodId,
            academicPeriodId,
            workdayId,
            parallelId
        };

        // this.items.set([]);

        this.enrollmentService.getAvailableSubjects(payload).subscribe({
            next: (response) => {
                this.items.set(response);
                console.log('respuesta: ', response);
            },
        });
    }
}
