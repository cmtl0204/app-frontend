import {Component, computed, effect, inject, signal, WritableSignal} from '@angular/core';
import {EnrollmentAplicationStore} from '../../enrollment-application.store';
import {FormRegistryService} from '@utils/services/form-registry.service';
import {FieldTree, form, FormField} from '@angular/forms/signals';
import {LocationData} from '../../enrollment-application.state';
import {applyOriginPlaceValidation} from '../../validators/validate-origin-place';
import {Select} from "primeng/select";
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {LabelDirective} from '@utils/directives/label.directive';
import {InputText} from 'primeng/inputtext';
import {DpaService} from '@utils/services/dpa.service';
import {CatalogueService} from '@utils/services';
import {CatalogueTypeEnum} from '@utils/enums';
import {MapLeafletComponent} from "@utils/components/map-leaflet/map-leaflet.component";
import {MapCoords} from "@utils/interfaces";
import {Tooltip} from "primeng/tooltip";


const FORM_STATE_KEY = "originPlace"

@Component({
    selector: 'app-origin-place-form',
    imports: [FormField, Select, ErrorMessageDirective, Select, LabelDirective, InputText, MapLeafletComponent, Tooltip],
    templateUrl: './origin-place-form.html',
})
export class OriginPlaceForm {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly store = inject(EnrollmentAplicationStore);
    //el catalogo para location debe se dpa , para qeu hat provinces , canton y parish
    private readonly catalogueService = inject(CatalogueService);
    private readonly dpaService = inject(DpaService);
    protected readonly form$: WritableSignal<LocationData> = signal(this.store.originPlace());
    protected readonly formData: FieldTree<LocationData> = this.buildForm;

    // Catálogo raíz (sin padre)
    //traer locaciones de dpa ya no de catalogue ademas como se maneja country si solo empieza de provinces
    protected readonly countries = computed(() => {
        return this.catalogueService.findByType(CatalogueTypeEnum.country)
    });

    protected readonly provinces = computed(() => {
        return this.dpaService.findProvinces();
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
            this.store.updateSection(FORM_STATE_KEY, this.form$());
        })
    }

    async ngOnInit() {

        this.formRegistryService.register(
            'Lugar de Procedencia',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );


    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    protected readonly selectedCenter = computed<MapCoords | null>(() => {
        console.log('selectedCenter');

        const selected = this.formData.parish().value()

        if (!selected || !selected.latitude || !selected.longitude) {
            return null;
        }

        return {
            latitude: selected.latitude,
            longitude: selected.longitude,
        };
    });

    get buildForm() {
        return form(this.form$, (schema) => {
            applyOriginPlaceValidation(schema);
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
