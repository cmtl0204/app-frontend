import {computed, Injectable, Signal, signal} from "@angular/core";
import {SignUpState, INITIAL_STATE, UserI} from "./sign-up.state";

const FORM_STATE_KEY = 'formState';

@Injectable({providedIn: 'root'})
export class SignUpStore {
    readonly formState = signal<SignUpState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly user: Signal<UserI> = computed(() => this.formState().user);


    updateSection<K extends keyof SignUpState>(
        section: K,
        data: Partial<SignUpState[K]>
    ) {
        this.formState.update(state => ({
            ...state,
            [section]: {
                ...state[section],
                ...data
            }
        }));
    }

    private loadFromStorage(): SignUpState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
