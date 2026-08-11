import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { TeacherDistributionResponse } from '@modules/core/shared/interfaces/teacher-distribution.interface';

@Injectable({
    providedIn: 'root',
})
export class TeacherDistributionService {
    private readonly httpClient = inject(HttpClient);

    private readonly apiUrl = `${environment.API_URL}/core/student/teacher-distribution`;

    getTecherDistribution(schoolPeriodId:string): Observable<TeacherDistributionResponse> {
        const url = `${this.apiUrl}`;

        return this.httpClient.get<TeacherDistributionResponse>(`${url}/${schoolPeriodId}`).pipe(
            map((response) => response)
        );
    }

}
