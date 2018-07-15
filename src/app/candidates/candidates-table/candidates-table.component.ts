import { CandidatesService } from './../../_services/candidates.service';
import { JobsService } from './../../_services/jobs.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Candidate } from '../../models/candidate.model';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Filters } from '../../models/filters.model';

@Component({
  selector: 'app-candidates-table',
  templateUrl: './candidates-table.component.html',
  styleUrls: ['./candidates-table.component.css']
})
export class CandidatesTableComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Candidate>;
  displayedColumns:Array<string> = ['id','firstName','city','rankBySkills'];
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
        this._candidatesService.citiesSubject.next(this.cities);

        this.dataSource = new MatTableDataSource(this.candidates);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: Candidate, filters: string) =>{
          let predicates = <Filters>JSON.parse(filters);
          if(predicates.cities.length == 0 && predicates.skills.length == 0)
          {
            return true;
          }

          let okByCity: boolean = (predicates.cities.length > 0)?(predicates['cities'].indexOf(data.city.toLowerCase())!== -1)?true:false
                                                                :true;
          let okBySkill: boolean = (predicates.skills.length>0)?(data.skills.some(s=>predicates.skills.includes(s)))?true:false
                                                               :true;

          // if(predicates.cities.length > 0){

          //   if(predicates['cities'].indexOf(data.city.toLowerCase())!== -1){
          //     okByCity = true;
          //   }
          // }
          // else{
          //   okByCity = true;
          // }

          // if(predicates.skills.length>0){

          //   okBySkill = data.skills.some(s=>predicates.skills.includes(s));
          // }
          // else{
          //   okBySkill=true;
          // }
          
          return okBySkill && okByCity;
          //if(predicates['skills'])
        };

        // let fs = <Filters>Object.assign({'cities':['toronto', 'brantford'], 'skills':[]})
        // this.dataSource.filter= JSON.stringify(fs);
      });
  }



  ngOnDestroy(){
    this.subCandidates.unsubscribe();
    this.subFilters.unsubscribe();
  }
}
