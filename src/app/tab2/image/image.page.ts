import { Component, OnInit } from '@angular/core';

// 19/10/19 DH:
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../../services/photo.service';

// 20/10/19 DH:
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  //index: any;

  constructor(private route: ActivatedRoute, public photoService: PhotoService, 
              private photoViewer: PhotoViewer) { 
  
  }
/*
  sub = this.route.params.subscribe(params => {
    this.index = params['index'];
  });
*/

  ngOnInit() {
    console.log("ImagePage index: ", this.photoService.index);
    //this.sub;

    // 20/10/19 DH:
    //this.photoViewer.show('https://mysite.com/path/to/image.jpg');
    //<img [src]="photoService.photos[photoService.index].data" />

    this.photoViewer.show(this.photoService.photos[this.photoService.index].data);
    //this.photoViewer.show('https://www.freakyjolly.com/wp-content/uploads/2017/08/cropped-fjlogo2.png');
  }

}
