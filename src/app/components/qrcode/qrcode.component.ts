import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";



@Component({
    selector: 'app-qrcode',
    // styleUrls: ['./shows.component.scss'],
    templateUrl: './qrcode.component.html',
})
export class CustomQRCodeComponent implements ViewCell, OnInit {

    QRrenderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    ngOnInit() {
        this.QRrenderValue = this.value.toString();
    }

}