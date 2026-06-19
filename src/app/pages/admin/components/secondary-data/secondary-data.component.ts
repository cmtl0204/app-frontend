import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormRegistryService} from "@/pages/admin/services/form-registry.service";
import {email, FieldTree, form, required, SchemaPathTree} from "@angular/forms/signals";
import {CareerCreateStore} from "@/pages/admin/work-flows/user-registration/user-registration.store";
import {INITIAL_STATE, StateCareer} from "@/pages/admin/work-flows/user-registration/user-registration.state";

@Component({
    selector: 'app-secondary-data',
    imports: [],
    templateUrl: './secondary-data.component.html'
})
export class SecondaryDataComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerCreateStore);

    protected readonly form$ = signal<StateCareer>(INITIAL_STATE.stateCareer);

    protected readonly careerCreateForm: FieldTree<StateCareer> = this.buildForm;

    constructor() {

    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'careerCreateForm',
            this.careerCreateForm,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister('careerCreateForm');
    }

    get buildForm() {
        return form(this.form$, (schema) => {
            this.validateForm(schema)
        });
    }

    private validateForm(schema: SchemaPathTree<StateCareer>): void {
        //modality
        required(schema.modality, {message: 'El name es requerido'});
        email(schema.modality, {message: 'Ingresa un name válido'});

        //isVisible
        required(schema.isVisible, {message: 'El email debe tener al menos 2 caracteres'});
    }

    async save() {
        console.log(await this.formRegistryService.getFormErrors());
    }
}
