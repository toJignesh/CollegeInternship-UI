import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobsService } from '../../_services/jobs.service';
import { Subscription } from 'rxjs';
import { Job } from '../../models/job.model';

import {tap, map} from 'rxjs/operators';
import { MatOption } from '@angular/material';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit,OnDestroy {
  jobs: Job[];
  
  constructor(private _jobsService:JobsService) {
    
  }
  jobsSub: Subscription;
  
  ngOnInit(){
    this.jobsSub = this._jobsService.getAll()
    .pipe(
      tap(d=>console.log(d)),
      map(d=>d as Job[])
    )
    .subscribe(
      (data)=>{ 
        this.jobs = data as Job[];
        console.log('is this converted?',this.jobs);
      }

    );
  }

  onSearch(selected: MatOption){
    console.log(selected);
    this._jobsService.selectedJobChanged(selected.value);
  }

  ngOnDestroy(){
    this.jobsSub.unsubscribe();
  }

  onSelectChange(a:any){
    console.log('selection changed',a);
  }
}
