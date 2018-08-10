import { Component, OnInit, OnDestroy } from '@angular/core';
import { Job } from '../../models/job.model';
import { JobsService } from '../../_services/jobs.service';
import { Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css']
})
export class JobsListComponent implements OnInit, OnDestroy {
  jobs: Array<Job>;
  constructor(private _jobsService:JobsService) {
    
  }
  jobsSub: Subscription;
  
  ngOnInit(){
    this.refreshJobsList();
  }
  
  deleteJob(job: Job): void{
    console.log('job to be deleted', job);
    this._jobsService.delete(job).subscribe(d=>{
      if(d === ''){
        this.refreshJobsList();
      }
    })
  }
  
  refreshJobsList(): void{
    this.jobsSub = this._jobsService.getAll()
    .pipe(
      tap(d=>console.log(d)),
      map(d=>d as Job[])
    )
    .subscribe(
      (data)=>{ 
        this.jobs = data as Job[];
      }
  
    );
    
  }
  ngOnDestroy(){
    if(this.jobsSub){
      this.jobsSub.unsubscribe();
    }
  }
}
