export interface CareerState {
    principalData: PrincipalData;
    secondaryData: SecondaryData;
}

export interface PrincipalData {
    code: string;
    name: string;
    degree: string;
    acronym: string;
}

export interface PrincipalData1 {
    career: CareerInterface;
    schoolPeriod: SchoolPeriodInterface;
}

export interface SecondaryData {
    code: string;
    shortName: string;
    logo: string;
    resolutionNumber: string;
    institution: InstitutionInterface | null;
}

export const INITIAL_STATE: CareerState = {
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
        resolutionNumber: '',
        institution: null
    },
};

export const PRINCIPAL_DATA_KEYS = ['code', 'name', 'degree', 'acronym'] as const satisfies (keyof PrincipalData)[];
export const SECONDARY_DATA_KEYS = ['code', 'shortName', 'logo', 'resolutionNumber'] as const satisfies (keyof SecondaryData)[];

type SectionKeysMap = {
    [K in keyof CareerState]: readonly (keyof CareerState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    principalData: PRINCIPAL_DATA_KEYS,
    secondaryData: SECONDARY_DATA_KEYS,
};

export interface CareerInterface {
    id: string;
    code: string;
    shortName: string;
    logo: string;
    resolutionNumber: string;
    isEnabled: boolean;
}

export interface SchoolPeriodInterface {
    id: string;
    code: string;
    shortName: string;
    logo: string;
    resolutionNumber: string;
    isEnabled: boolean;
}

export interface InstitutionInterface {
    id: string;
    code: string;
    name: string;
}

export interface FilterState {
    search: string;
    schoolPeriodId: string;
    institutionId: string;
}

export const INITIAL_FILTER_STATE: FilterState = {
    search: '',
    schoolPeriodId: '',
    institutionId: '',
};
