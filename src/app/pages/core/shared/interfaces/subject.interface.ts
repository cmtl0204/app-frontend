import { CatalogueInterface } from "@utils/interfaces";
import { CareerInterface } from "./career.interface";

export interface SubjectInterface {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    isVisible: boolean;
    isEnabled: boolean;

    academicPeriod: CatalogueInterface;
    academicPeriodId: string;

    career: CareerInterface | null;
    careerId: string | null;

    state: CatalogueInterface | null;
    stateId: string | null;

    type: CatalogueInterface | null;
    typeId: string;

    autonomousHour: number;
    code: string;
    credits: number;
    name: string;
    practicalHour: number;
    scale: number;
    teacherHour: number;
}
