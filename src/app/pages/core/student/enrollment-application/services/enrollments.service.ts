import { inject, Injectable } from '@angular/core';
import { CatalogueInterface, HttpResponseInterface, ModelCatalogueInterface } from '@utils/interfaces';
import { CoreEnum } from '@utils/enums';
import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { AvailableSubjectsResponse, GetAvailableSubjectsDto } from '../enrollment-application.state';

@Injectable({
    providedIn: 'root'
})
export class EnrollmentsService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/core/student/enrollments`;


    getAvailableSubjects(query: GetAvailableSubjectsDto): Observable<AvailableSubjectsResponse> {
        let params = new HttpParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params = params.set(key, value.toString());
            }
        });

        return this.httpClient.get<AvailableSubjectsResponse>(
            `${this.apiUrl}/available-subjects`,
            { params }
        );

    }

    sendRegistration(payload: any): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/send-registration`;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }
}
