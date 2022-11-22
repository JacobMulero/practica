import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs";
import {Respuesta, Usuario} from "./usuario";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-linkedin';
  user = {
    profileImageURL: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
  }
  public fecha_expiracion: any;
  private code: any;
  public token = '';
  @HostListener('window:message', ['$event'])
  onMessage(event:any) {
    if (event.data.type === 'code') {
      const {code} = event.data;
      this.getUserCredentials(code)
      this.code = code;
    }
  }
  constructor(private http: HttpClient) {
  }

  getCodeFromWindowURL(url: any) {
    const popupWindowURL = new URL(url);
    return popupWindowURL.searchParams.get("code");
  };

  showPopup = () => {
    const {clientId, redirectUrl, oauthUrl, scope, state} = environment.LinkedInApi;
    const oauthUrl2 = `${oauthUrl}&client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUrl}`;
    const width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;
    window.open(
      oauthUrl2,
      'Linkedin',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
      width +
      ', height=' +
      height +
      ', top=' +
      top +
      ', left=' +
      left
    );
  };
  showPopupPermisosPosts = () => {
    const {clientId, redirectUrl, oauthUrl, scope_posts, state} = environment.LinkedInApi;
    const oauthUrl2 = `${oauthUrl}&client_id=${clientId}&scope=${scope_posts}&state=${state}&redirect_uri=${redirectUrl}`;
    const width = 450,
      height = 730,
      left = window.screen.width / 2 - width / 2,
      top = window.screen.height / 2 - height / 2;
    window.open(
      oauthUrl2,
      'Linkedin',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
      width +
      ', height=' +
      height +
      ', top=' +
      top +
      ', left=' +
      left
    );
  };
  loggedIn = false;

  ngOnInit(): void {
    if (window.opener && window.opener !== window) {
      const code = this.getCodeFromWindowURL(window.location.href);
      window.opener.postMessage({'type': 'code', 'code': code}, '*')
      window.close();
    }
  }

  public postData():any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    });
    this.http.post('https://api.linkedin.com/v2/posts',{

    }, {headers:headers})

      .subscribe(res => {

      });
  }
  public getUserCredentials(code: any):any {
    this.http.get(environment.baseURL + environment.getUserCredentials + '?code=' + code)
      .pipe(map( respuesta => respuesta as Respuesta))
      .subscribe(res => {
        this.user = res.user;
        this.token = res.accessToken;
        const t = new Date();
        t.setSeconds(t.getSeconds() + res.expireIn);
        this.fecha_expiracion = t;
        this.loggedIn = true;
        // Do something with user
      });
  };
  public getUserCredentialsIncorrecto():any {
    this.http.get(environment.baseURL + environment.getUserCredentialsIncorrecto + '?code=' + this.code)
      .pipe(map( respuesta => respuesta as Respuesta))
      .subscribe(res => {
        this.user = res.user;
        this.token = res.accessToken;
        const t = new Date();
        t.setSeconds(t.getSeconds() + res.expireIn);
        this.fecha_expiracion = t;
        this.loggedIn = true;
        // Do something with user
      }, error => {
        alert(error.message)
      });
  };

  refresh() {
    this.showPopup()
  }

}
