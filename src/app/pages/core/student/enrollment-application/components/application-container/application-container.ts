import { Component, inject } from '@angular/core';
import { ApplicationForm } from "../application-form/application-form";
import { Button } from "primeng/button";
import { CustomMessageService } from '@utils/services';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { CustomIcons } from '@utils/icons/custom-icons';
import { EnrollmentApplicationMapper } from '../../mappers/personal-data.mapper';
import { EnrollmentsService } from '../../services/enrollments.service';

const FORM_STATE_KEY = "application"
@Component({
    selector: 'app-application-container',
    imports: [ApplicationForm, Button],
    templateUrl: './application-container.html',
})
export class ApplicationContainer {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly store = inject(EnrollmentAplicationStore);
    private readonly enrollmentService = inject(EnrollmentsService)
    protected readonly CustomIcons = CustomIcons;

    previous() {
        this.store.setStep(1);
    }

    onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        if (!this.store.application()) return;

        const payload = EnrollmentApplicationMapper.toApplicationDto(
            this.store.formState()
        );

        this.enrollmentService.sendRegistration(payload).subscribe({
            next: (response) => {
                console.log(response);
                this.store.setStep(3);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}
