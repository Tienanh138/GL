import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StoreService } from "./store.service";
import { environment } from "../../environments/environment";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private urlLog = environment.base_api_url + "/user/log?os=web";
  private urlSysLogs = environment.base_api_url + "/user/logTrans?os=web";
  private urlUserInfo = environment.base_api_url + "/user/info?os=web";
  private urlMapFb = environment.base_api_url + "/user/mapFacebookInfo?os=web";
  private urlUpdate =
    environment.base_api_url + "/user/updateGeneralInfo?os=web";
  private urlResetPass =
    environment.base_api_url + "/user/changePassword?os=web";
  private urlWhypayInfo =
    environment.base_api_url + "/card/getWhypayInfo?os=web";
  private urlMapWhyapy = environment.base_api_url + "/card/mapWhaypay?os=web";
  private urlTranferWhypay =
    environment.base_api_url + "/card/transferWhypay?os=web";
  private urlLoginFacebook = environment.base_api_url + "/user/login?os=web";
  private urlLoginWeb = environment.base_api_url + "/user/loginV2?os=web";
  private urlForgotPassword = environment.base_api_url + "/user/forgotPassword?os=web";
  private urlForgotPasswordVerify = environment.base_api_url + "/user/forgotPasswordVerify?os=web";
  private urlRollUp = environment.base_api_url + "/user/rollUp?os=web";
  private urlInputCode = environment.base_api_url + "/user/share?os=web";

  private urlCheckCaptcha = environment.base_api_url + "/cpi/checkCaptcha?os=web";
  private urlVerifyEmail = environment.base_api_url + "/user/requestVerify?os=web";
  private urlVerifyFacebook = environment.base_api_url + "/user/linkFacebook?os=web";
  private urlLogout = environment.base_api_url + "/user/logout?os=web";
  private cookieURL = environment.base_api_url + "/cookie/";

  // private banksURL = environment.base_api_url + "/user/banks";

  constructor(private http: HttpClient, private storeService: StoreService) { }

  getUser() {
    let user = JSON.parse(localStorage.getItem("user"));
    return user;
  }

  async loginFacebook(token, promotion_code = null) {
    let url =
      this.urlLoginFacebook +
      "&facebook_token=" +
      token +
      (promotion_code ? "&promotion_code=" + promotion_code : "");
    return this.http.get(url).toPromise();
  }

  async getMylog(user) {
    return this.http
      .get(this.urlLog, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async getSysLogs(user) {
    return this.http
      .get(this.urlSysLogs, { headers: { app_token: user.app_token } })
      .toPromise();
  }
  async getUserInfo(user) {
    return this.http
      .get(this.urlUserInfo, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async mapFacebook(user, tokenFb) {
    return this.http
      .post(
        this.urlMapFb,
        { facebook_token: tokenFb },
        { headers: { app_token: user.app_token } }
      )
      .toPromise();
  }

  async update(user, data) {
    let url =
      this.urlUpdate + "&birth=" + data.birth + "&gender=" + data.gender;
    return this.http
      .get(url, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async resetPass(user, data) {
    let url = this.urlResetPass;
    return this.http
      .post(url, data, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async whypayInfo(user, whypay_code) {
    let url = this.urlWhypayInfo + "&whypay_code=" + whypay_code;
    return this.http
      .get(url, { headers: { app_token: user.app_token } })
      .toPromise();
  }
  async mapWhypay(user, whypay_code) {
    let url = this.urlMapWhyapy + "&whypay_code=" + whypay_code;
    return this.http
      .get(url, { headers: { app_token: user.app_token } })
      .toPromise();
  }
  async tranferWhypay(user, amount, whypay_code) {
    let url =
      this.urlTranferWhypay +
      "&amount=" +
      amount +
      "&whypay_code=" +
      whypay_code;
    return this.http
      .get(url, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async rollUp(user) {
    let url = this.urlRollUp;
    return this.http
      .get(url, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async inputCode(user, ref_code) {
    let url = this.urlInputCode + "&ref_code=" + ref_code;
    return this.http
      .get(url, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async checkCaptcha(input) {
    let url = this.urlCheckCaptcha + "&input=" + input;
    const res: any = this.http.get(url).toPromise();
    return res;
  }

  async isNeedPermission(user) {
    const res: any = this.http
      .get(this.urlUserInfo, { headers: { app_token: user.app_token } })
      .toPromise();
    if (res && res.code == 1 && res.data) {
      if (
        res.data.like == 0 &&
        res.data.share == 0 &&
        res.data.comment == 0 &&
        res.data.review == 0
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  async login(data) {
    let url = this.urlLoginWeb;
    return this.http
      .post(url,
        {
          email: data.email,
          password: data.password
        })
      .toPromise();
  }

  async verifyEmail(user, data) {
    let url = this.urlVerifyEmail;
    return this.http
      .post(url,
        {
          email: data.email,
          password: data.password
        },
        { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async verifyFacebook(user, data) {
    let url = this.urlVerifyFacebook;
    return this.http
      .post(url,
        {
          link: data.link,
        },
        { headers: { app_token: user.app_token } })
      .toPromise()
      .catch((err) => {
        console.error('An error occurred:', err.error);
      });
  }

  async logout(user) {
    const response: any = this.http
      .get(this.urlLogout,
        { headers: { app_token: user.app_token } })
      .toPromise()
      .catch((err) => {
        console.error('An error occurred:', err.error);
      });
    if (response && response.code == 1) {
      // console.log("logout");
      //this.tokenService.clear();
      // this.authService.signOut();
      /* localStorage.removeItem('user');
      localStorage.removeItem('auth_app_token');
      this.router.navigate(['/auth/login']) */
      return true;
    } else {
      return false;
    }
  }

  async addUserCookie(data, user, path = "add") {
    let url = this.cookieURL + path;
    return this.http
      .post(url, data, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async addUserCookieNormal(data, user, path = "addNormal") {
    let url = this.cookieURL + path;
    return this.http
      .post(url, data, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async userCookieGet(path, user) {
    let url = this.cookieURL + path;
    return this.http
      .get(url, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async getWithUser(path, user) {
    let url = environment.base_api_url + path;
    return this.http
      .get(url, { headers: { app_token: user.app_token } })
      .toPromise();
  }

  async postWithUser(path, data, user) {
    let url = environment.base_api_url + path;
    return this.http
      .post(url, data,
        { headers: { app_token: user.app_token } })
      .toPromise()
      .catch((err) => {
        console.error('An error occurred:', err.error);
        throw err
      });
  }

  async forgotPassword(data) {
    let url = this.urlForgotPassword;
    //await delay(100);
    return this.http
      .post(url,
        {
          email: data.email,
        })
      .toPromise();
  }

  async forgotPasswordVerify(data) {
    let url = this.urlForgotPasswordVerify;
    return this.http
      .post(url,
        {
          email: data.email,
          code: data.code,
          new_password: data.new_password,
          re_new_password: data.re_new_password,
        })
      .toPromise();
  }
}
