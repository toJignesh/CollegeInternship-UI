import { Component, OnInit, OnDestroy } from '@angular/core';
import { Candidate } from 'src/app/models/candidate.model';
import { JobsService } from '../../_services/jobs.service';
import { CandidatesService } from '../../_services/candidates.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-candidates-by-job-skills',
  templateUrl: './candidates-by-job-skills.component.html',
  styleUrls: ['./candidates-by-job-skills.component.css']
})
export class CandidatesByJobSkillsComponent implements OnInit, OnDestroy {

  candidatesByJobSkills:Array<Candidate>=[]; // initialize to empty array
  cities:Array<string>;
  subCandidates:Subscription;
  
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
        this.candidatesByJobSkills = cnds;

        const x = this.candidatesByJobSkills.map(c=>c.city);
        this.cities = x.filter((v, i, a) => {return a.indexOf(v) === i}); 
        this.cities.push('city by skills');
        this._candidatesService.citiesSubjectBySkills.next(this.cities);        
      }
    );
  }

  ngOnDestroy(){
  }
}
