import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Candidate } from '../models/candidate.model';
import { Filters } from '../models/filters.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {
  testSubject:Subject<Candidate[]> = new Subject<Candidate[]>();

  citiesSubjectBySkills:Subject<Array<string>>=new Subject<Array<string>>();
  citiesSubjectByDesc:Subject<Array<string>>=new Subject<Array<string>>();

  filtersSubject: Subject<Filters> = new Subject<Filters>();

  constructor(private http: HttpClient) { }

  getAll(jobId: number): Observable<Candidate[]> {
    return this.http.get<Array<any>>(`/api/candidates/for-job?jobid=${jobId}`)
      .pipe(map(data => {
        return data.map(d =>
          <Candidate>Object.assign({
            id: d.id,
            firstName: d.firstName,
            lastName: d.lastName,
            skills: d.candidateSkills.map(s => s.skillId),
            city: d.city,
            postalCode: d.postalCode,
            rankBySkills: d.candidateSkills.length,
            distance: d.distanceFromJob,
            description: d.description
          })
        )
      })
      );
  }

  getAllByJobDescription(jobId: number): Observable<Candidate[]> {
    return this.http.get<Array<any>>(`/api/candidates/for-job-desc?jobid=${jobId}`)
      .pipe(map(data => {
        return data.map(d =>
          <Candidate>Object.assign({
            id: d.id,
            firstName: d.firstName,
            lastName: d.lastName,
            skills: d.candidateSkills.map(s => s.skillId),
            city: d.city,
            postalCode: d.postalCode,
            rankBySkills: d.candidateSkills.length,
            distance: d.distanceFromJob,
            description: d.description
          })
        )
      })
      );
  }
  
}
