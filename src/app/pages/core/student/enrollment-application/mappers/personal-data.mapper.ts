import {EnrollmentApplicationState, LocationData, PersonalData, UserData} from "../enrollment-application.state";

export class EnrollmentApplicationMapper {

    static toPayloadDto(state: EnrollmentApplicationState) {
        return {
            personalInfoPayload:this.toPersonalInformationDto(state),
            originPayload:this.toOriginPlaceDto(state),
            residencePayload:this.toResidencePlaceDto(state),
        };
    }

    static toPersonalInformationDto(state: EnrollmentApplicationState) {
        return {
            user: this.mapUser(state.userData),
            informationStudent: this.mapPersonalData(state.personalData),
        };
    }

    static toOriginPlaceDto(state: EnrollmentApplicationState) {
        return {
            user: {originAddress: this.mapLocation(state.originPlace)},
        };
    }

    static toResidencePlaceDto(state: EnrollmentApplicationState) {
        return {
            user: {residenceAddress: this.mapLocation(state.residencePlace)},
        };
    }

    static toApplicationDto(state: EnrollmentApplicationState) {
        return {
            student: {
                id: state.application.student?.id,
            },
            academicPeriod: {
                id: state.application.academicPeriod?.id,
            },
            career: {
                id: state.application.career?.id,
            },
            parallel: {
                id: state.application.parallel?.id,
            },
            schoolPeriod: {
                id: state.application.schoolPeriod?.id,
            },
            workday: {
                id: state.application.workday?.id,
            },

            enrollmentDetails:
                state.application.enrollmentDetails?.map((detail) => ({
                    subject: {
                        id: detail.id,
                    },
                })) ?? [],
        };
    }

    private static mapUser(user: UserData) {
        return {
            identification: user.identification,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            personalEmail: user.personalEmail,
            phone: user.phone,
            cellPhone: user.cellPhone,
            birthdate: user.birthdate,

            identificationType: user.identificationType,
            gender: user.gender,
            ethnicOrigin: user.ethnicOrigin,
            maritalStatus: user.maritalStatus,
            nationality: user.nationality,
            sex: user.sex,
        };
    }

    private static mapPersonalData(pd: PersonalData) {
        return {
            career: pd.career,
            academicPeriod: pd.semester,
            contactEmergencyName: pd.contactEmergencyName,
            contactEmergencyPhone: pd.contactEmergencyPhone,
            contactEmergencyKinship: pd.contactEmergencyKinship,

            isDisability: pd.isDisability,
            disabilityType: pd.disabilityType,
            disabilityPercentage: pd.disabilityPercentage ? Number(pd.disabilityPercentage) : null,

            isAncestralLanguage: pd.isAncestralLanguage,
            ancestralLanguageName: pd.ancestralLanguageName,

            isCatastrophicIllness: pd.isCatastrophicIllness,
            catastrophicIllness: pd.catastrophicIllness,

            isForeignLanguage: pd.isForeignLanguage,
            foreignLanguageName: pd.foreignLanguageName,

            isHasChildren: pd.isHasChildren,
            childrenTotal: pd.childrenTotal ? Number(pd.childrenTotal) : null,

            isHouseHead: pd.isHouseHead,
            isPrivateSecurity: pd.isPrivateSecurity,
            isSocialSecurity: pd.isSocialSecurity,

            isWork: pd.isWork,
            monthlySalary: pd.monthlySalary,
            workingHours: pd.workingHours,
            workAddress: pd.workAddress,
            workPosition: pd.workPosition,

            town: pd.town,
            indigenousNationality: pd.indigenousNationality,
        };
    }

    private static mapLocation(loc: LocationData) {
        return {
            country: loc.country,
            province: loc.province,
            canton: loc.canton,
            parish: loc.parish,
            latitude: loc.latitude ? Number(loc.latitude) : null,
            longitude: loc.longitude ? Number(loc.longitude) : null,
            mainStreet: loc.mainStreet,
            number: loc.number,
            secondaryStreet: loc.secondaryStreet,
            reference: loc.reference,
        };
    }

}
