import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JobsComponent } from './jobs/jobs/jobs.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CandidatesByJobSkillsComponent } from './candidates/candidates-by-job-skills/candidates-by-job-skills.component';
import { CandidatesTableComponent } from './candidates/candidates-table/candidates-table.component';
import { SkillFiltersComponent } from './filters/skill-filters/skill-filters.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidatesByJobDescComponent } from './candidates/candidates-by-job-desc/candidates-by-job-desc.component';




@NgModule({
  declarations: [
    AppComponent,
    JobsComponent,
    CandidatesByJobSkillsComponent,
    CandidatesTableComponent,
    SkillFiltersComponent,
    CandidatesByJobDescComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
