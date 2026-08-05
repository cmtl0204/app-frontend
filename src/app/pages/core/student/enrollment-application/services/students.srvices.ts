import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpResponseInterface } from '@utils/interfaces';
import { PersonalInformationDto } from '../enrollment-application.state';
import { StudentInterface } from '@modules/core/shared/interfaces';


@Injectable({
    providedIn: 'root'
})
export class StudentsService {
    API_URL = `${environment.API_URL}/core/student/students`;

    constructor(
        private httpClient: HttpClient,
    ) {
    }
    getCurrentDraft(): Observable<HttpResponseInterface> {
        return this.httpClient.get<HttpResponseInterface>(`${this.API_URL}/current-draft`);
    }
    findAll(page: number = 0, search: string = ''): Observable<HttpResponseInterface> {
        const url = this.API_URL;

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
        const url = `${this.API_URL}/${id}`;

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
        const url = `${this.API_URL}/${id}`;

        return this.httpClient.put<HttpResponseInterface>(url, payload).pipe(
            map(response => response.data)
        );
    }
    updatePersonalInformation(id: string, payload: any): Observable<StudentInterface> {
        const url = `${this.API_URL}/${id}/personal-information`;
        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data),
        );
    }

    updateOriginPlace(id: string, payload: any): Observable<StudentInterface> {
        const url = `${this.API_URL}/${id}/origin-place`;
        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data),
            catchError((error: HttpErrorResponse) => {
                console.log('originAddress',error.error);
                return throwError(() => error);
            })
        );
    }

    updateResidencePlace(id: string, payload: any): Observable<StudentInterface> {
        const url = `${this.API_URL}/${id}/residence-place`;
        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data),
            catchError((error: HttpErrorResponse) => {
                console.log("residenceAddress",error.error);
                return throwError(() => error);
            })
        );
    }


    // Preguntar
    /* updateCroquis(id: string, payload: UpdateStudentDto): Observable<StudentModel> {
       const url = `${this.API_URL}/${id}/croquis`;

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
