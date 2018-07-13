import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule,MatSelectModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule, 
    MatCheckboxModule,
    MatSelectModule
  ],
  exports: [
    MatButtonModule, 
    MatCheckboxModule,
    MatSelectModule
  ],
  declarations: []
})
export class MaterialModule { }
