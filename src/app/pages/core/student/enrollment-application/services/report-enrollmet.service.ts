import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class ReportEnrollmentService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/reports/pdf`;

    reportEnrollmentById(studentId: string): Observable<Blob> {
        const url = `${this.apiUrl}/registration`;

        const params = new HttpParams().set('studentId', studentId);

        return this.httpClient.get(url, {
            params,
            responseType: 'blob'
        });
    }
}
