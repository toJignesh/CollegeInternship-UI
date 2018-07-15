import { NgModule } from '@angular/core';
import {MatButtonModule, 
        MatCheckboxModule,
        MatSelectModule,
        MatTableModule, 
        MatPaginatorModule, 
        MatSortModule } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule, 
    MatCheckboxModule,
    MatSelectModule,    
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports: [
    MatButtonModule, 
    MatCheckboxModule,
    MatSelectModule,    
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  declarations: []
})
export class MaterialModule { }
