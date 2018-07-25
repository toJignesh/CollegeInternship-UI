import { Skill } from "./skill.model";

export interface Filters{
    skills:Array<Skill>;
    cities:Array<string>;
    distanceIndex:number;
}