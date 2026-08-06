import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {ApplicationContainer} from "./components/application-container/application-container";
import {EnrollmentAttachment} from './components/enrollment-attachment/enrollment-attachment';
import {PersonalInformation} from './components/personal-information/personal-information';
import {EnrollmentAplicationStore} from './enrollment-application.store';
import {StudentsService} from './services/students.srvices';
import {AppService} from "@utils/services";
import {INITIAL_STATE} from "@modules/admin/work-flows/career/career.state";
import {
    INITIAL_ENROLLMENT_APPLICATION_STATE
} from "@modules/core/student/enrollment-application/enrollment-application.state";


@Component({
    selector: 'app-enrollment-application',
    imports: [ApplicationContainer, EnrollmentAttachment, StepperModule, PersonalInformation],
    templateUrl: './enrollment-application.html',
})
export class EnrollmentApplication implements OnInit {
    private readonly studentService = inject(StudentsService)
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    protected readonly appService = inject(AppService);
    protected actualPage = this.enrollmentApplicationStore.currentStep;


    ngOnInit() {
        this.loadData()
    }

    loadData() {
        this.studentService.getCurrentDraft().subscribe({
            next: (response) => {
                const data = JSON.parse(sessionStorage.getItem('formState')!);

                if (!data?.userData?.identification) {
                    this.enrollmentApplicationStore.hydrateFromServer(response);
                }
            }
        });
    }
}
