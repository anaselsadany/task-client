import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FAKE_DATA } from '../data/data';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn, DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  lang: any = "en"
  constructor(
    private translate: TranslateService,
    private _toastr: ToastrService,
    private _modal: BsModalService) {
      this.lang = localStorage.getItem('language') || 'en';
    // cache our list
    this.temp = [...FAKE_DATA];
    // push our inital complete list
    this.rows = FAKE_DATA;
  }

  saveClientData(client: any) {
    if (client?.id) {
      
      console.log('update', client);
      let clientData = this.temp.find(el => el.id == client.id);
      clientData.clientNo = client.clientNo;
      clientData.nameAr = client.nameAr;
      clientData.nameEn = client.nameEn
      clientData.email = client.email;
      clientData.phone = client.phone;
      clientData.address = client.address;
      clientData.City = client.city;
      clientData.country = client.country;

    } else {
      this.temp.push(client);
    }

    this.rows = this.temp;
    this._toastr.success(this.translate.instant('clientSavedSuccessfully'), this.translate.instant('clientData'));

  }

  deleteData(client: any) {
    console.log('delete', client);
    this.temp.splice(this.temp.findIndex(el => el.id == client.id), 1);
    this.rows = this.temp;
    // this._toastr.success('clientDeletedSuccess', 'clientDelete');
    this._toastr.success(this.translate.instant('clientDeletedSuccess'), this.translate.instant('clientDelete'));

  }

  //#region popup form
  modalRef?: BsModalRef;
  selectedclient!: any;
  addNew(template: TemplateRef<any>) {
    this.selectedclient = null;
    this.modalRef = this._modal.show(template, { class: 'modal-lg' });
  }
  updateDat(client: any, template: TemplateRef<any>) {
    this.selectedclient = client;
    this.modalRef = this._modal.show(template, { class: 'modal-lg' });
  }
  //#endregion

  ngOnInit(): void {
    this.columns =
       [{ name: 'ClientNo', headerTemplate: this.hdrTpl },{ name: 'NameAr', headerTemplate: this.hdrTpl }, { name: 'NameEn', headerTemplate: this.hdrTpl }, 
      { name: 'Email', headerTemplate: this.hdrTpl }, { name: 'Phone', headerTemplate: this.hdrTpl }, 
      { name: 'Address', headerTemplate: this.hdrTpl }, { name: 'City', headerTemplate: this.hdrTpl },
      { name: 'Country', headerTemplate: this.hdrTpl },
       { name: 'Action', headerTemplate: this.hdrTpl, cellTemplate: this.editTmpl, sortable: false }]
  }

  changeLanguage() {
    if (this.lang === 'en') {
      this.lang = 'ar';
      this.translate.use('ar');
      localStorage.setItem('language', 'ar');
    } else {
      this.lang = 'en';
      this.translate.use('en');
      localStorage.setItem('language', 'en');
    }
  }


  //#region datatable section
  @ViewChild('editTmpl', { static: true }) editTmpl!: TemplateRef<any>;
  @ViewChild('hdrTpl', { static: true }) hdrTpl!: TemplateRef<any>;
  rows: any[] = [];
  temp: any[] = [];
  columns: TableColumn[] = [];
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  ColumnMode = ColumnMode;
  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  //#endregion
}
