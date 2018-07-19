import { Filters } from './../../models/filters.model';
import { CandidatesService } from './../../_services/candidates.service';
import { switchMap, mergeMap, map } from 'rxjs/operators';
import { JobsService } from './../../_services/jobs.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Skill } from '../../models/skill.model';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
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
  showForm: boolean = false;
  distances: Array<string> = ['< 10 km', '10 - 25 km', '25 - 50 km', '50 - 100 km', '> 100 km'];
  subCities: Subscription;

  constructor(private _jobsService: JobsService,
    private _candidatesService: CandidatesService) {
    this.subCities = this._candidatesService.citiesSubjectBySkills
      .pipe(
        mergeMap(
          citiesBySkills =>
            this._candidatesService.citiesSubjectByDesc
              .pipe(
                map(citiesByDesc =>
                  citiesByDesc.concat(citiesBySkills)
                    .filter((v, i, a) => { return a.indexOf(v) === i })
                )
              )
        )
      )
      .subscribe(data => {
        this.uniqueCities = data
        this.buildCitiesGroup();
      });
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      'skills': new FormArray([]),
      'cities': new FormArray([]),
      'distance': new FormGroup({
        'distanceRadio': new FormControl()
      })
    });
    this._jobsService.selectedJob.pipe(
      switchMap(j => this._jobsService.getJobSkills(j))
    )
      .subscribe(ss => {
        this.jobSkills = ss;
        this.buildSkillsGroup();
        this.showForm = true;
      });

    
  }

  ngOnDestroy() {
    this.subCities.unsubscribe();
  }

  buildSkillsGroup(): void {
    if (!this.jobSkills) { return; }

    let skillsControl: FormControl;
    this.clearFormArray((<FormArray>(this.myForm.get('skills'))));
    this.jobSkills.map(s => {
      skillsControl = new FormControl(false);
      (<FormArray>(this.myForm.get('skills'))).push(skillsControl);
    })

    // rebuilding skills group, means we reset the distance group as well
    this.myForm.patchValue({
      'distance':{
        'distanceRadio': ''
      }
    });
  }

  buildCitiesGroup(): void {
    let formControl: FormControl;
    let citiesArray: FormArray = (<FormArray>(this.myForm.get('cities')));
    this.clearFormArray(citiesArray);
    this.uniqueCities.map(s => {
      formControl = new FormControl(false);
      citiesArray.push(formControl);
    })
  }

  buildDistancesGroup(): void {
    let formControl: FormControl;
    let distancesArray: FormArray = (<FormArray>(this.myForm.get('distances')));
    this.clearFormArray(distancesArray);
    this.distances.map(s => {
      formControl = new FormControl(false);
      distancesArray.push(formControl);
    })
  }

  submit() {
     console.log('form value=' , this.myForm.value);

    let selectedCities = this.uniqueCities.filter((c, i) => this.myForm.value.cities[i])
                                          .map(c => c.toLowerCase());

    let selectedSkills = this.jobSkills.filter((s, i) => this.myForm.value.skills[i])
                                       .map(s => s.id);

    let selectedDistance = this.myForm.value.distance.distanceRadio;
    if(selectedDistance == null){
      selectedDistance = -1;
    }

    console.log('sending filters', { 'skills': selectedSkills, 'cities': selectedCities, 'distanceIndex': selectedDistance });    
    this._candidatesService.filtersSubject.next({ 'skills': selectedSkills, 'cities': selectedCities, 'distanceIndex': selectedDistance } as Filters);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
}
