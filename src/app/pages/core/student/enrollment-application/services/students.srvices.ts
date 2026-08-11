import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpResponseInterface } from '@utils/interfaces';
import { PersonalInformationDto } from '../enrollment-application.state';
import { StudentInterface } from '@modules/core/shared/interfaces';
import {
    EnrollmentDetailInterface,
    EnrollmentDetailResponse
} from '@modules/core/shared/interfaces/enrollment-detail.interface';


@Injectable({
    providedIn: 'root'
})
export class StudentsService {
    private readonly apiUrl = `${environment.API_URL}/core/student/students`;
    private readonly httpClient = inject(HttpClient);


    getCurrentDraft(): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/current-draft`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }

    findAll(page: number = 0, search: string = ''): Observable<HttpResponseInterface> {
        const url = this.apiUrl;

        const headers = new HttpHeaders().append('pagination', 'true');
        const params = new HttpParams()
            .append('page', page)
            .append('search', search);

        return this.httpClient.get<HttpResponseInterface>(url, { headers, params }).pipe(
            map((response) => {
                return response;
            })
        );
    }

    findOne(id: string): Observable<StudentInterface> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map(response => {
                return response.data;
            })
        );
    }
    enrollmentDetail(id: string): Observable<EnrollmentDetailInterface> {
        const url = `${this.apiUrl}/${id}/enrollment-details`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map(response => {
                return response.data;
            })
        );
    }

    update(
        id: string,
        payload: PersonalInformationDto
    ): Observable<StudentInterface> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.put<HttpResponseInterface>(url, payload).pipe(
            map(response => response.data)
        );
    }

    updatePersonalInformation(id: string, payload: any): Observable<StudentInterface> {
        const url = `${this.apiUrl}/${id}/personal-information`;
        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data),
        );
    }

    updateOriginPlace(id: string, payload: any): Observable<StudentInterface> {
        const url = `${this.apiUrl}/${id}/origin-place`;
        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data),
            catchError((error: HttpErrorResponse) => {
                console.log('originAddress', error.error);
                return throwError(() => error);
            })
        );
    }

    updateResidencePlace(id: string, payload: any): Observable<StudentInterface> {
        const url = `${this.apiUrl}/${id}/residence-place`;
        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data),
            catchError((error: HttpErrorResponse) => {
                console.log("residenceAddress", error.error);
                return throwError(() => error);
            })
        );
    }


    // Preguntar
    /* updateCroquis(id: string, payload: UpdateStudentDto): Observable<StudentModel> {
       const url = `${this.apiUrl}/${id}/croquis`;

       this.coreService.isProcessing = true;
       return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
         map(response => {
           this.coreService.isProcessing = false;
           this.messageService.success(response).then();
           return response.data;
         })
       );
     }*/


}
