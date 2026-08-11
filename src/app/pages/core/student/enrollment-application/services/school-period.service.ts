import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseInterface } from '@utils/interfaces';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class SchoolPeriodsService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.API_URL}/core/student/school-periods`;

    catalogue(): Observable<HttpResponseInterface> {
        return this.http.get<HttpResponseInterface>(
            `${this.apiUrl}/catalogue`
        );
    }

    findOpen(): Observable<HttpResponseInterface> {
        return this.http.get<HttpResponseInterface>(`${this.apiUrl}/open`);
    }
}
