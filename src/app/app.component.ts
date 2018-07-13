import { Component, OnInit, OnDestroy } from '@angular/core';
import { CandidatesService } from './_services/candidates.service';
import { JobsService } from './_services/jobs.service';
import { Subscription } from 'rxjs';
import { Job } from './models/job.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'app';

  ngOnInit(){}
  ngOnDestroy(){}
}
