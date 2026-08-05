import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {SchoolPeriodInterface} from "@modules/core/shared/interfaces";

@Injectable(
    {providedIn: 'root'}
)
export class SchoolPeriodService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/core/shared/school-periods`;

    findSchoolPeriods(): Observable<SchoolPeriodInterface> {
        const url = this.apiUrl;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
