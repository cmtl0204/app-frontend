import { pattern, required, SchemaPathTree, validate } from "@angular/forms/signals"
import { UserData } from "../enrollment-application.state"

export function applyUserDataValidation(schema: SchemaPathTree<UserData>) {

    required(schema.birthdate,
        { message: 'La fecha de nacimiento es necesaria' }
    )
    validate(schema.birthdate, minAgeValidator(17, { message: 'Debes tener al menos 17 años de edad' }) as any);

    required(schema.ethnicOrigin,
        { message: 'El origen étnico es necesario' }
    )
    required(schema.gender,
        { message: 'El género es necesario' }
    )
    required(schema.identification,
        { message: 'El número de identificación es necesario' }
    )
    required(schema.identificationType,
        { message: 'El tipo de identificación es requerido' }
    )
    required(schema.lastname,
        { message: 'El apellido es necesario' }
    )
    required(schema.maritalStatus,
        { message: 'El estado civil es necesario' }
    )
    required(schema.name,
        { message: 'El nombre es necesario' }
    )
    required(schema.nationality,
        { message: 'La nacionalidad es necesaria' }
    )
    required(schema.sex,
        { message: 'El sexo es necesario' }
    )

    //validacion de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    required(schema.email,
        { message: 'El correo electrónico es necesario' }
    )
    pattern(schema.email,
        emailRegex,
        { message: 'El formato del correo electrónico no es válido' }
    )

    required(schema.personalEmail,
        { message: 'El correo electrónico personal es necesario' }
    )
    pattern(schema.personalEmail,
        emailRegex,
        { message: 'El formato del correo electrónico personal no es válido' }
    )

    //Numeros de telefono
    const phoneRegex = /^[0-9]{9,10}$/

    required(schema.cellPhone,
        { message: 'El teléfono celular es necesario' })
    pattern(schema.cellPhone,
        phoneRegex,
        { message: 'El teléfono celular debe contener entre 9 y 10 dígitos numéricos' }
    )

    required(schema.phone,
        { message: 'El teléfono es necesario' }
    )
    pattern(schema.phone,
        phoneRegex,
        { message: 'El teléfono debe contener entre 9 y 10 dígitos numéricos' }
    )
}

const minAgeValidator = (minYears: number, config: { message: string }) => {
    return (ctx: any) => {
        const valorFecha = ctx.value();
        if (!valorFecha) return null;

        const fechaNacimiento = new Date(valorFecha);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        return edad < minYears ? {kind:config.message } : null;
    };
};
