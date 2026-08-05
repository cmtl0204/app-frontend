import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { LocationData, LocationInterface } from '../../enrollment-application.state';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { validateOriginPlace } from '../../validators/validate-origin-place';
import { MapComponent, MapCoords } from '../map/map';
import { Select } from 'primeng/select';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { InputText } from 'primeng/inputtext';
import { DpaService } from '@utils/services/dpa.service';
import { CatalogueService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';


const FORM_STATE_KEY = "residencePlace"
@Component({
    selector: 'app-residence-place-form',
    imports: [FormField, Select, ErrorMessageDirective, LabelDirective, InputText, MapComponent],
    templateUrl: './residence-place-form.html',
})
export class ResidencePlaceForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly dpaService = inject(DpaService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    private readonly catalogueService = inject(CatalogueService);

    protected readonly form$: WritableSignal<LocationData> = signal(this.enrollmentApplicationStore.residencePlace());
    protected readonly formData: FieldTree<LocationData> = this.buildForm;

    protected readonly countries = computed(() => {
        return this.catalogueService.findByType(CatalogueTypeEnum.country)
    });

    protected readonly provinces = computed(() => {
        return this.dpaService.findProvinces()
    });

    protected readonly cantons = computed(() => {
        const province = this.formData.province().value();

        if (!province || !province.id) return [];

        return this.dpaService.findDpaByParentId(province.id);
    });

    protected readonly parishes = computed(() => {
        const canton = this.formData.canton().value();

        if (!canton || !canton.id) return [];

        return this.dpaService.findDpaByParentId(canton.id);
    });

    constructor() {
        effect(() => {
            this.enrollmentApplicationStore.updateSection(FORM_STATE_KEY, this.form$());
        })
    }

    async ngOnInit() {
        this.formRegistryService.register(
            'Lugar de Recidencia',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        )

    }


    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    protected readonly selectedCenter = computed<MapCoords | null>(() => {
        const locations = [
            this.formData.parish().value(),
            this.formData.canton().value(),
            this.formData.province().value(),
            this.formData.country().value(),
        ];

        const selected = locations.find(
            location =>
                location?.latitude != null &&
                location?.longitude != null
        );

        if (!selected || !selected.latitude || !selected.longitude) {
            return null;
        }

        return {
            latitude: selected.latitude.toString(),
            longitude: selected.longitude.toString(),
        };
    });

    get buildForm() {
        return form(this.form$, (schema) => {
            validateOriginPlace(schema);
        });
    }


    // Para el Mapa
    onCoordsChange(coords: MapCoords): void {
        this.form$.update(state => ({
            ...state,
            latitude: coords.latitude,
            longitude: coords.longitude
        }));
    }
}
