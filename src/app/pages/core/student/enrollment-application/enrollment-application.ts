import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {Application} from "./components/application/application";
import {EnrollmentAttachment} from './components/enrollment-attachment/enrollment-attachment';
import {PersonalInformation} from './components/personal-information/personal-information';
import {EnrollmentAplicationStore} from './enrollment-application.store';
import {StudentsService} from './services/students.srvices';
import {AppService} from "@utils/services";


@Component({
    selector: 'app-enrollment-application',
    imports: [Application, EnrollmentAttachment, StepperModule, PersonalInformation],
    templateUrl: './enrollment-application.html',
})
export class EnrollmentApplication implements OnInit {
    private readonly studentService = inject(StudentsService)
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    protected readonly appService = inject(AppService);
    protected actualPage = signal<number>(2)


    ngOnInit() {
        this.loadData()
    }

    loadData() {
        this.studentService.getCurrentDraft().subscribe({
            next: (response) => {
                this.enrollmentApplicationStore.hydrateFromServer(response);
            }
        });
    }
}
