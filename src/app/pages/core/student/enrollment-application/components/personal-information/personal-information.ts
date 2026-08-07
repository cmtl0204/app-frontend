import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from "primeng/accordion";
import { PersonalForm } from "../personal-form/personal-form";
import { ResidencePlaceForm } from "../residence-place-form/residence-place-form";
import { OriginPlaceForm } from "../origin-place-form/origin-place-form";
import { CustomMessageService } from '@utils/services';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { UserForm } from "../user-form/user-form";
import { EnrollmentApplicationMapper } from '../../mappers/personal-data.mapper';
import { StudentsService } from '../../services/students.srvices';
import { AuthService } from '@modules/auth/auth.service';
import { forkJoin, tap } from 'rxjs';


@Component({
    selector: 'app-personal-information',
    imports: [Button, Accordion, AccordionPanel, AccordionHeader, AccordionContent, PersonalForm, ResidencePlaceForm, OriginPlaceForm, UserForm],
    templateUrl: './personal-information.html',
})
export class PersonalInformation {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly store = inject(EnrollmentAplicationStore);
    private readonly studentsService = inject(StudentsService);
    private readonly authService = inject(AuthService)

    activePanel = 'user-data';

    onSubmit() {
        const studentId = this.authService.auth.student.id;

        // 1. Validar que no haya errores en ninguno de los formularios del acordeón

        console.log(this.store.formState());
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const formState = this.store.formState();

        // 3. Mapear el estado a los 3 payloads que el backend nuevo espera por separado
        // const personalInfoPayload = EnrollmentApplicationMapper.toPersonalInformationDto(formState);
        // const originPayload = EnrollmentApplicationMapper.toOriginPlaceDto(formState);
        // const residencePayload = EnrollmentApplicationMapper.toResidencePlaceDto(formState);

        const {
            personalInfoPayload,
            originPayload,
            residencePayload
        } = EnrollmentApplicationMapper.toPayloadDto(formState);

        console.log(' Payload datos personales:', personalInfoPayload);
        console.log(' Payload lugar de origen:', originPayload);
        console.log(' Payload lugar de residencia:', residencePayload);

        forkJoin({
            personalInformation: this.studentsService.updatePersonalInformation(
                studentId,
                personalInfoPayload
            ),
            originPlace: this.studentsService.updateOriginPlace(
                studentId,
                originPayload
            ),
            residencePlace: this.studentsService.updateResidencePlace(
                studentId,
                residencePayload
            ),
        })
            .pipe(
                tap(() => {
                    this.store.setStep(2);
                })
            )
            .subscribe();
    }
}
