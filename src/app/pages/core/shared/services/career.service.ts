import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {
    CareerInterface,
    CareerState, FilterState, InstitutionInterface, SchoolPeriodInterface
} from "@modules/admin/work-flows/career/career.state";

@Injectable(
    {providedIn: 'root'}
)
export class CareerService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/core/shared/careers`;

    findCareers(page: number, filtered?: FilterState): Observable<HttpResponseInterface> {
        const url = this.apiUrl;

        let params = new HttpParams().append('page', page)

        if (filtered) {
            if (filtered.search) {
                params = params.append('search', filtered.search);
            }

            if (filtered.institutionId) {
                params = params.append('institutionId', filtered.institutionId);
            }

            if (filtered.schoolPeriodId) {
                params = params.append('schoolPeriodId', filtered.schoolPeriodId);
            }
        }

        return this.httpClient.get<HttpResponseInterface>(url, {params}).pipe(
            map((response) => {
                return response;
            })
        );
    }

    loadCareers(): Observable<CareerInterface[]> {
        const url = this.apiUrl;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findCareer(id: string): Observable<CareerInterface> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
