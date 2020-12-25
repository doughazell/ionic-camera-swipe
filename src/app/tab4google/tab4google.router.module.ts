import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, ɵEmptyOutletComponent } from '@angular/router';

import { Tab4GooglePage } from './tab4google.page';
// 6/12/20 DH:
import { EmptyOutletComponent } from './empty_outlet.component';

const routes: Routes = [
  {
    path: '',
    // 1/12/20 DH: Notice nested 'tab4google' path:
    redirectTo: '/tabs/tab4google/tab4google/tab4',
    pathMatch: 'full'
  },

  {
    path: 'tab4google',
    component: Tab4GooglePage,
    children: [

      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: () => 
              import('../tab4/tab4.module').then(m => m.Tab4PageModule)
            //loadChildren: '../tab4/tab4.module#Tab4PageModule' 
          }
        ]
      },

      {
        path: 'tab4b',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab4b/tab4b.module').then(m => m.Tab4bPageModule)
          }
        ]
      },

      {
        path: '**',
        component: EmptyOutletComponent,
      }

    ]
  },

];

@NgModule({
  // 6/12/20 DH:
  declarations: [EmptyOutletComponent],

  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],

  // 6/12/20 DH: 
  bootstrap: [EmptyOutletComponent]
})
export class Tab4GooglePageRoutingModule {}
