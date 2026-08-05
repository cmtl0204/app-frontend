import { CatalogueInterface } from "@utils/interfaces";
import {CareerInterface} from "@modules/core/shared/interfaces";
import { StudentInterface } from "@modules/core/shared/interfaces";

//Interfaces
export interface EnrollmentApplicationState {
    userData: UserData,
    personalData: PersonalData,
    originPlace: LocationData,
    residencePlace: LocationData,
    application: ApplicationData,
    files: FileData,
}
export interface PersonalInformationDto {
    userData: UserDataDto,
    personalData: PersonalDataDto,
}
export interface UserDataDto {
    birthdate: string;
    cellPhone: string;
    email: string;
    ethnicOriginId: CatalogueInterface;
    genderId: CatalogueInterface;
    identification: string;
    identificationTypeId: CatalogueInterface;
    lastname: string;
    maritalStatusId: CatalogueInterface;
    name: string;
    nationalityId: CatalogueInterface;
    personalEmail: string;
    phone: string;
    sexId: CatalogueInterface;
}
export interface PersonalDataDto {
    career?: CatalogueInterface,
    semesterId?: CatalogueInterface,
    contactEmergencyKinshipId: CatalogueInterface,
    contactEmergencyName: string,
    contactEmergencyPhone: string,
    isDisability: boolean,
    disabilityPercentage?: string,
    disabilityTypeId?: CatalogueInterface,
    isAncestralLanguage: boolean,
    ancestralLanguageNameId?: CatalogueInterface,
    isCatastrophicIllness: boolean,
    catastrophicIllness?: string,
    isForeignLanguage: boolean,
    foreignLanguageNameId?: CatalogueInterface,
    isHasChildren: boolean,
    childrenTotal?: string,
    isHouseHead: boolean,
    isPrivateSecurity: boolean,
    isSocialSecurity: boolean,
    isWork: boolean,
    monthlySalaryId?: CatalogueInterface,
    workAddress?: string,
    workingHoursId?: CatalogueInterface,
    workPosition?: string,
    town: CatalogueInterface,
    indigenousNationalityId: CatalogueInterface,
}
export interface LocationDto {
    locationData: LocationData,
}
export interface LocationDataDto {
    country: LocationInterface,
    province: LocationInterface,
    canton: LocationInterface,
    parish: LocationInterface,
    latitude: string,
    longitude: string,
    mainStreet: string,
    number: string,
    reference: string,
    secondaryStreet: string
}


export interface PersonalData {
    career: CatalogueInterface | null,
    semester: CatalogueInterface | null,
    contactEmergencyKinship: CatalogueInterface | null,
    contactEmergencyName: string,
    contactEmergencyPhone: string,
    isDisability: boolean,
    disabilityPercentage: string,
    disabilityType: CatalogueInterface | null,
    isAncestralLanguage: boolean,
    ancestralLanguageName: CatalogueInterface | null,
    isCatastrophicIllness: boolean,
    catastrophicIllness: string,
    isForeignLanguage: boolean,
    foreignLanguageName: CatalogueInterface | null,
    isHasChildren: boolean,
    childrenTotal: string,
    isHouseHead: boolean,
    isPrivateSecurity: boolean,
    isSocialSecurity: boolean,
    isWork: boolean,
    monthlySalary: CatalogueInterface | null,
    workAddress: string,
    workingHours: CatalogueInterface | null,
    workPosition: string,
    town: CatalogueInterface | null,
    indigenousNationality: CatalogueInterface | null,
}

export interface LocationInterface {
    id?: string;
    parent?: LocationInterface | null;
    parentId?: string;
    alpha2Code?: string;
    alpha3Code?: string;
    callingCode?: string;
    code?: string;
    flag?: string;
    latitude?: number;
    longitude?: number;
    level?: number;
    name?: string;
    zone?: string;
}

export interface LocationData {
    country: LocationInterface | null,
    province: LocationInterface | null,
    canton: LocationInterface | null,
    parish: LocationInterface | null,
    latitude: number,
    longitude: number,
    mainStreet: string,
    number: string,
    reference: string,
    secondaryStreet: string
}

export interface FileData {
    id: string;
    name: string;
    fullName: string;
    fullPath: string;
    description: string;
    extension: string;
    directory: string;
    originalName: string;
    type: CatalogueInterface | null;
}

export interface ApplicationData {
    student: StudentInterface | null,
    academicPeriod: CatalogueInterface | null,
    career: CareerInterface | null,
    enrollmentDetails: EnrollmentDetail[] | null,
    parallel: CatalogueInterface | null,
    schoolPeriod: CatalogueInterface | null,
    workday: CatalogueInterface | null,
}

export interface EnrollmentDetail {
    id: string,
    code: string,
    name: string
}
export interface UserData {
    birthdate: string;
    cellPhone: string;
    email: string;
    ethnicOrigin: CatalogueInterface | null;
    gender: CatalogueInterface | null;
    identification: string;
    identificationType: CatalogueInterface | null;
    lastname: string;
    maritalStatus: CatalogueInterface | null;
    name: string;
    nationality: CatalogueInterface | null;
    personalEmail: string;
    phone: string;
    sex: CatalogueInterface | null;
}
// export interface StudentInterface {
//     id: string;
//     createAt: string;
//     updateAt: string;
//     deleteAt: string;
//     isVisible: boolean;
//     informationStudent: PersonalData | null;
//     user: UserData | null;

// }

const initialFile: FileData = {
    id: '',
    name: '',
    fullName: '',
    fullPath: '',
    description: '',
    extension: '',
    directory: '',
    originalName: '',
    type: null
};

// const initialStudent: StudentInterface = {
//     id: '',
//     createAt: '',
//     updateAt: '',
//     deleteAt: '',
//     isVisible: false,
//     informationStudent: null,
//     user: null

// }

const initialLocation: LocationInterface = {
    id: '',
    parent: null,
    parentId: '',
    alpha2Code: '',
    alpha3Code: '',
    callingCode: '',
    code: '',
    flag: '',
    latitude: 0,
    longitude: 0,
    level: 0,
    name: '',
    zone: ''
};
const objectBase = { id: "", name: "" }
export const INITIAL_ENROLLMENT_APPLICATION_STATE: EnrollmentApplicationState = {
    userData: {
        birthdate: '',
        cellPhone: '',
        email: '',
        ethnicOrigin: null,
        gender: null,
        identification: '',
        identificationType: null,
        lastname: '',
        maritalStatus: null,
        name: '',
        nationality: null,
        personalEmail: '',
        phone: '',
        sex: null
    },
    personalData: {
        career: null,
        semester: null,
        contactEmergencyKinship: null,
        contactEmergencyName: '',
        contactEmergencyPhone: '',
        isDisability: false,
        disabilityPercentage: '',
        disabilityType: null,
        isAncestralLanguage: false,
        ancestralLanguageName: null,
        isCatastrophicIllness: false,
        catastrophicIllness: '',
        isForeignLanguage: false,
        foreignLanguageName: null,
        isHasChildren: false,
        childrenTotal: '',
        isHouseHead: false,
        isPrivateSecurity: false,
        isSocialSecurity: false,
        isWork: false,
        monthlySalary: null,
        workAddress: '',
        workingHours: null,
        workPosition: '',
        town: null,
        indigenousNationality: null,
    },
    originPlace: {
        country: null,
        province: null,
        canton: null,
        parish: null,
        latitude: 0,
        longitude: 0,
        mainStreet: '',
        number: '',
        reference: '',
        secondaryStreet: ''
    },
    residencePlace: {
        country: null,
        province: null,
        canton: null,
        parish: null,
        latitude: 0,
        longitude: 0,
        mainStreet: '',
        number: '',
        reference: '',
        secondaryStreet: ''
    },
    application: {
        student: null,
        academicPeriod: null,
        career: null,
        enrollmentDetails: null,
        parallel: null,
        schoolPeriod: null,
        workday: null,
    },
    files: {
        id: '',
        name: '',
        fullName: '',
        fullPath: '',
        description: '',
        extension: '',
        directory: '',
        originalName: '',
        type: null
    }
}
//dto
export interface GetAvailableSubjectsDto {
    careerId: string;
    schoolPeriodId: string;
    workdayId: string;
    parallelId?: string;
}
export interface AvailableSubjectResponse {
    id: string;
    code: string;
    name: string;
    credits: number;
}
export interface AvailableSubjectsResponse {
    data: AvailableSubjectResponse[];
    message: string;
}
