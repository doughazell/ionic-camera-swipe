// 3/5/22 DH: New file from 'https://www.youtube.com/watch?v=SaotQDK3Neo&t=3s'
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { SelectionComponent } from "./selection.component";

// 8/5/22 DH: Need to add this to retrieve (in SelectionComponent) the selected "Protocol" from the Modal list
import { FormsModule } from "@angular/forms";

@NgModule({ 
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [SelectionComponent],
  entryComponents: [SelectionComponent],
  exports: [SelectionComponent]
})
export class SelectionComponentModule {}
