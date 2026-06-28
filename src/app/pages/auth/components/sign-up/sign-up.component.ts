import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {RippleModule} from 'primeng/ripple';
import {CustomMessageService} from '@utils/services/custom-message.service';
import {AuthHttpService} from '../../auth-http.service';
import {environment} from '@env/environment';
import {DatePickerModule} from 'primeng/datepicker';
import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {KeyFilter} from 'primeng/keyfilter';
import {MY_ROUTES} from '@routes';
import {CatalogueService} from '@utils/services/catalogue.service';
import {CatalogueTypeEnum, CoreEnum} from '@utils/enums';
import {Tooltip} from 'primeng/tooltip';
import {CustomIcons} from "@utils/icons/custom-icons";
import {AppService, CatalogueHttpService, FormRegistryService} from '@utils/services';
import {TransactionalCodeComponent} from '@utils/components/transactional-code/transactional-code.component';
import {CatalogueInterface} from '@utils/interfaces';
import {Message} from 'primeng/message';
import {AutoFocus} from 'primeng/autofocus';
import {FieldTree, form, FormField, SchemaPathTree} from "@angular/forms/signals";
import {SignUpStore} from "@modules/auth/components/sign-up/sign-up.store";
import {signUpValidation} from "@modules/auth/components/sign-up/sign-up.validation";
import {UserI} from "@modules/auth/components/sign-up/sign-up.state";
import {InputGroup} from "primeng/inputgroup";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        ReactiveFormsModule,
        DatePickerModule,
        LabelDirective,
        ErrorMessageDirective,
        KeyFilter,
        Tooltip,
        TransactionalCodeComponent,
        Message,
        AutoFocus,
        FormField,
        InputGroup
    ]
})
export default class SignUpComponent implements OnInit {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly formStore = inject(SignUpStore);
    protected readonly form$: WritableSignal<UserI> = signal(this.formStore.user());
    protected readonly formData: FieldTree<UserI> = this.buildForm;
    private readonly FORM_STATE_KEY = 'user';
    protected transactionalCodeControl = form(signal(''));
    protected readonly showPasswordConfirm = signal(false);
    protected readonly showPassword = signal(false);


    async ngOnInit() {
        await this.loadSecurityQuestions();
        const test =this.formData.passwordConfirm
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(this.FORM_STATE_KEY);
    }

    get buildForm() {
        return form<UserI>(this.form$, (schema) => {
            signUpValidation(schema)
        });
    }

    protected readonly environment = environment;
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly CustomIcons = CustomIcons;
    protected allSecurityQuestions: CatalogueInterface[] = [];
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly appService = inject(AppService);
    private readonly catalogueHttpService = inject(CatalogueHttpService);
    private readonly catalogueService = inject(CatalogueService);
    private readonly authHttpService = inject(AuthHttpService);
    private readonly router = inject(Router);

    constructor() {

    }

    protected async loadSecurityQuestions() {
        this.catalogueHttpService.findCache().subscribe({
            next: async (response) => {
                await this.appService.setEncryptedValue(CoreEnum.catalogues, response);

                this.allSecurityQuestions = await this.catalogueService.findByType(CatalogueTypeEnum.users_security_question);
            }
        });
    }

    protected generateSecurityQuestions() {
        const selectedSecurityQuestions = this.allSecurityQuestions.sort(() => Math.random() - 0.5).slice(0, 3);

        selectedSecurityQuestions.forEach((q) => this.addQuestion(q));
    }

    protected openTerms() {
        window.open(`${environment.APP_PATH_ASSETS}/auth/files/legal.pdf`, '_blank');
    }

    protected addQuestion(question: any): void {
        // const group = this.formBuilder.group({
        //     code: [question.code, Validators.required],
        //     question: [question.name, Validators.required],
        //     answer: [null, Validators.required]
        // });

        // this.securityQuestionsField.push(group);
    }

    // protected watchFormChanges() {
    //     this.identificationField.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
    //         this.emailField.disable();
    //         this.rucField.reset();
    //
    //         if (this.identificationField.valid) this.findRUC(value);
    //     });
    //
    //     this.emailField.valueChanges.subscribe((value) => {
    //         this.transactionalCodeControl.reset();
    //         this.transactionalCodeControl.disable();
    //         this.passwordField.reset();
    //         this.passwordField.disable();
    //     });
    //
    //     this.transactionalCodeControl.statusChanges.subscribe((status) => {
    //         if (status === 'VALID') {
    //             this.nameField.enable();
    //             this.passwordField.enable();
    //         }
    //     });
    // }

    protected requestTransactionalCode() {
        // this.nameField.disable();
        // // this.nameField.reset();
        // this.passwordField.disable();
        // this.passwordField.reset();

        // this.transactionalCodeControl.reset();
        // this.transactionalCodeControl.disable();

        this.generateSecurityQuestions();

        this.authHttpService.requestTransactionalSignupCode(this.formData.email().value()!).subscribe({
            next: (_) => {
                // this.transactionalCodeControl.enable();
            }
        });
    }

    protected onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = this.formStore.formState();

        this.authHttpService.signUpExternal(payload).subscribe({
            next: (_) => {
                this.router.navigate([MY_ROUTES.authPages.signIn.absolute]);
            }
        });
    }

    togglePassword(){
        this.showPassword.update(value => !value);
    }

    togglePasswordConfirm(){
        this.showPasswordConfirm.update(value => !value);
    }

    // private validateForm() {
    //     const errors: string[] = [];
    //
    //     if (this.nameField.invalid) errors.push('Nombres');
    //     if (this.emailField.invalid) errors.push('Correo Electrónico');
    //     if (this.passwordField.invalid) errors.push('Contraseña');
    //     if (this.identificationField.invalid) errors.push('Identificación');
    //     if (this.termsAcceptedAtField.invalid) errors.push('Términos y Condiciones');
    //
    //     const invalidSecurityQuestions = this.securityQuestionsField.controls.some((ctrl) => ctrl.get('answer')?.invalid);
    //     if (invalidSecurityQuestions || this.securityQuestionsField.invalid) errors.push('Preguntas de seguridad');
    //
    //     if (errors.length > 0) {
    //         this.form.markAllAsTouched();
    //         this.customMessageService.showFormErrors(errors);
    //         return false;
    //     }
    //
    //     return true;
    // }
}
