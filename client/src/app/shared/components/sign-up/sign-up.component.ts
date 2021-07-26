import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  password = '';
  passwordOptions: any = {
    mode: 'password',
    value: this.password,
  };
  user: User;
  bloodType: Array<String> = ['A', 'B', 'O'];
  isCustomerInfoVisible: boolean = false;
  checkBoxOptions: any;
  signupButtonOptions: any = {
    text: 'Signup',
    type: 'normal',
    useSubmitBehavior: true,
  };
  resetButtonOptions: any = {
    text: 'Clear',
    type: 'normal',
    useSubmitBehavior: false,
    onClick: () => {
      this.form.instance.resetValues();
      this.form.instance.getEditor('userName').focus();
    },
  };
  constructor(private authService: AuthService) {}

  onFormShown(e: any) {
    setTimeout(() => {
      this.form.instance.getEditor('userName').focus();
    }, 200);
  }

  onSignupSubmit = (e: any) => {
    // console.log(this.user);
    e.preventDefault();
    this.authService.sendRegisterRequest(this.user);
  };

  ngOnInit(): void {
    this.checkBoxOptions = {
      text: 'Additional Information',
      value: false,
      onValueChanged: (e: any) => {
        this.isCustomerInfoVisible = e.component.option('value');
      },
    };
    this.user = {
      userName: '',
      passWord: '',
      role: 'Customer',
    };
  }
}
