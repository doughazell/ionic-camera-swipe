import { Component } from '@angular/core';

// 17/10/19 DH:
import { LogService } from '../services/log.service'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  items = [
    'Nice work, good job!',
    'Hey, sweeet.'
  ];

  constructor(public logService: LogService) {
    this.logService.setTab3Page(this);
  }

  ngOnInit() {
    console.log("Yup we're off the ground...again");

    this.logService.log("Tab3Page init'd.");
  }

  itemSelected(item: string, index: number) {
    console.log("Selected Item (", index, "): ", item);
    this.items.splice(index,1);
  }

  deleteItem(item: string, index: number){
    console.log("Delete Item (", index, "): ", item);
    this.items.splice(index,1);
  }

  displayMsg(item: string) {
    //this.items.push(item);
    this.items.unshift(item);
  }

}
