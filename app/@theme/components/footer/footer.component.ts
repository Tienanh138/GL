import { Component, OnInit } from '@angular/core';
import { DynamicScriptLoaderService } from '../../../shares/services/dynamic-script-loader.service';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService) {}

  ngOnInit() {
    this.loadScripts();
  }

  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dynamicScriptLoader.load('chat_fb').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }
}
