import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormRegistryService} from "@/pages/admin/services/form-registry.service";
import {email, FieldTree, form, required, SchemaPathTree} from "@angular/forms/signals";
import {CareerCreateStore} from "@/pages/admin/work-flows/user-registration/user-registration.store";
import {INITIAL_STATE, PrincipalData} from "@/pages/admin/work-flows/user-registration/user-registration.state";

@Component({
    selector: 'app-principal-data',
    imports: [],
    templateUrl: './principal-data.component.html'
})
export class PrincipalDataComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerCreateStore);

    protected readonly form$ = signal<PrincipalData>(INITIAL_STATE.principalData);

    protected readonly principalDataForm: FieldTree<PrincipalData> = this.buildForm;

    constructor() {

    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'principalDataForm',
            this.principalDataForm,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister('principalDataForm');
    }

    get buildForm() {
        return form(this.form$, (schema) => {
            this.validateForm(schema)
        });
    }

    private validateForm(schema: SchemaPathTree<PrincipalData>): void {
        //modality
        required(schema.name, {message: 'El name es requerido'});
        email(schema.acronym, {message: 'Ingresa un name válido'});

        //isVisible
        required(schema.code, {message: 'El email debe tener al menos 2 caracteres'});
    }

    async save() {
        console.log(await this.formRegistryService.getFormErrors());
    }
}
