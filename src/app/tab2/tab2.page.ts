import { Component, EventEmitter, Output } from '@angular/core';
import { PhotoService } from '../services/photo.service';

import { ToastController } from '@ionic/angular';

// 16/10/19 DH:
// v3: import { Events } from 'ionic-angular';
// v4:
import { Events } from '@ionic/angular';

// 19/10/19 DH:
import { Router } from '@angular/router';

// 20/10/19 DH:
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

// 8/4/22 DH:
import { LogService } from '../services/log.service';

// 14/4/22 DH:
import { SpeechService } from '../services/speech.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  currentImage: any;
  // 19/10/19 DH: Dynamically increasing size of image when clicked
  colNum = "6";
  static SPEECH_CODE: number = 69;

  constructor(public photoService: PhotoService, public toastController: ToastController, 
              public events: Events, private router: Router, private photoViewer: PhotoViewer,
              public logService: LogService, private speechService: SpeechService) {  }
  
/*
*/
  ngOnInit() {
  
    this.presentToast();

    // 16/10/19 DH:
    this.events.publish('tab2:created', Date.now());
  }
  /*
  ionSelected() {
    console.log("ionSelect(): Camera Tab has been selected");
    // do your stuff here
  }
  */
  colChanged($event){
    console.log("Col changed");
  }

  // functionName() : ReturnType { ... }
  setFirstImage(imageData): any {
    console.log("Setting Tab2Page.currentImage...");
    this.currentImage = imageData;
  }

  ngAfterViewChecked() {
    console.log("Angular finished with DOM");
  }

  async presentToast() {
    const toast = await this.toastController.create({
      position: 'middle',
      message: 'Loaded images previously with PhotoService',
      duration: 2000
    });
    toast.present();
  }

  takePicture() {
    this.photoService.takePicture();

    // 21/10/19 DH: Refresh page so that delete swipes work with new order
    //this.router.navigate(['/tabs/tab2']);

  }
  
  deleteItem(index: number){
    console.log("Delete Item (", index, "): ");
    this.photoService.photos.splice(index,1);
    this.photoService.storePhotos();
    
    // 21/10/19 DH: Refresh page so that delete swipes work with new order

  }

  expandItem(index: number, event) {
    console.log("Item ", index, " clicked for expansion");

    this.photoService.logService.log("Item: " + index + " id: " + event.target.id);
    let imgClicked = document.getElementById(event.target.id);
    this.photoService.getImgOrientation(imgClicked);

    //this.router.navigate(['/image', index]);

    //this.photoService.index = index;
    //this.router.navigate(['/image']);
    
    console.log("PhotoViewerDH: calling show()");
    //this.photoViewer.show(this.photoService.photos[index].data, 'Nice work, good job', {share: true} );

    /* */
    try {    
      this.photoViewer.show(this.photoService.photos[index].data, 'Nice work, good job', {share: true} ).then(
        (result) => {
          console.log("PhotoViewerDH: show() ok: " + result);
          this.logService.log("Tab2Page: PhotoViewer returned");
          if (result == Tab2Page.SPEECH_CODE) {
            this.speechService.recordSpeech();
          }
        },
        (err) => {
          // Handle error
          console.log("PhotoViewerDH: errorCallback: " + err);
        }
      ).catch((reason) => {
        console.log("PhotoViewerDH: " + reason);
      }).finally(() => {
        console.log("PhotoViewerDH: show() Promise final answer");
      });
    } catch (error) {
      console.log("PhotoViewerDH: show() did not return a Promise...bitch..." + error);
    }

    console.log("PhotoViewerDH: returned from show()");
    this.photoService.getImgData(imgClicked);
  }

  /*
  tab2ConsoleMsg() {
    console.log("Tab2 console msg");
  }
  */

/*
  ionRefresh(event) {
      console.log('Pull Event Triggered!');
      setTimeout(() => {
        console.log('Async operation has ended');
 
        //complete()  signify that the refreshing has completed and to close the refresher
        event.target.complete();
      }, 2000);
  }
  ionPull(event){
    //Emitted while the user is pulling down the content and exposing the refresher.
    console.log('ionPull Event Triggered!');
  }
  ionStart(event){
    //Emitted when the user begins to start pulling down.
    console.log('ionStart Event Triggered!');
  }  
  */
}

