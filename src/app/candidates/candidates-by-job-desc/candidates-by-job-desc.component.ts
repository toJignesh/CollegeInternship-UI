import { JobsService } from './../../_services/jobs.service';
import { Component, OnInit } from '@angular/core';
import { Candidate } from '../../models/candidate.model';
import { Subscription } from 'rxjs';
import { CandidatesService } from '../../_services/candidates.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-candidates-by-job-desc',
  templateUrl: './candidates-by-job-desc.component.html',
  styleUrls: ['./candidates-by-job-desc.component.css']
})
export class CandidatesByJobDescComponent implements OnInit {

  candidatesByJobDesc:Array<Candidate>=[];
  subCandidates:Subscription;
  cities:Array<string>;

  constructor(private _jobsService: JobsService,
    private _candidatesService: CandidatesService) { }

  /**
   *
   */
  ngOnInit(){
    this.subCandidates = this._jobsService.selectedJob
      .pipe(
        switchMap(job=>this._candidatesService.getAll(job.id))
      )
      .subscribe((cnds)=>{
        this.candidatesByJobDesc = cnds;

        const x = this.candidatesByJobDesc.map(c=>c.city);
        this.cities = x.filter((v, i, a) => {return a.indexOf(v) === i}); 
        this.cities.push('city by desc');
        this._candidatesService.citiesSubjectByDesc.next(this.cities);
      }
    );
  }

}
