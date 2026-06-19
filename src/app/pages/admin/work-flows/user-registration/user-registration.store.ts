import {computed, Injectable, signal} from "@angular/core";
import {CareerCreateState, INITIAL_STATE, PrincipalData, SecondaryData, StateCareer} from "./user-registration.state";

const FORM_STATE_KEY = 'formState';

@Injectable({providedIn: 'root'})
export class CareerCreateStore {
    readonly formState = signal<CareerCreateState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly stateCareer = computed(() => this.formState().stateCareer);
    readonly principalData = computed(() => this.formState().principalData);
    readonly secondaryData = computed(() => this.formState().secondaryData);


    updateStateCareer(data: Partial<StateCareer>) {
        this.formState.update(state => ({
            ...state,
            stateCareer: {
                ...state.stateCareer,
                ...data
            }
        }));
    }

    updatePrincipalData(data: Partial<PrincipalData>) {
        this.formState.update(state => ({
            ...state,
            principalData: {
                ...state.principalData,
                ...data
            }
        }));
    }

    updateSecondaryData(data: Partial<SecondaryData>) {
        this.formState.update(state => ({
            ...state,
            secondaryData: {
                ...state.secondaryData,
                ...data
            }
        }));
    }

    private loadFromStorage(): CareerCreateState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
