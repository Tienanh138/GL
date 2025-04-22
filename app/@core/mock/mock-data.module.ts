import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountryOrderService } from './country-order.service';


const SERVICES = [
  CountryOrderService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class MockDataModule {
  static forRoot(): ModuleWithProviders<MockDataModule> {
    return <ModuleWithProviders<MockDataModule>>{
      ngModule: MockDataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}