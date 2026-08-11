import { Component, inject } from '@angular/core';
import { CustomIcons } from '@utils/icons/custom-icons';
import { Button } from "primeng/button";
import { ReportEnrollmentService } from '../../services/report-enrollmet.service';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';

@Component({
    selector: 'app-report-enrollment',
    imports: [Button],
    templateUrl: './report-enrollment.html',
})
export class ReportEnrollment {
    private store = inject(EnrollmentAplicationStore)
    private reportEnrollmentService = inject(ReportEnrollmentService)
    protected readonly CustomIcons = CustomIcons;
    previous() {
        this.store.setStep(3);
    }
    protected downloadReport() {
        try {
            const response = this.reportEnrollmentService.reportEnrollmentById(this.store.student.id).subscribe({
                next: (blob: Blob) => {
                    const fileUrl = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = fileUrl;
                    a.download = 'Comprobante_Matricula.pdf';

                    document.body.appendChild(a);
                    a.click();

                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(fileUrl);
                },
                error: (error) => {
                    console.error('Error al descargar el PDF:', error);
                }
            });
        } catch (error) {
            console.error(error)
        }
    }
}
