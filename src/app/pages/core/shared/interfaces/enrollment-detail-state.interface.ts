import { CatalogueInterface } from "@utils/interfaces";

export interface EnrollmentDetailStateInterface {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    state: CatalogueInterface;
    stateId: string;

    enrollmentDetailId: string;
    userId: string;

    date: string;
    observation: string | null;
}
