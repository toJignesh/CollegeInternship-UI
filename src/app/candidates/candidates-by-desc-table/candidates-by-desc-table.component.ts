import { CandidatesService } from './../../_services/candidates.service';
import { JobsService } from './../../_services/jobs.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Candidate } from '../../models/candidate.model';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Filters } from '../../models/filters.model';

@Component({
  selector: 'app-candidates-by-desc-table',
  templateUrl: './candidates-by-desc-table.component.html',
  styleUrls: ['./candidates-by-desc-table.component.css']
})
export class CandidatesByDescTableComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Candidate>;
  displayedColumns:Array<string> = ['id','firstName','city','rankBySkills', 'distance', 'description'];
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
        switchMap(job=>this._candidatesService.getAllByJobDescription(job.id))
      )
      .subscribe((cnds)=>{
        this.candidates = cnds;

        const x = this.candidates.map(c=>c.city);
        this.cities = x.filter((v, i, a) => {return a.indexOf(v) === i}); 
        this._candidatesService.citiesSubjectByDesc.next(this.cities);
        
        this.dataSource = new MatTableDataSource(this.candidates);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: Candidate, filters: string) =>{

          let predicates = <Filters>JSON.parse(filters);
          if(predicates.cities.length == 0 && predicates.skills.length == 0 && predicates.distanceIndex.toString() == "")
          {
            return true;
          }
          let skillIds: Array<number> = predicates.skills.map(s=>s.id);

          let okByCity: boolean = (predicates.cities.length > 0)?(predicates['cities'].indexOf(data.city.toLowerCase())!== -1)?true:false
                                                                :true;
          let okBySkill: boolean = (predicates.skills.length>0)?(data.skills.some(s=>skillIds.includes(s)))?true:false
                                                               :true;
          if(!okBySkill){
            let skillNames: Array<string>=predicates.skills.map(s=>s.name);
            okBySkill = skillNames.some(s=> data.description.toLowerCase().indexOf(s.toLowerCase()) > -1);
          }                                                                

          let okByDistance: boolean = false;
          if(predicates.distanceIndex.toString() == ""){
            okByDistance = true;
          }
          else{
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