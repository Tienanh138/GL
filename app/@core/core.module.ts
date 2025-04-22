import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthSimpleToken, NbOAuth2AuthStrategy, NbOAuth2ResponseType } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { AnalyticsService, LayoutService, PlayerService, StateService } from './utils';
import { MockDataModule } from './mock/mock-data.module';
import { environment } from '../../environments/environment';
import { StoreService } from '../services/store.service';

// Social links for authentication forms
const socialLinks = [
  { url: '#', target: '_blank', icon: 'socicon-github' },
  { url: '#', target: '_blank', icon: 'socicon-facebook' },
  { url: '#', target: '_blank', icon: 'socicon-twitter' },
];

// Data services (currently empty, can be extended later)
const DATA_SERVICES = [];

// Custom role provider
export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // Provide roles based on authentication flow
    return observableOf('guest');
  }
}

// Core providers
export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({
    strategies: [
      // Password authentication strategy
      NbPasswordAuthStrategy.setup({
        name: 'mobile',
        baseEndpoint: '',
        token: {
          class: NbAuthSimpleToken,
          key: 'data.app_token',
        },
        login: {
          alwaysFail: false,
          endpoint: `${environment.base_api_url}/user/loginWeb`,
          method: 'post',
          requireValidToken: false,
          redirect: { success: '/', failure: null },
          defaultErrors: ['Số điên thoại hoặc mật khẩu của bạn không chính xác.'],
          defaultMessages: ['Đăng nhập thành công.'],
        },
        register: {
          endpoint: `${environment.base_api_url}/user/registerWeb`,
          method: 'post',
          alwaysFail: false,
          requireValidToken: false,
          redirect: { success: '/', failure: null },
          defaultErrors: ['Something went wrong, please try again.'],
          defaultMessages: ['Bạn đã đăng ký tài khoản thành công!'],
        },
        logout: {
          endpoint: `${environment.base_api_url}/user/loginWeb`,
          method: 'post',
          redirect: { success: '/', failure: null },
        },
        resetPass: {
          endpoint: `${environment.base_api_url}/user/changePassword`,
          method: 'post',
          redirect: { success: '/', failure: null },
          resetPasswordTokenKey: 'token',
          requireValidToken: false,
          defaultErrors: ['Something went wrong, please try again.'],
          defaultMessages: ['Your password has been successfully changed.'],
        },
      }),
      // OAuth2 authentication strategy (Facebook)
      NbOAuth2AuthStrategy.setup({
        name: 'facebook',
        clientId: '901999673240219',
        authorize: {
          endpoint: 'https://www.facebook.com/v3.2/dialog/oauth',
          responseType: NbOAuth2ResponseType.TOKEN,
          scope: 'basic_info',
          redirectUri: `${environment.base_api_url}/auth/callback`,
        },
      }),
    ],
    forms: {
      login: { strategy: 'mobile', socialLinks },
      register: { strategy: 'mobile', socialLinks },
      resetPass: { strategy: 'mobile' },
      logout: { strategy: 'mobile' },
    },
  }).providers,
  NbSecurityModule.forRoot({
    accessControl: {
      guest: { view: '*' },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,
  { provide: NbRoleProvider, useClass: NbSimpleRoleProvider },
  AnalyticsService,
  LayoutService,
  PlayerService,
  StateService,
  StoreService,
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };
  }
}
