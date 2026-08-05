import { AuthInterface, RoleInterface, UserInterface } from '@modules/auth/interfaces';
import {SchoolPeriodInterface} from "@modules/core/shared/interfaces";

export interface SignInResponseInterface {
    data: DataSignInInterface;
    message: string;
    title: string;
    accessToken: string;
    refreshToken: string;
}

export interface DataSignInInterface {
    auth: AuthInterface;
    accessToken: string;
    refreshToken: string;
    roles: RoleInterface[];
    schoolPeriodOpen: SchoolPeriodInterface;
}
