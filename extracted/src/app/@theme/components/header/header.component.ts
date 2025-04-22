import { Component, Input, OnInit } from "@angular/core";

import { NbMenuService, NbSidebarService } from "@nebular/theme";
import { AnalyticsService, StateService } from "../../../@core/utils";
import { LayoutService } from "../../../@core/utils";
import { NbAuthService } from "@nebular/auth";
import { UserService } from "../../../services/user.service";
import { StoreService } from "../../../services/store.service";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  @Input() position = "normal";

  getPaddySub: any;
  tokenFbSub: any;
  user: any;
  userMenu = [
    { title: "Thông tin cá nhân", link: "/pages/user/info" },
    { title: "Đăng xuất", link: "/auth/logout" },
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private analyticsService: AnalyticsService,
    private layoutService: LayoutService,
    private authService: NbAuthService,
    private userService: UserService,
    private stateService: StateService,
    private router: Router
  ) {
    this.tokenFbSub = this.authService.getToken().subscribe((token) => {
      if (token.isValid()) {
        let userString = localStorage.getItem("user");
        //console.log('userString:', userString);
        if (userString) {
          this.user = JSON.parse(userString);
        }
        this.setLocalstoreAuth(token.getValue());
      }
    });

    this.stateService.onUser().subscribe((data) => {
      if (data && data.current_paddy >= 0)
        this.user.current_paddy = data.current_paddy;
    });

    this.stateService.onLogout().subscribe((data) => {
      this.logout();
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    // this.getPaddySub.unsubscribe();
    this.tokenFbSub.unsubscribe();
  }

  async setLocalstoreAuth(token) {
    //fake localStoreage
    let res: any = await this.userService.getUserInfo({ app_token: token });
    //console.log('setLocalstoreAuth', res);
    if (res.code == 1) {
      const fb_id = res.data.real_fb_id ? res.data.real_fb_id : res.data.facebook_id;
      //console.log(res.data);
      let obj = {
        facebook_id: res.data.facebook_id,
        picture: "http://graph.facebook.com/" + fb_id + "/picture?type=square",
        username: res.data.username,
        total_paddy: res.data.total_paddy,
        current_paddy: res.data.current_paddy,
        ref_code: res.data.ref_code,
        app_token: token,
        like: res.data.like,
        share: res.data.share,
        comment: res.data.comment,
        review: res.data.review,
        isVerified: res.data.isVerified,
        email: res.data.email,
        real_fb_id: res.data.real_fb_id,
        allow_cookie: res.data.allow_cookie
      };
      this.user = obj;
      localStorage.setItem('user', JSON.stringify(obj));
    } else if (res.code == 3) {
      this.logout();
    }
  }

  logout() {
    this.router.navigate(["/auth/logout"]);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent("startSearch");
  }
}
