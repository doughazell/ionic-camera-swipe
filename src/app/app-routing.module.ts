import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)

  },
  { 
    path: 'image', 
    loadChildren: './tab2/image/image.module#ImagePageModule' 
  },
  // 20/5/21 DH: Auto added by 'ionic generate page tab1/google-error' (moved to tabs.router.module.ts)
  // { path: 'google-error', loadChildren: './tab1/google-error/google-error.module#GoogleErrorPageModule' },


];
@NgModule({
  imports: [
    // 13/10/19 DH: Attempting Preloading of Tab 2
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    
    // 29/11/20 DH: Attempt to debug route error with Angular CLI 8.1.3...but didn't help much
    //RouterModule.forRoot(routes, { enableTracing: true } ),
    
    //RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
