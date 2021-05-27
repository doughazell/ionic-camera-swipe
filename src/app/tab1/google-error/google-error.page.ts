import { Component, OnInit } from '@angular/core';

// 20/5/21 DH:
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-google-error',
  templateUrl: './google-error.page.html',
  styleUrls: ['./google-error.page.scss'],
})
export class GoogleErrorPage implements OnInit {
  params: Params;
  error: string;
  msg: string;

  constructor(private route: ActivatedRoute) { }

  getParams = this.route.params.subscribe((params: Params) => {
    //this.error = params['error'];
    this.params = params;
  });

  ngOnInit() {
    console.log('Calling getParams: ');
    this.getParams;
    console.log(this.params);
    this.error = this.params['error'];
    this.msg = this.params['msg'];
  }

}
