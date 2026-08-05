import { Component, computed, inject, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { Application } from "./components/application/application";
import { EnrollmentAttachment } from './components/enrollment-attachment/enrollment-attachment';
import { PersonalInformation } from './components/personal-information/personal-information';
import { EnrollmentAplicationStore } from './enrollment-application.store';
import { StudentsService } from './services/students.srvices';


@Component({
    selector: 'app-enrollment-application',
    imports: [Application, EnrollmentAttachment, StepperModule, PersonalInformation],
    templateUrl: './enrollment-application.html',
})
export class EnrollmentApplication implements OnInit {
    private readonly studentService = inject(StudentsService)
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);

    protected isDataLoad = computed(() => this.enrollmentApplicationStore.isLoading())

    Page1 = this.enrollmentApplicationStore.paso1Completo
    Page2 = this.enrollmentApplicationStore.paso2Completo
    stepPlane = (page: number) => this.enrollmentApplicationStore.setStep(page)
    pageActual = () => this.enrollmentApplicationStore.pasoActual()
    ngOnInit() {
        this.fecthData()
    }
    fecthData() {
        this.enrollmentApplicationStore.isLoading.set(true);

        this.studentService.getCurrentDraft()
            .subscribe({
                next: (response) => {
                    this.enrollmentApplicationStore.isLoading.set(false)
                    this.enrollmentApplicationStore.hydrateFromServer(response.data);
                },
                error: () => {
                    this.enrollmentApplicationStore.isLoading.set(false)
                    // Manejar el error o dejar que use el sessionStorage
                }
            });
    }
}
