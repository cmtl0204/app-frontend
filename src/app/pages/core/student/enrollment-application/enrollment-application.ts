import { Component, inject, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ApplicationContainer } from "./components/application-container/application-container";
import { EnrollmentAttachment } from './components/enrollment-attachment/enrollment-attachment';
import { PersonalInformation } from './components/personal-information/personal-information';
import { EnrollmentAplicationStore } from './enrollment-application.store';
import { StudentsService } from './services/students.srvices';
import { AppService, FormRegistryService } from "@utils/services";
import { ReportEnrollment } from "./components/report-enrollment/report-enrollment";


@Component({
    selector: 'app-enrollment-application',
    imports: [ApplicationContainer, EnrollmentAttachment, StepperModule, PersonalInformation, ReportEnrollment],
    templateUrl: './enrollment-application.html',
})
export class EnrollmentApplication implements OnInit {
    private readonly studentService = inject(StudentsService);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly store = inject(EnrollmentAplicationStore);
    protected readonly appService = inject(AppService);
    protected actualPage = this.store.currentStep;


    ngOnInit() {
        this.loadData()
    }

    loadData() {
        this.studentService.getCurrentDraft().subscribe({
            next: (response) => {

                if (this.formRegistryService.hasErrors() && this.actualPage() == 1) {
                    this.store.hydrateFromServer(response);

                }

            }
        });
    }
}
