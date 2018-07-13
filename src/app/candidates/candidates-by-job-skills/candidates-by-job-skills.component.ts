import { Component, OnInit } from '@angular/core';
import { CandidatesService } from './../../_services/candidates.service';
import { JobsService } from './../../_services/jobs.service';
import { Subscription } from 'rxjs';
import { Job } from './../../models/job.model';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-candidates-by-job-skills',
  templateUrl: './candidates-by-job-skills.component.html',
  styleUrls: ['./candidates-by-job-skills.component.css']
})
export class CandidatesByJobSkillsComponent implements OnInit {

  job:Job;
  subSelectedJob: Subscription;
  candidates:Array<any>;

  /**
   *
   */
  constructor(private _jobService:JobsService,
              private _candidateService: CandidatesService) {}
  ngOnInit(){
    console.log('will now subscribe');
    this.subSelectedJob = this._jobService.selectedJob
      .pipe(
        switchMap(d=>this._candidateService.getAll(d.id))
      )
      .subscribe(d=>this.candidates = d);
  }

  ngOnDestroy(){
    this.subSelectedJob.unsubscribe();
  }
}
