import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JobsComponent } from './jobs/jobs/jobs.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CandidatesByJobSkillsComponent } from './candidates/candidates-by-job-skills/candidates-by-job-skills.component';
import { CandidatesBySkillsTableComponent } from './candidates/candidates-by-skills-table/candidates-by-skills-table.component';
import { CandidatesByDescTableComponent } from './candidates/candidates-by-desc-table/candidates-by-desc-table.component';
import { SkillFiltersComponent } from './filters/skill-filters/skill-filters.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidatesByJobDescComponent } from './candidates/candidates-by-job-desc/candidates-by-job-desc.component';
import { JobsListComponent } from './jobs/jobs-list/jobs-list.component';




@NgModule({
  declarations: [
    AppComponent,
    JobsComponent,
    CandidatesByJobSkillsComponent,
    CandidatesBySkillsTableComponent,
    SkillFiltersComponent,
    CandidatesByDescTableComponent,
    CandidatesByJobDescComponent,
    JobsListComponent
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
