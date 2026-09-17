export enum CatalogueTypeEnum {
    country = 'country',
    enrollmentFileTypeOldStudent = 'enrollmentFileTypeOldStudent',
    academicPeriod = 'academicPeriod',
    parallel = 'parallel',
    economicContribution = 'economicContribution',//?
    scholarshipFundingType = 'scholarshipFundingType',
    dpaTypes = 'dpaTypes',
    usersBloodType = 'usersBloodType',
    informationStudentsDisabilityType = 'informationStudentsDisabilityType',
    educationLevel = 'educationLevel',
    usersEthnicOrigin = 'usersEthnicOrigin',
    usersIdentificationType = 'usersIdentificationType',
    informationStudentsIndigenousNationality = 'informationStudentsIndigenousNationality',
    usersGender = 'usersGender',
    usersMaritalStatus = 'usersMaritalStatus',
    usersSex = 'usersSex',
    studentOccupation = 'studentOccupation',
    schoolPeriodsState = 'schoolPeriodsState',
    institutionsState = 'institutionsState',
    careersState = 'careersState',
    careersType = 'careersType',
    curriculumsState = 'curriculumsState',
    subjectsState = 'subjectsState',
    subjectsType = 'subjectsType',
    enrollmentsEnrollmentType = 'enrollmentsEnrollmentType',
    enrollmentDetailsEnrollmentsAcademicState = 'enrollmentDetailsEnrollmentsAcademicState',
    enrollmentsState = 'enrollmentsState',
    classroomsClassroomsState = 'classroomsClassroomsState',
    studentLive = 'studentLive',//?
    familyIncome = 'familyIncome',//?
    usersNationality = 'usersNationality',
    informationStudentsAncestralLanguageName = 'informationStudentsAncestralLanguageName',
    informationStudentsTown = 'informationStudentsTown',
    informationStudentsForeignLanguageName = 'informationStudentsForeignLanguageName',
    informationStudentsContactEmergencyKinship = 'informationStudentsContactEmergencyKinship',
    informationStudentsMonthlySalary = 'informationStudentsMonthlySalary',
    workingHours = 'workingHours',
    childrenTotal = 'childrenTotal',//?
    degreeSuperior = 'degreeSuperior',
    memberHouseNumber = 'memberHouseNumber',//?
    familyKinshipCatastrophicIllness = 'familyKinshipCatastrophicIllness',
    enrollmentsWorkday = 'enrollmentsWorkday',
    enrollmentFileTypeNewStudent = 'enrollmentFileTypeNewStudent',
    usersSecurityQuestion = 'usersSecurityQuestion',

    // Secretary module
    enrollment_type = 'enrollments_type',
    enrollment_state = 'enrollments_state',
    enrollment_workday = 'enrollments_workday',
    enrollment_academic_state = 'enrollments_academic_state',
    enrollment_academic_period = 'academic_period',
    enrollment_parallel = 'parallel',

}

// ── Enrollment state codes — Secretary module ───────────────────────────────
export enum CatalogueEnrollmentStateEnum {
    ENROLLED = 'enrolled',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    REVOKED = 'revoked',
    REQUESTED = 'request_sent',
}
