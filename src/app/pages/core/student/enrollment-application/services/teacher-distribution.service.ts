import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
    TeacherDistributionInterface,
    TeacherDistributionResponse
} from '@modules/core/shared/interfaces/teacher-distribution.interface';
import {HttpResponseInterface} from "@utils/interfaces";

@Injectable({
    providedIn: 'root',
})
export class TeacherDistributionService {
    private readonly httpClient = inject(HttpClient);

    private readonly apiUrl = `${environment.API_URL}/core/student/teacher-distribution`;

    getTeacherDistribution(schoolPeriodId:string): Observable<TeacherDistributionInterface[]> {
        const url = `${this.apiUrl}`;

        return this.httpClient.get<HttpResponseInterface>(`${url}/${schoolPeriodId}`).pipe(
            map((response) => response.data)
        );
    }

}
