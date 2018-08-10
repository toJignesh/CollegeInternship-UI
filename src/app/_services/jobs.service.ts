import { Job } from './../models/job.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Skill } from '../models/skill.model';

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

  getJobSkills(job: Job):Observable<Skill[]>{
    return this.http.get<any>(`/api/jobs/${job.id}/skills`)
    .pipe(
      map(ss=>{
        return ss.map(s=>
          <Skill>Object.assign({
          id: s.id,
          name: s.name
        }))
      })
    )
  }

  delete(job: Job): Observable<any>{
    return this.http.delete('/api/jobs/' + job.id);
  }
}
