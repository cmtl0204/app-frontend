export interface CareerCreateState {
    stateCareer: StateCareer;
    principalData: PrincipalData;
    secondaryData: SecondaryData;
}

export interface StateCareer {
    state: boolean;
    isVisible: boolean;
    modality: any;
}

export interface PrincipalData {
    code: string | null;
    name: string;
    degree: string;
    acronym: string;
}

export interface SecondaryData {
    code: string;
    shortName: string;
    logo: string;
    resolutionNumber: string;
}

export const INITIAL_STATE: CareerCreateState = {
    stateCareer: {
        state: true,
        isVisible: true,
        modality: null,
    },

    principalData: {
        code: '',
        name: '',
        degree: '',
        acronym: ''
    },

    secondaryData: {
        code: '',
        shortName: '',
        logo: '',
        resolutionNumber: ''
    },
};
