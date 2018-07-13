import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  selectedJob: Subject<Job> = new Subject<Job>();

  constructor(private http: HttpClient) { }

  getAll():Observable<Job[]>{
    return this.http.get<any>('/api/jobs');
  }

  selectedJobChanged(job: Job):void{
    this.selectedJob.next(job);
  }
}
