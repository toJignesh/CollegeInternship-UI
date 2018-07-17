import { Candidate } from './../../models/candidate.model';
import { CandidatesService } from './../../_services/candidates.service';
import { JobsService } from './../../_services/jobs.service';
import { Component, OnInit, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


import { Subscription, Observable } from 'rxjs';
import { Filters } from '../../models/filters.model';

@Component({
  selector: 'app-candidates-table',
  templateUrl: './candidates-table.component.html',
  styleUrls: ['./candidates-table.component.css']
})
export class CandidatesTableComponent implements OnInit, OnDestroy, OnChanges {
  dataSource: MatTableDataSource<Candidate>;
  displayedColumns:Array<string> = ['id','firstName','city','rankBySkills', 'distance'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  @Input() candidates: Array<Candidate>;

  filters: Filters;

  subCandidates:Subscription;
  subFilters:Subscription;

  remove(changes: SimpleChanges){
    console.log('simple chagnes', changes);
  }
  ngOnInit(){

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

      return okBySkill && okByCity;
    };
  }

  constructor(private _candidatesService: CandidatesService) { }

ngOnChanges(changes: SimpleChanges){
  const newList:Array<Candidate> = changes.candidates.currentValue;
  if(newList.length === 0){return;}
    
    this.subFilters = this._candidatesService.filtersSubject
                        .subscribe(f=>this.dataSource.filter=JSON.stringify(f));

    this.dataSource = new MatTableDataSource(newList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

      
  }



  ngOnDestroy(){
    this.subCandidates.unsubscribe();
    this.subFilters.unsubscribe();
  }
}
