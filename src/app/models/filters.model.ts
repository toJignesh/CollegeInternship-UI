import { Skill } from "./skill.model";

export interface Filters{
    skills:Array<number>;
    cities:Array<string>;
    distanceIndex:number;
}