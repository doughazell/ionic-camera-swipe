import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public index: number;
  public photos: Photo[] = [];

  constructor(private camera: Camera, private storage: Storage) { }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      // Add new photo to gallery
      //this.photos.unshift({
      this.photos.push({
        data: 'data:image/jpeg;base64,' + imageData
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
/*
*/
  loadSaved(caller): any {
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
      console.log("Loaded photos from storage");
      //caller.setFirstImage(this.photos[0].data);
    });
  }

  storePhotos() {
    this.storage.set('photos', this.photos);
  }
  
}

class Photo {
  data: any;
}

