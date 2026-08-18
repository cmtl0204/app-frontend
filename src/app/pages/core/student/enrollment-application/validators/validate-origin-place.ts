import {
    required,
    minLength,
    pattern,
    SchemaPathTree,
} from '@angular/forms/signals';
import { LocationData } from '../enrollment-application.state';

export function applyOriginPlaceValidation(schema: SchemaPathTree<LocationData>): void {
    const countryValue = ({ valueOf }: any) => {
        const country = valueOf(schema.country)
        return country.name == 'Ecuador'
    }
    // País
    required(schema.country, { message: 'El país es requerido' });

    // Provincia
    required(schema.province, { message: 'La provincia es requerida', when: countryValue });

    // Cantón
    required(schema.canton, { message: 'El cantón es requerido', when: countryValue });

    // Parroquia
    required(schema.parish, { message: 'La parroquia es requerida', when: countryValue });

    // Calle principal
    required(schema.mainStreet, { message: 'La calle principal es requerida' });
    minLength(schema.mainStreet, 3, { message: 'La calle principal debe tener al menos 3 caracteres' });

    // Número
    required(schema.number, { message: 'El número es requerido' });
    pattern(schema.number, /^[a-zA-Z0-9-]+$/, { message: 'Formato solicitado AB-1234 O 123-ABC' });

    // Calle secundaria (opcional)
    minLength(schema.secondaryStreet, 3, { message: 'La calle secundaria debe tener al menos 3 caracteres' });

    // Referencia (opcional)
    minLength(schema.reference, 3, { message: 'La referencia debe tener al menos 3 caracteres' });
}
