import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JobsComponent } from './jobs/jobs/jobs.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CandidatesByJobSkillsComponent } from './candidates/candidates-by-job-skills/candidates-by-job-skills.component';


@NgModule({
  declarations: [
    AppComponent,
    JobsComponent,
    CandidatesByJobSkillsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
