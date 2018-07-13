export interface Candidate{
    id:number;
    firstName:string;
    lastName:string;
    middleName:string;
    description:string;
    postalCode:string;
    rankBySkills:number;
    skills: Array<number>;
}