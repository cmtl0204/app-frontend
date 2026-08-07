import { CatalogueInterface } from "@utils/interfaces";
import { SchoolPeriodInterface } from "./school-period.interface";
import { SubjectInterface } from "./subject.interface";

export interface TeacherDistributionInterface {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    parallel: CatalogueInterface;
    parallelId: string;

    schoolPeriod: SchoolPeriodInterface;
    schoolPeriodId: string;

    subject: SubjectInterface;
    subjectId: string;

    teacherId: string;

    workday: CatalogueInterface;
    workdayId: string;

    capacity: number;
    hours: number;
}
export interface TeacherDistributionResponse {
    data: TeacherDistributionInterface[];
}
