import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(private http: HttpClient) { }

  getAll(jobId: number): Observable<Candidate[]> {
    return this.http.get<Array<any>>(`/api/candidates/for-job?jobid=${jobId}`)
      .pipe(map(data => {
        return data.map(d =>
          <Candidate>Object.assign({
            id: d.productId,
            firstName: d.firstName,
            lastName: d.lastName,
            skills: d.candidateSkills.map(s => s.skillId),
            postalCode: d.postalCode,
            rankBySkills: d.candidateSkills.length
          })
        )
      })
      );
  }
}
