import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 29/11/20 DH:
import { RouterModule } from '@angular/router';

import { Tab4GooglePageRoutingModule } from './tab4google.router.module';
import { Tab4GooglePage } from './tab4google.page';

import { ErrorHandler } from '@angular/core';

// @NgModule decorator with its metadata
//"The decorator pattern provides a flexible alternative to inheritance for extending objects functionality."
//   https://dzone.com/articles/is-inheritance-dead
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,

    // 1/12/20 DH: This line is needed in a Child (but not for a Root in 'tabs/tabs.module')
    RouterModule.forChild([{ path: '', component: Tab4GooglePage }]),

    // 1/12/20 DH: Copying 'TabsPageRoutingModule' in 'TabsPageModule' (loaded by 'AppRoutingModule')
    Tab4GooglePageRoutingModule
  ],
  declarations: [Tab4GooglePage],
  
  // 6/12/20 DH: Nope...didn't work...ffs...!!!
  providers: [{provide: ErrorHandler, useClass: Tab4GooglePage}]
})
export class Tab4GooglePageModule {}
