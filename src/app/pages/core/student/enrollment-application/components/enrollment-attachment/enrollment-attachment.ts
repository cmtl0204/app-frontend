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
    private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
    private readonly catalogueService = inject(CatalogueService)
    private readonly fileHttpService = inject(FileHttpService)
    protected readonly CustomIcons = CustomIcons;
    protected catalog: WritableSignal<CatalogueInterface[]> = signal([]);
    files = signal<File[]>([]);
    protected modelId = this.enrollmentApplicationStore.student.id

    onSelect(event: FileSelectEvent) {
        this.files.set(event.files);
        console.log(this.files());
    }
    previous() {
        this.enrollmentApplicationStore.setStep(2);
    }
    ngOnInit() {
        this.loadCatalogue()
    }

    loadCatalogue() {
        this.catalog.set(this.catalogueService.findByType(CatalogueTypeEnum.enrollmentFileTypeOldStudent))
        console.log('catalogo files: ', this.catalog)
    }
    upload(payload: any, typeId: any) {
        this.fileHttpService.upload(payload, this.modelId, typeId).subscribe(response=>console.log(response))
    }
}
