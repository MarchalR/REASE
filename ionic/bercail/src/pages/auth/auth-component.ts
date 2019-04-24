import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {HomeComponent} from "../home/home-component";
import {Http, Headers, RequestOptions} from '@angular/http';
import {RegisterComponent} from "../register/register-component";
import {HttpHeaders, HttpParams} from "@angular/common/http";


@Component({
    selector: 'auth-component',
    templateUrl: 'auth-component.html'
})
export class AuthComponent {

    //homeComponent: any;
    registerComponent: any;

    constructor(public http:Http, public navCtrl: NavController,
    ) {
        //this.homeComponent = HomeComponent;
        this.registerComponent = RegisterComponent;
    }

    form={username:'',password:''};

    goBack() {
        this.navCtrl.pop();
    }

    postCall()
    {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        let data = "_username="+this.form.username+"&_password="+this.form.password;
        this.http.post("https://rease.fr/login_check", data, options)
            .map((data: any) => data.json())
            .subscribe(
                (data: any) => {
                    let userStatus = data;
                },
                err => console.log(err), // error
                () => console.log(data) // complete
            );
    }

    toRegister(){
        this.navCtrl.push(RegisterComponent);
    }


}