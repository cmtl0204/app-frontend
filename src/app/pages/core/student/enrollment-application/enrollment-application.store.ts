//signals

import { computed, effect, inject, Injectable, signal } from "@angular/core";
import {
    ApplicationData,
    EnrollmentApplicationState,
    INITIAL_ENROLLMENT_APPLICATION_STATE,
    LocationData,
    PersonalData
} from "./enrollment-application.state";
import { AuthService } from "@modules/auth/auth.service";

const CATALOGUE_STATES = {
    REGISTERED: 'registered',
    REQUEST_SENT: 'request_sent',
    APPROVED: 'approved'
};
const FORM_STATE_KEY = 'formState';
const CURRENT_STEP_KEY = 'currentStep';

@Injectable({ providedIn: 'root' })
export class EnrollmentAplicationStore {
    private readonly authService = inject(AuthService);
    readonly formState = signal<EnrollmentApplicationState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly personalData = computed(() => this.formState().personalData);
    readonly userData = computed(() => this.formState().userData);
    readonly originPlace = computed(() => this.formState().originPlace);
    readonly residencePlace = computed(() => this.formState().residencePlace);
    readonly application = computed(() => this.formState().application);

    readonly currentStep = signal<number>(Number(sessionStorage.getItem(CURRENT_STEP_KEY)) || 1);
    readonly student = this.authService.auth.student;
    readonly schoolPeriod = this.authService.schoolPeriodOpen;

    constructor() {
        effect(() => {
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(this.formState()));
        });

        effect(() => {
            sessionStorage.setItem(CURRENT_STEP_KEY, this.currentStep().toString());
        });
    }

    updateSection<K extends keyof EnrollmentApplicationState>(
        section: K,
        data: Partial<EnrollmentApplicationState[K]>
    ) {
        this.formState.update(state => ({
            ...state,
            [section]: {
                ...state[section],
                ...data
            }
        }));
    }

    private loadFromStorage(): EnrollmentApplicationState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);

        return stored ? JSON.parse(stored) : INITIAL_ENROLLMENT_APPLICATION_STATE;
    }

    setStep(step: number) {
        this.currentStep.set(step);
    }

    hydrateFromServer(serverData: any) {
        if (!serverData) return;
        console.log('data store1: ', serverData)
        // 1. Mapear datos personales al estado (Paso 1)
        if (serverData.studentInfo) {
            this.updateSection('personalData', {
                // Corregido: career en lugar de carrer
                career: serverData.studentInfo.informationStudent?.career,
                semester: serverData.studentInfo.informationStudent?.academicPeriod,
                contactEmergencyKinship: serverData.studentInfo.informationStudent?.contactEmergencyKinship,
                contactEmergencyName: serverData.studentInfo.informationStudent?.contactEmergencyName,
                contactEmergencyPhone: serverData.studentInfo.informationStudent?.contactEmergencyPhone,
                isDisability: serverData.studentInfo.informationStudent?.isDisability,
                disabilityPercentage: serverData.studentInfo.informationStudent?.disabilityPercentage,
                disabilityType: serverData.studentInfo.informationStudent?.disabilityType,
                isAncestralLanguage: serverData.studentInfo.informationStudent?.isAncestralLanguage,
                ancestralLanguageName: serverData.studentInfo.informationStudent?.ancestralLanguageName,
                isCatastrophicIllness: serverData.studentInfo.informationStudent?.isCatastrophicIllness,
                catastrophicIllness: serverData.studentInfo.informationStudent?.catastrophicIllness,
                isForeignLanguage: serverData.studentInfo.informationStudent?.isForeignLanguage,
                foreignLanguageName: serverData.studentInfo.informationStudent?.foreignLanguageName,
                isHasChildren: serverData.studentInfo.informationStudent?.isHasChildren,
                childrenTotal: serverData.studentInfo.informationStudent?.childrenTotal,
                isHouseHead: serverData.studentInfo.informationStudent?.isHouseHead,
                isPrivateSecurity: serverData.studentInfo.informationStudent?.isPrivateSecurity,
                isSocialSecurity: serverData.studentInfo.informationStudent?.isSocialSecurity,
                isWork: serverData.studentInfo.informationStudent?.isWork,
                monthlySalary: serverData.studentInfo.informationStudent?.monthlySalary,
                workAddress: serverData.studentInfo.informationStudent?.workAddress,
                workingHours: serverData.studentInfo.informationStudent?.workingHours,
                workPosition: serverData.studentInfo.informationStudent?.workPosition,
                town: serverData.studentInfo.informationStudent?.town,
                indigenousNationality: serverData.studentInfo.informationStudent?.indigenousNationality,
            });

            // Corregido: Agregada la propiedad .user antes de los campos
            this.updateSection('userData', {
                birthdate: serverData.studentInfo.user?.birthdate,
                cellPhone: serverData.studentInfo.user?.cellPhone,
                email: serverData.studentInfo.user?.email,
                ethnicOrigin: serverData.studentInfo.user?.ethnicOrigin,
                gender: serverData.studentInfo.user?.gender,
                identification: serverData.studentInfo.user?.identification,
                identificationType: serverData.studentInfo.user?.identificationType,
                lastname: serverData.studentInfo.user?.lastname,
                maritalStatus: serverData.studentInfo.user?.maritalStatus,
                name: serverData.studentInfo.user?.name,
                nationality: serverData.studentInfo.user?.nationality,
                personalEmail: serverData.studentInfo.user?.personalEmail,
                phone: serverData.studentInfo.user?.phone,
                sex: serverData.studentInfo.user?.sex,
            });
        }

        if (serverData.location) {
            if (serverData.location.origin) {
                this.updateSection('originPlace', serverData.location.origin);
            }
            if (serverData.location.residence) {
                this.updateSection('residencePlace', serverData.location.residence);
            }
        }
        console.log('data store: ', serverData)
        // 2. Mapear datos de matrícula (Paso 2) y determinar el estado
        if (serverData.enrollment) {
            this.updateSection('application', {
                // student: serverData.enrollment.student,
                academicPeriod: serverData.enrollment.academicPeriod,
                career: serverData.enrollment.career,
                enrollmentDetails: serverData.enrollment.enrollmentDetails,
                parallel: serverData.enrollment.parallel,
                // schoolPeriod: serverData.enrollment.schoolPeriodId,
                workday: serverData.enrollment.workday,
            });
            // 3. Controlar el flujo según el estado del Backend
            const currentStateCode = serverData.enrollment.enrollmentStates?.[0]?.state?.code;

            console.log('estado enrolment: ', currentStateCode)
            if (currentStateCode === CATALOGUE_STATES.REQUEST_SENT || currentStateCode === CATALOGUE_STATES.APPROVED) {
                console.log('estado enrolment: ', currentStateCode)
                this.currentStep.set(4);
            } else if (currentStateCode === CATALOGUE_STATES.REGISTERED) {
                console.log('estado enrolment: ', currentStateCode)
                const hasSubjects = serverData.enrollment.enrollmentDetails?.length > 0;
                this.currentStep.set(hasSubjects ? 3 : 2);
            }
            console.log('estado enrolment: ', currentStateCode)
        } else {
            this.currentStep.set(1);
        }
    }
}
