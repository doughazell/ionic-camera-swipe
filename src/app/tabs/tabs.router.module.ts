import { NgModule } from '@angular/core';
// 13/10/19 DH: Attempting to speed up image display
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  },
  
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          }
        ]
      },
      // 10/11/20 DH: Adding in access to Google sheets
      // ---------------------------------------------------------------------
      // 28/11/20 DH: Cascading tabs in Angular for Google sheets

      {
        path: 'tab4google',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab4google/tab4google.module').then(m => m.Tab4GooglePageModule)
          }
        ]
      },
 
    ]
  },
 
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
