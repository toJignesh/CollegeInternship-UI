import { CandidatesService } from './../../_services/candidates.service';
import { JobsService } from './../../_services/jobs.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Candidate } from '../../models/candidate.model';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Filters } from '../../models/filters.model';

@Component({
  selector: 'app-candidates-by-skills-table',
  templateUrl: './candidates-by-skills-table.component.html',
  styleUrls: ['./candidates-by-skills-table.component.css']
})
export class CandidatesBySkillsTableComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Candidate>;
  displayedColumns:Array<string> = ['id','firstName','city','rankBySkills', 'distance'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  candidates: Array<Candidate>;
  cities: Array<string>;
  filters: Filters;

  subCandidates:Subscription;
  subFilters:Subscription;

  constructor(private _jobsService: JobsService,
              private _candidatesService: CandidatesService) { }

  ngOnInit() {

    this.subFilters = this._candidatesService.filtersSubject
                        .subscribe(f=>this.dataSource.filter=JSON.stringify(f));

    this.subCandidates = this._jobsService.selectedJob
      .pipe(
        switchMap(job=>this._candidatesService.getAll(job.id))
      )
      .subscribe((cnds)=>{
        this.candidates = cnds;

        const x = this.candidates.map(c=>c.city);
        this.cities = x.filter((v, i, a) => {return a.indexOf(v) === i}); 
        this._candidatesService.citiesSubjectBySkills.next(this.cities);
        this._candidatesService.citiesSubjectByDesc.next([]);
        
        this.dataSource = new MatTableDataSource(this.candidates);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: Candidate, filters: string) =>{
          let predicates = <Filters>JSON.parse(filters);
          if(predicates.cities.length == 0 && predicates.skills.length == 0 && predicates.distanceIndex == -1)
          {
            return true;
          }

          let okByCity: boolean = (predicates.cities.length > 0)?(predicates['cities'].indexOf(data.city.toLowerCase())!== -1)?true:false
                                                                :true;
          let okBySkill: boolean = (predicates.skills.length>0)?(data.skills.some(s=>predicates.skills.includes(s)))?true:false
                                                               :true;

          let okByDistance: boolean = false;
          if(predicates.distanceIndex == -1){
            okByDistance = true;
          }
          else{
            console.log('distance=',data.distance);
            switch(+predicates.distanceIndex){
              case 0:
                if(data.distance <= 10)
                  {okByDistance = true;}
                break;
              case 1:
                if(data.distance > 10 && data.distance <= 25)
                  {okByDistance = true;}                 
                break;
              case 2:
                if(data.distance > 25 && data.distance <= 50)
                  {okByDistance = true;}
                break;
              case 3:
                if(data.distance > 50 && data.distance <= 100)
                  {okByDistance = true;}
                break;                
              case 4:
                if(data.distance > 100)
                  {okByDistance = true;}
                break;
            }
          }
          
          return okBySkill && okByCity && okByDistance;
        };
      });
  }



  ngOnDestroy(){
    this.subCandidates.unsubscribe();
    this.subFilters.unsubscribe();
  }
}