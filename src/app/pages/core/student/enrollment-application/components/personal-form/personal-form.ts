import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { PersonalData } from '../../enrollment-application.state';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { applyPersonalDataValidation } from '../../validators/personal-data-form.validation';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { LabelDirective } from "@utils/directives/label.directive";
import { ErrorMessageDirective } from "@utils/directives/error-message.directive";
import { Select } from "primeng/select";
import { DatePickerModule } from 'primeng/datepicker';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';
import { CareerService } from '@modules/admin/work-flows/career/career.service';
import {ToggleSwitchComponent} from "@utils/components/toggle-switch/toggle-switch.component";
const FORM_STATE_KEY = "personalData"

@Component({
    selector: 'app-personal-form',
    imports: [FormField, DatePickerModule, InputText, FloatLabelModule, MessageModule, AccordionModule, LabelDirective, ErrorMessageDirective, Select, ToggleSwitchComponent],
    templateUrl: './personal-form.html',
})
export class PersonalForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly store = inject(EnrollmentAplicationStore);
    protected readonly catalogueService = inject(CatalogueService);
    protected readonly careerService = inject(CareerService);

    protected readonly form$: WritableSignal<PersonalData> = signal(this.store.personalData())

    protected readonly formData: FieldTree<PersonalData> = this.buildForm();
    //tambien signals todas las opciones
    protected workingHourstype: WritableSignal<CatalogueInterface[]> = signal([]);
    protected monthlySalarys: WritableSignal<CatalogueInterface[]> = signal([]);
    protected foreignLanguageNames: WritableSignal<CatalogueInterface[]> = signal([]);
    protected ancestralLanguageNames: WritableSignal<CatalogueInterface[]> = signal([]);
    protected indigenousNationalitys: WritableSignal<CatalogueInterface[]> = signal([]);
    protected towns: WritableSignal<CatalogueInterface[]> = signal([]);
    protected disabilityTypes: WritableSignal<CatalogueInterface[]> = signal([]);
    protected contactEmergencyKinships: WritableSignal<CatalogueInterface[]> = signal([]);
    protected careers: WritableSignal<CatalogueInterface[]> = signal([]);
    protected semesters: WritableSignal<CatalogueInterface[]> = signal([])

    constructor() {
        effect(() => {
            this.store.updateSection(FORM_STATE_KEY, this.form$());
        });
        effect(() => {
            if (!this.formData.isDisability().value()) {
                this.formData.disabilityType().reset(null);
                this.formData.disabilityPercentage().reset("");
            }
        });
        effect(() => {
            if (!this.formData.isAncestralLanguage().value()) {
                this.formData.ancestralLanguageName().reset(null);
            }
        });
        effect(() => {
            if (!this.formData.isCatastrophicIllness().value()) {
                this.formData.catastrophicIllness().reset("");
            }
        })
        effect(() => {
            if (!this.formData.isForeignLanguage().value()) {
                this.formData.foreignLanguageName().reset(null);
            }
        });
        effect(() => {
            if (!this.formData.isHasChildren().value()) {
                this.formData.childrenTotal().reset("");
            }
        });
        effect(() => {
            if (!this.formData.isWork().value()) {
                this.formData.monthlySalary().reset(null);
                this.formData.workAddress().reset("");
                this.formData.workingHours().reset(null);
                this.formData.workPosition().reset("");
            }
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Personales',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.loadAllCatalogues()
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private buildForm(): FieldTree<PersonalData> {
        return form(this.form$, (schema) => {
            applyPersonalDataValidation(schema);
        });
    }

    private loadAllCatalogues() {
        this.workingHourstype.set(
            this.catalogueService.findByType(CatalogueTypeEnum.workingHours)
        );
        this.monthlySalarys.set(
            this.catalogueService.findByType(CatalogueTypeEnum.informationStudentsMonthlySalary)
        );
        this.foreignLanguageNames.set(
            this.catalogueService.findByType(CatalogueTypeEnum.informationStudentsForeignLanguageName)
        );
        this.ancestralLanguageNames.set(
            this.catalogueService.findByType(CatalogueTypeEnum.informationStudentsAncestralLanguageName)
        );
        this.indigenousNationalitys.set(
            this.catalogueService.findByType(CatalogueTypeEnum.informationStudentsIndigenousNationality)
        );
        this.towns.set(
            this.catalogueService.findByType(CatalogueTypeEnum.informationStudentsTown)
        );
        this.disabilityTypes.set(
            this.catalogueService.findByType(CatalogueTypeEnum.informationStudentsDisabilityType)
        );
        this.contactEmergencyKinships.set(
            this.catalogueService.findByType(CatalogueTypeEnum.informationStudentsContactEmergencyKinship)
        );
        this.semesters.set(
            this.catalogueService.findByType(CatalogueTypeEnum.academicPeriod)
        );
        //la carrera viene de catalogo
        this.careers.set(this.catalogueService.findByType(CatalogueTypeEnum.careersType))
    }

}
