import { required, SchemaPathTree, validate } from "@angular/forms/signals"
import { ApplicationData } from "../enrollment-application.state"
//nombre de el archivo application-data.validation.ts
export function applyApplicationDataValidation(schema: SchemaPathTree<ApplicationData>) {
    required(schema.student, {
        message: 'El estudiante es necesario'
    })
    required(schema.career, {
        message: 'La carrera es necesaria'
    })
    required(schema.schoolPeriod, {
        message: 'El periodo ecolar es necesario'
    })
    required(schema.academicPeriod, {
        message: 'El periodo lectivo es necesario'
    })
    required(schema.workday, {
        message: 'El workday es necesario'
    })
    required(schema.parallel, {
        message: 'El paralelo es necesario'
    })

    validate(schema.enrollmentDetails, ({ value }) => {
        const items = value();

        if (!Array.isArray(items) || items.length === 0) {
            return {
                kind: 'required',
                message: 'Selecione almenos una asignatura'
            };
        }

        return null;
    })
}
