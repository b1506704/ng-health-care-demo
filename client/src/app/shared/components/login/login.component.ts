import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  password = '';
  passwordOptions: any = {
    mode: 'password',
    value: this.password,
  };
  user: User;
  loginButtonOptions: any = {
    text: 'Login',
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

  passwordComparison = () => {
    return this.form.instance.option('formData').Password;
  };

  checkComparison() {
    return true;
  }
  onFormShown(e: any) {
    setTimeout(() => {
      this.form.instance.getEditor('userName').focus();
    }, 200);
  }
  onLoginSubmit = (e: any) => {
    e.preventDefault();
    this.authService.sendLoginRequest(this.user);
    console.log(this.user);
  };
  ngOnInit(): void {
    this.user = {
      userName: '',
      passWord: '',
      role: ''
    };
  }
}
