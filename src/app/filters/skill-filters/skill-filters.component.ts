import { Filters } from './../../models/filters.model';
import { CandidatesService } from './../../_services/candidates.service';
import { switchMap, merge, mergeMap, map } from 'rxjs/operators';
import { JobsService } from './../../_services/jobs.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Skill } from '../../models/skill.model';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { formGroupNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-skill-filters',
  templateUrl: './skill-filters.component.html',
  styleUrls: ['./skill-filters.component.css']
})
export class SkillFiltersComponent implements OnInit, OnDestroy {

  myForm: FormGroup;
  uniqueCities: Array<string>;
  jobSkills: Skill[];
  showForm:boolean=false;
  subCities:Subscription;

  constructor(private _jobsService:JobsService,
              private _candidatesService:CandidatesService) { 
    this.subCities = this._candidatesService.citiesSubjectBySkills
                    .pipe(
                      mergeMap(
                        citiesBySkills=>
                            this._candidatesService.citiesSubjectByDesc
                                .pipe(
                                  map(citiesByDesc=>
                                      citiesByDesc.concat(citiesBySkills)
                                                  .filter((v, i, a) => {return a.indexOf(v) === i})
                                  )
                                )
                      )
                    )
                    .subscribe(data=>{
                      this.uniqueCities=data
                      this.buildCitiesGroup();
                    });
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      'skills': new FormArray([]),
      'cities': new FormArray([])
    });
    this._jobsService.selectedJob.pipe(
      switchMap(j=>this._jobsService.getJobSkills(j))
    )
    .subscribe(ss=>{
      this.jobSkills=ss;
      this.buildSkillsGroup();
      this.showForm=true;
    });
  }

  ngOnDestroy(){
    this.subCities.unsubscribe();
  }

  buildSkillsGroup(): void {
    if(!this.jobSkills){return;}

    let skillsControl:FormControl;
    this.clearFormArray((<FormArray>(this.myForm.get('skills'))));
    this.jobSkills.map(s=>{
      skillsControl = new FormControl(false);
      (<FormArray>(this.myForm.get('skills'))).push(skillsControl);
    })
  }

  buildCitiesGroup():void{
    let formControl: FormControl;
    let citiesArray:FormArray = (<FormArray>(this.myForm.get('cities')));
    this.clearFormArray(citiesArray);
    this.uniqueCities.map(s=>{
      formControl = new FormControl(false);
      citiesArray.push(formControl);
    })
  }
  submit(){
    // console.log('form value=' , this.myForm.value);

    let selectedCities = this.uniqueCities.filter((c,i)=> this.myForm.value.cities[i])
                                          .map(c=>c.toLowerCase());

    let selectedSkills = this.jobSkills.filter((s,i)=>this.myForm.value.skills[i])
                                          .map(s=>s.id);

    this._candidatesService.filtersSubject.next({'skills': selectedSkills, 'cities': selectedCities} as Filters);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
}
