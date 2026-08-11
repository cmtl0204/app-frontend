import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService, CustomMessageService, FileHttpService } from '@utils/services';
import { FileUpload, FileSelectEvent } from 'primeng/fileupload';
import { Button } from "primeng/button";
import { CustomIcons } from '@utils/icons/custom-icons';
import { EnrollmentAplicationStore } from '../../enrollment-application.store';

@Component({
    selector: 'app-enrollment-attachment',
    imports: [FileUpload, Button],
    templateUrl: './enrollment-attachment.html',
})
export class EnrollmentAttachment {
    private readonly customMessageService = inject(CustomMessageService);
    private readonly store = inject(EnrollmentAplicationStore);
    private readonly catalogueService = inject(CatalogueService)
    private readonly fileHttpService = inject(FileHttpService)
    protected readonly CustomIcons = CustomIcons;
    protected catalog: WritableSignal<CatalogueInterface[]> = signal([]);
    files = signal<Record<string, File | null>>({});
    protected modelId = this.store.student.id

    onSelect(event: FileSelectEvent, item: any) {
        const file = event.files[0];

        this.files.update(current => ({
            ...current,
            [item.id]: file
        }));

        console.log('files:', this.files());
    }
    previous() {
        this.store.setStep(2);
    }
    next() {
        this.store.setStep(4);
    }
    ngOnInit() {
        this.loadCatalogue()
    }

    loadCatalogue() {
        const catalogues = this.catalogueService.findByType(CatalogueTypeEnum.enrollmentFileTypeOldStudent)
        this.catalog.set(catalogues)
        console.log('catalogo files: ', this.catalog())
    }
    upload(event: any, item: any) {
        const file = this.files()[item.id];

        if (!file) {
            console.warn('Selecciona un archivo');
            return;
        }

        // this.fileHttpService
        //     .upload(file, this.modelId, item.id)
        //     .subscribe({
        //         next: (res) => {
        //             console.log('OK:', res);
        //         }
        //     });
    }
}
