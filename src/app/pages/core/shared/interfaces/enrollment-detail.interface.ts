import { CatalogueInterface } from "@utils/interfaces";
import { EnrollmentDetailStateInterface } from "./enrollment-detail-state.interface";
import { SubjectInterface } from "./subject.interface";

export interface EnrollmentDetailInterface {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    enrollmentId: string;

    subject: SubjectInterface;
    subjectId: string;

    academicState: CatalogueInterface | null;
    academicStateId: string | null;

    enrollmentDetailState: EnrollmentDetailStateInterface;
    enrollmentDetailStates: EnrollmentDetailStateInterface[];

    parallelId: string;
    workdayId: string;

    incomeTypeId: string | null;
    typeId: string | null;

    academicObservation: string | null;

    number: string;
    date: string | null;

    finalAttendance: string | null;
    finalGrade: string | null;
    supplementaryGrade: string | null;

    observation: string | null;
}
export interface EnrollmentDetailResponse {
    data: EnrollmentDetailInterface[];
}
