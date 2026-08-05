import { Component, inject } from '@angular/core';
import { ApplicationDataForm } from "../application-data-form/application-data-form";
import { Button } from "primeng/button";
import { CustomMessageService } from '@utils/services';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';
import { FormRegistryService } from '@utils/services/form-registry.service';
import { CustomIcons } from '@utils/icons/custom-icons';
import { EnrollmentApplicationMapper } from '../../mappers/personal-data.mapper';
import { EnrollmentsService } from '../../services/enrollments.service';

const FORM_STATE_KEY = "application"
@Component({
    selector: 'app-application',
    imports: [ApplicationDataForm, Button],
    templateUrl: './application.html',
})
export class Application {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    private readonly enrollmentService = inject(EnrollmentsService)
    protected readonly CustomIcons = CustomIcons;

    previous() {
        this.enrollmentApplicationStore.setStep(1);
    }

    onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        if (!this.enrollmentApplicationStore.application()) return;

        const payload = EnrollmentApplicationMapper.toApplicationDto(
            this.enrollmentApplicationStore.formState()
        );

        this.enrollmentService.sendRegistration(payload).subscribe({
            next: (response) => {
                console.log(response);
                this.enrollmentApplicationStore.setStep(3);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}
