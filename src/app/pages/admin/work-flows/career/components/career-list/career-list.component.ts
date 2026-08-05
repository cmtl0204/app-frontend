import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {CareerService} from "../../career.service";
import {CustomIcons} from "@utils/icons/custom-icons";
import {TableModule} from "primeng/table";
import {
    CareerInterface,
    FilterState,
    INITIAL_FILTER_STATE,
    InstitutionInterface
} from "@modules/admin/work-flows/career/career.state";
import {InputText} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";
import {Paginator, PaginatorState} from "primeng/paginator";
import {CatalogueInterface, INITIAL_PAGINATION, PaginationInterface} from "@utils/interfaces";
import {ButtonActionComponent} from "@utils/components/button-action/button-action.component";
import {ConfirmationService, MenuItem} from "primeng/api";
import {Tooltip} from "primeng/tooltip";
import {
    activateButtonAction,
    deleteButtonAction,
    editButtonAction,
    inactivationButtonAction,
    viewButtonAction
} from "@utils/components/button-action/consts";
import {Router} from "@angular/router";
import {MY_ROUTES} from "@routes";
import {debouncedSignal} from "@utils/helpers";
import {Select} from "primeng/select";
import {form, FormField} from "@angular/forms/signals";
import {CatalogueService} from "@utils/services";

@Component({
    selector: 'app-career-form-list',
    imports: [
        Button,
        TableModule,
        InputText,
        InputGroup,
        Paginator,
        ButtonActionComponent,
        Tooltip,
        Select,
        FormField
    ],
    templateUrl: './career-list.component.html'
})
export class CareerListComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly confirmationService = inject(ConfirmationService);
    protected readonly CustomIcons = CustomIcons;
    protected readonly careerService = inject(CareerService);
    protected readonly catalogueService = inject(CatalogueService);

    protected readonly items = signal<CareerInterface[]>([]);
    protected readonly pagination = signal<PaginationInterface>(INITIAL_PAGINATION);
    protected readonly buttonActions = signal<MenuItem[]>([]);
    protected isButtonActionsEnabled: boolean = false;

    protected readonly filter = signal<FilterState>(INITIAL_FILTER_STATE);
    protected readonly filterData = form<FilterState>(this.filter);
    private readonly debouncedSearch = debouncedSignal(this.filter);

    protected readonly institutions = signal<InstitutionInterface[]>([]);
    protected readonly schoolPeriods = signal<CatalogueInterface[]>([]);

    constructor() {
        this.filtering();
    }

    ngOnInit(): void {
        this.loadInstitutions();
        this.loadSchoolPeriods();
        this.loadItems();
    }

    private filtering(): void {
        effect(() => {
            this.findCareers(1, this.debouncedSearch());
        });
    }

    private buildButtonActions(item: CareerInterface, index: number): void {
        const actions: MenuItem[] = [];

        actions.push({
            ...viewButtonAction,
            command: () => this.goToCreate()
        });

        actions.push({
            ...editButtonAction,
            command: () => this.goToEdit(item)
        });

        actions.push({
            ...deleteButtonAction,
            command: () => this.delete(item)
        });

        if (item.isEnabled) {
            actions.push({
                ...inactivationButtonAction,
                command: () => this.goToCreate()
            });
        } else {
            actions.push({
                ...activateButtonAction,
                command: () => this.goToCreate()
            });
        }

        this.buttonActions.set(actions);
    }

    private loadItems() {
        this.findCareers();
    }

    protected goToCreate() {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute, 'new']);
    }

    private goToEdit(item: any) {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute, item.id]);
    }

    private delete(item: CareerInterface): void {
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: CustomIcons.TRASH_SOLID,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Eliminar',
            },
            accept: () => {
                this.careerService.deleteCareer(item.id).subscribe({
                    next: () => {
                        this.findCareers();
                    }
                })
            },
        });
    }

    private findCareers(page = 1, filtered?: FilterState) {
        this.careerService.findCareers(page, filtered).subscribe({
            next: (response) => {
                this.items.set(response.data);
                this.pagination.set(response.pagination!);
            }
        });
    }

    private loadInstitutions() {
        this.careerService.loadInstitutions().subscribe({
            next: (response) => {
                this.institutions.set(response);
            }
        });
    }

    private loadSchoolPeriods() {
        this.schoolPeriods.set(this.catalogueService.findByType('ACADEMIC_PERIOD'));
    }

    protected onSelect({item, index}: { item: any; index: number }) {
        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }

    protected onPageChange(paginatorState: PaginatorState) {
        if (paginatorState?.page || paginatorState.page === 0) this.findCareers(paginatorState.page + 1);
    }
}
