import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { UserData } from '../../enrollment-application.state';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { InputText } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { AccordionModule } from 'primeng/accordion';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Select } from 'primeng/select';
import { validateUserData } from '../../validators/user-data-form.validation';
import { DatePicker } from "primeng/datepicker";
import { CatalogueService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueInterface } from '@utils/interfaces';
const FORM_STATE_KEY = 'userData'
@Component({
    selector: 'app-user-data-form',
    imports: [FormField, InputText, FloatLabelModule, MessageModule, AccordionModule, LabelDirective, ErrorMessageDirective, Select, DatePicker],
    templateUrl: './user-data-form.html',
})
export class UserDataForm {

    private readonly formRegistryService = inject(FormRegistryService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    protected readonly catalogueService = inject(CatalogueService);


    protected readonly form$: WritableSignal<UserData> = signal(this.enrollmentApplicationStore.userData())

    protected readonly formData: FieldTree<UserData> = this.buildForm();

    protected identificationTypes: WritableSignal<CatalogueInterface[]> = signal([])
    protected maritalStatuses: WritableSignal<CatalogueInterface[]> = signal([])
    protected genders: WritableSignal<CatalogueInterface[]> = signal([])
    protected sexes: WritableSignal<CatalogueInterface[]> = signal([])
    protected ethnicOrigins: WritableSignal<CatalogueInterface[]> = signal([])
    protected nationalities: WritableSignal<CatalogueInterface[]> = signal([])
    constructor() {
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Estudiante',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
        this.loadAllCatalogues()
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }
    private buildForm(): FieldTree<UserData> {
        return form(this.form$, (schema) => {
            validateUserData(schema);
        });
    }
    private loadAllCatalogues(): void {
        this.identificationTypes.set(this.catalogueService.findByType(CatalogueTypeEnum.usersIdentificationType));
        this.maritalStatuses.set(this.catalogueService.findByType(CatalogueTypeEnum.usersMaritalStatus));
        this.genders.set(this.catalogueService.findByType(CatalogueTypeEnum.usersGender));
        this.sexes.set(this.catalogueService.findByType(CatalogueTypeEnum.usersSex));
        this.ethnicOrigins.set(this.catalogueService.findByType(CatalogueTypeEnum.usersEthnicOrigin));
        this.nationalities.set(this.catalogueService.findByType(CatalogueTypeEnum.usersNationality));
    }

}
