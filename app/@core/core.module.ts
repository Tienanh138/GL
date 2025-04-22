import { ModuleWithProviders, NgModule, Optional, SkipSelf, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthSimpleToken, NbOAuth2AuthStrategy, NbOAuth2ResponseType } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  AnalyticsService,
  LayoutService,
  PlayerService,
  StateService,
} from './utils';

import { MockDataModule } from './mock/mock-data.module';
import { environment } from '../../environments/environment';
import { StoreService } from '../services/store.service';


const socialLinks = [
  {
    url: '#',
    target: '_blank',
    icon: 'socicon-github',
  },
  {
    url: '#',
    target: '_blank',
    icon: 'socicon-facebook',
  },
  {
    url: '#',
    target: '_blank',
    icon: 'socicon-twitter',
  },
];

const DATA_SERVICES = [

];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}


export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DATA_SERVICES,
  ...NbAuthModule.forRoot({

    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'mobile',
        baseEndpoint: '',
        token: {
          class: NbAuthSimpleToken,
          key: "data.app_token"
        },
        login: {
          alwaysFail: false,
          endpoint: environment.base_api_url +'/user/loginWeb',
          method: 'post',
          requireValidToken: false,
          redirect: {
            success: '/',
            failure: null,
          },
          defaultErrors: ['Số điên thoại hoặc mật khẩu của bạn không chính xác.'],
          defaultMessages: ['Đăng nhập thành công.'],
        },
        register: {
          endpoint: environment.base_api_url + '/user/registerWeb',
          method: 'post',
          alwaysFail: false,
          requireValidToken: false,
          redirect: {
            success: '/',
            failure: null,
          },
         defaultErrors: ['Something went wrong, please try again.'],
         defaultMessages: ['Bạn đã đăng ký tài khoản thành công!'],
        },
        logout: {
          endpoint: environment.base_api_url + "/user/loginWeb",
          method: "post",
          redirect: {
            success: '/',
            failure: null,
          },
        },
        resetPass: {
          endpoint: environment.base_api_url + '/user/changePassword',
          method: 'post',
          redirect: {
            success: '/',
            failure: null,
          },
          resetPasswordTokenKey: "token",
          requireValidToken: false,
          defaultErrors: ['Something went wrong, please try again.'],
          defaultMessages: ['Your password has been successfully changed.'],
        }

      }),
      NbOAuth2AuthStrategy.setup({
        name: 'facebook',
        clientId: '901999673240219',
        authorize: {
          endpoint: 'https://www.facebook.com/v3.2/dialog/oauth',
          responseType: NbOAuth2ResponseType.TOKEN,
          scope: 'basic_info',
          redirectUri: environment.base_api_url + '/auth/callback',
        },
      }),
    ],
    forms: {
      login: {
        strategy: 'mobile',
        socialLinks: socialLinks,
      },
      register: {
        strategy: 'mobile',
        socialLinks: socialLinks,
      },
      resetPass: {
        strategy: 'mobile',
      },
      logout:{
        strategy: 'mobile',
      }
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  LayoutService,
  PlayerService,
  StateService,
  StoreService
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
