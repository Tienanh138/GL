import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private refresh = new Subject<string>();
  private glDialog = new Subject<any>();
  private getPaddy = new Subject<any>();

  refreshSub$ = this.refresh.asObservable();
  glDialogSub$ = this.glDialog.asObservable();
  getPaddySub$ = this.getPaddy.asObservable();

  refreshPub(data: any) {
		this.refresh.next(data);
  }
  
  glDialogPub(data:any){
    this.glDialog.next(data);
  }

  getPaddyPub(data:any){
    this.getPaddy.next(data);
  }

}
