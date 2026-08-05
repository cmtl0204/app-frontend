import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from "primeng/accordion";
import { PersonalDataForm } from "../personal-data-form/personal-data-form";
import { ResidencePlaceForm } from "../residence-place-form/residence-place-form";
import { OriginPlaceForm } from "../origin-place-form/origin-place-form";
import { CustomMessageService } from '@utils/services';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { UserDataForm } from "../user-data-form/user-data-form";
import { EnrollmentApplicationMapper } from '../../mappers/personal-data.mapper';
import { StudentsService } from '../../services/students.srvices';
import { AuthService } from '@modules/auth/auth.service';


@Component({
    selector: 'app-personal-information',
    imports: [Button, Accordion, AccordionPanel, AccordionHeader, AccordionContent, PersonalDataForm, ResidencePlaceForm, OriginPlaceForm, UserDataForm],
    templateUrl: './personal-information.html',
})
export class PersonalInformation {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    private readonly studentsService = inject(StudentsService);
    private readonly authService = inject(AuthService)

    activePanel = 'user-data';

    nextPanel() {
        this.activePanel = 'origin-place';
    }

    nextResidence() {
        this.activePanel = 'residence-place';
    }

    nextPersonal() {
        this.activePanel = 'personal-data';
    }

    onSubmit() {
        const studentId = this.authService.auth.student.id
        // 1. Validar que no haya errores en ninguno de los formularios del acordeón
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        // 2. Validar que existan los estados
        if (
            !this.enrollmentApplicationStore.personalData() ||
            !this.enrollmentApplicationStore.userData() ||
            !this.enrollmentApplicationStore.residencePlace() ||
            !this.enrollmentApplicationStore.originPlace()
        ) {
            return;
        }

        const formState = this.enrollmentApplicationStore.formState();
        // const studentId = formState.application?.student?.id ;
        // if(!studentId)return;

        // 3. Mapear el estado a los 3 payloads que el backend nuevo espera por separado
        const personalInfoPayload = EnrollmentApplicationMapper.toPersonalInformationDto(formState);
        const originPayload = EnrollmentApplicationMapper.toOriginPlaceDto(formState);
        const residencePayload = EnrollmentApplicationMapper.toResidencePlaceDto(formState);

        console.log(' Payload datos personales:', personalInfoPayload);
        console.log(' Payload lugar de origen:', originPayload);
        console.log(' Payload lugar de residencia:', residencePayload);

        // 4. Enviar las 3 peticiones en secuencia
        this.studentsService.updatePersonalInformation(studentId, personalInfoPayload).subscribe({
            next: (response) => {
                console.log('✅ Datos personales guardados:', response);

                this.studentsService.updateOriginPlace(studentId, originPayload).subscribe({
                    next: (response) => {
                        console.log('✅ Lugar de origen guardado:', response);

                        this.studentsService.updateResidencePlace(studentId, residencePayload).subscribe({
                            next: (response) => {
                                console.log('✅ Lugar de residencia guardado:', response);
                                this.enrollmentApplicationStore.setStep(2);
                            },
                            error: (err) => {
                                console.error('❌ Error al guardar lugar de residencia:', err);
                            }
                        });
                    },
                    error: (err) => {
                        console.error('❌ Error al guardar lugar de origen:', err);
                    }
                });
            },

            error: (err) => {
                console.error('❌ Error al guardar datos personales:', err);
            }
        });
    }
}
