import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit{

  clientForm!: FormGroup;

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() savedUser: EventEmitter<any> = new EventEmitter<any>(true);
  @Input() client!: any;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.initUserForm();
    setTimeout(() => {
      if (this.client)
        this.clientForm.patchValue(this.client);
    }, 500);
  }


  initUserForm() {
    this.clientForm = this._fb.group({
      clientNo:[null],
      nameAr: [null],
      nameEn: [null],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.required],
      address: [null],
      buildingNo: [null],
      city: [null],
      country: [null],
    });
  }

  save() {
    const user = this.clientForm.value;
    this.savedUser.emit(user);
    this.close.emit(true);
  }

}
