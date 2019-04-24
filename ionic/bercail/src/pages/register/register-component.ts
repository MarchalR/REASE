import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Http, Headers, RequestOptions} from '@angular/http';

@Component({
    selector: 'register-component',
    templateUrl: 'register-component.html'
})
export class RegisterComponent {

    homeComponent: any;


    constructor(public navCtrl: NavController, public http:Http) { }

    form={username:'', email:'', password:''};

    goBack() {
        this.navCtrl.pop();
    }

    onRegister()
    {
        console.log(this.form);
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        let data = "username="+this.form.username+"&email="+this.form.email+"&password="+this.form.password;
        this.http.post("https://api.rease.fr/api/register", data, options)
            .map((data: any) => data.json())
            .subscribe(
                (data: any) => {
                    let userStatus = data;
                },
                err => console.log(err), // error
                () => console.log(data) // complete
            );
        this.navCtrl.goToRoot({});
    }
}