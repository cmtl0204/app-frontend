import {
    minLength,
    pattern,
    required,
    SchemaPathTree,
} from '@angular/forms/signals';
import { PersonalData } from '../enrollment-application.state';

export function validatePersonalData(schema: SchemaPathTree<PersonalData> ): void {
    const isDisability = ({ valueOf }: any) => !!valueOf(schema.isDisability);
    const isCatastrophicIllness = ({ valueOf }: any) => !!valueOf(schema.isCatastrophicIllness);
    const isAncestralLanguage = ({ valueOf }: any) => !!valueOf(schema.isAncestralLanguage);
    const isForeignLanguage = ({ valueOf }: any) => !!valueOf(schema.isForeignLanguage);
    const isHasChildren = ({ valueOf }: any) => !!valueOf(schema.isHasChildren);
    const isWork = ({ valueOf }: any) => !!valueOf(schema.isWork);

    //Datos Academicos
    required(schema.career,{
        message:'La Carrera es requerida'
    })
    required(schema.semester,{
        message:'El Semestre es requerido'
    })

    // Contacto de emergencia
    required(schema.contactEmergencyKinship, {
        message: 'El parentesco es requerido'
    });
    required(schema.contactEmergencyName, {
        message: 'El nombre del contacto es requerido'
    });
    minLength(schema.contactEmergencyName, 3, {
        message: 'Debe tener al menos 3 caracteres'
    });
    required(schema.contactEmergencyPhone, {
        message: 'El teléfono es requerido'
    });
    pattern(schema.contactEmergencyPhone, /^[0-9]{10}$/, {
        message: 'Debe contener 10 dígitos'
    });

    // Ciudad
    required(schema.town, {
        message: 'La ciudad es requerida'
    });

    // Discapacidad
    required(schema.disabilityType, {
        message: 'El tipo de discapacidad es requerido',
        when: isDisability
    });
    required(schema.disabilityPercentage, {
        message: 'El porcentaje de discapacidad es requerido',
        when: isDisability
    });
    pattern(schema.disabilityPercentage, /^(100|[1-9]?[0-9])|^$/, {
        message: 'Ingrese un porcentaje válido entre 0 y 100',
    });

    // Idioma ancestral
    required(schema.ancestralLanguageName, {
        message: 'El idioma ancestral es requerido',
        when: isAncestralLanguage
    });


    // Enfermedad catastrófica
    required(schema.catastrophicIllness, {
        message: 'La enfermedad catastrófica es requerida',
        when: isCatastrophicIllness
    });
    minLength(schema.catastrophicIllness, 3, {
        message: 'Debe tener al menos 3 caracteres',
    });

    // Idioma extranjero
    required(schema.foreignLanguageName, {
        message: 'El idioma extranjero es requerido',
        when: isForeignLanguage
    });


    // Hijos
    required(schema.childrenTotal, {
        message: 'Ingrese el número de hijos',
        when: isHasChildren
    });
    pattern(schema.childrenTotal, /^[0-9]+$/, {
        message: 'Solo se permiten números'
    });

    // Trabajo
    required(schema.workPosition, {
        message: 'El cargo es requerido',
        when: isWork
    });
    required(schema.workAddress, {
        message: 'La dirección de trabajo es requerida',
        when: isWork
    });
    required(schema.workingHours, {
        message: 'Las horas de trabajo son requeridas',
        when: isWork
    });
    required(schema.monthlySalary, {
        message: 'El salario mensual es requerido',
        when: isWork
    });


    // Nacionalidad indígena
    required(schema.indigenousNationality,{
        message: 'La NacionalidadIndigena es requrida'
    });

}
