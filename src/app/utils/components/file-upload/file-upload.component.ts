import {Component, input, output} from '@angular/core';
import {FileUpload} from 'primeng/fileupload';
import {PrimeIcons} from 'primeng/api';
import {accept} from "@utils/components/file-upload/consts";
import {Message} from "primeng/message";
import {ButtonDirective} from "primeng/button";

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [FileUpload, Message, ButtonDirective],
    template: `
        <p-fileupload
            #fu
            mode="basic"
            chooseLabel="Examinar (max. 1MB)"
            uploadLabel="Subir archivo"
            [chooseIcon]="PrimeIcons.SEARCH"
            [accept]="accept()"
            [maxFileSize]="maxFileSize"
            [multiple]="multiple"
            invalidFileSizeMessageSummary="{0}: Archivo demasiado pesado, "
            invalidFileSizeMessageDetail="el tamaño máximo permitido es {0}."
            [auto]="true"
            [customUpload]="true"
            (uploadHandler)="onFileSelect($event)">
            <ng-template #content let-files let-removeFileCallback="removeFileCallback" let-messages="messages">
                aaa{{files.length}}aaaa
                @if (messages?.length) {
                    <div class="flex flex-col gap-2">
                        @for (msg of messages; track $index) {
                            <p-message [severity]="msg.severity">{{ msg.text }}</p-message>
                        }
                    </div>
                }
                @if (files.length) {
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-muted-color">{{ files.length }} file(s) selected</span>
                            <div class="flex items-center gap-2">
                                <button type="button" pButton variant="text" size="small" (click)="fu.upload()">Upload</button>
                                <button type="button" pButton variant="text" size="small" severity="danger" (click)="fu.clear()">Clear all</button>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            @for (file of files; track file.name + file.size; let i = $index) {
                                <div class="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-800">
                                    <div class="flex items-center gap-3">
                                        <svg data-p-icon="cloud-upload" class="text-primary shrink-0" />
                                        <div class="flex flex-col">
                                            <span class="text-sm font-medium">{{ file.name }}</span>
                                            <span class="text-xs text-muted-color">{{ formatSize(file.size) }}</span>
                                        </div>
                                    </div>
                                    <button type="button" pButton iconOnly variant="text" severity="secondary" size="small" rounded (click)="removeFileCallback($event, i)">
                                        <svg data-p-icon="times" />
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                }
            </ng-template>
        </p-fileupload>
    `
})
export class FileUploadComponent {
    protected readonly PrimeIcons = PrimeIcons;
    public uploadHandler = output();
    public accept = input<string>(accept.pdf);
    public maxFileSize = input<number>(1048576);
    public multiple = input<boolean>(false);

    formatSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    onFileSelect(event: any) {
        this.uploadHandler.emit(event);
    }
}
