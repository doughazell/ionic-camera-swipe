import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// 3/10/19 DH: Addition from 'your-first-app'
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage';

// 20/10/19 DH:
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

// 30/1/22 DH: Attempting to add speech recognition (prior to Reinforcement Learning from cmd)
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    PhotoViewer,

    // 31/1/22
    SpeechRecognition,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    // {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
