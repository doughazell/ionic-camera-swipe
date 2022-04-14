import { Injectable, Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

// 25/9/21 DH: Attempt to fully convert to Capacitor in order to prevent the need to alter generated Java files
//import { Camera } from '@capacitor/camera';
//import { Filesystem, Directory } from '@capacitor/filesystem';
//import { Storage } from '@capacitor/storage';

// 1/10/21 DH: Displaying portrait images correctly in tab2 + PhotoViewer
import { LogService } from './log.service';

//import { EXIF } from 'exif-js';
const { EXIF } = require('exif-js');

@Injectable({
  providedIn: 'root'
})

// 2/10/21 DH: Attempting to solve the invalid image arg to EXIF.getData() to execute callback
/*
@Component({
  selector: 'photo-service',
  template: `
    <script>
      var image = document.createElement("img");

      image.addEventListener("load", function(){
        EXIF.getData(image, function() {
          orientation = (EXIF.getTag(this, "Orientation") || 1);
          <!-- photoService.logService.log("Orientation of image 1: " + orientation); -->
        });
      });
    </script>
  `,
})
*/

export class PhotoService {
  public index: number;
  public photos: Photo[] = [];

  constructor(private camera: Camera, private storage: Storage, public logService: LogService) { }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      // 30/9/21 DH: Camera.DestinationType.DATA_URL = base64-encoded image
      //             Camera.DestinationType.FILE_URI = image's file location
      destinationType: this.camera.DestinationType.DATA_URL,
      //destinationType: this.camera.DestinationType.FILE_URI,

      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // 28/3/22 DH: Get portrait images displayed as portrait in '<ion-item ...> <img.../> </ion-item>'
      //             (this was not necessary with Cordova build, due to boiler-plate Java files)
      correctOrientation: true
    }
    
    // 7/4/22 DH: [JAVASCRIPT] 'node_modules/cordova-plugin-camera/www/Camera.js' :
    //   cameraExport.getPicture = function (successCallback, errorCallback, options) { 
    //     exec(successCallback, errorCallback, 'Camera', 'takePicture', args); }
    //
    // [JAVA]
    // https://github.com/apache/cordova-android/blob/master/framework/src/org/apache/cordova/CordovaPlugin.java
    //   "This method is called from the WebView thread."
    //   "To run on the UI thread, use: cordova.getActivity().runOnUiThread(runnable);"
    //
    // 'android/capacitor-cordova-android-plugins/src/main/java/org/apache/cordova/camera/CameraLauncher.java' :
    //   class CameraLauncher extends CordovaPlugin ... {
    //     execute(String action, JSONArray args, CallbackContext callbackContext) { ... }
    //   }    
    
    this.camera.getPicture(options).then((imageData) => {
      this.logService.log("PhotoService got picture (now need to EXIF...)");

      // Add new photo to gallery
      //this.photos.unshift({
      this.photos.push({
        data: 'data:image/jpeg;base64,' + imageData
        //data: imageData
      });

      // Save all photos for later viewing
      //this.storage.set('photos', this.photos);

      // 18/10/19 DH: Need to store photos after deleting so created 'storePhotos()'
      this.storePhotos();
    }, (err) => {
     // Handle error
     console.log("Camera issue: " + err);
    });

  }

  getImgOrientation(img) {
    let orientation = 'blank';
    let photoService = this;

    let getDataResult = EXIF.getData(img, function() {
      orientation = (EXIF.getTag(this, "Orientation") || 1);
      console.log("Orientation of image 1: " + orientation);
      photoService.logService.log("Callback orientation of image: " + orientation);

      orientation = (EXIF.getTag(this) || 1);
      photoService.logService.log("Callback tag of image: " + orientation);
    });

    //var image = document.createElement("img");

/*
    //image.src = 'https://cutecatpictures.com/cutecat.jpg';
    let img1 = <HTMLImageElement>document.getElementById("imgXXX");
    this.logService.log("PhotoService gotElementById");
    //img1.src = 'data:image/jpeg;base64,' + imageData;
    //this.logService.log("PhotoService set src of img1");
*/

/*
    let img1 = document.getElementById("imgBalavil");

    EXIF.getData(img1, function() {
      orientation = (EXIF.getTag(this) || 1);

      photoService.logService.log("Orientation of image 1: " + orientation);
    });
*/
/*
    // 1/10/21 DH: Angular 8 component is returning true with a JS function incl callback
    //             ...even when the callback isn't called, indicating an invalid image arg...!!!
    this.logService.log("EXIF.getData() returned: " + getDataResult);
    if(getDataResult === true) {
      this.logService.log("Orientation of image 2: " + orientation);
    } else {
      this.logService.log("imageData passed to EXIF.getData() was not a valid image");
    }
*/

  }

  getImgData(img) {
    let exifData = 'blank';
    let photoService = this;

    let img1 = document.getElementById("imgBalavil");

    EXIF.getData(img1, function() {
      //exifData = EXIF.getTag(this, "ColorSpace");
      //photoService.logService.log("ColorSpace of image 1: " + exifData);

      exifData = EXIF.getAllTags(this);
      photoService.logService.log("All data for image 1: " + exifData);
    });
    photoService.logService.log("EXIF.getData() returned for image 1");

  }
/*
*/
  loadSaved(caller): any {
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
      console.log("Loaded photos from storage");
      //caller.setFirstImage(this.photos[0].data);
/*
      // 1/10/21 DH: Getting EXIF to work
      let orientation = 'blank';
      let photoService = this;
      let img1 = document.getElementById("imgBalavil");

      EXIF.getData(img1, function() {
        orientation = (EXIF.getTag(this, "Orientation") || 1);

        console.log("Orientation of image 1: " + orientation);
        photoService.logService.log("Orientation of image 1: " + orientation);
      });

      this.logService.log("Orientation of image 2: " + orientation);
*/
    });
  }

  storePhotos() {
    this.storage.set('photos', this.photos);
  }
  
}

class Photo {
  data: any;
}

