import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab4bPage } from './tab4b.page';

// 13/12/20 DH:
//import { NgZoneDemo } from './ngZoneDemo.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab4bPage }])
    //RouterModule.forChild([{ path: '', component: NgZoneDemo }])
  ],
  //declarations: [Tab4bPage, NgZoneDemo]
  declarations: [Tab4bPage]
})
export class Tab4bPageModule {}
