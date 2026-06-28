import {CatalogueInterface} from "@utils/interfaces";

export interface SignUpState {
    user: UserI;
}

export interface UserI {
    email: string;
    password: string;
    passwordConfirm: string;
    identification: string;
    name: string;
    username: string;
    termsAcceptedAt: boolean;
    securityQuestions: SecurityQuestionI | null;
}

export interface SecurityQuestionI {
    code: string;
    question: CatalogueInterface;
    answer: string;
}

export const INITIAL_STATE: SignUpState = {
    user: {
        email: '',
        password: '',
        passwordConfirm: '',
        identification: '',
        name: '',
        username: '',
        termsAcceptedAt: false,
        securityQuestions: null,
    }
};
